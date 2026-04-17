import Icon from "@/components/ui/icon";
import ImageLightbox from "@/components/ui/image-lightbox";
import { SectionId } from "./learnConfig";

interface Props {
  go: (id: SectionId) => void;
}

const ranks = [
  { num: 1, title: "Интерн" },
  { num: 2, title: "Фельдшер" },
  { num: 3, title: "Лаборант" },
  { num: 4, title: "Врач-стажер" },
  { num: 5, title: "Врач-участковый" },
  { num: 6, title: "Врач-терапевт" },
  { num: 7, title: "Врач-хирург (заместитель заведующего отделением)" },
  { num: 8, title: "Заведующий Отделением" },
  { num: 9, title: "Заместитель Главного Врача" },
  { num: 10, title: "Главный врач" },
];

const departmentRanks = [
  { label: "Сотрудников отделения 1–2 рангов (ОИ) или 3–6 ранги (терапевтические отделения и ОПРС);" },
  { label: "Заместителя Заведующего Отделением (Врач-хирург) [7];" },
  { label: "Заведующего Отделением [8];" },
  { label: "Куратора Отделения (Заместитель Главного Врача) [9]." },
];

export default function LearnHierarchySection({ go }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-abbr")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к аббревиатурам
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 1: Подготовка</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Иерархия</h1>
      </div>

      <p className="text-base text-foreground leading-relaxed">
        <span className="text-red-500 font-semibold">Иерархия</span> — это положение частей или элементов чего-либо в порядке от высшего к низшему. Это определение встречается везде: в любой организации, в повседневной жизни. ЦГБ города Невский, да и впрочем всё Министерство Здравоохранения не является исключением. Мы тоже имеем свою иерархию должностей, которых должен придерживаться каждый. В нашем случае иерархия выражена в рангах:
      </p>

      {/* Ранги */}
      <div className="flex flex-col gap-2">
        {ranks.map((r) => (
          <div key={r.num} className="flex items-center gap-2">
            <div className="shrink-0 w-2 h-2 rounded-full bg-red-600" />
            <span className="text-sm text-foreground">{r.title} [{r.num}]</span>
          </div>
        ))}
      </div>

      {/* Схема МЗ */}
      <p className="text-base font-semibold text-red-500 text-center">В МЗ применяется следующая должностная иерархия</p>

      <ImageLightbox
        src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/e4b9f235-9d94-46ff-add6-045e8d0a4184.png"
        alt="Иерархическая схема МЗ"
        className="w-full rounded-sm border border-border"
        caption="Иерархическая структура Министерства Здравоохранения"
      />

      <p className="text-base text-foreground leading-relaxed">
        При такой иерархической структуре ни в коем случае нельзя начинать с конца: если у вас есть вопрос или просьбы — вы задаёте это рангу выше, который отвечает именно за Вас, то есть заведующему и его заместителю. В иерархической системе младший состав (1–6 ранги) не имеет права указывать младшему составу вне зависимости от должности.
      </p>

      <p className="text-base text-foreground leading-relaxed">
        Помимо рангов, наш состав делится на 2 группы: <span className="text-red-500 font-semibold">Младший состав</span> и <span className="text-red-500 font-semibold">Руководящий состав</span>.
      </p>

      {/* Младший состав */}
      <div className="border border-border rounded-sm p-4 sm:p-5 flex flex-col gap-3">
        <h2 className="text-base font-bold text-red-500">Младший состав</h2>
        <p className="text-sm text-foreground leading-relaxed">
          <span className="text-red-500 font-semibold">Младший состав</span> — это группа, в которую входят все сотрудники, начиная от первого ранга, заканчивая шестым включительно. Занимается основной работой, между собой иерархии не имеет (т.е. Фельдшер не может приказать Интерну, Врач-терапевт не может приказать Врачу-стажеру и т.д.) — их взаимоотношения строятся на доверии, понимании и взаимопомощи. Но вся эта большая группа подчиняется Руководящему составу.
        </p>
      </div>

      {/* Руководящий состав */}
      <div className="border border-border rounded-sm p-4 sm:p-5 flex flex-col gap-3">
        <h2 className="text-base font-bold text-red-500">Руководящий состав</h2>
        <p className="text-sm text-foreground leading-relaxed">
          <span className="text-red-500 font-semibold">Руководящий состав</span> — это группа, в которую входят сотрудники, достигшие 7 ранга и выше. Помимо основной работы занимаются работой по своему отделению: контроль за сотрудниками и их работой, проверка отчётов, написание приказов, проведение строев и т.д. Между ними уже имеется иерархия. Самое низшее звено (врач-хирург) не может написать напрямую главному врачу — для этого есть заведующий и куратор. Младший состав подчиняется любому сотруднику руководящего состава, вне зависимости от его отделения и ранга.
        </p>
      </div>

      {/* Иерархия в отделениях */}
      <h2 className="text-base font-bold text-red-500 text-center">Иерархическая структура в отделениях</h2>

      <p className="text-sm text-foreground leading-relaxed">Каждое отделение имеет:</p>

      <div className="flex flex-col gap-2">
        {departmentRanks.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="shrink-0 w-2 h-2 rounded-full bg-red-600" />
            <span className="text-sm text-foreground">{r.label}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-foreground leading-relaxed">
        Сотрудники отделения не могут переступить какое-либо звено. Например, Врач-участковый не может написать Куратору с вопросом — для этого есть Заместители Заведующего и сам Заведующий. Обращаться напрямую к Куратору можно только в том случае, когда отсутствует Заместитель Заведующего и Заведующий Отделением. Основную работу за отделением выполняют Заместители Заведующего и Заведующий Отделением, а Куратор лишь контролирует их работу и принимает жалобы от сотрудников на руководство курируемого отделения. К Главному врачу можно обращаться только когда никто из представленных ранее лиц не может решить проблему, при взятии неактива, а также при наличии жалобы на своё руководство (когда куратор бездействует или жалоба на куратора отделения).
      </p>

      {/* Ссылка на госпортал */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Официальный раздел на госпортале по иерархии:</p>
        <a
          href="https://forum.gtaprovince.ru/topic/853594-mz-faq-po-ministerstvu-zdravoohraneniya/?do=findComment&comment=5950234"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base text-red-500 hover:text-red-400 transition-colors font-semibold"
        >
          <Icon name="ExternalLink" size={16} />
          3. Иерархия
        </a>
      </div>
    </div>
  );
}