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
import AdminWhatsNew from "./admin/AdminWhatsNew";
import AdminTkm from "./admin/AdminTkm";
import { WhatsNewEntry } from "@/components/WhatsNew";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

type Tab = "home" | "whats_new" | "staff" | "access" | "tkm" | "audit" | "password";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home",      label: "Главная",        icon: "Home" },
  { id: "whats_new", label: "Что нового",     icon: "Sparkles" },
  { id: "staff",     label: "Контакты РС ОИ", icon: "Users" },
  { id: "access",    label: "Доступы",        icon: "KeyRound" },
  { id: "tkm",       label: "ТКМ",            icon: "ClipboardList" },
  { id: "audit",     label: "Журнал изменений", icon: "ScrollText" },
  { id: "password",  label: "Мой пароль",     icon: "Shield" },
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

  // Whats new state
  const [whatsNew, setWhatsNew] = useState<WhatsNewEntry[]>([]);
  const [whatsNewSaving, setWhatsNewSaving] = useState(false);
  const [whatsNewSaved, setWhatsNewSaved] = useState(false);

  // Home links state
  const [links, setLinks] = useState<HomeLink[]>(DEFAULT_LINKS);
  const [linksSaving, setLinksSaving] = useState(false);
  const [linksSaved, setLinksSaved] = useState(false);

  // Staff state
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff);
  const [staffSaving, setStaffSaving] = useState(false);
  const [staffSaved, setStaffSaved] = useState(false);

  // TKM allowed list
  const [tkmAllowed, setTkmAllowed] = useState<string[]>([]);
  const [tkmSaving, setTkmSaving] = useState(false);
  const [tkmSaved, setTkmSaved] = useState(false);

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
      if (d.data?.whats_new) setWhatsNew(d.data.whats_new.map((e: WhatsNewEntry) => ({ ...e, id: e.id || `wn_${Math.random().toString(36).slice(2)}` })));
      if (d.data?.tkm_allowed) setTkmAllowed(d.data.tkm_allowed);
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
  const canEditWhatsNew = myNormRole === "super_admin";

  const logout = () => { playClickSound(); localStorage.clear(); navigate("/admin/login"); };

  const saveWhatsNew = async () => {
    setWhatsNewSaving(true);
    await authFetch(`${API}?action=save_site_data`, { method: "POST", body: JSON.stringify({ key: "whats_new", value: whatsNew }) });
    setWhatsNewSaving(false);
    setWhatsNewSaved(true);
    invalidateSiteCache();
    setTimeout(() => setWhatsNewSaved(false), 2200);
  };

  const updateWhatsNew = useCallback((i: number, field: keyof WhatsNewEntry, val: string | boolean) => {
    setWhatsNew(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  }, []);

  const removeWhatsNew = useCallback((i: number) => {
    setWhatsNew(prev => prev.filter((_, idx) => idx !== i));
  }, []);

  const reorderWhatsNew = useCallback((oldIndex: number, newIndex: number) => {
    setWhatsNew(prev => {
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  }, []);

  const addWhatsNew = useCallback(() => {
    const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }).replace(" г.", "");
    setWhatsNew(prev => [...prev, { id: `wn_${Date.now()}`, date: today, title: "", desc: "", link: "", linkLabel: "Перейти к разделу", linkExternal: false }]);
  }, []);

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

  const saveTkm = async (list: string[]) => {
    setTkmSaving(true);
    await authFetch(`${API}?action=save_site_data`, { method: "POST", body: JSON.stringify({ key: "tkm_allowed", value: list }) });
    setTkmAllowed(list);
    setTkmSaving(false);
    setTkmSaved(true);
    invalidateSiteCache();
    setTimeout(() => setTkmSaved(false), 2200);
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

  const editAccess = async (nick: string, data: { role?: Role; href?: string; hospital_role?: string }) => {
    const r = await authFetch(`${API}?action=update_access`, { method: "POST", body: JSON.stringify({ nickname: nick, ...data }) });
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

  const updateMember = useCallback((i: number, field: keyof StaffMember, val: string) => {
    setStaff(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  }, []);

  const removeMember = useCallback((i: number) => {
    setStaff(prev => prev.filter((_, idx) => idx !== i));
  }, []);

  const addMember = useCallback(() => {
    setStaff(prev => [...prev, { role: "", name: "", nickname: "", href: "", badge: "", badgeColor: "bg-zinc-700" }]);
  }, []);

  if (!me) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const visibleTabs = TABS.filter(t => {
    if (t.id === "staff") return canEditContacts;
    if (t.id === "tkm") return canEditContacts;
    return true;
  });

  const tabContent = (
    <>
      {tab === "home" && (
        <AdminHome links={links} linksSaving={linksSaving} linksSaved={linksSaved}
          onUpdateLink={updateLink} onRemoveLink={removeLink} onAddLink={addLink} onSaveLinks={saveLinks} />
      )}
      {tab === "whats_new" && (
        <AdminWhatsNew entries={whatsNew} saving={whatsNewSaving} saved={whatsNewSaved}
          canEdit={canEditWhatsNew} onUpdate={updateWhatsNew} onRemove={removeWhatsNew} onAdd={addWhatsNew} onSave={saveWhatsNew} onReorder={reorderWhatsNew} />
      )}
      {tab === "staff" && (
        <AdminStaff staff={staff} staffSaving={staffSaving} staffSaved={staffSaved}
          onUpdate={updateMember} onRemove={removeMember} onAdd={addMember} onSave={saveStaff} />
      )}
      {tab === "access" && (
        <AdminAccess me={me} accessUsers={accessUsers} accessLoading={accessLoading}
          newAccessNick={newAccessNick} setNewAccessNick={setNewAccessNick}
          newAccessRole={newAccessRole} setNewAccessRole={setNewAccessRole}
          newHospitalRole={newHospitalRole} setNewHospitalRole={setNewHospitalRole}
          accessMsg={accessMsg} tkmAllowed={tkmAllowed}
          onRefresh={loadAccess} onAdd={addAccess} onRemove={removeAccess} onEdit={editAccess}
          onSaveTkm={async (list) => { await saveTkm(list); }} />
      )}
      {tab === "tkm" && (
        <AdminTkm allowed={tkmAllowed} saving={tkmSaving} saved={tkmSaved} onSave={saveTkm} />
      )}
      {tab === "audit" && (
        <AdminAuditLog logs={auditLogs} loading={auditLoading} onRefresh={loadAudit} />
      )}
      {tab === "password" && (
        <AdminPassword pwCurrent={pwCurrent} setPwCurrent={setPwCurrent}
          pwNew={pwNew} setPwNew={setPwNew} pwConfirm={pwConfirm} setPwConfirm={setPwConfirm}
          pwMsg={pwMsg} pwLoading={pwLoading} onChangePassword={changePassword} />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-[Montserrat,sans-serif]">
      {/* Top bar */}
      <div className="border-b border-zinc-800 px-4 md:px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full shrink-0" />
          <span className="text-sm font-bold tracking-wide">Панель управления</span>
          <span className="text-xs uppercase tracking-widest text-zinc-500 hidden sm:block ml-1">· ЦГБ Невский</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-1">
            <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <Icon name="User" size={13} className="text-zinc-400" />
            </div>
            <div>
              <p className="text-xs font-semibold leading-none">vk.ru/{me.nickname}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5 tracking-wide">{ROLE_META[normalizeRole(me.role as string)]?.label ?? me.role}</p>
            </div>
          </div>
          <button
            onClick={() => { playClickSound(); navigate("/"); }}
            className="flex items-center gap-1.5 text-xs px-3 py-2 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          >
            <Icon name="Globe" size={13} />
            <span className="hidden sm:inline tracking-wide">На сайт</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs px-3 py-2 border border-red-800 bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition-colors"
          >
            <Icon name="LogOut" size={13} />
            <span className="hidden sm:inline tracking-wide">Выйти</span>
          </button>
        </div>
      </div>

      {/* Desktop layout: sidebar + content */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <aside className="w-56 border-r border-zinc-800 flex flex-col py-3 shrink-0 overflow-y-auto">
          {visibleTabs.map(t => (
            <button key={t.id} onClick={() => { playClickSound(); setTab(t.id); }}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors text-left ${tab === t.id ? "bg-zinc-800 text-white border-r-2 border-red-600 font-semibold" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}>
              <Icon name={t.icon as "Home"} size={16} className="shrink-0" />
              <span className="tracking-wide">{t.label}</span>
            </button>
          ))}
        </aside>
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {tabContent}
          </div>
        </main>
      </div>

      {/* Mobile layout: content + bottom nav */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          {tabContent}
        </main>
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 flex items-stretch">
          {visibleTabs.map(t => (
            <button key={t.id} onClick={() => { playClickSound(); setTab(t.id); }}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors min-w-0 ${tab === t.id ? "text-red-400 bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Icon name={t.icon as "Home"} size={18} className="shrink-0" />
              <span className="text-[9px] uppercase tracking-wide leading-tight truncate w-full text-center px-0.5">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}