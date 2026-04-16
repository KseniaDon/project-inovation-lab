import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

import { Role, AccessUser } from "./admin/adminTypes";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

type Tab = "home" | "staff" | "access" | "password";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home",     label: "Главная",         icon: "Home" },
  { id: "staff",    label: "Контакты РС ОИ", icon: "Users" },
  { id: "access",   label: "Доступы",         icon: "Shield" },
  { id: "password", label: "Мой пароль",      icon: "KeyRound" },
];

const HOME_LINKS: { title: string; desc: string; href: string; icon: string }[] = [
  {
    title: "Медицинская информационная система (МИС «Здоровье»)",
    desc: "Для проверки работы сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/1bFmfSAkaK7AiDpBfUQq0Gu8Iy047_2FUTCB0_sof6sU/edit#response=ACYDBNgCstyyo1UxDgpGbcvFOo6CjTUfrZ_HeNE3rOccl21kj2CqhFAJo5nL9CwI9Espcm0",
    icon: "MonitorCheck",
  },
  {
    title: "Информационный раздел Отделения Интернатуры",
    desc: "Для проверки заявлений на повышение и допуск сотрудников ОИ.",
    href: "https://forum.gtaprovince.ru/topic/995718-cgb-g-nevskiy-informacionnyy-razdel-otdeleniya-internatury/",
    icon: "FileText",
  },
  {
    title: "Система отработки наказаний",
    desc: "Для проверки отчётов отработки наказаний сотрудников ОИ.",
    href: "https://forum.gtaprovince.ru/topic/995714-cgb-g-nevskiy-sistema-otrabotki-nakazaniy/",
    icon: "ClipboardList",
  },
  {
    title: "Теоретический Квалификационный Модуль (ТКМ)",
    desc: "Для проходящих экзамен сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdB429Yr16E5rsm-MMxd4BtE3zq9Bxk-urv7pHDhV8iByU4yQ/viewform",
    icon: "GraduationCap",
  },
  {
    title: "Теоретический Квалификационный Модуль (ТКМ) — результаты",
    desc: "Для проверки результатов прохождения сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/1iZIIxc36mxKpBi-rilgO2VtEt7TrEle0mxrRcp_oDVU/edit",
    icon: "ClipboardCheck",
  },
];

type StaffMember = { role: string; name: string; nickname: string; href: string; badge: string; badgeColor: string };

