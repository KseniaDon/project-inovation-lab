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
  const introData = useSiteData("intro_data", defaultIntroData);
  const internExam = useSiteData("intern_exam", defaultInternExam);
  const feldsherPage = useSiteData<SimplePageData>("feldsher_page", defaultFeldsherPage);

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
        <div className="ml-auto flex items-center gap-2">
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
        <main className={`flex-1 px-4 md:px-8 py-6 md:py-10 min-w-0 mx-auto w-full ${active === "intern-binds" || active === "intern-evidence" || active === "intern-mis" || active === "intern-gov" ? "max-w-5xl" : "max-w-3xl"}`}>


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
          {active === "feldsher" && <LearnFeldsherSection go={go} />}

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

        </motion.div>
        </AnimatePresence>
        </main>
      </div>
    </div>
  );
}