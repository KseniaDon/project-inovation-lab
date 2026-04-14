import Icon from "@/components/ui/icon";
import ImageLightbox from "@/components/ui/image-lightbox";
import { SectionId } from "./learnConfig";

interface LearnGovSectionProps {
  go: (id: SectionId) => void;
}

const GOV_URL = "https://forum.gtaprovince.ru/topic/995718-cgb-g-nevskiy-informacionnyy-razdel-otdeleniya-internatury/";
const MIS_URL = "https://docs.google.com/forms/d/e/1FAIpQLScO0bFomyEMvIseA4JHYSQiNTWdmN3DinF4Ra7gv7eCQKMqEw/viewform";

export default function LearnGovSection({ go }: LearnGovSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Шапка */}
      <div>
        <button
          onClick={() => go("intern-mis")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к МИС «Здоровье»
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 4: Отчет на повышение</p>
        <h1 className="text-3xl font-bold">Госпортал</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.4. Госпортал</p>

      {/* Описание */}
      <p className="text-base text-foreground leading-relaxed">
        Информационный раздел Отделения Интернатуры — это официальный источник информации о нашем отделении. Здесь указаны все критерии для повышения, что Вам предстоит сделать и как правильно подать отчет на повышение по форме.
      </p>

      {/* Кнопка перехода на госпортал */}
      <a
        href={GOV_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 border border-red-600/40 bg-red-600/5 hover:bg-red-600/10 rounded-sm px-4 py-3.5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Icon name="Globe" size={20} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Информационный раздел Отделения Интернатуры</p>
            <p className="text-xs text-muted-foreground mt-0.5">forum.gtaprovince.ru</p>
          </div>
        </div>
        <Icon name="ExternalLink" size={15} className="text-muted-foreground group-hover:text-red-400 transition-colors shrink-0" />
      </a>

      {/* Пояснение */}
      <p className="text-base text-foreground leading-relaxed">
        Этот раздел, в основном, предназначен для того, чтобы ты уведомил своё руководство, что ты загрузил свои доказательства в{" "}
        <a
          href={MIS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-400 font-semibold transition-colors"
        >
          МИС «Здоровье»
        </a>
        . Без этого действия твой отчёт не будет рассмотрен, так что не забывай об этом.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Давай разберемся, как подавать отчет на повышение в нашем разделе:
      </p>

      {/* Пошаговая инструкция */}
      <div className="border border-border rounded-sm p-4 sm:p-6 flex flex-col gap-6">
        <h2 className="text-lg font-bold text-red-500 text-center">Пошаговая инструкция для подачи отчета на повышение</h2>

        {/* Шаг 1 */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-center text-foreground">Шаг 1. Знакомство с Информационным разделом ОИ</p>
          <p className="text-base text-foreground leading-relaxed">
            Переходя по ссылке, на первой странице ты сталкиваешься с общей информацией о нашем отделении, как на скриншоте №1;
          </p>
          <ImageLightbox
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/cfba417c-3c11-481b-81bf-45ac5d3a08b2.png"
            alt="Скриншот №1"
            className="w-full max-w-3xl rounded-sm border border-border"
            caption="Скриншот №1: Основная информация о нашем отделении."
          />
        </div>

        {/* Шаг 2 */}
        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          <p className="text-base font-semibold text-center text-foreground">Шаг 2. Критерии для повышения</p>
          <p className="text-base text-foreground leading-relaxed">
            Как и писалось ранее в другом разделе, есть определенные критерии для подачи отчета. Здесь уже представлены в полном объеме критерии на должности{" "}
            <span className="text-red-400 font-semibold">Интерн</span>{" "}
            и{" "}
            <span className="text-red-400 font-semibold">Фельдшер</span>
            . На скриншоте №2 можно ознакомиться с этими критериями.
          </p>
          <ImageLightbox
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/2283c700-7904-49a4-8eeb-0145f62c3dfe.png"
            alt="Скриншот №2"
            className="w-full max-w-3xl rounded-sm border border-border"
            caption="Скриншот №2: Критерии для повышения."
          />
        </div>

        {/* Шаг 3 */}
        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          <p className="text-base font-semibold text-center text-foreground">Шаг 3. Премии за перевыполнение нормы</p>
          <p className="text-base text-foreground leading-relaxed">
            В нашей больнице существует система поощрения, если основные критерии будут выполнены и к ним добавится дополнительно выполненная работа. На скриншоте №3 представлена сумма премии и сама работа.
          </p>

          {/* Оранжевое предупреждение */}
          <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 rounded-sm px-4 py-3.5">
            <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-orange-300">ВАЖНО:</p>
              <p className="text-sm text-orange-200 leading-relaxed">
                если в доказательствах при подачи отчета у тебя будут ошибки, но будут дополнительные работы, то автоматически проверяющий не зачтет данное доказательство, но рассмотрит другое. Например: если у тебя на должности интерна 6 лечений и одно из них не правильное, то дополнительное лечение мы зачтем в пользу выполнения общего критерия, чтобы ты дальше смог повыситься. В данном случае, премии тебе не будет, но будет возможность повыситься без переделки отчета.
              </p>
            </div>
          </div>

          <div className="w-full max-w-3xl rounded-sm border border-border bg-secondary/20 flex items-center justify-center py-12 text-sm text-muted-foreground">
            Скриншот №3
          </div>
          <p className="text-xs text-muted-foreground text-center">Скриншот №3: Премии за дополнительную работу.</p>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => go("intern-mis")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="ChevronLeft" size={14} />
          МИС «Здоровье»
        </button>
      </div>
    </div>
  );
}