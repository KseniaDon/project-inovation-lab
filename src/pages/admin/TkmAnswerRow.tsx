import Icon from "@/components/ui/icon";
import { TKM_SECTION3_MATCH } from "../learn/tkmAnswerKey";
import {
  checkAnswer,
  getCorrectAnswer,
  getQuestionLabel,
  getQuestionNum,
  getQuestionOptions,
  getQuestionType,
  normalizeKey,
} from "./TkmReviewTypes";

interface AnswerRowProps {
  qKey: string;
  answer: string;
  dept: string;
  manualScore: string;
  maxScore: number;
  onManualScore: (v: string) => void;
  autoScore?: number;
}

export default function AnswerRow({ qKey, answer, dept, manualScore, maxScore, onManualScore, autoScore }: AnswerRowProps) {
  const nKey = normalizeKey(qKey);
  const status = checkAnswer(qKey, answer, dept);
  const correct = getCorrectAnswer(qKey, dept);
  const label = getQuestionLabel(qKey, dept);
  const num = getQuestionNum(qKey);
  const options = getQuestionOptions(qKey, dept);
  const qType = getQuestionType(qKey, dept);

  const matchQ = TKM_SECTION3_MATCH.find(q => q.key === nKey);

  let selectedList: string[] = [];
  const selectedSingle = answer;
  if (qType === "multi") {
    try { selectedList = JSON.parse(answer); } catch { selectedList = []; }
  }

  let matchAnswers: Record<string, string> = {};
  if (matchQ) {
    try { matchAnswers = JSON.parse(answer); } catch { matchAnswers = {}; }
  }

  const matchAllCorrect = matchQ
    ? matchQ.rows.every(row => {
        try { const sel: Record<string, string> = JSON.parse(answer); return sel[row.label] === row.correct; }
        catch { return false; }
      })
    : false;

  const cardBorder =
    status === "correct" ? "border-green-600/40 bg-green-950/20" :
    status === "wrong"   ? "border-red-600/40 bg-red-950/20" :
                           "border-zinc-700/50 bg-zinc-900/30";

  const scoreChip =
    status === "correct"
      ? <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-900/50 text-green-300 border border-green-600/40">{autoScore ?? maxScore} / {autoScore ?? maxScore} б.</span>
      : status === "wrong"
      ? <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-900/50 text-red-300 border border-red-600/40">0 / {autoScore ?? maxScore} б.</span>
      : null;

  return (
    <div className={`border rounded-xl px-5 py-4 flex flex-col gap-4 ${cardBorder}`}>

      {/* Заголовок */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1">
          {status === "correct" && <Icon name="CheckCircle" size={16} className="text-green-400 shrink-0 mt-0.5" />}
          {status === "wrong"   && <Icon name="XCircle"     size={16} className="text-red-400 shrink-0 mt-0.5" />}
          {status === "open"    && <Icon name="FileText"     size={16} className="text-zinc-500 shrink-0 mt-0.5" />}
          <p className="text-sm font-semibold text-zinc-100 leading-snug">
            {num ? <span className="text-zinc-500 font-normal mr-1">№{num}.</span> : null}
            {label || qKey}
          </p>
        </div>
        {(qType === "single" || qType === "match" || qType === "multi") && scoreChip}
      </div>

      {/* Вопрос на соответствие */}
      {matchQ && (
        <div className="flex flex-col gap-1.5">
          {matchQ.rows.map((row, i) => {
            const sel = matchAnswers[row.label];
            const isCorrect = sel === row.correct;
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm ${
                sel === undefined ? "border-zinc-700/50 bg-zinc-900/40 text-zinc-500" :
                isCorrect ? "border-green-500/50 bg-green-900/20 text-green-200" :
                "border-red-500/50 bg-red-900/20 text-red-200"
              }`}>
                <div className="shrink-0">
                  {sel === undefined ? <Icon name="Minus" size={14} className="text-zinc-600" /> :
                   isCorrect ? <Icon name="Check" size={14} className="text-green-400" /> :
                   <Icon name="X" size={14} className="text-red-400" />}
                </div>
                <span className="text-zinc-400 flex-1">{row.label}</span>
                <span className="font-semibold shrink-0">{sel ?? <span className="text-zinc-600 italic text-xs">не выбрано</span>}</span>
                {sel && !isCorrect && (
                  <span className="text-green-400 text-xs shrink-0">→ {row.correct}</span>
                )}
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 pt-1 text-xs text-zinc-500">
            <Icon name="Info" size={12} />
            Авто: {matchAllCorrect ? maxScore : 0} из {maxScore} б.
          </div>
        </div>
      )}

      {/* Одиночный выбор */}
      {!matchQ && options && qType === "single" && (
        <div className="flex flex-col gap-2">
          {options.map((opt, i) => {
            const isSelected = selectedSingle === opt;
            const isCorrectOpt = correct === opt;

            if (isSelected && isCorrectOpt) {
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-green-500/60 bg-green-900/25">
                  <div className="w-4 h-4 rounded-full border-2 border-green-400 bg-green-400 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span className="text-sm text-green-100 flex-1">{opt}</span>
                  <Icon name="Check" size={16} className="text-green-400 shrink-0" />
                </div>
              );
            }
            if (isSelected && !isCorrectOpt) {
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-red-500/60 bg-red-900/25">
                  <div className="w-4 h-4 rounded-full border-2 border-red-400 bg-red-400 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span className="text-sm text-red-100 flex-1">{opt}</span>
                  <Icon name="X" size={16} className="text-red-400 shrink-0" />
                </div>
              );
            }
            if (!isSelected && isCorrectOpt) {
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-green-600/30 bg-green-900/10">
                  <div className="w-4 h-4 rounded-full border-2 border-green-600/50 flex items-center justify-center shrink-0" />
                  <span className="text-sm text-green-300/80 flex-1">{opt}</span>
                  <Icon name="Check" size={14} className="text-green-500/70 shrink-0" />
                </div>
              );
            }
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-700/40 bg-zinc-900/20">
                <div className="w-4 h-4 rounded-full border-2 border-zinc-600/50 shrink-0" />
                <span className="text-sm text-zinc-500 flex-1">{opt}</span>
              </div>
            );
          })}

          {/* Верный ответ снизу если ответил неверно */}
          {status === "wrong" && typeof correct === "string" && (
            <div className="flex items-center gap-2 pt-1 mt-1 border-t border-zinc-700/40 text-xs text-zinc-400">
              <Icon name="CheckCircle" size={12} className="text-green-500 shrink-0" />
              <span>Верный ответ: <span className="text-green-400 font-semibold">{correct}</span></span>
            </div>
          )}
        </div>
      )}

      {/* Множественный выбор */}
      {!matchQ && options && qType === "multi" && (
        <div className="flex flex-col gap-2">
          {options.map((opt, i) => {
            const isSelected = selectedList.includes(opt);
            const isCorrectOpt = Array.isArray(correct) && correct.includes(opt);

            if (isSelected && isCorrectOpt) {
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-green-500/60 bg-green-900/25">
                  <div className="w-4 h-4 rounded border-2 border-green-400 bg-green-400 flex items-center justify-center shrink-0">
                    <Icon name="Check" size={10} className="text-white" />
                  </div>
                  <span className="text-sm text-green-100 flex-1">{opt}</span>
                  <Icon name="Check" size={16} className="text-green-400 shrink-0" />
                </div>
              );
            }
            if (isSelected && !isCorrectOpt) {
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-red-500/60 bg-red-900/25">
                  <div className="w-4 h-4 rounded border-2 border-red-400 bg-red-400 flex items-center justify-center shrink-0">
                    <Icon name="Check" size={10} className="text-white" />
                  </div>
                  <span className="text-sm text-red-100 flex-1">{opt}</span>
                  <Icon name="X" size={16} className="text-red-400 shrink-0" />
                </div>
              );
            }
            if (!isSelected && isCorrectOpt) {
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-green-600/30 bg-green-900/10">
                  <div className="w-4 h-4 rounded border-2 border-green-600/50 shrink-0" />
                  <span className="text-sm text-green-300/80 flex-1">{opt}</span>
                  <Icon name="Check" size={14} className="text-green-500/70 shrink-0" />
                </div>
              );
            }
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-700/40 bg-zinc-900/20">
                <div className="w-4 h-4 rounded border-2 border-zinc-600/50 shrink-0" />
                <span className="text-sm text-zinc-500 flex-1">{opt}</span>
              </div>
            );
          })}

          {/* Верные ответы снизу если неверно */}
          {status === "wrong" && Array.isArray(correct) && (
            <div className="flex items-start gap-2 pt-1 mt-1 border-t border-zinc-700/40 text-xs text-zinc-400">
              <Icon name="CheckCircle" size={12} className="text-green-500 shrink-0 mt-0.5" />
              <span>Верные ответы: <span className="text-green-400 font-semibold">{correct.join(", ")}</span></span>
            </div>
          )}
        </div>
      )}

      {/* Открытый вопрос */}
      {!matchQ && qType === "open" && (
        <>
          <div>
            <p className="text-xs text-zinc-500 mb-2">Ответ сотрудника:</p>
            <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed bg-zinc-900/60 border border-zinc-700/50 px-4 py-3 rounded-lg">
              {answer || <span className="text-zinc-600 italic">нет ответа</span>}
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1 border-t border-zinc-700/40">
            <span className="text-xs text-zinc-500">Баллов:</span>
            <input
              type="number"
              min={0}
              max={maxScore}
              value={manualScore}
              onChange={e => onManualScore(e.target.value)}
              className="w-16 bg-zinc-900 border border-zinc-700 text-sm px-2 py-1 text-zinc-200 outline-none focus:border-red-600 transition-colors rounded text-center"
            />
            <span className="text-xs text-zinc-500">из {maxScore}</span>
          </div>
        </>
      )}
    </div>
  );
}
