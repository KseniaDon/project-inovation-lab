import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

type RadioGroup = {
  title: string;
  male: string[];
  female: string[];
};

const RADIO_GROUPS: RadioGroup[] = [
  {
    title: "Вызов",
    male: [
      "r ТЭГ. РАСМП. Вызов *Номер* (номер вызова – ID игрока) - Принят. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - Помощь оказана на месте/Госпитализация. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - Ложный/Отменён. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - На базе. Напарники: *Фамилии* (если есть).",
    ],
    female: [
      "r ТЭГ. РАСМП. Вызов *Номер* (номер вызова – ID игрока) - Принят. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - Помощь оказана на месте/Госпитализация. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - Ложный/Отменён. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. РАСМП. Вызов *Номер* - На базе. Напарники: *Фамилии* (если есть).",
    ],
  },
  {
    title: "Пост АСМП",
    male: [
      "r ТЭГ. АСМП. Выехал на пост: *Название*. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Прибыл на пост: *Название*. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. Состояние: стабильно. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. На базе. Напарники: *Фамилии* (если есть).",
    ],
    female: [
      "r ТЭГ. АСМП. Выехала на пост: *Название*. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Прибыла на пост: *Название*. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. Состояние: стабильно. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Пост: *Название*. На базе. Напарники: *Фамилии* (если есть).",
    ],
  },
  {
    title: "Патруль АСМП",
    male: [
      "r ТЭГ. АСМП. Выехал в патрулирование. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Продолжаю патрулирование. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Закончил патрулирование. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Патрулирование. На базе. Напарники: *Фамилии* (если есть).",
    ],
    female: [
      "r ТЭГ. АСМП. Выехала в патрулирование. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Продолжаю патрулирование. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Закончила патрулирование. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Патрулирование. На базе. Напарники: *Фамилии* (если есть).",
    ],
  },
  {
    title: "Пеший патруль",
    male: [
      "r ТЭГ. Вышел в пеший патруль. Маршрут - *Номер маршрута*. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Пеший патруль по Маршруту *Номер маршрута*. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Закончил пеший патруль по Маршруту *Номер маршрута*. Возвращаюсь на базу. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Пеший патруль по Маршруту *Номер маршрута*. На базе. Напарник: *Фамилии* (если есть).",
    ],
    female: [
      "r ТЭГ. Вышла в пеший патруль. Маршрут - *Номер маршрута*. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Пеший патруль по Маршруту *Номер маршрута*. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Закончила пеший патруль по Маршруту *Номер маршрута*. Возвращаюсь на базу. Напарник: *Фамилии* (если есть).",
      "r ТЭГ. Пеший патруль по Маршруту *Номер маршрута*. На базе. Напарник: *Фамилии* (если есть).",
    ],
  },
  {
    title: "ПРМО",
    male: [
      "r ТЭГ. АСМП. Выехал на ПРМО. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Прибыл на ПРМО. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. ПРМО. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. ПРМО. На базе. Напарники: *Фамилии* (если есть).",
    ],
    female: [
      "r ТЭГ. АСМП. Выехала на ПРМО. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. Прибыла на ПРМО. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. ПРМО. Возвращаюсь на базу. Напарники: *Фамилии* (если есть).",
      "r ТЭГ. АСМП. ПРМО. На базе. Напарники: *Фамилии* (если есть).",
    ],
  },
  {
    title: "Пересечение юрисдикции",
    male: [
      "ro ЦГБ-Н к МЗ/ЦГБ-П/ОКБ-М. Запрашиваю разрешение на патрулирование вашей юрисдикции на АСМП.",
      "ro ЦГБ-Н к ЦГБ-П/ОКБ-М. Пересекаю вашу юрисдикцию с целью обработки вызова на АСМП.",
    ],
    female: [
      "ro ЦГБ-Н к МЗ/ЦГБ-П/ОКБ-М. Запрашиваю разрешение на патрулирование вашей юрисдикции на АСМП.",
      "ro ЦГБ-Н к ЦГБ-П/ОКБ-М. Пересекаю вашу юрисдикцию с целью обработки вызова на АСМП.",
    ],
  },
];

function CopyRow({ text }: { text: string }) {
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
      className={`flex items-start justify-between gap-2 w-full text-left rounded-sm px-3 py-2 border transition-all duration-150 group ${
        copied
          ? "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600"
          : "bg-secondary border-border hover:bg-secondary/80"
      }`}
    >
      <code className={`text-xs font-mono flex-1 leading-relaxed transition-colors duration-150 ${copied ? "text-green-700 dark:text-green-300" : "text-muted-foreground"}`}>
        {text}
      </code>
      <Icon
        name={copied ? "Check" : "Copy"}
        size={14}
        className={`shrink-0 mt-0.5 transition-colors duration-150 ${copied ? "text-green-600 dark:text-green-400" : "text-muted-foreground group-hover:text-foreground"}`}
      />
    </button>
  );
}

function GenderBlock({ label, templates }: { label: string; templates: string[] }) {
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
          {templates.map((tpl) => (
            <CopyRow key={tpl} text={tpl} />
          ))}
        </div>
      )}
    </div>
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
          <GenderBlock label="♂ Мужские отыгровки" templates={group.male} />
          <GenderBlock label="♀ Женские отыгровки" templates={group.female} />
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