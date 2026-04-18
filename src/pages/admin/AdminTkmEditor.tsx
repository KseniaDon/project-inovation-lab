import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  TKM_QUESTIONS, TKM_SECTION3, TKM_SECTION3_OPEN,
  TKM_SECTION3_RADIO2, TKM_SECTION3_MULTI, TKM_SECTION3_MATCH,
  TKM_SECTION4_RADIO, TKM_SECTION4_MULTI, TKM_SECTION4_RADIO2,
  TKM_SECTION4_STYLED, TKM_SECTION4_OPEN,
  TkmStyledMultiQuestion, TkmSection4OpenQuestion,
} from "../learn/tkmAnswerKey";

const DEPT_LABELS: Record<string, string> = {
  ОИК: "ОИК — Отделение инфекционного контроля",
  СОП: "СОП — Стоматологическое отделение поликлиники",
  ОДС: "ОДС — Отделение дневного стационара",
};

type EditableQuestion = { key: string; text: string; options: string[]; correct: string; points: number };
type EditableOpenQuestion = { key: string; num: number; title: string; situation?: string; example: string; notRequired: string; warning: string; points: number };
type EditableStyledMulti = TkmStyledMultiQuestion & { points: number };
type EditableSimpleOpen = TkmSection4OpenQuestion & { points: number };
type EditableMultiQuestion = { key: string; num: number; text: string; options: string[]; correct: string[]; points: number };

function initMcq() { return TKM_SECTION3.map(q => ({ ...q, points: 1 })); }
function initDeptMcq() {
  const r: Record<string, EditableQuestion[]> = {};
  for (const d of Object.keys(TKM_QUESTIONS)) r[d] = TKM_QUESTIONS[d].map(q => ({ ...q, points: 1 }));
  return r;
}
function initOpen() { return TKM_SECTION3_OPEN.map(q => ({ ...q, points: 5 })); }
function initS4Radio() { return TKM_SECTION4_RADIO.map(q => ({ ...q, points: 1 })); }
function initS4Radio2() { return TKM_SECTION4_RADIO2.map(q => ({ ...q, points: 1 })); }
function initS4Multi() { return TKM_SECTION4_MULTI.map(q => ({ ...q, points: 1 })); }
function initS4Styled() { return TKM_SECTION4_STYLED.map(q => ({ ...q, points: 4 })); }
function initS4Open() { return TKM_SECTION4_OPEN.map(q => ({ ...q, points: 4 })); }

/* ─── Компоненты предпросмотра (как на сайте) ─── */

