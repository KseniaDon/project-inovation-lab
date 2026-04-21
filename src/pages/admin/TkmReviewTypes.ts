import {
  TKM_QUESTIONS,
  TKM_SECTION3,
  TKM_SECTION3_OPEN,
  TKM_SECTION3_RADIO2,
  TKM_SECTION3_MULTI,
  TKM_SECTION3_MATCH,
  TKM_SECTION4_RADIO,
  TKM_SECTION4_RADIO2,
  TKM_SECTION4_MULTI,
  TKM_SECTION4_STYLED,
  TKM_SECTION4_OPEN,
  TKM_SECTION5_MULTI,
  TKM_SECTION5_OPEN,
  TKM_SECTION6_SINGLE,
  TKM_SECTION6_MULTI,
  TKM_SECTION6_OPEN,
  TkmQuestion,
  TkmMultiQuestion,
} from "../learn/tkmAnswerKey";

export interface Submission {
  id: number;
  nickname: string;
  vk_link: string;
  department: string;
  score: number | null;
  max_score: number | null;
  status: string;
  reviewer: string | null;
  reviewer_comment: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface SubmissionDetail extends Submission {
  answers: Record<string, string>;
  manual_scores?: Record<string, string | number>;
}

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидает проверки", color: "text-yellow-400" },
  reviewed: { label: "Сдал", color: "text-green-400" },
  failed: { label: "Не сдал", color: "text-red-400" },
};

export const AUTO_QUESTION_SCORES: Record<string, number> = {
  "2.1": 1, "2.2": 1, "2.3": 1,
  "3.4 На какое максимальное количество времени сотрудникам разрешено брать перерыв?": 1,
  "3.5 Выберите продолжительность рабочего дня с понедельника по пятницу:": 1,
  "3.6 Можно ли выезжать на пост/патруль используя РАСМП?": 1,
  "3.7 Какое наказание получит сотрудник, если тот будет танцевать на смене?": 1,
  "3.8 Можно ли игнорировать строй, который объявили в RP рацию (/г)?": 1,
  "3.9 Следуя на место вызова, вы попали в ДТП не по вашей вине. Каковы будут ваши действия?": 1,
  "3.15 Разрешено ли нарушение ПДД при выезде на вызов с СГУ?": 1,
  "3.16": 4,
  "3.17": 4,
  "3.18 Правильным ли будет высказывание: «Провинция - субъект российской Федерации»?": 1,
  "3.19 Кем является Главный администратор сервера #1 с точки зрения RP?": 1,
  "3.20 Кто такой Владимир Владимирович Путин с точки зрения RP?": 1,
  "3.21": 2,
  "3.22 Что такое свод ВПС?": 1,
  "3.23": 4,
  "3.24": 6,
  "3.25": 3,
  "3.26": 4,
  "3.27": 4,
  "4.29": 3,
  "5.32": 1,
  "5.33": 4,
  "5.34": 1,
};

export function getAutoScore(key: string): number {
  const prefix = key.split(" ")[0];
  return AUTO_QUESTION_SCORES[key] ?? AUTO_QUESTION_SCORES[prefix] ?? 1;
}

export const OPEN_MAX_SCORES: Record<string, number> = {
  "3.10": 5, "3.11": 5, "3.12": 5, "3.13": 5, "3.14": 5,
  "3.28": 4,
  "4.30": 5, "4.31": 3,
  "5.35": 3, "5.36": 3, "5.37": 2, "5.38": 5,
};

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getSingleQuestions(dept: string): TkmQuestion[] {
  return [
    ...(TKM_QUESTIONS[dept] || []),
    ...TKM_SECTION3,
    ...TKM_SECTION3_RADIO2,
    ...TKM_SECTION4_RADIO,
    ...TKM_SECTION4_RADIO2,
    ...TKM_SECTION6_SINGLE,
  ];
}

function getMultiQuestions(): TkmMultiQuestion[] {
  return [
    ...TKM_SECTION3_MULTI,
    ...TKM_SECTION4_MULTI,
    ...TKM_SECTION4_STYLED,
    ...TKM_SECTION5_MULTI,
    ...TKM_SECTION6_MULTI,
  ];
}

// Все вопросы с полем num для нумерации
function getAllQuestionsWithNum(): { key: string; num?: number; text?: string; title?: string }[] {
  return [
    ...TKM_SECTION3_MULTI,
    ...TKM_SECTION3_OPEN,
    ...TKM_SECTION3_MATCH,
    ...TKM_SECTION4_MULTI,
    ...TKM_SECTION4_STYLED,
    ...TKM_SECTION4_OPEN,
    ...TKM_SECTION5_MULTI,
    ...TKM_SECTION5_OPEN,
    ...TKM_SECTION6_MULTI,
    ...TKM_SECTION6_OPEN,
  ];
}

export function getQuestionOptions(key: string, dept: string): string[] | null {
  const singles = getSingleQuestions(dept);
  const single = singles.find(q => q.key === key);
  if (single) return single.options;

  const multis = getMultiQuestions();
  const multi = multis.find(q => q.key === key);
  if (multi) return multi.options;

  return null;
}

