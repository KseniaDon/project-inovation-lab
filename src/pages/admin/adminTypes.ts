export type Role = "super_admin" | "editor";
export type Tab =
  | "hero" | "staff" | "sections" | "schedule" | "commands"
  | "floors" | "departments" | "charter" | "oath" | "reports"
  | "abbr" | "radio" | "activity" | "intro" | "intern_exam"
  | "access" | "password";

export type Report = { label: string; template: string };
export type AccessUser = { nickname: string; role: Role; created_at: string; created_by: string | null };

export type Section = { id: string; title: string; items: string[] };
export type StaffMember = { role: string; name: string; nickname: string; href: string; badge: string; badgeColor: string };
export type HeroData = { subtitle: string; buttonText: string };
export type Command = { cmd: string; desc: string };
export type Floor = { num: string; desc: string };
export type Department = { abbr: string; full: string; color: string; desc?: string };
export type CharterDoc = { abbr: string; title: string; href: string };
export type AbbrItem = { abbr: string; full: string };
export type RadioCommand = { cmd: string; desc: string };
export type RadioRule = { text: string };
export type ActivityLink = { label: string; href: string };

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
  { role: "Заместитель Заведующего ОИ", name: "Andrei Schmidt", nickname: "Andrei_Schmidt", href: "https://vk.com/id392167605", badge: "Зам. Зав.", badgeColor: "bg-zinc-600" },
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
  { abbr: "ОИ",   full: "Отделение Интернатуры",                     color: "text-green-400",  desc: "Это одно из отделений ЦГБ города Невский, сотрудники которого обучаются работе в нашей больнице. Самое первое отделение каждого сотрудника." },
  { abbr: "ОДС",  full: "Отделение Дневного Стационара",             color: "text-sky-400",    desc: "Сотрудники занимаются основной работой больницы, а также оказанием услуг на базе Травматолого-ортопедического центра, проведением проверок аптек и травматологических рейдов." },
  { abbr: "ОИК",  full: "Отделение Инфекционного Контроля",          color: "text-red-400",    desc: "Сотрудники занимаются основной работой больницы, а также оказанием услуг на базе НИИ Эпидемиологии, проведением санитарных проверок и инфекционных рейдов." },
  { abbr: "СОП",  full: "Стоматологическое Отделение Поликлиники",   color: "text-pink-400",   desc: "Сотрудники занимаются основной работой больницы, а также оказанием услуг на базе Стоматологической поликлиники «Дентист» и проведением стоматологических рейдов." },
  { abbr: "ОПРС", full: "Отделение Подготовки Руководящего Состава", color: "text-orange-400", desc: "Сотрудники проходят курсы повышения квалификации для дальнейшей работы в Руководящем составе больницы." },
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
  "say ...помощь, хранить врачебную тайну, внимательно и заботливо относиться к пациенту,..",
  "say ...действовать исключительно в его интересах независимо от пола, расы, национальности,..",
  "say ...языка, происхождения, а также других обстоятельств.",
  "say Доброжелательно относиться к коллегам, обращаться к ним за помощью и советом...",
  "say ...и самому никогда не отказывать коллегам в помощи и совете.",
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
export const defaultAbbr: AbbrItem[] = [
  { abbr: "МЗ",     full: "Министерство Здравоохранения" },
  { abbr: "ЦГБ-Н", full: "Центральная Городская Больница города Невский" },
  { abbr: "ОПСГО", full: "Общие Правила Сотрудников Государственных Организаций" },
  { abbr: "ПРСГО", full: "Правила Руководящего Состава Государственных Организаций" },
  { abbr: "ОУМЗ",  full: "Общий Устав Министерства Здравоохранения" },
  { abbr: "ВУ",    full: "Внутренний Устав" },
  { abbr: "ГСзФ",  full: "Главный Следящий за Фракциями" },
  { abbr: "ЗГСзФ", full: "Заместитель Главного Следящего за Фракциями" },
  { abbr: "ГС",    full: "Главный Следящий" },
  { abbr: "ПГС",   full: "Помощник Главного Следящего" },
  { abbr: "ГВ",    full: "Главный Врач" },
  { abbr: "ПЗГВ",  full: "Первый Заместитель Главного Врача" },
  { abbr: "ЗГВ",   full: "Заместитель Главного Врача" },
  { abbr: "ЗО",    full: "Заведующий Отделением" },
  { abbr: "ЗЗО",   full: "Заместитель Заведующего Отделения" },
  { abbr: "ВрИО",  full: "Временно Исполняющий Обязанности" },
  { abbr: "ИО",    full: "Исполняющий Обязанности" },
  { abbr: "РС",    full: "Руководящий Состав" },
  { abbr: "МС",    full: "Младший Состав" },
  { abbr: "ОДС",   full: "Отделение Дневного Стационара" },
  { abbr: "ОИК",   full: "Отделение Инфекционного Контроля" },
  { abbr: "СОП",   full: "Стоматологическое Отделение Поликлиники" },
  { abbr: "ОПРС",  full: "Отделение Подготовки Руководящего Состава" },
  { abbr: "ОИ",    full: "Отделение Интернатуры" },
  { abbr: "АСМП",  full: "Автомобиль Скорой Медицинской Помощи" },
  { abbr: "ВСМП",  full: "Вертолёт Скорой Медицинской Помощи" },
  { abbr: "РАСМП", full: "Реанимационный Автомобиль Скорой Медицинской Помощи" },
  { abbr: "ЖА",    full: "Журнал Активности" },
  { abbr: "МП",    full: "Мероприятие" },
  { abbr: "ПСЖ",   full: "По Собственному Желанию" },
  { abbr: "УП",    full: "Уважительная Причина" },
  { abbr: "ТКМ",   full: "Травматолого-ортопедический Центр г. Мирный" },
  { abbr: "КМН",   full: "Кандидат Медицинских Наук" },
  { abbr: "ДМН",   full: "Доктор Медицинских Наук" },
];
export const defaultRadioCommands: RadioCommand[] = [
  { cmd: "/r",   desc: "Команда РП рации" },
  { cmd: "/rb",  desc: "Команда нонРП рации" },
  { cmd: "/ro",  desc: "Команда РП рации (между больницами)" },
  { cmd: "/rob", desc: "Команда нонРП рации (между больницами)" },
];
export const defaultRadioRules: RadioRule[] = [
  { text: "Отыгровка: Перед тем, как сказать что-то в рацию, нужно обязательно отыграть то, что Вы её достали, а после доклада — то, что убрали." },
  { text: "В /r: Сейчас в РП рацию Вам можно использовать только для докладов: о заступлении на смену, сдаче смены. Пример: ОИ-КД. Заступил на смену." },
  { text: "В /rb: Вся остальная информация (вопросы, общение) — только в /rb." },
  { text: "Для интернов: Сейчас рация Вам доступна только для докладов о заступлении на смену и об её сдаче." },
];
export const defaultActivityData = {
  ja_link: "https://status-journal.com/dashboard",
  app_link: "https://github.com/HM-Province/gta-journal",
  forum_link: "https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/?do=findComment&comment=6982173",
  afk_rules: [
    "Вставать в АФК разрешено где угодно в пределах больницы (Исключение: крыша больницы).",
    "Длительность АФК — не более 5-ти минут!",
    "Вставать в АФК при онлайне 600 человек и больше — запрещено!",
  ],
};
export const defaultIntroData = {
  welcome: "Добро пожаловать в ЦГБ города Невский!",
  line1: "С этого момента Вы являетесь сотрудником Отделения Интернатуры.",
  line2: "На выход из Отделения Интернатуры и повышения до лаборанта вам дается",
  days_total: "14",
  line3: "За",
  days_feldsher: "7",
  line4: "повыситься до Фельдшера.",
  line5: "После повышения ещё",
  line6: "выйти из ОИ.",
};
export const defaultInternExam = {
  title: "Твоя первая и главная задача: Получить допуск к лечению.",
  desc: "До получения допуска к лечению вам нельзя абсолютно ничего. Лечить пациентов сможете только тогда, когда получите допуск к лечению.",
  binds_link: "https://forum.gtaprovince.ru/topic/995732-cgb-g-nevskiy-bindy-dlya-sotrudnikov/",
  charter_link: "https://forum.gtaprovince.ru/topic/995741-cgb-g-nevskiy-vnutrenniy-ustav/",
  exam_items: [
    "Информацию о больнице, которую Вам расскажут в процессе обучения;",
    "Практический экзамен по выдаче препаратов пациентам;",
    "Вопросы по Внутреннему уставу нашей больницы.",
  ],
};