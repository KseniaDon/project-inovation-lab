import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnOathSectionProps {
  go: (id: SectionId) => void;
}

const OATH_LINES = [
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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(OATH_LINES.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="flex items-start gap-3 bg-sky-950/30 border border-sky-700/50 rounded-sm px-5 py-4">
        <Icon name="Lightbulb" size={18} className="text-sky-400 shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold text-sky-400">Совет:</span>{" "}
          Открывайте консоль на <strong>F8</strong> и построчно копируйте и вставляйте данный текст.
        </p>
      </div>

      {/* Текст клятвы */}
      <button
        onClick={handleCopy}
        className="group relative border border-red-600/50 rounded-sm px-5 py-4 text-left hover:border-red-500 transition-colors bg-red-950/10"
      >
        <div className="flex flex-col gap-1.5">
          {OATH_LINES.map((line, idx) => (
            <p key={idx} className="text-sm font-mono text-foreground leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {copied
            ? <><Icon name="Check" size={13} className="text-green-400" /><span className="text-green-400">Скопировано!</span></>
            : <><Icon name="Copy" size={13} /><span>Копировать всё</span></>
          }
        </div>
      </button>
    </div>
  );
}
