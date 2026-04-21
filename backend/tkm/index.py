"""
ТКМ — приём и проверка ответов на Теоретический Квалификационный Модуль.
GET ?action=list — список всех заявок (для администраторов)
GET ?action=get&id=N — получить конкретную заявку
POST ?action=submit — сохранить ответы интерна (с проверкой допуска и кода)
POST ?action=review&id=N — выставить баллы и результат
GET ?action=scores — получить макс. баллы
POST ?action=save_scores — сохранить макс. баллы
GET ?action=check_access — проверить допуск по VK ссылке (возвращает attempts_left)
GET ?action=get_activation_code — получить текущий код активации (автообновление раз в 30 мин)
POST ?action=rotate_activation_code — принудительно сгенерировать новый код
POST ?action=reset_session&nick=X — добавить ник в список на сброс сессии
GET ?action=check_reset&nick=X — проверить, нужно ли сбросить сессию (и снять флаг)
"""
import json
import os
import re
import random
import string
import time
import psycopg2
import urllib.request
import urllib.parse

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

GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeDs93QWPwYQQGCxXti5Z_CnsHolSSDq_82QTRimQZhhCVQ6Q/formResponse"

# Маппинг ключей ответов → entry ID Google Forms
GOOGLE_FORM_ENTRIES = {
    # Мета-данные
    "nickname":        "entry.2014090129",
    "vk_link":         "entry.1267978783",
    "department":      "entry.672956656",
    "activation_code": "entry.933578577",
    # Раздел 1 — вопрос 2.1 (сколько отделений — radio)
    "2.1": "entry.2142688093",
    "2.1 Сколько отделений в ЦГБ-Н согласно внутреннему уставу?": "entry.2142688093",
    "Сначала немного базового — сколько отделений в ЦГБ-Н существует согласно внутреннему уставу?": "entry.2142688093",
    # Раздел 1 — вопрос 2.2 (чем занимается — radio, entry ID разные для каждого отделения)
    "2.2": "entry.869238404",
    "2.2 Чем занимается ОИК?": "entry.869238404",
    "Чем занимается ОИК?": "entry.869238404",
    "2.2 Чем занимается СОП?": "entry.1788518830",
    "Чем занимается СОП?": "entry.1788518830",
    "2.2 Чем занимается ОДС?": "entry.446046504",
    "Чем занимается ОДС?": "entry.446046504",
    # Раздел 1 — вопрос 2.3 (этаж — radio, entry ID разные для каждого отделения)
    "2.3": "entry.2096928011",
    "2.3 На каком этаже проводятся услуги НИИ Эпидемиологии?": "entry.2096928011",
    "На каком этаже проводятся услуги НИИ Эпидемиологии?": "entry.2096928011",
    "2.3 На каком этаже проводятся услуги Стоматологической поликлиники «Дентист»?": "entry.1902761618",
    "На каком этаже проводятся услуги Стоматологической поликлиники «Дентист»?": "entry.1902761618",
    "2.3 На каком этаже проводятся услуги Травматолого-ортопедического центра?": "entry.1801011208",
    "На каком этаже проводятся услуги Травматолого-ортопедического центра?": "entry.1801011208",
    # Раздел 2 — Устав (radio)
    "3.4 На какое максимальное количество времени сотрудникам разрешено брать перерыв?": "entry.1020761163",
    "3.5 Выберите продолжительность рабочего дня с понедельника по пятницу:": "entry.799505679",
    "3.6 Можно ли выезжать на пост/патруль используя РАСМП?": "entry.598171428",
    "3.7 Какое наказание получит сотрудник, если тот будет танцевать на смене?": "entry.1785053273",
    "3.8 Можно ли игнорировать строй, который объявили в RP рацию (/г)?": "entry.97429106",
    "3.9 Следуя на место вызова, вы попали в ДТП не по вашей вине. Каковы будут ваши действия?": "entry.825671497",
    # Раздел 2 — открытые вопросы
    "3.10": "entry.1519962913",
    "3.11": "entry.607998682",
    "3.12": "entry.1217147382",
    "3.13": "entry.1653000397",
    "3.14": "entry.98581650",
    # Раздел 2 — radio2
    "3.15 Разрешено ли нарушение ПДД при выезде на вызов с СГУ?": "entry.898496613",
    # Раздел 2 — multi (3.16)
    "3.16": "entry.1490443555",
    # Раздел 2 — match (3.17)
    "3.17_Выходить на перерыв с 14:00 до 15:00": "entry.150806704",
    "3.17_Лечение с обозначением цены препарата выше 500 рублей": "entry.936292441",
    "3.17_Осмотр пациента": "entry.1840501733",
    "3.17_Использование рабочего транспорта в личных целях": "entry.1374936013",
    # Раздел 3 — RP (radio)
    "3.18 Правильным ли будет высказывание: «Провинция - субъект российской Федерации»?": "entry.129347029",
    "3.19 Кем является Главный администратор сервера #1 с точки зрения RP?": "entry.784004263",
    "3.20 Кто такой Владимир Владимирович Путин с точки зрения RP?": "entry.1254094076",
    # Раздел 3 — multi (3.21)
    "3.21": "entry.21445567",
    # Раздел 3 — radio2 (3.22)
    "3.22 Что такое свод ВПС?": "entry.715727214",
    # Раздел 3 — styled multi (3.23–3.27)
    "3.23": "entry.1420961229",
    "3.24": "entry.91627977",
    "3.25": "entry.1890636426",
    "3.26": "entry.1985101684",
    "3.27": "entry.829352790",
    # Раздел 3 — открытый (3.28)
    "3.28": "entry.1432533703",
    # Раздел 4 — Препараты
    "4.29": "entry.1538310155",
    "4.30": "entry.290285456",
    "4.31": "entry.1006440069",
    # Раздел 5 — Медицина
    "5.32": "entry.992668427",
    "5.33": "entry.929972831",
    "5.34": "entry.89498968",
    "5.35": "entry.1018449492",
    "5.36": "entry.294195177",
    "5.37": "entry.673165940",
    "5.38": "entry.1366935849",
}

