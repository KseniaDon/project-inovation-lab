import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnAbbrSectionProps {
  go: (id: SectionId) => void;
}

const ABBR = [
  { abbr: "МЗ",      full: "Министерство Здравоохранения" },
  { abbr: "ЦГБ-Н",  full: "Центральная Городская Больница города Невский" },
  { abbr: "ОПСГО",  full: "Общие Правила Сотрудников Государственных Организаций" },
  { abbr: "ПРСГО",  full: "Правила Руководящего Состава Государственных Организаций" },
  { abbr: "ОУМЗ",   full: "Общий Устав Министерства Здравоохранения" },
  { abbr: "ВУ",     full: "Внутренний Устав" },
  { abbr: "ГСзФ",   full: "Главный Следящий за Фракциями" },
  { abbr: "ЗГСзФ",  full: "Заместитель Главного Следящего за Фракциями" },
  { abbr: "ГС",     full: "Главный Следящий" },
  { abbr: "ПГС",    full: "Помощник Главного Следящего" },
  { abbr: "ГВ",     full: "Главный Врач" },
  { abbr: "ПЗГВ",   full: "Первый Заместитель Главного Врача" },
  { abbr: "ЗГВ",    full: "Заместитель Главного Врача" },
  { abbr: "ЗО",     full: "Заведующий Отделением" },
  { abbr: "ЗЗО",    full: "Заместитель Заведующего Отделения" },
  { abbr: "ВрИО",   full: "Временно Исполняющий Обязанности" },
  { abbr: "ИО",     full: "Исполняющий Обязанности" },
  { abbr: "РС",     full: "Руководящий Состав" },
  { abbr: "МС",     full: "Младший Состав" },
  { abbr: "ОДС",    full: "Отделение Дневного Стационара" },
  { abbr: "ОИК",    full: "Отделение Инфекционного Контроля" },
  { abbr: "СОП",    full: "Стоматологическое Отделение Поликлиники" },
  { abbr: "ОПРС",   full: "Отделение Подготовки Руководящего Состава" },
  { abbr: "ОИ",     full: "Отделение Интернатуры" },
  { abbr: "АСМП",   full: "Автомобиль Скорой Медицинской Помощи" },
  { abbr: "ВСМП",   full: "Вертолёт Скорой Медицинской Помощи" },
  { abbr: "РАСМП",  full: "Реанимационный Автомобиль Скорой Медицинской Помощи" },
  { abbr: "ЖА",     full: "Журнал Активности" },
  { abbr: "МП",     full: "Мероприятие" },
  { abbr: "ПСЖ",    full: "По Собственному Желанию" },
  { abbr: "УП",     full: "Уважительная Причина" },
  { abbr: "ТКМ",    full: "Теоретический Квалификационный Модуль" },
  { abbr: "КМН",    full: "Кандидат Медицинских Наук" },
  { abbr: "ДМН",    full: "Доктор Медицинских Наук" },
];

export default function LearnAbbrSection({ go }: LearnAbbrSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-commands")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к командам
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
        <h1 className="text-3xl font-bold">Аббревиатуры</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">1.4. Аббревиатуры</p>

      <ul className="flex flex-col gap-2">
        {ABBR.map(({ abbr, full }) => (
          <li key={abbr} className="flex items-start gap-2 text-sm text-foreground">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            <span>
              <span className="font-bold text-red-500">{abbr}</span>
              {" — "}
              {full}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
