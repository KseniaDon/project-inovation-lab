import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";

interface LearnCommandsSectionProps {
  go: (id: SectionId) => void;
}

const DEFAULT_COMMANDS = [
  { cmd: "/r [Text]",       desc: "RP рация сотрудников ЦГБ." },
  { cmd: "/rb [Text]",      desc: "NonRP чат сотрудников ЦГБ." },
  { cmd: "/ro [Text]",      desc: "Общая RP рация сотрудников МЗ." },
  { cmd: "/rob [Text]",     desc: "Общий NonRP чат сотрудников МЗ." },
  { cmd: "/find",           desc: "Список игроков во фракции онлайн." },
  { cmd: "/helpmed [ID]",   desc: "Предложить лечение пациенту (Работает в больнице и в КСМП)." },
  { cmd: "/paytime",        desc: "Узнать оставшееся время до получения зарплаты." },
  { cmd: "/ud [ID]",        desc: "Показать удостоверение." },
  { cmd: "/to [ID]",        desc: "Принять поступивший вызов (со 2 ранга)." },
  { cmd: "/cancel",         desc: "Отказаться от принятого вызова (со 2 ранга)." },
];

export default function LearnCommandsSection({ go }: LearnCommandsSectionProps) {
  const COMMANDS = useSiteData("commands", DEFAULT_COMMANDS);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-reports")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к докладам
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 1: Подготовка</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Основные команды</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">1.4. Основные команды</p>

      <p className="text-base text-foreground leading-relaxed">
        Это список основных команд, которые понадобятся Вам на смене.
      </p>

      <div className="flex flex-col gap-2">
        {COMMANDS.map(({ cmd, desc }) => (
          <div key={cmd} className="flex items-start gap-3 text-sm text-foreground">
            <code className="shrink-0 bg-secondary border border-border rounded px-2 py-1 text-xs font-mono text-muted-foreground">
              {cmd}
            </code>
            <span className="text-foreground pt-1">— {desc}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы на госпортале со всеми командами:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/?do=findComment&comment=6982167"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Раздел 8. Перечень команд.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>
    </div>
  );
}