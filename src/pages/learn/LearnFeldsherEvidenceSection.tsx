import Icon from "@/components/ui/icon";
import ImageLightbox from "@/components/ui/image-lightbox";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherEvidenceSection({ go }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("feldsher-prep")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к «Подготовка к допуску»
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 2: Отчет на допуск</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Фиксация доказательств</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">2.2. Фиксация доказательств</p>

      <p className="text-base text-foreground leading-relaxed">
        Прежде всего, чтобы подать отчет на допуск к ТКМ, давайте научимся фиксировать работу, начиная с должности Фельдшер и выше.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Ранее, Вас учили как делать и фиксировать последовательность работы при лечении пациентов:{" "}
        <button
          onClick={() => go("intern-evidence")}
          className="text-red-500 font-semibold underline underline-offset-2 hover:text-red-400 transition-colors"
        >
          Интерн | Фиксация доказательств
        </button>
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Теперь разберём с Вами фиксацию посещения строя, как фиксировать доклады в рацию при выезде на вызов, пост или патруль (в Вашем случае, в качестве напарника на пассажирском сидении).
      </p>

      {/* Пошаговая инструкция */}
      <div className="border border-border rounded-sm p-4 sm:p-6 flex flex-col gap-5">
        <h2 className="text-lg font-bold text-red-500 text-center">Пошаговая инструкция по фиксации доказательств</h2>

        {/* Шаг 1 */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-center text-foreground">Шаг 1. Как правильно фиксировать строй</p>
          <p className="text-base text-foreground leading-relaxed">
            Мы всегда фиксируем строй таким образом:
          </p>
          <ul className="flex flex-col gap-2 ml-4 border-l-2 border-red-600/40 pl-4">
            {[
              { label: "Начало строя;" },
              { label: "Приветствие от проводящего или тема строя", italic: true },
              { label: "Середина строя;" },
              { label: "Ваши действия или выполнения заданий на этом строю", italic: true },
              { label: "Конец строя." },
              { label: "Когда с Вами прощаются и говорят «Все свободны»", italic: true },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                {!item.italic && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                {item.italic ? (
                  <em className="text-red-500 text-xs">{item.label}</em>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>

          {/* Важно */}
          <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 px-4 py-3">
            <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
            <p className="text-sm text-orange-300 leading-relaxed">
              <span className="font-bold">ВАЖНО:</span> Фиксируйте строи, где видно дата и время над HUD'ом (либо использованный{" "}
              <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono text-foreground">/timestamp</code>
              ).
            </p>
          </div>

          <p className="text-base text-foreground leading-relaxed">
            Для примера, как должны выглядеть фиксации тренировки возьмите во внимание скриншот №1, скриншот №2 и скриншот №3:
          </p>

          <ImageLightbox
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/506bbc84-06b1-4322-ad68-76089ce1522d.png"
            alt="Скриншот №1"
            className="w-full max-w-3xl rounded-sm border border-border"
            caption="Скриншот №1: Начало строя."
          />

          <ImageLightbox
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/15273040-1219-475f-a1ea-880dbdb8bb43.png"
            alt="Скриншот №2"
            className="w-full max-w-3xl rounded-sm border border-border"
            caption="Скриншот №2: Середина строя."
          />

          <ImageLightbox
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/c1ff2971-fd7c-439b-853e-d7aae940c798.png"
            alt="Скриншот №3"
            className="w-full max-w-3xl rounded-sm border border-border"
            caption="Скриншот №3: Конец строя."
          />

          {/* Совет */}
          <div className="flex items-start gap-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700 rounded-sm px-4 py-3">
            <Icon name="Lightbulb" size={18} className="text-sky-500 shrink-0 mt-0.5" />
            <p className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed">
              <strong>Совет:</strong> Лекция, тренировка, мероприятие — является по значению общим понятием «Строй». Разница в их фиксации лишь в том, что на Лекции мы фиксируем только «Начало строя» и «Конец строя». В остальных строях (тренировка, мероприятия) полная фиксация с серединой строя.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
