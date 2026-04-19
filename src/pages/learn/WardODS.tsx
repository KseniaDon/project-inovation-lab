import Icon from "@/components/ui/icon";
import { Accordion, SubAccordion, CopyRow, WarningBox } from "./WardsShared";

export default function WardODS() {
  return (
    <Accordion label="Отделение Дневного Стационара">
      <p>
        Отделение Дневного Стационара (ОДС) – это одно из отделений ЦГБ города Невский, сотрудники которого занимаются как основной работой больницы, так и оказанием услуг на базе Травматолого-ортопедического центра, проведением проверок аптек и травматологических рейдов для населения и сотрудников государственных организаций.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-center text-foreground">Система должностей Травматолого-ортопедического центра</p>
        <ul className="text-sm text-foreground leading-relaxed list-none flex flex-col gap-1 pl-2">
          <li>Лаборант [3] – Врач-ортопед [3]</li>
          <li>Врач-стажер [4] – Врач-ревматолог [4]</li>
          <li>Врач-участковый [5] – Врач-травматолог высшей категории [5]</li>
          <li>Врач-терапевт [6] – Врач по лечебной физкультуре [6]</li>
        </ul>
      </div>

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

      <div className="border border-border rounded-sm p-4 flex flex-col gap-3">
        <p className="text-sm font-bold text-center text-foreground">Отыгровки для ОДС</p>

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

        <WarningBox>
          <strong>ВАЖНО:</strong> Делайте все отыгровки, обязательно не забывая «Действия в ЦГБ перед проверкой аптек», которые проводятся на 4-м этаже нашей больницы в процедурном кабинете и помимо отыгровок проверок уже на месте, Вы заканчиваете свою проверку отыгровками «Действия в ЦГБ после проверки аптек» также на 4-м этаже нашей больнице в процедурном кабинете. Обязательно фиксируйте все действия отдельными скриншотами и все доклады, чтобы у проверяющего не было к Вам вопросов.
        </WarningBox>
      </div>
    </Accordion>
  );
}
