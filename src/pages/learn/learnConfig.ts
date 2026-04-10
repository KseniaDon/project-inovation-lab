export type SectionId = "intro" | "intern" | "intern-binds" | "intern-radio" | "intern-reports" | "feldsher";

export const NAV: { id: SectionId; label: string; icon: string; parent?: string; divider?: string }[] = [
  { id: "intro",           label: "Вступление",         icon: "Flag" },
  { id: "intern",          label: "Интерн",              icon: "GraduationCap" },
  { id: "intern-binds",    label: "Настройка биндов",    icon: "Keyboard",     parent: "intern", divider: "Шаг 1: Подготовка" },
  { id: "intern-radio",    label: "Использование рации", icon: "Radio",        parent: "intern" },
  { id: "intern-reports",  label: "Доклады в рацию",     icon: "Megaphone",    parent: "intern" },
  { id: "feldsher",        label: "Фельдшер",            icon: "Stethoscope" },
];
