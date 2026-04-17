import { useState } from "react";
import Icon from "@/components/ui/icon";
import ImageLightbox from "@/components/ui/image-lightbox";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherPatrolSection({ go }: Props) {
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
        <h1 className="text-2xl sm:text-3xl font-bold">Пост и патрулирование</h1>
        <p className="text-base font-semibold text-muted-foreground">1.5 Пост и патрулирование.</p>
      </div>

      <p className="text-base leading-relaxed">
        Теперь, когда Вы умеете обрабатывать вызовы и оказывать ПМП, давайте расскажем Вам о постах и патрулях.
      </p>

      <p className="text-base leading-relaxed">
        Как Вы помните, на посты и патрули мы можем выезжать только на{" "}
        <span className="text-red-600 font-semibold">АСМП</span>. Также, напомню, что на посты и патрули Вы сможете
        выезжать самостоятельно только с должности{" "}
        <span className="text-red-600 font-semibold">Лаборанта</span> и выше. Сейчас Вам можно выезжать на посты и
        патрули только в качестве напарника, сидя на пассажирском сидении. Включать СГУ во время поста и патруля —{" "}
        <span className="text-red-600 font-semibold">категорически запрещено!</span> Исключением может служить только
        поступивший вызов и госпитализация во время Вашего поста или патруля. Минимальное время поста и патруля —{" "}
        <span className="text-red-600 font-semibold">10 минут</span>.
        {" "}Каждые 10 минут вы должны делать доклад о состоянии Вашей работы. Максимальное время поста и патруля не ограничено.
      </p>

      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="w-full flex items-center justify-between px-5 py-4 text-base font-semibold hover:bg-secondary/50 transition-colors"
        >
          <span>Посты</span>
          <Icon
            name="ChevronDown"
            size={18}
            className={`text-muted-foreground transition-transform duration-200 ${accordionOpen ? "rotate-180" : ""}`}
          />
        </button>

        {accordionOpen && (
          <div className="flex flex-col gap-6 px-5 pb-6 pt-2 border-t border-border">
            <p className="text-base leading-relaxed">
              Есть много мест, где Вы сможете стоять на посту и оказывать медицинскую помощь гражданам. Внизу будут представлены наши посты.
            </p>

            {/* 1. Автосалоны */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">1.</span>
                <p className="text-base leading-relaxed">Автосалоны</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/5c6b5b85-0907-48cd-9144-fed2c94d11c7.png"
                alt="Автосалоны"
                className="w-full rounded-sm border border-border"
                caption='Скриншот №1: Автосалоны "РОФЛ" и "АвтоМакс".'
              />
            </div>

            {/* 2. Автосервис */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">2.</span>
                <p className="text-base leading-relaxed">Автосервис</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/5edfcb60-c4b4-45a3-9032-c63ef3dc6e68.png"
                alt="Автосервис"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №2: Автосервис или же Тюнинг ателье."
              />
            </div>

            {/* 3. Автошкола */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">3.</span>
                <p className="text-base leading-relaxed">Автошкола</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/6bc78c44-1028-4279-a4a5-1519af756b6f.png"
                alt="Автошкола"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №3: Автошкола."
              />
            </div>

            {/* 4. АЗС */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">4.</span>
                <p className="text-base leading-relaxed">АЗС на трассе Приволжск — Невский</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/2cec1ba6-3d6b-498c-9c49-35d9ca13a25e.png"
                alt="АЗС на трассе"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №4: АЗС на трассе Приволжск — Невский."
              />
            </div>

            {/* 5. АТП */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">5.</span>
                <p className="text-base leading-relaxed">АТП</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/9a489192-c146-4c5d-9eae-5755200ad3dd.png"
                alt="АТП"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №5: АТП Невский."
              />
            </div>

            {/* 6. Банк */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">6.</span>
                <p className="text-base leading-relaxed">Банк</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/d71df6b8-5a0e-4819-9027-0dcc25636464.png"
                alt="Банк"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №6: Парковка у банка Невского."
              />
            </div>

            {/* 7. Водная школа */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">7.</span>
                <p className="text-base leading-relaxed">Водная школа</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/672373a4-b283-4618-b2ce-1abbc655ab8b.png"
                alt="Водная школа"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №7: Водная школа."
              />
            </div>

            {/* 8. Завод Красный октябрь */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">8.</span>
                <p className="text-base leading-relaxed">Завод "Красный октябрь"</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/011939f0-9429-44b5-b353-26b705599df8.png"
                alt='Завод "Красный октябрь"'
                className="w-full rounded-sm border border-border"
                caption='Скриншот №8: Завод "Красный октябрь".'
              />
            </div>

            {/* 9. Речной вокзал */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">9.</span>
                <p className="text-base leading-relaxed">Речной вокзал</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/28267791-9344-43b4-9f59-05d26db7563f.png"
                alt="Речной вокзал"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №9: Речной вокзал."
              />
            </div>

            {/* 10. СТО */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">10.</span>
                <p className="text-base leading-relaxed">СТО</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/beb48cbb-2d60-46dc-8463-1d0cde780b56.png"
                alt="СТО"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №10: СТО."
              />
            </div>

            {/* 11. Табачный завод */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">11.</span>
                <p className="text-base leading-relaxed">Табачный завод</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/60dd36ee-5bc5-4e5f-83e4-5d1492eac85d.png"
                alt="Табачный завод"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №11: Табачный завод."
              />
            </div>

            {/* 12. ТТУ */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">12.</span>
                <p className="text-base leading-relaxed">ТТУ</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/a2aaa6b3-cf83-4584-83fa-4f912592bd80.png"
                alt="ТТУ"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №12: ТТУ."
              />
            </div>

            {/* 13. Футбольное поле ПГТ Волчанск */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <span className="text-base font-semibold shrink-0">13.</span>
                <p className="text-base leading-relaxed">Футбольное поле ПГТ Волчанск</p>
              </div>
              <ImageLightbox
                src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/40a867b2-5a94-498b-ade5-4a61476430b4.png"
                alt="Футбольное поле ПГТ Волчанск"
                className="w-full rounded-sm border border-border"
                caption="Скриншот №13: Футбольное поле ПГТ Волчанск."
              />
            </div>

          </div>
        )}
      </div>

      <p className="text-base leading-relaxed">
        Патрулирование отличается лишь тем, что Вы не стоите на месте, а ездите по городу, соблюдая ПДД. Вы также молниеносно реагируете на помощь гражданам, делаете доклады о состоянии патрулирования как и на посту.
      </p>

      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы о постах:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/?do=findComment&comment=6982162"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Раздел 7. Посты АСМП.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>

      <p className="text-sm text-muted-foreground">
        Законодательная база Республики Провинции на госпортале:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/639262-pravila-dorozhnogo-dvizheniya-respubliki/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Правила Дорожного Движения (ПДД).
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>
    </div>
  );
}