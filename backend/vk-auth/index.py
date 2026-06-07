"""
Авторизация администраторов через VK ID OAuth.
Проверяет vk_id пользователя по таблице access_list.
Действия: vk_callback, me, access_list, add_access, remove_access, update_access,
          site_data, save_site_data, audit_log
"""
import json
import os
import hmac
import hashlib
import base64
import time
import urllib.request
import urllib.parse
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

VK_APP_ID = 54606591
VK_REDIRECT_URL = "https://mz-cgbn-oi.ru/admin/login"

def resp(status, body):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(body, ensure_ascii=False)}

def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def make_token(vk_id: int, nickname: str, role: str) -> str:
    secret = os.environ.get("ADMIN_SECRET_KEY", "fallback-secret")
    payload = base64.b64encode(
        json.dumps({"vk_id": vk_id, "nick": nickname, "role": role, "t": int(time.time())}).encode()
    ).decode()
    sig = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{sig}"

def verify_token(token: str):
    try:
        payload, sig = token.rsplit(".", 1)
        secret = os.environ.get("ADMIN_SECRET_KEY", "fallback-secret")
        expected = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        data = json.loads(base64.b64decode(payload).decode())
        if time.time() - data["t"] > 86400 * 30:
            return None
        return data
    except Exception:
        return None

def _header(headers: dict, name: str) -> str:
    if not headers:
        return ""
    want = name.lower()
    for key, val in headers.items():
        if key.lower() == want:
            return (val or "").strip()
    return ""

def get_current_user(event):
    token = _header(event.get("headers") or {}, "X-Authorization").replace("Bearer ", "").strip()
    return verify_token(token)

ROLE_HIERARCHY = ["super_admin", "head_admin", "admin", "moderator", "editor"]
VALID_ROLES = set(ROLE_HIERARCHY)

ROLE_COMPAT = {
    "curator": "super_admin", "head_doctor": "head_admin",
    "curator_oi": "admin", "ward_head": "moderator", "deputy": "editor",
}

def normalize_role(role: str) -> str:
    return ROLE_COMPAT.get(role, role) if role not in VALID_ROLES else role

def role_rank(role: str) -> int:
    role = normalize_role(role)
    try:
        return ROLE_HIERARCHY.index(role)
    except ValueError:
        return 999

def can_manage(actor_role: str, target_role: str) -> bool:
    return role_rank(actor_role) < role_rank(target_role)

def can_add_users(role: str) -> bool:
    return normalize_role(role) in ("super_admin", "head_admin", "admin", "moderator")

def extract_vk_id_from_url(url: str):
    """Извлекает числовой vk_id из ссылок типа vk.com/id132273284 или id132273284."""
    url = url.strip().lower()
    for prefix in ["https://vk.com/", "https://vk.ru/", "http://vk.com/", "http://vk.ru/", "vk.com/", "vk.ru/", "@"]:
        if url.startswith(prefix):
            url = url[len(prefix):]
    url = url.strip("/").strip()
    if url.startswith("id") and url[2:].isdigit():
        return int(url[2:])
    return None

def clean_nick(raw: str) -> str:
    raw = raw.strip().lower()
    for prefix in ["https://vk.ru/", "https://vk.com/", "http://vk.ru/", "http://vk.com/", "vk.ru/", "vk.com/", "@"]:
        if raw.startswith(prefix):
            raw = raw[len(prefix):]
    return raw.strip("/").strip()

def pg_json_cell(val):
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return val
    if isinstance(val, str):
        if not val.strip():
            return None
        try:
            return json.loads(val)
        except json.JSONDecodeError:
            return None
    return None

def parse_jsonb_details(val):
    v = pg_json_cell(val)
    if v is None:
        return {}
    if isinstance(v, dict):
        return v
    if isinstance(v, list):
        return {"items": v}
    return {}

def audit(conn, actor: str, action: str, details: dict):
    s = get_schema()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {s}.audit_log (actor, action, details) VALUES (%s, %s, %s)",
        (actor, action, json.dumps(details, ensure_ascii=False))
    )

