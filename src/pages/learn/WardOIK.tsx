import Icon from "@/components/ui/icon";
import { Accordion, SubAccordion, CopyRow, WarningBox } from "./WardsShared";

export default function WardOIK() {
  return (
    <Accordion label="Отделение Инфекционного Контроля">
      <p>
        Отделение Инфекционного Контроля (ОИК) – это одно из отделений ЦГБ города Невский, сотрудники которого занимаются как основной работой больницы, так и оказанием услуг на базе НИИ Эпидемиологии, проведением санитарных проверок и инфекционных рейдов для населения и сотрудников государственных организаций.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-center text-foreground">Система должностей НИИ Эпидемиологии</p>
        <ul className="text-sm text-foreground leading-relaxed list-none flex flex-col gap-1 pl-2">
          <li>Лаборант [3] – Лаборант-инфекционист [3];</li>
          <li>Врач-стажер [4] – Врач-вирусолог [4];</li>
          <li>Врач-участковый [5] – Врач-бактериолог [5];</li>
          <li>Врач-терапевт [6] – Врач-паразитолог [6].</li>
        </ul>
      </div>

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

      <div className="border border-border rounded-sm p-4 flex flex-col gap-3">
        <p className="text-sm font-bold text-center text-foreground">Отыгровки для ОИК</p>

        <SubAccordion label="♂ Мужские отыгровки">
          <SubAccordion label="Доклады для выезда на санитарные проверки">
            <CopyRow text="r ТЭГ АСМП. Выехал на проверку здания: Название. Напарники: фамилии (если есть)" />
            <CopyRow text="r ТЭГ АСМП. Выехал на проверку здания: Название. Напарники: фамилии (если есть)" />
            <CopyRow text="r ТЭГ АСМП. Закончил проверку здания: Название. Возвращаюсь на базу. Напарники: фамилии (если есть)" />
            <CopyRow text="r ТЭГ АСМП. Проверка здания: Название. На базе. Напарники: фамилии (если есть)" />
          </SubAccordion>
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

        <SubAccordion label="♀ Женские отыгровки">
          <SubAccordion label="Доклады для выезда на санитарные проверки">
            <CopyRow text="r ТЭГ АСМП. Выехала на проверку здания: Название. Напарники: фамилии (если есть)" />
            <CopyRow text="r ТЭГ АСМП. Выехала на проверку здания: Название. Напарники: фамилии (если есть)" />
            <CopyRow text="r ТЭГ АСМП. Закончила проверку здания: Название. Возвращаюсь на базу. Напарники: фамилии (если есть)" />
            <CopyRow text="r ТЭГ АСМП. Проверка здания: Название. На базе. Напарники: фамилии (если есть)" />
          </SubAccordion>
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

        <WarningBox>
          <strong>ВАЖНО:</strong> Делайте все отыгровки, обязательно не забывая «Действия в ЦГБ перед санитарной проверкой», которые проводятся на 4-м этаже нашей больницы в процедурном кабинете и помимо отыгровок проверок уже на месте, Вы заканчиваете свою проверку отыгровками «Действия в ЦГБ после санитарной проверки» также на 4-м этаже нашей больнице в процедурном кабинете. Обязательно фиксируйте все действия отдельными скриншотами и все доклады, чтобы у проверяющего не было к Вам вопросов.
        </WarningBox>
      </div>
    </Accordion>
  );
}
