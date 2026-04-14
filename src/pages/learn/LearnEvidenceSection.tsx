import Icon from "@/components/ui/icon";
import ImageLightbox from "@/components/ui/image-lightbox";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import { defaultEvidencePage, SimplePageData } from "@/pages/admin/adminTypes";
import RichContent from "@/components/ui/rich-content";

interface LearnEvidenceSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnEvidenceSection({ go }: LearnEvidenceSectionProps) {
  const data = useSiteData<SimplePageData>("evidence_page", defaultEvidencePage);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-report")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к «Подготовка к повышению»
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 4: Отчет на повышение</p>
        <h1 className="text-3xl font-bold">{data.title}</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.2. Фиксация доказательств</p>

      <div className="text-base text-foreground leading-relaxed rich-content">
        <RichContent html={data.content} />
      </div>

      {/* Пошаговая инструкция */}
      <div className="border border-border rounded-sm p-4 sm:p-6 flex flex-col gap-5">
        <h2 className="text-lg font-bold text-red-500 text-center">Пошаговая инструкция по фиксации доказательств</h2>

        {/* Шаг 1 */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold text-center text-foreground">Шаг 1. Как правильно делать лечения</p>
          <p className="text-base text-foreground leading-relaxed">
            Мы всегда фиксируем свою работу, показывая чат, где видно как мы лечим пациента. Важно, чтобы была видна полная картина ситуации и все сделано правильно, а то есть:
          </p>
          <ul className="flex flex-col gap-2 ml-4 border-l-2 border-red-600/40 pl-4">
            {[
              "Приветствие с Вашим бейджем;",
              "Вопрос о том, чем Вы можете помочь пациенту;",
              "Проведение в палату для осмотра;",
              "Сделанный осмотр;",
              "Озвучивание диагноза и название препарата от этого диагноза;",
              "Называть стоимость в 500 рублей для всех препаратов (не важно, хоть будет 10 препаратов, фиксированная стоимость - 500 рублей);",
              "Спрашивание согласия на лечение у пациентов;",
              "После его согласия — передача препарата самому пациенту;",
              "Прощание «Всего доброго, не болейте!».",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 px-4 py-3">
            <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
            <p className="text-sm text-orange-300 leading-relaxed">
              <span className="font-bold">ВАЖНО:</span> Фиксируйте лечение с уведомлением «Пациент согласился на лечение» и чтобы было видно дата и время над HUD'ом (либо использованный{" "}
              <code className="bg-secondary border border-border rounded px-1.5 py-0.5 text-xs font-mono text-foreground">/timestamp</code>
              {" "}при прощании с пациентом).
            </p>
          </div>
          <p className="text-base text-foreground leading-relaxed">
            Для примера, возьмите этот скриншот №1:
          </p>
          <ImageLightbox
            src="https://sun9-10.userapi.com/s/v1/ig2/BfVbLIn-bhKJkPnmmmEk850nAyKXThCRgmq0xhHuZ3TqCTQBEJVXxor9tlbszzKeZZt8T9DYwaEJA-gFhR8OFUMi.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720&from=bu&u=2TJ_uumXIjuS2EWJ_SCZvv3vZVQQvdAlJvRm_vbDIhU&cs=1280x0"
            alt="Скриншот №1"
            className="w-full max-w-3xl rounded-sm border border-border"
            caption="Скриншот №1: Лечение пациента в палате и захват всего чата."
          />
          <div className="flex items-start gap-3 bg-sky-500/10 border border-sky-500/40 rounded-sm px-4 py-3">
            <span className="text-lg shrink-0 mt-0.5">💡</span>
            <p className="text-sm text-sky-300 leading-relaxed">
              <span className="font-bold">Совет:</span> обратите внимание на то, как на Скриншоте №1 выглядит чат. Он выглядит расширенным и туда помещаются и Ваши действия, и действия Ваших коллег, что увенчивается успехом при одобрении отчета. Также, будьте внимательнее и всегда надевайте медицинскую сумку, чтобы Вам не выдали наказание.
            </p>
          </div>
        </div>

        {/* Шаг 2 */}
        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          <p className="text-base font-semibold text-center text-foreground">Шаг 2. Как расширить чат</p>
          <p className="text-base text-foreground leading-relaxed">
            Во второй пошаговой инструкции мы разберем, как же сделать чат шире, если он автоматически был в уменьшенной версии.
          </p>
          <ol className="flex flex-col gap-4">
            <li className="flex flex-col gap-2">
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="shrink-0 font-medium text-muted-foreground">1.</span>
                <span>
                  Нажимаем в игре на <span className="font-bold text-red-500">Esc</span>, у Вас откроется главное меню игры. После того, как открыли, переходим в <span className="font-bold text-red-500">Настройки</span>, как показано на скриншоте №2;
                </span>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/07138672-8083-43ce-8a2c-e502fcaee6a4.jpg"
                alt="Скриншот №2"
                className="w-full max-w-3xl rounded-sm border border-border"
                caption='Скриншот №2: Главное меню и расположение кнопки "Настройки".'
              />
            </li>
            <li className="flex flex-col gap-2">
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="shrink-0 font-medium text-muted-foreground">2.</span>
                <span>
                  После того, как нажали <span className="font-bold text-red-500">Настройки</span>, мы переходим в <span className="font-bold text-red-500">Интерфейс</span>, как показано на скриншоте №3;
                </span>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/b3905453-6be0-4ec8-9f07-bb50d192ffba.jpg"
                alt="Скриншот №3"
                className="w-full max-w-3xl rounded-sm border border-border"
                caption='Скриншот №3: Меню настройки и расположение кнопки "Интерфейс".'
              />
            </li>
            <li className="flex flex-col gap-2">
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="shrink-0 font-medium text-muted-foreground">3.</span>
                <span>
                  Вы нажали на <span className="font-bold text-red-500">Интерфейс</span>, теперь переходим в <span className="font-bold text-red-500">Макет чата</span>, как показано на скриншоте №4;
                </span>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/e58738e2-9866-4d9a-beb4-99fc293059f4.jpg"
                alt="Скриншот №4"
                className="w-full max-w-3xl rounded-sm border border-border"
                caption='Скриншот №4: Меню интерфейса и расположение кнопки "Макет чата".'
              />
            </li>
            <li className="flex flex-col gap-2">
              <div className="flex items-start gap-2 text-sm text-foreground">
                <span className="shrink-0 font-medium text-muted-foreground">4.</span>
                <span>
                  Теперь у Вас открылось нужное окошко, а то есть — <span className="font-bold text-red-500">Макет чата</span>. Вы можете отредактировать по-своему и для Вашего удобства, либо взять с примера настроек чата, как на скриншоте №5.
                </span>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/597fabdc-38e7-4b8b-9165-93f5e1a18837.jpg"
                alt="Скриншот №5"
                className="w-full max-w-3xl rounded-sm border border-border"
                caption="Скриншот №5: Макет чата и его настройки."
              />
              <div className="flex items-start gap-3 bg-sky-500/10 border border-sky-500/40 rounded-sm px-4 py-3">
                <span className="text-lg shrink-0 mt-0.5">💡</span>
                <p className="text-sm text-sky-300 leading-relaxed">
                  <span className="font-bold">Совет:</span> внимательнее проверяйте как будет выглядеть Ваш чат, если Вы уверены, что на нем все хорошо видно и он никак не мешает Вашей игре, то все отлично. Но не забывайте, также, если Вы будете ставить «Затухание сообщений», то делайте их не таким быстрым, чтобы Ваш чат при фиксации доказательств не исчез.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Шаг 3 */}
        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          <p className="text-base font-semibold text-center text-foreground">Шаг 3. Как делать скриншот</p>
          <p className="text-base text-foreground leading-relaxed">
            Делать скриншот не сложно, если Вы не умеете. Есть много вариантов, как его сделать, например:
          </p>
          <ol className="flex flex-col gap-3">
            <li className="flex items-start gap-2 text-sm text-foreground">
              <span className="shrink-0 font-medium text-muted-foreground">1.</span>
              <span>
                Нажимаете на <span className="font-bold text-red-500">F12</span>. После того, как нажали, Ваш скриншот автоматически будет сделан в папке игры;
              </span>
            </li>
          </ol>
          <div className="flex items-start gap-3 bg-sky-500/10 border border-sky-500/40 rounded-sm px-4 py-3">
            <span className="text-lg shrink-0 mt-0.5">💡</span>
            <p className="text-sm text-sky-300 leading-relaxed">
              <span className="font-bold">Совет:</span> если Вы не знаете, где находится папка игры, то открываете консоль на <span className="font-bold">F8</span> и в самом низу будет указан путь к данной папке. Далее, ищете эту папку.
            </p>
          </div>
          <ol className="flex flex-col gap-3" start={2}>
            <li className="flex items-start gap-2 text-sm text-foreground">
              <span className="shrink-0 font-medium text-muted-foreground">2.</span>
              <span>
                Есть много программ для скриншота экрана, например, программа на ПК «Скриншотер». Очень простая программа, не требует каких-либо доп. скачиваний и быстро качается на компьютер;{" "}
                <br className="mb-1" />
                Ссылка для установки:{" "}
                <a
                  href="https://skrinshoter.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-400 underline transition-colors"
                >
                  Скриншотер — скриншоты и видео в один клик!
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-foreground">
              <span className="shrink-0 font-medium text-muted-foreground">3.</span>
              <span>
                Если у Вас есть <span className="font-bold">NVIDIA GeForce Experience</span>, то Вы можете сделать скриншот через эту программу, если нажмете нужную комбинацию <span className="font-bold text-red-500">Alt</span> + <span className="font-bold text-red-500">Z</span>.
              </span>
            </li>
          </ol>
        </div>
      </div>

      <p className="text-base font-semibold text-red-500 text-center">
        Теперь мы разобрались, как правильно лечить пациентов медикаментозным способом, как это фиксировать и как делать чат читаемым! Молодец.
      </p>
    </div>
  );
}