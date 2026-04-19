import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
      >
        <span>{label}</span>
        <Icon
          name="ChevronDown"
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-border text-sm text-foreground leading-relaxed flex flex-col gap-4">
          {children}
        </div>
      )}
    </div>
  );
}

function SubAccordion({ label, children }: { label: string; children: React.ReactNode }) {
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
          {children}
        </div>
      )}
    </div>
  );
}

function CopyRow({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copied) { setCopied(false); return; }
    const write = () => {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      } catch (e) { void e; }
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(write);
    } else {
      write();
    }
    setCopied(true);
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

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 px-4 py-3">
      <Icon name="TriangleAlert" size={18} className="text-orange-500 shrink-0 mt-0.5" />
      <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed">{children}</p>
    </div>
  );
}

export default function LearnFeldsherWardsSection({ go }: Props) {
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
        <h1 className="text-2xl sm:text-3xl font-bold">Специализация отделений</h1>
        <p className="text-base font-semibold text-muted-foreground">1.8 Специализация отделений.</p>
      </div>

      <div className="flex flex-col gap-4 text-base text-foreground leading-relaxed">
        <p>
          Прежде, чем повыситься в должности, Вам предстоит выбрать отделение, в котором Вы будете работать и предоставлять услуги пациентам. На сдаче ОМЭ, в конце экзамена Вам нужно будет выбрать пробное одно отделение, где расскажут о работе и как выполнять эту саму работу. В дальнейшем, когда Вы будете уже на шаге повышения — Вам нужно будет определиться окончательно.
        </p>
        <p>
          Наши отделения отличаются работой, но каждое из них приносит большой вклад в нашу больницу и имеет интересное разнообразие. Возможно, что выбор будет крайне тяжел, но благодаря полному рассказу о каждом отделении — Вы определитесь.
        </p>
        <p>Давайте подробно разберём терапевтические отделения нашей больницы.</p>
      </div>

      {/* Аккордеон ОИК */}
      <Accordion label="Отделение Инфекционного Контроля">
        <p>
          Отделение Инфекционного Контроля (ОИК) – это одно из отделений ЦГБ города Невский, сотрудники которого занимаются как основной работой больницы, так и оказанием услуг на базе НИИ Эпидемиологии, проведением санитарных проверок и инфекционных рейдов для населения и сотрудников государственных организаций.
        </p>

        {/* Система должностей */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-center text-foreground">Система должностей НИИ Эпидемиологии</p>
          <ul className="text-sm text-foreground leading-relaxed list-none flex flex-col gap-1 pl-2">
            <li>Лаборант [3] – Лаборант-инфекционист [3];</li>
            <li>Врач-стажер [4] – Врач-вирусолог [4];</li>
            <li>Врач-участковый [5] – Врач-бактериолог [5];</li>
            <li>Врач-терапевт [6] – Врач-паразитолог [6].</li>
          </ul>
        </div>

        {/* Инфекционный рейд */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-center text-foreground">Инфекционный рейд</p>
          <p>
            Инфекционный рейд – это мероприятие, проводимое сотрудниками ОИК как для гражданского населения, так и для работников государственных организаций. В рамках рейда проводится тестирование на COVID-19 и вакцинация по желанию проверяемого гражданина. Руководство ОИК может изменить перечень проводимых проверок в рамках мероприятия, предварительно предупредив сотрудников.
          </p>
          <p className="text-sm text-foreground">
            Отыгровки для проведения Инфекционного рейда на МЗ Портале:{" "}
            <a
              href="https://mz.kaze.red/dash/types/66"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
            >
              МЗ Портал | Услуги НИИ Эпидемиологии
              <Icon name="ExternalLink" size={12} />
            </a>
            .
          </p>
          <p>
            Как и говорилось ранее, существуют различная работа в данном отделение. Например, помимо выявлений инфекционных заболеваний у граждан, также существует процедуры вакцинации, благодаря которым можно обезопасить граждан и сделать их организм не уязвимым к болезням. Также, существует дополнительная работа без участия пациентов, а то есть, выезд на проверку общественных мест или же общественных мест с пищеблоком. В данной работе вы проверяете уровень освещения здания, температуру помещений, уровень загрязнения воздуха, качество хранения продуктов и т.п. Иными словами — санитарные проверки.
          </p>
        </div>

        {/* Отыгровки для ОИК */}
        <div className="border border-border rounded-sm p-4 flex flex-col gap-3">
          <p className="text-sm font-bold text-center text-foreground">Отыгровки для ОИК</p>

          {/* Мужские отыгровки */}
          <SubAccordion label="♂ Мужские отыгровки">
            {/* Доклады для выезда */}
            <SubAccordion label="Доклады для выезда на санитарные проверки">
              <CopyRow text="r ТЭГ АСМП. Выехал на проверку здания: Название. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Выехал на проверку здания: Название. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Закончил проверку здания: Название. Возвращаюсь на базу. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Проверка здания: Название. На базе. Напарники: фамилии (если есть)" />
            </SubAccordion>

            {/* Санитарные проверки общественных мест */}
            <SubAccordion label="Санитарные проверки общественных мест и гостиниц">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">
                Справка: к общественным местам относятся все здания и гостиницы, в которых не продаются продукты питания.
              </p>
              <p className="text-xs text-foreground leading-relaxed px-1">
                Все отыгровки санитарной проверки общественных мест можно найти на МЗ Портале:{" "}
                <a
                  href="https://mz.kaze.red/dash/types/58"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  МЗ Портал | Санитарные проверки общественных мест и гостиниц
                  <Icon name="ExternalLink" size={11} />
                </a>
                .
              </p>
            </SubAccordion>

            {/* Санитарные проверки зданий с пищевым блоком */}
            <SubAccordion label="Санитарные проверки зданий с пищевым блоком">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">
                Справка: к зданиям с пищевым блоком относится столовая в АТП, Макдональдс и сеть магазинов Игнат.
              </p>
              <p className="text-xs text-foreground leading-relaxed px-1">
                Все отыгровки санитарной проверки общественных мест с пищеблоком можно найти на МЗ Портале:{" "}
                <a
                  href="https://mz.kaze.red/dash/types/59"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  МЗ Портал | Санитарные проверки зданий с пищевым блоком
                  <Icon name="ExternalLink" size={11} />
                </a>
                .
              </p>
            </SubAccordion>
          </SubAccordion>

          {/* Женские отыгровки */}
          <SubAccordion label="♀ Женские отыгровки">
            {/* Доклады для выезда */}
            <SubAccordion label="Доклады для выезда на санитарные проверки">
              <CopyRow text="r ТЭГ АСМП. Выехала на проверку здания: Название. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Выехала на проверку здания: Название. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Закончила проверку здания: Название. Возвращаюсь на базу. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Проверка здания: Название. На базе. Напарники: фамилии (если есть)" />
            </SubAccordion>

            {/* Санитарные проверки общественных мест */}
            <SubAccordion label="Санитарные проверки общественных мест и гостиниц">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">
                Справка: к общественным местам относятся все здания и гостиницы, в которых не продаются продукты питания.
              </p>
              <p className="text-xs text-foreground leading-relaxed px-1">
                Все отыгровки санитарной проверки общественных мест можно найти на МЗ Портале:{" "}
                <a
                  href="https://mz.kaze.red/dash/types/58"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  МЗ Портал | Санитарные проверки общественных мест и гостиниц
                  <Icon name="ExternalLink" size={11} />
                </a>
                .
              </p>
            </SubAccordion>

            {/* Санитарные проверки зданий с пищевым блоком */}
            <SubAccordion label="Санитарные проверки зданий с пищевым блоком">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">
                Справка: к зданиям с пищевым блоком относится столовая в АТП, Макдональдс и сеть магазинов Игнат.
              </p>
              <p className="text-xs text-foreground leading-relaxed px-1">
                Все отыгровки санитарной проверки общественных мест с пищеблоком можно найти на МЗ Портале:{" "}
                <a
                  href="https://mz.kaze.red/dash/types/59"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  МЗ Портал | Санитарные проверки зданий с пищевым блоком
                  <Icon name="ExternalLink" size={11} />
                </a>
                .
              </p>
            </SubAccordion>
          </SubAccordion>

          {/* Общее предупреждение */}
          <WarningBox>
            <strong>ВАЖНО:</strong> Делайте все отыгровки, обязательно не забывая «Действия в ЦГБ перед санитарной проверкой», которые проводятся на 4-м этаже нашей больницы в процедурном кабинете и помимо отыгровок проверок уже на месте, Вы заканчиваете свою проверку отыгровками «Действия в ЦГБ после санитарной проверки» также на 4-м этаже нашей больнице в процедурном кабинете. Обязательно фиксируйте все действия отдельными скриншотами и все доклады, чтобы у проверяющего не было к Вам вопросов.
          </WarningBox>
        </div>
      </Accordion>

      {/* Аккордеон СОП */}
      <Accordion label="Стоматологическое Отделение Поликлиники">
        <p>
          Стоматологическое Отделение Поликлиники (СОП) – это одно из отделений ЦГБ города Невский, сотрудники которого занимаются как основной работой больницы, так и оказанием услуг на базе Стоматологической поликлиники "Дентист" и проведением стоматологических рейдов для населения и сотрудников государственных организаций.
        </p>

        {/* Система должностей */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-center text-foreground">Система должностей Стоматологической поликлиники "Дентист"</p>
          <ul className="text-sm text-foreground leading-relaxed list-none flex flex-col gap-1 pl-2">
            <li>Лаборант [3] – Врач-стоматолог [3]</li>
            <li>Врач-стажер [4] – Врач-стоматолог-педиатр [4]</li>
            <li>Врач-участковый [5] – Врач-стоматолог-ортопед [5]</li>
            <li>Врач-терапевт [6] – Врач-стоматолог-терапевт [6]</li>
          </ul>
        </div>

        {/* Стоматологический рейд */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-center text-foreground">Стоматологический рейд</p>
          <p>
            Стоматологический рейд – это мероприятие, проводимое сотрудниками СОП как для гражданского населения, так и для работников государственных организаций. В рамках рейда врач-стоматолог проводит обследование ротовой полости пациента. При необходимости оказываются дополнительные услуги.
          </p>
          <p className="text-sm text-foreground">
            Отыгровки для проведения Стоматологического рейда на МЗ Портале:{" "}
            <a
              href="https://mz.kaze.red/dash/types/52"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
            >
              МЗ Портал | Услуги «Дентист»
              <Icon name="ExternalLink" size={12} />
            </a>
            .
          </p>
          <p>
            К сожалению, СОП у нас выезжает за пределы больницы только для проведения Стоматологического рейда. Чтобы можно было заниматься работой без участия пациентов, наши стоматологи создают пластины в стенах нашей любимой больницы.
          </p>
        </div>

        {/* Отыгровки для СОП */}
        <div className="border border-border rounded-sm p-4 flex flex-col gap-3">
          <p className="text-sm font-bold text-center text-foreground">Отыгровки для СОП</p>

          {/* Мужские отыгровки */}
          <SubAccordion label="♂ Мужские отыгровки">
            <SubAccordion label="Создание пластин">
              <CopyRow text="do Рядом стоит шкаф." />
              <CopyRow text="do В шкафу лежат гипсовые модели челюстей." />
              <CopyRow text="me открыл шкаф и взял необходимую модель" />
              <CopyRow text="me закрыл шкаф" />
              <CopyRow text="do Рядом стоит стол." />
              <CopyRow text="me положил модель челюсти на стол" />
              <CopyRow text="do На столе лежит маркер." />
              <CopyRow text="me взял маркер и сделал разметку в определенной части модели" />
              <CopyRow text="do Коробка с кламмерами лежит на столе." />
              <CopyRow text="me открыл коробку и достал из нее один кламмер" />
              <CopyRow text="do На столе лежат круглогубцы." />
              <CopyRow text="me взял круглогубцы и начал изгибать плечи кламмера" />
              <CopyRow text="me закончив изгибать плечи кламмера, начал изгибать тело кламмера" />
              <CopyRow text="me закончив работу с кламмером, примерил его на помеченную маркером часть модели" />
              <CopyRow text="do Кламмер подошел к зубу." />
              <CopyRow text="me положил круглогубцы на стол" />
              <CopyRow text="do Катушка проволоки лежит на столе." />
              <CopyRow text="me взял катушку и потянул проволоку" />
              <CopyRow text="me приложил проволоку к модели и отмерил дугу" />
              <CopyRow text="do На столе лежат стоматологические щипцы." />
              <CopyRow text="me взял щипцы и обрезал проволоку в нужном месте" />
              <CopyRow text="me взял со стола маркер и сделал пометки на дуге" />
              <CopyRow text="me положил маркер на стол" />
              <CopyRow text="me начал делать щипцами изгибы в помеченных местах" />
              <CopyRow text="me закончив изгибать проволоку, примерил ее на модель" />
              <CopyRow text="me потянул необходимую часть проволоки и обрезал ее щипцами" />
              <CopyRow text="me взял проволоку и начал разрезать ее на три части" />
              <CopyRow text="me закончив обрезать проволоку, взял один кусочек и начал делать пружину" />
              <CopyRow text="me закончив делать пружину, примерил ее на модель" />
              <CopyRow text="me положил щипцы на стол" />
              <CopyRow text="do На столе лежат паяльник, воск, стальная миска и шпатель для воска." />
              <CopyRow text="me взял воск и положил в миску" />
              <CopyRow text="me взял со стола паяльник и шпатель" />
              <CopyRow text="me включив паяльник, начал нагревать воск" />
              <CopyRow text="me взяв шпателем нагретый воск, начал соединять элементы пластины" />
              <CopyRow text="me закончив соединять элементы, выключил паяльник и отодвинул миску" />
              <CopyRow text="do На столе лежит кусочек пластмассы." />
              <CopyRow text="me взял кусочек пластмассы и поставил его в середину пластины" />
              <CopyRow text="do На столе лежат тюбик с жидкостью и тюбик с порошком Vertex." />
              <CopyRow text="me взял со стола тюбик с жидкостью и открыл его" />
              <CopyRow text="me покрыл жидкостью середину пластины" />
              <CopyRow text="me взял со стола тюбик с порошком и открыл его" />
              <CopyRow text="me начал наносить слой порошка на середину пластины" />
              <CopyRow text="do Рядом стоит холодильник." />
              <CopyRow text="me открыл дверь холодильника" />
              <CopyRow text="me положил в холодильник модель челюсти и закрыл дверь" />
              <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">Ждём 1 минуту.</p>
              <CopyRow text="me открыл холодильник и достал из него модель челюсти" />
              <CopyRow text="me отсоединил готовую пластинку от модели" />
              <CopyRow text="me вытащил из модели пластмассу" />
              <CopyRow text="do На столе лежит специальный замочек." />
              <CopyRow text="me взял со стола замочек и установил его на пластинку" />
              <CopyRow text="do На столе стоит микромотор." />
              <CopyRow text="me включил микромотор и начал обрезать острые края пластинки" />
              <CopyRow text="me закончив обрезать острые края пластинки, выключил микромотор" />
              <CopyRow text="do На столе стоят шлифмашинка и ящик." />
              <CopyRow text="do В ящике лежат насадки для шлифовки." />
              <CopyRow text="me открыл ящик и взял из него необходимую насадку" />
              <CopyRow text="me установил насадку на конец шлифмашинки и включил ее" />
              <CopyRow text="me начал шлифовать пластинку" />
              <CopyRow text="me закончив шлифовать пластинку, выключил шлифмашинку" />
              <CopyRow text="do На столе лежит кейс для пластинки." />
              <CopyRow text="me открыл кейс и положил в него пластинку" />
            </SubAccordion>
          </SubAccordion>

          {/* Женские отыгровки */}
          <SubAccordion label="♀ Женские отыгровки">
            <SubAccordion label="Создание пластин">
              <CopyRow text="do Рядом стоит шкаф." />
              <CopyRow text="do В шкафу лежат гипсовые модели челюстей." />
              <CopyRow text="me открыла шкаф и взяла необходимую модель" />
              <CopyRow text="me закрыла шкаф" />
              <CopyRow text="do Рядом стоит стол." />
              <CopyRow text="me положила модель челюсти на стол" />
              <CopyRow text="do На столе лежит маркер." />
              <CopyRow text="me взяла маркер и сделала разметку в определенной части модели" />
              <CopyRow text="do Коробка с кламмерами лежит на столе." />
              <CopyRow text="me открыла коробку и достала из нее один кламмер" />
              <CopyRow text="do На столе лежат круглогубцы." />
              <CopyRow text="me взяла круглогубцы и начала изгибать плечи кламмера" />
              <CopyRow text="me закончив изгибать плечи кламмера, начала изгибать тело кламмера" />
              <CopyRow text="me закончив работу с кламмером, примерила его на помеченную маркером часть модели" />
              <CopyRow text="do Кламмер подошел к зубу." />
              <CopyRow text="me положила круглогубцы на стол" />
              <CopyRow text="do Катушка проволоки лежит на столе." />
              <CopyRow text="me взяла катушку и потянула проволоку" />
              <CopyRow text="me приложила проволоку к модели и отмерила дугу" />
              <CopyRow text="do На столе лежат стоматологические щипцы." />
              <CopyRow text="me взяла щипцы и обрезала проволоку в нужном месте" />
              <CopyRow text="me взяла со стола маркер и сделала пометки на дуге" />
              <CopyRow text="me положила маркер на стол" />
              <CopyRow text="me начала делать щипцами изгибы в помеченных местах" />
              <CopyRow text="me закончив изгибать проволоку, примерила ее на модель" />
              <CopyRow text="me потянула необходимую часть проволоки и обрезала ее щипцами" />
              <CopyRow text="me взяла проволоку и начала разрезать ее на три части" />
              <CopyRow text="me закончив обрезать проволоку, взяла один кусочек и начала делать пружину" />
              <CopyRow text="me закончив делать пружину, примерила ее на модель" />
              <CopyRow text="me положила щипцы на стол" />
              <CopyRow text="do На столе лежат паяльник, воск, стальная миска и шпатель для воска." />
              <CopyRow text="me взяла воск и положила в миску" />
              <CopyRow text="me взяла со стола паяльник и шпатель" />
              <CopyRow text="me включив паяльник, начала нагревать воск" />
              <CopyRow text="me взяв шпателем нагретый воск, начала соединять элементы пластины" />
              <CopyRow text="me закончив соединять элементы, выключила паяльник и отодвинула миску" />
              <CopyRow text="do На столе лежит кусочек пластмассы." />
              <CopyRow text="me взяла кусочек пластмассы и поставила его в середину пластины" />
              <CopyRow text="do На столе лежат тюбик с жидкостью и тюбик с порошком Vertex." />
              <CopyRow text="me взяла со стола тюбик с жидкостью и открыла его" />
              <CopyRow text="me покрыла жидкостью середину пластины" />
              <CopyRow text="me взяла со стола тюбик с порошком и открыла его" />
              <CopyRow text="me начала наносить слой порошка на середину пластины" />
              <CopyRow text="do Рядом стоит холодильник." />
              <CopyRow text="me открыла дверь холодильника" />
              <CopyRow text="me положила в холодильник модель челюсти и закрыла дверь" />
              <p className="text-xs text-red-600 dark:text-red-400 font-medium px-1">Ждём 1 минуту.</p>
              <CopyRow text="me открыла холодильник и достала из него модель челюсти" />
              <CopyRow text="me отсоединила готовую пластинку от модели" />
              <CopyRow text="me вытащила из модели пластмассу" />
              <CopyRow text="do На столе лежит специальный замочек." />
              <CopyRow text="me взяла со стола замочек и установила его на пластинку" />
              <CopyRow text="do На столе стоит микромотор." />
              <CopyRow text="me включила микромотор и начала обрезать острые края пластинки" />
              <CopyRow text="me закончив обрезать острые края пластинки, выключила микромотор" />
              <CopyRow text="do На столе стоят шлифмашинка и ящик." />
              <CopyRow text="do В ящике лежат насадки для шлифовки." />
              <CopyRow text="me открыла ящик и взяла из него необходимую насадку" />
              <CopyRow text="me установила насадку на конец шлифмашинки и включила ее" />
              <CopyRow text="me начала шлифовать пластинку" />
              <CopyRow text="me закончив шлифовать пластинку, выключила шлифмашинку" />
              <CopyRow text="do На столе лежит кейс для пластинки." />
              <CopyRow text="me открыла кейс и положила в него пластинку" />
            </SubAccordion>
          </SubAccordion>

          {/* Общее предупреждение */}
          <WarningBox>
            <strong>ВАЖНО:</strong> Все услуги, в том числе и создание пластин проводить на 4 этаже нашей больницы в процедурном кабинете.
          </WarningBox>
        </div>
      </Accordion>

      {/* Аккордеон ОДС */}
      <Accordion label="Отделение Дневного Стационара">
        <p>
          Отделение Дневного Стационара (ОДС) – это одно из отделений ЦГБ города Невский, сотрудники которого занимаются как основной работой больницы, так и оказанием услуг на базе Травматолого-ортопедического центра, проведением проверок аптек и травматологических рейдов для населения и сотрудников государственных организаций.
        </p>

        {/* Система должностей */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-center text-foreground">Система должностей Травматолого-ортопедического центра</p>
          <ul className="text-sm text-foreground leading-relaxed list-none flex flex-col gap-1 pl-2">
            <li>Лаборант [3] – Врач-ортопед [3]</li>
            <li>Врач-стажер [4] – Врач-ревматолог [4]</li>
            <li>Врач-участковый [5] – Врач-травматолог высшей категории [5]</li>
            <li>Врач-терапевт [6] – Врач по лечебной физкультуре [6]</li>
          </ul>
        </div>

        {/* Травматологический рейд */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-center text-foreground">Травматологический рейд</p>
          <p>
            Травматологический рейд – это мероприятие, проводимое сотрудниками ОДС как для гражданского населения, так и для работников государственных организаций. В рамках рейда проводится осмотр врача-травматолога. При необходимости оказываются дополнительные услуги.
          </p>
          <p className="text-sm text-foreground">
            Отыгровки для проведения Травматологического рейда на МЗ Портале:{" "}
            <a
              href="https://mz.kaze.red/dash/types/55"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
            >
              МЗ Портал | Услуги Травматолого-ортопедического центра
              <Icon name="ExternalLink" size={12} />
            </a>
            .
          </p>
          <p>
            В данном отделение работа заключается в оказании помощи гражданам при переломах и ожогах, а также тщательное наблюдение в стенах больницы за пациентами. Также, взаимодействует с МВД, если поступил пациент с явным признаком следов побоев, детально осматривает данного пострадавшего, если имелись факты физического насилия. Помимо этого, данное отделение выезжает на проверку фармацевтических помещений (Аптеки).
          </p>
        </div>

        {/* Отыгровки для ОДС */}
        <div className="border border-border rounded-sm p-4 flex flex-col gap-3">
          <p className="text-sm font-bold text-center text-foreground">Отыгровки для ОДС</p>

          {/* Мужские отыгровки */}
          <SubAccordion label="♂ Мужские отыгровки">
            <SubAccordion label="Доклады для выезда на проверку аптек">
              <CopyRow text="r ТЭГ АСМП. Выехал на проверку аптеки. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Прибыл на проверку аптеки. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Закончил проверку аптеки. Возвращаюсь на базу. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Проверка аптеки. На базе. Напарники: фамилии (если есть)" />
            </SubAccordion>
            <SubAccordion label="Проверка аптек">
              <p className="text-xs text-foreground leading-relaxed px-1">
                Все отыгровки проверки аптек можно найти на МЗ Портале:{" "}
                <a
                  href="https://mz.kaze.red/dash/types/56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  МЗ Портал | Проверка аптек
                  <Icon name="ExternalLink" size={11} />
                </a>
                .
              </p>
            </SubAccordion>
          </SubAccordion>

          {/* Женские отыгровки */}
          <SubAccordion label="♀ Женские отыгровки">
            <SubAccordion label="Доклады для выезда на проверку аптек">
              <CopyRow text="r ТЭГ АСМП. Выехала на проверку аптеки. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Прибыла на проверку аптеки. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Закончила проверку аптеки. Возвращаюсь на базу. Напарники: фамилии (если есть)" />
              <CopyRow text="r ТЭГ АСМП. Проверка аптеки. На базе. Напарники: фамилии (если есть)" />
            </SubAccordion>
            <SubAccordion label="Проверка аптек">
              <p className="text-xs text-foreground leading-relaxed px-1">
                Все отыгровки проверки аптек можно найти на МЗ Портале:{" "}
                <a
                  href="https://mz.kaze.red/dash/types/56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  МЗ Портал | Проверка аптек
                  <Icon name="ExternalLink" size={11} />
                </a>
                .
              </p>
            </SubAccordion>
          </SubAccordion>

          {/* Общее предупреждение */}
          <WarningBox>
            <strong>ВАЖНО:</strong> Делайте все отыгровки, обязательно не забывая «Действия в ЦГБ перед проверкой аптек», которые проводятся на 4-м этаже нашей больницы в процедурном кабинете и помимо отыгровок проверок уже на месте, Вы заканчиваете свою проверку отыгровками «Действия в ЦГБ после проверки аптек» также на 4-м этаже нашей больнице в процедурном кабинете. Обязательно фиксируйте все действия отдельными скриншотами и все доклады, чтобы у проверяющего не было к Вам вопросов.
          </WarningBox>
        </div>
      </Accordion>
    </div>
  );
}