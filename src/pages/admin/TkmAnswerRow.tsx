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
