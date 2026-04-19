import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  TKM_SECTION6_SINGLE,
  TKM_SECTION6_MULTI,
  TKM_SECTION6_OPEN,
  TkmQuestion,
  TkmMultiQuestion,
  TkmSection6OpenQuestion,
} from "./tkmAnswerKey";

interface RadioQuestionProps {
  num: number;
  q: TkmQuestion;
  value: string;
  onChange: (v: string) => void;
}

function RadioQuestion({ num, q, value, onChange }: RadioQuestionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="font-bold">№{num}.</span> {q.text}{" "}
        <span className="text-red-500">*</span>
      </p>
      <div className="flex flex-col gap-2.5 mt-1">
        {q.options.map(opt => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                value === opt ? "border-red-500 bg-red-500" : "border-muted-foreground group-hover:border-red-400"
              }`}
              onClick={() => onChange(opt)}
            >
              {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-foreground leading-snug" onClick={() => onChange(opt)}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface MultiQuestionProps {
  q: TkmMultiQuestion;
  value: string[];
  onChange: (v: string[]) => void;
}

function MultiQuestion({ q, value, onChange }: MultiQuestionProps) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="font-bold">№{q.num}.</span> {q.text}{" "}
        <span className="text-red-500">*</span>
      </p>
      <div className="flex flex-col gap-2.5 mt-1">
        {q.options.map(opt => {
          const checked = value.includes(opt);
          return (
            <label key={opt} className="flex items-start gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                  checked ? "border-red-500 bg-red-500" : "border-muted-foreground group-hover:border-red-400"
                }`}
                onClick={() => toggle(opt)}
              >
                {checked && <Icon name="Check" size={10} className="text-white" />}
              </div>
              <span className="text-sm text-foreground leading-snug" onClick={() => toggle(opt)}>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

interface OpenQuestionProps {
  q: TkmSection6OpenQuestion;
  value: string;
  onChange: (v: string) => void;
}

function OpenQuestion({ q, value, onChange }: OpenQuestionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="font-bold">№{q.num}.</span> {q.text}{" "}
        <span className="text-red-500">*</span>
      </p>
      {q.subQuestions && (
        <ol className="flex flex-col gap-1 mt-0.5">
          {q.subQuestions.map((sq, i) => (
            <li key={i} className="text-sm text-foreground leading-relaxed">
              <span className="font-medium">{i + 1}.</span> {sq}
            </li>
          ))}
        </ol>
      )}
      {q.example && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">Пример:</p>
          <p className="text-sm text-muted-foreground italic whitespace-pre-line">{q.example}</p>
        </div>
      )}
      {q.warning && (
        <p className="text-sm font-bold">Внимание! {q.warning}</p>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Развернутый ответ"
        rows={4}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
      />
    </div>
  );
}

interface Props {
  onNext: (answers: Record<string, string>) => void;
  onBack: () => void;
  initialAnswers?: Record<string, string>;
}

export default function TkmSection6({ onNext, onBack, initialAnswers = {} }: Props) {
  const multiKeys = new Set(TKM_SECTION6_MULTI.map(q => q.key));
  const singleKeys = new Set(TKM_SECTION6_SINGLE.map(q => q.key));
  const openKeys = new Set(TKM_SECTION6_OPEN.map(q => q.key));

  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>(() => {
    const r: Record<string, string> = {};
    for (const [k, v] of Object.entries(initialAnswers)) {
      if (singleKeys.has(k)) r[k] = v;
    }
    return r;
  });
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>(() => {
    const r: Record<string, string[]> = {};
    for (const q of TKM_SECTION6_MULTI) {
      if (initialAnswers[q.key]) { try { r[q.key] = JSON.parse(initialAnswers[q.key]); } catch { r[q.key] = []; } }
    }
    return r;
  });
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>(() => {
    const r: Record<string, string> = {};
    for (const [k, v] of Object.entries(initialAnswers)) {
      if (openKeys.has(k)) r[k] = v;
    }
    return r;
  });

  const handleNext = () => {
    const allAnswers: Record<string, string> = { ...singleAnswers, ...openAnswers };
    for (const q of TKM_SECTION6_MULTI) {
      allAnswers[q.key] = JSON.stringify(multiAnswers[q.key] || []);
    }
    onNext(allAnswers);
  };

  const q32 = TKM_SECTION6_SINGLE.find(q => q.key === "5.32")!;
  const q34 = TKM_SECTION6_SINGLE.find(q => q.key === "5.34")!;
  const q33 = TKM_SECTION6_MULTI[0];

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 5 из 5</span>
        <h2 className="text-base font-bold mt-1">Раздел 5. Медицина</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Этот раздел включает в себя вопросы, которые проверяют ваши знания в области медицины.
          Читайте внимательно вопрос и обращайте внимание на пример ответа.
          Старайтесь избегать непонятных выражений/фразеологизмов.
        </p>
        <div className="text-sm text-foreground mt-1 space-y-0.5">
          <p>Количество вопросов в разделе: <span className="font-semibold">7</span>.</p>
          <p>Максимальный первичный балл за раздел: <span className="font-semibold">19</span>.</p>
        </div>
      </div>

      <RadioQuestion
        num={32}
        q={q32}
        value={singleAnswers["5.32"] || ""}
        onChange={val => setSingleAnswers(prev => ({ ...prev, "5.32": val }))}
      />

      <MultiQuestion
        q={q33}
        value={multiAnswers["5.33"] || []}
        onChange={val => setMultiAnswers(prev => ({ ...prev, "5.33": val }))}
      />

      <RadioQuestion
        num={34}
        q={q34}
        value={singleAnswers["5.34"] || ""}
        onChange={val => setSingleAnswers(prev => ({ ...prev, "5.34": val }))}
      />

      {TKM_SECTION6_OPEN.map(q => (
        <OpenQuestion
          key={q.key}
          q={q}
          value={openAnswers[q.key] || ""}
          onChange={val => setOpenAnswers(prev => ({ ...prev, [q.key]: val }))}
        />
      ))}

      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-2.5 border border-border text-sm font-semibold rounded-lg hover:bg-muted transition-colors">
          ← Назад
        </button>
        <button onClick={handleNext} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Далее
        </button>
      </div>
    </div>
  );
}