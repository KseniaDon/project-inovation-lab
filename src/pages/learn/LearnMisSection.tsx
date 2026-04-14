import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import { defaultMisPage, SimplePageData } from "@/pages/admin/adminTypes";
import RichContent from "@/components/ui/rich-content";

interface LearnMisSectionProps {
  go: (id: SectionId) => void;
}

const MIS_URL = "https://docs.google.com/forms/d/e/1FAIpQLScO0bFomyEMvIseA4JHYSQiNTWdmN3DinF4Ra7gv7eCQKMqEw/viewform";

export default function LearnMisSection({ go }: LearnMisSectionProps) {
  const data = useSiteData<SimplePageData>("mis_page", defaultMisPage);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button onClick={() => go("intern-evidence")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
          <Icon name="ChevronLeft" size={14} />
          Назад к фиксации доказательств
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 4: Отчет на повышение</p>
        <h1 className="text-3xl font-bold">{data.title}</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.3. МИС «Здоровье»</p>

      <div className="text-base text-foreground leading-relaxed rich-content">
        <RichContent html={data.content} />
      </div>

      <a href={MIS_URL} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 border border-red-600/40 bg-red-600/5 hover:bg-red-600/10 rounded-sm px-4 py-3.5 transition-colors group">
        <div className="flex items-center gap-3">
          <Icon name="MonitorCheck" size={20} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Открыть МИС «Здоровье»</p>
            <p className="text-xs text-muted-foreground mt-0.5">Google Forms — форма для загрузки доказательств</p>
          </div>
        </div>
        <Icon name="ExternalLink" size={15} className="text-muted-foreground group-hover:text-red-400 transition-colors shrink-0" />
      </a>

      <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 rounded-sm px-4 py-3">
        <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
        <p className="text-sm text-orange-300 leading-relaxed">
          <span className="font-bold">ВАЖНО:</span> Форму можно заполнить только один раз за отчётный период. Убедись, что все 5 скриншотов готовы, прежде чем отправлять.
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={() => go("intern-evidence")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="ChevronLeft" size={14} />
          Фиксация доказательств
        </button>
      </div>
    </div>
  );
}
