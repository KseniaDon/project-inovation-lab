import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

const TKM_URL = func2url["tkm"];

interface Submission {
  id: number;
  nickname: string;
  vk_link: string;
  department: string;
  score: number | null;
  max_score: number | null;
  status: string;
  reviewer: string | null;
  reviewer_comment: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

interface SubmissionDetail extends Submission {
  answers: Record<string, string>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидает проверки", color: "text-yellow-400" },
  reviewed: { label: "Проверено", color: "text-green-400" },
  failed: { label: "Не сдал", color: "text-red-400" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

interface Props {
  reviewerNick: string;
}

export default function AdminTkmReviews({ reviewerNick }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [comment, setComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState("reviewed");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filterStatus, setFilterStatus] = useState("pending");

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
    try {
      const res = await fetch(`${TKM_URL}?action=get&id=${id}`);
      const data = await res.json();
      setSelected(data);
      setScore(data.score !== null ? String(data.score) : "");
      setMaxScore(data.max_score !== null ? String(data.max_score) : "100");
      setComment(data.reviewer_comment || "");
      setReviewStatus(data.status === "pending" ? "reviewed" : data.status);
    } catch (e) {
      console.error(e);
    }
    setDetailLoading(false);
  };

  const saveReview = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch(`${TKM_URL}?action=review&id=${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: score !== "" ? Number(score) : null,
          max_score: Number(maxScore) || 100,
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Фильтр:</p>
        {[
          { v: "pending", l: "Ожидают" },
          { v: "reviewed", l: "Проверено" },
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
                <Icon name="ChevronRight" size={14} className="text-zinc-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Детальный просмотр и проверка */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl my-8 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <div>
                <p className="font-semibold text-zinc-100">{selected.nickname}</p>
                <p className="text-xs text-zinc-500">{selected.department} · {formatDate(selected.submitted_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-zinc-300">
                <Icon name="X" size={18} />
              </button>
            </div>

            {detailLoading ? (
              <p className="text-sm text-zinc-500 p-5">Загрузка...</p>
            ) : (
              <div className="flex flex-col gap-5 p-5">
                <div className="flex flex-col gap-1">
                  <a href={selected.vk_link} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1.5">
                    <Icon name="ExternalLink" size={13} />
                    {selected.vk_link}
                  </a>
                </div>

                {/* Ответы */}
                {Object.keys(selected.answers || {}).length > 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Ответы</p>
                    {Object.entries(selected.answers).map(([q, a]) => (
                      <div key={q} className="border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                        <p className="text-xs text-zinc-400 mb-1">{q}</p>
                        <p className="text-sm text-zinc-200 whitespace-pre-wrap">{a}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Выставление баллов */}
                <div className="border-t border-zinc-800 pt-5 flex flex-col gap-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Проверка</p>

                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs text-zinc-400">Баллы</label>
                      <input
                        type="number"
                        value={score}
                        onChange={e => setScore(e.target.value)}
                        placeholder="0"
                        className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs text-zinc-400">Максимум</label>
                      <input
                        type="number"
                        value={maxScore}
                        onChange={e => setMaxScore(e.target.value)}
                        placeholder="100"
                        className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400">Статус</label>
                    <div className="flex gap-2">
                      {[
                        { v: "reviewed", l: "Сдал" },
                        { v: "failed", l: "Не сдал" },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setReviewStatus(opt.v)}
                          className={`text-xs px-4 py-2 border transition-colors ${reviewStatus === opt.v ? "border-red-600 text-red-400 bg-red-900/20" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
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
                      onChange={e => setComment(e.target.value)}
                      placeholder="Замечания для интерна..."
                      rows={3}
                      className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none"
                    />
                  </div>

                  <button
                    onClick={saveReview}
                    disabled={saving || saved}
                    className="self-start flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    {saved ? <><Icon name="Check" size={14} />Сохранено</> : saving ? "Сохраняю..." : <><Icon name="Save" size={14} />Сохранить результат</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}