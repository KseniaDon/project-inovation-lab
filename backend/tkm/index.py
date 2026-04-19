"""
ТКМ — приём и проверка ответов на Теоретический Квалификационный Модуль.
GET ?action=list — список всех заявок (для администраторов)
GET ?action=get&id=N — получить конкретную заявку
POST ?action=submit — сохранить ответы интерна (с проверкой допуска и кода)
POST ?action=review&id=N — выставить баллы и результат
GET ?action=scores — получить макс. баллы
POST ?action=save_scores — сохранить макс. баллы
GET ?action=check_access — проверить допуск по VK ссылке (возвращает attempts_left)
POST ?action=reset_session&nick=X — добавить ник в список на сброс сессии
GET ?action=check_reset&nick=X — проверить, нужно ли сбросить сессию (и снять флаг)
"""
import json
import os
import re
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")

def normalize_vk(link: str) -> str:
    """Извлекает никнейм из VK ссылки или возвращает строку как есть."""
    link = link.strip().lower()
    link = re.sub(r'^(https?://)?(www\.)?(vk\.(ru|com))/(@)?', '', link)
    link = link.rstrip('/')
    return link

def get_tkm_allowed(cur, s: str) -> list:
    """
    Получает список допущенных из site_content.
    Формат записи: {"nick": "...", "attempts": N, "allowed": true/false}
      - attempts — сколько раз уже писал тест (0, 1, 2, 3)
      - allowed  — допущен ли к следующей попытке (true = да)
    Поддерживает старый формат для обратной совместимости.
    """
    cur.execute(f"SELECT value FROM {s}.site_content WHERE key='tkm_allowed'")
    row = cur.fetchone()
    if not row:
        return []
    try:
        data = json.loads(row[0])
        if not isinstance(data, list):
            return []
        result = []
        for item in data:
            if isinstance(item, str):
                # старый формат — просто ник, считаем допущенным с 0 попыток
                result.append({"nick": item.strip().lower(), "attempts": 0, "allowed": True})
            elif isinstance(item, dict) and "nick" in item:
                nick = str(item["nick"]).strip().lower()
                # если старый формат с attempts как "осталось попыток" — конвертируем
                if "allowed" not in item:
                    old_attempts = int(item.get("attempts", 3))
                    # старый: attempts = сколько осталось; новый: attempts = сколько написал
                    used = max(0, 3 - old_attempts)
                    result.append({"nick": nick, "attempts": used, "allowed": old_attempts > 0})
                else:
                    result.append({
                        "nick": nick,
                        "attempts": int(item.get("attempts", 0)),
                        "allowed": bool(item.get("allowed", True)),
                    })
        return result
    except Exception:
        return []

def save_tkm_allowed(cur, conn, s: str, allowed: list):
    """Сохраняет список допущенных в site_content."""
    cur.execute(
        f"INSERT INTO {s}.site_content (key, value) VALUES ('tkm_allowed', %s) "
        f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        (json.dumps(allowed, ensure_ascii=False),)
    )
    conn.commit()

def find_entry(allowed: list, vk_nick: str) -> tuple:
    """Возвращает (index, entry) для никнейма или (None, None)."""
    for i, entry in enumerate(allowed):
        if normalize_vk(entry["nick"]) == vk_nick:
            return i, entry
    return None, None

def get_activation_code(cur, s: str) -> str:
    """Получает код активации из site_content, дефолт '78'."""
    cur.execute(f"SELECT value FROM {s}.site_content WHERE key='tkm_activation_code'")
    row = cur.fetchone()
    if not row:
        return "78"
    try:
        val = json.loads(row[0])
        return str(val).strip()
    except Exception:
        return "78"

