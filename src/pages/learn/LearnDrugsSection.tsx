import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnDrugsSectionProps {
  go: (id: SectionId) => void;
}

interface DrugEntry {
  symptom: string;
  hint: string;
  items: { label?: string; drugs: string }[];
}

const DRUGS: DrugEntry[] = [
  {
    symptom: "Головная боль",
    hint: "Спрашиваем, как сильно болит голова: обычная боль или очень сильная (мигрень). Также уточняем, есть ли судороги или нервный тик.",
    items: [
      { label: "Обычная", drugs: "Пенталгин, Спазган, Некст, Дексалгин" },
      { label: "Сильная (мигрень)", drugs: "Амигрен, Сумамигрен" },
      { label: "Судороги, нервный тик", drugs: "Магнелис, Аспаркам" },
    ],
  },
  {
    symptom: "Боль в животе",
    hint: "Спрашиваем вид боли: тошнота, спазмы, диарея или отравление. Каждый вид требует разных препаратов.",
    items: [
      { label: "Тошнота", drugs: "Церукал, Драмина" },
      { label: "Спазмы", drugs: "Но-шпа, Дротаверин" },
      { label: "Диарея", drugs: "Лоперамид, Лопедиум" },
      { label: "Отравление", drugs: "Энтеродез, Энтеросгель, Смекта" },
    ],
  },
  {
    symptom: "Изжога",
    hint: "Уточняем, появляется ли жжение после еды или натощак. Препараты нейтрализуют кислоту и снимают симптом.",
    items: [
      { drugs: "Ренни, Маалокс, Мотилиум" },
    ],
  },
  {
    symptom: "Боль в печени",
    hint: "Уточняем локализацию: боль в правом подреберье. Препараты поддерживают и восстанавливают клетки печени.",
    items: [
      { drugs: "Карсил Форте, Гепабене" },
    ],
  },
  {
    symptom: "Боль в сердце",
    hint: "Уточняем характер боли: давящая, колющая, с отдачей в руку или лопатку. После принятия таблетки необходимо провести ЭКГ.",
    items: [
      { drugs: "Кардиомагнил, Ацетилсалициловая кислота, Клопидогрел, Варфавин, Ксарелто, Периндоприл, Лозартан, Карведилол, Триметазидин" },
    ],
  },
  {
    symptom: "Простуда и жар",
    hint: "Уточняем температуру и общее самочувствие. Комплексные препараты снимают симптомы ОРВИ.",
    items: [
      { drugs: "Терафлю, Колдрекс, Антигриппин" },
    ],
  },
  {
    symptom: "Кашель",
    hint: "Уточняем: сухой или влажный кашель. Препараты разжижают мокроту или подавляют кашлевой рефлекс.",
    items: [
      { drugs: "Лазолван, Стоптуссин, Пертуссин" },
    ],
  },
  {
    symptom: "Боль в горле",
    hint: "Уточняем: есть ли покраснение, налёт, трудно глотать. Спреи действуют быстро, таблетки для рассасывания — мягче.",
    items: [
      { label: "Спреи", drugs: "Гексорал, Стопангин, Тантум-Верде" },
      { label: "Таблетки для рассасывания", drugs: "Стрепсилс, Граммидин" },
    ],
  },
  {
    symptom: "Насморк",
    hint: "Уточняем: заложен нос или есть выделения. Сосудосуживающие капли снимают отёк слизистой.",
    items: [
      { drugs: "Тизин, Снуп, Отривин" },
    ],
  },
  {
    symptom: "Боль в спине, ногах и суставах",
    hint: "Уточняем локализацию и характер: острая или ноющая, после нагрузки или в покое. Мази и гели наносятся местно.",
    items: [
      { drugs: "Фастум-гель, Кетонал, Долгит, Капсикам, Финалгон" },
    ],
  },
  {
    symptom: "Мази от ушибов и ссадин",
    hint: "Уточняем наличие гематомы, отёка или ссадины. Препараты улучшают кровообращение и снимают воспаление.",
    items: [
      { drugs: "Долобене, Лиотон, Троксевазин, Фенистил, Кетонал" },
    ],
  },
  {
    symptom: "Повышенное давление",
    hint: "Уточняем значения давления (выше 140/90). Препарат снижает давление и снимает сопутствующие симптомы.",
    items: [
      { drugs: "Андипал" },
    ],
  },
  {
    symptom: "Пониженное давление",
    hint: "Уточняем значения давления (ниже 90/60), головокружение, слабость. Препараты тонизируют сосуды.",
    items: [
      { drugs: "Норадреналин, Кофеин (таблетки под язык), Кордиамин" },
    ],
  },
  {
    symptom: "Аллергия",
    hint: "Уточняем симптомы: сыпь, зуд, слезотечение, чихание. Антигистаминные препараты блокируют реакцию.",
    items: [
      { drugs: "Зиртек, Эриус, Зодак, Тавегил" },
    ],
  },
  {
    symptom: "Ожоги",
    hint: "Уточняем степень ожога: покраснение, пузыри. Пантенол наносится на повреждённую поверхность.",
    items: [
      { drugs: "Пантенол" },
    ],
  },
  {
    symptom: "Глазная боль",
    hint: "Уточняем: покраснение, резь, слезотечение или снижение зрения. Капли снимают раздражение и воспаление.",
    items: [
      { drugs: "Визин, Альбуцид" },
    ],
  },
  {
    symptom: "Боль в ушах",
    hint: "Уточняем: стреляющая боль, снижение слуха, выделения. Капли снимают воспаление и боль.",
    items: [
      { drugs: "Отипакс" },
    ],
  },
  {
    symptom: "Боль в почках",
    hint: "Уточняем: боль в пояснице с одной стороны, при мочеиспускании. Препараты снимают спазм и воспаление.",
    items: [
      { drugs: "Уролесан, Пролит" },
    ],
  },
  {
    symptom: "Боль в мочевом пузыре",
    hint: "Уточняем: частое болезненное мочеиспускание, рези. Препараты снимают воспаление мочевыводящих путей.",
    items: [
      { drugs: "Цистон, Фитолизин" },
    ],
  },
  {
    symptom: "Сотрясение",
    hint: "Уточняем: была ли травма головы, тошнота, потеря сознания. Препараты снижают внутричерепное давление и улучшают мозговое кровообращение.",
    items: [
      { drugs: "Диакарб и Пирацетам" },
    ],
  },
  {
    symptom: "Витамины",
    hint: "Можно выдавать на любом этаже и в любом месте — не требуют полного осмотра пациента.",
    items: [
      { drugs: "Компливит, Витрум" },
    ],
  },
  {
    symptom: "При сахарном диабете",
    hint: "Уточняем тип диабета и текущий уровень сахара. Препараты нормализуют уровень глюкозы в крови.",
    items: [
      { drugs: "Виктоза, Диабетон, Астрозон" },
    ],
  },
];

