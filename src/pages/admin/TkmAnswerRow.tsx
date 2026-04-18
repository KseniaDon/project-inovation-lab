import Icon from "@/components/ui/icon";
import { checkAnswer, getCorrectAnswer, getQuestionLabel, OPEN_MAX_SCORES } from "./TkmReviewTypes";

interface AnswerRowProps {
  qKey: string;
  answer: string;
  dept: string;
  manualScore: string;
  maxScore: number;
  onManualScore: (v: string) => void;
}

export default function AnswerRow({ qKey, answer, dept, manualScore, maxScore, onManualScore }: AnswerRowProps) {
  const status = checkAnswer(qKey, answer, dept);
  const correct = getCorrectAnswer(qKey, dept);
  const label = getQuestionLabel(qKey, dept);

  let displayAnswer = answer;
  let displayAnswerList: string[] | null = null;
  try {
    const parsed = JSON.parse(answer);
    if (Array.isArray(parsed)) {
      displayAnswerList = parsed;
      displayAnswer = parsed.join(", ");
    }
  } catch { /* not json */ }

  const borderClass = status === "correct"
    ? "border-green-700/50 bg-green-900/10"
    : status === "wrong"
    ? "border-red-700/50 bg-red-900/10"
    : "border-zinc-800 bg-zinc-900/40";

  const answerColor = status === "correct" ? "text-green-300" : status === "wrong" ? "text-red-300" : "text-zinc-200";

  return (
    <div className={`border px-4 py-3 flex flex-col gap-2 ${borderClass}`}>
      <p className="text-xs text-zinc-500 leading-snug">{label || qKey}</p>
      <div className="flex items-start gap-2">
        {status === "correct" && <Icon name="CheckCircle" size={14} className="text-green-400 mt-0.5 shrink-0" />}
        {status === "wrong" && <Icon name="XCircle" size={14} className="text-red-400 mt-0.5 shrink-0" />}
        {status === "open" && <Icon name="FileText" size={14} className="text-zinc-500 mt-0.5 shrink-0" />}
        {displayAnswerList ? (
          <div className={`flex flex-col gap-1 ${answerColor}`}>
            {displayAnswerList.length === 0
              ? <span className="text-zinc-600 italic text-sm">нет ответа</span>
              : displayAnswerList.map((item, i) => (
                <p key={i} className="text-sm leading-snug">• {item}</p>
              ))
            }
          </div>
        ) : (
          <p className={`text-sm whitespace-pre-wrap leading-relaxed ${answerColor}`}>
            {displayAnswer || <span className="text-zinc-600 italic">нет ответа</span>}
          </p>
        )}
      </div>
      {status === "wrong" && correct && (
        <div className="flex flex-col gap-1 pt-2 border-t border-zinc-700/50">
          <div className="flex items-center gap-1.5">
            <Icon name="CheckCircle" size={13} className="text-green-500 shrink-0" />
            <span className="text-xs text-green-500 font-medium">Правильный ответ:</span>
          </div>
          {Array.isArray(correct)
            ? correct.map((item, i) => (
                <p key={i} className="text-xs text-green-400 leading-snug pl-5">• {item}</p>
              ))
            : <p className="text-xs text-green-400 pl-5">{correct}</p>
          }
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