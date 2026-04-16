"""
Авторизация администраторов по никнейму ВК + пароль.
Доступы хранятся в БД. Пароли — SHA-256 хэш.
"""
import json
import os
import hmac
import hashlib
import base64
import time
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

def resp(status, body):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(body, ensure_ascii=False)}

def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode("utf-8")).hexdigest()

def make_token(nickname: str, role: str) -> str:
    secret = os.environ.get("ADMIN_SECRET_KEY", "fallback-secret")
    payload = base64.b64encode(
        json.dumps({"nick": nickname, "role": role, "t": int(time.time())}).encode()
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

def get_current_user(event):
    token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "")
    return verify_token(token)

# Иерархия ролей: чем меньше индекс — тем выше роль
ROLE_HIERARCHY = ["super_admin", "head_admin", "admin", "moderator", "editor"]
VALID_ROLES = set(ROLE_HIERARCHY)

# Маппинг старых ролей на новые
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

def clean_nick(raw: str) -> str:
    raw = raw.strip().lower()
    for prefix in ["https://vk.ru/", "https://vk.com/", "http://vk.ru/", "http://vk.com/", "vk.ru/", "vk.com/", "@"]:
        if raw.startswith(prefix):
            raw = raw[len(prefix):]
    return raw.strip("/").strip()

