import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { invalidateSiteCache } from "@/hooks/useSiteData";

import { Role, AccessUser, ROLE_META, normalizeRole } from "./admin/adminTypes";
import AdminHome, { HomeLink, DEFAULT_LINKS } from "./admin/AdminHome";
import AdminStaff, { StaffMember } from "./admin/AdminStaff";
import AdminAccess, { HospitalRole } from "./admin/AdminAccess";
import AdminPassword from "./admin/AdminPassword";
import AdminAuditLog, { AuditEntry } from "./admin/AdminAuditLog";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

type Tab = "home" | "staff" | "access" | "audit" | "password";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home",     label: "Главная",        icon: "Home" },
  { id: "staff",    label: "Контакты РС ОИ", icon: "Users" },
  { id: "access",   label: "Доступы",        icon: "Shield" },
  { id: "audit",    label: "Журнал Аудита",  icon: "ClipboardList" },
  { id: "password", label: "Мой пароль",     icon: "KeyRound" },
];

const defaultStaff: StaffMember[] = [
  { role: "Куратор Отделения Интернатуры", name: "Ksenia Donskaya", nickname: "Ksenia_Donskaya", href: "https://vk.ru/soul__shu", badge: "Куратор", badgeColor: "bg-red-600" },
  { role: "Заместитель Заведующего ОИ", name: "Egor Maslow", nickname: "Egor_Maslow", href: "https://vk.ru/cccuvigon", badge: "Зам. Зав.", badgeColor: "bg-zinc-700" },
  { role: "Заместитель Заведующего ОИ", name: "Andrei Schmidt", nickname: "Andrei_Schmidt", href: "https://vk.com/id392167605", badge: "Зам. Зав.", badgeColor: "bg-zinc-700" },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ nickname: string; role: Role } | null>(null);
  const [tab, setTab] = useState<Tab>("home");

  // Home links state
  const [links, setLinks] = useState<HomeLink[]>(DEFAULT_LINKS);
  const [linksSaving, setLinksSaving] = useState(false);
  const [linksSaved, setLinksSaved] = useState(false);

  // Staff state
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff);
  const [staffSaving, setStaffSaving] = useState(false);
  const [staffSaved, setStaffSaved] = useState(false);

  // Access state
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);
  const [newAccessNick, setNewAccessNick] = useState("");
  const [newAccessRole, setNewAccessRole] = useState<Role>("editor");
  const [newHospitalRole, setNewHospitalRole] = useState<HospitalRole>("Нет");
  const [accessMsg, setAccessMsg] = useState("");

  // Audit log state
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Password state
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const token = () => localStorage.getItem("admin_token") || "";
  const authFetch = useCallback((url: string, opts?: RequestInit) =>
    fetch(url, { ...opts, headers: { ...(opts?.headers || {}), "X-Authorization": `Bearer ${token()}`, "Content-Type": "application/json" } }), []);

  useEffect(() => {
    const t = token();
    const nick = localStorage.getItem("admin_nickname");
    const role = localStorage.getItem("admin_role") as Role | null;
    if (!t || !nick || !role) { navigate("/admin/login"); return; }
    setMe({ nickname: nick, role });
    authFetch(`${API}?action=me`)
      .then(r => r.json())
      .then(d => {
        if (d.nickname) setMe({ nickname: d.nickname, role: d.role });
        else if (d.error === "Unauthorized") { localStorage.clear(); navigate("/admin/login"); }
      })
      .catch(() => {});
  }, [navigate, authFetch]);

  useEffect(() => {
    if (!me) return;
    authFetch(`${API}?action=site_data`).then(r => r.json()).then(d => {
      if (d.data?.staff) setStaff(d.data.staff);
      if (d.data?.home_links) setLinks(d.data.home_links);
    });
  }, [me, authFetch]);

  const loadAccess = useCallback(() => {
    setAccessLoading(true);
    authFetch(`${API}?action=access_list`).then(r => r.json()).then(d => {
      if (d.users) setAccessUsers(d.users);
    }).finally(() => setAccessLoading(false));
  }, [authFetch]);

  const loadAudit = useCallback(() => {
    setAuditLoading(true);
    authFetch(`${API}?action=audit_log`).then(r => r.json()).then(d => {
      if (d.logs) setAuditLogs(d.logs);
    }).finally(() => setAuditLoading(false));
  }, [authFetch]);

  useEffect(() => { if (tab === "access" && me) loadAccess(); }, [tab, me, loadAccess]);
  useEffect(() => { if (tab === "audit" && me) loadAudit(); }, [tab, me, loadAudit]);

  const myNormRole = me ? normalizeRole(me.role as string) : "editor";
  const canEditContacts = ["super_admin", "head_admin", "admin"].includes(myNormRole);

  const logout = () => { playClickSound(); localStorage.clear(); navigate("/admin/login"); };

  const saveLinks = async () => {
    setLinksSaving(true);
    await authFetch(`${API}?action=save_site_data`, { method: "POST", body: JSON.stringify({ key: "home_links", value: links }) });
    setLinksSaving(false);
    setLinksSaved(true);
    setTimeout(() => setLinksSaved(false), 2200);
  };

  const updateLink = (i: number, field: keyof HomeLink, val: string) => {
    setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  };

  const removeLink = (i: number) => {
    setLinks(prev => prev.filter((_, idx) => idx !== i));
  };

  const addLink = () => {
    setLinks(prev => [...prev, { title: "", desc: "", href: "" }]);
  };

  const saveStaff = async () => {
    setStaffSaving(true);
    await authFetch(`${API}?action=save_site_data`, { method: "POST", body: JSON.stringify({ key: "staff", value: staff }) });
    setStaffSaving(false);
    setStaffSaved(true);
    invalidateSiteCache();
    setTimeout(() => setStaffSaved(false), 2200);
  };

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
    const checkR = await fetch(`${API}?action=login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: me!.nickname, password: pwCurrent }),
    });
    const checkD = await checkR.json();
    if (!checkD.token) { setPwMsg("Неверный текущий пароль"); setPwLoading(false); return; }
    const r = await authFetch(`${API}?action=set_password`, { method: "POST", body: JSON.stringify({ nickname: me!.nickname, password: pwNew }) });
    const d = await r.json();
    if (d.ok) { setPwMsg("Пароль успешно изменён!"); setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
    else setPwMsg(d.error || "Ошибка");
    setPwLoading(false);
  };

  const updateMember = (i: number, field: keyof StaffMember, val: string) => {
    setStaff(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  };

  const removeMember = (i: number) => {
    setStaff(prev => prev.filter((_, idx) => idx !== i));
  };

  const addMember = () => {
    setStaff(prev => [...prev, { role: "", name: "", nickname: "", href: "", badge: "", badgeColor: "bg-zinc-700" }]);
  };

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
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <Icon name="User" size={13} className="text-zinc-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-none">vk.ru/{me.nickname}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{me ? (ROLE_META[normalizeRole(me.role as string)]?.label ?? me.role) : ""}</p>
            </div>
          </div>
          <button
            onClick={() => { playClickSound(); navigate("/"); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          >
            <Icon name="Globe" size={13} />
            <span className="hidden sm:inline">На сайт</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-800 bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition-colors"
          >
            <Icon name="LogOut" size={13} />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-14 md:w-52 border-r border-zinc-800 flex flex-col py-2 shrink-0 overflow-y-auto">
          {TABS.filter(t => t.id !== "staff" || canEditContacts).map(t => (
            <button key={t.id} onClick={() => { playClickSound(); setTab(t.id); }}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${tab === t.id ? "bg-zinc-800 text-white border-r-2 border-red-600" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}>
              <Icon name={t.icon as "Home"} size={15} className="shrink-0" />
              <span className="hidden md:block text-sm">{t.label}</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {tab === "home" && (
            <AdminHome
              links={links}
              linksSaving={linksSaving}
              linksSaved={linksSaved}
              onUpdateLink={updateLink}
              onRemoveLink={removeLink}
              onAddLink={addLink}
              onSaveLinks={saveLinks}
            />
          )}

          {tab === "staff" && (
            <AdminStaff
              staff={staff}
              staffSaving={staffSaving}
              staffSaved={staffSaved}
              onUpdate={updateMember}
              onRemove={removeMember}
              onAdd={addMember}
              onSave={saveStaff}
            />
          )}

          {tab === "access" && (
            <AdminAccess
              me={me}
              accessUsers={accessUsers}
              accessLoading={accessLoading}
              newAccessNick={newAccessNick}
              setNewAccessNick={setNewAccessNick}
              newAccessRole={newAccessRole}
              setNewAccessRole={setNewAccessRole}
              newHospitalRole={newHospitalRole}
              setNewHospitalRole={setNewHospitalRole}
              accessMsg={accessMsg}
              onRefresh={loadAccess}
              onAdd={addAccess}
              onRemove={removeAccess}
            />
          )}

          {tab === "audit" && (
            <AdminAuditLog
              logs={auditLogs}
              loading={auditLoading}
              onRefresh={loadAudit}
            />
          )}

          {tab === "password" && (
            <AdminPassword
              pwCurrent={pwCurrent}
              setPwCurrent={setPwCurrent}
              pwNew={pwNew}
              setPwNew={setPwNew}
              pwConfirm={pwConfirm}
              setPwConfirm={setPwConfirm}
              pwMsg={pwMsg}
              pwLoading={pwLoading}
              onChangePassword={changePassword}
            />
          )}
        </main>
      </div>
    </div>
  );
}