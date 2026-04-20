import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";
import {
  SectionPreview,
  Section2Preview,
  Section3Preview,
  Section4Preview,
  Section5Preview,
} from "./TkmPreviewComponents";
import { getQuestionLabel, getQuestionOptions, getCorrectAnswer } from "./TkmReviewTypes";

const TKM_URL = func2url["tkm"];

const DEPARTMENTS = ["ОИК", "СОП", "ОДС"] as const;
type Dept = typeof DEPARTMENTS[number];

const SECTIONS = [
  { id: "1", label: "Раздел 1 — Отделение", points: 3 },
  { id: "2", label: "Раздел 2 — Уставная документация", points: 36 },
  { id: "3", label: "Раздел 3 — РП-сфера", points: 31 },
  { id: "4", label: "Раздел 4 — Препараты", points: 11 },
  { id: "5", label: "Раздел 5 — Медицина", points: 19 },
] as const;

export type CustomQuestion = {
  text?: string;
  options?: string[];
  correct?: string | string[];
  maxScore?: number;
};
export type CustomQuestions = Record<string, CustomQuestion>;

interface EditModalProps {
  qKey: string;
  q: CustomQuestion;
  onSave: (key: string, updated: CustomQuestion) => void;
  onClose: () => void;
  isSaving: boolean;
}

function EditModal({ qKey, q, onSave, onClose, isSaving }: EditModalProps) {
  const [text, setText] = useState(q.text ?? "");
  const [options, setOptions] = useState<string[]>(q.options ?? []);
  const [correct, setCorrect] = useState<string>(
    Array.isArray(q.correct) ? q.correct.join(", ") : (q.correct ?? "")
  );
  const [maxScore, setMaxScore] = useState<number>(q.maxScore ?? 1);
  const isMulti = Array.isArray(q.correct);

  const updateOption = (i: number, val: string) => {
    const o = [...options];
    o[i] = val;
    setOptions(o);
  };
  const removeOption = (i: number) => setOptions(options.filter((_, idx) => idx !== i));
  const addOption = () => setOptions([...options, ""]);

  const handleSave = () => {
    const updated: CustomQuestion = { text, maxScore };
    if (options.length) updated.options = options;
    if (correct.trim()) {
      if (isMulti) {
        updated.correct = correct.split(",").map(s => s.trim()).filter(Boolean);
      } else {
        updated.correct = correct.trim();
      }
    }
    onSave(qKey, updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg flex flex-col gap-4 p-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-zinc-200">Редактировать вопрос <span className="text-red-400">{qKey}</span></p>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><Icon name="X" size={16} /></button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500 uppercase tracking-widest">Текст вопроса</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 resize-none focus:outline-none focus:border-red-600"
          />
        </div>

        {options.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Варианты ответов</label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={opt}
                  onChange={e => updateOption(i, e.target.value)}
                  className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-red-600"
                />
                <button
                  onClick={() => removeOption(i)}
                  className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors self-start"
            >
              <Icon name="Plus" size={12} /> Добавить вариант
            </button>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500 uppercase tracking-widest">
            Правильный ответ {isMulti ? "(через запятую)" : ""}
          </label>
          <input
            value={correct}
            onChange={e => setCorrect(e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex flex-col gap-1.5 w-32">
          <label className="text-xs text-zinc-500 uppercase tracking-widest">Макс. баллов</label>
          <input
            type="number"
            min={0}
            value={maxScore}
            onChange={e => setMaxScore(Number(e.target.value))}
            className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold bg-red-700 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </button>
          <button onClick={onClose} className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-700 rounded transition-colors">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTkmPreview() {
  const [dept, setDept] = useState<Dept>("ОИК");
  const [section, setSection] = useState<string>("1");
  const [customQuestions, setCustomQuestions] = useState<CustomQuestions>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadCustomQuestions = useCallback(async () => {
    try {
      const res = await fetch(`${TKM_URL}?action=get_questions`);
      const data = await res.json();
      if (data && typeof data === "object") setCustomQuestions(data);
    } catch { /* тихо */ }
  }, []);

  useEffect(() => { loadCustomQuestions(); }, [loadCustomQuestions]);

  const handleSaveQuestion = async (key: string, updated: CustomQuestion) => {
    setIsSaving(true);
    const next = { ...customQuestions, [key]: updated };
    try {
      await fetch(`${TKM_URL}?action=save_questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: next }),
      });
      setCustomQuestions(next);
      setEditingKey(null);
    } catch { /* игнорируем */ }
    setIsSaving(false);
  };

  const getDefaultForKey = (key: string): CustomQuestion => {
    const label = getQuestionLabel(key, dept);
    const options = getQuestionOptions(key, dept);
    const correct = getCorrectAnswer(key, dept);
    return {
      text: label !== key ? label : undefined,
      options: options ?? undefined,
      correct: correct ?? undefined,
    };
  };

  const editingQuestion = editingKey
    ? (customQuestions[editingKey] && Object.keys(customQuestions[editingKey]).length > 0
        ? customQuestions[editingKey]
        : getDefaultForKey(editingKey))
    : null;

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* Шапка */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">Предпросмотр теста</p>
        <h2 className="text-base font-bold text-zinc-100">ТКМ — как видит проходящий</h2>
        <p className="text-xs text-zinc-500">Правильные ответы отмечены зелёным. Нажмите <Icon name="Pencil" size={10} className="inline text-zinc-400" /> чтобы отредактировать вопрос.</p>
      </div>

      {/* Выбор отделения */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-zinc-500 font-semibold">Отделение:</span>
        {DEPARTMENTS.map(d => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={`text-xs px-3 py-1.5 font-semibold border transition-colors ${
              dept === d
                ? "border-red-600 bg-red-600/10 text-red-400"
                : "border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Навигация по разделам */}
      <div className="flex gap-1 border-b border-zinc-800 flex-wrap">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`text-xs px-3 py-2.5 font-semibold tracking-wide transition-colors border-b-2 -mb-px whitespace-nowrap ${
              section === s.id
                ? "border-red-600 text-red-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {s.label}
            <span className="ml-1.5 text-zinc-600">({s.points} б.)</span>
          </button>
        ))}
      </div>

      {/* Содержимое раздела */}
      <div className="flex flex-col gap-4">
        {section === "1" && (
          <>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 flex items-center gap-2">
              <Icon name="Info" size={14} className="text-zinc-500 shrink-0" />
              <p className="text-xs text-zinc-500">Показывается раздел для отделения <span className="text-zinc-300 font-semibold">{dept}</span>. Переключите отделение выше.</p>
            </div>
            <SectionPreview dept={dept} customQuestions={customQuestions} onEdit={setEditingKey} />
          </>
        )}
        {section === "2" && <Section2Preview customQuestions={customQuestions} onEdit={setEditingKey} />}
        {section === "3" && <Section3Preview customQuestions={customQuestions} onEdit={setEditingKey} />}
        {section === "4" && <Section4Preview customQuestions={customQuestions} onEdit={setEditingKey} />}
        {section === "5" && <Section5Preview customQuestions={customQuestions} onEdit={setEditingKey} />}
      </div>

      {/* Модалка редактирования */}
      {editingKey && (
        <EditModal
          qKey={editingKey}
          q={editingQuestion || {}}
          onSave={handleSaveQuestion}
          onClose={() => setEditingKey(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}