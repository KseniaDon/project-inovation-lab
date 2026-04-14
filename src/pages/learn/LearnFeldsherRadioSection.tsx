import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

type RadioGroup = {
  title: string;
  templates: string[];
};

const RADIO_GROUPS: RadioGroup[] = [
  {
    title: "Вызов",
    templates: [
      "r ТЭГ. РАСМП. Вызов *Номер* (номер вызова – ID игрока) - Принят. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - Помощь оказана на месте/Госпитализация. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - Ложный/Отменён. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - На базе. Напарники: *Фамилии* (если есть).",
    ],
  },
  {
    title: "Пост АСМП",
    templates: [
      "r ТЭГ. АСМП. Выехал на пост: *Название*. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Прибыл на пост: *Название*. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. Состояние: стабильно. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. На базе. Напарники: *Фамилии* (если есть).",
    ],
  },
  {
    title: "Патруль АСМП",
    templates: [
      "r ТЭГ. АСМП. Выехал в патрулирование. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Продолжаю патрулирование. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Закончил патрулирование. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Патрулирование. На базе. Напарники: *Фамилии* (если есть).",
    ],
  },
  {
    title: "Пеший патруль",
    templates: [
      "r ТЭГ. Вышел в пеший патруль. Маршрут - *Номер маршрута*. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Пеший патруль по Маршруту *Номер маршрута*. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Закончил пеший патруль по Маршруту *Номер маршрута*. Возвращаюсь на базу. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Пеший патруль по Маршруту *Номер маршрута*. На базе. Напарник: *Фамилии* (если есть).",
    ],
  },
  {
    title: "ПРМО",
    templates: [
      "r ТЭГ. АСМП. Выехал на ПРМО. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Прибыл на ПРМО. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. ПРМО. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. ПРМО. На базе. Напарники: *Фамилии* (если есть).",
    ],
  },
  {
    title: "Пересечение юрисдикции",
    templates: [
      "ro ЦГБ-Н к МЗ/ЦГБ-П/ОКБ-М. Запрашиваю разрешение на патрулирование вашей юрисдикции на АСМП.",
      "ro ЦГБ-Н к ЦГБ-П/ОКБ-М. Пересекаю вашу юрисдикцию с целью обработки вызова на АСМП.",
    ],
  },
];

function CopyButton({ text }: { text: string }) {
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
      title="Скопировать"
      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Icon name={copied ? "Check" : "Copy"} size={14} />
    </button>
  );
}

function RadioGroupBlock({ group }: { group: RadioGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        <span>{group.title}</span>
        <Icon
          name="ChevronDown"
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-2 px-4 pb-4 pt-2 border-t border-border">
          {group.templates.map((tpl) => (
            <div
              key={tpl}
              className="flex items-start gap-2 bg-secondary border border-border rounded-sm px-3 py-2"
            >
              <code className="text-xs text-muted-foreground font-mono flex-1 leading-relaxed">{tpl}</code>
              <CopyButton text={tpl} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LearnFeldsherRadioSection({ go }: Props) {
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
        <h1 className="text-3xl font-bold">Работа с рацией</h1>
      </div>

      <p className="text-base text-foreground leading-relaxed">
        Как и говорилось ранее в разделе{" "}
        <button
          onClick={() => go("intern-reports")}
          className="text-red-500 hover:text-red-400 transition-colors font-medium underline underline-offset-2"
        >
          Доклады в рацию
        </button>
        , доклад состоит из <strong>ТЭГ'а</strong> и сути доклада.{" "}
        <strong>ТЭГ</strong> устроен следующим образом: отделение-инициалы.
      </p>

      {/* Шаблоны */}
      <div className="border border-border rounded-sm p-5 flex flex-col gap-4">
        <p className="text-base font-bold text-center text-foreground">Шаблоны докладов</p>
        <div className="flex flex-col gap-3">
          {RADIO_GROUPS.map((group) => (
            <RadioGroupBlock key={group.title} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}
