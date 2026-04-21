export type Role = "super_admin" | "head_admin" | "admin" | "moderator" | "editor";

export const ROLE_HIERARCHY: Role[] = ["super_admin", "head_admin", "admin", "moderator", "editor"];

export const ROLE_META: Record<Role, { label: string; hospitalLabel: string; short: string; color: string; bg: string }> = {
  super_admin: { label: "Суперадмин", hospitalLabel: "Куратор",      short: "Суперадмин", color: "text-blue-400",   bg: "bg-blue-900/50" },
  head_admin:  { label: "Главный админ", hospitalLabel: "ГВ",         short: "Гл. Админ",  color: "text-green-400",  bg: "bg-green-900/50" },
  admin:       { label: "Старший Админ",  hospitalLabel: "Куратор",      short: "Ст. Админ",   color: "text-red-400",    bg: "bg-red-900/50" },
  moderator:   { label: "Админ",          hospitalLabel: "ЗОИ",          short: "Админ",       color: "text-purple-400", bg: "bg-purple-900/50" },
  editor:      { label: "Младший Админ",  hospitalLabel: "ЗЗОИ",         short: "Мл. Админ",   color: "text-orange-400", bg: "bg-orange-900/50" },
};

export function roleRank(role: Role): number {
  const idx = ROLE_HIERARCHY.indexOf(role);
  return idx === -1 ? 999 : idx;
}

export function canManage(actorRole: Role, targetRole: Role): boolean {
  return roleRank(actorRole) < roleRank(targetRole);
}

export function canAddUsers(role: Role): boolean {
  return ["super_admin", "head_admin", "admin", "moderator"].includes(role);
}

export function normalizeRole(raw: string): Role {
  if (ROLE_HIERARCHY.includes(raw as Role)) return raw as Role;
  if (raw === "curator" || raw === "head_doctor" || raw === "curator_oi") return "admin";
  if (raw === "ward_head") return "moderator";
  if (raw === "deputy") return "editor";
  return "editor";
}
export type Tab =
  | "hero" | "staff" | "sections" | "schedule" | "commands"
  | "floors" | "departments" | "charter" | "oath" | "reports"
  | "abbr" | "radio" | "activity" | "intro" | "intern_exam"
  | "binds_page" | "report_page" | "mis_page" | "evidence_page" | "feldsher_page"
  | "access" | "password";

export type Report = { label: string; template: string };
export type AccessUser = { nickname: string; role: Role; created_at: string; created_by: string | null; href: string; hospital_role: string };
export type TkmAllowedEntry = { nick: string; attempts: number; allowed: boolean };

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

export type IntroData = { welcome: string; content: string };
export type InternExam = { title: string; content: string; content_after_pme?: string; binds_link: string; charter_link: string };

export const defaultIntroData: IntroData = {
  welcome: "Добро пожаловать в ЦГБ города Невский!",
  content: `<p>С этого момента Вы являетесь сотрудником Отделения Интернатуры.</p><p>На выход из Отделения Интернатуры и повышения до лаборанта вам дается <strong><span style="color:#dc2626">14 дней</span></strong>.</p><p>За <strong><span style="color:#dc2626">7 дней</span></strong> — повыситься до Фельдшера.</p><p>Остаточные дни после повышения — выйти из ОИ.</p>`,
};

export const defaultInternExam: InternExam = {
  title: "Ваша первая и главная задача: Получить допуск к лечению.",
  content: `<p>До получения допуска к лечению Вам нельзя абсолютно ничего. Лечить пациентов сможете только тогда, когда получите допуск к лечению.</p><p><strong>Чтобы получить допуск, Вам нужно сдать:</strong></p><ol><li>Прослушать вступительную лекцию;</li><li><strong>Сдать устную речь</strong> — это бинды. Слово «Бинд» в РП мы не используем!</li><li><strong>Сдать Первичный Медицинский Экзамен (ПМЭ);</strong></li></ol>`,
  content_after_pme: `<ol start="4"><li>Сдать клятву врача.</li></ol>`,
  binds_link: "https://forum.gtaprovince.ru/topic/995732-cgb-g-nevskiy-bindy-dlya-sotrudnikov/",
  charter_link: "https://forum.gtaprovince.ru/topic/995741-cgb-g-nevskiy-vnutrenniy-ustav/",
};

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
  { abbr: "ТКМ",   full: "Теоретический Квалификационный Модуль" },
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

export type SimplePageData = { title: string; content: string; content2?: string };

export const defaultReportPage: SimplePageData = {
  title: "Подготовка к повышению",
  content: `<p>После успешной сдачи всех экзаменов и получения допуска к лечению, Ваши последние действия на должности Интерна:</p><ol><li>Вылечить <strong><span style="color:#ef4444">5 пациентов</span></strong>.</li><li>Загрузить доказательства в МИС «Здоровье».</li><li>Оставить заявление на госпортал, о том, что Вы загрузили свои доказательства в МИС «Здоровье».</li></ol>`,
};

export const defaultMisPage: SimplePageData = {
  title: "МИС «Здоровье»",
  content: `<p>Чтобы все было правильно и Вам одобрили Ваш отчёт, для начала разберемся, как заполнить содержимое гугл-формы.</p><p><strong><span style="color:#ef4444">Что нужно заполнить в форме:</span></strong></p><ol><li><strong>Введите Ваш никнейм и ссылку на страницу ВК</strong> — Ваше игровое имя и фамилия на латинице (например Ksenia_Donskaya) и ссылка на Вашу страницу ВК;</li><li><strong>Выбрать отделение</strong> — в нашем случае, это ОИ - Отделение Интернатуры;</li><li><strong>Выберите желаемое действие</strong> — здесь все зависит от ситуации, если Вам нужно повыситься, выбираете <strong><span style="color:#ef4444">Подать отчет на повышение</span></strong>, если отработать полученное наказание — <strong><span style="color:#ef4444">Подать заявление на снятие дисциплинарного взыскания</span></strong>;</li></ol>`,
  content2: `<ol start="4"><li><strong>Критерии и доказательства</strong> — здесь мы указываем по форме, что Вы сделали для повышения или для отработки наказания.</li></ol><p>Например, возьмем форму подачи на повышение. В эту строку нужно указать следующее:</p>`,
};

export const defaultEvidencePage: SimplePageData = {
  title: "Фиксация доказательств",
  content: `<p>Первым делом, чтобы подать отчет на повышение, давайте научимся делать порядок лечения и фиксировать Вашу работу.</p>`,
};

export const defaultBindsPage: SimplePageData = {
  title: "Настройка биндов",
  content: `<p>Как и говорилось ранее, устная речь — это бинды. Слово «Бинд» в РП мы не используем!</p><p>Бинды — это Ваш главный рабочий инструмент. Они экономят время и обеспечивают качественную РП-отыгровку.</p><p><strong>Важное правило:</strong> Настройку биндов необходимо производить построчно. Не копируйте весь блок текста сразу!</p>`,
};

export const defaultFeldsherPage: SimplePageData = {
  title: "Фельдшер",
  content: `<p>Поздравляем с повышением до Фельдшера! Теперь тебе доступны новые обязанности и возможности в больнице.</p><p><strong>Основные задачи Фельдшера:</strong></p><ul><li>Протоколы первичной диагностики пациентов.</li><li>Алгоритмы оказания неотложной помощи.</li><li>Ведение сестринской документации и историй болезней.</li><li>Правила хранения и выдачи лекарственных средств.</li><li>Взаимодействие с дежурным врачом и руководящим составом.</li><li>Инфекционная безопасность и работа с биоматериалом.</li></ul>`,
};