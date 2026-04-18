"""
ТКМ — приём и проверка ответов на Теоретический Квалификационный Модуль.
GET ?action=list — список всех заявок (для администраторов)
GET ?action=get&id=N — получить конкретную заявку
POST ?action=submit — сохранить ответы интерна (с проверкой допуска и кода)
POST ?action=review&id=N — выставить баллы и результат
GET ?action=scores — получить макс. баллы
POST ?action=save_scores — сохранить макс. баллы
GET ?action=check_access — проверить допуск по VK ссылке (возвращает attempts_left)
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
    Поддерживает оба формата:
      - старый: ["nick1", "nick2"]  -> конвертирует в новый с attempts=3
      - новый:  [{"nick": "nick1", "attempts": 2}, ...]
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
                result.append({"nick": item.strip().lower(), "attempts": 3})
            elif isinstance(item, dict) and "nick" in item:
                result.append({
                    "nick": str(item["nick"]).strip().lower(),
                    "attempts": int(item.get("attempts", 3)),
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

    # POST submit — сохранить ответы (с проверкой кода, допуска и попыток)
    if method == "POST" and action == "submit":
        body = json.loads(event.get("body") or "{}")
        nickname = (body.get("nickname") or "").strip()
        vk_link = (body.get("vk_link") or "").strip()
        department = (body.get("department") or "").strip()
        answers = body.get("answers") or {}
        activation_code = (body.get("activation_code") or "").strip()

        if not nickname or not vk_link or not department:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все обязательные поля"})}

        # Проверка кода активации
        correct_code = get_activation_code(cur, s)
        if activation_code != correct_code:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Неверный код активации"})}

        # Проверка VK ссылки против списка допущенных
        allowed = get_tkm_allowed(cur, s)
        if not allowed:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Список допущенных к ТКМ пуст. Обратитесь к куратору."})}
        vk_nick = normalize_vk(vk_link)
        idx, entry = find_entry(allowed, vk_nick)
        if entry is None:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Ваша страница ВКонтакте не найдена в списке допущенных к ТКМ. Обратитесь к куратору."})}
        if entry["attempts"] <= 0:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Попытки исчерпаны. Обратитесь к куратору для получения дополнительной попытки."})}

        # Уменьшаем счётчик попыток
        allowed[idx]["attempts"] -= 1
        save_tkm_allowed(cur, conn, s, allowed)

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

    # GET check_access — проверить допуск по VK ссылке (возвращает attempts_left)
    if method == "GET" and action == "check_access":
        vk_link = (qs.get("vk_link") or "").strip()
        if not vk_link:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Укажите vk_link"})}
        allowed = get_tkm_allowed(cur, s)
        conn.close()
        if not allowed:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Список допущенных к ТКМ пуст. Обратитесь к куратору."})}
        vk_nick = normalize_vk(vk_link)
        _, entry = find_entry(allowed, vk_nick)
        if entry is None:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Ваша страница ВКонтакте не найдена в списке допущенных к ТКМ. Обратитесь к куратору."})}
        if entry["attempts"] <= 0:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Попытки исчерпаны. Обратитесь к куратору для получения дополнительной попытки."})}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "attempts_left": entry["attempts"]})}

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