function PreviewRadio({ num, text, options }: { num: number; text: string; options: string[] }) {
  const [val, setVal] = useState("");
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-200 leading-relaxed">
        <span className="font-bold">№{num}.</span> {text} <span className="text-red-500">*</span>
      </p>
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setVal(opt)}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${val === opt ? "border-red-500 bg-red-500" : "border-zinc-500 group-hover:border-red-400"}`}
            >
              {val === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-zinc-300" onClick={() => setVal(opt)}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PreviewCheckbox({ num, text, options }: { num: number; text: string; options: string[] }) {
  const [vals, setVals] = useState<string[]>([]);
  const toggle = (o: string) => setVals(v => v.includes(o) ? v.filter(x => x !== o) : [...v, o]);
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-200 leading-relaxed">
        <span className="font-bold">№{num}.</span> {text} <span className="text-red-500">*</span>
      </p>
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => toggle(opt)}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${vals.includes(opt) ? "border-red-500 bg-red-500" : "border-zinc-500 group-hover:border-red-400"}`}
            >
              {vals.includes(opt) && <Icon name="Check" size={10} className="text-white" />}
            </div>
            <span className="text-sm text-zinc-300 leading-snug" onClick={() => toggle(opt)}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PreviewMatch({ num, text, rows, columns }: { num: number; text: string; rows: { label: string; correct: string }[]; columns: string[] }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-200 leading-relaxed">
        <span className="font-bold">№{num}.</span> {text} <span className="text-red-500">*</span>
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs text-zinc-500 font-medium pb-3 pr-4 min-w-[160px]">Утверждение</th>
              {columns.map(col => (
                <th key={col} className="text-center text-xs font-semibold text-zinc-300 pb-3 px-3 min-w-[80px]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-zinc-800/30" : ""}>
                <td className="text-xs text-zinc-300 py-2.5 pr-4 leading-snug align-middle">{row.label}</td>
                {columns.map(col => {
                  const sel = vals[row.label] === col;
                  return (
                    <td key={col} className="text-center py-2.5 px-3 align-middle">
                      <button
                        onClick={() => setVals(v => ({ ...v, [row.label]: col }))}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto transition-colors ${sel ? "border-red-500 bg-red-500" : "border-zinc-500 hover:border-red-400"}`}
                      >
                        {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreviewOpen({ num, title, situation, example, notRequired, warning }: { num: number; title: string; situation?: string; example: string; notRequired: string; warning: string }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-2.5">
      <p className="text-sm font-medium text-zinc-200 leading-relaxed">
        <span className="font-bold">№{num}.</span> {title} <span className="text-red-500">*</span>
      </p>
      {situation && (
        <div><p className="text-xs font-bold text-zinc-300">Описание ситуации:</p><p className="text-xs text-zinc-400 leading-relaxed mt-0.5">{situation}</p></div>
      )}
      <div><p className="text-xs font-bold text-zinc-300">Пример:</p><p className="text-xs text-zinc-500 italic whitespace-pre-line mt-0.5">{example}</p></div>
      <p className="text-xs text-zinc-400"><span className="font-bold text-zinc-300">От вас НЕ требуется:</span> {notRequired}</p>
      <p className="text-xs font-bold text-zinc-300">Внимание! {warning}</p>
      <textarea disabled rows={2} placeholder="Развернутый ответ" className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-500 resize-none" />
    </div>
  );
}

function SectionPreview({ dept }: { dept: string }) {
  const deptQs = TKM_QUESTIONS[dept] || [];
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-1.5">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 1 из 8</span>
        <p className="text-sm font-bold text-zinc-200 mt-1">Ваше будущее отделение — {dept}</p>
        <p className="text-xs text-zinc-500">3 вопр. · макс. 3 б.</p>
      </div>
      {deptQs.map((q, i) => <PreviewRadio key={q.key} num={i + 1} text={q.text} options={q.options} />)}
    </div>
  );
}

function PreviewStyledCheckbox({ num, text, options, correct, highlightMode }: { num: number; text: string; options: string[]; correct: string[]; highlightMode: "correct" | "incorrect" }) {
  const [vals, setVals] = useState<string[]>([]);
  const toggle = (o: string) => setVals(v => v.includes(o) ? v.filter(x => x !== o) : [...v, o]);
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-200 leading-relaxed">
        <span className="font-bold">№{num}.</span>{" "}
        {highlightMode === "correct"
          ? <>Выберите <span className="font-bold">правильные</span> примеры отыгровки:</>
          : <>Выберите <span className="font-bold">неправильные</span> примеры отыгровки:</>
        }{" "}<span className="text-red-500">*</span>
      </p>
      <div className="flex flex-col gap-1.5">
        {options.map(opt => {
          const isCorrect = correct.includes(opt);
          return (
            <label key={opt} className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => toggle(opt)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${vals.includes(opt) ? "border-red-500 bg-red-500" : "border-zinc-500 group-hover:border-red-400"}`}
              >
                {vals.includes(opt) && <Icon name="Check" size={10} className="text-white" />}
              </div>
              <span className="text-sm leading-snug text-zinc-300" onClick={() => toggle(opt)}>{opt}</span>
              <span className={`text-xs px-1.5 py-0.5 shrink-0 mt-0.5 self-start rounded ${isCorrect ? "bg-green-900/40 text-green-400 border border-green-700/40" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>
                {isCorrect ? "✓" : "✗"}
              </span>
            </label>
          );
        })}
      </div>
      <p className="text-xs text-zinc-600">Зелёные метки видны только в admin-предпросмотре</p>
    </div>
  );
}

function PreviewSimpleOpen({ num, text }: { num: number; text: string }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-200 leading-relaxed">
        <span className="font-bold">№{num}.</span> {text} <span className="text-red-500">*</span>
      </p>
      <textarea disabled rows={3} placeholder="Развернутый ответ" className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-500 resize-none" />
    </div>
  );
}

function Section3Preview() {
  let num = 18;
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-1.5">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 3 из 8</span>
        <p className="text-sm font-bold text-zinc-200 mt-1">Раздел 3. RP-сфера</p>
        <p className="text-xs text-zinc-500">11 вопр. · макс. 31 б.</p>
      </div>
      {TKM_SECTION4_RADIO.map(q => { const n = num++; return <PreviewRadio key={q.key} num={n} text={q.text} options={q.options} />; })}
      {TKM_SECTION4_MULTI.map(q => { const n = num++; return <PreviewCheckbox key={q.key} num={n} text={q.text} options={q.options} />; })}
      {TKM_SECTION4_RADIO2.map(q => { const n = num++; return <PreviewRadio key={q.key} num={n} text={q.text} options={q.options} />; })}
      {TKM_SECTION4_STYLED.map(q => { const n = num++; return <PreviewStyledCheckbox key={q.key} num={n} text={q.text} options={q.options} correct={q.correct} highlightMode={q.highlightMode} />; })}
      {TKM_SECTION4_OPEN.map(q => { const n = num++; return <PreviewSimpleOpen key={q.key} num={n} text={q.text} />; })}
    </div>
  );
}

function Section2Preview() {
  const s3Qs = TKM_SECTION3;
  const openQs = TKM_SECTION3_OPEN;
  const radio2Qs = TKM_SECTION3_RADIO2;
  const multiQs = TKM_SECTION3_MULTI;
  const matchQs = TKM_SECTION3_MATCH;
  let num = 4;
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-1.5">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 2 из 8</span>
        <p className="text-sm font-bold text-zinc-200 mt-1">Раздел 2. Уставная документация</p>
        <p className="text-xs text-zinc-500">17 вопр. · макс. 40 б.</p>
      </div>
      {s3Qs.map(q => { const n = num++; return <PreviewRadio key={q.key} num={n} text={q.text} options={q.options} />; })}
      {openQs.map(q => { const n = num++; return <PreviewOpen key={q.key} num={n} title={q.title} situation={q.situation} example={q.example} notRequired={q.notRequired} warning={q.warning} />; })}
      {radio2Qs.map(q => { const n = num++; return <PreviewRadio key={q.key} num={n} text={q.text} options={q.options} />; })}
      {multiQs.map(q => { const n = num++; return <PreviewCheckbox key={q.key} num={n} text={q.text} options={q.options} />; })}
      {matchQs.map(q => { const n = num++; return <PreviewMatch key={q.key} num={n} text={q.text} rows={q.rows} columns={q.columns} />; })}
    </div>
  );
}

/* ─── Компоненты редактирования ─── */

function SectionHeader({ label, badge, expanded, onToggle, questionCount, maxPoints }: { label: string; badge?: string; expanded: boolean; onToggle: () => void; questionCount: number; maxPoints: number }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-colors text-left">
      <div className="flex items-center gap-3">
        {badge && <span className="text-xs px-2 py-0.5 bg-red-900/40 border border-red-700/50 text-red-400 font-semibold">{badge}</span>}
        <span className="text-sm font-semibold text-zinc-200">{label}</span>
        <span className="text-xs text-zinc-500">{questionCount} вопр. · макс. {maxPoints} б.</span>
      </div>
      <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={15} className="text-zinc-500 shrink-0" />
    </button>
  );
}

function McqCard({ q, index, onChange }: { q: EditableQuestion; index: number; onChange: (q: EditableQuestion) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 bg-zinc-900/30">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors">
        <span className="text-xs font-bold text-zinc-500 w-6 shrink-0">#{index + 1}</span>
        <span className="text-sm text-zinc-300 truncate flex-1">{q.text}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500">{q.points} б.</span>
          <div className={`text-xs px-2 py-0.5 border ${q.correct ? "border-green-700/50 text-green-400" : "border-zinc-700 text-zinc-500"}`}>
            {q.correct ? "✓ есть ответ" : "нет"}
          </div>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} className="text-zinc-600" />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-zinc-800">
          <div className="flex flex-col gap-1.5 mt-3">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Текст вопроса</label>
            <textarea value={q.text} onChange={e => onChange({ ...q, text: e.target.value })} rows={2} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Варианты ответов</label>
            <div className="flex flex-col gap-1.5">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <button onClick={() => onChange({ ...q, correct: opt })} className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${q.correct === opt ? "border-green-500 bg-green-500" : "border-zinc-600 hover:border-green-500"}`}>
                    {q.correct === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                  <input value={opt} onChange={e => { const o = [...q.options]; o[oi] = e.target.value; onChange({ ...q, options: o, correct: q.correct === opt ? e.target.value : q.correct }); }} className="flex-1 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { const o = q.options.filter((_, i) => i !== oi); onChange({ ...q, options: o, correct: q.correct === opt ? "" : q.correct }); }} className="text-zinc-600 hover:text-red-400 transition-colors p-1"><Icon name="X" size={13} /></button>
                </div>
              ))}
              <button onClick={() => onChange({ ...q, options: [...q.options, ""] })} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 mt-1 transition-colors"><Icon name="Plus" size={12} />Добавить вариант</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Баллы</label>
              <input type="number" min={0} value={q.points} onChange={e => onChange({ ...q, points: Number(e.target.value) })} className="w-20 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
            </div>
            {q.correct && <div className="flex flex-col gap-1"><label className="text-xs text-zinc-500 uppercase tracking-widest">Правильный ответ</label><span className="text-sm text-green-400 bg-green-900/20 border border-green-700/40 px-3 py-1.5">{q.correct}</span></div>}
          </div>
        </div>
      )}
    </div>
  );
}

