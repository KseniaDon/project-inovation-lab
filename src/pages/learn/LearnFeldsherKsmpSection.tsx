import { useState } from "react";
import Icon from "@/components/ui/icon";
import ImageLightbox from "@/components/ui/image-lightbox";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherKsmpSection({ go }: Props) {
  const [accordionOpen, setAccordionOpen] = useState(false);

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
        <h1 className="text-2xl sm:text-3xl font-bold">Рабочий транспорт</h1>
        <p className="text-base font-semibold text-muted-foreground">1.1 Рабочий транспорт.</p>
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

      {/* Аккордеон */}
      <div className="border border-border rounded-lg overflow-hidden">

        {/* Заголовок-кнопка аккордеона */}
        <button
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="w-full flex items-center justify-between px-5 py-4 text-base font-semibold hover:bg-secondary/50 transition-colors"
        >
          <span>Внешность транспорта и его предназначение</span>
          <Icon
            name="ChevronDown"
            size={18}
            className={`text-muted-foreground transition-transform duration-200 ${accordionOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Содержимое аккордеона */}
        {accordionOpen && (
          <div className="flex flex-col gap-6 px-5 pb-6 pt-2 border-t border-border">

            {/* 1. РАСМП */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">1.</span>
                <p className="text-base leading-relaxed">
                  <span className="inline-block bg-yellow-100 border border-yellow-300 rounded px-2 py-0.5 text-red-600 font-semibold text-sm mr-1">РАСМП</span>
                  {" "}— это Реанимационный автомобиль скорой медицинской помощи. Мы его используем для обработки вызовов и запросов от других госструктур. Работать в патрулировании и на постах на данном транспорте —{" "}
                  <span className="text-red-600 font-bold">запрещено</span>.
                  {" "}Как выглядит РАСМП, можно посмотреть на скриншоте №1.
                </p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/fa062aad-5776-47c4-82a3-548c67e1b764.png"
                alt="РАСМП"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №1: РАСМП."
              />
            </div>

            {/* 2. АСМП */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">2.</span>
                <p className="text-base leading-relaxed">
                  <span className="inline-block bg-white border border-gray-300 rounded px-2 py-0.5 text-red-600 font-semibold text-sm mr-1">АСМП</span>
                  {" "}— это Автомобиль скорой медицинской помощи. Его мы используем для работы в патрулях, постах и для проведения ПРМО и мероприятий. Считается универсальным транспортом, так как на нём также можно обрабатывать вызовы, но только находясь в патруле или на посту, или же, когда Вы едете на ПРМО и увидели человека, которому нужна помощь. Обрабатывать вызовы, которые поступили пока Вы находились в больнице —{" "}
                  <span className="text-red-600 font-bold">запрещено</span>.
                  {" "}Как выглядит АСМП можно посмотреть на скриншоте №2.
                </p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/82011608-3a80-430c-b57b-2981c143d89a.png"
                alt="АСМП"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №2: АСМП."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <ImageLightbox
                  src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/5c6b5b85-0907-48cd-9144-fed2c94d11c7.png"
                  alt="АСМП вид спереди"
                  className="w-full rounded-sm border border-border"
                  caption="Скриншот №2.1: АСМП — вид спереди."
                />
                <ImageLightbox
                  src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/5edfcb60-c4b4-45a3-9032-c63ef3dc6e68.png"
                  alt="АСМП вид сбоку"
                  className="w-full rounded-sm border border-border"
                  caption="Скриншот №2.2: АСМП — вид сбоку."
                />
                <ImageLightbox
                  src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/6bc78c44-1028-4279-a4a5-1519af756b6f.png"
                  alt="АСМП ночью"
                  className="w-full rounded-sm border border-border"
                  caption="Скриншот №2.3: АСМП — ночью."
                />
                <ImageLightbox
                  src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/2cec1ba6-3d6b-498c-9c49-35d9ca13a25e.png"
                  alt="АСМП на трассе"
                  className="w-full rounded-sm border border-border"
                  caption="Скриншот №2.4: АСМП — на трассе."
                />
                <ImageLightbox
                  src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/9a489192-c146-4c5d-9eae-5755200ad3dd.png"
                  alt="АСМП у ворот"
                  className="w-full rounded-sm border border-border"
                  caption="Скриншот №2.5: АСМП — у ворот."
                />
              </div>
            </div>

            {/* 3. ВСМП */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">3.</span>
                <p className="text-base leading-relaxed">
                  <span className="inline-block bg-red-500 border border-red-600 rounded px-2 py-0.5 text-white font-semibold text-sm mr-1">ВСМП</span>
                  {" "}— это Вертолёт скорой медицинской помощи. Данным видом воздушного транспорта может управлять только Руководящий Состав, начиная от должности Врач-хирург (7 ранг) и выше. Но прежде, чем управлять данным транспортом, нужно получить лётную лицензию и сдать экзамен по пилотированию Главному Врачу. Используется данный транспорт также для обработки вызовов, запросов от других госструктур, в патрулировании и для проведения каких-либо глобальных мероприятий. Просто так брать транспорт —{" "}
                  <span className="text-red-600 font-bold">нельзя</span>, как и лететь одному. Обязательно нужна отчётность о его взятии и цели, а также второй пилот, в качестве напарника, начиная от Врача-участкового (5 ранга). Как выглядит ВСМП можно посмотреть на скриншоте №3.
                </p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/ec1525b9-8dcf-42fd-85cf-bfe659b749be.png"
                alt="ВСМП"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №3: ВСМП."
              />
            </div>

            {/* 4. ПАЗ */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">4.</span>
                <p className="text-base leading-relaxed">
                  <span className="inline-block bg-gray-400 border border-gray-500 rounded px-2 py-0.5 text-white font-semibold text-sm mr-1">ПАЗ-32053 рестайлинг</span>
                  {" "}— это Автобус для перевозки сотрудников в определённые точки во время проведения мероприятий, как и среди своей больницы, так и для проведения мероприятий для всех больниц. За рулём данного транспорта может сидеть только Руководящий Состав, который организовал мероприятие, начиная от должности Врач-хирург (7 ранг) и выше. Как выглядит автобус можно посмотреть на скриншоте №4.
                </p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/4f95dcf6-09b4-4c43-a65e-6f2cddfd20d4.png"
                alt="ПАЗ-32053 рестайлинг"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №4: Автобус ПАЗ-32053 рестайлинг."
              />
            </div>

          </div>
        )}
      </div>

      {/* Основные правила */}
      <p className="text-sm text-left leading-relaxed">
        <span className="text-foreground">Основные правила работы на рабочем транспорте Вы можете посмотреть в официальном источнике ОУМЗ на госпортале:{" "}</span>
        <a
          href="https://forum.gtaprovince.ru/topic/853771-mz-obschiy-ustav-ministerstva-zdravoohraneniya/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-red-500 hover:text-red-400 transition-colors"
        >
          Глава 8. Правила использования рабочего транспорта.
        </a>
      </p>

      {/* Информационный раздел автопарка */}
      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы по автопарку:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/#comment-6982188"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Раздел 12. Автопарк.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>

    </div>
  );
}