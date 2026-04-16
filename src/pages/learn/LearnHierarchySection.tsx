import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnHierarchySection({ go }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-abbr")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к аббревиатурам
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 1: Подготовка</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Иерархия</h1>
      </div>

      <p className="text-base text-muted-foreground leading-relaxed">
        Раздел в разработке. Содержимое будет добавлено позже.
      </p>
    </div>
  );
}