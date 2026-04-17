import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherMedhelpSection({ go }: Props) {
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
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 1: Сдача ОМЭ</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Оказание врачебной помощи</h1>
        <p className="text-base font-semibold text-muted-foreground">1.7 Оказание врачебной помощи.</p>
      </div>

      <p className="text-base text-foreground leading-relaxed">
        Под оказанием врачебной помощи предполагается обследование пациента, проведение процедур и хирургических
        вмешательств (операций). Это один из самых ответственных работ в нашей профессии, ведь от этого зависит
        здоровье и жизнь наших пациентов. Нужно быть готовым к разным исходам данных мероприятий, сохранять
        спокойствие и хладнокровие, но при этом относится с пониманием и терпением к нашим пациентом, ведь они
        на нас надеются и доверяют нам их жизни.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Как и говорилось в одном из разделах нашего сайта, бывают разные ситуации, где каких-либо отыгровок можно
        не найти, если не логичные болезни у пациентов, где вызывают растерянность и переживание у «молодого» врача.
        Но не стоит переживать, такие проблемы решаются сообразительностью, знанием РП-мануала и пользованием
        интернета. В крайнем случае, к Вам на помощь придут Ваши старшие коллеги и подскажут в сложной ситуации
        как поступить.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Давайте перейдем к понятию «Обследование».
      </p>

      {/* Заголовок Обследование */}
      <p className="text-center text-red-600 dark:text-red-400 font-bold text-lg">Обследование</p>

      <p className="text-base text-foreground leading-relaxed">
        Проведение обследований включает в себя:
      </p>

      {/* Список обследований */}
      <div className="flex flex-col gap-4">

        {/* Рентген */}
        <div>
          <span className="text-red-600 dark:text-red-400 font-semibold">Рентген</span>
          <span className="text-base text-foreground leading-relaxed"> — выполняется при подозрении закрытых переломах, а также при открытых переломах, чтобы выявить, есть ли в теле человека раздробленные кости, которых не видно невооруженным глазом.</span>
        </div>

        {/* ЭКГ */}
        <div>
          <span className="text-red-600 dark:text-red-400 font-semibold">ЭКГ (Электрокардиограмма)</span>
          <span className="text-base text-foreground leading-relaxed"> — это метод изучения сердцебиения в сердце. Выполняется только в том случае, если пациент пришел с жалобами на боли в сердце. Прежде, чем дать соответствующее лекарство, нужно обязательно предложить пациенту проверить сердце и если недуги имеются — назначить лекарство или же в тяжелых случаях — провести операцию.</span>
        </div>

        {/* КТ */}
        <div>
          <span className="text-red-600 dark:text-red-400 font-semibold">КТ (Компьютерная томография)</span>
          <span className="text-base text-foreground leading-relaxed"> — это диагностический метод, который позволяет получить детальные послойные изображения внутренних органов и тканей с помощью рентгеновского излучения и компьютерной обработки данных. Метод используется для выявления патологий, травм, опухолей, воспалительных процессов и других изменений в организме. Обычно используется при подозрении на рак, а также для выявления патологий в головном мозге. Иными словами — снимок головного мозга.</span>
        </div>

        {/* ЭЭГ */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-red-600 dark:text-red-400 font-semibold">ЭЭГ (Электроэнцефалограмма головного мозга)</span>
            <span className="text-base text-foreground leading-relaxed"> — Электроэнцефалография (ЭЭГ) — это метод исследования электрической активности головного мозга путём размещения электродов на поверхности головы. Он позволяет оценить работу отделов мозга, выявить патологические изменения, изучить цикл сна и бодрствования. Иными словами — Вы проводите обследование на возможные причины:</span>
          </div>
          <ul className="flex flex-col gap-1.5 ml-2">
            {[
              { red: true,  text: "Эпилепсия" },
              { red: false, text: "Панические атаки" },
              { red: false, text: "Обмороки и потеря сознания" },
              { red: false, text: "Изучение смены фаз сна и бодрствования" },
              { red: false, text: "Диагностирование нарушения сна (бессонница, лунатизм, апноэ и др.)" },
              { red: false, text: "Оценивание степени повреждения тканей мозга после травм, инсультов" },
            ].map(({ red, text }, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-foreground leading-relaxed">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${red ? "bg-red-600" : "bg-foreground/60"}`} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* МРТ */}
        <div>
          <span className="text-red-600 dark:text-red-400 font-semibold">МРТ (Магнитно-резонансная томография)</span>
          <span className="text-base text-foreground leading-relaxed"> — метод диагностики, позволяющий получить детальные томографические изображения внутренних органов и тканей с помощью магнитного поля и радиоволн. В отличие от КТ и рентгена, МРТ не использует ионизирующее излучение, что делает её более безопасной для многократного применения.</span>
        </div>

        {/* УЗИ */}
        <div>
          <span className="text-red-600 dark:text-red-400 font-semibold">УЗИ (Ультразвуковое излучение)</span>
          <span className="text-base text-foreground leading-relaxed"> — безопасный и безболезненный метод диагностики, использующий высокочастотные звуковые волны для визуализации внутренних органов и тканей в реальном времени. В отличие от рентгена и КТ, УЗИ не использует ионизирующее излучение, что делает его подходящим для беременных и детей или для обнаружения поверхностных отклонений в органах, не требующих детального осмотра.</span>
        </div>

      </div>

      {/* Ссылка на МЗ Портал */}
      <p className="text-base text-foreground leading-relaxed">
        Отыгровки имеющихся обследований можно найти на{" "}
        <a
          href="https://mz.kaze.red/dash/types/6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 dark:text-red-400 hover:underline font-semibold"
        >
          МЗ Портал | Обследование
        </a>
        .
      </p>

      {/* Заголовок Процедуры */}
      <p className="text-center text-red-600 dark:text-red-400 font-bold text-lg">Процедуры</p>

    </div>
  );
}
