import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import { defaultMisPage, SimplePageData } from "@/pages/admin/adminTypes";
import RichContent from "@/components/ui/rich-content";

interface LearnMisSectionProps {
  go: (id: SectionId) => void;
}

const MIS_URL = "https://docs.google.com/forms/d/e/1FAIpQLScO0bFomyEMvIseA4JHYSQiNTWdmN3DinF4Ra7gv7eCQKMqEw/viewform";

export default function LearnMisSection({ go }: LearnMisSectionProps) {
  const data = useSiteData<SimplePageData>("mis_page", defaultMisPage);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button onClick={() => go("intern-evidence")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
          <Icon name="ChevronLeft" size={14} />
          Назад к фиксации доказательств
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 4: Отчет на повышение</p>
        <h1 className="text-3xl font-bold">{data.title}</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">4.3. МИС «Здоровье»</p>

      {/* Первый абзац — вводный текст (только первый параграф из content) */}
      <p className="text-base text-foreground leading-relaxed">
        МИС «Здоровье» — это медицинская информационная система, куда Вы загружаете доказательства своей работы в больнице перед подачей заявки на повышение. Без этого шага заявка не рассматривается.
      </p>

      {/* Кнопка открыть МИС — перемещена сюда */}
      <a href={MIS_URL} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 border border-red-600/40 bg-red-600/5 hover:bg-red-600/10 rounded-sm px-4 py-3.5 transition-colors group">
        <div className="flex items-center gap-3">
          <Icon name="MonitorCheck" size={20} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Открыть МИС «Здоровье»</p>
            <p className="text-xs text-muted-foreground mt-0.5">Google Forms — форма для загрузки доказательств</p>
          </div>
        </div>
        <Icon name="ExternalLink" size={15} className="text-muted-foreground group-hover:text-red-400 transition-colors shrink-0" />
      </a>

      {/* Первая часть контента (пункты 1–3) */}
      <div className="text-base text-foreground leading-relaxed rich-content">
        <RichContent html={data.content} />
      </div>

      {/* Серая рамка — нажать Далее */}
      <div className="border border-zinc-600/50 rounded-sm px-4 py-3 bg-zinc-800/30 text-sm text-foreground leading-relaxed">
        Если первая страница была заполнена — нажимаем{" "}
        <span className="text-green-400 font-semibold">Далее</span>.
      </div>

      {/* Вторая часть контента (пункт 4 и далее) */}
      {data.content2 && (
        <div className="text-base text-foreground leading-relaxed rich-content">
          <RichContent html={data.content2} />
        </div>
      )}

      {/* Красная рамка — пример заполнения критериев */}
      <div className="border border-red-600/60 rounded-sm px-4 py-4 flex flex-col gap-2 bg-red-950/10">
        <p className="text-sm text-foreground leading-relaxed">
          <span className="text-red-400">▻ Прослушать вступительную лекцию:</span>{" "}
          <strong>#номер приказа</strong>;
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          <span className="text-red-400">▻ Первичный Медицинский Экзамен (ПМЭ):</span>{" "}
          <strong>#номер приказа</strong>;
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          <span className="text-red-400">▻ Лечение — 5 пациентов:</span>{" "}
          <strong>указываем ссылку на облачное хранение</strong>.
        </p>
      </div>

      {/* Оранжевое предупреждение */}
      <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 rounded-sm px-4 py-3.5">
        <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-bold text-orange-300">ВАЖНО:</p>
          <ol className="flex flex-col gap-1.5 text-sm text-orange-200 leading-relaxed list-decimal list-inside">
            <li>Для повышения у Вас должны отсутствовать любые дисциплинарные взыскания (Исключение: Сотрудникам отделения интернатуры разрешено повышаться при наличии предупреждений);</li>
            <li>Доказательства должны быть расположены по порядку;</li>
            <li>
              Используйте нейтральные хостинги по типу{" "}
              <a href="https://disk.yandex.ru" target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold hover:text-red-300 underline underline-offset-2 transition-colors">Яндекс Диск</a>{" "}
              и{" "}
              <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold hover:text-red-300 underline underline-offset-2 transition-colors">Google Диск</a>,{" "}
              чтобы проверяющий смог с лёгкостью проверить Ваш отчёт.
            </li>
          </ol>
        </div>
      </div>

      {/* Серая рамка — финальный шаг */}
      <div className="border border-zinc-600/50 rounded-sm px-4 py-3 bg-zinc-800/30 text-sm text-foreground leading-relaxed">
        Как будет всё заполнено, нажимайте{" "}
        <span className="text-green-400 font-semibold">Отправить</span>.
      </div>

      {/* Голубая рамка — совет */}
      <div className="flex items-start gap-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700 rounded-sm px-4 py-3">
        <Icon name="Lightbulb" size={18} className="text-sky-500 shrink-0 mt-0.5" />
        <p className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed">
          <strong>Совет:</strong> чтобы улучшить проверку Вашего отчёта и получить одобрение, сортируйте все свои доказательства по папкам. Например: лечения в одну папку с лечениями, строи в папку со строями, чтобы каждый строй был в отдельных папках. Пока что учитесь и повышайтесь, всему остальному мы Вас научим ❤️
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={() => go("intern-evidence")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="ChevronLeft" size={14} />
          Фиксация доказательств
        </button>
      </div>
    </div>
  );
}