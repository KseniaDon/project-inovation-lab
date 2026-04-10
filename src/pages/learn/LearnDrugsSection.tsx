import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";

interface LearnDrugsSectionProps {
  go: (id: SectionId) => void;
}

const DRUGS: { symptom: string; drugs: string[] }[] = [
  { symptom: "Головная боль обычная",    drugs: ["Аспирин", "Анальгин", "Парацетамол", "Цитрамон", "Нурофен", "Темпалгин", "Пенталгин", "Диклофенак", "Ибупрофен", "Спазган", "Папаверин", "Бускопан", "Дротаверин", "Миг"] },
  { symptom: "Головная боль сильная",    drugs: ["Амигрен", "Цитрамон Ультра", "Седальгин-Нео", "Каффетин", "Солпадеин", "Мигрепам", "Релпакс"] },
  { symptom: "Судороги",                 drugs: ["Карбамазепин", "Фенитоин", "Вальпроат Натрия", "Фенобарбитал", "Примидон", "Клоназепам", "Бекламид", "Ламотриджин"] },
  { symptom: "Боль в животе",            drugs: ["Но-шпа", "Дротаверин", "Фестал", "Метоклопрамид", "Ранитидин"] },
  { symptom: "Тошнота",                  drugs: ["Церукал", "Метоклопрамид", "Драмина", "Авиамарин", "Бонин"] },
  { symptom: "Диарея",                   drugs: ["Энтеросгель", "Смекта", "Полисорб", "Фильтрум-сти", "Лоперамид", "Имодиум", "Лопедиум"] },
  { symptom: "Изжога",                   drugs: ["Ренни", "Маалокс", "Алмагель", "Гастал"] },
  { symptom: "Боль в печени",            drugs: ["Урсофальк", "Гептрал", "Карсил", "Эссенциале форте", "Берлитион"] },
  { symptom: "Сердечная боль",           drugs: ["Ацетилсалициловая кислота", "Клопидогрел", "Варфарин", "Ксарелто", "Периндоприл", "Лозартан", "Карведилол", "Триметазидин", "Андипал", "Карвалол", "Валидол"] },
  { symptom: "Простуда",                 drugs: ["Терафлю", "Колдрекс", "Антигриппин", "Анвимакс"] },
  { symptom: "Кашель сухой",             drugs: ["Лазолван", "Гербион", "АЦЦ"] },
  { symptom: "Кашель влажный",           drugs: ["Амбробене", "АЦЦ", "Пертуссин"] },
  { symptom: "Боль в горле (спрей)",     drugs: ["Гексорал", "Стопангин", "Тантум верде"] },
  { symptom: "Боль в горле (таблетки)",  drugs: ["Стрепсилс", "Граммидин", "Анти-ангин", "Септолетте"] },
  { symptom: "Насморк",                  drugs: ["Тизин", "Африн", "Снуп", "Отривин", "Нокспрей", "Ринонорм"] },
  { symptom: "Потенция",                 drugs: ["Сиалекс", "Виагра"] },
  { symptom: "Аллергия",                 drugs: ["Зиртек", "Цетрин", "Кларитин", "Эриус", "Зодак", "Тавегил", "Супрастин"] },
  { symptom: "Ожоги",                    drugs: ["Бепантен", "Солкосерил", "Актовегин", "Банеоцин"] },
  { symptom: "Боль в глазах",            drugs: ["Визин", "Альбуцид"] },
  { symptom: "Боль в ушах",              drugs: ["Отинум", "Отипакс"] },
  { symptom: "Боль в почках",            drugs: ["Уролисан", "Урохол"] },
  { symptom: "Мочевой пузырь",           drugs: ["Цистон", "Нолицин", "Канефрон", "Фитолизин"] },
  { symptom: "Спина и суставы",          drugs: ["Фастум-гель", "Кетонал", "Долгит", "Капсикам", "Финалгон"] },
  { symptom: "Повышенное давление",      drugs: ["Андипал", "Лозартан", "Каптоприл", "Арифон-ретард", "Амлодипин (Норваск)", "Верошпирон (Спиронолактон)"] },
  { symptom: "Пониженное давление",      drugs: ["Фетанол", "Дофамин", "Гептамил", "Мидодрин", "Ранторин", "Экдистен"] },
  { symptom: "Геморрой",                 drugs: ["Релиф", "Гепариновая мазь", "Прокто-гливенол", "Проктонис"] },
  { symptom: "Витамины",                 drugs: ["Компливит", "Витрум", "Алфавит", "Супрадин"] },
  { symptom: "Астма",                    drugs: ["Сальбутамол", "Преднизолон"] },
  { symptom: "Гастрит",                  drugs: ["Рабепразол", "Азитромицин", "Тетрациклин", "Амоксициллин"] },
  { symptom: "Язва",                     drugs: ["Сукральфат", "Де-Нол", "Вентрисол"] },
  { symptom: "Инсульт",                  drugs: ["Гаммалон", "Пентоксифиллин"] },
  { symptom: "Инфаркт",                  drugs: ["Антенолол", "Омакор"] },
  { symptom: "Сахарный диабет",          drugs: ["Виктоза", "Диабетон", "Астрозон"] },
  { symptom: "Ушибы",                    drugs: ["Долобене", "Подорожник (мазь)", "Нурофен (гель)"] },
  { symptom: "Жаропонижающее",           drugs: ["Анальгин", "Брустан", "Ибуклин", "Ремантадин", "Нурофен"] },
  { symptom: "Антисептики",              drugs: ["Хлоргексидин", "Перекись водорода", "Йод", "Зелёнка"] },
  { symptom: "Бессонница",               drugs: ["Найтвелл", "Мелаксен"] },
  { symptom: "Молочница",                drugs: ["Нистатин", "Пимафуцин", "Ливарол", "Клотримазол"] },
  { symptom: "Обезболивающее",           drugs: ["Парацетамол", "Лидокаин", "Ибуклин", "Дексалгин"] },
];

export default function LearnDrugsSection({ go }: LearnDrugsSectionProps) {
  const [search, setSearch] = useState("");

  const filtered = DRUGS.filter(({ symptom, drugs }) => {
    const q = search.toLowerCase();
    return symptom.toLowerCase().includes(q) || drugs.some((d) => d.toLowerCase().includes(q));
  });

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
        {filtered.map(({ symptom, drugs }) => (
          <div key={symptom} className="flex flex-col gap-1.5">
            <p className="text-base text-red-500 font-semibold">{symptom}:</p>
            <div className="flex flex-wrap gap-1.5 ml-2">
              {drugs.map((drug) => (
                <span
                  key={drug}
                  className="text-sm font-bold text-foreground bg-secondary border border-border rounded-sm px-2.5 py-1"
                >
                  {drug}
                </span>
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
