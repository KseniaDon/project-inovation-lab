import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  TKM_SECTION4_RADIO,
  TKM_SECTION4_MULTI,
  TkmMultiQuestion,
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

interface Props {
  onNext: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export default function TkmSection4({ onNext, onBack }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");

  const set = (key: string, val: string) => setAnswers(prev => ({ ...prev, [key]: val }));

  const handleNext = () => {
    setError("");

    const unansweredRadio = TKM_SECTION4_RADIO.find(q => !answers[q.key]);
    if (unansweredRadio) { setError("Ответьте на все вопросы раздела"); return; }

    const unansweredMulti = TKM_SECTION4_MULTI.find(q => !(multiAnswers[q.key]?.length));
    if (unansweredMulti) { setError("Ответьте на все вопросы раздела"); return; }

    const allAnswers: Record<string, string> = { ...answers };
    for (const q of TKM_SECTION4_MULTI) {
      allAnswers[q.key] = JSON.stringify(multiAnswers[q.key] || []);
    }
    onNext(allAnswers);
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 3 из 8</span>
        <h2 className="text-base font-bold mt-1">Раздел 3. RP-сфера</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Этот раздел включает в себя вопросы, которые проверяют ваши знания RP-составляющей.
          Читайте внимательно вопрос и обращайте внимание на пример ответа.
          Старайтесь избегать непонятных выражений/фразеологизмов.
        </p>
        <div className="text-sm text-foreground mt-1 space-y-0.5">
          <p>Количество вопросов в разделе: <span className="font-semibold">11</span>.</p>
          <p>Максимальный первичный балл за раздел: <span className="font-semibold">31</span>.</p>
        </div>
      </div>

      {TKM_SECTION4_RADIO.map((q, i) => (
        <RadioQuestion
          key={q.key}
          num={18 + i}
          text={q.text}
          options={q.options}
          value={answers[q.key] || ""}
          onChange={val => set(q.key, val)}
        />
      ))}

      {TKM_SECTION4_MULTI.map(q => (
        <MultiQuestion
          key={q.key}
          q={q}
          value={multiAnswers[q.key] || []}
          onChange={val => setMultiAnswers(prev => ({ ...prev, [q.key]: val }))}
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
