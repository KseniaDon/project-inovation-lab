import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnBindsSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnBindsSection({ go }: LearnBindsSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к Интерну
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 1: Подготовка</p>
        <h1 className="text-3xl font-bold">Настройка биндов</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">1.1 Настройка биндов.</p>

      <p className="text-base text-foreground leading-relaxed">
        Как и говорилось ранее, устная речь — это бинды. Слово «Бинд» в РП мы не используем!
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Бинды — это твой главный рабочий инструмент. Они экономят время и обеспечивают качественную РП-отыгровку.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Официальная тема на госпортале с биндами:</p>
        <a
          href="https://forum.gtaprovince.ru/topic/995732-cgb-g-nevskiy-bindy-dlya-sotrudnikov/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base text-red-500 hover:text-red-400 transition-colors font-semibold"
        >
          <Icon name="ExternalLink" size={16} />
          Бинды для сотрудников
        </a>
      </div>

      <div className="bg-secondary border border-border px-5 py-4">
        <p className="text-sm text-foreground leading-relaxed">
          Обязательно установите бинды, меняя на свои данные в нужных местах.
        </p>
      </div>

      {/* Пошаговая инструкция */}
      <div className="border border-border rounded-sm p-4 sm:p-6 flex flex-col gap-5">
        <h2 className="text-lg font-bold text-red-500 text-center">Пошаговая инструкция по установке биндов</h2>

        {/* Шаг 1 */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-center text-foreground">Шаг 1: Установка бинда</p>

          <ol className="flex flex-col gap-2">
            <li className="flex items-start gap-2 text-sm text-foreground">
              <span className="shrink-0 font-medium text-muted-foreground">1.</span>
              <span>Перейдите по официальной ссылке на форум (см. выше);</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-foreground">
              <span className="shrink-0 font-medium text-muted-foreground">2.</span>
              <span>
                На открывшейся странице найдите и скопируйте нужный текст для приветствия (выделено красным) на{" "}
                <span className="text-foreground font-semibold">скриншоте №1</span>;
              </span>
            </li>
          </ol>

          <img
            src="https://skrinshoter.ru/s/100426/vF4l2KCt.jpg?download=1&name=%D0%A1%D0%BA%D1%80%D0%B8%D0%BD%D1%88%D0%BE%D1%82-10-04-2026%2016:14:36.jpg"
            alt="Скриншот №1"
            className="w-full rounded-sm border border-border mt-1"
          />
          <p className="text-xs text-muted-foreground text-center">Скриншот №1: Выделенный текст для копирования</p>
        </div>

        {/* Важное правило */}
        <div className="flex items-start gap-3 bg-red-950/30 border border-red-800/40 rounded-sm px-4 py-3">
          <Icon name="AlertTriangle" size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold text-red-400">Важное правило:</span> Настройку биндов необходимо производить построчно. Не копируйте весь блок текста сразу!
          </p>
        </div>

        {/* Шаг 2 */}
        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          <p className="text-base font-semibold text-center text-foreground">Шаг 2: Настройка первой строки (Приветствие)</p>

          <ol className="flex flex-col gap-4">
            <li className="flex items-start gap-2 text-sm text-foreground">
              <span className="shrink-0 font-medium text-muted-foreground">1.</span>
              <span>
                Скопируйте первую строку бинда (она начинается с{" "}
                <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono italic">bind</code>
                );
              </span>
            </li>

            <li className="flex flex-col gap-2 text-sm text-foreground">
              <div className="flex items-start gap-2">
                <span className="shrink-0 font-medium text-muted-foreground">2.</span>
                <span>
                  Откройте игру и нажмите клавишу{" "}
                  <span className="font-bold text-red-500">F8</span>
                  , чтобы открыть консоль разработчика, как на{" "}
                  <span className="font-semibold text-foreground">скриншоте №2</span>;
                </span>
              </div>
              <div className="w-full rounded-sm border border-dashed border-border bg-secondary flex items-center justify-center py-6 sm:py-10 text-xs text-muted-foreground ml-0 sm:ml-5">
                Скриншот будет добавлен позже
              </div>
              <p className="text-xs text-muted-foreground text-center ml-0 sm:ml-5">Скриншот №2: Консоль разработчика (F8).</p>
            </li>

            <li className="flex flex-col gap-3 text-sm text-foreground">
              <div className="flex items-start gap-2">
                <span className="shrink-0 font-medium text-muted-foreground">3.</span>
                <span>
                  Вставьте скопированную строку в консоль{" "}
                  <span className="font-bold">(Ctrl + V)</span>.{" "}
                  <span className="text-red-500 font-semibold inline-flex items-center gap-1">
                    <Icon name="AlertTriangle" size={13} className="shrink-0" />
                    Не нажимайте Enter!
                  </span>
                </span>
              </div>

              <p className="text-sm font-semibold text-foreground ml-2 sm:ml-5">Редактирование бинда:</p>
              <p className="text-sm text-foreground ml-2 sm:ml-5">
                Замените шаблон <span className="font-bold">Имя Фамилия</span> на ваше Имя и Фамилию на русском языке (например, Ксения Донская).
              </p>

              <div className="ml-2 sm:ml-5 border-l-2 border-red-600/40 pl-2 sm:pl-4">
                <p className="text-sm text-muted-foreground italic">
                  Убедитесь, что в строке отсутствует символ звёздочки *.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2 text-sm text-foreground">
              <span className="shrink-0 font-medium text-muted-foreground">4.</span>
              <span>
                После того как вы заменили имя и фамилию, нажмите <span className="font-bold">Enter</span>.
              </span>
            </li>
          </ol>

          {/* Проверка */}
          <div className="border border-border rounded-sm p-4 flex flex-col gap-3 bg-secondary/40">
            <p className="text-sm font-semibold text-foreground">Проверка:</p>
            <p className="text-sm text-foreground">
              Если в консоли появилась строка вида:
            </p>
            <div className="bg-secondary border border-border rounded-sm px-4 py-3 overflow-x-auto">
              <code className="text-xs text-muted-foreground font-mono">
                * Bound key '1' 'down' to command 'say Здравствуйте, меня зовут [Ваше ИМЯ и ФАМИЛИЯ], я сотрудник ЦГБ города Невский'
              </code>
            </div>
            <p className="text-sm text-foreground">— вы всё сделали правильно.</p>
          </div>
        </div>

        {/* Шаг 3 */}
        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          <p className="text-base font-semibold text-center text-foreground">Шаг 3: Настройка второй строки (Бейдж)</p>

          <ol className="flex flex-col gap-4">
            <li className="flex flex-col gap-2 text-sm text-foreground">
              <div className="flex items-start gap-2">
                <span className="shrink-0 font-medium text-muted-foreground">1.</span>
                <span>Скопируйте вторую строку бинда:</span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(`bind 2 do На груди висит бейдж: "ЦГБ г. Невский | *Должность* | Отделение интернатуры | *Имя Фамилия*".`)}
                className="ml-2 sm:ml-5 bg-secondary border border-border rounded-sm px-4 py-3 text-left group relative hover:border-muted-foreground transition-colors overflow-x-auto"
              >
                <code className="text-xs text-muted-foreground font-mono">
                  bind 2 do На груди висит бейдж: "ЦГБ г. Невский | *Должность* | Отделение интернатуры | *Имя Фамилия*".
                </code>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Icon name="Copy" size={12} />
                  Копировать
                </span>
              </button>
            </li>

            <li className="flex flex-col gap-3 text-sm text-foreground">
              <div className="flex items-start gap-2">
                <span className="shrink-0 font-medium text-muted-foreground">2.</span>
                <span>Вставьте строку в консоль и отредактируйте два поля:</span>
              </div>
              <div className="ml-2 sm:ml-5 flex flex-col gap-2">
                <p className="text-sm text-foreground">
                  Замените{" "}
                  <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono">*Должность*</code>{" "}
                  на <span className="font-bold">Интерн</span>.
                </p>
                <p className="text-sm text-foreground">
                  Замените{" "}
                  <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono">*Имя Фамилия*</code>{" "}
                  на ваше <span className="font-bold">ИМЯ и ФАМИЛИЮ</span> на русском языке.
                </p>
              </div>
            </li>

            <li className="flex flex-col gap-2 text-sm text-foreground">
              <div className="flex items-start gap-2">
                <span className="shrink-0 font-medium text-muted-foreground">3.</span>
                <span>Нажмите <span className="font-bold">Enter</span>.</span>
              </div>
              <div className="ml-2 sm:ml-5 border border-border rounded-sm p-4 flex flex-col gap-2 bg-secondary/40">
                <p className="text-sm font-semibold text-foreground">Проверка:</p>
                <p className="text-sm text-foreground">Если в консоли появилась строка, содержащая <span className="font-bold">Интерн</span> и ваше имя с фамилией, вы сделали всё верно.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Шаг 4 */}
        <div className="flex flex-col gap-4 pt-2 border-t border-border">
          <p className="text-base font-semibold text-center text-foreground">Шаг 4: Завершение настройки</p>
          <p className="text-sm text-foreground leading-relaxed">
            Остальные строки биндов не требуют ручной корректировки ваших данных.
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Просто продолжайте <span className="font-bold">построчно</span> копировать и вставлять все оставшиеся бинды из списка, нажимая <span className="font-bold">Enter</span> после каждой строки.
          </p>

          <div className="text-center py-4">
            <p className="text-xl font-bold text-red-500">Поздравляем! Настройка биндов завершена. Удачи в обучении!</p>
          </div>
        </div>
      </div>
    </div>
  );
}