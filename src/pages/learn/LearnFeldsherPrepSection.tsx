import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherPrepSection({ go }: Props) {
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
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 2: Отчет на допуск</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Подготовка к допуску</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">2.1. Подготовка к допуску</p>

      <div className="text-base text-foreground leading-relaxed">
        <p className="mb-3">
          Ваша работа на должности Фельдшер должна быть выполнена и представлена для допуска к завершающему экзамену «Теоретический Квалификационный Модуль» в таком объеме и последовательности:
        </p>
        <ol className="flex flex-col gap-2 list-none pl-0">
          <li className="flex gap-2">
            <span className="font-semibold text-foreground shrink-0">1.</span>
            <span>Вылечить <span className="text-red-500 font-semibold">10 пациентов</span>;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground shrink-0">2.</span>
            <span>Посетить <span className="text-red-500 font-semibold">1 строй</span> руководящего состава;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground shrink-0">3.</span>
            <span>Сдать <span className="text-red-500 font-semibold">Первичный Медицинский Экзамен (ПМЭ)</span>, который включает: информацию о больнице, практический экзамен по выдаче препаратов, вопросы по Внутреннему уставу;</span>
          </li>
          <li className="list-none">
            <div className="border border-border rounded-sm px-5 py-4 flex flex-col gap-3 mt-1 ml-5">
              <p className="text-base font-semibold text-foreground">Первичный Медицинский Экзамен (ПМЭ) включает в себя:</p>
              <ul className="flex flex-col gap-1.5 pl-1">
                {[
                  "Информацию о больнице;",
                  "Практический экзамен по выдаче препаратов;",
                  "Вопросы по Внутреннему уставу.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground shrink-0">4.</span>
            <span>Загрузить доказательства в МИС «Здоровье»;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground shrink-0">5.</span>
            <span>Оставить заявление на госпортал, о том, что Вы загрузили свои доказательства в МИС «Здоровье».</span>
          </li>
        </ol>
      </div>

      <div className="flex flex-col gap-3 border border-border rounded-sm p-4 bg-secondary/30">
        <p className="text-sm text-foreground leading-relaxed">
          Доказательства проделанной работы публикуются в{" "}
          <a href="https://docs.google.com/forms/d/e/1FAIpQLScO0bFomyEMvIseA4JHYSQiNTWdmN3DinF4Ra7gv7eCQKMqEw/viewform" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-semibold">
            МИС «Здоровье» <Icon name="ExternalLink" size={13} />
          </a>
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Заявление на повышение подается в специальном разделе на госпортале по форме:{" "}
          <a href="https://forum.gtaprovince.ru/topic/995718-cgb-g-nevskiy-informacionnyy-razdel-otdeleniya-internatury" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-semibold">
            Информационный раздел Отделения Интернатуры <Icon name="ExternalLink" size={13} />
          </a>
        </p>
      </div>

      <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
        <p>
          Как загружать в МИС «Здоровье» рассказано в этом разделе:{" "}
          <button onClick={() => go("intern-mis")} className="text-red-500 hover:text-red-400 transition-colors font-semibold">
            Интерн | МИС «Здоровье»
          </button>{" "}
          — меняете только критерии, которые уже нужны на допуск к ТКМ.
        </p>
        <p>
          Как написать заявление на госпортал рассказано в этом разделе:{" "}
          <button onClick={() => go("intern-gov")} className="text-red-500 hover:text-red-400 transition-colors font-semibold">
            Интерн | Госпортал
          </button>{" "}
          — там же Вы найдете форму подачи отчета на допуск к ТКМ.
        </p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => go("feldsher-evidence")}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors font-medium">
          Далее: Фиксация доказательств
          <Icon name="ChevronRight" size={14} />
        </button>
      </div>
    </div>
  );
}