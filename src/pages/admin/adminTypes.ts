export type Role = "super_admin" | "editor";
export type Tab = "hero" | "staff" | "sections" | "schedule" | "commands" | "floors" | "departments" | "charter" | "oath" | "reports" | "access" | "password";
export type Report = { label: string; template: string };
export type AccessUser = { nickname: string; role: Role; created_at: string; created_by: string | null };

export type Section = { id: string; title: string; items: string[] };
export type StaffMember = { role: string; name: string; nickname: string; href: string; badge: string; badgeColor: string };
export type HeroData = { subtitle: string; buttonText: string };
export type Command = { cmd: string; desc: string };
export type Floor = { num: string; desc: string };
export type Department = { abbr: string; full: string; color: string };
export type CharterDoc = { abbr: string; title: string; href: string };

export const BADGE_COLORS = ["bg-red-600", "bg-blue-600", "bg-green-600", "bg-yellow-600", "bg-purple-600", "bg-zinc-600"];
export const DEPT_COLORS = ["text-green-400", "text-sky-400", "text-red-400", "text-pink-400", "text-orange-400", "text-yellow-400", "text-purple-400"];

export const defaultHero: HeroData = { subtitle: "Методическое пособие для сотрудников отделения. Всё, что нужно знать с первого дня службы.", buttonText: "Перейти к обучению" };
export const defaultSections: Section[] = [
  { id: "intern", title: "Интерн", items: ["Ознакомление с правилами внутреннего распорядка", "Изучение структуры отделения", "Работа с медицинской документацией"] },
  { id: "feldsher", title: "Фельдшер", items: ["Протоколы первичной диагностики пациентов", "Алгоритмы оказания неотложной помощи", "Инфекционная безопасность и работа с биоматериалом"] },
];
export const defaultStaff: StaffMember[] = [
  { role: "Куратор Отделения Интернатуры", name: "Ksenia Donskaya", nickname: "Ksenia_Donskaya", href: "https://vk.ru/soul__shu", badge: "Куратор", badgeColor: "bg-red-600" },
  { role: "Заместитель Заведующего ОИ", name: "Egor Maslow", nickname: "Egor_Maslow", href: "https://vk.ru/cccuvigon", badge: "Зам. Зав.", badgeColor: "bg-zinc-600" },
];
export const defaultCommands: Command[] = [
  { cmd: "/r [Text]", desc: "RP рация сотрудников ЦГБ." },
  { cmd: "/rb [Text]", desc: "NonRP чат сотрудников ЦГБ." },
  { cmd: "/ro [Text]", desc: "Общая RP рация сотрудников МЗ." },
  { cmd: "/rob [Text]", desc: "Общий NonRP чат сотрудников МЗ." },
  { cmd: "/find", desc: "Список игроков во фракции онлайн." },
  { cmd: "/helpmed [ID]", desc: "Предложить лечение пациенту." },
  { cmd: "/paytime", desc: "Узнать оставшееся время до зарплаты." },
  { cmd: "/ud [ID]", desc: "Показать удостоверение." },
  { cmd: "/to [ID]", desc: "Принять поступивший вызов (со 2 ранга)." },
  { cmd: "/cancel", desc: "Отказаться от принятого вызова (со 2 ранга)." },
];
export const defaultFloors: Floor[] = [
  { num: "1 этаж", desc: "лечение пациентов (только выписывание препарата в палатах с койками данного этажа);" },
  { num: "2 этаж", desc: "проведение процедур и операций;" },
  { num: "3 этаж", desc: "выдача мед.карт, проведение мед. комиссий (для 5+ рангов);" },
  { num: "4 этаж", desc: "оказание услуг организаций при отделениях (Травматолого-ортопедический центр, НИИ Эпидемиологии, Стоматологическая поликлиника «Дентист»);" },
  { num: "5 этаж", desc: "служебный, отдых сотрудников, проведение собеседований." },
];
export const defaultDepartments: Department[] = [
  { abbr: "ОИ", full: "Отделение Интернатуры", color: "text-green-400" },
  { abbr: "ОДС", full: "Отделение Дневного Стационара", color: "text-sky-400" },
  { abbr: "ОИК", full: "Отделение Инфекционного Контроля", color: "text-red-400" },
  { abbr: "СОП", full: "Стоматологическое Отделение Поликлиники", color: "text-pink-400" },
  { abbr: "ОПРС", full: "Отделение Подготовки Руководящего Состава", color: "text-orange-400" },
];
export const defaultCharter: CharterDoc[] = [
  { abbr: "ОПСГО", title: "Общие правила для сотрудников госорганизаций", href: "https://forum.gtaprovince.ru/topic/816638" },
  { abbr: "ФЗоОЗ", title: "Федеральный Закон «Об основах охраны здоровья граждан»", href: "https://forum.gtaprovince.ru/topic/724454" },
  { abbr: "ОУМЗ", title: "Общий Устав Министерства Здравоохранения", href: "https://forum.gtaprovince.ru/topic/853771" },
  { abbr: "ВУ ЦГБ-Н", title: "Внутренний Устав ЦГБ Невский", href: "https://forum.gtaprovince.ru/topic/995741" },
  { abbr: "ОПиЛТС", title: "Правила использования личных транспортных средств", href: "https://forum.gtaprovince.ru/topic/816635" },
];
export const defaultOathLines: string[] = [
  "say Получая высокое звание врача и приступая к профессиональной деятельности, я торжественно...",
  "say ...клянусь честно исполнять свой врачебный долг, быть всегда готовым оказать медицинскую...",
  "say Беречь и развивать благородные традиции медицины.",
];
export const defaultMaleReports: Report[] = [
  { label: "Заступление на смену",  template: "/r ОИ-Инициалы. Заступил на смену." },
  { label: "Сдача смены",           template: "/r ОИ-Инициалы. Сдал смену." },
  { label: "Перерыв",               template: "/r ОИ-Инициалы. Вышел на обеденный перерыв." },
  { label: "Окончание перерыва",    template: "/r ОИ-Инициалы. Вернулся с обеденного перерыва." },
];
export const defaultFemaleReports: Report[] = [
  { label: "Заступление на смену",  template: "/r ОИ-Инициалы. Заступила на смену." },
  { label: "Сдача смены",           template: "/r ОИ-Инициалы. Сдала смену." },
  { label: "Перерыв",               template: "/r ОИ-Инициалы. Вышла на обеденный перерыв." },
  { label: "Окончание перерыва",    template: "/r ОИ-Инициалы. Вернулась с обеденного перерыва." },
];
export const defaultSchedule = {
  weekdays: "с 10:00 до 19:00",
  saturday: "с 11:00 до 18:00",
  break: "с 14:00 до 15:00",
  sunday: "выходной для сотрудников без наказаний",
  note: "Сотрудники с наказаниями работают в воскресенье по субботнему графику.",
};