def handler(event: dict, context) -> dict:
    """Авторизация по никнейму ВК + пароль, управление доступами и данными сайта."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    # ── POST check_nick — проверка никнейма, есть ли в БД и есть ли пароль ───
    if action == "check_nick":
        body = json.loads(event.get("body") or "{}")
        nick = clean_nick(body.get("nickname") or "")
        if not nick:
            return resp(400, {"error": "Введите никнейм"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT role, password_hash FROM {s}.access_list WHERE nickname = %s", (nick,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return resp(403, {"error": "denied"})
        role, pw_hash = row
        has_password = pw_hash is not None
        return resp(200, {"role": role, "has_password": has_password})

    # ── POST login — вход с паролем ───────────────────────────────────────────
    if action == "login":
        body = json.loads(event.get("body") or "{}")
        nick = clean_nick(body.get("nickname") or "")
        password = (body.get("password") or "").strip()
        if not nick or not password:
            return resp(400, {"error": "Введите никнейм и пароль"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT role, password_hash FROM {s}.access_list WHERE nickname = %s", (nick,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return resp(403, {"error": "denied"})
        role, pw_hash = row
        if pw_hash is None:
            return resp(400, {"error": "no_password", "message": "Пароль ещё не задан"})
        if not hmac.compare_digest(hash_pw(password), pw_hash):
            return resp(401, {"error": "wrong_password", "message": "Неверный пароль"})
        token = make_token(nick, role)
        return resp(200, {"token": token, "nickname": nick, "role": role})

    # ── POST set_password — установить/сменить пароль (только свой) ──────────
    if action == "set_password":
        body = json.loads(event.get("body") or "{}")
        nick = clean_nick(body.get("nickname") or "")
        password = (body.get("password") or "").strip()
        if not nick or not password:
            return resp(400, {"error": "Не все поля заполнены"})
        if len(password) < 6:
            return resp(400, {"error": "Пароль должен быть не менее 6 символов"})
        # Для смены пароля нужен токен (кроме первичной установки)
        user = get_current_user(event)
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT role, password_hash FROM {s}.access_list WHERE nickname = %s", (nick,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return resp(403, {"error": "Нет доступа"})
        _, existing_hash = row
        if existing_hash is not None:
            if not user or user.get("nick") != nick:
                conn.close()
                return resp(403, {"error": "Можно менять только свой пароль"})
        cur.execute(f"UPDATE {s}.access_list SET password_hash = %s WHERE nickname = %s", (hash_pw(password), nick))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── GET me ────────────────────────────────────────────────────────────────
    if action == "me":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        nick = user.get("nick", "")
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT role FROM {s}.access_list WHERE nickname = %s", (nick,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return resp(403, {"error": "Нет доступа"})
        return resp(200, {"nickname": nick, "role": row[0]})

    # ── GET access_list — список доступов (все авторизованные) ───────────────
    if action == "access_list":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT nickname, role, created_at, created_by, href, hospital_role FROM {s}.access_list ORDER BY created_at")
        rows = cur.fetchall()
        conn.close()
        users = [{"nickname": r[0], "role": r[1], "created_at": str(r[2]), "created_by": r[3], "href": r[4] or "", "hospital_role": r[5] or ""} for r in rows]
        return resp(200, {"users": users})

    # ── POST add_access — добавить пользователя ───────────────────────────────
    if action == "add_access":
        user = get_current_user(event)
        if not user or not can_add_users(user.get("role", "")):
            return resp(403, {"error": "Недостаточно прав для добавления пользователей"})
        body = json.loads(event.get("body") or "{}")
        new_nick = clean_nick(body.get("nickname") or "")
        role = body.get("role", "deputy")
        if not new_nick:
            return resp(400, {"error": "Введите никнейм"})
        if role not in VALID_ROLES:
            role = "deputy"
        if not can_manage(user.get("role", ""), role):
            return resp(403, {"error": "Нельзя выдать роль выше или равную своей"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT id FROM {s}.access_list WHERE nickname = %s", (new_nick,))
        if cur.fetchone():
            conn.close()
            return resp(409, {"error": "Пользователь уже есть в списке"})
        cur.execute(
            f"INSERT INTO {s}.access_list (nickname, role, created_by) VALUES (%s, %s, %s)",
            (new_nick, role, user.get("nick"))
        )
        cur.execute(
            f"INSERT INTO {s}.audit_log (actor, action, details) VALUES (%s, %s, %s)",
            (user.get("nick", ""), "add_access", json.dumps({"nickname": new_nick, "role": role}, ensure_ascii=False))
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── POST remove_access — удалить пользователя ─────────────────────────────
    if action == "remove_access":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        body = json.loads(event.get("body") or "{}")
        target = clean_nick(body.get("nickname") or "")
        if not target:
            return resp(400, {"error": "Введите никнейм"})
        if target == user.get("nick"):
            return resp(400, {"error": "Нельзя удалить самого себя"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT role FROM {s}.access_list WHERE nickname = %s", (target,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return resp(404, {"error": "Пользователь не найден"})
        target_role = row[0]
        if not can_manage(user.get("role", ""), target_role):
            conn.close()
            return resp(403, {"error": "Недостаточно прав для удаления этого пользователя"})
        cur.execute(f"DELETE FROM {s}.access_list WHERE nickname = %s", (target,))
        cur.execute(
            f"INSERT INTO {s}.audit_log (actor, action, details) VALUES (%s, %s, %s)",
            (user.get("nick", ""), "remove_access", json.dumps({"nickname": target, "role": target_role}, ensure_ascii=False))
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── POST update_access — редактировать роль/ссылку пользователя ──────────
    if action == "update_access":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        body = json.loads(event.get("body") or "{}")
        target = clean_nick(body.get("nickname") or "")
        new_role = body.get("role")
        new_href = body.get("href")
        new_hospital = body.get("hospital_role")
        if not target:
            return resp(400, {"error": "Введите никнейм"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT role FROM {s}.access_list WHERE nickname = %s", (target,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return resp(404, {"error": "Пользователь не найден"})
        target_role = row[0]
        actor_role = user.get("role", "")
        # Суперадмин может редактировать себя и всех, остальные — только ниже по иерархии
        if target != user.get("nick") and not can_manage(actor_role, target_role):
            conn.close()
            return resp(403, {"error": "Недостаточно прав"})
        if new_role and new_role != target_role:
            if new_role not in VALID_ROLES:
                conn.close()
                return resp(400, {"error": "Неверная роль"})
            if not can_manage(actor_role, new_role):
                conn.close()
                return resp(403, {"error": "Нельзя назначить роль выше или равную своей"})
            cur.execute(f"UPDATE {s}.access_list SET role = %s WHERE nickname = %s", (new_role, target))
        if new_href is not None:
            cur.execute(f"UPDATE {s}.access_list SET href = %s WHERE nickname = %s", (new_href, target))
        if new_hospital is not None:
            cur.execute(f"UPDATE {s}.access_list SET hospital_role = %s WHERE nickname = %s", (new_hospital, target))
        cur.execute(
            f"INSERT INTO {s}.audit_log (actor, action, details) VALUES (%s, %s, %s)",
            (user.get("nick", ""), "edit_access", json.dumps({"nickname": target}, ensure_ascii=False))
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # ── GET site_data — публичный, без авторизации ────────────────────────────
    if action == "site_data":
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(f"SELECT key, value FROM {s}.site_content")
        rows = cur.fetchall()
        conn.close()
        data = {r[0]: json.loads(r[1]) for r in rows}
        return resp(200, {"data": data})

    # ── POST save_site_data ───────────────────────────────────────────────────
    if action == "save_site_data":
        user = get_current_user(event)
        if not user:
            return resp(401, {"error": "Unauthorized"})
        body = json.loads(event.get("body") or "{}")
        key = body.get("key")
        value = body.get("value")
        if not key:
            return resp(400, {"error": "Нет key"})
        conn = get_conn()
        cur = conn.cursor()
        s = get_schema()
        cur.execute(
            f"INSERT INTO {s}.site_content (key, value, updated_by) VALUES (%s, %s, %s) "
            f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()",
            (key, json.dumps(value, ensure_ascii=False), user.get("nick", ""))
        )
        cur.execute(
            f"INSERT INTO {s}.audit_log (actor, action, details) VALUES (%s, %s, %s)",
            (user.get("nick", ""), "edit_content", json.dumps({"key": key}, ensure_ascii=False))
        )
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
        # Авто-очистка записей старше 30 дней
        cur.execute(f"DELETE FROM {s}.audit_log WHERE created_at < NOW() - INTERVAL '30 days'")
        cur.execute(f"SELECT actor, action, details, created_at FROM {s}.audit_log ORDER BY created_at DESC LIMIT 50")
        rows = cur.fetchall()
        conn.commit()
        conn.close()
        logs = [{"actor": r[0], "action": r[1], "details": json.loads(r[2]) if r[2] else {}, "created_at": str(r[3])} for r in rows]
        return resp(200, {"logs": logs})

    return resp(400, {"error": "Укажите action"})