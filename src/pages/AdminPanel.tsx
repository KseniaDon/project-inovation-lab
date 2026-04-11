import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

import {
  Role, Tab, AccessUser,
  HeroData, Section, StaffMember, Command, Floor, Department, CharterDoc, Report,
  defaultHero, defaultSections, defaultStaff, defaultCommands, defaultFloors,
  defaultDepartments, defaultCharter, defaultOathLines, defaultMaleReports,
  defaultFemaleReports, defaultSchedule,
} from "./admin/adminTypes";
import AdminSiteContent from "./admin/AdminSiteContent";
import AdminAccessPassword from "./admin/AdminAccessPassword";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

const ALL_TABS: { id: Tab; label: string; icon: string; superOnly?: boolean }[] = [
  { id: "hero",        label: "Главная",     icon: "Home",          superOnly: true },
  { id: "staff",       label: "Состав",      icon: "Users",         superOnly: true },
  { id: "sections",    label: "Обучение",    icon: "BookOpen" },
  { id: "commands",    label: "Команды",     icon: "Terminal",      superOnly: true },
  { id: "schedule",    label: "Расписание",  icon: "Calendar",      superOnly: true },
  { id: "floors",      label: "Этажи",       icon: "Building2",     superOnly: true },
  { id: "departments", label: "Отделения",   icon: "Network",       superOnly: true },
  { id: "charter",     label: "Уставы",      icon: "ScrollText",    superOnly: true },
  { id: "oath",        label: "Клятва",      icon: "GraduationCap", superOnly: true },
  { id: "reports",     label: "Доклады",     icon: "Megaphone",     superOnly: true },
  { id: "access",      label: "Доступы",     icon: "Shield",        superOnly: true },
  { id: "password",    label: "Мой пароль",  icon: "KeyRound" },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ nickname: string; role: Role } | null>(null);
  const [tab, setTab] = useState<Tab>(localStorage.getItem("admin_role") === "editor" ? "sections" : "hero");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Site content state
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff);
  const [commands, setCommands] = useState<Command[]>(defaultCommands);
  const [floors, setFloors] = useState<Floor[]>(defaultFloors);
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [charter, setCharter] = useState<CharterDoc[]>(defaultCharter);
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [editStaffIdx, setEditStaffIdx] = useState<number | null>(null);
  const [oathLines, setOathLines] = useState<string[]>(defaultOathLines);
  const [maleReports, setMaleReports] = useState<Report[]>(defaultMaleReports);
  const [femaleReports, setFemaleReports] = useState<Report[]>(defaultFemaleReports);
  const [schedule, setSchedule] = useState(defaultSchedule);

  // Access state
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [newAccessNick, setNewAccessNick] = useState("");
  const [newAccessRole, setNewAccessRole] = useState<Role>("editor");
  const [accessMsg, setAccessMsg] = useState("");

  // Password state
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

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

  const isSuperAdmin = me?.role === "super_admin";
  const TABS = ALL_TABS.filter(t => !t.superOnly || isSuperAdmin);

  if (!me) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
          <AdminSiteContent
            tab={tab}
            saved={saved}
            saving={saving}
            saveBlock={saveBlock}
            hero={hero} setHero={setHero}
            staff={staff} setStaff={setStaff}
            editStaffIdx={editStaffIdx} setEditStaffIdx={setEditStaffIdx}
            sections={sections} setSections={setSections}
            newItem={newItem} setNewItem={setNewItem}
            commands={commands} setCommands={setCommands}
            schedule={schedule} setSchedule={setSchedule}
            floors={floors} setFloors={setFloors}
            departments={departments} setDepartments={setDepartments}
            charter={charter} setCharter={setCharter}
            oathLines={oathLines} setOathLines={setOathLines}
            maleReports={maleReports} setMaleReports={setMaleReports}
            femaleReports={femaleReports} setFemaleReports={setFemaleReports}
          />
          <AdminAccessPassword
            tab={tab}
            me={me}
            isSuperAdmin={isSuperAdmin}
            authFetch={authFetch}
            accessUsers={accessUsers}
            accessLoading={accessLoading}
            newAccessNick={newAccessNick} setNewAccessNick={setNewAccessNick}
            newAccessRole={newAccessRole} setNewAccessRole={setNewAccessRole}
            accessMsg={accessMsg} setAccessMsg={setAccessMsg}
            loadAccess={loadAccess}
            pwCurrent={pwCurrent} setPwCurrent={setPwCurrent}
            pwNew={pwNew} setPwNew={setPwNew}
            pwConfirm={pwConfirm} setPwConfirm={setPwConfirm}
            pwMsg={pwMsg} setPwMsg={setPwMsg}
            pwLoading={pwLoading} setPwLoading={setPwLoading}
          />
        </main>
      </div>
    </div>
  );
}
