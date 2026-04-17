import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherPrmoSection({ go }: Props) {
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
        <h1 className="text-2xl sm:text-3xl font-bold">ПРМО</h1>
        <p className="text-base font-semibold text-muted-foreground">1.6 ПРМО.</p>
      </div>

      <p className="text-base leading-relaxed">
        ПРМО — это Предрейсовый Медицинский Осмотр, который включает в себя трехкратный ежедневный осмотр машинистов (ТЧМ) перед рейсом, проводящийся на парковке за главным офисом РЖД (большое здание, после автосалона в городе Мирный).
      </p>

      <p className="text-base leading-relaxed">
        В ПРМО входит проверка давления у машинистов и проверка на наличие алкоголя в крови с помощью алкотестера. Сейчас Вам алкотестер не доступен, Вы сможете им активно пользоваться, начиная с должности Лаборанта и выше, как и в целом выезжать на ПРМО. Никто не запрещает Вам в качестве напарника съездить с более опытным врачом, чтобы посмотреть как проходить данный вид работы.
      </p>

      <p className="text-base leading-relaxed">
        Прежде, чем выехать на данное мероприятие, Вам нужно обязательно сделать доклады о выезде, прибытии и о том, что вы возвращаетесь на базу, после осмотра всех машинистов.
      </p>

      <p className="text-base leading-relaxed">
        Доклады ПРМО Вы можете найти в этом разделе —{" "}
        <button
          onClick={() => go("feldsher-radio")}
          className="text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Работа с рацией.
        </button>
      </p>

      <p className="text-base leading-relaxed">
        После того, как Вы приехали на парковку здания РЖД, Вас встречают наши машинисты. Вы аккуратно паркуетесь и открываете боковую дверь, берёте алкотестер и по очереди проверяете сотрудников.
      </p>

      <p className="text-base leading-relaxed">
        Отыгровки ПРМО можно найти на МЗ Портале, о котором говорилось ранее —{" "}
        <a
          href="https://mz.kaze.red/dash/types/62"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          МЗ Портал | ПРМО
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>

      {/* Предупреждение */}
      <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/40 px-4 py-3">
        <Icon name="TriangleAlert" size={16} className="text-orange-400 shrink-0 mt-0.5" />
        <p className="text-sm text-orange-300 leading-relaxed">
          <span className="font-bold">ВАЖНО:</span> При выезде на ПРМО мы не используем СГУ, едем согласно ПДД. Исключение: Вы наткнулись во время своего пути в больницу на пострадавшего и после оказания ПМП пострадавшему — Вы его госпитализируете в ближайшую больницу с соответствующим докладом.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Таблица записанных машинистов на ПРМО:{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/1clf7pSUqxYC3BVKM9IFOq_2vq7mpOnnK-G8F3YGF09s/edit?gid=175447097#gid=175447097"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Таблица ПРМО.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>

      <p className="text-sm text-muted-foreground">
        Форма для записи на ПРМО для проводящих:{" "}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdPJae6zew8YucW7JHeA18fUPZlj9rOrgDJgNHj6WIlFBdzSQ/closedform"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Форма для записи на ПРМО.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>

      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы по ПРМО:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/?do=findComment&comment=6982184"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Раздел 11. ПРМО.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>
    </div>
  );
}