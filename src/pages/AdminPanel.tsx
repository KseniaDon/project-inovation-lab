import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

import {
  Role, Tab, AccessUser,
  Section, StaffMember, Command, Floor, Department, CharterDoc, Report,
  HeroData, AbbrItem, RadioCommand, RadioRule, IntroData, InternExam, SimplePageData,
  defaultHero, defaultSections, defaultStaff, defaultCommands, defaultFloors,
  defaultDepartments, defaultCharter, defaultOathLines, defaultMaleReports,
  defaultFemaleReports, defaultSchedule, defaultAbbr, defaultRadioCommands,
  defaultRadioRules, defaultActivityData, defaultIntroData, defaultInternExam,
  defaultBindsPage, defaultReportPage, defaultMisPage, defaultEvidencePage, defaultFeldsherPage,
} from "./admin/adminTypes";
import AdminSiteContent from "./admin/AdminSiteContent";
import AdminAccessPassword from "./admin/AdminAccessPassword";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

const ALL_TABS: { id: Tab; label: string; icon: string; superOnly?: boolean }[] = [
  { id: "hero",           label: "Главная",      icon: "Home",          superOnly: true },
  { id: "staff",          label: "Состав",       icon: "Users",         superOnly: true },
  { id: "intro",          label: "Вступление",   icon: "Flag",          superOnly: true },
  { id: "intern_exam",    label: "Интерн",       icon: "GraduationCap", superOnly: true },
  { id: "binds_page",     label: "Бинды",        icon: "Keyboard",      superOnly: true },
  { id: "report_page",    label: "Что дальше?",  icon: "ArrowRight",    superOnly: true },
  { id: "evidence_page",  label: "Доказат.",     icon: "Camera",        superOnly: true },
  { id: "mis_page",       label: "МИС",          icon: "MonitorCheck",  superOnly: true },
  { id: "feldsher_page",  label: "Фельдшер",     icon: "Stethoscope",   superOnly: true },
  { id: "sections",       label: "Обучение",     icon: "BookOpen" },
  { id: "commands",       label: "Команды",      icon: "Terminal",      superOnly: true },
  { id: "radio",          label: "Рация",        icon: "Radio",         superOnly: true },
  { id: "reports",        label: "Доклады",      icon: "Megaphone",     superOnly: true },
  { id: "abbr",           label: "Аббревиат.",   icon: "BookOpen",      superOnly: true },
  { id: "schedule",       label: "Расписание",   icon: "Calendar",      superOnly: true },
  { id: "floors",         label: "Этажи",        icon: "Building2",     superOnly: true },
  { id: "activity",       label: "ЖА",           icon: "ClipboardList", superOnly: true },
  { id: "departments",    label: "Отделения",    icon: "Network",       superOnly: true },
  { id: "charter",        label: "Уставы",       icon: "ScrollText",    superOnly: true },
  { id: "oath",           label: "Клятва",       icon: "Star",          superOnly: true },
  { id: "access",         label: "Доступы",      icon: "Shield",        superOnly: true },
  { id: "password",       label: "Мой пароль",   icon: "KeyRound" },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ nickname: string; role: Role } | null>(null);
  const [tab, setTab] = useState<Tab>(localStorage.getItem("admin_role") === "editor" ? "sections" : "hero");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState("/");
  const [mobilePreview, setMobilePreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Site content state
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [staff, setStaff] = useState<StaffMember[]>(defaultStaff);
  const [commands, setCommands] = useState<Command[]>(defaultCommands);
  const [floors, setFloors] = useState<Floor[]>(defaultFloors);
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [charter, setCharter] = useState<CharterDoc[]>(defaultCharter);
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [oathLines, setOathLines] = useState<string[]>(defaultOathLines);
  const [maleReports, setMaleReports] = useState<Report[]>(defaultMaleReports);
  const [femaleReports, setFemaleReports] = useState<Report[]>(defaultFemaleReports);
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [abbr, setAbbr] = useState<AbbrItem[]>(defaultAbbr);
  const [radioCommands, setRadioCommands] = useState<RadioCommand[]>(defaultRadioCommands);
  const [radioRules, setRadioRules] = useState<RadioRule[]>(defaultRadioRules);
  const [activityData, setActivityData] = useState(defaultActivityData);
  const [introData, setIntroData] = useState<IntroData>(defaultIntroData);
  const [internExam, setInternExam] = useState<InternExam>(defaultInternExam);
  const [bindsPage, setBindsPage] = useState<SimplePageData>(defaultBindsPage);
  const [reportPage, setReportPage] = useState<SimplePageData>(defaultReportPage);
  const [misPage, setMisPage] = useState<SimplePageData>(defaultMisPage);
  const [evidencePage, setEvidencePage] = useState<SimplePageData>(defaultEvidencePage);
  const [feldsherPage, setFeldsherPage] = useState<SimplePageData>(defaultFeldsherPage);

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
    toast.success("Сохранено", { description: "Изменения опубликованы на сайте", duration: 2500 });
    iframeRef.current?.contentWindow?.postMessage("site_data_updated", "*");
  };

  // Выбор страницы превью по вкладке
  const getPreviewPage = (t: Tab): string => {
    if (t === "hero" || t === "staff") return "/";
    if (t === "sections" || t === "intro" || t === "intern_exam" || t === "commands" ||
        t === "radio" || t === "reports" || t === "abbr" || t === "schedule" ||
        t === "floors" || t === "activity" || t === "departments" || t === "charter" || t === "oath" ||
        t === "binds_page" || t === "report_page" || t === "mis_page" || t === "evidence_page" || t === "feldsher_page") return "/learn";
    return "/";
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
      if (d.data.abbr) setAbbr(d.data.abbr);
      if (d.data.radio_commands) setRadioCommands(d.data.radio_commands);
      if (d.data.radio_rules) setRadioRules(d.data.radio_rules);
      if (d.data.activity) setActivityData(d.data.activity);
      if (d.data.intro_data) setIntroData(d.data.intro_data);
      if (d.data.intern_exam) setInternExam(d.data.intern_exam);
      if (d.data.binds_page) setBindsPage(d.data.binds_page);
      if (d.data.report_page) setReportPage(d.data.report_page);
      if (d.data.mis_page) setMisPage(d.data.mis_page);
      if (d.data.evidence_page) setEvidencePage(d.data.evidence_page);
      if (d.data.feldsher_page) setFeldsherPage(d.data.feldsher_page);
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

  const handleTabChange = (t: Tab) => {
    playClickSound();
    setTab(t);
    setPreviewPage(getPreviewPage(t));
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
          {/* Кнопка превью */}
          <button
            onClick={() => { playClickSound(); setShowPreview(v => !v); }}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border transition-colors ${showPreview ? "border-red-600 text-red-400 bg-red-600/10" : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"}`}
          >
            <Icon name={showPreview ? "EyeOff" : "Eye"} size={13} />
            <span className="hidden sm:inline">{showPreview ? "Скрыть превью" : "Превью сайта"}</span>
          </button>
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
        {/* Sidebar — скрыт на мобильных в режиме превью */}
        <aside className={`w-14 md:w-52 border-r border-zinc-800 flex flex-col py-2 shrink-0 overflow-y-auto ${showPreview ? "hidden sm:flex" : "flex"}`}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${tab === t.id ? "bg-zinc-800 text-white border-r-2 border-red-600" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}>
              <Icon name={t.icon as "Home"} size={15} className="shrink-0" />
              <span className="hidden md:block text-sm">{t.label}</span>
            </button>
          ))}
        </aside>

        {/* Content — скрыт на мобильных в режиме превью */}
        <main className={`overflow-y-auto p-5 md:p-8 ${showPreview ? "hidden sm:block w-full sm:w-[420px] sm:shrink-0" : "flex-1"}`}>
          <AdminSiteContent
            tab={tab}
            saved={saved}
            saving={saving}
            saveBlock={saveBlock}
            hero={hero} setHero={setHero}
            staff={staff} setStaff={setStaff}
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
            abbr={abbr} setAbbr={setAbbr}
            radioCommands={radioCommands} setRadioCommands={setRadioCommands}
            radioRules={radioRules} setRadioRules={setRadioRules}
            activityData={activityData} setActivityData={setActivityData}
            introData={introData} setIntroData={setIntroData}
            internExam={internExam} setInternExam={setInternExam}
            bindsPage={bindsPage} setBindsPage={setBindsPage}
            reportPage={reportPage} setReportPage={setReportPage}
            misPage={misPage} setMisPage={setMisPage}
            evidencePage={evidencePage} setEvidencePage={setEvidencePage}
            feldsherPage={feldsherPage} setFeldsherPage={setFeldsherPage}
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

        {/* Live Preview iframe */}
        {showPreview && (
          <div className="flex-1 flex flex-col border-l border-zinc-800 bg-zinc-900 min-w-0">
            {/* Preview топбар */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 flex items-center gap-2 bg-zinc-800 rounded px-3 py-1 text-xs text-zinc-400 font-mono">
                <Icon name="Globe" size={11} className="shrink-0" />
                <span className="truncate">{window.location.origin}{previewPage}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                {["/", "/learn", "/contacts"].map(p => (
                  <button
                    key={p}
                    onClick={() => setPreviewPage(p)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${previewPage === p ? "bg-red-600 text-white" : "text-zinc-500 hover:text-white"}`}
                  >
                    {p === "/" ? "Главная" : p === "/learn" ? "Обучение" : "Контакты"}
                  </button>
                ))}
                <button
                  onClick={() => setMobilePreview(v => !v)}
                  className={`transition-colors p-1 ${mobilePreview ? "text-red-400" : "text-zinc-500 hover:text-white"}`}
                  title={mobilePreview ? "Десктоп" : "Мобильный"}
                >
                  <Icon name={mobilePreview ? "Monitor" : "Smartphone"} size={12} />
                </button>
                <button
                  onClick={() => { iframeRef.current?.contentWindow?.location.reload(); }}
                  className="text-zinc-500 hover:text-white transition-colors p-1"
                  title="Обновить"
                >
                  <Icon name="RefreshCw" size={12} />
                </button>
              </div>
            </div>
            {/* iframe */}
            <div className={`flex-1 overflow-auto ${mobilePreview ? "flex justify-center bg-zinc-950 py-4" : ""}`}>
              <iframe
                ref={iframeRef}
                src={previewPage}
                className="bg-white h-full"
                style={mobilePreview ? { width: 390, minHeight: "100%", height: "auto", borderRadius: 12, border: "1px solid #3f3f46" } : { width: "100%", height: "100%" }}
                title="Превью сайта"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}