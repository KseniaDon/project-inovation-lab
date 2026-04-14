import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";

interface LearnOathSectionProps {
  go: (id: SectionId) => void;
}

const DEFAULT_OATH_LINES = [
  "say Получая высокое звание врача и приступая к профессиональной деятельности, я торжественно...",
  "say ...клянусь честно исполнять свой врачебный долг, быть всегда готовым оказать медицинскую...",
  "say ...помощь, хранить врачебную тайну, внимательно и заботливо относиться к пациенту,..",
  "say ...действовать исключительно в его интересах независимо от пола, расы, национальности,..",
  "say ...языка, происхождения, а также других обстоятельств.",
  "say Доброжелательно относиться к коллегам, обращаться к ним за помощью и советом...",
  "say ...и самому никогда не отказывать коллегам в помощи и совете. ",
  "say Беречь и развивать благородные традиции медицины.",
];

export default function LearnOathSection({ go }: LearnOathSectionProps) {
  const OATH_LINES = useSiteData<string[]>("oath_lines", DEFAULT_OATH_LINES);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (line: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(line);
    } catch {
      const el = document.createElement("textarea");
      el.value = line;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-drugs")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к препаратам
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 3: Экзамен</p>
        <h1 className="text-3xl font-bold">Клятва врача</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">3.3. Клятва врача</p>

      <p className="text-base text-foreground leading-relaxed">
        Это текст, который должен быть выучен наизусть и сдан для получения допуска к лечению.
      </p>

      {/* Совет */}
      <div className="flex items-start gap-2 sm:gap-3 bg-sky-950/30 border border-sky-700/50 rounded-sm px-3 sm:px-5 py-3 sm:py-4">
        <Icon name="Lightbulb" size={18} className="text-sky-400 shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold text-sky-400">Совет:</span>{" "}
          Открывайте консоль на <strong>F8</strong> и построчно копируйте и вставляйте данный текст.
        </p>
      </div>

      {/* Строки клятвы — каждая копируется отдельно */}
      <div className="flex flex-col gap-2 border border-red-600/50 rounded-sm p-4 bg-red-950/10">
        {OATH_LINES.map((line, idx) => (
          <button
            key={idx}
            onClick={() => handleCopy(line, idx)}
            className={`group relative flex items-center justify-between gap-2 sm:gap-3 border rounded-sm px-2 sm:px-3 py-2 sm:py-2.5 text-left transition-all duration-150 ${
              copiedIdx === idx
                ? "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600"
                : "bg-secondary/40 hover:bg-secondary border-border hover:border-muted-foreground"
            }`}
          >
            <p className="text-xs sm:text-sm font-mono text-foreground leading-relaxed pr-14 sm:pr-16">{line}</p>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs shrink-0">
              {copiedIdx === idx
                ? <><Icon name="Check" size={13} className="text-green-400" /><span className="hidden sm:inline text-green-400">Скопировано!</span></>
                : <><Icon name="Copy" size={13} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /><span className="hidden sm:inline text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Копировать</span></>
              }
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}