import { useState } from "react";
import Icon from "@/components/ui/icon";

interface RadioQuestionProps {
  num: string;
  text: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}

function RadioQuestion({ num, text, options, value, onChange, required }: RadioQuestionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="font-bold">№{num}.</span> {text}{" "}
        {required && <span className="text-red-500">*</span>}
      </p>
      <div className="flex flex-col gap-2.5 mt-1">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                value === opt
                  ? "border-red-500 bg-red-500"
                  : "border-muted-foreground group-hover:border-red-400"
              }`}
              onClick={() => onChange(opt)}
            >
              {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-foreground" onClick={() => onChange(opt)}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface Props {
  onNext: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export default function TkmQuestionsSOP({ onNext, onBack }: Props) {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    setError("");
    if (!q1) { setError("Ответьте на вопрос №1"); return; }
    if (!q2) { setError("Ответьте на вопрос №2"); return; }
    if (!q3) { setError("Ответьте на вопрос №3"); return; }

    onNext({
      "2.1 Сколько отделений в ЦГБ-Н согласно внутреннему уставу?": q1,
      "2.2 Чем занимается СОП?": q2,
      "2.3 На каком этаже проводятся услуги Стоматологической поликлиники «Дентист»?": q3,
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold">
            Раздел 2 из 8
          </span>
        </div>
        <h2 className="text-base font-bold mt-1">Ваше будущее отделение — СОП.</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Этот раздел включает в себя вопросы, которые проверяют Ваши знания Вашего будущего отделения.
          Читайте внимательно вопрос и обращайте внимание на пример ответа. Старайтесь избегать
          непонятных выражений/фразеологизмов.
        </p>
        <div className="text-sm text-foreground mt-1 space-y-0.5">
          <p>Количество вопросов в разделе: <span className="font-semibold">3</span>.</p>
          <p>Максимальный первичный балл за раздел: <span className="font-semibold">3</span>.</p>
        </div>
      </div>

      <RadioQuestion
        num="1"
        text="Сначала немного базового — сколько отделений в ЦГБ-Н существует согласно внутреннему уставу?"
        options={["3", "4", "5", "6"]}
        value={q1}
        onChange={setQ1}
        required
      />

      <RadioQuestion
        num="2"
        text="Чем занимается СОП?"
        options={[
          "Обучают интернов и фельдшеров",
          "Проводят проверку аптек на наличие просроченных лекарств и травматологические рейды",
          "Проводят надзор над инфекционными заболеваниями людей, над санитарией и соблюдением инфекционной безопасности; проводят инфекционные рейды; оказывают услуги на базе НИИ Эпидемиологии",
          "Проводят мероприятия для граждан и сотрудников гос.организаций, для поддержания здорового образа жизни",
          "По желанию обучают работе в руководящем составе ЦГБ-Н",
        ]}
        value={q2}
        onChange={setQ2}
        required
      />

      <RadioQuestion
        num="3"
        text="На каком этаже проводятся услуги Стоматологической поликлиники «Дентист»?"
        options={["1", "2", "3", "4", "5"]}
        value={q3}
        onChange={setQ3}
        required
      />

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <Icon name="AlertCircle" size={15} />
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 border border-border text-sm font-semibold rounded-lg hover:bg-muted transition-colors"
        >
          ← Назад
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Далее
        </button>
      </div>
    </div>
  );
}