function OpenCard({ q, onChange }: { q: EditableOpenQuestion; onChange: (q: EditableOpenQuestion) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 bg-zinc-900/30">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors">
        <span className="text-xs font-bold text-zinc-500 w-6 shrink-0">#{q.num}</span>
        <span className="text-sm text-zinc-300 truncate flex-1">{q.title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500">{q.points} б.</span>
          <span className="text-xs px-2 py-0.5 border border-zinc-700 text-zinc-500">открытый</span>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} className="text-zinc-600" />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-zinc-800">
          <div className="flex flex-col gap-1.5 mt-3">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Заголовок вопроса</label>
            <input value={q.title} onChange={e => onChange({ ...q, title: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
          </div>
          {q.situation !== undefined && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Описание ситуации</label>
              <textarea value={q.situation || ""} onChange={e => onChange({ ...q, situation: e.target.value })} rows={3} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Пример ответа</label>
            <textarea value={q.example} onChange={e => onChange({ ...q, example: e.target.value })} rows={3} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">«От вас НЕ требуется»</label>
            <input value={q.notRequired} onChange={e => onChange({ ...q, notRequired: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Максимум баллов</label>
            <input type="number" min={0} value={q.points} onChange={e => onChange({ ...q, points: Number(e.target.value) })} className="w-20 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
}

function StyledMultiCard({ q, onChange }: { q: EditableStyledMulti; onChange: (q: EditableStyledMulti) => void }) {
  const [open, setOpen] = useState(false);
  const toggleCorrect = (opt: string) => {
    const newCorrect = q.correct.includes(opt) ? q.correct.filter(c => c !== opt) : [...q.correct, opt];
    onChange({ ...q, correct: newCorrect });
  };
  return (
    <div className="border border-zinc-800 bg-zinc-900/30">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors">
        <span className="text-xs font-bold text-zinc-500 w-6 shrink-0">#{q.num}</span>
        <span className="text-sm text-zinc-300 truncate flex-1">{q.text}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500">{q.points} б.</span>
          <span className="text-xs px-2 py-0.5 border border-zinc-700 text-zinc-500">{q.highlightMode === "correct" ? "правильные" : "неправильные"}</span>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} className="text-zinc-600" />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-zinc-800">
          <div className="flex flex-col gap-1.5 mt-3">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Текст вопроса</label>
            <textarea value={q.text} onChange={e => onChange({ ...q, text: e.target.value })} rows={2} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Варианты (зелёный = правильный)</label>
            <div className="flex flex-col gap-1.5">
              {q.options.map((opt, oi) => {
                const isCorrect = q.correct.includes(opt);
                return (
                  <div key={oi} className="flex items-center gap-2">
                    <button onClick={() => toggleCorrect(opt)} className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${isCorrect ? "border-green-500 bg-green-500" : "border-zinc-600 hover:border-green-500"}`}>
                      {isCorrect && <Icon name="Check" size={9} className="text-white" />}
                    </button>
                    <input value={opt} onChange={e => {
                      const o = [...q.options]; o[oi] = e.target.value;
                      const newCorrect = q.correct.map(c => c === opt ? e.target.value : c);
                      onChange({ ...q, options: o, correct: newCorrect });
                    }} className="flex-1 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
                    <button onClick={() => { const o = q.options.filter((_, i) => i !== oi); onChange({ ...q, options: o, correct: q.correct.filter(c => c !== opt) }); }} className="text-zinc-600 hover:text-red-400 transition-colors p-1"><Icon name="X" size={13} /></button>
                  </div>
                );
              })}
              <button onClick={() => onChange({ ...q, options: [...q.options, ""] })} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 mt-1 transition-colors"><Icon name="Plus" size={12} />Добавить вариант</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Баллы</label>
              <input type="number" min={0} value={q.points} onChange={e => onChange({ ...q, points: Number(e.target.value) })} className="w-20 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleOpenCard({ q, onChange }: { q: EditableSimpleOpen; onChange: (q: EditableSimpleOpen) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 bg-zinc-900/30">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/40 transition-colors">
        <span className="text-xs font-bold text-zinc-500 w-6 shrink-0">#{q.num}</span>
        <span className="text-sm text-zinc-300 truncate flex-1">{q.text}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500">{q.points} б.</span>
          <span className="text-xs px-2 py-0.5 border border-zinc-700 text-zinc-500">открытый</span>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} className="text-zinc-600" />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-zinc-800">
          <div className="flex flex-col gap-1.5 mt-3">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Текст вопроса</label>
            <textarea value={q.text} onChange={e => onChange({ ...q, text: e.target.value })} rows={2} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Максимум баллов</label>
            <input type="number" min={0} value={q.points} onChange={e => onChange({ ...q, points: Number(e.target.value) })} className="w-20 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Главный компонент ─── */

type ViewMode = "edit" | "preview";

export default function AdminTkmEditor() {
  const [deptMcq, setDeptMcq] = useState<Record<string, EditableQuestion[]>>(initDeptMcq);
  const [section3, setSection3] = useState<EditableQuestion[]>(initMcq);
  const [openQuestions, setOpenQuestions] = useState<EditableOpenQuestion[]>(initOpen);
  const [s4Radio, setS4Radio] = useState<EditableQuestion[]>(initS4Radio);
  const [s4Radio2, setS4Radio2] = useState<EditableQuestion[]>(initS4Radio2);
  const [s4Multi, setS4Multi] = useState<EditableMultiQuestion[]>(initS4Multi);
  const [s4Styled, setS4Styled] = useState<EditableStyledMulti[]>(initS4Styled);
  const [s4Open, setS4Open] = useState<EditableSimpleOpen[]>(initS4Open);
  const [activeDept, setActiveDept] = useState<string>("ОИК");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ dept: true, s3: false, open: false, s4radio: false, s4styled: false, s4open: false });
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [previewSection, setPreviewSection] = useState<"1" | "2" | "3">("1");

  const toggle = (k: string) => setExpanded(v => ({ ...v, [k]: !v[k] }));

  const deptTotal = (dept: string) => (deptMcq[dept] || []).reduce((s, q) => s + q.points, 0);
  const s3Total = section3.reduce((s, q) => s + q.points, 0);
  const openTotal = openQuestions.reduce((s, q) => s + q.points, 0);
  const s4Total = [...s4Radio, ...s4Radio2, ...s4Multi, ...s4Styled, ...s4Open].reduce((s, q) => s + q.points, 0);
  const grandTotal = deptTotal(activeDept) + s3Total + openTotal + s4Total;

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
            <span>{(deptMcq[activeDept] || []).length + section3.length + openQuestions.length + s4Radio.length + s4Radio2.length + s4Multi.length + s4Styled.length + s4Open.length} вопр.</span>
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
            {(["1", "2", "3"] as const).map(s => (
              <button
                key={s}
                onClick={() => setPreviewSection(s)}
                className={`text-xs px-3 py-1.5 border transition-colors ${previewSection === s ? "border-red-600 text-red-400 bg-red-900/20" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
              >
                {s === "1" ? "Раздел 1 — Отделение" : s === "2" ? "Раздел 2 — Уставная документация" : "Раздел 3 — RP-сфера"}
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
        </>
      )}
    </div>
  );
}