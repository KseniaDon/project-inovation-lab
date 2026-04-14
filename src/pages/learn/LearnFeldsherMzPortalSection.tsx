import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

function PulsingHeart() {
  const [beat, setBeat] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBeat((v) => !v);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="transition-transform duration-300 select-none inline-block"
      style={{
        fontSize: 18,
        transform: beat ? "scale(1.3)" : "scale(1)",
      }}
    >
      ❤️
    </span>
  );
}

export default function LearnFeldsherMzPortalSection({ go }: Props) {
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
        <h1 className="text-3xl font-bold">МЗ Портал</h1>
      </div>

      <p className="text-base text-foreground leading-relaxed">
        Так как Вы научились оказывать начальное ПМП, оценивать ситуацию с пострадавшим, мы переходим к более подробному ПМП при обнаружении различных травм.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Этот раздел будет посвящен больше сайту-помощнику, который сделали наши коллеги, под названием{" "}
        <a
          href="https://mz.kaze.red/dash/profile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 dark:text-red-400 font-semibold hover:underline"
        >
          МЗ Портал
        </a>
        .
      </p>

      <p className="text-base text-foreground leading-relaxed">
        МЗ Портал — это неофициальный источник нашей работы, но очень важный для нас, как для работников Министерства Здравоохранения. В нем содержатся все доклады и отыгровки при разных ситуациях, что упрощает работу уже сформировавшему сотруднику от Лаборанта и выше. Авторизоваться на МЗ Портал Вы можете через ВК страницу, это делается очень быстро и просто.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Теперь, давайте перейдем к следующему, а то есть, выполнить после оценивания ситуации — ПМП при различных травмах.
      </p>

      <a
        href="https://mz.kaze.red/dash/types/7"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3 rounded-sm border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors group w-fit"
      >
        <Icon name="HeartPulse" size={18} className="text-red-500 shrink-0" />
        <span className="text-red-700 dark:text-red-300 font-semibold text-sm group-hover:underline">
          МЗ Портал | ПМП
        </span>
        <Icon name="ExternalLink" size={14} className="text-red-400 shrink-0" />
      </a>

      <p className="text-base text-foreground leading-relaxed">
        В этом разделе Вы найдете отыгровки на различные виды ПМП при обработке вызова, которые помогут Вам сделать ПМП качественно и без лишних усилий.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Бывают ситуации, когда помощь пациенту приходится импровизировать и на МЗ Портале таких отыгровок не найти. В этом случае — Вам поможет Ваше знание РП-мануала и пользование интернетом. Но не переживайте, Вы всему научитесь, а старшие коллеги помогут Вам не растеряться.
      </p>

      <p className="text-sm text-muted-foreground">
        Официальный сборник RP-отыгровок МЗ:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/853770-mz-obschiy-sbornik-rp-otygrovok-ministerstva-zdravoohraneniya/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          [МЗ] Общий сборник RP-отыгровок министерства здравоохранения
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>

      <p className="text-xs text-muted-foreground leading-relaxed mt-2 flex items-center gap-1 flex-wrap">
        Огромная благодарность за создание этого сайта —{" "}
        <a
          href="https://vk.ru/gizuzu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-foreground font-medium"
        >
          Rei Higer
        </a>{" "}
        и{" "}
        <a
          href="https://vk.ru/matvey_slyusarenko"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-foreground font-medium"
        >
          Matvey Slyusarenko
        </a>
        {" "}<PulsingHeart />
      </p>
    </div>
  );
}