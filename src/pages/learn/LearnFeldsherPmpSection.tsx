import { useState } from "react";
import type { ReactNode } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

function CopyBlock({ text, red }: { text: string; red?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title="Нажмите, чтобы скопировать"
      className={`flex items-center justify-between gap-3 w-full text-left rounded-sm px-3 py-2 border transition-colors group ${
        red
          ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40"
          : "bg-secondary border-border hover:bg-secondary/80"
      }`}
    >
      <code
        className={`text-xs font-mono leading-relaxed flex-1 ${
          red ? "text-red-700 dark:text-red-300" : "text-muted-foreground"
        }`}
      >
        {text}
      </code>
      <Icon
        name={copied ? "Check" : "Copy"}
        size={14}
        className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
      />
    </button>
  );
}

function GenderAccordion({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        <span>{label}</span>
        <Icon
          name="ChevronDown"
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-2 px-3 pb-3 pt-2 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}

export default function LearnFeldsherPmpSection({ go }: Props) {
  const [consciousOpen, setConsciousOpen] = useState(false);

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
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Фельдшер</p>
        <h1 className="text-3xl font-bold">ПМП</h1>
      </div>

      <p className="text-base text-foreground leading-relaxed">
        ПМП расшифровывается как Первая Медицинская Помощь. Прежде, чем начать оказывать ПМП, Вам нужно убедиться,
        что человек в системном сознании или системно без сознания, от этого зависят Ваши дальнейшие действия.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Разберем ситуацию, когда человек системно в сознании и лежит через анимацию на{" "}
        <strong>F1</strong>.
      </p>

      {/* Шаг 1 */}
      <div className="flex flex-col gap-3">
        <p className="text-base text-foreground leading-relaxed">
          1. Подходим к лежащему человеку и осматриваем его на наличие сознания;
        </p>

        {/* Отыгровки */}
        <div className="flex flex-col gap-2">
          <GenderAccordion label="♂ Мужские отыгровки">
            <CopyBlock text="me осмотрел пострадавшего на наличие сознания и похлопал над ушами" />
            <CopyBlock text="do У пострадавшего есть реакция?" />
            <CopyBlock text="b /do Да. или /do Нет." />
          </GenderAccordion>
          <GenderAccordion label="♀ Женские отыгровки">
            <CopyBlock text="me осмотрела пострадавшего на наличие сознания и похлопала над ушами" />
            <CopyBlock text="do У пострадавшего есть реакция?" />
            <CopyBlock text="b /do Да. или /do Нет." />
          </GenderAccordion>
        </div>

        {/* Пояснение */}
        <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
          Если <strong>Да</strong>, то мы спрашиваем у человека, что с ним произошло.{" "}
          Если <strong>Нет</strong>, то мы приводим его в сознание.
        </p>

        {/* Важно */}
        <div className="flex items-start gap-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-300 dark:border-orange-700 rounded-sm px-4 py-3">
          <Icon name="AlertTriangle" size={18} className="text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
            <strong>ВАЖНО:</strong> Пострадавший Вам должен ответить ПРАВИЛЬНОЙ отыгровкой{" "}
            <strong>/do</strong>, как Вы ему показали на примере в <strong>/b</strong> чат. Правильная отыгровка{" "}
            <strong>/do</strong> выглядит с большой буквы и с точкой в конце.
          </p>
        </div>

        {/* Приведение в сознание — аккордеон */}
        <div className="border border-border rounded-sm overflow-hidden">
          <button
            onClick={() => setConsciousOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <span>Приведение в сознание</span>
            <Icon
              name="ChevronDown"
              size={16}
              className={`text-muted-foreground transition-transform duration-200 ${consciousOpen ? "rotate-180" : ""}`}
            />
          </button>
          {consciousOpen && (
            <div className="flex flex-col gap-2 px-4 pb-4 pt-3 border-t border-border">
              <GenderAccordion label="♂ Мужские отыгровки">
                <CopyBlock text="do В медицинской сумке лежат нашатырный спирт и ватка." />
                <CopyBlock text="me достал нашатырный спирт и ватку из медицинской сумки" />
                <CopyBlock text="me смочил ватку нашатырным спиртом" />
                <CopyBlock text="me поднес ватку к носу пострадавшего" />
                <CopyBlock text="do Человек пришел в чувство?" />
                <CopyBlock text="b /do Да. или /do Нет." />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
                  Если <span className="font-bold">/do Нет.</span>
                </p>
                <CopyBlock text="me отодвинул ватку от носа" />
                <CopyBlock text="me повторно поднес ватку к носу пострадавшего и водит ей вокруг носа" />
                <CopyBlock text="do Пострадавший пришел в чувство?" />
                <CopyBlock text="b /do Да. или /do Нет." />
                <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed mt-1">
                  Итак до тех пор, пока не будет <strong>/do Да.</strong> Всего попыток привести чувства человека через данные отыгровки можно 3 раза.
                  Если все 3 раза <strong>/do Нет.</strong>, то дело серьезное и требует других действий.
                </p>
              </GenderAccordion>

              <GenderAccordion label="♀ Женские отыгровки">
                <CopyBlock text="do В медицинской сумке лежат нашатырный спирт и ватка." />
                <CopyBlock text="me достала нашатырный спирт и ватку из медицинской сумки" />
                <CopyBlock text="me смочила ватку нашатырным спиртом" />
                <CopyBlock text="me поднесла ватку к носу пострадавшего" />
                <CopyBlock text="do Человек пришел в чувство?" />
                <CopyBlock text="b /do Да. или /do Нет." />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
                  Если <span className="font-bold">/do Нет.</span>
                </p>
                <CopyBlock text="me отодвинула ватку от носа" />
                <CopyBlock text="me повторно поднесла ватку к носу пострадавшего и водит ей вокруг носа" />
                <CopyBlock text="do Пострадавший пришел в чувство?" />
                <CopyBlock text="b /do Да. или /do Нет." />
                <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed mt-1">
                  Итак до тех пор, пока не будет <strong>/do Да.</strong> Всего попыток привести чувства человека через данные отыгровки можно 3 раза.
                  Если все 3 раза <strong>/do Нет.</strong>, то дело серьезное и требует других действий.
                </p>
              </GenderAccordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}