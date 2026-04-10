import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnDepartmentsSectionProps {
  go: (id: SectionId) => void;
}

const DEPARTMENTS = [
  {
    abbr: "ОИ",
    name: "Отделение Интернатуры",
    desc: "это одно из отделений ЦГБ города Невский, сотрудники которого обучаются работе в нашей больнице. Самое первое отделение каждого сотрудника.",
    border: "border-green-700/50",
    bg: "bg-green-950/30",
    text: "text-green-300",
  },
  {
    abbr: "ОДС",
    name: "Отделение Дневного Стационара",
    desc: "это одно из отделений ЦГБ города Невский, сотрудники которого занимаются как основной работой больницы, так и оказанием услуг на базе Травматолого-ортопедического центра, проведением проверок аптек и травматологических рейдов для населения и сотрудников государственных организаций.",
    border: "border-sky-700/50",
    bg: "bg-sky-950/30",
    text: "text-sky-300",
  },
  {
    abbr: "ОИК",
    name: "Отделение Инфекционного Контроля",
    desc: "это одно из отделений ЦГБ города Невский, сотрудники которого занимаются как основной работой больницы, так и оказанием услуг на базе НИИ Эпидемиологии, проведением санитарных проверок и инфекционных рейдов для населения и сотрудников государственных организаций.",
    border: "border-red-700/50",
    bg: "bg-red-950/30",
    text: "text-red-300",
  },
  {
    abbr: "СОП",
    name: "Стоматологическое Отделение Поликлиники",
    desc: 'это одно из отделений ЦГБ города Невский, сотрудники которого занимаются как основной работой больницы, так и оказанием услуг на базе Стоматологической поликлиники "Дентист" и проведением стоматологических рейдов для населения и сотрудников государственных организаций.',
    border: "border-pink-700/50",
    bg: "bg-pink-950/30",
    text: "text-pink-300",
  },
  {
    abbr: "ОПРС",
    name: "Отделение Подготовки Руководящего Состава",
    desc: "это одно из отделений ЦГБ города Невский, сотрудники которого проходят курсы повышения квалификации для дальнейшей работы в Руководящем составе больницы.",
    border: "border-blue-700/50",
    bg: "bg-blue-950/30",
    text: "text-blue-300",
  },
];

export default function LearnDepartmentsSection({ go }: LearnDepartmentsSectionProps) {
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

      <p className="text-base font-semibold text-muted-foreground">3.3. Отделения ЦГБ</p>

      <p className="text-base text-foreground leading-relaxed">
        <span className="font-bold underline">Ты должен понимать структуру нашей больницы. Всего в нашей больнице 5 отделений.</span>
      </p>

      <ol className="flex flex-col gap-3">
        {DEPARTMENTS.map(({ abbr, name, desc, border, bg, text }, idx) => (
          <li key={abbr} className="flex flex-col gap-1.5">
            <div className={`border ${border} ${bg} rounded-sm px-4 py-3 flex flex-col gap-1`}>
              <p className={`text-sm font-bold ${text}`}>
                {idx + 1}. {name} ({abbr})
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                — {desc}
              </p>
            </div>
          </li>
        ))}
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