export function getQuestionType(key: string, dept: string): "single" | "multi" | "match" | "open" {
  const singles = getSingleQuestions(dept);
  if (singles.find(q => q.key === key)) return "single";

  const multis = getMultiQuestions();
  if (multis.find(q => q.key === key)) return "multi";

  if (TKM_SECTION3_MATCH.find(q => q.key === key)) return "match";

  return "open";
}

export function checkAnswer(key: string, answer: string, dept: string): "correct" | "wrong" | "open" | "unknown" {
  const singles = getSingleQuestions(dept);
  const single = singles.find(q => q.key === key);
  if (single) return answer === single.correct ? "correct" : "wrong";

  const multis = getMultiQuestions();
  const multi = multis.find(q => q.key === key);
  if (multi) {
    try {
      const selected: string[] = JSON.parse(answer);
      const correct = multi.correct;
      const isCorrect = selected.length === correct.length && correct.every(c => selected.includes(c));
      return isCorrect ? "correct" : "wrong";
    } catch { return "wrong"; }
  }

  // Matching вопрос 3.17
  const match = TKM_SECTION3_MATCH.find(q => q.key === key);
  if (match) {
    try {
      const selected: Record<string, string> = JSON.parse(answer);
      const isCorrect = match.rows.every(row => selected[row.label] === row.correct);
      return isCorrect ? "correct" : "wrong";
    } catch { return "wrong"; }
  }

  return "open";
}

export function getCorrectAnswer(key: string, dept: string): string | string[] | null {
  const singles = getSingleQuestions(dept);
  const single = singles.find(q => q.key === key);
  if (single) return single.correct;

  const multis = getMultiQuestions();
  const multi = multis.find(q => q.key === key);
  if (multi) return multi.correct;

  return null;
}

export function getQuestionNum(key: string): number | null {
  const found = getAllQuestionsWithNum().find(q => q.key === key);
  if (found && "num" in found && typeof found.num === "number") return found.num;
  return null;
}

export function getQuestionLabel(key: string, dept: string): string {
  // Сначала ищем по всем одиночным и мульти (у них text всегда есть)
  const singles = getSingleQuestions(dept);
  const single = singles.find(q => q.key === key);
  if (single) return single.text;

  const multis = getMultiQuestions();
  const multi = multis.find(q => q.key === key);
  if (multi) return multi.text;

  // Открытые и спец. вопросы
  const open3 = TKM_SECTION3_OPEN.find(q => q.key === key);
  if (open3) return open3.title;

  const match3 = TKM_SECTION3_MATCH.find(q => q.key === key);
  if (match3) return match3.text;

  const open4 = TKM_SECTION4_OPEN.find(q => q.key === key);
  if (open4) return open4.text;

  const open5 = TKM_SECTION5_OPEN.find(q => q.key === key);
  if (open5) return open5.text;

  const open6 = TKM_SECTION6_OPEN.find(q => q.key === key);
  if (open6) return open6.text;

  return key;
}

export function groupAnswersBySection(answers: Record<string, string>): { label: string; keys: string[] }[] {
  const usedKeys = new Set<string>();
  const result: { label: string; keys: string[] }[] = [];

  const s5Keys = Object.keys(answers).filter(k => k.startsWith("5."));
  if (s5Keys.length) result.push({ label: "Раздел 5 — Медицина", keys: s5Keys });
  s5Keys.forEach(k => usedKeys.add(k));

  const s4Keys = Object.keys(answers).filter(k => {
    if (usedKeys.has(k)) return false;
    const n = parseFloat(k.replace("4.", ""));
    return k.startsWith("4.") && n >= 29;
  });
  if (s4Keys.length) result.push({ label: "Раздел 4 — Препараты", keys: s4Keys });
  s4Keys.forEach(k => usedKeys.add(k));

  const rpKeys = Object.keys(answers).filter(k => {
    if (usedKeys.has(k)) return false;
    const n = parseFloat(k.replace("4.", ""));
    return k.startsWith("4.") && n >= 18 && n <= 28;
  });
  if (rpKeys.length) result.push({ label: "Раздел 3 — RP-сфера", keys: rpKeys });
  rpKeys.forEach(k => usedKeys.add(k));

  const s2Keys = Object.keys(answers).filter(k => !usedKeys.has(k) && k.startsWith("3."));
  if (s2Keys.length) result.push({ label: "Раздел 2 — Уставная документация", keys: s2Keys });
  s2Keys.forEach(k => usedKeys.add(k));

  const s1Keys = Object.keys(answers).filter(k => !usedKeys.has(k) && k.startsWith("2."));
  if (s1Keys.length) result.push({ label: "Раздел 1 — Отделение", keys: s1Keys });
  s1Keys.forEach(k => usedKeys.add(k));

  const restKeys = Object.keys(answers).filter(k => !usedKeys.has(k));
  if (restKeys.length) result.push({ label: "Прочее", keys: restKeys });

  const order = ["Раздел 1", "Раздел 2", "Раздел 3", "Раздел 4", "Раздел 5", "Прочее"];
  result.sort((a, b) => {
    const ai = order.findIndex(o => a.label.startsWith(o));
    const bi = order.findIndex(o => b.label.startsWith(o));
    return ai - bi;
  });

  return result;
}