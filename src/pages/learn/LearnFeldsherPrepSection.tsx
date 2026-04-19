import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherPrepSection({ go }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("feldsher")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к Фельдшеру
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 2: Отчет на допуск</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Подготовка к допуску</h1>
        <p className="text-base font-semibold text-muted-foreground">2.1 Подготовка к допуску.</p>
      </div>
      <p className="text-base text-muted-foreground leading-relaxed">
        Содержимое раздела будет добавлено позже.
      </p>
    </div>
  );
}
