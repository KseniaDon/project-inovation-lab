import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherTkmSection({ go }: Props) {
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
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 3: Решающий экзамен</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Тест ТКМ</h1>
        <p className="text-base font-semibold text-muted-foreground">3.1 Тест ТКМ.</p>
      </div>

      <div className="flex flex-col gap-4 text-base text-foreground leading-relaxed">
        <p>
          Этот раздел будет посвящен описанию, что же такое ТКМ и что будет после его сдачи.
        </p>
        <p>
          <strong>Теоретический Квалификационный Модуль (ТКМ)</strong> — данный Квалификационный Модуль (КМ) содержит задания и состоит из нескольких разделов, которые предусматривают вашу профессиональную пригодность к работе в ЦГБ г. Невский.
        </p>
        <p className="font-semibold">Он содержит в себе 5 разделов:</p>
        <ol className="flex flex-col gap-2 list-none pl-0">
          <li className="flex gap-2">
            <span className="font-semibold shrink-0">1.</span>
            <span>Ваше будущее отделение — 3 вопроса — <span className="text-red-500 font-semibold">3 балла</span> за правильные ответы на эти вопросы;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold shrink-0">2.</span>
            <span>Уставная документация — 14 вопросов — <span className="text-red-500 font-semibold">36 баллов</span> за правильные ответы на вопросы;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold shrink-0">3.</span>
            <span>RP-сфера — 11 вопросов — <span className="text-red-500 font-semibold">31 балл</span> за правильные ответы на вопросы;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold shrink-0">4.</span>
            <span>Препараты — 3 вопроса — <span className="text-red-500 font-semibold">11 баллов</span> за правильные ответы на вопросы;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold shrink-0">5.</span>
            <span>Медицина — 7 вопросов — <span className="text-red-500 font-semibold">19 баллов</span> за правильные ответы на вопросы.</span>
          </li>
        </ol>

        <div className="flex flex-col gap-1">
          <p>Общая сумма: <span className="text-red-500 font-semibold">100 баллов</span>.</p>
          <p>Минимальное прохождение теста: <span className="text-red-500 font-semibold">70 баллов</span>.</p>
        </div>

        <p>
          После получения одобренного допуска на ТКМ — Руководящий состав ОИ уточнит, когда Вы сможете сдать тест и после этого выдаст <span className="text-red-500 font-semibold">Код активации</span>.
        </p>

        <p>
          На выполнение всех заданий отводится <span className="text-red-500 font-semibold">90 минут</span>. Задания рекомендуется выполнять по порядку.
        </p>

        <p>
          Если Вы внимательно читали наши разделы, ознакамливались с правилами на госпортале, которые мы прикрепляли, то сдать данный тест не составит труда. У Вас будет на его сдачу <strong>3 попытки</strong>. По истечению всех 3-х попыток и провалом сдачи — последует увольнение за провал в обучении Отделении Интернатуры. Так что будьте внимательны и готовьтесь заранее, ведь потом Вам придется работать с пациентами в полную силу, надеясь на самого себя.
        </p>

        <p>
          Если же Вы успешно сдали тест — последует повышение в должности и перевод в выбранное Вами отделение, а также выплата премии за успешное завершение обучение в Отделении Интернатуры.
        </p>
      </div>

      <p className="text-center text-red-500 font-semibold text-base leading-relaxed">
        Желаем Вам удачи в написании теста! С любовью — Руководящий Состав Отделения Интернатуры.
      </p>
    </div>
  );
}
