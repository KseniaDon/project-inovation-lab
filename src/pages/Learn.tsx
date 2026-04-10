import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SECTIONS_KEY = "admin_sections";
const defaultSections = [
  {
    id: "intern",
    title: "Интерн",
    icon: "GraduationCap",
    items: [
      "Ознакомление с правилами внутреннего распорядка",
      "Изучение структуры отделения и должностных инструкций",
      "Знакомство с протоколами оказания медицинской помощи",
      "Работа с медицинской документацией",
      "Участие в утренних обходах и разборах клинических случаев",
      "Освоение навыков работы в МИС",
    ],
  },
  {
    id: "feldsher",
    title: "Фельдшер",
    icon: "Stethoscope",
    items: [
      "Протоколы первичной диагностики пациентов",
      "Алгоритмы оказания неотложной помощи",
      "Ведение сестринской документации и карт наблюдения",
      "Правила хранения и выдачи лекарственных средств",
      "Взаимодействие с дежурным врачом и старшим медперсоналом",
      "Инфекционная безопасность и работа с биоматериалом",
    ],
  },
];

export default function Learn() {
  const sections = (() => {
    try { return JSON.parse(localStorage.getItem(SECTIONS_KEY) || "null") || defaultSections; }
    catch { return defaultSections; }
  })();

  const [open, setOpen] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggle = (id: string) => {
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <Icon name="ArrowLeft" size={16} />
          На главную
        </button>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">Отделение интернатуры</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Обучение</h1>
          <p className="mt-4 text-muted-foreground">
            Выберите раздел, чтобы ознакомиться с программой подготовки.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Блок вступления */}
          <div className="border border-border rounded-none overflow-hidden">
            <button
              onClick={() => toggle("intro")}
              className="w-full flex items-center justify-between px-6 py-5 bg-card hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="Flag" size={20} className="text-red-600" />
                <span className="text-lg font-semibold">Вступление</span>
              </div>
              <Icon
                name={open.includes("intro") ? "ChevronUp" : "ChevronDown"}
                size={18}
                className="text-muted-foreground"
              />
            </button>

            {open.includes("intro") && (
              <div className="px-6 py-5 bg-background border-t border-border flex flex-col gap-3">
                <p className="text-xl font-bold text-foreground">
                  Добро пожаловать в ЦГБ города Невский!
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  С этого момента Вы являетесь сотрудником Отделения Интернатуры.
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  На выход из Отделения Интернатуры и повышения до лаборанта вам дается{" "}
                  <span className="text-red-600 font-semibold">14 дней</span>.
                </p>
              </div>
            )}
          </div>

          {sections.map((section) => {
            const isOpen = open.includes(section.id);
            return (
              <div
                key={section.id}
                className="border border-border rounded-none overflow-hidden"
              >
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center justify-between px-6 py-5 bg-card hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon name={section.icon as "GraduationCap"} size={20} className="text-red-600" />
                    <span className="text-lg font-semibold">{section.title}</span>
                  </div>
                  <Icon
                    name={isOpen ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-muted-foreground"
                  />
                </button>

                {isOpen && (
                  <div className="px-6 py-5 bg-background border-t border-border">
                    <ul className="flex flex-col gap-3">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                          <span className="mt-1 w-2 h-2 rounded-full bg-red-600 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}