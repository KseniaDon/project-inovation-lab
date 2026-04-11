import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

type Role = "super_admin" | "editor";
type Tab = "hero" | "staff" | "sections" | "schedule" | "commands" | "floors" | "departments" | "charter" | "oath" | "reports" | "access" | "password";
type Report = { label: string; template: string };
type AccessUser = { nickname: string; role: Role; created_at: string; created_by: string | null };

type Section = { id: string; title: string; items: string[] };
type StaffMember = { role: string; name: string; nickname: string; href: string; badge: string; badgeColor: string };
type HeroData = { subtitle: string; buttonText: string };
type Command = { cmd: string; desc: string };
type Floor = { num: string; desc: string };
type Department = { abbr: string; full: string; color: string };
type CharterDoc = { abbr: string; title: string; href: string };

const BADGE_COLORS = ["bg-red-600", "bg-blue-600", "bg-green-600", "bg-yellow-600", "bg-purple-600", "bg-zinc-600"];
const DEPT_COLORS = ["text-green-400", "text-sky-400", "text-red-400", "text-pink-400", "text-orange-400", "text-yellow-400", "text-purple-400"];

const defaultHero: HeroData = { subtitle: "Методическое пособие для сотрудников отделения. Всё, что нужно знать с первого дня службы.", buttonText: "Перейти к обучению" };
const defaultSections: Section[] = [
  { id: "intern", title: "Интерн", items: ["Ознакомление с правилами внутреннего распорядка", "Изучение структуры отделения", "Работа с медицинской документацией"] },
  { id: "feldsher", title: "Фельдшер", items: ["Протоколы первичной диагностики пациентов", "Алгоритмы оказания неотложной помощи", "Инфекционная безопасность и работа с биоматериалом"] },
];
const defaultStaff: StaffMember[] = [
  { role: "Куратор Отделения Интернатуры", name: "Ksenia Donskaya", nickname: "Ksenia_Donskaya", href: "https://vk.ru/soul__shu", badge: "Куратор", badgeColor: "bg-red-600" },
  { role: "Заместитель Заведующего ОИ", name: "Egor Maslow", nickname: "Egor_Maslow", href: "https://vk.ru/cccuvigon", badge: "Зам. Зав.", badgeColor: "bg-zinc-600" },
];
const defaultCommands: Command[] = [
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
const defaultFloors: Floor[] = [
  { num: "1 этаж", desc: "лечение пациентов (только выписывание препарата в палатах с койками данного этажа);" },
  { num: "2 этаж", desc: "проведение процедур и операций;" },
  { num: "3 этаж", desc: "выдача мед.карт, проведение мед. комиссий (для 5+ рангов);" },
  { num: "4 этаж", desc: "оказание услуг организаций при отделениях (Травматолого-ортопедический центр, НИИ Эпидемиологии, Стоматологическая поликлиника «Дентист»);" },
  { num: "5 этаж", desc: "служебный, отдых сотрудников, проведение собеседований." },
];
const defaultDepartments: Department[] = [
  { abbr: "ОИ", full: "Отделение Интернатуры", color: "text-green-400" },
  { abbr: "ОДС", full: "Отделение Дневного Стационара", color: "text-sky-400" },
  { abbr: "ОИК", full: "Отделение Инфекционного Контроля", color: "text-red-400" },
  { abbr: "СОП", full: "Стоматологическое Отделение Поликлиники", color: "text-pink-400" },
  { abbr: "ОПРС", full: "Отделение Подготовки Руководящего Состава", color: "text-orange-400" },
];
const defaultCharter: CharterDoc[] = [
  { abbr: "ОПСГО", title: "Общие правила для сотрудников госорганизаций", href: "https://forum.gtaprovince.ru/topic/816638" },
  { abbr: "ФЗоОЗ", title: "Федеральный Закон «Об основах охраны здоровья граждан»", href: "https://forum.gtaprovince.ru/topic/724454" },
  { abbr: "ОУМЗ", title: "Общий Устав Министерства Здравоохранения", href: "https://forum.gtaprovince.ru/topic/853771" },
  { abbr: "ВУ ЦГБ-Н", title: "Внутренний Устав ЦГБ Невский", href: "https://forum.gtaprovince.ru/topic/995741" },
  { abbr: "ОПиЛТС", title: "Правила использования личных транспортных средств", href: "https://forum.gtaprovince.ru/topic/816635" },
];

const WHITELIST: { nickname: string; role: Role; label: string }[] = [
  { nickname: "soul__shu", role: "super_admin", label: "Главный администратор" },
  { nickname: "cccuvigon", role: "editor", label: "Редактор" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function SaveBtn({ onClick, saved, loading }: { onClick: () => void; saved: boolean; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading || saved}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors">
      {saved ? <><Icon name="Check" size={14} />Сохранено</> : loading ? "Сохраняю..." : <><Icon name="Save" size={14} />Сохранить</>}
    </button>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs uppercase tracking-widest text-zinc-400 mb-1.5 block">{label}</label>{children}</div>;
}
function Inp({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className={`w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors ${className}`} />;
}
function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return <div className="mb-6"><h2 className="text-lg font-bold mb-1">{title}</h2>{desc && <p className="text-zinc-500 text-sm">{desc}</p>}</div>;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ nickname: string; role: Role } | null>(null);
  const [tab, setTab] = useState<Tab>(localStorage.getItem("admin_role") === "editor" ? "sections" : "hero");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff);
  const [commands, setCommands] = useState<Command[]>(defaultCommands);
  const [floors, setFloors] = useState<Floor[]>(defaultFloors);
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [charter, setCharter] = useState<CharterDoc[]>(defaultCharter);
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [editStaffIdx, setEditStaffIdx] = useState<number | null>(null);

  // Клятва и доклады
  const [oathLines, setOathLines] = useState<string[]>([
    "say Получая высокое звание врача и приступая к профессиональной деятельности, я торжественно...",
    "say ...клянусь честно исполнять свой врачебный долг, быть всегда готовым оказать медицинскую...",
    "say Беречь и развивать благородные традиции медицины.",
  ]);
  const [maleReports, setMaleReports] = useState<Report[]>([
    { label: "Заступление на смену",  template: "/r ОИ-Инициалы. Заступил на смену." },
    { label: "Сдача смены",           template: "/r ОИ-Инициалы. Сдал смену." },
    { label: "Перерыв",               template: "/r ОИ-Инициалы. Вышел на обеденный перерыв." },
    { label: "Окончание перерыва",    template: "/r ОИ-Инициалы. Вернулся с обеденного перерыва." },
  ]);
  const [femaleReports, setFemaleReports] = useState<Report[]>([
    { label: "Заступление на смену",  template: "/r ОИ-Инициалы. Заступила на смену." },
    { label: "Сдача смены",           template: "/r ОИ-Инициалы. Сдала смену." },
    { label: "Перерыв",               template: "/r ОИ-Инициалы. Вышла на обеденный перерыв." },
    { label: "Окончание перерыва",    template: "/r ОИ-Инициалы. Вернулась с обеденного перерыва." },
  ]);

  // Доступы
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [newAccessNick, setNewAccessNick] = useState("");
  const [newAccessRole, setNewAccessRole] = useState<Role>("editor");
  const [accessMsg, setAccessMsg] = useState("");

  // Смена пароля
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [schedule, setSchedule] = useState({
    weekdays: "с 10:00 до 19:00",
    saturday: "с 11:00 до 18:00",
    break: "с 14:00 до 15:00",
    sunday: "выходной для сотрудников без наказаний",
    note: "Сотрудники с наказаниями работают в воскресенье по субботнему графику.",
  });

  const token = () => localStorage.getItem("admin_token") || "";
  const authFetch = useCallback((url: string, opts?: RequestInit) =>
    fetch(url, { ...opts, headers: { ...(opts?.headers || {}), "X-Authorization": `Bearer ${token()}`, "Content-Type": "application/json" } }), []);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };
  const saveBlock = async (key: string, value: unknown) => {
    setSaving(true);
    await authFetch(`${API}?action=save_site_data`, { method: "POST", body: JSON.stringify({ key, value }) });
    setSaving(false);
    showSaved();
  };

  useEffect(() => {
    if (!token()) { navigate("/admin/login"); return; }
    authFetch(`${API}?action=me`).then(r => r.json()).then(d => {
      if (d.nickname) setMe({ nickname: d.nickname, role: d.role });
      else navigate("/admin/login");
    }).catch(() => navigate("/admin/login"));
  }, [navigate, authFetch]);

  useEffect(() => {
    if (!me) return;
    authFetch(`${API}?action=site_data`).then(r => r.json()).then(d => {
      if (!d.data) return;
      if (d.data.hero) setHero(d.data.hero);
      if (d.data.sections) setSections(d.data.sections);
      if (d.data.staff) setStaff(d.data.staff);
      if (d.data.commands) setCommands(d.data.commands);
      if (d.data.floors) setFloors(d.data.floors);
      if (d.data.departments) setDepartments(d.data.departments);
      if (d.data.charter) setCharter(d.data.charter);
      if (d.data.schedule) setSchedule(d.data.schedule);
      if (d.data.oath_lines) setOathLines(d.data.oath_lines);
      if (d.data.reports_male) setMaleReports(d.data.reports_male);
      if (d.data.reports_female) setFemaleReports(d.data.reports_female);
    });
  }, [me, authFetch]);

  const logout = () => { playClickSound(); localStorage.clear(); navigate("/admin/login"); };

  const loadAccess = useCallback(() => {
    setAccessLoading(true);
    authFetch(`${API}?action=access_list`).then(r => r.json()).then(d => {
      if (d.users) setAccessUsers(d.users);
    }).finally(() => setAccessLoading(false));
  }, [authFetch]);

  useEffect(() => { if (tab === "access" && me) loadAccess(); }, [tab, me, loadAccess]);

  const addAccess = async () => {
    if (!newAccessNick.trim()) return;
    setAccessMsg("");
    const r = await authFetch(`${API}?action=add_access`, { method: "POST", body: JSON.stringify({ nickname: newAccessNick.trim(), role: newAccessRole }) });
    const d = await r.json();
    if (d.ok) { setNewAccessNick(""); loadAccess(); setAccessMsg("Добавлено!"); setTimeout(() => setAccessMsg(""), 2000); }
    else setAccessMsg(d.error || "Ошибка");
  };

  const removeAccess = async (nick: string) => {
    const r = await authFetch(`${API}?action=remove_access`, { method: "POST", body: JSON.stringify({ nickname: nick }) });
    const d = await r.json();
    if (d.ok) loadAccess();
    else setAccessMsg(d.error || "Ошибка");
  };

  const changePassword = async () => {
    setPwMsg("");
    if (!pwNew || pwNew !== pwConfirm) { setPwMsg("Пароли не совпадают"); return; }
    if (pwNew.length < 6) { setPwMsg("Минимум 6 символов"); return; }
    setPwLoading(true);
    // Сначала проверяем текущий пароль через login
    const checkR = await fetch(`${API}?action=login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: me?.nickname, password: pwCurrent }),
    });
    const checkD = await checkR.json();
    if (!checkD.token) { setPwMsg("Неверный текущий пароль"); setPwLoading(false); return; }
    // Меняем пароль
    const r = await authFetch(`${API}?action=set_password`, { method: "POST", body: JSON.stringify({ nickname: me?.nickname, password: pwNew }) });
    const d = await r.json();
    if (d.ok) { setPwMsg("Пароль успешно изменён!"); setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
    else setPwMsg(d.error || "Ошибка");
    setPwLoading(false);
  };

  const isSuperAdmin = me?.role === "super_admin";

  // Вкладки: редактор видит только "sections", суперадмин — всё
  const ALL_TABS: { id: Tab; label: string; icon: string; superOnly?: boolean }[] = [
    { id: "hero",        label: "Главная",     icon: "Home",         superOnly: true },
    { id: "staff",       label: "Состав",      icon: "Users",        superOnly: true },
    { id: "sections",    label: "Обучение",    icon: "BookOpen" },
    { id: "commands",    label: "Команды",     icon: "Terminal",     superOnly: true },
    { id: "schedule",    label: "Расписание",  icon: "Calendar",     superOnly: true },
    { id: "floors",      label: "Этажи",       icon: "Building2",    superOnly: true },
    { id: "departments", label: "Отделения",   icon: "Network",      superOnly: true },
    { id: "charter",     label: "Уставы",      icon: "ScrollText",   superOnly: true },
    { id: "oath",        label: "Клятва",      icon: "GraduationCap", superOnly: true },
    { id: "reports",     label: "Доклады",     icon: "Megaphone",    superOnly: true },
    { id: "access",      label: "Доступы",     icon: "Shield",       superOnly: true },
    { id: "password",    label: "Мой пароль",  icon: "KeyRound" },
  ];
  const TABS = ALL_TABS.filter(t => !t.superOnly || isSuperAdmin);

  if (!me) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-zinc-800 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          <span className="text-xs uppercase tracking-widest text-zinc-400 hidden sm:block">ЦГБ Невский</span>
          <span className="text-sm font-semibold">Панель управления</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <Icon name="User" size={13} className="text-zinc-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-none">vk.ru/{me.nickname}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{isSuperAdmin ? "Главный администратор" : "Редактор"}</p>
            </div>
          </div>
          <button onClick={() => { playClickSound(); navigate("/"); }} className="text-zinc-400 hover:text-white text-xs transition-colors hidden sm:block">На сайт</button>
          <button onClick={logout} className="text-red-500 hover:text-red-400 text-xs transition-colors flex items-center gap-1">
            <Icon name="LogOut" size={14} /><span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-14 md:w-52 border-r border-zinc-800 flex flex-col py-2 shrink-0 overflow-y-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { playClickSound(); setTab(t.id); }}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${tab === t.id ? "bg-zinc-800 text-white border-r-2 border-red-600" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}>
              <Icon name={t.icon as "Home"} size={15} className="shrink-0" />
              <span className="hidden md:block text-sm">{t.label}</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">

          {/* ── HERO ───────────────────────────────────────────────────────── */}
          {tab === "hero" && (
            <div className="max-w-2xl">
              <SectionHeader title="Главная страница" desc="Заголовок и кнопка на экране-приветствии" />
              <div className="flex flex-col gap-4">
                <Field label="Подзаголовок">
                  <textarea rows={3} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
                </Field>
                <Field label="Текст кнопки">
                  <Inp value={hero.buttonText} onChange={v => setHero({ ...hero, buttonText: v })} />
                </Field>
                <SaveBtn onClick={() => saveBlock("hero", hero)} saved={saved} loading={saving} />
              </div>
            </div>
          )}

          {/* ── STAFF ──────────────────────────────────────────────────────── */}
          {tab === "staff" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Руководящий состав" desc='Отображается на странице "Контакты"' />
                <button onClick={() => { playClickSound(); setStaff(s => [...s, { role: "Должность", name: "Имя Фамилия", nickname: "nickname", href: "https://vk.ru/", badge: "Роль", badgeColor: "bg-red-600" }]); setEditStaffIdx(staff.length); }}
                  className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
                  <Icon name="Plus" size={13} />Добавить
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {staff.map((person, idx) => (
                  <div key={idx} className="border border-zinc-800 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-sm shrink-0 ${person.badgeColor}`} />
                      <span className="font-semibold text-sm flex-1">{person.name}</span>
                      <button onClick={() => { playClickSound(); setEditStaffIdx(editStaffIdx === idx ? null : idx); }} className="text-zinc-500 hover:text-white transition-colors">
                        <Icon name={editStaffIdx === idx ? "ChevronUp" : "Pencil"} size={14} />
                      </button>
                      <button onClick={() => { playClickSound(); setStaff(s => s.filter((_, i) => i !== idx)); }} className="text-zinc-600 hover:text-red-500 transition-colors">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                    {editStaffIdx === idx && (
                      <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Имя"><Inp value={person.name} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, name: v } : p))} /></Field>
                          <Field label="Должность"><Inp value={person.role} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, role: v } : p))} /></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Никнейм ВК"><Inp value={person.nickname} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, nickname: v } : p))} placeholder="nickname" /></Field>
                          <Field label="Ссылка ВК"><Inp value={person.href} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, href: v } : p))} placeholder="https://vk.ru/..." /></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Текст бейджа"><Inp value={person.badge} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, badge: v } : p))} /></Field>
                          <Field label="Цвет бейджа">
                            <div className="flex gap-2 flex-wrap pt-1">
                              {BADGE_COLORS.map(c => <button key={c} onClick={() => setStaff(s => s.map((p, i) => i === idx ? { ...p, badgeColor: c } : p))} className={`w-6 h-6 rounded-sm ${c} ${person.badgeColor === c ? "ring-2 ring-white" : ""}`} />)}
                            </div>
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6"><SaveBtn onClick={() => saveBlock("staff", staff)} saved={saved} loading={saving} /></div>
            </div>
          )}

          {/* ── SECTIONS (учебные этапы) ────────────────────────────────────── */}
          {tab === "sections" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Разделы обучения" desc="Этапы и пункты программы интернатуры" />
                <button onClick={() => { playClickSound(); setSections(s => [...s, { id: `sec_${Date.now()}`, title: "Новый раздел", items: [] }]); }}
                  className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
                  <Icon name="Plus" size={13} />Раздел
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {sections.map((sec) => (
                  <div key={sec.id} className="border border-zinc-800 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Inp value={sec.title} onChange={v => setSections(s => s.map(x => x.id === sec.id ? { ...x, title: v } : x))} className="font-semibold" />
                      <button onClick={() => { playClickSound(); setSections(s => s.filter(x => x.id !== sec.id)); }} className="text-zinc-600 hover:text-red-500 transition-colors shrink-0">
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-1.5 mb-4">
                      {sec.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 group">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                          <input type="text" value={item} onChange={e => setSections(s => s.map(x => x.id === sec.id ? { ...x, items: x.items.map((it, i) => i === idx ? e.target.value : it) } : x))}
                            className="flex-1 bg-transparent text-sm text-zinc-300 outline-none border-b border-transparent focus:border-zinc-600 transition-colors py-0.5" />
                          <button onClick={() => { playClickSound(); setSections(s => s.map(x => x.id === sec.id ? { ...x, items: x.items.filter((_, i) => i !== idx) } : x)); }}
                            className="text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"><Icon name="X" size={13} /></button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Новый пункт..." value={newItem[sec.id] || ""}
                        onChange={e => setNewItem(p => ({ ...p, [sec.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === "Enter" && newItem[sec.id]?.trim()) { setSections(s => s.map(x => x.id === sec.id ? { ...x, items: [...x.items, newItem[sec.id].trim()] } : x)); setNewItem(p => ({ ...p, [sec.id]: "" })); } }}
                        className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                      <button onClick={() => { if (!newItem[sec.id]?.trim()) return; playClickSound(); setSections(s => s.map(x => x.id === sec.id ? { ...x, items: [...x.items, newItem[sec.id].trim()] } : x)); setNewItem(p => ({ ...p, [sec.id]: "" })); }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 transition-colors"><Icon name="Plus" size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6"><SaveBtn onClick={() => saveBlock("sections", sections)} saved={saved} loading={saving} /></div>
            </div>
          )}

          {/* ── COMMANDS ───────────────────────────────────────────────────── */}
          {tab === "commands" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Основные команды" desc="Список команд для сотрудников" />
                <button onClick={() => { playClickSound(); setCommands(c => [...c, { cmd: "/команда", desc: "Описание" }]); }}
                  className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
                  <Icon name="Plus" size={13} />Добавить
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {commands.map((cmd, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <input value={cmd.cmd} onChange={e => setCommands(c => c.map((x, i) => i === idx ? { ...x, cmd: e.target.value } : x))}
                      className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors w-40 shrink-0" />
                    <input value={cmd.desc} onChange={e => setCommands(c => c.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                      className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                    <button onClick={() => { playClickSound(); setCommands(c => c.filter((_, i) => i !== idx)); }}
                      className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="mt-6"><SaveBtn onClick={() => saveBlock("commands", commands)} saved={saved} loading={saving} /></div>
            </div>
          )}

          {/* ── SCHEDULE ───────────────────────────────────────────────────── */}
          {tab === "schedule" && (
            <div className="max-w-2xl">
              <SectionHeader title="График работы" desc="Расписание рабочих дней и перерывов" />
              <div className="flex flex-col gap-4">
                <Field label="Пн–Пт"><Inp value={schedule.weekdays} onChange={v => setSchedule(s => ({ ...s, weekdays: v }))} /></Field>
                <Field label="Суббота"><Inp value={schedule.saturday} onChange={v => setSchedule(s => ({ ...s, saturday: v }))} /></Field>
                <Field label="Перерыв (ежедневно)"><Inp value={schedule.break} onChange={v => setSchedule(s => ({ ...s, break: v }))} /></Field>
                <Field label="Воскресенье"><Inp value={schedule.sunday} onChange={v => setSchedule(s => ({ ...s, sunday: v }))} /></Field>
                <Field label="Примечание">
                  <textarea rows={2} value={schedule.note} onChange={e => setSchedule(s => ({ ...s, note: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
                </Field>
                <SaveBtn onClick={() => saveBlock("schedule", schedule)} saved={saved} loading={saving} />
              </div>
            </div>
          )}

          {/* ── FLOORS ─────────────────────────────────────────────────────── */}
          {tab === "floors" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Распределение этажей" desc="Описание каждого этажа больницы" />
                <button onClick={() => { playClickSound(); setFloors(f => [...f, { num: `${f.length + 1} этаж`, desc: "Описание" }]); }}
                  className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
                  <Icon name="Plus" size={13} />Добавить
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {floors.map((floor, idx) => (
                  <div key={idx} className="flex items-start gap-2 group">
                    <input value={floor.num} onChange={e => setFloors(f => f.map((x, i) => i === idx ? { ...x, num: e.target.value } : x))}
                      className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors w-28 shrink-0 font-semibold" />
                    <input value={floor.desc} onChange={e => setFloors(f => f.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                      className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                    <button onClick={() => { playClickSound(); setFloors(f => f.filter((_, i) => i !== idx)); }}
                      className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-2.5"><Icon name="X" size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="mt-6"><SaveBtn onClick={() => saveBlock("floors", floors)} saved={saved} loading={saving} /></div>
            </div>
          )}

          {/* ── DEPARTMENTS ────────────────────────────────────────────────── */}
          {tab === "departments" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Отделения ЦГБ-Н" desc="Структура и аббревиатуры подразделений" />
                <button onClick={() => { playClickSound(); setDepartments(d => [...d, { abbr: "ОТД", full: "Новое отделение", color: "text-zinc-400" }]); }}
                  className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
                  <Icon name="Plus" size={13} />Добавить
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {departments.map((dept, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <input value={dept.abbr} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                      className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm font-bold outline-none focus:border-red-600 transition-colors w-20 shrink-0" />
                    <input value={dept.full} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, full: e.target.value } : x))}
                      className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                    <select value={dept.color} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, color: e.target.value } : x))}
                      className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2.5 text-xs outline-none focus:border-red-600 transition-colors w-28 shrink-0">
                      {DEPT_COLORS.map(c => <option key={c} value={c}>{c.replace("text-", "")}</option>)}
                    </select>
                    <button onClick={() => { playClickSound(); setDepartments(d => d.filter((_, i) => i !== idx)); }}
                      className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="mt-6"><SaveBtn onClick={() => saveBlock("departments", departments)} saved={saved} loading={saving} /></div>
            </div>
          )}

          {/* ── CHARTER ────────────────────────────────────────────────────── */}
          {tab === "charter" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Уставная документация" desc="Ссылки на официальные документы и уставы" />
                <button onClick={() => { playClickSound(); setCharter(c => [...c, { abbr: "АБВ", title: "Название документа", href: "https://forum.gtaprovince.ru/" }]); }}
                  className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
                  <Icon name="Plus" size={13} />Добавить
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {charter.map((doc, idx) => (
                  <div key={idx} className="border border-zinc-800 p-4 group">
                    <div className="flex items-start gap-2 mb-2">
                      <input value={doc.abbr} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                        className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-bold outline-none focus:border-red-600 transition-colors w-24 shrink-0" />
                      <input value={doc.title} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                        className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                      <button onClick={() => { playClickSound(); setCharter(c => c.filter((_, i) => i !== idx)); }}
                        className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                    </div>
                    <input value={doc.href} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, href: e.target.value } : x))}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-400 px-3 py-2 text-xs outline-none focus:border-red-600 transition-colors" placeholder="https://..." />
                  </div>
                ))}
              </div>
              <div className="mt-6"><SaveBtn onClick={() => saveBlock("charter", charter)} saved={saved} loading={saving} /></div>
            </div>
          )}

          {/* ── OATH ───────────────────────────────────────────────────────── */}
          {tab === "oath" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Клятва врача" desc="Строки клятвы (say-команды для консоли)" />
                <button onClick={() => { playClickSound(); setOathLines(l => [...l, "say Новая строка клятвы."]); }}
                  className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
                  <Icon name="Plus" size={13} />Добавить
                </button>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                {oathLines.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <input value={line} onChange={e => setOathLines(l => l.map((x, i) => i === idx ? e.target.value : x))}
                      className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors" />
                    <button onClick={() => { playClickSound(); setOathLines(l => l.filter((_, i) => i !== idx)); }}
                      className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                  </div>
                ))}
              </div>
              <SaveBtn onClick={() => saveBlock("oath_lines", oathLines)} saved={saved} loading={saving} />
            </div>
          )}

          {/* ── REPORTS ────────────────────────────────────────────────────── */}
          {tab === "reports" && (
            <div className="max-w-2xl">
              <SectionHeader title="Доклады в рацию" desc="Шаблоны докладов для мужчин и женщин" />
              {[
                { label: "♂ Мужские доклады", items: maleReports, setItems: setMaleReports, key: "reports_male" },
                { label: "♀ Женские доклады", items: femaleReports, setItems: setFemaleReports, key: "reports_female" },
              ].map(({ label, items, setItems, key }) => (
                <div key={key} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-zinc-300">{label}</p>
                    <button onClick={() => { playClickSound(); setItems(l => [...l, { label: "Новый доклад", template: "/r ОИ-Инициалы. Текст." }]); }}
                      className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                      <Icon name="Plus" size={12} />Добавить
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 border border-zinc-800 p-4">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        <input value={item.label} onChange={e => setItems(l => l.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))}
                          className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs outline-none focus:border-red-600 transition-colors w-36 shrink-0" />
                        <input value={item.template} onChange={e => setItems(l => l.map((x, i) => i === idx ? { ...x, template: e.target.value } : x))}
                          className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors" />
                        <button onClick={() => { playClickSound(); setItems(l => l.filter((_, i) => i !== idx)); }}
                          className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={13} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3"><SaveBtn onClick={() => saveBlock(key, items)} saved={saved} loading={saving} /></div>
                </div>
              ))}
            </div>
          )}

          {/* ── ACCESS ─────────────────────────────────────────────────────── */}
          {tab === "access" && (
            <div className="max-w-xl">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="Список доступов" desc="Кто имеет доступ к панели управления" />
                <button onClick={() => { playClickSound(); loadAccess(); }} className="text-zinc-400 hover:text-white transition-colors shrink-0">
                  <Icon name="RefreshCw" size={15} />
                </button>
              </div>

              {accessLoading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="flex flex-col gap-3 mb-6">
                  {accessUsers.map((u) => (
                    <div key={u.nickname} className="border border-zinc-800 p-4 flex items-center gap-3">
                      <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                        <Icon name="User" size={15} className="text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <a href={`https://vk.ru/${u.nickname}`} target="_blank" rel="noopener noreferrer"
                          className="font-semibold text-sm hover:text-red-400 transition-colors block">
                          vk.ru/{u.nickname}
                        </a>
                        <p className="text-xs text-zinc-500">{u.created_by ? `Добавил: ${u.created_by}` : "Основатель"}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 font-semibold uppercase tracking-wider shrink-0 ${u.role === "super_admin" ? "bg-red-900/50 text-red-400" : "bg-zinc-800 text-zinc-400"}`}>
                        {u.role === "super_admin" ? "Гл. Адм." : "Редактор"}
                      </span>
                      {isSuperAdmin && u.nickname !== me?.nickname && (
                        <button onClick={() => { playClickSound(); removeAccess(u.nickname); }}
                          className="text-zinc-600 hover:text-red-500 transition-colors shrink-0">
                          <Icon name="UserX" size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isSuperAdmin && (
                <div className="border border-zinc-700/40 bg-zinc-900/40 p-5">
                  <p className="text-sm font-semibold mb-3 text-zinc-300">Добавить пользователя</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs select-none">vk.ru/</span>
                        <input type="text" placeholder="nickname" value={newAccessNick}
                          onChange={e => setNewAccessNick(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addAccess()}
                          className="w-full bg-zinc-900 border border-zinc-700 text-white pl-12 pr-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                      </div>
                      <select value={newAccessRole} onChange={e => setNewAccessRole(e.target.value as Role)}
                        className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors">
                        <option value="editor">Редактор</option>
                        <option value="super_admin">Гл. Адм.</option>
                      </select>
                    </div>
                    {accessMsg && <p className={`text-xs ${accessMsg.includes("!") ? "text-green-400" : "text-red-400"}`}>{accessMsg}</p>}
                    <button onClick={() => { playClickSound(); addAccess(); }}
                      className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors">
                      <Icon name="Plus" size={13} />Добавить
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col gap-1">
                    <p><span className="text-red-400 font-semibold">Гл. Администратор</span> — полный доступ ко всему сайту</p>
                    <p><span className="text-zinc-300 font-semibold">Редактор</span> — только разделы обучения и свой пароль</p>
                    <p className="mt-1 text-zinc-600">Новый пользователь установит пароль при первом входе</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── MY PASSWORD ────────────────────────────────────────────────── */}
          {tab === "password" && (
            <div className="max-w-md">
              <SectionHeader title="Мой пароль" desc="Смена пароля для входа в панель" />
              <div className="flex flex-col gap-4">
                <Field label="Текущий пароль">
                  <input type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                </Field>
                <Field label="Новый пароль">
                  <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                </Field>
                <Field label="Повторите новый пароль">
                  <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && changePassword()}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                </Field>
                {pwMsg && <p className={`text-sm ${pwMsg.includes("успешно") ? "text-green-400" : "text-red-400"}`}>{pwMsg}</p>}
                <button onClick={() => { playClickSound(); changePassword(); }} disabled={pwLoading}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors">
                  <Icon name="KeyRound" size={14} />{pwLoading ? "Сохраняю…" : "Изменить пароль"}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}