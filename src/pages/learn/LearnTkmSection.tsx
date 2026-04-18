import { useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";
import TkmForm from "./TkmForm";
import TkmQuestionsOIK from "./TkmQuestionsOIK";
import TkmQuestionsSOP from "./TkmQuestionsSOP";
import TkmQuestionsODS from "./TkmQuestionsODS";
import TkmSection3 from "./TkmSection3";
import TkmSection4 from "./TkmSection4";
import TkmSection5 from "./TkmSection5";
import TkmSection6 from "./TkmSection6";

const TKM_URL = func2url["tkm"];

type Stage = "form" | "section2" | "section3" | "section4" | "section5" | "section6" | "submit" | "done";

interface Meta {
  nickname: string;
  vkLink: string;
  department: string;
  activationCode: string;
}

const SECTION_LABELS: Record<Stage, string> = {
  form: "Вводные данные",
  section2: "Раздел 1 из 5 — Отделение",
  section3: "Раздел 2 из 5 — Уставная документация",
  section4: "Раздел 3 из 5 — RP-сфера",
  section5: "Раздел 4 из 5 — Препараты",
  section6: "Раздел 5 из 5 — Медицина",
  submit: "Отправка",
  done: "Завершено",
};

export default function LearnTkmSection() {
  const [stage, setStage] = useState<Stage>("form");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleDepartmentSelected = (dept: string, info: { nickname: string; vkLink: string; activationCode: string }) => {
    setMeta({ nickname: info.nickname, vkLink: info.vkLink, department: dept, activationCode: info.activationCode });
    setAnswers({});
    setStage("section2");
  };

  const handleSection = (newAnswers: Record<string, string>, nextStage: Stage) => {
    setAnswers(prev => ({ ...prev, ...newAnswers }));
    setStage(nextStage);
  };

  const handleSubmit = async () => {
    if (!meta) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${TKM_URL}?action=submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: meta.nickname,
          vk_link: meta.vkLink,
          department: meta.department,
          activation_code: meta.activationCode,
          answers,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка при отправке");
      }
      setStage("done");
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Ошибка при отправке. Попробуйте ещё раз.");
    }
    setSubmitting(false);
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
        <TkmSection5 onNext={a => handleSection(a, "section6")} onBack={() => setStage("section4")} />
      )}

      {stage === "section6" && (
        <TkmSection6 onNext={a => handleSection(a, "submit")} onBack={() => setStage("section5")} />
      )}

      {stage === "submit" && meta && (
        <div className="flex flex-col gap-5 max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
            <h2 className="text-base font-bold">Все разделы пройдены!</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Вы ответили на все вопросы ТКМ. Проверьте данные и нажмите «Отправить».
            </p>
            <div className="text-sm text-foreground space-y-0.5 mt-1">
              <p>Никнейм: <span className="font-semibold">{meta.nickname}</span></p>
              <p>Отделение: <span className="font-semibold">{meta.department}</span></p>
              <p>Ссылка ВК: <a href={meta.vkLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{meta.vkLink}</a></p>
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-red-500 flex items-start gap-2">
              <Icon name="AlertCircle" size={15} className="mt-0.5 shrink-0" />
              {submitError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStage("section6")}
              className="px-5 py-2.5 border border-border text-sm font-semibold rounded-lg hover:bg-muted transition-colors"
            >
              ← Назад
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Icon name="Loader2" size={15} className="animate-spin" />
                  Отправляю...
                </>
              ) : (
                <>
                  <Icon name="Send" size={15} />
                  Отправить
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="flex flex-col gap-5 max-w-2xl">
          <div className="rounded-xl border border-green-700/40 bg-green-900/10 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" size={22} className="text-green-400 shrink-0" />
              <p className="text-base font-bold text-green-400">Ответы отправлены!</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ваши ответы записаны. Ожидайте проверки в течении 24-х часов.
            </p>
          </div>
          <button
            onClick={() => { setStage("form"); setMeta(null); setAnswers({}); }}
            className="self-start text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            ← Начать заново
          </button>
        </div>
      )}
    </div>
  );
}