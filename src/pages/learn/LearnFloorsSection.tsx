import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";

interface LearnFloorsSectionProps {
  go: (id: SectionId) => void;
}

const DEFAULT_FLOORS = [
  { num: "1 этаж", desc: "лечение пациентов (только выписывание препарата в палатах с койками данного этажа);" },
  { num: "2 этаж", desc: "проведение процедур и операций;" },
  { num: "3 этаж", desc: "выдача мед.карт, проведение мед. комиссий (для 5+ рангов);" },
  { num: "4 этаж", desc: "оказание услуг организаций при отделениях (Травматолого-ортопедический центр, НИИ Эпидемиологии, Стоматологическая поликлиника «Дентист»);" },
  { num: "5 этаж", desc: "служебный, отдых сотрудников, проведение собеседований." },
];

export default function LearnFloorsSection({ go }: LearnFloorsSectionProps) {
  const FLOORS = useSiteData("floors", DEFAULT_FLOORS);
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
        <h1 className="text-2xl sm:text-3xl font-bold">Распределение этажей</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">2.2. Распределение этажей</p>

      <p className="text-base text-foreground leading-relaxed">
        В ЦГБ г. Невский есть распределение по этажам. Всего 5 этажей и у каждого из них своё назначение.
      </p>

      <ul className="flex flex-col gap-3">
        {FLOORS.map(({ num, desc }) => (
          <li key={num} className="flex items-start gap-2 text-base text-foreground leading-relaxed">
            <span className="shrink-0 mt-0.5">–</span>
            <span>
              <span className="text-red-500 font-medium">{num}</span>
              {" "}– {desc}
            </span>
          </li>
        ))}
      </ul>

      {/* Совет */}
      <div className="flex items-start gap-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700 rounded-sm px-4 py-3">
        <Icon name="Lightbulb" size={18} className="text-sky-500 shrink-0 mt-0.5" />
        <p className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed">
          <strong>Совет:</strong>{" "}
          Выдача витаминного комплекса (Компливит, Витрум) можно производить на любом из этажей, в любом месте, т.к. данные препараты не требуют полного осмотра пациента.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы на госпортале по распределению этажей:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/?do=findComment&comment=6982151"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Раздел 4. Распределение этажей и кабинетов.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>
    </div>
  );
}