export default function LearnDrugsSection({ go }: LearnDrugsSectionProps) {
  const [search, setSearch] = useState("");
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});

  const filtered = DRUGS.filter(({ symptom, items }) => {
    const q = search.toLowerCase();
    return (
      symptom.toLowerCase().includes(q) ||
      items.some(
        (i) =>
          i.drugs.toLowerCase().includes(q) ||
          (i.label?.toLowerCase().includes(q) ?? false)
      )
    );
  });

  const toggleHint = (symptom: string) =>
    setOpenHints((prev) => ({ ...prev, [symptom]: !prev[symptom] }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-departments")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к отделениям
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 3: Экзамен</p>
        <h1 className="text-3xl font-bold">Препараты</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">3.2. Список препаратов</p>

      {/* Поиск */}
      <div className="relative">
        <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по симптому или препарату..."
          className="w-full bg-secondary border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={14} />
          </button>
        )}
      </div>

      {/* Список */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">Ничего не найдено.</p>
        )}
        {filtered.map(({ symptom, hint, items }) => (
          <div key={symptom} className="flex flex-col gap-2">
            {/* Заголовок симптома */}
            <div className="flex items-center gap-2">
              <p className="text-base text-red-500 font-semibold">{symptom}:</p>
              <button
                onClick={() => toggleHint(symptom)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Как понять симптоматику"
              >
                <Icon name="Info" size={14} />
              </button>
            </div>

            {/* Подсказка */}
            {openHints[symptom] && (
              <div className="flex items-start gap-2 bg-secondary/50 border border-border rounded-sm px-3 py-2.5 text-sm text-muted-foreground">
                <Icon name="Lightbulb" size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                <span>{hint}</span>
              </div>
            )}

            {/* Препараты */}
            <div className="flex flex-col gap-1 ml-2">
              {items.map(({ label, drugs }, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                  <span>
                    {label && (
                      <span className="text-muted-foreground">{label} — </span>
                    )}
                    <span className="font-bold text-foreground">{drugs}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы на госпортале по препаратам:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/?do=findComment&comment=6982146"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Раздел 3. Список препаратов.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>
    </div>
  );
}