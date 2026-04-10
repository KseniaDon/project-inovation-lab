import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { playClickSound } from "@/hooks/useSound";
import { SectionId } from "./learn/learnConfig";
import LearnSidebar from "./learn/LearnSidebar";
import LearnBindsSection from "./learn/LearnBindsSection";
import LearnRadioSection from "./learn/LearnRadioSection";
import LearnReportsSection from "./learn/LearnReportsSection";
import LearnCommandsSection from "./learn/LearnCommandsSection";
import LearnAbbrSection from "./learn/LearnAbbrSection";
import LearnScheduleSection from "./learn/LearnScheduleSection";
import LearnFloorsSection from "./learn/LearnFloorsSection";
import LearnActivitySection from "./learn/LearnActivitySection";
import LearnDepartmentsSection from "./learn/LearnDepartmentsSection";
import LearnDrugsSection from "./learn/LearnDrugsSection";
import LearnCharterSection from "./learn/LearnCharterSection";
import LearnOathSection from "./learn/LearnOathSection";
import LearnReportSection from "./learn/LearnReportSection";
import LearnEvidenceSection from "./learn/LearnEvidenceSection";

export default function Learn() {
  const [active, setActive] = useState<SectionId>("intro");
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const go = (id: SectionId) => { playClickSound(); setActive(id); };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center gap-3">
        <button
          onClick={() => { playClickSound(); navigate("/"); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <Icon name="ArrowLeft" size={16} />
          <span className="hidden sm:inline">На главную</span>
        </button>
        <div className="w-px h-4 bg-border hidden sm:block" />
        <p className="text-xs uppercase tracking-widest text-red-600 truncate">Отделение интернатуры</p>
        <div className="ml-auto">
          <button
            onClick={() => { playClickSound(); toggleTheme(); }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Переключить тему"
          >
            <Icon name={dark ? "Sun" : "Moon"} size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 pb-16 md:pb-0">
        <LearnSidebar active={active} go={go} />

        {/* ── Content ── */}
        <main className={`flex-1 px-4 md:px-8 py-6 md:py-10 min-w-0 ${active === "intern-binds" ? "max-w-4xl" : "max-w-2xl"}`}>

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
              <p className="text-base text-foreground leading-relaxed">
                За <span className="text-red-600 font-bold">7 дней</span> — повыситься до <strong>Фельдшера.</strong>
              </p>
              <p className="text-base text-foreground leading-relaxed">
                После повышения ещё <span className="text-red-600 font-bold">7 дней</span> — выйти из ОИ.
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
          {active === "intern-binds" && <LearnBindsSection go={go} />}

          {/* ИСПОЛЬЗОВАНИЕ РАЦИИ */}
          {active === "intern-radio" && <LearnRadioSection go={go} />}

          {/* ДОКЛАДЫ В РАЦИЮ */}
          {active === "intern-reports" && <LearnReportsSection go={go} />}

          {/* ОСНОВНЫЕ КОМАНДЫ */}
          {active === "intern-commands" && <LearnCommandsSection go={go} />}

          {/* АББРЕВИАТУРЫ */}
          {active === "intern-abbr" && <LearnAbbrSection go={go} />}

          {/* ГРАФИК РАБОТЫ */}
          {active === "intern-schedule" && <LearnScheduleSection go={go} />}

          {/* РАСПРЕДЕЛЕНИЕ ЭТАЖЕЙ */}
          {active === "intern-floors" && <LearnFloorsSection go={go} />}

          {/* ЖУРНАЛ АКТИВНОСТИ */}
          {active === "intern-activity" && <LearnActivitySection go={go} />}

          {/* УСТАВНАЯ ДОКУМЕНТАЦИЯ */}
          {active === "intern-charter" && <LearnCharterSection go={go} />}

          {/* ОТДЕЛЕНИЯ ЦГБ-Н */}
          {active === "intern-departments" && <LearnDepartmentsSection go={go} />}

          {/* ПРЕПАРАТЫ */}
          {active === "intern-drugs" && <LearnDrugsSection go={go} />}

          {/* КЛЯТВА ВРАЧА */}
          {active === "intern-oath" && <LearnOathSection go={go} />}

          {/* ЧТО ДАЛЬШЕ? */}
          {active === "intern-report" && <LearnReportSection go={go} />}

          {/* ФИКСАЦИЯ ДОКАЗАТЕЛЬСТВ */}
          {active === "intern-evidence" && <LearnEvidenceSection go={go} />}

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