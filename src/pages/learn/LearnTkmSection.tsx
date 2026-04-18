import { useState } from "react";
import TkmForm from "./TkmForm";

type Stage = "form" | "questions";

export default function LearnTkmSection() {
  const [stage, setStage] = useState<Stage>("form");
  const [meta, setMeta] = useState<{ nickname: string; vkLink: string; department: string } | null>(null);

  const handleDepartmentSelected = (dept: string, info: { nickname: string; vkLink: string }) => {
    setMeta({ nickname: info.nickname, vkLink: info.vkLink, department: dept });
    setStage("questions");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Раздел</p>
        <h1 className="text-2xl sm:text-3xl font-bold">ТКМ</h1>
        <p className="text-xs text-muted-foreground mt-1">Раздел 1 из 8</p>
      </div>

      {stage === "form" && (
        <TkmForm onDepartmentSelected={handleDepartmentSelected} />
      )}

      {stage === "questions" && meta && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p>Никнейм: <span className="text-foreground font-medium">{meta.nickname}</span></p>
            <p>ВКонтакте: <span className="text-foreground font-medium">{meta.vkLink}</span></p>
            <p>Отделение: <span className="text-red-400 font-semibold">{meta.department}</span></p>
          </div>
          <p className="text-sm text-muted-foreground">
            Вопросы по отделению <span className="text-foreground font-semibold">{meta.department}</span> появятся здесь.
            Скидывай следующие скриншоты с вопросами, и я добавлю их!
          </p>
          <button
            onClick={() => setStage("form")}
            className="self-start text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            ← Вернуться к первой странице
          </button>
        </div>
      )}
    </div>
  );
}
