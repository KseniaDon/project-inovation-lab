import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnCharterSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnCharterSection({ go }: LearnCharterSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-activity")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к журналу активности
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 2: Устав и правила</p>
        <h1 className="text-3xl font-bold">Уставная документация</h1>
      </div>

      <p className="text-sm text-muted-foreground">Содержание будет добавлено позже.</p>
    </div>
  );
}
