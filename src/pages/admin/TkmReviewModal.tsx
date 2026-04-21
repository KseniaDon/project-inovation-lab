import Icon from "@/components/ui/icon";
import AnswerRow from "./TkmAnswerRow";
import {
  SubmissionDetail,
  OPEN_MAX_SCORES,
  formatDate,
  checkAnswer,
  getCorrectAnswer,
  getQuestionType,
  groupAnswersBySection,
  getAutoScore,
} from "./TkmReviewTypes";

interface Props {
  selected: SubmissionDetail;
  detailLoading: boolean;
  manualScores: Record<string, string>;
  comment: string;
  reviewStatus: string;
  saving: boolean;
  saved: boolean;
  expandedSections: Record<string, boolean>;
  dbScores: Record<string, number>;
  onClose: () => void;
  onManualScore: (key: string, val: string) => void;
  onCommentChange: (val: string) => void;
  onReviewStatusChange: (val: string) => void;
  onToggleSection: (label: string) => void;
  onSave: () => void;
  calcAutoScore: (answers: Record<string, string>, dept: string) => number;
  calcManualTotal: () => number;
}

export default function TkmReviewModal({
  selected,
  detailLoading,
  manualScores,
  comment,
  reviewStatus,
  saving,
  saved,
  expandedSections,
  dbScores,
  onClose,
  onManualScore,
  onCommentChange,
  onReviewStatusChange,
  onToggleSection,
  onSave,
  calcAutoScore,
  calcManualTotal,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-3xl my-8 flex flex-col">

        {/* Шапка */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
          <div>
            <p className="font-semibold text-zinc-100">{selected.nickname}</p>
            <p className="text-xs text-zinc-500">{selected.department} · {formatDate(selected.submitted_at)}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <Icon name="X" size={18} />
          </button>
        </div>

        {detailLoading ? (
          <p className="text-sm text-zinc-500 p-5">Загрузка...</p>
        ) : (
          <div className="flex flex-col gap-0 divide-y divide-zinc-800">

            {/* VK ссылка + кнопка Google Forms */}
            <div className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
              <a href={selected.vk_link} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1.5">
                <Icon name="ExternalLink" size={13} />
                {selected.vk_link}
              </a>
              <a
                href="https://docs.google.com/forms/d/1IOGPpJjesge1fM6UGaeHBa9zqr9uruKE6v5tJ_fS_e4/edit#responses"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-green-700 text-green-400 hover:bg-green-900/20 transition-colors"
              >
                <Icon name="ClipboardCheck" size={13} />
                Открыть в Google Forms
              </a>
            </div>

            {/* Ответы по разделам */}
            {groupAnswersBySection(selected.answers || {}).map(group => {
              const isOpen = expandedSections[group.label] !== false;
              const autoCorrect = group.keys.filter(k => checkAnswer(k, selected.answers[k], selected.department) === "correct").length;
              const autoWrong = group.keys.filter(k => checkAnswer(k, selected.answers[k], selected.department) === "wrong").length;
              const openCount = group.keys.filter(k => checkAnswer(k, selected.answers[k], selected.department) === "open").length;

              return (
                <div key={group.label}>
                  <button
                    onClick={() => onToggleSection(group.label)}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-zinc-900/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-zinc-300">{group.label}</span>
                      <div className="flex items-center gap-1.5">
                        {autoCorrect > 0 && <span className="text-xs px-1.5 py-0.5 bg-green-900/30 border border-green-700/40 text-green-400">{autoCorrect} верно</span>}
                        {autoWrong > 0 && <span className="text-xs px-1.5 py-0.5 bg-red-900/30 border border-red-700/40 text-red-400">{autoWrong} неверно</span>}
                        {openCount > 0 && <span className="text-xs px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400">{openCount} открытых</span>}
                      </div>
                    </div>
                    <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={14} className="text-zinc-600 shrink-0" />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 flex flex-col gap-2">
                      {group.keys.map(k => {
                        const qType = getQuestionType(k, selected.department);
                        const correctAns = getCorrectAnswer(k, selected.department);
                        const multiMax = qType === "multi" && Array.isArray(correctAns) ? correctAns.length : 2;
                        const maxScore = dbScores[k] ?? OPEN_MAX_SCORES[k] ?? (qType === "multi" ? multiMax : 2);
                        return (
                          <AnswerRow
                            key={k}
                            qKey={k}
                            answer={selected.answers[k] || ""}
                            dept={selected.department}
                            manualScore={manualScores[k] ?? "0"}
                            maxScore={maxScore}
                            onManualScore={v => onManualScore(k, v)}
                            autoScore={getAutoScore(k)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Итог и проверка */}
            <div className="px-5 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Итог проверки</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-400">Авто:</span>
                  <span className="font-semibold text-zinc-200">{calcAutoScore(selected.answers || {}, selected.department)} б.</span>
                  <span className="text-zinc-600">+</span>
                  <span className="text-zinc-400">Вручную:</span>
                  <span className="font-semibold text-zinc-200">{calcManualTotal()} б.</span>
                  <span className="text-zinc-600">=</span>
                  <span className="font-bold text-white text-base">{calcAutoScore(selected.answers || {}, selected.department) + calcManualTotal()} б.</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Статус</label>
                <div className="flex gap-2">
                  {[
                    { v: "reviewed", l: "Сдал", color: "border-green-600 text-green-400 bg-green-900/20" },
                    { v: "failed", l: "Не сдал", color: "border-red-600 text-red-400 bg-red-900/20" },
                  ].map(opt => (
                    <button
                      key={opt.v}
                      onClick={() => onReviewStatusChange(opt.v)}
                      className={`text-xs px-5 py-2 border transition-colors font-semibold ${reviewStatus === opt.v ? opt.color : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400">Комментарий (необязательно)</label>
                <textarea
                  value={comment}
                  onChange={e => onCommentChange(e.target.value)}
                  placeholder="Замечания для интерна..."
                  rows={3}
                  className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onSave}
                  disabled={saving || saved}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  {saved ? <><Icon name="Check" size={14} />Сохранено</> : saving ? "Сохраняю..." : <><Icon name="Save" size={14} />Сохранить результат</>}
                </button>
                <button onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-4 py-2.5">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}