const defaultStaff: StaffMember[] = [
  { role: "Куратор Отделения Интернатуры", name: "Ksenia Donskaya", nickname: "Ksenia_Donskaya", href: "https://vk.ru/soul__shu", badge: "Куратор", badgeColor: "bg-red-600" },
  { role: "Заместитель Заведующего ОИ", name: "Egor Maslow", nickname: "Egor_Maslow", href: "https://vk.ru/cccuvigon", badge: "Зам. Зав.", badgeColor: "bg-zinc-700" },
  { role: "Заместитель Заведующего ОИ", name: "Andrei Schmidt", nickname: "Andrei_Schmidt", href: "https://vk.com/id392167605", badge: "Зам. Зав.", badgeColor: "bg-zinc-700" },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ nickname: string; role: Role } | null>(null);
  const [tab, setTab] = useState<Tab>("home");

  // Staff state
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff);
  const [staffSaving, setStaffSaving] = useState(false);
  const [staffSaved, setStaffSaved] = useState(false);

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
      if (d.data?.staff) setStaff(d.data.staff);
    });
  }, [me, authFetch]);

  const loadAccess = useCallback(() => {
    setAccessLoading(true);
    authFetch(`${API}?action=access_list`).then(r => r.json()).then(d => {
      if (d.users) setAccessUsers(d.users);
    }).finally(() => setAccessLoading(false));
  }, [authFetch]);

  useEffect(() => { if (tab === "access" && me) loadAccess(); }, [tab, me, loadAccess]);

  const isSuperAdmin = me?.role === "super_admin";
  const logout = () => { playClickSound(); localStorage.clear(); navigate("/admin/login"); };

  const saveStaff = async () => {
    setStaffSaving(true);
    await authFetch(`${API}?action=save_site_data`, { method: "POST", body: JSON.stringify({ key: "staff", value: staff }) });
    setStaffSaving(false);
    setStaffSaved(true);
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

          {/* ── ГЛАВНАЯ ── */}
          {tab === "home" && (
            <div className="max-w-2xl flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Панель управления</p>
                <h2 className="text-2xl font-bold">Добро пожаловать, дорогое руководство ОИ!</h2>
              </div>
              <div className="flex flex-col gap-3">
                {HOME_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClickSound}
                    className="group flex items-start justify-between gap-4 border border-zinc-800 hover:border-red-600/60 transition-all duration-300 px-4 py-4 overflow-hidden"
                  >
                    <div className="flex items-stretch gap-0">
                      <div className="w-1 shrink-0 bg-red-600 group-hover:w-1.5 transition-all duration-300 mr-4 rounded-sm" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-red-400 font-semibold leading-snug">{link.title}</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">{link.desc}</p>
                      </div>
                    </div>
                    <Icon name="ExternalLink" size={15} className="text-zinc-600 group-hover:text-red-400 transition-colors duration-300 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── КОНТАКТЫ РС ОИ ── */}
          {tab === "staff" && (
            <div className="max-w-2xl flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Управление</p>
                <h2 className="text-xl font-bold">Контакты РС ОИ</h2>
                <p className="text-sm text-zinc-400 mt-1">Изменения мгновенно отображаются на странице контактов.</p>
              </div>

              <div className="flex flex-col gap-4">
                {staff.map((member, i) => (
                  <div key={i} className="border border-zinc-800 p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs uppercase tracking-widest text-zinc-500">Сотрудник {i + 1}</p>
                      <button onClick={() => removeMember(i)} className="text-zinc-600 hover:text-red-500 transition-colors">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500">Должность</label>
                        <input
                          value={member.role}
                          onChange={e => updateMember(i, "role", e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                          placeholder="Куратор Отделения Интернатуры"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500">Имя (отображается)</label>
                        <input
                          value={member.name}
                          onChange={e => updateMember(i, "name", e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                          placeholder="Ivan Petrov"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500">Ник VK (без vk.ru/)</label>
                        <input
                          value={member.nickname}
                          onChange={e => updateMember(i, "nickname", e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                          placeholder="ivan_petrov"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500">Ссылка VK (полная)</label>
                        <input
                          value={member.href}
                          onChange={e => updateMember(i, "href", e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                          placeholder="https://vk.ru/ivan_petrov"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500">Бейдж (текст)</label>
                        <input
                          value={member.badge}
                          onChange={e => updateMember(i, "badge", e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                          placeholder="Куратор"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500">Цвет бейджа (CSS класс)</label>
                        <select
                          value={member.badgeColor}
                          onChange={e => updateMember(i, "badgeColor", e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                        >
                          <option value="bg-red-600">Красный (Куратор)</option>
                          <option value="bg-zinc-700">Серый (Зам. Зав.)</option>
                          <option value="bg-blue-700">Синий</option>
                          <option value="bg-orange-600">Оранжевый</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { playClickSound(); addMember(); }}
                  className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  <Icon name="Plus" size={13} />Добавить сотрудника
                </button>
                <button
                  onClick={() => { playClickSound(); saveStaff(); }}
                  disabled={staffSaving}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors ${staffSaved ? "bg-green-700 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}
                >
                  <Icon name={staffSaved ? "Check" : "Save"} size={13} />
                  {staffSaving ? "Сохранение..." : staffSaved ? "Сохранено" : "Сохранить"}
                </button>
              </div>
            </div>
          )}

          {/* ── ДОСТУПЫ ── */}
          {tab === "access" && (
            <div className="max-w-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Управление</p>
                  <h2 className="text-xl font-bold">Список доступов</h2>
                  <p className="text-sm text-zinc-400 mt-1">Кто имеет доступ к панели управления</p>
                </div>
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
                      {isSuperAdmin && u.nickname !== me.nickname && (
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
                    <p><span className="text-zinc-300 font-semibold">Редактор</span> — только свой пароль</p>
                    <p className="mt-1 text-zinc-600">Новый пользователь установит пароль при первом входе</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── МОЙ ПАРОЛЬ ── */}
          {tab === "password" && (
            <div className="max-w-md">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Управление</p>
                <h2 className="text-xl font-bold">Мой пароль</h2>
                <p className="text-sm text-zinc-400 mt-1">Смена пароля для входа в панель</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Текущий пароль</label>
                  <input type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Новый пароль</label>
                  <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Повторите новый пароль</label>
                  <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && changePassword()}
                    className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                </div>
                {pwMsg && (
                  <p className={`text-sm ${pwMsg.includes("успешно") ? "text-green-400" : "text-red-400"}`}>{pwMsg}</p>
                )}
                <button onClick={() => { playClickSound(); changePassword(); }} disabled={pwLoading}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors">
                  {pwLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Icon name="KeyRound" size={13} />}
                  Изменить пароль
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}