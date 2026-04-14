import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import RichContent from "@/components/ui/rich-content";

interface LearnDepartmentsSectionProps {
  go: (id: SectionId) => void;
}

type Dept = { abbr: string; full: string; color: string; desc?: string };

const COLOR_MAP: Record<string, { border: string; bg: string; text: string }> = {
  "text-green-400":  { border: "border-green-700/50",  bg: "bg-green-950/30",  text: "text-green-300"  },
  "text-sky-400":    { border: "border-sky-700/50",    bg: "bg-sky-950/30",    text: "text-sky-300"    },
  "text-red-400":    { border: "border-red-700/50",    bg: "bg-red-950/30",    text: "text-red-300"    },
  "text-pink-400":   { border: "border-pink-700/50",   bg: "bg-pink-950/30",   text: "text-pink-300"   },
  "text-orange-400": { border: "border-orange-700/50", bg: "bg-orange-950/30", text: "text-orange-300" },
  "text-yellow-400": { border: "border-yellow-700/50", bg: "bg-yellow-950/30", text: "text-yellow-300" },
  "text-purple-400": { border: "border-purple-700/50", bg: "bg-purple-950/30", text: "text-purple-300" },
  "text-zinc-400":   { border: "border-zinc-700/50",   bg: "bg-zinc-950/30",   text: "text-zinc-300"   },
};

const DEFAULT_DEPARTMENTS: Dept[] = [
  { abbr: "ОИ",   full: "Отделение Интернатуры",                     color: "text-green-400",  desc: "Это одно из отделений ЦГБ города Невский, сотрудники которого обучаются работе в нашей больнице. Самое первое отделение каждого сотрудника." },
  { abbr: "ОДС",  full: "Отделение Дневного Стационара",             color: "text-sky-400",    desc: "Сотрудники занимаются основной работой больницы, а также оказанием услуг на базе Травматолого-ортопедического центра, проведением проверок аптек и травматологических рейдов." },
  { abbr: "ОИК",  full: "Отделение Инфекционного Контроля",          color: "text-red-400",    desc: "Сотрудники занимаются основной работой больницы, а также оказанием услуг на базе НИИ Эпидемиологии, проведением санитарных проверок и инфекционных рейдов." },
  { abbr: "СОП",  full: "Стоматологическое Отделение Поликлиники",   color: "text-pink-400",   desc: "Сотрудники занимаются основной работой больницы, а также оказанием услуг на базе Стоматологической поликлиники «Дентист» и проведением стоматологических рейдов." },
  { abbr: "ОПРС", full: "Отделение Подготовки Руководящего Состава", color: "text-orange-400", desc: "Сотрудники проходят курсы повышения квалификации для дальнейшей работы в Руководящем составе больницы." },
];

export default function LearnDepartmentsSection({ go }: LearnDepartmentsSectionProps) {
  const departments = useSiteData<Dept[]>("departments", DEFAULT_DEPARTMENTS);
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
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 3: Экзамен</p>
        <h1 className="text-3xl font-bold">Отделения ЦГБ-Н</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">3.1. Отделения ЦГБ</p>

      <p className="text-base text-foreground leading-relaxed">
        Вы должны понимать структуру нашей больницы. Всего в нашей больнице{" "}
        <span className="font-bold underline">5 отделений</span>.
      </p>

      <ol className="flex flex-col gap-3">
        {departments.map((dept, idx) => {
          const colors = COLOR_MAP[dept.color] || COLOR_MAP["text-zinc-400"];
          return (
            <li key={dept.abbr} className="flex flex-col gap-1.5">
              <div className={`border ${colors.border} ${colors.bg} rounded-sm px-4 py-3 flex flex-col gap-1.5`}>
                <p className={`text-sm font-bold ${colors.text}`}>
                  {idx + 1}. {dept.full} ({dept.abbr})
                </p>
                {dept.desc && (
                  <div className="text-sm text-foreground leading-relaxed">
                    <RichContent html={dept.desc} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы на госпортале по отделениям:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/?do=findComment&comment=6982152"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Раздел 5. Отделения ЦГБ.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>
    </div>
  );
}