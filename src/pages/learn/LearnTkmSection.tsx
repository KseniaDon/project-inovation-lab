import { useState } from "react";
import TkmForm from "./TkmForm";
import TkmQuestionsOIK from "./TkmQuestionsOIK";
import TkmQuestionsSOP from "./TkmQuestionsSOP";
import TkmQuestionsODS from "./TkmQuestionsODS";
import TkmSection3 from "./TkmSection3";
import TkmSection4 from "./TkmSection4";
import TkmSection5 from "./TkmSection5";

type Stage = "form" | "section2" | "section3" | "section4" | "section5" | "done";

interface Meta {
  nickname: string;
  vkLink: string;
  department: string;
}

const SECTION_LABELS: Record<Stage, string> = {
  form: "Вводные данные",
  section2: "Раздел 1 из 8 — Отделение",
  section3: "Раздел 2 из 8 — Уставная документация",
  section4: "Раздел 3 из 8 — RP-сфера",
  section5: "Раздел 4 из 8 — Препараты",
  done: "Завершено",
};

export default function LearnTkmSection() {
  const [stage, setStage] = useState<Stage>("form");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleDepartmentSelected = (dept: string, info: { nickname: string; vkLink: string }) => {
    setMeta({ nickname: info.nickname, vkLink: info.vkLink, department: dept });
    setAnswers({});
    setStage("section2");
  };

  const handleSection = (newAnswers: Record<string, string>, nextStage: Stage) => {
    setAnswers(prev => ({ ...prev, ...newAnswers }));
    setStage(nextStage);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
        <h1 className="text-2xl sm:text-3xl font-bold">ТКМ</h1>
        <p className="text-xs text-muted-foreground mt-1">{SECTION_LABELS[stage]}</p>
      </div>

      {stage === "form" && (
        <TkmForm onDepartmentSelected={handleDepartmentSelected} />
      )}

      {stage === "section2" && meta && meta.department === "ОИК" && (
        <TkmQuestionsOIK onNext={a => handleSection(a, "section3")} onBack={() => setStage("form")} />
      )}
      {stage === "section2" && meta && meta.department === "СОП" && (
        <TkmQuestionsSOP onNext={a => handleSection(a, "section3")} onBack={() => setStage("form")} />
      )}
      {stage === "section2" && meta && meta.department === "ОДС" && (
        <TkmQuestionsODS onNext={a => handleSection(a, "section3")} onBack={() => setStage("form")} />
      )}

      {stage === "section3" && (
        <TkmSection3 onNext={a => handleSection(a, "section4")} onBack={() => setStage("section2")} />
      )}

      {stage === "section4" && (
        <TkmSection4 onNext={a => handleSection(a, "section5")} onBack={() => setStage("section3")} />
      )}

      {stage === "section5" && (
        <TkmSection5 onNext={a => handleSection(a, "done")} onBack={() => setStage("section4")} />
      )}

      {stage === "done" && meta && (
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="rounded-xl border border-green-700/40 bg-green-900/10 p-5 flex flex-col gap-2">
            <p className="text-sm font-semibold text-green-400">Раздел 4 завершён!</p>
            <p className="text-sm text-muted-foreground">Раздел 5 появится здесь по мере добавления вопросов.</p>
          </div>
          <button
            onClick={() => setStage("form")}
            className="self-start text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            ← Начать заново
          </button>
        </div>
      )}
    </div>
  );
}