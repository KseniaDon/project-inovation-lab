import { useState, useEffect } from "react";
import RichContent from "@/components/ui/rich-content";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { playClickSound } from "@/hooks/useSound";
import { SectionId, NAV } from "./learn/learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import { defaultIntroData, defaultInternExam, defaultFeldsherPage, SimplePageData } from "@/pages/admin/adminTypes";
import LearnSidebar from "./learn/LearnSidebar";
import LearnBindsSection from "./learn/LearnBindsSection";
import LearnRadioSection from "./learn/LearnRadioSection";
import LearnReportsSection from "./learn/LearnReportsSection";
import LearnCommandsSection from "./learn/LearnCommandsSection";
import LearnAbbrSection from "./learn/LearnAbbrSection";
import LearnHierarchySection from "./learn/LearnHierarchySection";
import LearnScheduleSection from "./learn/LearnScheduleSection";
import LearnFloorsSection from "./learn/LearnFloorsSection";
import LearnActivitySection from "./learn/LearnActivitySection";
import LearnDepartmentsSection from "./learn/LearnDepartmentsSection";
import LearnDrugsSection from "./learn/LearnDrugsSection";
import LearnCharterSection from "./learn/LearnCharterSection";
import LearnOathSection from "./learn/LearnOathSection";
import LearnReportSection from "./learn/LearnReportSection";
import LearnMisSection from "./learn/LearnMisSection";
import LearnEvidenceSection from "./learn/LearnEvidenceSection";
import LearnGovSection from "./learn/LearnGovSection";
import LearnFeldsherSection from "./learn/LearnFeldsherSection";
import LearnFeldsherRadioSection from "./learn/LearnFeldsherRadioSection";
import LearnFeldsherPmpSection from "./learn/LearnFeldsherPmpSection";
import LearnFeldsherMzPortalSection from "./learn/LearnFeldsherMzPortalSection";
import LearnFeldsherPatrolSection from "./learn/LearnFeldsherPatrolSection";
import LearnFeldsherKsmpSection from "./learn/LearnFeldsherKsmpSection";
import LearnFeldsherPrmoSection from "./learn/LearnFeldsherPrmoSection";
import LearnFeldsherMedhelpSection from "./learn/LearnFeldsherMedhelpSection";
import LearnFeldsherWardsSection from "./learn/LearnFeldsherWardsSection";

