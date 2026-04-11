import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { SaveBtn, Field, SectionHeader } from "./adminHelpers";
import { Role, AccessUser } from "./adminTypes";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

interface Props {
  tab: string;
  me: { nickname: string; role: Role };
  isSuperAdmin: boolean;
  authFetch: (url: string, opts?: RequestInit) => Promise<Response>;

  // access
  accessUsers: AccessUser[];
  accessLoading: boolean;
  newAccessNick: string;
  setNewAccessNick: React.Dispatch<React.SetStateAction<string>>;
  newAccessRole: Role;
  setNewAccessRole: React.Dispatch<React.SetStateAction<Role>>;
  accessMsg: string;
  setAccessMsg: React.Dispatch<React.SetStateAction<string>>;
  loadAccess: () => void;

  // password
  pwCurrent: string;
  setPwCurrent: React.Dispatch<React.SetStateAction<string>>;
  pwNew: string;
  setPwNew: React.Dispatch<React.SetStateAction<string>>;
  pwConfirm: string;
  setPwConfirm: React.Dispatch<React.SetStateAction<string>>;
  pwMsg: string;
  setPwMsg: React.Dispatch<React.SetStateAction<string>>;
  pwLoading: boolean;
  setPwLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminAccessPassword({
  tab, me, isSuperAdmin, authFetch,
  accessUsers, accessLoading,
  newAccessNick, setNewAccessNick,
  newAccessRole, setNewAccessRole,
  accessMsg, setAccessMsg,
  loadAccess,
  pwCurrent, setPwCurrent,
  pwNew, setPwNew,
  pwConfirm, setPwConfirm,
  pwMsg, setPwMsg,
  pwLoading, setPwLoading,
}: Props) {

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
      body: JSON.stringify({ nickname: me.nickname, password: pwCurrent }),
    });
    const checkD = await checkR.json();
    if (!checkD.token) { setPwMsg("Неверный текущий пароль"); setPwLoading(false); return; }
    const r = await authFetch(`${API}?action=set_password`, { method: "POST", body: JSON.stringify({ nickname: me.nickname, password: pwNew }) });
    const d = await r.json();
    if (d.ok) { setPwMsg("Пароль успешно изменён!"); setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
    else setPwMsg(d.error || "Ошибка");
    setPwLoading(false);
  };

  return (
    <>
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
    </>
  );
}
