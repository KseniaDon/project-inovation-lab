import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  EditableQuestion,
  EditableOpenQuestion,
  EditableStyledMulti,
  EditableSimpleOpen,
  EditableS5Open,
  EditableS6Open,
} from "./TkmEditorTypes";

export function SectionHeader({ label, badge, expanded, onToggle, questionCount, maxPoints }: { label: string; badge?: string; expanded: boolean; onToggle: () => void; questionCount: number; maxPoints: number }) {
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

export function McqCard({ q, index, onChange }: { q: EditableQuestion; index: number; onChange: (q: EditableQuestion) => void }) {
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

export function OpenCard({ q, onChange }: { q: EditableOpenQuestion; onChange: (q: EditableOpenQuestion) => void }) {
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

export function StyledMultiCard({ q, onChange }: { q: EditableStyledMulti; onChange: (q: EditableStyledMulti) => void }) {
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

export function SimpleOpenCard({ q, onChange }: { q: EditableSimpleOpen; onChange: (q: EditableSimpleOpen) => void }) {
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

export function S6OpenCard({ q, onChange }: { q: EditableS6Open; onChange: (q: EditableS6Open) => void }) {
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
          {q.example !== undefined && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Пример ответа</label>
              <textarea value={q.example || ""} onChange={e => onChange({ ...q, example: e.target.value })} rows={3} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Максимум баллов</label>
            <input type="number" min={0} value={q.points} onChange={e => onChange({ ...q, points: Number(e.target.value) })} className="w-20 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
}

export function S5OpenCard({ q, onChange }: { q: EditableS5Open; onChange: (q: EditableS5Open) => void }) {
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
          {q.hint !== undefined && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Подсказка</label>
              <textarea value={q.hint || ""} onChange={e => onChange({ ...q, hint: e.target.value })} rows={2} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none" />
            </div>
          )}
          {q.example !== undefined && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">Пример ответа</label>
              <textarea value={q.example || ""} onChange={e => onChange({ ...q, example: e.target.value })} rows={3} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors resize-none" />
            </div>
          )}
          {q.notRequired !== undefined && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">«От вас НЕ требуется»</label>
              <input value={q.notRequired || ""} onChange={e => onChange({ ...q, notRequired: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Максимум баллов</label>
            <input type="number" min={0} value={q.points} onChange={e => onChange({ ...q, points: Number(e.target.value) })} className="w-20 bg-zinc-900 border border-zinc-700 text-sm px-3 py-1.5 text-zinc-200 outline-none focus:border-red-600 transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
}