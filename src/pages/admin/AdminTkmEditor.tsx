import { useState } from "react";
import Icon from "@/components/ui/icon";
import { TKM_QUESTIONS } from "../learn/tkmAnswerKey";
import {
  DEPT_LABELS,
  EditableQuestion,
  EditableMultiQuestion,
  initMcq,
  initDeptMcq,
  initOpen,
  initS4Radio,
  initS4Radio2,
  initS4Multi,
  initS4Styled,
  initS4Open,
  initS5Multi,
  initS5Open,
} from "./TkmEditorTypes";
import {
  SectionPreview,
  Section2Preview,
  Section3Preview,
  Section4Preview,
} from "./TkmPreviewComponents";
import {
  SectionHeader,
  McqCard,
  OpenCard,
  StyledMultiCard,
  SimpleOpenCard,
  S5OpenCard,
} from "./TkmEditCards";

type ViewMode = "edit" | "preview";

export default function AdminTkmEditor() {
  const [deptMcq, setDeptMcq] = useState(initDeptMcq);
  const [section3, setSection3] = useState(initMcq);
  const [openQuestions, setOpenQuestions] = useState(initOpen);
  const [s4Radio, setS4Radio] = useState(initS4Radio);
  const [s4Radio2, setS4Radio2] = useState(initS4Radio2);
  const [s4Multi, setS4Multi] = useState(initS4Multi);
  const [s4Styled, setS4Styled] = useState(initS4Styled);
  const [s4Open, setS4Open] = useState(initS4Open);
  const [s5Multi, setS5Multi] = useState(initS5Multi);
  const [s5Open, setS5Open] = useState(initS5Open);
  const [activeDept, setActiveDept] = useState<string>("ОИК");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ dept: true, s3: false, open: false, s4radio: false, s4styled: false, s4open: false, s5multi: false, s5open: false });
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [previewSection, setPreviewSection] = useState<"1" | "2" | "3" | "4">("1");

  const toggle = (k: string) => setExpanded(v => ({ ...v, [k]: !v[k] }));

  const deptTotal = (dept: string) => (deptMcq[dept] || []).reduce((s, q) => s + q.points, 0);
  const s3Total = section3.reduce((s, q) => s + q.points, 0);
  const openTotal = openQuestions.reduce((s, q) => s + q.points, 0);
  const s4Total = [...s4Radio, ...s4Radio2, ...s4Multi, ...s4Styled, ...s4Open].reduce((s, q) => s + q.points, 0);
  const s5Total = [...s5Multi, ...s5Open].reduce((s, q) => s + q.points, 0);
  const grandTotal = deptTotal(activeDept) + s3Total + openTotal + s4Total + s5Total;

  return (
    <div className="flex flex-col gap-5">
      {/* Шапка с переключателем режима */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">ТКМ — Структура теста</h2>
          <p className="text-xs text-zinc-500 mt-1">Просмотр и редактирование вопросов всех разделов.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-zinc-700 overflow-hidden">
            <button
              onClick={() => setViewMode("edit")}
              className={`text-xs px-3 py-2 flex items-center gap-1.5 transition-colors ${viewMode === "edit" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <Icon name="Pencil" size={12} />Редактирование
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`text-xs px-3 py-2 flex items-center gap-1.5 transition-colors border-l border-zinc-700 ${viewMode === "preview" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <Icon name="Eye" size={12} />Предпросмотр
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 px-3 py-2 border border-zinc-700 bg-zinc-900">
            <span>{(deptMcq[activeDept] || []).length + section3.length + openQuestions.length + s4Radio.length + s4Radio2.length + s4Multi.length + s4Styled.length + s4Open.length + s5Multi.length + s5Open.length} вопр.</span>
            <span className="text-zinc-600">·</span>
            <span>макс. {grandTotal} б.</span>
          </div>
        </div>
      </div>

      {/* ── ПРЕДПРОСМОТР ── */}
      {viewMode === "preview" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Раздел:</p>
            {(["1", "2", "3", "4"] as const).map(s => (
              <button
                key={s}
                onClick={() => setPreviewSection(s)}
                className={`text-xs px-3 py-1.5 border transition-colors ${previewSection === s ? "border-red-600 text-red-400 bg-red-900/20" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
              >
                {s === "1" ? "Раздел 1 — Отделение" : s === "2" ? "Раздел 2 — Уставная документация" : s === "3" ? "Раздел 3 — RP-сфера" : "Раздел 4 — Препараты"}
              </button>
            ))}
            {previewSection === "1" && (
              <div className="flex items-center gap-2 ml-2">
                <p className="text-xs text-zinc-500">Отделение:</p>
                {Object.keys(TKM_QUESTIONS).map(d => (
                  <button key={d} onClick={() => setActiveDept(d)} className={`text-xs px-3 py-1.5 border transition-colors ${activeDept === d ? "border-zinc-400 text-zinc-200" : "border-zinc-700 text-zinc-500 hover:border-zinc-500"}`}>{d}</button>
                ))}
              </div>
            )}
          </div>
          <div className="border border-zinc-800 bg-zinc-950/50 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Предпросмотр — как видит сотрудник</p>
            {previewSection === "1" && <SectionPreview dept={activeDept} />}
            {previewSection === "2" && <Section2Preview />}
            {previewSection === "3" && <Section3Preview />}
            {previewSection === "4" && <Section4Preview />}
          </div>
        </div>
      )}

      {/* ── РЕДАКТИРОВАНИЕ ── */}
      {viewMode === "edit" && (
        <>
          {/* Раздел 1 — отделение */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {Object.keys(TKM_QUESTIONS).map(dept => (
                <button key={dept} onClick={() => setActiveDept(dept)} className={`text-xs px-3 py-1.5 border transition-colors ${activeDept === dept ? "border-red-600 text-red-400 bg-red-900/20" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>{dept}</button>
              ))}
            </div>
            <SectionHeader
              label={DEPT_LABELS[activeDept] || activeDept}
              badge="Раздел 1"
              expanded={!!expanded.dept}
              onToggle={() => toggle("dept")}
              questionCount={(deptMcq[activeDept] || []).length}
              maxPoints={deptTotal(activeDept)}
            />
            {expanded.dept && (
              <div className="flex flex-col gap-1 mt-1">
                {(deptMcq[activeDept] || []).map((q, i) => (
                  <McqCard key={q.key} q={q} index={i} onChange={updated => setDeptMcq(prev => ({ ...prev, [activeDept]: prev[activeDept].map((x, xi) => xi === i ? updated : x) }))} />
                ))}
              </div>
            )}
          </div>

          {/* Раздел 2 — тестовые вопросы уставной доки */}
          <div className="flex flex-col gap-1">
            <SectionHeader
              label="Уставная документация — тестовые вопросы (№4–9)"
              badge="Раздел 2"
              expanded={!!expanded.s3}
              onToggle={() => toggle("s3")}
              questionCount={section3.length}
              maxPoints={s3Total}
            />
            {expanded.s3 && (
              <div className="flex flex-col gap-1 mt-1">
                {section3.map((q, i) => <McqCard key={q.key} q={q} index={i + 3} onChange={updated => setSection3(prev => prev.map((x, xi) => xi === i ? updated : x))} />)}
              </div>
            )}
          </div>

          {/* Раздел 2 — открытые вопросы */}
          <div className="flex flex-col gap-1">
            <SectionHeader
              label="Уставная документация — открытые вопросы (№10–14)"
              badge="Раздел 2"
              expanded={!!expanded.open}
              onToggle={() => toggle("open")}
              questionCount={openQuestions.length}
              maxPoints={openTotal}
            />
            {expanded.open && (
              <div className="flex flex-col gap-1 mt-1">
                {openQuestions.map(q => <OpenCard key={q.key} q={q} onChange={updated => setOpenQuestions(prev => prev.map(x => x.key === q.key ? updated : x))} />)}
              </div>
            )}
          </div>

          {/* Раздел 3 — RP-сфера — радио (№18–20, 22) */}
          <div className="flex flex-col gap-1">
            <SectionHeader
              label="RP-сфера — тестовые вопросы (№18–20, 22)"
              badge="Раздел 3"
              expanded={!!expanded.s4radio}
              onToggle={() => toggle("s4radio")}
              questionCount={s4Radio.length + s4Radio2.length + s4Multi.length}
              maxPoints={[...s4Radio, ...s4Radio2, ...s4Multi].reduce((s, q) => s + q.points, 0)}
            />
            {expanded.s4radio && (
              <div className="flex flex-col gap-1 mt-1">
                {s4Radio.map((q, i) => <McqCard key={q.key} q={q} index={17 + i} onChange={updated => setS4Radio(prev => prev.map((x, xi) => xi === i ? updated : x))} />)}
                {s4Multi.map((q, i) => <McqCard key={q.key} q={{ ...q, correct: q.correct.join(", ") }} index={20 + i} onChange={updated => setS4Multi(prev => prev.map((x, xi) => xi === i ? { ...updated, num: x.num, correct: updated.correct.split(", ").filter(Boolean) } : x))} />)}
                {s4Radio2.map((q, i) => <McqCard key={q.key} q={q} index={21 + i} onChange={updated => setS4Radio2(prev => prev.map((x, xi) => xi === i ? updated : x))} />)}
              </div>
            )}
          </div>

          {/* Раздел 3 — RP-сфера — примеры отыгровки (№23–27) */}
          <div className="flex flex-col gap-1">
            <SectionHeader
              label="RP-сфера — примеры отыгровки (№23–27)"
              badge="Раздел 3"
              expanded={!!expanded.s4styled}
              onToggle={() => toggle("s4styled")}
              questionCount={s4Styled.length}
              maxPoints={s4Styled.reduce((s, q) => s + q.points, 0)}
            />
            {expanded.s4styled && (
              <div className="flex flex-col gap-1 mt-1">
                {s4Styled.map(q => <StyledMultiCard key={q.key} q={q} onChange={updated => setS4Styled(prev => prev.map(x => x.key === q.key ? updated : x))} />)}
              </div>
            )}
          </div>

          {/* Раздел 3 — RP-сфера — открытый вопрос (№28) */}
          <div className="flex flex-col gap-1">
            <SectionHeader
              label="RP-сфера — открытый вопрос (№28)"
              badge="Раздел 3"
              expanded={!!expanded.s4open}
              onToggle={() => toggle("s4open")}
              questionCount={s4Open.length}
              maxPoints={s4Open.reduce((s, q) => s + q.points, 0)}
            />
            {expanded.s4open && (
              <div className="flex flex-col gap-1 mt-1">
                {s4Open.map(q => <SimpleOpenCard key={q.key} q={q} onChange={updated => setS4Open(prev => prev.map(x => x.key === q.key ? updated : x))} />)}
              </div>
            )}
          </div>

          {/* Раздел 4 — Препараты — мультивыбор (№29) */}
          <div className="flex flex-col gap-1">
            <SectionHeader
              label="Препараты — верные утверждения (№29)"
              badge="Раздел 4"
              expanded={!!expanded.s5multi}
              onToggle={() => toggle("s5multi")}
              questionCount={s5Multi.length}
              maxPoints={s5Multi.reduce((s, q) => s + q.points, 0)}
            />
            {expanded.s5multi && (
              <div className="flex flex-col gap-1 mt-1">
                {s5Multi.map((q, i) => <McqCard key={q.key} q={{ ...q, correct: q.correct.join(", ") }} index={28 + i} onChange={updated => setS5Multi(prev => prev.map((x, xi) => xi === i ? { ...updated, num: x.num, correct: updated.correct.split(", ").filter(Boolean) } : x))} />)}
              </div>
            )}
          </div>

          {/* Раздел 4 — Препараты — открытые вопросы (№30–31) */}
          <div className="flex flex-col gap-1">
            <SectionHeader
              label="Препараты — открытые вопросы (№30–31)"
              badge="Раздел 4"
              expanded={!!expanded.s5open}
              onToggle={() => toggle("s5open")}
              questionCount={s5Open.length}
              maxPoints={s5Open.reduce((s, q) => s + q.points, 0)}
            />
            {expanded.s5open && (
              <div className="flex flex-col gap-1 mt-1">
                {s5Open.map(q => <S5OpenCard key={q.key} q={q} onChange={updated => setS5Open(prev => prev.map(x => x.key === q.key ? updated : x))} />)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
