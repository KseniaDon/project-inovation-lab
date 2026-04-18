"""
ТКМ — приём и проверка ответов на Теоретический Квалификационный Модуль.
GET ?action=list — список всех заявок (для администраторов)
GET ?action=get&id=N — получить конкретную заявку
POST ?action=submit — сохранить ответы интерна
POST ?action=review&id=N — выставить баллы и результат
"""
import json
import os
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

    # POST submit — сохранить ответы
    if method == "POST" and action == "submit":
        body = json.loads(event.get("body") or "{}")
        nickname = (body.get("nickname") or "").strip()
        vk_link = (body.get("vk_link") or "").strip()
        department = (body.get("department") or "").strip()
        answers = body.get("answers") or {}

        if not nickname or not vk_link or not department:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все обязательные поля"})}

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

    conn.close()
    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Укажите action"})}
