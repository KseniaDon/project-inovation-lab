import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  TKM_SECTION3,
  TKM_SECTION3_OPEN,
  TKM_SECTION3_RADIO2,
  TKM_SECTION3_MULTI,
  TKM_SECTION3_MATCH,
  TkmOpenQuestion,
  TkmMultiQuestion,
  TkmMatchQuestion,
} from "./tkmAnswerKey";

interface RadioQuestionProps {
  num: number;
  text: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function RadioQuestion({ num, text, options, value, onChange }: RadioQuestionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="font-bold">№{num}.</span> {text}{" "}
        <span className="text-red-500">*</span>
      </p>
      <div className="flex flex-col gap-2.5 mt-1">
        {options.map(opt => (
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

interface MatchQuestionProps {
  q: TkmMatchQuestion;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}

function MatchQuestion({ q, value, onChange }: MatchQuestionProps) {
  const set = (label: string, col: string) => onChange({ ...value, [label]: col });

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <p className="text-sm font-medium leading-relaxed">
        <span className="font-bold">№{q.num}.</span> {q.text}{" "}
        <span className="text-red-500">*</span>
      </p>
      <p className="text-xs text-muted-foreground">Для каждой строки выберите соответствующий столбец</p>

      {/* Шапка столбцов */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4 min-w-[180px]">Утверждение</th>
              {q.columns.map(col => (
                <th key={col} className="text-center text-xs font-semibold text-foreground pb-3 px-3 min-w-[90px]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-muted/30" : ""}>
                <td className="text-sm text-foreground py-3 pr-4 leading-snug align-middle">{row.label}</td>
                {q.columns.map(col => {
                  const selected = value[row.label] === col;
                  return (
                    <td key={col} className="text-center py-3 px-3 align-middle">
                      <button
                        onClick={() => set(row.label, col)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto transition-colors ${
                          selected ? "border-red-500 bg-red-500" : "border-muted-foreground hover:border-red-400"
                        }`}
                      >
                        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface OpenQuestionProps {
  q: TkmOpenQuestion;
  value: string;
  onChange: (v: string) => void;
}

function OpenQuestion({ q, value, onChange }: OpenQuestionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="font-bold">№{q.num}.</span> {q.title}{" "}
        <span className="text-red-500">*</span>
      </p>
      {q.situation && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">Описание ситуации:</p>
          <p className="text-sm leading-relaxed">{q.situation}</p>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">Пример:</p>
        <p className="text-sm text-muted-foreground italic whitespace-pre-line">{q.example}</p>
      </div>
      <p className="text-sm leading-relaxed">
        <span className="font-bold">От вас НЕ требуется:</span> {q.notRequired}
      </p>
      <p className="text-sm font-bold">Внимание! {q.warning}</p>
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
}

export default function TkmSection3({ onNext, onBack }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [matchAnswers, setMatchAnswers] = useState<Record<string, Record<string, string>>>({});
  const [error, setError] = useState("");

  const set = (key: string, val: string) => setAnswers(prev => ({ ...prev, [key]: val }));

  const handleNext = () => {
    setError("");
    const unanswered = TKM_SECTION3.find(q => !answers[q.key]);
    if (unanswered) { setError("Ответьте на все вопросы раздела"); return; }

    const unanswered2 = TKM_SECTION3_RADIO2.find(q => !answers[q.key]);
    if (unanswered2) { setError("Ответьте на все вопросы раздела"); return; }

    const unansweredMulti = TKM_SECTION3_MULTI.find(q => !(multiAnswers[q.key]?.length));
    if (unansweredMulti) { setError("Ответьте на все вопросы раздела"); return; }

    const unansweredMatch = TKM_SECTION3_MATCH.find(q =>
      q.rows.some(row => !matchAnswers[q.key]?.[row.label])
    );
    if (unansweredMatch) { setError("Ответьте на все вопросы раздела"); return; }

    const unansweredOpen = TKM_SECTION3_OPEN.find(q => !answers[q.key]?.trim());
    if (unansweredOpen) { setError("Ответьте на все вопросы раздела"); return; }

    const allAnswers: Record<string, string> = { ...answers };
    for (const q of TKM_SECTION3_MULTI) {
      allAnswers[q.key] = JSON.stringify(multiAnswers[q.key] || []);
    }
    for (const q of TKM_SECTION3_MATCH) {
      allAnswers[q.key] = JSON.stringify(matchAnswers[q.key] || {});
    }
    onNext(allAnswers);
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 2 из 8</span>
        <h2 className="text-base font-bold mt-1">Раздел 2. Уставная документация</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Этот раздел включает в себя вопросы, которые проверяют ваши знания по всей уставной
          документации Министерства Здравоохранения. Читайте внимательно вопрос и обращайте внимание
          на пример ответа. Старайтесь избегать непонятных выражений/фразеологизмов.
        </p>
        <div className="text-sm text-foreground mt-1 space-y-0.5">
          <p>Количество вопросов в разделе: <span className="font-semibold">17</span>.</p>
          <p>Максимальный первичный балл за раздел: <span className="font-semibold">40</span>.</p>
        </div>
      </div>

      {TKM_SECTION3.map((q, i) => (
        <RadioQuestion
          key={q.key}
          num={i + 4}
          text={q.text}
          options={q.options}
          value={answers[q.key] || ""}
          onChange={val => set(q.key, val)}
        />
      ))}

      {TKM_SECTION3_OPEN.map(q => (
        <OpenQuestion
          key={q.key}
          q={q}
          value={answers[q.key] || ""}
          onChange={val => set(q.key, val)}
        />
      ))}

      {TKM_SECTION3_RADIO2.map((q, i) => (
        <RadioQuestion
          key={q.key}
          num={TKM_SECTION3.length + TKM_SECTION3_OPEN.length + i + 4}
          text={q.text}
          options={q.options}
          value={answers[q.key] || ""}
          onChange={val => set(q.key, val)}
        />
      ))}

      {TKM_SECTION3_MULTI.map(q => (
        <MultiQuestion
          key={q.key}
          q={q}
          value={multiAnswers[q.key] || []}
          onChange={val => setMultiAnswers(prev => ({ ...prev, [q.key]: val }))}
        />
      ))}

      {TKM_SECTION3_MATCH.map(q => (
        <MatchQuestion
          key={q.key}
          q={q}
          value={matchAnswers[q.key] || {}}
          onChange={val => setMatchAnswers(prev => ({ ...prev, [q.key]: val }))}
        />
      ))}

      {error && (
        <p className="text-sm text-red-500 flex items-start gap-2">
          <Icon name="AlertCircle" size={15} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

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