import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnCharterSectionProps {
  go: (id: SectionId) => void;
}

const DOCS = [
  {
    title: "Общие правила для сотрудников государственных организаций",
    abbr: "ОПСГО",
    href: "https://forum.gtaprovince.ru/topic/816638-obschie-pravila-dlya-sotrudnikov-gosudarstvennyh-organizaciy/",
  },
  {
    title: "ФЕДЕРАЛЬНЫЙ ЗАКОН «ОБ ОСНОВАХ ОХРАНЫ ЗДОРОВЬЯ ГРАЖДАН»",
    abbr: "ФЗоОЗ",
    href: "https://forum.gtaprovince.ru/topic/724454-federalnyy-zakon-«ob-osnovah-ohrany-zdorovya-grazhdan»-ot-10052023-n-6-fz/",
  },
  {
    title: "Общий устав министерства здравоохранения",
    abbr: "ОУМЗ",
    href: "https://forum.gtaprovince.ru/topic/853771-mz-obschiy-ustav-ministerstva-zdravoohraneniya/",
  },
  {
    title: "Внутренний Устав ЦГБ-Н",
    abbr: "ВУ ЦГБ-Н",
    href: "https://forum.gtaprovince.ru/topic/995741-cgb-g-nevskiy-vnutrenniy-ustav/",
  },
  {
    title: "Общие правила использования сотрудниками личных транспортных средств",
    abbr: "ОПиЛТС",
    href: "https://forum.gtaprovince.ru/topic/816635-obschie-pravila-ispolzovaniya-sotrudnikami-lichnyh-transportnyh-sredstv/",
  },
];

export default function LearnCharterSection({ go }: LearnCharterSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-activity")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к журналу активности
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 2: Устав и правила</p>
        <h1 className="text-3xl font-bold">Уставная документация</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">2.4. Уставная документация</p>

      <div className="flex flex-col gap-3">
        {DOCS.map((doc) => (
          <a
            key={doc.abbr}
            href={doc.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-4 border border-border hover:border-red-600/60 transition-all duration-300 px-4 py-4 overflow-hidden"
          >
            <div className="flex items-stretch gap-0">
              <div className="w-1 shrink-0 bg-red-600 group-hover:w-1.5 transition-all duration-300 mr-4 rounded-sm" />
              <div className="flex flex-col gap-1">
                <p className="text-sm text-red-500 font-semibold leading-snug">{doc.title}</p>
                <span className="text-xs font-bold text-foreground bg-secondary border border-border px-2 py-0.5 w-fit">
                  {doc.abbr}
                </span>
              </div>
            </div>
            <Icon name="ExternalLink" size={15} className="text-muted-foreground group-hover:text-red-400 transition-colors duration-300 shrink-0 mt-0.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