def send_to_google_forms(nickname: str, vk_link: str, department: str, activation_code: str, answers: dict):
    """Дублирует ответы теста в Google Forms (тихо, без исключений)."""
    print(f"[Google Forms] START send, nick={nickname}, dept={department}, answers_count={len(answers)}")
    try:
        form_data = {}
        # Мета-данные
        form_data["entry.2014090129"] = nickname
        form_data["entry.1267978783"] = vk_link
        dept_map = {
            "ОИК": "ОИК (Отделение Инфекционного Контроля)",
            "СОП": "СОП (Стоматологическое Отделение Поликлиники)",
            "ОДС": "ОДС (Отделение Дневного Стационара)",
        }
        form_data["entry.672956656"] = dept_map.get(department, department)
        form_data["entry.933578577"] = activation_code

        # Обработка 3.17 — matching, приходит как JSON-строка {"label": "значение"}
        match_17 = answers.get("3.17")
        if match_17:
            try:
                parsed = json.loads(match_17) if isinstance(match_17, str) else match_17
                print(f"[Google Forms] 3.17 parsed={parsed}")
                for label, val in parsed.items():
                    map_key = f"3.17_{label}"
                    eid = GOOGLE_FORM_ENTRIES.get(map_key)
                    print(f"[Google Forms] 3.17 label={label!r} eid={eid}")
                    if eid:
                        form_data[eid] = str(val)
            except Exception as e:
                print(f"[Google Forms] 3.17 parse error: {e}, raw={match_17!r}")

        for key, value in answers.items():
            if key == "3.17":
                continue
            entry_id = GOOGLE_FORM_ENTRIES.get(key)
            if not entry_id:
                continue
            # Если значение — JSON-строка массива, распарсим её
            if isinstance(value, str):
                try:
                    parsed = json.loads(value)
                    if isinstance(parsed, list):
                        value = parsed
                except Exception:
                    pass
            if isinstance(value, list):
                # Множественный выбор — несколько значений с одним entry ID
                for v in value:
                    if entry_id not in form_data:
                        form_data[entry_id] = []
                    if isinstance(form_data[entry_id], list):
                        form_data[entry_id].append(str(v))
                    else:
                        form_data[entry_id] = [form_data[entry_id], str(v)]
            else:
                form_data[entry_id] = str(value)

        # Строим тело запроса — повторяющиеся ключи для multi-select
        parts = []
        for k, v in form_data.items():
            if isinstance(v, list):
                for item in v:
                    parts.append(urllib.parse.urlencode({k: item}))
            else:
                parts.append(urllib.parse.urlencode({k: v}))
        encoded = "&".join(parts).encode("utf-8")

        req = urllib.request.Request(
            GOOGLE_FORM_URL,
            data=encoded,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        resp = urllib.request.urlopen(req, timeout=10)
        print(f"[Google Forms] status={resp.status}, nick={nickname}, dept={department}")
        print(f"[Google Forms] answer_keys={list(answers.keys())}")
        print(f"[Google Forms] unmatched={[k for k in answers if not GOOGLE_FORM_ENTRIES.get(k)]}")
    except Exception as e:
        print(f"[Google Forms] ERROR: {e}, nick={nickname}, dept={department}")

CODE_ROTATE_SECONDS = 900  # 15 минут

def generate_code() -> str:
    """Генерирует рандомный 4-значный код из цифр."""
    return "".join(random.choices(string.digits, k=4))

def get_activation_code_entry(cur, s: str) -> dict:
    """Возвращает {'code': '...', 'generated_at': timestamp} из site_content."""
    cur.execute(f"SELECT value FROM {s}.site_content WHERE key='tkm_activation_code'")
    row = cur.fetchone()
    if not row:
        return {}
    try:
        val = json.loads(row[0])
        if isinstance(val, dict) and "code" in val:
            return val
        # Старый формат — просто строка
        return {"code": str(val).strip(), "generated_at": 0}
    except Exception:
        return {}

def save_activation_code_entry(cur, conn, s: str, entry: dict):
    cur.execute(
        f"INSERT INTO {s}.site_content (key, value) VALUES ('tkm_activation_code', %s) "
        f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        (json.dumps(entry, ensure_ascii=False),)
    )
    conn.commit()

def get_or_rotate_activation_code(cur, conn, s: str, force: bool = False) -> dict:
    """
    Возвращает текущий код. Если прошло >= 15 мин или force=True — генерирует новый.
    Сохраняет предыдущий код (prev_code) для валидации тестов, начатых в предыдущем периоде.
    Возвращает {'code': '...', 'generated_at': timestamp, 'expires_at': timestamp}
    """
    entry = get_activation_code_entry(cur, s)
    now = int(time.time())
    generated_at = entry.get("generated_at", 0)
    code = entry.get("code", "")
    if force or not code or (now - generated_at) >= CODE_ROTATE_SECONDS:
        new_entry = {
            "code": generate_code(),
            "generated_at": now,
            "prev_code": code,  # сохраняем старый код
        }
        save_activation_code_entry(cur, conn, s, new_entry)
        code = new_entry["code"]
        generated_at = now
    expires_at = generated_at + CODE_ROTATE_SECONDS
    return {"code": code, "generated_at": generated_at, "expires_at": expires_at}

def get_activation_code(cur, s: str) -> str:
    """Получает текущий код активации (строка)."""
    entry = get_activation_code_entry(cur, s)
    return entry.get("code", "")

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

        activation_code_input = (body.get("activation_code") or "").strip()

        if not vk_link or not department:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все обязательные поля"})}

        # Проверка кода активации
        if not activation_code_input:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Введите код активации, полученный от куратора."})}
        current_entry = get_activation_code_entry(cur, s)
        current_code = current_entry.get("code", "")
        prev_code = current_entry.get("prev_code", "")
        valid_codes = {c for c in [current_code, prev_code] if c}
        if not valid_codes or activation_code_input not in valid_codes:
            conn.close()
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Неверный код активации. Уточните код у куратора."})}

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
        send_to_google_forms(nickname, vk_link, department, activation_code_input, answers)
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
        manual_scores = body.get("manual_scores") or {}

        cur.execute(
            f"UPDATE {s}.tkm_submissions SET score=%s, max_score=%s, status=%s, reviewer=%s, reviewer_comment=%s, reviewed_at=NOW(), manual_scores=%s WHERE id=%s",
            (score, max_score, status, reviewer, comment, json.dumps(manual_scores, ensure_ascii=False), sub_id)
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
            f"SELECT id, nickname, vk_link, department, answers, score, max_score, status, reviewer, reviewer_comment, submitted_at, reviewed_at, manual_scores FROM {s}.tkm_submissions WHERE id=%s",
            (sub_id,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Не найдено"})}
        cols = ["id", "nickname", "vk_link", "department", "answers", "score", "max_score", "status", "reviewer", "reviewer_comment", "submitted_at", "reviewed_at", "manual_scores"]
        item = dict(zip(cols, row))
        item["submitted_at"] = item["submitted_at"].isoformat() if item["submitted_at"] else None
        item["reviewed_at"] = item["reviewed_at"].isoformat() if item["reviewed_at"] else None
        if not item.get("manual_scores"):
            item["manual_scores"] = {}
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

    # GET get_activation_code — получить текущий код (автообновление раз в 30 мин)
    if method == "GET" and action == "get_activation_code":
        entry = get_or_rotate_activation_code(cur, conn, s, force=False)
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(entry)}

    # POST rotate_activation_code — принудительно сгенерировать новый код
    if method == "POST" and action == "rotate_activation_code":
        entry = get_or_rotate_activation_code(cur, conn, s, force=True)
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(entry)}

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

    # GET get_questions — получить кастомные вопросы из БД
    if method == "GET" and action == "get_questions":
        cur.execute(f"SELECT value FROM {s}.site_content WHERE key='tkm_custom_questions'")
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({})}
        try:
            data = json.loads(row[0])
        except Exception:
            data = {}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False)}

    # POST save_questions — сохранить кастомные вопросы
    if method == "POST" and action == "save_questions":
        body = json.loads(event.get("body") or "{}")
        questions = body.get("questions", {})
        cur.execute(
            f"INSERT INTO {s}.site_content (key, value) VALUES ('tkm_custom_questions', %s) "
            f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
            (json.dumps(questions, ensure_ascii=False),)
        )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Unknown action"})}