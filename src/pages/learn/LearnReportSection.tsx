import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import { defaultReportPage, SimplePageData } from "@/pages/admin/adminTypes";
import RichContent from "@/components/ui/rich-content";

interface LearnReportSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnReportSection({ go }: LearnReportSectionProps) {
  const data = useSiteData<SimplePageData>("report_page", defaultReportPage);

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
        <h1 className="text-3xl font-bold">{data.title}</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.1. Что дальше?</p>

      <div className="text-base text-foreground leading-relaxed rich-content">
        <RichContent html={data.content} />
      </div>

      <div className="flex flex-col gap-3 border border-border rounded-sm p-4 bg-secondary/30">
        <p className="text-sm text-foreground leading-relaxed">
          Доказательства проделанной работы публикуются в{" "}
          <a href="https://docs.google.com/forms/d/e/1FAIpQLScO0bFomyEMvIseA4JHYSQiNTWdmN3DinF4Ra7gv7eCQKMqEw/viewform" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-semibold">
            МИС «Здоровье» <Icon name="ExternalLink" size={13} />
          </a>
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Заявление на повышение подается в специальном разделе на госпортале по форме:{" "}
          <a href="https://forum.gtaprovince.ru/topic/995718-cgb-g-nevskiy-informacionnyy-razdel-otdeleniya-internatury" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-semibold">
            Информационный раздел Отделения Интернатуры <Icon name="ExternalLink" size={13} />
          </a>
        </p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => go("intern-evidence")}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors font-medium">
          Далее: Фиксация доказательств
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  );
}
