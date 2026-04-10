import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnFloorsSectionProps {
  go: (id: SectionId) => void;
}

const FLOORS = [
  { num: "1 этаж", desc: "лечение пациентов (только выписывание препарата в палатах с койками данного этажа);" },
  { num: "2 этаж", desc: "проведение процедур и операций;" },
  { num: "3 этаж", desc: "выдача мед.карт, проведение мед. комиссий (для 5+ рангов);" },
  { num: "4 этаж", desc: "оказание услуг организаций при отделениях (Травматолого-ортопедический центр, НИИ Эпидемиологии, Стоматологическая поликлиника «Дентист»);" },
  { num: "5 этаж", desc: "служебный, отдых сотрудников, проведение собеседований.", noHighlight: true },
];

export default function LearnFloorsSection({ go }: LearnFloorsSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-schedule")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к графику работы
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 2: Устав и правила</p>
        <h1 className="text-3xl font-bold">Распределение этажей</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">2.2. Распределение этажей</p>

      <p className="text-base text-foreground leading-relaxed">
        В ЦГБ г. Невский есть распределение по этажам. Всего 5 этажей и у каждого из них своё назначение.
      </p>

      <ul className="flex flex-col gap-3">
        {FLOORS.map(({ num, desc, noHighlight }) => (
          <li key={num} className="flex items-start gap-2 text-base text-foreground leading-relaxed">
            <span className="shrink-0 mt-0.5">–</span>
            <span>
              <span className={noHighlight ? "font-medium" : "text-red-500 font-medium"}>{num}</span>
              {" "}– {desc}
            </span>
          </li>
        ))}
      </ul>

      {/* Совет */}
      <div className="flex items-start gap-3 bg-sky-950/30 border border-sky-700/50 rounded-sm px-5 py-4">
        <Icon name="Lightbulb" size={18} className="text-sky-400 shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold text-sky-400">Совет:</span>{" "}
          Выдача витаминного комплекса (Компливит, Витрум) можно производить на любом из этажей, в любом месте, т.к. данные препараты не требуют полного осмотра пациента.
        </p>
      </div>
    </div>
  );
}
