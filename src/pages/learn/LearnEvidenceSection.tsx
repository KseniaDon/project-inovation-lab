import Icon from "@/components/ui/icon";
import ImageLightbox from "@/components/ui/image-lightbox";
import { SectionId } from "./learnConfig";

interface LearnEvidenceSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnEvidenceSection({ go }: LearnEvidenceSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-report")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к «Что дальше?»
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 4: Отчет на повышение</p>
        <h1 className="text-3xl font-bold">Фиксация доказательств</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.2. Фиксация доказательств</p>

      <p className="text-base text-foreground leading-relaxed">
        Первым делом, чтобы подать отчет на повышение, давай научимся фиксировать твою работу.
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-base text-foreground leading-relaxed">
          1. Мы всегда фиксируем свою работу, показывая чат, где видно как мы лечим пациента. Важно, чтобы была видна полная картина ситуации, а то есть:
        </p>
        <ul className="flex flex-col gap-2 ml-4 border-l-2 border-red-600/40 pl-4">
          {[
            "Приветствие с Вашим бейджем;",
            "Вопрос о том, чем Вы можете помочь пациенту;",
            "Проведение в палату для осмотра;",
            "Сделанный осмотр;",
            "Озвучивание диагноза и название препарата от этого диагноза;",
            "Называть стоимость в 500 рублей для всех препаратов;",
            "Спрашивание согласия на лечение у пациентов и только после этого передача препарата самому пациенту;",
            "Прощание «Всего доброго, не болейте!»",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 px-4 py-3">
          <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
          <p className="text-sm text-orange-300 leading-relaxed">
            <span className="font-bold">ВАЖНО:</span> Фиксируйте лечение с уведомлением «Пациент согласился на лечение» и чтобы было видно дата и время над HUD'ом (либо использованный{" "}
            <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono text-foreground">/timestamp</code>
            {" "}при прощании с пациентом).
          </p>
        </div>
        <p className="text-base text-foreground leading-relaxed">
          Для примера, возьмите этот скриншот №1:
        </p>
        <ImageLightbox
          src="https://sun9-10.userapi.com/s/v1/ig2/BfVbLIn-bhKJkPnmmmEk850nAyKXThCRgmq0xhHuZ3TqCTQBEJVXxor9tlbszzKeZZt8T9DYwaEJA-gFhR8OFUMi.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720&from=bu&u=2TJ_uumXIjuS2EWJ_SCZvv3vZVQQvdAlJvRm_vbDIhU&cs=1280x0"
          alt="Скриншот №1"
          className="w-full max-w-3xl rounded-sm border border-border"
          caption="Скриншот №1: Лечение пациента в палате и захват всего чата."
        />
      </div>
    </div>
  );
}