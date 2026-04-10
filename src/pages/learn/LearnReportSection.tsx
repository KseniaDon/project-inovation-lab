import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnReportSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnReportSection({ go }: LearnReportSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-oath")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к клятве врача
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 4: Отчет на повышение</p>
        <h1 className="text-3xl font-bold">Что дальше?</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.1. Что дальше?</p>

      <p className="text-base text-foreground leading-relaxed">
        После успешной сдачи всех экзаменов и получения допуска к лечению, твой последний шаг в отделении Интернатуры:
      </p>

      <ol className="flex flex-col gap-4">
        <li className="flex items-start gap-3">
          <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5 font-medium">1.</span>
          <span className="text-base text-foreground">Вылечить <span className="font-bold text-red-500">5 пациентов</span>.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5 font-medium">2.</span>
          <span className="text-base text-foreground">
            Загрузить доказательства в{" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScO0bFomyEMvIseA4JHYSQiNTWdmN3DinF4Ra7gv7eCQKMqEw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-semibold"
            >
              МИС «Здоровье»
              <Icon name="ExternalLink" size={13} />
            </a>
            ;
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5 font-medium">3.</span>
          <span className="text-base text-foreground">
            Оставить заявление на госпортал, о том, что Вы загрузили свои доказательства в МИС «Здоровье».
          </span>
        </li>
      </ol>

      <div className="flex flex-col gap-3 border border-border rounded-sm p-4 bg-secondary/30">
        <p className="text-sm text-foreground leading-relaxed">
          Доказательства проделанной работы публикуются в{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScO0bFomyEMvIseA4JHYSQiNTWdmN3DinF4Ra7gv7eCQKMqEw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-semibold"
          >
            МИС «Здоровье»
            <Icon name="ExternalLink" size={13} />
          </a>
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Заявление на повышение подается в специальном разделе на форуме:{" "}
          <a
            href="https://forum.gtaprovince.ru/topic/995718-cgb-g-nevskiy-informacionnyy-razdel-otdeleniya-internatury"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-semibold"
          >
            Информационный раздел Отделения Интернатуры
            <Icon name="ExternalLink" size={13} />
          </a>
        </p>
      </div>

      <div className="flex items-start gap-3 bg-secondary border border-border px-4 py-3 rounded-sm">
        <Icon name="FileText" size={16} className="text-red-500 shrink-0 mt-0.5" />
        <p className="text-sm text-foreground font-semibold">Заявление на повышение</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => go("intern-evidence")}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Далее: Фиксация доказательств
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  );
}
