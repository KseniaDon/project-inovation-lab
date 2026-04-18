import { useState } from "react";
import Icon from "@/components/ui/icon";
import { TKM_QUESTIONS, TKM_SECTION3, TKM_SECTION3_OPEN } from "../learn/tkmAnswerKey";

const DEPT_LABELS: Record<string, string> = {
  ОИК: "ОИК — Отделение инфекционного контроля",
  СОП: "СОП — Стоматологическое отделение поликлиники",
  ОДС: "ОДС — Отделение дневного стационара",
};

type EditableQuestion = {
  key: string;
  text: string;
  options: string[];
  correct: string;
  points: number;
};

type EditableOpenQuestion = {
  key: string;
  num: number;
  title: string;
  situation?: string;
  example: string;
  notRequired: string;
  warning: string;
  points: number;
};

function initMcq(): EditableQuestion[] {
  return TKM_SECTION3.map(q => ({ ...q, points: 1 }));
}

function initDeptMcq(): Record<string, EditableQuestion[]> {
  const result: Record<string, EditableQuestion[]> = {};
  for (const dept of Object.keys(TKM_QUESTIONS)) {
    result[dept] = TKM_QUESTIONS[dept].map(q => ({ ...q, points: 1 }));
  }
  return result;
}

function initOpenQuestions(): EditableOpenQuestion[] {
  return TKM_SECTION3_OPEN.map(q => ({ ...q, points: 5 }));
}

interface SectionHeaderProps {
  label: string;
  badge?: string;
  expanded: boolean;
  onToggle: () => void;
  questionCount: number;
  maxPoints: number;
}

function SectionHeader({ label, badge, expanded, onToggle, questionCount, maxPoints }: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        {badge && <span className="text-xs px-2 py-0.5 bg-red-900/40 border border-red-700/50 text-red-400 font-semibold">{badge}</span>}
        <span className="text-sm font-semibold text-zinc-200">{label}</span>
        <span className="text-xs text-zinc-500">{questionCount} вопр. · макс. {maxPoints} б.</span>
      </div>
      <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={15} className="text-zinc-500 shrink-0" />
    </button>
  );
}

interface McqCardProps {
  q: EditableQuestion;
  index: number;
  onChange: (q: EditableQuestion) => void;
}

