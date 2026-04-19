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
              <WarningBox>
                <strong>ВАЖНО:</strong> Делайте все отыгровки, обязательно не забывая «Действия в ЦГБ перед санитарной проверкой», которые проводятся на 4-м этаже нашей больницы в процедурном кабинете и помимо отыгровок проверок уже на месте, Вы заканчиваете свою проверку отыгровками «Действия в ЦГБ после санитарной проверки» также на 4-м этаже нашей больнице в процедурном кабинете. Обязательно фиксируйте все действия отдельными скриншотами и все доклады, чтобы у проверяющего не было к Вам вопросов.
              </WarningBox>
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
              <WarningBox>
                <strong>ВАЖНО:</strong> Делайте все отыгровки, обязательно не забывая «Действия в ЦГБ перед санитарной проверкой», которые проводятся на 4-м этаже нашей больницы в процедурном кабинете и помимо отыгровок проверок уже на месте, Вы заканчиваете свою проверку отыгровками «Действия в ЦГБ после санитарной проверки» также на 4-м этаже нашей больнице в процедурном кабинете. Обязательно фиксируйте все действия отдельными скриншотами и все доклады, чтобы у проверяющего не было к Вам вопросов.
              </WarningBox>
            </SubAccordion>
          </SubAccordion>
        </div>
      </Accordion>
    </div>
  );
}
