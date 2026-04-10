import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnReportsSectionProps {
  go: (id: SectionId) => void;
}

const MALE_REPORTS = [
  {
    label: "Заступление на смену",
    template: "/r ОИ-Инициалы. Заступил на смену.",
  },
  {
    label: "Сдача смены",
    template: "/r ОИ-Инициалы. Сдал смену.",
  },
  {
    label: "Перерыв",
    template: "/r ОИ-Инициалы. Вышел на обеденный перерыв.",
  },
  {
    label: "Окончание перерыва",
    template: "/r ОИ-Инициалы. Вернулся с обеденного перерыва.",
  },
];

export default function LearnReportsSection({ go }: LearnReportsSectionProps) {
  const [maleOpen, setMaleOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-radio")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к рации
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
        <h1 className="text-3xl font-bold">Доклады в рацию</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">1.3. Доклады в рацию</p>

      <p className="text-base text-foreground leading-relaxed">
        Доклад в рацию состоит из <strong>ТЭГ'а</strong> и сути доклада.{" "}
        <strong>ТЭГ</strong> устроен следующим образом: отделение-инициалы.
      </p>

      {/* Пример */}
      <div className="border border-border rounded-sm px-5 py-4 flex flex-col gap-2 bg-secondary/30">
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold">Пример:</span> Вы состоите в отделении интернатуры и вас зовут Ксения Донская. Ваш{" "}
          <strong>ТЭГ</strong> будет выглядеть так:{" "}
          <strong className="text-foreground">ОИ-КД</strong>.
        </p>
      </div>

      {/* Шаблоны докладов */}
      <div className="border border-border rounded-sm p-5 flex flex-col gap-4">
        <p className="text-base font-bold text-center text-foreground">Шаблоны докладов</p>

        {/* Мужские доклады — аккордеон */}
        <div className="border border-border rounded-sm overflow-hidden">
          <button
            onClick={() => setMaleOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <span>Мужские доклады</span>
            <Icon
              name="ChevronDown"
              size={16}
              className={`text-muted-foreground transition-transform duration-200 ${maleOpen ? "rotate-180" : ""}`}
            />
          </button>

          {maleOpen && (
            <div className="flex flex-col gap-3 px-4 pb-4 pt-2 border-t border-border">
              {MALE_REPORTS.map(({ label, template }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <p className="text-sm text-foreground font-medium">{label}:</p>
                  <div className="bg-secondary border border-border rounded-sm px-3 py-2">
                    <code className="text-xs text-muted-foreground font-mono">{template}</code>
                  </div>
                </div>
              ))}
              <p className="text-sm italic text-muted-foreground mt-1">
                Для интернов доступны только «Заступление на смену», «Сдача смены», а также доклады «Перерыв».
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
