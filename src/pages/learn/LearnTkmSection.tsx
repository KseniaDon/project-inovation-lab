import { useState } from "react";
import TkmForm from "./TkmForm";
import TkmQuestionsOIK from "./TkmQuestionsOIK";

type Stage = "form" | "section2" | "done";

interface Meta {
  nickname: string;
  vkLink: string;
  department: string;
}

export default function LearnTkmSection() {
  const [stage, setStage] = useState<Stage>("form");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleDepartmentSelected = (dept: string, info: { nickname: string; vkLink: string }) => {
    setMeta({ nickname: info.nickname, vkLink: info.vkLink, department: dept });
    setAnswers({});
    setStage("section2");
  };

  const handleSection2 = (section2Answers: Record<string, string>) => {
    setAnswers(prev => ({ ...prev, ...section2Answers }));
    setStage("done");
  };

  const sectionLabel = stage === "form" ? "Раздел 1 из 8" : stage === "section2" ? "Раздел 2 из 8" : "Завершено";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
        <h1 className="text-2xl sm:text-3xl font-bold">ТКМ</h1>
        <p className="text-xs text-muted-foreground mt-1">{sectionLabel}</p>
      </div>

      {stage === "form" && (
        <TkmForm onDepartmentSelected={handleDepartmentSelected} />
      )}

      {stage === "section2" && meta && meta.department === "ОИК" && (
        <TkmQuestionsOIK
          onNext={handleSection2}
          onBack={() => setStage("form")}
        />
      )}

      {stage === "section2" && meta && meta.department !== "ОИК" && (
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p>Отделение: <span className="text-red-400 font-semibold">{meta.department}</span></p>
            <p className="mt-2">Вопросы для отделения <span className="font-semibold">{meta.department}</span> добавляются — скоро будут!</p>
          </div>
          <button
            onClick={() => setStage("form")}
            className="self-start text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            ← Вернуться к первой странице
          </button>
        </div>
      )}

      {stage === "done" && meta && (
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="rounded-xl border border-green-700/40 bg-green-900/10 p-5 flex flex-col gap-2">
            <p className="text-sm font-semibold text-green-400">Раздел 2 завершён!</p>
            <p className="text-sm text-muted-foreground">Следующие разделы появятся здесь по мере добавления вопросов.</p>
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
