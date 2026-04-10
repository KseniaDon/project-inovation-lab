import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { playClickSound } from "@/hooks/useSound";

type SectionId = "intro" | "intern" | "intern-binds" | "feldsher";

const NAV: { id: SectionId; label: string; icon: string; parent?: string; divider?: string }[] = [
  { id: "intro",        label: "Вступление",        icon: "Flag" },
  { id: "intern",       label: "Интерн",             icon: "GraduationCap" },
  { id: "intern-binds", label: "Настройка биндов",   icon: "Keyboard", parent: "intern", divider: "Шаг 1: Подготовка" },
  { id: "feldsher",     label: "Фельдшер",           icon: "Stethoscope" },
];

export default function Learn() {
  const [active, setActive] = useState<SectionId>("intro");
  const navigate = useNavigate();

  const go = (id: SectionId) => { playClickSound(); setActive(id); };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => { playClickSound(); navigate("/"); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          На главную
        </button>
        <div className="w-px h-4 bg-border" />
        <p className="text-xs uppercase tracking-widest text-red-600">Отделение интернатуры</p>
      </div>

      <div className="flex flex-1">
        {/* ── Sidebar ── */}
        <aside className="w-64 shrink-0 border-r border-border flex flex-col py-6 sticky top-0 h-screen overflow-y-auto">
          <p className="px-5 text-xs uppercase tracking-widest text-muted-foreground mb-3">Разделы</p>
          <nav className="flex flex-col gap-0.5 px-3">
            {NAV.map((item) => {
              const isActive = active === item.id;
              const isChild = !!item.parent;
              return (
                <div key={item.id}>
                  {item.divider && (
                    <p className="px-3 pt-3 pb-1 text-xs text-zinc-500 uppercase tracking-widest select-none">
                      {item.divider}
                    </p>
                  )}
                  <button
                    onClick={() => go(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left rounded-none
                      ${isChild ? "ml-4 pl-3 text-xs" : ""}
                      ${isActive
                        ? "bg-red-600/10 text-red-500 border-l-2 border-red-600"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
                      }`}
                  >
                    <Icon name={item.icon as "Flag"} size={isChild ? 14 : 16} className={isActive ? "text-red-500" : ""} />
                    {item.label}
                  </button>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ── Content ── */}
        <main className={`flex-1 px-8 py-10 ${active === "intern-binds" ? "max-w-4xl" : "max-w-2xl"}`}>

          {/* ВСТУПЛЕНИЕ */}
          {active === "intro" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Добро пожаловать</p>
                <h1 className="text-3xl font-bold">Вступление</h1>
              </div>
              <p className="text-2xl font-bold text-foreground">
                Добро пожаловать в ЦГБ города Невский!
              </p>
              <p className="text-base text-foreground leading-relaxed">
                С этого момента Вы являетесь сотрудником Отделения Интернатуры.
              </p>
              <p className="text-base text-foreground leading-relaxed">
                На выход из Отделения Интернатуры и повышения до лаборанта вам дается{" "}
                <span className="text-red-600 font-semibold">14 дней</span>.
              </p>
            </div>
          )}

          {/* ИНТЕРН */}
          {active === "intern" && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
                <h1 className="text-3xl font-bold">Интерн</h1>
              </div>

              <p className="text-xl font-bold text-red-400">
                Твоя первая и главная задача: Получить допуск к лечению.
              </p>
              <p className="text-base text-foreground leading-relaxed">
                До получения допуска к лечению вам нельзя абсолютно ничего. Лечить пациентов сможете только тогда, когда получите допуск к лечению.
              </p>

              <p className="text-base text-foreground font-medium">Чтобы получить допуск, вам нужно сдать:</p>

              <ol className="flex flex-col gap-5">
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5">1</span>
                  <span className="text-base text-foreground">Прослушать вступительную лекцию;</span>
                </li>

                <li className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5">2</span>
                    <span className="text-base text-foreground">Сдать устную речь;</span>
                  </div>
                  <div className="ml-8 border-l-2 border-red-600/40 pl-4 flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground italic">
                      Устная речь — это бинды. Слово «Бинд» в РП мы не используем!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      В устной речи мы проверяем, как Вы установили бинды и в случае чего, помогаем исправлять вместе с Вами.
                    </p>
                    <a
                      href="https://forum.gtaprovince.ru/topic/995732-cgb-g-nevskiy-bindy-dlya-sotrudnikov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium mt-1"
                    >
                      <Icon name="ExternalLink" size={13} />
                      Бинды для сотрудников
                    </a>
                  </div>
                </li>

                <li className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5">3</span>
                    <span className="text-base text-foreground">Сдать Первичный Медицинский Экзамен;</span>
                  </div>
                  <div className="ml-8 border-l-2 border-red-600/40 pl-4 flex flex-col gap-2">
                    <p className="text-sm text-foreground font-medium">Первичный Медицинский Экзамен (ПМЭ) включает в себя:</p>
                    <ul className="flex flex-col gap-1.5">
                      {[
                        "Информацию о больнице, которую Вам расскажут в процессе обучения;",
                        "Практический экзамен по выдаче препаратов пациентам;",
                        "Вопросы по Внутреннему уставу нашей больницы.",
                      ].map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full border border-muted-foreground shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="https://forum.gtaprovince.ru/topic/995741-cgb-g-nevskiy-vnutrenniy-ustav/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium mt-1"
                    >
                      <Icon name="ExternalLink" size={13} />
                      Внутренний Устав ЦГБ-Н
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5">4</span>
                  <span className="text-base text-foreground">Сдать клятву врача.</span>
                </li>
              </ol>


            </div>
          )}

          {/* НАСТРОЙКА БИНДОВ */}
          {active === "intern-binds" && (
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

              <div className="border-l-2 border-red-600 pl-4">
                <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Обязательная настройка</p>
              </div>

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
              <div className="border border-border rounded-sm p-6 flex flex-col gap-5">
                <h2 className="text-lg font-bold text-red-500 text-center">Пошаговая инструкция по установке биндов</h2>

                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold text-center text-foreground">Установка бинда</p>

                  <ol className="flex flex-col gap-2">
                    <li className="flex items-start gap-2 text-sm text-foreground">
                      <span className="shrink-0 font-medium text-muted-foreground">1.</span>
                      <span>Перейдите по официальной ссылке на форум (см. выше);</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground">
                      <span className="shrink-0 font-medium text-muted-foreground">2.</span>
                      <span>
                        На открывшейся странице найдите и скопируйте нужный текст для приветствия (выделено красным) на{" "}
                        <span className="text-foreground font-semibold">скриншоте №1</span>:
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
              </div>
            </div>
          )}

          {/* ФЕЛЬДШЕР */}
          {active === "feldsher" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
                <h1 className="text-3xl font-bold">Фельдшер</h1>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Протоколы первичной диагностики пациентов",
                  "Алгоритмы оказания неотложной помощи",
                  "Ведение сестринской документации и карт наблюдения",
                  "Правила хранения и выдачи лекарственных средств",
                  "Взаимодействие с дежурным врачом и старшим медперсоналом",
                  "Инфекционная безопасность и работа с биоматериалом",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-base text-foreground">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}