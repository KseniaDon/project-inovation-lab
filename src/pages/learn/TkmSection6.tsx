import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  TKM_SECTION6_SINGLE,
  TKM_SECTION6_MULTI,
  TkmQuestion,
  TkmMultiQuestion,
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
  manualScore?: string;
  onManualScore?: (v: string) => void;
  maxScore?: number;
}

function MultiQuestion({ q, value, onChange, manualScore, onManualScore, maxScore }: MultiQuestionProps) {
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
      {onManualScore !== undefined && (
        <div className="flex items-center gap-3 mt-1 pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">Баллов за вопрос:</span>
          <input
            type="number"
            min={0}
            max={maxScore}
            value={manualScore ?? "0"}
            onChange={e => onManualScore(e.target.value)}
            className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {maxScore !== undefined && (
            <span className="text-sm text-muted-foreground">из {maxScore}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  onNext: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const SINGLE_NUMS: Record<string, number> = {
  "5.32": 32,
  "5.34": 34,
};

export default function TkmSection6({ onNext, onBack }: Props) {
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [manualScores, setManualScores] = useState<Record<string, string>>({ "5.33": "0" });
  const [error, setError] = useState("");

  const handleNext = () => {
    setError("");

    const unansweredSingle = TKM_SECTION6_SINGLE.find(q => !singleAnswers[q.key]);
    if (unansweredSingle) { setError("Ответьте на все вопросы раздела"); return; }

    const unansweredMulti = TKM_SECTION6_MULTI.find(q => !(multiAnswers[q.key]?.length));
    if (unansweredMulti) { setError("Ответьте на все вопросы раздела"); return; }

    const allAnswers: Record<string, string> = { ...singleAnswers };
    for (const q of TKM_SECTION6_MULTI) {
      allAnswers[q.key] = JSON.stringify(multiAnswers[q.key] || []);
    }
    for (const key of Object.keys(manualScores)) {
      allAnswers[`${key}_score`] = manualScores[key];
    }
    onNext(allAnswers);
  };

  const q32 = TKM_SECTION6_SINGLE.find(q => q.key === "5.32")!;
  const q34 = TKM_SECTION6_SINGLE.find(q => q.key === "5.34")!;
  const q33 = TKM_SECTION6_MULTI[0];

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 5 из 8</span>
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
        manualScore={manualScores["5.33"]}
        onManualScore={val => setManualScores(prev => ({ ...prev, "5.33": val }))}
        maxScore={4}
      />

      <RadioQuestion
        num={34}
        q={q34}
        value={singleAnswers["5.34"] || ""}
        onChange={val => setSingleAnswers(prev => ({ ...prev, "5.34": val }))}
      />

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