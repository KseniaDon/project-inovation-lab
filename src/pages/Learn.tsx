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

              {/* Шаг 1 */}
              {([
                { step: "Шаг 1: Подготовка", items: [
                  { id: "intern-binds" as SectionId,    num: "1.1", label: "Настройка биндов",    icon: "Keyboard" },
                  { id: "intern-radio" as SectionId,    num: "1.2", label: "Использование рации", icon: "Radio" },
                  { id: "intern-reports" as SectionId,  num: "1.3", label: "Доклады в рацию",     icon: "Megaphone" },
                  { id: "intern-commands" as SectionId, num: "1.4", label: "Основные команды",    icon: "Terminal" },
                  { id: "intern-abbr" as SectionId,     num: "1.5", label: "Аббревиатуры",        icon: "BookOpen" },
                  { id: "intern-hierarchy" as SectionId,num: "1.6", label: "Иерархия",            icon: "Crown" },
                ]},
                { step: "Шаг 2: Устав и правила", items: [
                  { id: "intern-schedule" as SectionId,    num: "2.1", label: "График работы",           icon: "CalendarDays" },
                  { id: "intern-floors" as SectionId,      num: "2.2", label: "Распределение этажей",    icon: "Building2" },
                  { id: "intern-activity" as SectionId,    num: "2.3", label: "Журнал активности (ЖА)",  icon: "ClipboardList" },
                  { id: "intern-charter" as SectionId,     num: "2.4", label: "Уставная документация",   icon: "ScrollText" },
                ]},
                { step: "Шаг 3: Экзамен", items: [
                  { id: "intern-departments" as SectionId, num: "3.1", label: "Отделения ЦГБ-Н",        icon: "Network" },
                  { id: "intern-drugs" as SectionId,       num: "3.2", label: "Препараты",               icon: "Pill" },
                  { id: "intern-oath" as SectionId,        num: "3.3", label: "Клятва врача",            icon: "GraduationCap" },
                ]},
                { step: "Шаг 4: Отчет на повышение", items: [
                  { id: "intern-report" as SectionId,   num: "4.1", label: "Подготовка к повышению",  icon: "ClipboardCheck" },
                  { id: "intern-evidence" as SectionId, num: "4.2", label: "Фиксация доказательств",  icon: "Camera" },
                  { id: "intern-mis" as SectionId,      num: "4.3", label: "МИС «Здоровье»",          icon: "MonitorCheck" },
                  { id: "intern-gov" as SectionId,      num: "4.4", label: "Госпортал",               icon: "Globe" },
                ]},
              ] as { step: string; items: { id: SectionId; num: string; label: string; icon: string }[] }[]).map(({ step, items }) => (
                <div key={step} className="flex flex-col gap-3 pt-4 border-t border-border">
                  <p className="text-xs uppercase tracking-widest text-zinc-500 select-none">{step}</p>
                  <div className="flex flex-col gap-1">
                    {items.map((item) => (
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
              ))}
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