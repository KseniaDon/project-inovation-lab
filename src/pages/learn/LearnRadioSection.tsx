import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import { defaultRadioCommands, defaultRadioRules, RadioCommand, RadioRule } from "@/pages/admin/adminTypes";
import RichContent from "@/components/ui/rich-content";

interface LearnRadioSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnRadioSection({ go }: LearnRadioSectionProps) {
  const radioCmds = useSiteData<RadioCommand[]>("radio_commands", defaultRadioCommands);
  const radioRules = useSiteData<RadioRule[]>("radio_rules", defaultRadioRules);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к Интерну
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 1: Подготовка</p>
        <h1 className="text-3xl font-bold">Использование рации</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">1.2. Использование рации</p>

      <p className="text-base text-foreground leading-relaxed">
        В шкафу (на 1 этаже) лежит рация, настроенная на нужную волну. Возьмите её, а также возьмите медицинскую сумку. Рация предназначена для того, чтобы делать необходимые доклады.
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-foreground">Команды рации:</p>
        <div className="flex flex-col gap-2">
          {radioCmds.map(({ cmd, desc }) => (
            <div key={cmd} className="flex items-center gap-3 text-sm text-foreground">
              <code className="bg-secondary border border-border rounded px-2 py-1 text-xs font-mono shrink-0">{cmd}</code>
              <span className="text-muted-foreground">— {desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-foreground">Правила использования</p>
        <ol className="flex flex-col gap-4">
          {radioRules.map(({ text }, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
              <span className="shrink-0 font-medium text-muted-foreground">{idx + 1}.</span>
              <div><RichContent html={text} /></div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}