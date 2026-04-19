import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  TKM_QUESTIONS,
  TKM_SECTION3,
  TKM_SECTION3_OPEN,
  TKM_SECTION3_RADIO2,
  TKM_SECTION3_MULTI,
  TKM_SECTION3_MATCH,
  TKM_SECTION4_RADIO,
  TKM_SECTION4_MULTI,
  TKM_SECTION4_RADIO2,
  TKM_SECTION4_STYLED,
  TKM_SECTION4_OPEN,
  TKM_SECTION5_MULTI,
  TKM_SECTION5_OPEN,
  TKM_SECTION6_SINGLE,
  TKM_SECTION6_MULTI,
  TKM_SECTION6_OPEN,
} from "../learn/tkmAnswerKey";

export function PreviewRadio({ num, text, options }: { num: number; text: string; options: string[] }) {
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

export function PreviewCheckbox({ num, text, options }: { num: number; text: string; options: string[] }) {
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

export function PreviewMatch({ num, text, rows, columns }: { num: number; text: string; rows: { label: string; correct: string }[]; columns: string[] }) {
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

export function PreviewOpen({ num, title, situation, example, notRequired, warning }: { num: number; title: string; situation?: string; example: string; notRequired: string; warning: string }) {
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

export function PreviewStyledCheckbox({ num, text, options, correct, highlightMode }: { num: number; text: string; options: string[]; correct: string[]; highlightMode: "correct" | "incorrect" }) {
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

export function PreviewSimpleOpen({ num, text }: { num: number; text: string }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-200 leading-relaxed">
        <span className="font-bold">№{num}.</span> {text} <span className="text-red-500">*</span>
      </p>
      <textarea disabled rows={3} placeholder="Развернутый ответ" className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-500 resize-none" />
    </div>
  );
}

export function PreviewSection5Open({ num, text, hint, example, notRequired, warning }: { num: number; text: string; hint?: string; example?: string; notRequired?: string; warning?: string }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-2.5">
      <p className="text-sm font-medium text-zinc-200 leading-relaxed">
        <span className="font-bold">№{num}.</span> {text} <span className="text-red-500">*</span>
      </p>
      {hint && <p className="text-xs text-zinc-400 leading-relaxed"><span className="font-bold text-zinc-300">Подсказка: </span>{hint}</p>}
      {example && <div><p className="text-xs font-bold text-zinc-300">Пример:</p><p className="text-xs text-zinc-500 italic whitespace-pre-line mt-0.5">{example}</p></div>}
      {notRequired && <p className="text-xs text-zinc-400"><span className="font-bold text-zinc-300">От вас не требуется:</span> {notRequired}</p>}
      {warning && <p className="text-xs font-bold text-zinc-300">Внимание! {warning}</p>}
      <textarea disabled rows={2} placeholder="Развернутый ответ" className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-500 resize-none" />
    </div>
  );
}

export function SectionPreview({ dept }: { dept: string }) {
  const deptQs = TKM_QUESTIONS[dept] || [];
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-1.5">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 1 из 5</span>
        <p className="text-sm font-bold text-zinc-200 mt-1">Ваше будущее отделение — {dept}</p>
        <p className="text-xs text-zinc-500">3 вопр. · макс. 3 б.</p>
      </div>
      {deptQs.map((q, i) => <PreviewRadio key={q.key} num={i + 1} text={q.text} options={q.options} />)}
    </div>
  );
}

export function Section2Preview() {
  const s3Qs = TKM_SECTION3;
  const openQs = TKM_SECTION3_OPEN;
  const radio2Qs = TKM_SECTION3_RADIO2;
  const multiQs = TKM_SECTION3_MULTI;
  const matchQs = TKM_SECTION3_MATCH;
  let num = 4;
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-1.5">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 2 из 5</span>
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

export function Section3Preview() {
  let num = 18;
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-1.5">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 3 из 5</span>
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

export function Section4Preview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-1.5">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 4 из 5</span>
        <p className="text-sm font-bold text-zinc-200 mt-1">Раздел 4. Препараты</p>
        <p className="text-xs text-zinc-500">3 вопр. · макс. 11 б.</p>
      </div>
      {TKM_SECTION5_MULTI.map(q => <PreviewCheckbox key={q.key} num={q.num} text={q.text} options={q.options} />)}
      {TKM_SECTION5_OPEN.map(q => <PreviewSection5Open key={q.key} num={q.num} text={q.text} hint={q.hint} example={q.example} notRequired={q.notRequired} warning={q.warning} />)}
    </div>
  );
}

export function Section5Preview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-1.5">
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold self-start">Раздел 5 из 5</span>
        <p className="text-sm font-bold text-zinc-200 mt-1">Раздел 5. Медицина</p>
        <p className="text-xs text-zinc-500">7 вопр. · макс. 19 б.</p>
      </div>
      {TKM_SECTION6_SINGLE.map((q, i) => {
        const nums: Record<string, number> = { "5.32": 32, "5.34": 34 };
        return <PreviewRadio key={q.key} num={nums[q.key] ?? (32 + i)} text={q.text} options={q.options} />;
      })}
      {TKM_SECTION6_MULTI.map(q => <PreviewCheckbox key={q.key} num={q.num} text={q.text} options={q.options} />)}
      {TKM_SECTION6_OPEN.map(q => (
        <div key={q.key} className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 flex flex-col gap-2.5">
          <p className="text-sm font-medium text-zinc-200 leading-relaxed">
            <span className="font-bold">№{q.num}.</span> {q.text} <span className="text-red-500">*</span>
          </p>
          {q.subQuestions && (
            <ol className="flex flex-col gap-0.5">
              {q.subQuestions.map((sq, i) => (
                <li key={i} className="text-xs text-zinc-400"><span className="font-medium">{i + 1}.</span> {sq}</li>
              ))}
            </ol>
          )}
          {q.example && <div><p className="text-xs font-bold text-zinc-300">Пример:</p><p className="text-xs text-zinc-500 italic whitespace-pre-line mt-0.5">{q.example}</p></div>}
          {q.warning && <p className="text-xs font-bold text-zinc-300">Внимание! {q.warning}</p>}
          <textarea disabled rows={2} placeholder="Развернутый ответ" className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-500 resize-none" />
        </div>
      ))}
    </div>
  );
}