export default function Learn() {
  const [active, setActive] = useState<SectionId>("intro");
  const navigate = useNavigate();

  const go = (id: SectionId) => {
    playClickSound();
    setActive(id);
    window.history.pushState(null, "", `/learn#${id}`);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as SectionId;
    if (hash) setActive(hash);
  }, []);
  const introData = useSiteData("intro_data", defaultIntroData);
  const internExam = useSiteData("intern_exam", defaultInternExam);
  const feldsherPage = useSiteData<SimplePageData>("feldsher_page", defaultFeldsherPage);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border px-4 md:px-8 xl:px-12 py-3 md:py-4 flex items-center gap-3">
        <button
          onClick={() => { playClickSound(); navigate("/"); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <Icon name="ArrowLeft" size={16} />
          <span className="hidden sm:inline">На главную</span>
        </button>
        <div className="w-px h-4 bg-border hidden sm:block" />
        <p className="text-xs uppercase tracking-widest text-red-600 truncate">Отделение интернатуры</p>

      </div>

      <div className="flex flex-1 pb-16 md:pb-0">
        <LearnSidebar active={active} go={go} />

        {/* ── Content ── */}
        <main className={`flex-1 px-4 md:px-10 xl:px-16 py-6 md:py-10 min-w-0 mx-auto w-full ${active === "intern-binds" || active === "intern-evidence" || active === "intern-mis" || active === "intern-gov" ? "max-w-6xl" : "max-w-4xl"}`}>


        <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

          {/* ВСТУПЛЕНИЕ */}
          {active === "intro" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Добро пожаловать</p>
                <h1 className="text-3xl font-bold">Вступление</h1>
              </div>
              <p className="text-2xl font-bold text-foreground">{introData.welcome}</p>
              <div className="text-base text-foreground leading-relaxed rich-content">
                <RichContent html={introData.content} />
              </div>
            </div>
          )}

          {/* ИНТЕРН */}
          {active === "intern" && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
                <h1 className="text-3xl font-bold">Интерн</h1>
              </div>
              <p className="text-xl font-bold text-red-400">{internExam.title}</p>
              <div className="text-base text-foreground leading-relaxed rich-content">
                <RichContent html={internExam.content} />
              </div>

              {/* Блок ПМЭ — после п.3, перед п.4 (клятва) */}
              <div className="border border-border rounded-sm px-5 py-4 flex flex-col gap-3">
                <p className="text-base font-semibold text-foreground">Первичный Медицинский Экзамен (ПМЭ) включает в себя:</p>
                <ul className="flex flex-col gap-1.5 pl-1">
                  {[
                    "Информацию о больнице;",
                    "Практический экзамен по выдаче препаратов;",
                    "Вопросы по препаратам;",
                    "Вопросы по Внутреннему уставу.",
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
                  <strong>Совет:</strong> Проводить ПМЭ Вам смогут сотрудники ОПРС (врачи-терапевты) или любой другой РС нашей больницы. Если Вам нужно будет сдать ПМЭ, обязательно отпишите это в беседке «Отделение Интернатуры» или подойдите на смене к врачу 6+, чтобы спросить, сможет ли Вам провести экзамен. Обычно проведение ПМЭ происходит сразу, после принятия в больницу, но случаи бывают разные.
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <a href={internExam.binds_link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium">
                  <Icon name="ExternalLink" size={13} />
                  Бинды для сотрудников
                </a>
                <button onClick={() => go("intern-drugs")}
                  className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium">
                  <Icon name="ExternalLink" size={13} />
                  Препараты
                </button>
                <a href={internExam.charter_link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium">
                  <Icon name="ExternalLink" size={13} />
                  Внутренний Устав ЦГБ-Н
                </a>
                <button onClick={() => go("intern-oath")}
                  className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium">
                  <Icon name="ExternalLink" size={13} />
                  Клятва врача
                </button>
              </div>


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

          {/* ИЕРАРХИЯ */}
          {active === "intern-hierarchy" && <LearnHierarchySection go={go} />}

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

          {/* МИС ЗДОРОВЬЕ */}
          {active === "intern-mis" && <LearnMisSection go={go} />}

          {/* ФИКСАЦИЯ ДОКАЗАТЕЛЬСТВ */}
          {active === "intern-evidence" && <LearnEvidenceSection go={go} />}

          {/* ГОСПОРТАЛ */}
          {active === "intern-gov" && <LearnGovSection go={go} />}

          {/* ФЕЛЬДШЕР */}
          {active === "feldsher" && <LearnFeldsherSection />}

          {/* ФЕЛЬДШЕР — РАБОТА НА КСМП */}
          {active === "feldsher-ksmp" && <LearnFeldsherKsmpSection go={go} />}

          {/* ФЕЛЬДШЕР — РАБОТА С РАЦИЕЙ */}
          {active === "feldsher-radio" && <LearnFeldsherRadioSection go={go} />}

          {/* ФЕЛЬДШЕР — ПМП */}
          {active === "feldsher-pmp" && <LearnFeldsherPmpSection go={go} />}

          {/* ФЕЛЬДШЕР — МЗ ПОРТАЛ */}
          {active === "feldsher-mzportal" && <LearnFeldsherMzPortalSection go={go} />}

          {/* ФЕЛЬДШЕР — ПОСТ И ПАТРУЛИРОВАНИЕ */}
          {active === "feldsher-patrol" && <LearnFeldsherPatrolSection go={go} />}

          {/* ФЕЛЬДШЕР — ПРМО */}
          {active === "feldsher-prmo" && <LearnFeldsherPrmoSection go={go} />}

          {/* ФЕЛЬДШЕР — ОКАЗАНИЕ ВРАЧЕБНОЙ ПОМОЩИ */}
          {active === "feldsher-medhelp" && <LearnFeldsherMedhelpSection go={go} />}

          {/* ФЕЛЬДШЕР — РАБОТА ОТДЕЛЕНИЙ */}
          {active === "feldsher-wards" && <LearnFeldsherWardsSection go={go} />}

        </motion.div>
        </AnimatePresence>
        </main>
      </div>
    </div>
  );
}