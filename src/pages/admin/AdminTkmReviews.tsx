import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";
import {
  TKM_QUESTIONS,
  TKM_SECTION3,
  TKM_SECTION3_RADIO2,
  TKM_SECTION3_MULTI,
  TKM_SECTION4_RADIO,
  TKM_SECTION4_RADIO2,
  TKM_SECTION4_MULTI,
  TKM_SECTION5_MULTI,
  TKM_SECTION6_SINGLE,
  TKM_SECTION6_MULTI,
  TKM_SECTION6_OPEN,
  TkmQuestion,
  TkmMultiQuestion,
} from "../learn/tkmAnswerKey";

const TKM_URL = func2url["tkm"];

interface Submission {
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

interface SubmissionDetail extends Submission {
  answers: Record<string, string>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидает проверки", color: "text-yellow-400" },
  reviewed: { label: "Сдал", color: "text-green-400" },
  failed: { label: "Не сдал", color: "text-red-400" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Все авто-проверяемые вопросы (одиночный выбор)
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

// Все авто-проверяемые вопросы (множественный выбор)
function getMultiQuestions(): TkmMultiQuestion[] {
  return [
    ...TKM_SECTION3_MULTI,
    ...TKM_SECTION4_MULTI,
    ...TKM_SECTION5_MULTI,
    ...TKM_SECTION6_MULTI,
  ];
}

function checkAnswer(key: string, answer: string, dept: string): "correct" | "wrong" | "open" | "unknown" {
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

  return "open";
}

function getCorrectAnswer(key: string, dept: string): string | string[] | null {
  const singles = getSingleQuestions(dept);
  const single = singles.find(q => q.key === key);
  if (single) return single.correct;

  const multis = getMultiQuestions();
  const multi = multis.find(q => q.key === key);
  if (multi) return multi.correct;

  return null;
}

function getQuestionLabel(key: string, dept: string): string {
  const all = [
    ...getSingleQuestions(dept),
    ...getMultiQuestions(),
    ...TKM_SECTION6_OPEN,
  ];
  const found = all.find(q => q.key === key);
  if (found && "text" in found) return (found as { text: string }).text;
  if (found && "title" in found) return (found as { title: string }).title;
  return key;
}

const SECTION_KEYS: Record<string, string[]> = {
  "Раздел 1 — Отделение": ["2.1", "2.2", "2.3"],
};

function groupAnswersBySection(answers: Record<string, string>): { label: string; keys: string[] }[] {
  const groups: { label: string; prefix: string }[] = [
    { label: "Раздел 1 — Отделение", prefix: "2." },
    { label: "Раздел 2 — Уставная документация", prefix: "3." },
    { label: "Раздел 3 — RP-сфера", prefix: "4." },
    { label: "Раздел 4 — Препараты", prefix: "4.2" },
    { label: "Раздел 5 — Медицина", prefix: "5." },
  ];

  const usedKeys = new Set<string>();
  const result: { label: string; keys: string[] }[] = [];

  // Медицина (5.)
  const s5Keys = Object.keys(answers).filter(k => k.startsWith("5."));
  if (s5Keys.length) result.push({ label: "Раздел 5 — Медицина", keys: s5Keys });
  s5Keys.forEach(k => usedKeys.add(k));

  // Препараты (4.29 – 4.31)
  const s4Keys = Object.keys(answers).filter(k => {
    if (usedKeys.has(k)) return false;
    const n = parseFloat(k.replace("4.", ""));
    return k.startsWith("4.") && n >= 29;
  });
  if (s4Keys.length) result.push({ label: "Раздел 4 — Препараты", keys: s4Keys });
  s4Keys.forEach(k => usedKeys.add(k));

  // RP-сфера (4.18 – 4.28)
  const rpKeys = Object.keys(answers).filter(k => {
    if (usedKeys.has(k)) return false;
    const n = parseFloat(k.replace("4.", ""));
    return k.startsWith("4.") && n >= 18 && n <= 28;
  });
  if (rpKeys.length) result.push({ label: "Раздел 3 — RP-сфера", keys: rpKeys });
  rpKeys.forEach(k => usedKeys.add(k));

  // Раздел 2 (3.)
  const s2Keys = Object.keys(answers).filter(k => !usedKeys.has(k) && k.startsWith("3."));
  if (s2Keys.length) result.push({ label: "Раздел 2 — Уставная документация", keys: s2Keys });
  s2Keys.forEach(k => usedKeys.add(k));

  // Раздел 1 (2.)
  const s1Keys = Object.keys(answers).filter(k => !usedKeys.has(k) && k.startsWith("2."));
  if (s1Keys.length) result.push({ label: "Раздел 1 — Отделение", keys: s1Keys });
  s1Keys.forEach(k => usedKeys.add(k));

  // Остальное
  const restKeys = Object.keys(answers).filter(k => !usedKeys.has(k));
  if (restKeys.length) result.push({ label: "Прочее", keys: restKeys });

  // Сортируем по логическому порядку разделов
  const order = ["Раздел 1", "Раздел 2", "Раздел 3", "Раздел 4", "Раздел 5", "Прочее"];
  result.sort((a, b) => {
    const ai = order.findIndex(o => a.label.startsWith(o));
    const bi = order.findIndex(o => b.label.startsWith(o));
    return ai - bi;
  });

  return result;
}

interface AnswerRowProps {
  qKey: string;
  answer: string;
  dept: string;
  manualScore: string;
  maxScore: number;
  onManualScore: (v: string) => void;
}

function AnswerRow({ qKey, answer, dept, manualScore, maxScore, onManualScore }: AnswerRowProps) {
  const status = checkAnswer(qKey, answer, dept);
  const correct = getCorrectAnswer(qKey, dept);
  const label = getQuestionLabel(qKey, dept);

  let displayAnswer = answer;
  try {
    const parsed = JSON.parse(answer);
    if (Array.isArray(parsed)) displayAnswer = parsed.join(", ");
  } catch { /* not json */ }

  const borderClass = status === "correct"
    ? "border-green-700/50 bg-green-900/10"
    : status === "wrong"
    ? "border-red-700/50 bg-red-900/10"
    : "border-zinc-800 bg-zinc-900/40";

  return (
    <div className={`border px-4 py-3 flex flex-col gap-2 ${borderClass}`}>
      <p className="text-xs text-zinc-500 leading-snug">{label || qKey}</p>
      <div className="flex items-start gap-2">
        {status === "correct" && <Icon name="CheckCircle" size={14} className="text-green-400 mt-0.5 shrink-0" />}
        {status === "wrong" && <Icon name="XCircle" size={14} className="text-red-400 mt-0.5 shrink-0" />}
        {status === "open" && <Icon name="FileText" size={14} className="text-zinc-500 mt-0.5 shrink-0" />}
        <p className={`text-sm whitespace-pre-wrap leading-relaxed ${status === "correct" ? "text-green-300" : status === "wrong" ? "text-red-300" : "text-zinc-200"}`}>
          {displayAnswer || <span className="text-zinc-600 italic">нет ответа</span>}
        </p>
      </div>
      {status === "wrong" && correct && (
        <div className="flex items-start gap-2 pt-2 border-t border-zinc-700/50">
          <Icon name="CheckCircle" size={13} className="text-green-500 mt-0.5 shrink-0" />
          <p className="text-xs text-green-400">
            Правильный ответ: {Array.isArray(correct) ? correct.join(", ") : correct}
          </p>
        </div>
      )}
      {status === "open" && (
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-700/50">
          <span className="text-xs text-zinc-500">Баллов:</span>
          <input
            type="number"
            min={0}
            max={maxScore}
            value={manualScore}
            onChange={e => onManualScore(e.target.value)}
            className="w-14 bg-zinc-900 border border-zinc-700 text-xs px-2 py-1 text-zinc-200 outline-none focus:border-red-600 text-center"
          />
          <span className="text-xs text-zinc-500">из {maxScore}</span>
        </div>
      )}
    </div>
  );
}

interface Props {
  reviewerNick: string;
}

const OPEN_MAX_SCORES: Record<string, number> = {
  "3.10": 5, "3.11": 5, "3.12": 5, "3.13": 5, "3.14": 5,
  "4.28": 4,
  "4.30": 5, "4.31": 3,
  "5.35": 3, "5.36": 3, "5.37": 2, "5.38": 5,
};

export default function AdminTkmReviews({ reviewerNick }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [manualScores, setManualScores] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState("reviewed");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    try {
      const url = filterStatus ? `${TKM_URL}?action=list&status=${filterStatus}` : `${TKM_URL}?action=list`;
      const res = await fetch(url);
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      setSubmissions([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterStatus]);

  const openDetail = async (id: number) => {
    setDetailLoading(true);
    setSaved(false);
    setExpandedSections({});
    try {
      const res = await fetch(`${TKM_URL}?action=get&id=${id}`);
      const data = await res.json();
      setSelected(data);
      // Инициализируем ручные баллы
      const initScores: Record<string, string> = {};
      for (const key of Object.keys(data.answers || {})) {
        if (OPEN_MAX_SCORES[key] !== undefined) {
          initScores[key] = "0";
        }
      }
      setManualScores(initScores);
      setComment(data.reviewer_comment || "");
      setReviewStatus(data.status === "pending" ? "reviewed" : data.status);
      // Раскрываем все секции по умолчанию
      const groups = groupAnswersBySection(data.answers || {});
      const expanded: Record<string, boolean> = {};
      groups.forEach(g => { expanded[g.label] = true; });
      setExpandedSections(expanded);
    } catch (e) {
      console.error(e);
    }
    setDetailLoading(false);
  };

  const calcAutoScore = (answers: Record<string, string>, dept: string) => {
    let auto = 0;
    for (const [key, val] of Object.entries(answers)) {
      const status = checkAnswer(key, val, dept);
      if (status === "correct") auto += 1;
    }
    return auto;
  };

  const calcManualTotal = () => {
    return Object.values(manualScores).reduce((sum, v) => sum + (Number(v) || 0), 0);
  };

  const saveReview = async () => {
    if (!selected) return;
    setSaving(true);
    const autoScore = calcAutoScore(selected.answers || {}, selected.department);
    const manualTotal = calcManualTotal();
    const totalScore = autoScore + manualTotal;
    const maxScore = Object.values(OPEN_MAX_SCORES).reduce((s, v) => s + v, 0) + 
      Object.keys(selected.answers || {}).filter(k => checkAnswer(k, selected.answers[k], selected.department) !== "open").length;

    try {
      await fetch(`${TKM_URL}?action=review&id=${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: totalScore,
          max_score: maxScore,
          status: reviewStatus,
          reviewer: reviewerNick,
          comment,
        }),
      });
      setSaved(true);
      setSelected(null);
      load();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Фильтр */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Фильтр:</p>
        {[
          { v: "pending", l: "Ожидают" },
          { v: "reviewed", l: "Сдали" },
          { v: "failed", l: "Не сдали" },
          { v: "", l: "Все" },
        ].map(opt => (
          <button
            key={opt.v}
            onClick={() => setFilterStatus(opt.v)}
            className={`text-xs px-3 py-1.5 border transition-colors ${filterStatus === opt.v ? "border-red-600 text-red-400 bg-red-900/20" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
          >
            {opt.l}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors">
          <Icon name="RefreshCw" size={14} />
        </button>
      </div>

      {/* Список заявок */}
      {loading ? (
        <p className="text-sm text-zinc-500">Загрузка...</p>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-zinc-500 py-4">Нет заявок</p>
      ) : (
        <div className="flex flex-col gap-2">
          {submissions.map(sub => (
            <div
              key={sub.id}
              className="border border-zinc-800 bg-zinc-900/40 px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:border-zinc-600 transition-colors"
              onClick={() => openDetail(sub.id)}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-zinc-200">{sub.nickname}</span>
                  <span className="text-xs text-zinc-500 px-1.5 py-0.5 border border-zinc-700">{sub.department}</span>
                  <span className={`text-xs font-medium ${STATUS_LABELS[sub.status]?.color || "text-zinc-400"}`}>
                    {STATUS_LABELS[sub.status]?.label || sub.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{formatDate(sub.submitted_at)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {sub.score !== null && (
                  <span className="text-sm font-bold text-foreground">{sub.score}/{sub.max_score}</span>
                )}
                <Icon name="ChevronRight" size={14} className="text-zinc-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно проверки */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-3xl my-8 flex flex-col">

            {/* Шапка */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
              <div>
                <p className="font-semibold text-zinc-100">{selected.nickname}</p>
                <p className="text-xs text-zinc-500">{selected.department} · {formatDate(selected.submitted_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-zinc-300">
                <Icon name="X" size={18} />
              </button>
            </div>

            {detailLoading ? (
              <p className="text-sm text-zinc-500 p-5">Загрузка...</p>
            ) : (
              <div className="flex flex-col gap-0 divide-y divide-zinc-800">

                {/* VK ссылка */}
                <div className="px-5 py-3">
                  <a href={selected.vk_link} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1.5">
                    <Icon name="ExternalLink" size={13} />
                    {selected.vk_link}
                  </a>
                </div>

                {/* Ответы по разделам */}
                {groupAnswersBySection(selected.answers || {}).map(group => {
                  const isOpen = expandedSections[group.label] !== false;
                  const autoCorrect = group.keys.filter(k => checkAnswer(k, selected.answers[k], selected.department) === "correct").length;
                  const autoWrong = group.keys.filter(k => checkAnswer(k, selected.answers[k], selected.department) === "wrong").length;
                  const openCount = group.keys.filter(k => checkAnswer(k, selected.answers[k], selected.department) === "open").length;

                  return (
                    <div key={group.label}>
                      <button
                        onClick={() => toggleSection(group.label)}
                        className="w-full flex items-center justify-between px-5 py-3 hover:bg-zinc-900/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-zinc-300">{group.label}</span>
                          <div className="flex items-center gap-1.5">
                            {autoCorrect > 0 && <span className="text-xs px-1.5 py-0.5 bg-green-900/30 border border-green-700/40 text-green-400">{autoCorrect} верно</span>}
                            {autoWrong > 0 && <span className="text-xs px-1.5 py-0.5 bg-red-900/30 border border-red-700/40 text-red-400">{autoWrong} неверно</span>}
                            {openCount > 0 && <span className="text-xs px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400">{openCount} открытых</span>}
                          </div>
                        </div>
                        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={14} className="text-zinc-600 shrink-0" />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 flex flex-col gap-2">
                          {group.keys.map(k => (
                            <AnswerRow
                              key={k}
                              qKey={k}
                              answer={selected.answers[k] || ""}
                              dept={selected.department}
                              manualScore={manualScores[k] ?? "0"}
                              maxScore={OPEN_MAX_SCORES[k] ?? 2}
                              onManualScore={v => setManualScores(prev => ({ ...prev, [k]: v }))}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Итог и проверка */}
                <div className="px-5 py-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Итог проверки</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-400">Авто:</span>
                      <span className="font-semibold text-zinc-200">{calcAutoScore(selected.answers || {}, selected.department)} б.</span>
                      <span className="text-zinc-600">+</span>
                      <span className="text-zinc-400">Вручную:</span>
                      <span className="font-semibold text-zinc-200">{calcManualTotal()} б.</span>
                      <span className="text-zinc-600">=</span>
                      <span className="font-bold text-white text-base">{calcAutoScore(selected.answers || {}, selected.department) + calcManualTotal()} б.</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400">Статус</label>
                    <div className="flex gap-2">
                      {[
                        { v: "reviewed", l: "Сдал", color: "border-green-600 text-green-400 bg-green-900/20" },
                        { v: "failed", l: "Не сдал", color: "border-red-600 text-red-400 bg-red-900/20" },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setReviewStatus(opt.v)}
                          className={`text-xs px-5 py-2 border transition-colors font-semibold ${reviewStatus === opt.v ? opt.color : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                        >
                          {opt.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400">Комментарий (необязательно)</label>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Замечания для интерна..."
                      rows={3}
                      className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={saveReview}
                      disabled={saving || saved}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors"
                    >
                      {saved ? <><Icon name="Check" size={14} />Сохранено</> : saving ? "Сохраняю..." : <><Icon name="Save" size={14} />Сохранить результат</>}
                    </button>
                    <button onClick={() => setSelected(null)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-4 py-2.5">
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