def handler(event: dict, context) -> dict:
    """Авторизация через VK ID, управление доступами и данными сайта."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    # ── POST vk_callback — SDK сам обменял code, мы получаем access_token ────
    if action == "vk_callback":
        body = json.loads(event.get("body") or "{}")
        access_token = (body.get("access_token") or "").strip()

        if not access_token:
            return resp(400, {"error": "Нет access_token"})

        # Получаем информацию о пользователе по токену
        user_info_req = urllib.request.Request(
            "https://id.vk.com/oauth2/user_info",
            data=urllib.parse.urlencode({"access_token": access_token, "client_id": str(VK_APP_ID)}).encode(),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(user_info_req, timeout=10) as r:
                user_data = json.loads(r.read().decode())
        except Exception as e:
            return resp(502, {"error": f"Ошибка получения данных пользователя: {str(e)}"})

        user = user_data.get("user", {})
        vk_id = user.get("user_id") or user.get("id")
        if not vk_id:
            return resp(401, {"error": "Не удалось получить VK ID"})

        vk_id = int(vk_id)

        # Проверяем доступ по vk_id
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(
            f"SELECT nickname, role FROM {s}.access_list WHERE vk_id = %s",
            (vk_id,)
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return resp(403, {"error": "denied", "vk_id": vk_id})

        nickname, role = row
        token = make_token(vk_id, nickname, role)
        return resp(200, {"token": token, "nickname": nickname, "role": role, "vk_id": vk_id})

    # ── GET me ────────────────────────────────────────────────────────────────
    if action == "me":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        nick = user.get("nick", "")
        vk_id = user.get("vk_id")
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        if vk_id:
            cur.execute(f"SELECT nickname, role FROM {s}.access_list WHERE vk_id = %s", (vk_id,))
        else:
            cur.execute(f"SELECT nickname, role FROM {s}.access_list WHERE nickname = %s", (nick,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return resp(401, {"error": "Unauthorized"})
        return resp(200, {"nickname": row[0], "role": row[1]})

    # ── GET access_list — список доступов ────────────────────────────────────
    if action == "access_list":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(
            f"SELECT nickname, role, created_at, created_by, href, hospital_role, vk_id, is_permanent, display_name "
            f"FROM {s}.access_list ORDER BY created_at"
        )
        rows = cur.fetchall()
        conn.close()
        users = []
        for r in rows:
            users.append({
                "nickname": r[0], "role": r[1],
                "created_at": r[2].isoformat() if r[2] else None,
                "created_by": r[3], "href": r[4] or "",
                "hospital_role": r[5] or "",
                "vk_id": r[6], "is_permanent": r[7],
                "display_name": r[8] or "",
            })
        return resp(200, {"users": users})

    # ── POST add_access — добавить пользователя по ссылке VK ────────────────
    if action == "add_access":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        actor_role = normalize_role(user.get("role", ""))
        if not can_add_users(actor_role):
            return resp(403, {"error": "Нет прав на добавление"})
        body = json.loads(event.get("body") or "{}")
        vk_url = (body.get("vk_url") or "").strip()
        role = normalize_role((body.get("role") or "editor").strip())
        hospital_role = (body.get("hospital_role") or "").strip()

        if not vk_url:
            return resp(400, {"error": "Укажите ссылку ВКонтакте"})
        if role not in VALID_ROLES:
            return resp(400, {"error": "Неверная роль"})
        if not can_manage(actor_role, role):
            return resp(403, {"error": "Нельзя назначить роль выше своей"})

        # Извлекаем vk_id и nickname из ссылки
        vk_id = extract_vk_id_from_url(vk_url)
        nickname = clean_nick(vk_url)
        href = f"https://vk.com/{nickname}"

        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()

        # Проверяем дубликат
        if vk_id:
            cur.execute(f"SELECT id FROM {s}.access_list WHERE vk_id = %s", (vk_id,))
            if cur.fetchone():
                conn.close()
                return resp(409, {"error": "Пользователь уже есть в списке"})
        cur.execute(f"SELECT id FROM {s}.access_list WHERE nickname = %s", (nickname,))
        if cur.fetchone():
            conn.close()
            return resp(409, {"error": "Пользователь уже есть в списке"})

        cur.execute(
            f"INSERT INTO {s}.access_list (nickname, role, created_by, href, hospital_role, vk_id) "
            f"VALUES (%s, %s, %s, %s, %s, %s)",
            (nickname, role, user.get("nick"), href, hospital_role, vk_id)
        )
        audit(conn, user.get("nick", ""), "add_access", {"nickname": nickname, "vk_id": vk_id, "role": role})
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── POST remove_access ────────────────────────────────────────────────────
    if action == "remove_access":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        body = json.loads(event.get("body") or "{}")
        target_nick = (body.get("nickname") or "").strip().lower()
        if not target_nick:
            return resp(400, {"error": "Не указан никнейм"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT role, is_permanent FROM {s}.access_list WHERE nickname = %s", (target_nick,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return resp(404, {"error": "Пользователь не найден"})
        target_role, is_permanent = row
        if is_permanent:
            conn.close()
            return resp(403, {"error": "Нельзя удалить постоянного администратора"})
        actor_role = normalize_role(user.get("role", ""))
        if not can_manage(actor_role, normalize_role(target_role)):
            conn.close()
            return resp(403, {"error": "Недостаточно прав"})
        cur.execute(f"DELETE FROM {s}.access_list WHERE nickname = %s", (target_nick,))
        audit(conn, user.get("nick", ""), "remove_access", {"nickname": target_nick})
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── POST update_access ────────────────────────────────────────────────────
    if action == "update_access":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        body = json.loads(event.get("body") or "{}")
        target_nick = (body.get("nickname") or "").strip().lower()
        if not target_nick:
            return resp(400, {"error": "Не указан никнейм"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT role FROM {s}.access_list WHERE nickname = %s", (target_nick,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return resp(404, {"error": "Пользователь не найден"})
        old_role = row[0]
        actor_role = normalize_role(user.get("role", ""))
        new_role = normalize_role((body.get("role") or old_role).strip())
        display_name = body.get("display_name")
        hospital_role = body.get("hospital_role")
        is_self = user.get("nick", "").lower() == target_nick
        if not is_self and not can_manage(actor_role, normalize_role(old_role)):
            conn.close()
            return resp(403, {"error": "Недостаточно прав"})
        fields, vals = [], []
        if new_role and new_role != old_role:
            if not can_manage(actor_role, new_role):
                conn.close()
                return resp(403, {"error": "Нельзя назначить роль выше своей"})
            fields.append("role = %s"); vals.append(new_role)
        if display_name is not None:
            fields.append("display_name = %s"); vals.append(display_name)
        if hospital_role is not None:
            fields.append("hospital_role = %s"); vals.append(hospital_role)
        if fields:
            vals.append(target_nick)
            cur.execute(f"UPDATE {s}.access_list SET {', '.join(fields)} WHERE nickname = %s", vals)
            audit(conn, user.get("nick", ""), "edit_access",
                  {"nickname": target_nick, "old_role": old_role, "new_role": new_role,
                   "hospital_role": hospital_role})
            conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── GET site_data ─────────────────────────────────────────────────────────
    if action == "site_data":
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT key, value FROM {s}.site_content")
        rows = cur.fetchall()
        conn.close()
        result = {}
        for key, val in rows:
            parsed = pg_json_cell(val)
            result[key] = parsed if parsed is not None else val
        return resp(200, result)

    # ── POST save_site_data ───────────────────────────────────────────────────
    if action == "save_site_data":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        body = json.loads(event.get("body") or "{}")
        key = (body.get("key") or "").strip()
        value = body.get("value")
        if not key or value is None:
            return resp(400, {"error": "Укажите key и value"})
        val_str = json.dumps(value, ensure_ascii=False) if not isinstance(value, str) else value
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(
            f"INSERT INTO {s}.site_content (key, value, updated_by) VALUES (%s, %s, %s) "
            f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()",
            (key, val_str, user.get("nick", ""))
        )
        audit(conn, user.get("nick", ""), "edit_content", {"key": key})
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── GET audit_log ─────────────────────────────────────────────────────────
    if action == "audit_log":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(
            f"SELECT actor, action, details, created_at FROM {s}.audit_log "
            f"ORDER BY created_at DESC LIMIT 50"
        )
        rows = cur.fetchall()
        conn.close()
        logs = [{"actor": r[0], "action": r[1], "details": parse_jsonb_details(r[2]),
                 "created_at": r[3].isoformat() if r[3] else None} for r in rows]
        return resp(200, {"logs": logs})

    return resp(400, {"error": "Неизвестное действие"})