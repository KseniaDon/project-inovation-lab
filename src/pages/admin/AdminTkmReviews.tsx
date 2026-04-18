import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";
import {
  Submission,
  SubmissionDetail,
  STATUS_LABELS,
  OPEN_MAX_SCORES,
  formatDate,
  checkAnswer,
  getQuestionType,
  groupAnswersBySection,
} from "./TkmReviewTypes";
import TkmReviewModal from "./TkmReviewModal";

const TKM_URL = func2url["tkm"];

interface Props {
  reviewerNick: string;
}

export default function AdminTkmReviews({ reviewerNick }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [manualScores, setManualScores] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState("reviewed");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [dbScores, setDbScores] = useState<Record<string, number>>(OPEN_MAX_SCORES);

  // Загрузка актуальных макс. баллов из БД
  useEffect(() => {
    fetch(`${TKM_URL}?action=scores`)
      .then(r => r.json())
      .then((data: Record<string, number>) => {
        if (data && Object.keys(data).length) {
          setDbScores({ ...OPEN_MAX_SCORES, ...data });
        }
      })
      .catch(() => {});
  }, []);

  const getMaxScore = (key: string) => dbScores[key] ?? OPEN_MAX_SCORES[key] ?? 2;

  const load = async () => {
    setLoading(true);
    try {
      const url = filterStatus ? `${TKM_URL}?action=list&status=${filterStatus}` : `${TKM_URL}?action=list`;
      const res = await fetch(url);
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      setSubmissions([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterStatus]);

  const openDetail = async (id: number) => {
    setDetailLoading(true);
    setSaved(false);
    setExpandedSections({});
    try {
      const res = await fetch(`${TKM_URL}?action=get&id=${id}`);
      const data = await res.json();
      setSelected(data);
      const initScores: Record<string, string> = {};
      for (const key of Object.keys(data.answers || {})) {
        const qType = getQuestionType(key, data.department);
        const isOpenScored = getMaxScore(key) !== undefined && dbScores[key] !== undefined;
        const isWrongMulti = qType === "multi" && checkAnswer(key, data.answers[key], data.department) === "wrong";
        if (isOpenScored || isWrongMulti) {
          initScores[key] = "0";
        }
      }
      setManualScores(initScores);
      setComment(data.reviewer_comment || "");
      setReviewStatus(data.status === "pending" ? "reviewed" : data.status);
      const groups = groupAnswersBySection(data.answers || {});
      const expanded: Record<string, boolean> = {};
      groups.forEach(g => { expanded[g.label] = true; });
      setExpandedSections(expanded);
    } catch (e) {
      console.error(e);
    }
    setDetailLoading(false);
  };

  const calcAutoScore = (answers: Record<string, string>, dept: string) => {
    let auto = 0;
    for (const [key, val] of Object.entries(answers)) {
      const status = checkAnswer(key, val, dept);
      if (status === "correct") auto += 1;
    }
    return auto;
  };

  const calcManualTotal = () => {
    return Object.values(manualScores).reduce((sum, v) => sum + (Number(v) || 0), 0);
  };

  const saveReview = async () => {
    if (!selected) return;
    setSaving(true);
    const autoScore = calcAutoScore(selected.answers || {}, selected.department);
    const manualTotal = calcManualTotal();
    const totalScore = autoScore + manualTotal;
    const maxScore = 100;

    try {
      await fetch(`${TKM_URL}?action=review&id=${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: totalScore,
          max_score: maxScore,
          status: reviewStatus,
          reviewer: reviewerNick,
          comment,
        }),
      });
      setSaved(true);
      setSelected(null);
      load();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deleteSubmission = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Удалить эту заявку? Действие необратимо.")) return;
    setDeletingId(id);
    try {
      await fetch(`${TKM_URL}?action=delete&id=${id}`, { method: "POST" });
      load();
    } catch { /* ignore */ }
    setDeletingId(null);
  };

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Фильтр */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Фильтр:</p>
        {[
          { v: "pending", l: "Ожидают" },
          { v: "reviewed", l: "Сдали" },
          { v: "failed", l: "Не сдали" },
          { v: "", l: "Все" },
        ].map(opt => (
          <button
            key={opt.v}
            onClick={() => setFilterStatus(opt.v)}
            className={`text-xs px-3 py-1.5 border transition-colors ${filterStatus === opt.v ? "border-red-600 text-red-400 bg-red-900/20" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
          >
            {opt.l}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-zinc-500 hover:text-zinc-300 transition-colors">
          <Icon name="RefreshCw" size={14} />
        </button>
      </div>

      {/* Список заявок */}
      {loading ? (
        <p className="text-sm text-zinc-500">Загрузка...</p>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-zinc-500 py-4">Нет заявок</p>
      ) : (
        <div className="flex flex-col gap-2">
          {submissions.map(sub => (
            <div
              key={sub.id}
              className="border border-zinc-800 bg-zinc-900/40 px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:border-zinc-600 transition-colors"
              onClick={() => openDetail(sub.id)}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-zinc-200">{sub.nickname}</span>
                  <span className="text-xs text-zinc-500 px-1.5 py-0.5 border border-zinc-700">{sub.department}</span>
                  <span className={`text-xs font-medium ${STATUS_LABELS[sub.status]?.color || "text-zinc-400"}`}>
                    {STATUS_LABELS[sub.status]?.label || sub.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{formatDate(sub.submitted_at)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {sub.score !== null && (
                  <span className="text-sm font-bold text-foreground">{sub.score}/{sub.max_score}</span>
                )}
                <button
                  onClick={(e) => deleteSubmission(sub.id, e)}
                  disabled={deletingId === sub.id}
                  title="Удалить заявку"
                  className="text-zinc-600 hover:text-red-400 disabled:opacity-40 transition-colors p-1"
                >
                  <Icon name={deletingId === sub.id ? "Loader" : "Trash2"} size={14} />
                </button>
                <Icon name="ChevronRight" size={14} className="text-zinc-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно проверки */}
      {selected && (
        <TkmReviewModal
          selected={selected}
          detailLoading={detailLoading}
          manualScores={manualScores}
          comment={comment}
          reviewStatus={reviewStatus}
          saving={saving}
          saved={saved}
          expandedSections={expandedSections}
          dbScores={dbScores}
          onClose={() => setSelected(null)}
          onManualScore={(key, val) => setManualScores(prev => ({ ...prev, [key]: val }))}
          onCommentChange={setComment}
          onReviewStatusChange={setReviewStatus}
          onToggleSection={toggleSection}
          onSave={saveReview}
          calcAutoScore={calcAutoScore}
          calcManualTotal={calcManualTotal}
        />
      )}
    </div>
  );
}