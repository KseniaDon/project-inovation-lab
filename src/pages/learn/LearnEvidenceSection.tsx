import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnEvidenceSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnEvidenceSection({ go }: LearnEvidenceSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-report")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к «Что дальше?»
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 4: Отчет на повышение</p>
        <h1 className="text-3xl font-bold">Фиксация доказательств</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.2. Фиксация доказательств</p>

      <p className="text-base text-foreground leading-relaxed">
        Первым делом, чтобы подать отчет на повышение, давай научимся фиксировать твою работу.
      </p>

      <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 px-4 py-3">
        <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
        <p className="text-sm text-orange-300 leading-relaxed">
          <span className="font-bold">ВАЖНО:</span> Содержание раздела будет добавлено позже.
        </p>
      </div>
    </div>
  );
}
