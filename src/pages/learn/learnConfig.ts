export type SectionId = "intro" | "intern" | "intern-binds" | "intern-radio" | "intern-reports" | "intern-commands" | "intern-abbr" | "intern-schedule" | "intern-floors" | "intern-activity" | "intern-charter" | "intern-departments" | "intern-drugs" | "intern-oath" | "feldsher";

export const NAV: { id: SectionId; label: string; icon: string; parent?: string; divider?: string }[] = [
  { id: "intro",           label: "Вступление",         icon: "Flag" },
  { id: "intern",          label: "Интерн",              icon: "GraduationCap" },
  { id: "intern-binds",    label: "Настройка биндов",    icon: "Keyboard",     parent: "intern", divider: "Шаг 1: Подготовка" },
  { id: "intern-radio",    label: "Использование рации", icon: "Radio",        parent: "intern" },
  { id: "intern-reports",  label: "Доклады в рацию",     icon: "Megaphone",    parent: "intern" },
  { id: "intern-commands",  label: "Основные команды",    icon: "Terminal",     parent: "intern" },
  { id: "intern-abbr",     label: "Аббревиатуры",        icon: "BookOpen",     parent: "intern" },
  { id: "intern-schedule", label: "График работы",          icon: "CalendarDays", parent: "intern", divider: "Шаг 2: Устав и правила" },
  { id: "intern-floors",   label: "Распределение этажей",   icon: "Building2",    parent: "intern" },
  { id: "intern-activity",     label: "Журнал активности (ЖА)", icon: "ClipboardList", parent: "intern" },
  { id: "intern-charter",      label: "Уставная документация",  icon: "ScrollText",    parent: "intern" },
  { id: "intern-departments",  label: "Отделения ЦГБ-Н",        icon: "Network",       parent: "intern", divider: "Шаг 3: Экзамен" },
  { id: "intern-drugs",        label: "Препараты",               icon: "Pill",          parent: "intern" },
  { id: "intern-oath",         label: "Клятва врача",            icon: "GraduationCap", parent: "intern" },
  { id: "feldsher",            label: "Фельдшер",                icon: "Stethoscope" },
];