import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

const STEP1_ITEMS: { id: SectionId; label: string; num: string; icon: string }[] = [
  { id: "feldsher-ksmp",    label: "Рабочий транспорт",          num: "1.1", icon: "Ambulance" },
  { id: "feldsher-radio",   label: "Работа с рацией",            num: "1.2", icon: "Megaphone" },
  { id: "feldsher-pmp",     label: "ПМП",                        num: "1.3", icon: "HeartPulse" },
  { id: "feldsher-patrol",  label: "Пост и патрулирование",      num: "1.4", icon: "ShieldCheck" },
  { id: "feldsher-prmo",    label: "ПРМО",                       num: "1.5", icon: "ClipboardPlus" },
  { id: "feldsher-medhelp", label: "Оказание врачебной помощи",  num: "1.6", icon: "Syringe" },
  { id: "feldsher-wards",   label: "Специализация отделений",    num: "1.7", icon: "Microscope" },
];

const STEP2_ITEMS: { id: SectionId; label: string; num: string; icon: string }[] = [
  { id: "feldsher-mzportal", label: "МЗ Портал", num: "2.1", icon: "Globe" },
];

export default function LearnFeldsherSection({ go }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
        <h1 className="text-3xl font-bold">Фельдшер</h1>
      </div>

      <p className="text-base text-foreground leading-relaxed">
        Поздравляем с повышением до Фельдшера! Теперь тебе доступны новые обязанности и возможности в больнице.
      </p>

      {/* Основные задачи */}
      <div className="flex flex-col gap-4">
        <p className="text-base font-bold text-red-500">Основные задачи Фельдшера:</p>

        {/* Задача 1 — ОМЭ */}
        <div className="flex flex-col gap-3">
          <p className="text-base text-foreground leading-relaxed">
            1.{" "}
            <strong>Сдать Основной Медицинский Экзамен (ОМЭ)</strong>
          </p>

          {/* Блок ОМЭ в рамке */}
          <div className="border border-border rounded-sm px-5 py-4 flex flex-col gap-3">
            <p className="text-base font-semibold text-foreground">Основной Медицинский Экзамен (ОМЭ) включает в себя:</p>
            <ul className="flex flex-col gap-1.5 pl-1">
              {[
                "Информация о работе на транспорте больницы (АСМП, РАСМП);",
                "Информация о обработке вызова и ее практическая чать;",
                "Работа с докладами;",
                "Информация о ПМП и ее практическая часть на манекене;",
                "Информация о постах и патрулях и практическая составляющая поста;",
                "Информация о ПРМО РЖД (Предрейсовый Медицинский Осмотр машинистов РЖД), а также выезд по маршруту на базу РЖД;",
                "Практическая часть оказании обследования и процедуры на манекене;",
                "Практическая работа в выбранном Вами отделении.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Совет */}
          <div className="flex items-start gap-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700 rounded-sm px-4 py-3">
            <Icon name="Lightbulb" size={18} className="text-sky-500 shrink-0 mt-0.5" />
            <p className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed">
              <strong>Совет:</strong> Проводить ОМЭ Вам смогут сотрудники ОПРС (врачи-терапевты) или любой другой РС нашей больницы. Если Вам нужно будет сдать ОМЭ, обязательно отпишите это в беседке «Отделение Интернатуры» или подойдите на смене к врачу 6+, чтобы спросить, сможет ли Вам провести экзамен.
            </p>
          </div>
        </div>

        {/* Задача 2 */}
        <p className="text-base text-foreground leading-relaxed">
          2. Вылечить{" "}
          <strong className="text-red-500">10 пациентов</strong>.
        </p>

        {/* Задача 3 */}
        <p className="text-base text-foreground leading-relaxed">
          3. Посетить{" "}
          <strong className="text-red-500">1 строй</strong>{" "}
          руководящего состава.
        </p>
      </div>

      {/* Содержание — Шаг 1 */}
      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        <p className="text-xs uppercase tracking-widest text-zinc-500 select-none">Шаг 1: Сдача ОМЭ</p>
        <div className="flex flex-col gap-1">
          {STEP1_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="group flex items-center gap-3 px-3 py-2.5 border border-border hover:border-red-600/50 hover:bg-red-600/5 transition-all duration-200 text-left"
            >
              <span className="text-xs font-bold text-muted-foreground w-7 shrink-0">{item.num}</span>
              <Icon name={item.icon as "Flag"} size={14} className="text-muted-foreground group-hover:text-red-500 transition-colors shrink-0" />
              <span className="text-sm text-foreground group-hover:text-red-500 transition-colors font-medium">{item.label}</span>
              <Icon name="ChevronRight" size={13} className="ml-auto text-muted-foreground group-hover:text-red-400 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Содержание — Шаг 2 */}
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-zinc-500 select-none">Шаг 2: МЗ Портал</p>
        <div className="flex flex-col gap-1">
          {STEP2_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="group flex items-center gap-3 px-3 py-2.5 border border-border hover:border-red-600/50 hover:bg-red-600/5 transition-all duration-200 text-left"
            >
              <span className="text-xs font-bold text-muted-foreground w-7 shrink-0">{item.num}</span>
              <Icon name={item.icon as "Flag"} size={14} className="text-muted-foreground group-hover:text-red-500 transition-colors shrink-0" />
              <span className="text-sm text-foreground group-hover:text-red-500 transition-colors font-medium">{item.label}</span>
              <Icon name="ChevronRight" size={13} className="ml-auto text-muted-foreground group-hover:text-red-400 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
