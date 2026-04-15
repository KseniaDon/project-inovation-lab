import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherKsmpSection({ go }: Props) {
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
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Фельдшер</p>
        <h1 className="text-3xl font-bold">Работа с КСМП</h1>
      </div>

      {/* Вводный абзац */}
      <p className="text-base leading-relaxed">
        Транспорт МЗ имеет достаточный ассортимент для оказания помощи всем нуждающимся в республике, однако есть что улучшать.
      </p>

      {/* Описание транспорта в больницах */}
      <p className="text-base leading-relaxed">
        В каждой больнице имеется автомобиль <strong>ГАЗель NEXT Луидор</strong> скорой медицинской помощи{" "}
        <span className="text-red-600 font-medium">РАСМП</span> и{" "}
        <span className="text-red-600 font-medium">АСМП</span>, по одному медицинскому вертолёту{" "}
        <span className="text-red-600 font-medium">ВСМП</span> с соответствующей площадкой на крыше больницы и автобус{" "}
        <span className="text-red-600 font-medium">ПАЗ-32053 рестайлинг</span>.
      </p>

      {/* Количество транспорта */}
      <div>
        <p className="text-base font-semibold mb-3">Кол-во рабочего транспорта в больницах:</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-base">
            <span className="font-semibold text-sky-500">ОКБ-М</span>
            <span className="text-muted-foreground">—</span>
            <span>8 АСМП, 4 РАСМП, 1 ВСМП, 1 ПАЗ</span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <span className="font-semibold text-red-600">ЦГБ-П</span>
            <span className="text-muted-foreground">—</span>
            <span>6 АСМП, 4 РАСМП, 1 ВСМП, 1 ПАЗ</span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <span className="font-semibold text-green-600">ЦГБ-Н</span>
            <span className="text-muted-foreground">—</span>
            <span>4 АСМП, 4 РАСМП, 1 ВСМП, 1 ПАЗ</span>
          </div>
        </div>
      </div>

      <p className="text-base leading-relaxed">Теперь поговорим о работе на транспорте.</p>

      {/* Заголовок секции в рамке */}
      <div className="border border-current rounded-lg flex items-center justify-center py-4 px-6">
        <p className="text-base font-semibold text-center">Внешность транспорта и его предназначение</p>
      </div>

      {/* 1. РАСМП */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-base font-semibold">1.</span>
          <div>
            <span className="inline-block bg-yellow-100 border border-yellow-300 rounded px-2 py-0.5 text-red-600 font-semibold text-sm mr-2">РАСМП</span>
            <span className="text-base">
              — это Реанимационный автомобиль скорой медицинской помощи. Мы его используем для обработки вызовов и запросов от других госструктур. Работать в патрулировании и на постах на данном транспорте —{" "}
              <span className="text-red-600 font-bold">запрещено</span>.
              {" "}Как выглядит РАСМП, можно посмотреть на скриншоте №1.
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 mt-1">
          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/fa062aad-5776-47c4-82a3-548c67e1b764.png"
            alt="РАСМП"
            className="rounded-lg max-w-full w-full max-w-2xl object-cover"
          />
          <p className="text-sm text-muted-foreground italic">Скриншот №1: РАСМП.</p>
        </div>
      </div>

      {/* 2. АСМП */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-base font-semibold">2.</span>
          <div>
            <span className="inline-block bg-white border border-gray-300 rounded px-2 py-0.5 text-red-600 font-semibold text-sm mr-2">АСМП</span>
            <span className="text-base">
              — это Автомобиль скорой медицинской помощи. Его мы используем для работы в патрулях, постах и для проведения ПРМО. Считается универсальным транспортом, так как на нём также можно обрабатывать вызовы, но только находясь на патруле или посту или же, когда Вы едете на ПРМО и увидели человека, которому нужна помощь. Обрабатывать вызовы, которые поступили пока Вы находились в больнице —{" "}
              <span className="text-red-600 font-bold">запрещено</span>.
              {" "}Как выглядит АСМП можно посмотреть на скриншоте №2.
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 mt-1">
          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/82011608-3a80-430c-b57b-2981c143d89a.png"
            alt="АСМП"
            className="rounded-lg max-w-full w-full max-w-2xl object-cover"
          />
          <p className="text-sm text-muted-foreground italic">Скриншот №2: АСМП.</p>
        </div>
      </div>

      {/* 3. ВСМП */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-base font-semibold">3.</span>
          <div>
            <span className="inline-block bg-red-500 border border-red-600 rounded px-2 py-0.5 text-white font-semibold text-sm mr-2">ВСМП</span>
            <span className="text-base">
              — это Вертолёт скорой медицинской помощи. Данным видом воздушного транспорта могут использовать только Руководящий Состав, начиная от должности Врач-хирург (7 ранг) и выше. Но прежде, чем управлять данным транспортом, нужно получить лётную лицензию и сдать экзамен по пилотированию Главному Врачу. Используется данный транспорт также для обработки вызовов, запросов от других госструктур, в патрулировании и для проведения каких-либо глобальных мероприятий. Просто так брать транспорт{" "}
              <span className="text-red-600 font-bold">нельзя</span>, как и лететь одному. Обязательно нужна отчётность о его взятии и цели, а также второй пилот в качестве напарника, начиная от Врача-участкового (5 ранга). Как выглядит ВСМП можно посмотреть на скриншоте №3.
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 mt-1">
          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/ec1525b9-8dcf-42fd-85cf-bfe659b749be.png"
            alt="ВСМП"
            className="rounded-lg max-w-full w-full max-w-2xl object-cover"
          />
          <p className="text-sm text-muted-foreground italic">Скриншот №3: ВСМП.</p>
        </div>
      </div>

      {/* 4. ПАЗ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-base font-semibold">4.</span>
          <div>
            <span className="inline-block bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-white font-semibold text-sm mr-2" style={{ backgroundColor: "#9ca3af" }}>ПАЗ-32053 рестайлинг</span>
            <span className="text-base">
              {" "}— это Автобус для перевозки сотрудников в определённые точки во время проведения мероприятий как и среди своей больницы, так и для проведения мероприятий для всех больниц. За рулём данного транспорта могут сидеть только Руководящий Состав, который организовал мероприятие, начиная от должности Врач-хирург (7 ранг) и выше. Как выглядит автобус можно посмотреть на скриншоте №4.
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 mt-1">
          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/4f95dcf6-09b4-4c43-a65e-6f2cddfd20d4.png"
            alt="ПАЗ-32053 рестайлинг"
            className="rounded-lg max-w-full w-full max-w-2xl object-cover"
          />
          <p className="text-sm text-muted-foreground italic">Скриншот №4: Автобус ПАЗ-32053 рестайлинг.</p>
        </div>
      </div>
    </div>
  );
}
