import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  SectionPreview,
  Section2Preview,
  Section3Preview,
  Section4Preview,
  Section5Preview,
} from "./TkmPreviewComponents";

const DEPARTMENTS = ["ОИК", "СОП", "ОДС"] as const;
type Dept = typeof DEPARTMENTS[number];

const SECTIONS = [
  { id: "1", label: "Раздел 1 — Отделение", points: 3 },
  { id: "2", label: "Раздел 2 — Уставная документация", points: 36 },
  { id: "3", label: "Раздел 3 — РП-сфера", points: 31 },
  { id: "4", label: "Раздел 4 — Препараты", points: 11 },
  { id: "5", label: "Раздел 5 — Медицина", points: 19 },
] as const;

export default function AdminTkmPreview() {
  const [dept, setDept] = useState<Dept>("ОИК");
  const [section, setSection] = useState<string>("1");

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* Шапка */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">Предпросмотр теста</p>
        <h2 className="text-base font-bold text-zinc-100">ТКМ — как видит проходящий</h2>
        <p className="text-xs text-zinc-500">Правильные ответы отмечены зелёными метками в мультивыборе. Тест интерактивен.</p>
      </div>

      {/* Выбор отделения */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-zinc-500 font-semibold">Отделение:</span>
        {DEPARTMENTS.map(d => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={`text-xs px-3 py-1.5 font-semibold border transition-colors ${
              dept === d
                ? "border-red-600 bg-red-600/10 text-red-400"
                : "border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Навигация по разделам */}
      <div className="flex gap-1 border-b border-zinc-800 flex-wrap">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`text-xs px-3 py-2.5 font-semibold tracking-wide transition-colors border-b-2 -mb-px whitespace-nowrap ${
              section === s.id
                ? "border-red-600 text-red-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {s.label}
            <span className="ml-1.5 text-zinc-600">({s.points} б.)</span>
          </button>
        ))}
      </div>

      {/* Содержимое раздела */}
      <div className="flex flex-col gap-4">
        {section === "1" && (
          <>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 flex items-center gap-2">
              <Icon name="Info" size={14} className="text-zinc-500 shrink-0" />
              <p className="text-xs text-zinc-500">Показывается раздел для отделения <span className="text-zinc-300 font-semibold">{dept}</span>. Переключите отделение выше.</p>
            </div>
            <SectionPreview dept={dept} />
          </>
        )}
        {section === "2" && <Section2Preview />}
        {section === "3" && <Section3Preview />}
        {section === "4" && <Section4Preview />}
        {section === "5" && <Section5Preview />}
      </div>
    </div>
  );
}
