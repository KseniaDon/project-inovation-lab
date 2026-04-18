import Icon from "@/components/ui/icon";
import { TKM_SECTION3_MATCH } from "../learn/tkmAnswerKey";
import {
  checkAnswer,
  getCorrectAnswer,
  getQuestionLabel,
  getQuestionNum,
  getQuestionOptions,
  getQuestionType,
  OPEN_MAX_SCORES,
} from "./TkmReviewTypes";

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
  const num = getQuestionNum(qKey);
  const options = getQuestionOptions(qKey, dept);
  const qType = getQuestionType(qKey, dept);

  // Вопрос на соответствие
  const matchQ = TKM_SECTION3_MATCH.find(q => q.key === qKey);

  let selectedList: string[] = [];
  const selectedSingle = answer;
  if (qType === "multi") {
    try { selectedList = JSON.parse(answer); } catch { selectedList = []; }
  }

  let matchAnswers: Record<string, string> = {};
  if (matchQ) {
    try { matchAnswers = JSON.parse(answer); } catch { matchAnswers = {}; }
  }

  const borderClass =
    status === "correct" ? "border-green-700/50 bg-green-900/10" :
    status === "wrong"   ? "border-red-700/50 bg-red-900/10" :
                           "border-zinc-800 bg-zinc-900/40";

  const statusIcon =
    status === "correct" ? <Icon name="CheckCircle" size={14} className="text-green-400 shrink-0" /> :
    status === "wrong"   ? <Icon name="XCircle"     size={14} className="text-red-400 shrink-0" /> :
                           <Icon name="FileText"    size={14} className="text-zinc-500 shrink-0" />;

  return (
    <div className={`border px-4 py-3 flex flex-col gap-3 ${borderClass}`}>

      {/* Заголовок вопроса */}
      <div className="flex items-start gap-2">
        {statusIcon}
        <p className="text-sm font-medium text-zinc-200 leading-snug">
          {num != null && <span className="text-zinc-500 font-normal mr-1">№{num}.</span>}
          {label || qKey}
        </p>
      </div>

      {/* Вопрос на соответствие */}
      {matchQ && (
        <div className="flex flex-col gap-1.5 pl-1">
          {matchQ.rows.map((row, i) => {
            const selected = matchAnswers[row.label];
            const isCorrect = selected === row.correct;
            return (
              <div key={i} className={`flex items-start gap-2 px-3 py-2 border rounded text-xs ${
                selected === undefined ? "border-zinc-700/50 text-zinc-500" :
                isCorrect ? "border-green-600 bg-green-900/20 text-green-300" :
                "border-red-600 bg-red-900/20 text-red-300"
              }`}>
                <span className="text-zinc-400 shrink-0 min-w-0 flex-1 leading-snug">{row.label}</span>
                <span className="shrink-0 font-semibold">
                  {selected ?? <span className="text-zinc-600 italic">не выбрано</span>}
                </span>
                {selected && !isCorrect && (
                  <span className="shrink-0 text-green-400 ml-1">→ {row.correct}</span>
                )}
              </div>
            );
          })}
          <div className="flex items-center gap-2 mt-1 border-t border-zinc-700/30 pt-2">
            <span className="text-xs text-zinc-500">Баллов:</span>
            <input
              type="number"
              min={0}
              max={maxScore}
              value={manualScore}
              onChange={e => onManualScore(e.target.value)}
              className="w-14 bg-zinc-900 border border-zinc-700 text-xs px-2 py-1 text-zinc-200 outline-none focus:border-red-600 text-center rounded"
            />
            <span className="text-xs text-zinc-500">из {maxScore}</span>
          </div>
        </div>
      )}

      {/* Одиночный выбор */}
      {!matchQ && options && qType === "single" && (
        <div className="flex flex-col gap-1.5 pl-1">
          {options.map((opt, i) => {
            const isSelected = selectedSingle === opt;
            const isCorrect = correct === opt;
            const optClass =
              isSelected && isCorrect ? "border-green-600 bg-green-900/20 text-green-300" :
              isSelected && !isCorrect ? "border-red-600 bg-red-900/20 text-red-300" :
              isCorrect ? "border-green-700/50 bg-green-900/10 text-green-400" :
              "border-zinc-700/50 text-zinc-500";
            return (
              <div key={i} className={`flex items-start gap-2.5 px-3 py-2 border rounded ${optClass}`}>
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected && isCorrect ? "border-green-400 bg-green-400" :
                  isSelected && !isCorrect ? "border-red-400 bg-red-400" :
                  isCorrect ? "border-green-600" :
                  "border-zinc-600"
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs leading-snug">{opt}</span>
                {isCorrect && !isSelected && (
                  <Icon name="Check" size={12} className="text-green-500 shrink-0 ml-auto mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Множественный выбор */}
      {!matchQ && options && qType === "multi" && (
        <div className="flex flex-col gap-1.5 pl-1">
          {options.map((opt, i) => {
            const isSelected = selectedList.includes(opt);
            const isCorrect = Array.isArray(correct) && correct.includes(opt);
            const optClass =
              isSelected && isCorrect ? "border-green-600 bg-green-900/20 text-green-300" :
              isSelected && !isCorrect ? "border-red-600 bg-red-900/20 text-red-300" :
              isCorrect ? "border-green-700/50 bg-green-900/10 text-green-400" :
              "border-zinc-700/50 text-zinc-500";
            return (
              <div key={i} className={`flex items-start gap-2.5 px-3 py-2 border rounded ${optClass}`}>
                <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected && isCorrect ? "border-green-400 bg-green-400" :
                  isSelected && !isCorrect ? "border-red-400 bg-red-400" :
                  isCorrect ? "border-green-600" :
                  "border-zinc-600"
                }`}>
                  {isSelected && <Icon name="Check" size={9} className="text-white" />}
                </div>
                <span className="text-xs leading-snug">{opt}</span>
                {isCorrect && !isSelected && (
                  <Icon name="Check" size={12} className="text-green-500 shrink-0 ml-auto mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Открытый вопрос */}
      {!matchQ && qType === "open" && (
        <>
          <div className="pl-1">
            <p className="text-xs text-zinc-500 mb-1">Ответ сотрудника:</p>
            <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed bg-zinc-900/60 border border-zinc-700/50 px-3 py-2 rounded">
              {answer || <span className="text-zinc-600 italic">нет ответа</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-zinc-700/50">
            <span className="text-xs text-zinc-500">Баллов:</span>
            <input
              type="number"
              min={0}
              max={maxScore}
              value={manualScore}
              onChange={e => onManualScore(e.target.value)}
              className="w-14 bg-zinc-900 border border-zinc-700 text-xs px-2 py-1 text-zinc-200 outline-none focus:border-red-600 text-center rounded"
            />
            <span className="text-xs text-zinc-500">из {maxScore}</span>
          </div>
        </>
      )}

      {/* Легенда + ручные баллы для wrong multi */}
      {!matchQ && status === "wrong" && options && (
        <div className="flex flex-col gap-2 pt-1 border-t border-zinc-700/30">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-sm bg-green-700/50 inline-block" />выбрано верно
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-sm bg-red-700/50 inline-block" />выбрано неверно
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Icon name="Check" size={10} className="text-green-500" />правильный (не выбран)
            </span>
          </div>
          {qType === "multi" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Начислить баллов вручную:</span>
              <input
                type="number"
                min={0}
                max={maxScore}
                value={manualScore}
                onChange={e => onManualScore(e.target.value)}
                className="w-14 bg-zinc-900 border border-zinc-700 text-xs px-2 py-1 text-zinc-200 outline-none focus:border-red-600 text-center rounded"
              />
              <span className="text-xs text-zinc-500">из {maxScore}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