function McqCard({ q, index, onChange }: McqCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-zinc-800 bg-zinc-900/30">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <span className="text-xs font-bold text-zinc-500 w-6 shrink-0">#{index + 1}</span>
        <span className="text-sm text-zinc-300 truncate flex-1">{q.text}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500">{q.points} б.</span>
          <div className={`text-xs px-2 py-0.5 border ${q.correct ? "border-green-700/50 text-green-400" : "border-zinc-700 text-zinc-500"}`}>
            {q.correct ? "✓ есть ответ" : "нет"}
          </div>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} className="text-zinc-600" />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-zinc-800">
          <div className="flex flex-col gap-1.5 mt-3">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Текст вопроса</label>
            <textarea
              value={q.text}
              onChange={e => onChange({ ...q, text: e.target.value })}
              rows={2}
              className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Варианты ответов</label>
            <div className="flex flex-col gap-1.5">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <button
                    onClick={() => onChange({ ...q, correct: opt })}
                    className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${q.correct === opt ? "border-green-500 bg-green-500" : "border-zinc-600 hover:border-green-500"}`}
                  >
                    {q.correct === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                  <input
                    value={opt}
                    onChange={e => {
                      const newOpts = [...q.options];
                      newOpts[oi] = e.target.value;
                      const newCorrect = q.correct === opt ? e.target.value : q.correct;
                      onChange({ ...q, options: newOpts, correct: newCorrect });
                    }}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors"
                  />
                  <button
                    onClick={() => {
                      const newOpts = q.options.filter((_, i) => i !== oi);
                      const newCorrect = q.correct === opt ? "" : q.correct;
                      onChange({ ...q, options: newOpts, correct: newCorrect });
                    }}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Icon name="X" size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onChange({ ...q, options: [...q.options, ""] })}
                className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 mt-1 transition-colors"
              >
                <Icon name="Plus" size={12} />
                Добавить вариант
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Баллы</label>
              <input
                type="number"
                min={0}
                value={q.points}
                onChange={e => onChange({ ...q, points: Number(e.target.value) })}
                className="w-20 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors"
              />
            </div>
            {q.correct && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500 uppercase tracking-widest">Правильный ответ</label>
                <span className="text-sm text-green-400 bg-green-900/20 border border-green-700/40 px-3 py-1.5">{q.correct}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface OpenCardProps {
  q: EditableOpenQuestion;
  onChange: (q: EditableOpenQuestion) => void;
}

function OpenCard({ q, onChange }: OpenCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-zinc-800 bg-zinc-900/30">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <span className="text-xs font-bold text-zinc-500 w-6 shrink-0">#{q.num}</span>
        <span className="text-sm text-zinc-300 truncate flex-1">{q.title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500">{q.points} б.</span>
          <span className="text-xs px-2 py-0.5 border border-zinc-700 text-zinc-500">открытый</span>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} className="text-zinc-600" />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-zinc-800">
          <div className="flex flex-col gap-1.5 mt-3">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Заголовок вопроса</label>
            <input
              value={q.title}
              onChange={e => onChange({ ...q, title: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors"
            />
          </div>

          {q.situation !== undefined && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Описание ситуации</label>
              <textarea
                value={q.situation || ""}
                onChange={e => onChange({ ...q, situation: e.target.value })}
                rows={3}
                className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Пример ответа</label>
            <textarea
              value={q.example}
              onChange={e => onChange({ ...q, example: e.target.value })}
              rows={3}
              className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">«От вас НЕ требуется»</label>
            <input
              value={q.notRequired}
              onChange={e => onChange({ ...q, notRequired: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Максимум баллов</label>
              <input
                type="number"
                min={0}
                value={q.points}
                onChange={e => onChange({ ...q, points: Number(e.target.value) })}
                className="w-20 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTkmEditor() {
  const [deptMcq, setDeptMcq] = useState<Record<string, EditableQuestion[]>>(initDeptMcq);
  const [section3, setSection3] = useState<EditableQuestion[]>(initMcq);
  const [openQuestions, setOpenQuestions] = useState<EditableOpenQuestion[]>(initOpenQuestions);
  const [activeDept, setActiveDept] = useState<string>("ОИК");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ dept: true, s3: false, open: false });

  const toggle = (k: string) => setExpanded(v => ({ ...v, [k]: !v[k] }));

  const deptTotal = (dept: string) => (deptMcq[dept] || []).reduce((s, q) => s + q.points, 0);
  const s3Total = section3.reduce((s, q) => s + q.points, 0);
  const openTotal = openQuestions.reduce((s, q) => s + q.points, 0);
  const grandTotal = deptTotal(activeDept) + s3Total + openTotal;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">ТКМ — Структура теста</h2>
          <p className="text-xs text-zinc-500 mt-1">Просмотр и редактирование вопросов. Изменения применяются локально — для постоянного сохранения нужна правка файла.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="px-3 py-1.5 border border-zinc-700 bg-zinc-900">
            Всего вопросов: <span className="text-white font-bold">{(deptMcq[activeDept] || []).length + section3.length + openQuestions.length}</span>
          </span>
          <span className="px-3 py-1.5 border border-zinc-700 bg-zinc-900">
            Макс. баллов: <span className="text-white font-bold">{grandTotal}</span>
          </span>
        </div>
      </div>

      {/* Раздел 2 — ведомственные вопросы */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          {Object.keys(TKM_QUESTIONS).map(dept => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`text-xs px-3 py-1.5 border transition-colors ${activeDept === dept ? "border-red-600 text-red-400 bg-red-900/20" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
            >
              {dept}
            </button>
          ))}
        </div>
        <SectionHeader
          label={DEPT_LABELS[activeDept] || activeDept}
          badge="Раздел 2"
          expanded={!!expanded.dept}
          onToggle={() => toggle("dept")}
          questionCount={(deptMcq[activeDept] || []).length}
          maxPoints={deptTotal(activeDept)}
        />
        {expanded.dept && (
          <div className="flex flex-col gap-1 mt-1">
            {(deptMcq[activeDept] || []).map((q, i) => (
              <McqCard
                key={q.key}
                q={q}
                index={i}
                onChange={updated => setDeptMcq(prev => ({
                  ...prev,
                  [activeDept]: prev[activeDept].map((x, xi) => xi === i ? updated : x),
                }))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Раздел 3 — уставная документация (тест) */}
      <div className="flex flex-col gap-1">
        <SectionHeader
          label="Уставная документация — тестовые вопросы (№4–9)"
          badge="Раздел 3"
          expanded={!!expanded.s3}
          onToggle={() => toggle("s3")}
          questionCount={section3.length}
          maxPoints={s3Total}
        />
        {expanded.s3 && (
          <div className="flex flex-col gap-1 mt-1">
            {section3.map((q, i) => (
              <McqCard
                key={q.key}
                q={q}
                index={i + 3}
                onChange={updated => setSection3(prev => prev.map((x, xi) => xi === i ? updated : x))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Раздел 3 — открытые вопросы */}
      <div className="flex flex-col gap-1">
        <SectionHeader
          label="Уставная документация — открытые вопросы (№10–14)"
          badge="Раздел 3"
          expanded={!!expanded.open}
          onToggle={() => toggle("open")}
          questionCount={openQuestions.length}
          maxPoints={openTotal}
        />
        {expanded.open && (
          <div className="flex flex-col gap-1 mt-1">
            {openQuestions.map((q) => (
              <OpenCard
                key={q.key}
                q={q}
                onChange={updated => setOpenQuestions(prev => prev.map(x => x.key === q.key ? updated : x))}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border border-zinc-800 bg-zinc-900/30 px-4 py-3 flex items-center gap-4 flex-wrap text-xs text-zinc-400">
        <Icon name="Info" size={14} className="text-zinc-600 shrink-0" />
        <span>Раздел 4 и далее будет добавлен позже. Изменения баллов и текстов отображаются в интерфейсе проверки.</span>
      </div>
    </div>
  );
}