def handler(event: dict, context) -> dict:
    """Приём и проверка ответов ТКМ."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    method = event.get("httpMethod", "GET")
    s = get_schema()

    conn = get_conn()
    cur = conn.cursor()

    # POST submit — сохранить ответы (с проверкой допуска)
    if method == "POST" and action == "submit":
        body = json.loads(event.get("body") or "{}")
        nickname = (body.get("nickname") or "").strip()
        vk_link = (body.get("vk_link") or "").strip()
        department = (body.get("department") or "").strip()
        answers = body.get("answers") or {}

        if not vk_link or not department:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все обязательные поля"})}

        # Проверка VK ссылки против списка допущенных
        allowed_list = get_tkm_allowed(cur, s)
        if not allowed_list:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Список допущенных к ТКМ пуст. Обратитесь к куратору."})}
        vk_nick = normalize_vk(vk_link)
        idx, entry = find_entry(allowed_list, vk_nick)
        if entry is None:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Ваша страница ВКонтакте не найдена в списке допущенных к ТКМ. Обратитесь к куратору."})}
        if not entry.get("allowed", True):
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Пересдача ещё не разрешена. Ожидайте решения куратора."})}

        # Увеличиваем счётчик использованных попыток, закрываем допуск
        allowed_list[idx]["attempts"] = entry.get("attempts", 0) + 1
        allowed_list[idx]["allowed"] = False
        save_tkm_allowed(cur, conn, s, allowed_list)

        if not nickname:
            nickname = vk_nick

        cur.execute(
            f"INSERT INTO {s}.tkm_submissions (nickname, vk_link, department, answers) VALUES (%s, %s, %s, %s) RETURNING id",
            (nickname, vk_link, department, json.dumps(answers, ensure_ascii=False))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "id": new_id})}

    # POST review — выставить баллы
    if method == "POST" and action == "review":
        sub_id = qs.get("id")
        body = json.loads(event.get("body") or "{}")
        score = body.get("score")
        max_score = body.get("max_score", 100)
        status = body.get("status", "reviewed")
        reviewer = (body.get("reviewer") or "").strip()
        comment = (body.get("comment") or "").strip()

        cur.execute(
            f"UPDATE {s}.tkm_submissions SET score=%s, max_score=%s, status=%s, reviewer=%s, reviewer_comment=%s, reviewed_at=NOW() WHERE id=%s",
            (score, max_score, status, reviewer, comment, sub_id)
        )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # GET list — список заявок
    if method == "GET" and action == "list":
        status_filter = qs.get("status")
        if status_filter:
            cur.execute(
                f"SELECT id, nickname, vk_link, department, score, max_score, status, reviewer, reviewer_comment, submitted_at, reviewed_at FROM {s}.tkm_submissions WHERE status=%s ORDER BY submitted_at DESC",
                (status_filter,)
            )
        else:
            cur.execute(
                f"SELECT id, nickname, vk_link, department, score, max_score, status, reviewer, reviewer_comment, submitted_at, reviewed_at FROM {s}.tkm_submissions ORDER BY submitted_at DESC"
            )
        rows = cur.fetchall()
        conn.close()
        cols = ["id", "nickname", "vk_link", "department", "score", "max_score", "status", "reviewer", "reviewer_comment", "submitted_at", "reviewed_at"]
        result = []
        for row in rows:
            item = dict(zip(cols, row))
            item["submitted_at"] = item["submitted_at"].isoformat() if item["submitted_at"] else None
            item["reviewed_at"] = item["reviewed_at"].isoformat() if item["reviewed_at"] else None
            result.append(item)
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(result, ensure_ascii=False)}

    # GET get — одна заявка с ответами
    if method == "GET" and action == "get":
        sub_id = qs.get("id")
        cur.execute(
            f"SELECT id, nickname, vk_link, department, answers, score, max_score, status, reviewer, reviewer_comment, submitted_at, reviewed_at FROM {s}.tkm_submissions WHERE id=%s",
            (sub_id,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Не найдено"})}
        cols = ["id", "nickname", "vk_link", "department", "answers", "score", "max_score", "status", "reviewer", "reviewer_comment", "submitted_at", "reviewed_at"]
        item = dict(zip(cols, row))
        item["submitted_at"] = item["submitted_at"].isoformat() if item["submitted_at"] else None
        item["reviewed_at"] = item["reviewed_at"].isoformat() if item["reviewed_at"] else None
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(item, ensure_ascii=False)}

    # GET check_access — проверить допуск по VK ссылке (возвращает attempt_number — какая по счёту попытка будет)
    if method == "GET" and action == "check_access":
        vk_link = (qs.get("vk_link") or "").strip()
        if not vk_link:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Укажите vk_link"})}
        allowed_list = get_tkm_allowed(cur, s)
        conn.close()
        if not allowed_list:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Список допущенных к ТКМ пуст. Обратитесь к куратору."})}
        vk_nick = normalize_vk(vk_link)
        _, entry = find_entry(allowed_list, vk_nick)
        if entry is None:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Ваша страница ВКонтакте не найдена в списке допущенных к ТКМ. Обратитесь к куратору."})}
        if not entry.get("allowed", True):
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Пересдача ещё не разрешена. Ожидайте решения куратора."})}
        attempt_number = entry.get("attempts", 0) + 1  # какая по счёту попытка будет
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "attempt_number": attempt_number})}

    # POST reset_session — добавить ник в список на сброс сессии
    if method == "POST" and action == "reset_session":
        nick = normalize_vk((qs.get("nick") or "").strip())
        if not nick:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Укажите nick"})}
        cur.execute(f"SELECT value FROM {s}.site_content WHERE key='tkm_reset_nicks'")
        row = cur.fetchone()
        try:
            nicks = json.loads(row[0]) if row else []
            if not isinstance(nicks, list):
                nicks = []
        except Exception:
            nicks = []
        if nick not in nicks:
            nicks.append(nick)
        cur.execute(
            f"INSERT INTO {s}.site_content (key, value) VALUES ('tkm_reset_nicks', %s) "
            f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
            (json.dumps(nicks),)
        )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # GET check_reset — проверить сброс и снять флаг если нужно
    if method == "GET" and action == "check_reset":
        nick = normalize_vk((qs.get("nick") or "").strip())
        if not nick:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Укажите nick"})}
        cur.execute(f"SELECT value FROM {s}.site_content WHERE key='tkm_reset_nicks'")
        row = cur.fetchone()
        try:
            nicks = json.loads(row[0]) if row else []
            if not isinstance(nicks, list):
                nicks = []
        except Exception:
            nicks = []
        if nick in nicks:
            nicks = [n for n in nicks if n != nick]
            cur.execute(
                f"INSERT INTO {s}.site_content (key, value) VALUES ('tkm_reset_nicks', %s) "
                f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
                (json.dumps(nicks),)
            )
            conn.commit()
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"reset": True})}
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"reset": False})}

    # POST delete — удалить заявку
    if method == "POST" and action == "delete":
        sub_id = qs.get("id")
        if not sub_id:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Укажите id"})}
        cur.execute(f"DELETE FROM {s}.tkm_submissions WHERE id=%s", (sub_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    # GET scores — загрузить макс. баллы из БД
    if method == "GET" and action == "scores":
        cur.execute(f"SELECT key, max_score FROM {s}.tkm_scores")
        rows = cur.fetchall()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({r[0]: r[1] for r in rows})}

    # POST save_scores — сохранить макс. баллы
    if method == "POST" and action == "save_scores":
        body = json.loads(event.get("body") or "{}")
        scores = body.get("scores", {})
        for key, val in scores.items():
            cur.execute(
                f"INSERT INTO {s}.tkm_scores (key, max_score) VALUES (%s, %s) ON CONFLICT (key) DO UPDATE SET max_score = EXCLUDED.max_score",
                (key, int(val))
            )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Unknown action"})}