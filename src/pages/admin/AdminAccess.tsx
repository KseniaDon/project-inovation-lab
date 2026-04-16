import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { Role, AccessUser } from "./adminTypes";

interface Props {
  me: { nickname: string; role: Role };
  isSuperAdmin: boolean;
  accessUsers: AccessUser[];
  accessLoading: boolean;
  newAccessNick: string;
  setNewAccessNick: (v: string) => void;
  newAccessRole: Role;
  setNewAccessRole: (v: Role) => void;
  accessMsg: string;
  onRefresh: () => void;
  onAdd: () => void;
  onRemove: (nick: string) => void;
}

export default function AdminAccess({
  me, isSuperAdmin,
  accessUsers, accessLoading,
  newAccessNick, setNewAccessNick,
  newAccessRole, setNewAccessRole,
  accessMsg,
  onRefresh, onAdd, onRemove,
}: Props) {
  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Управление</p>
          <h2 className="text-xl font-bold">Список доступов</h2>
          <p className="text-sm text-zinc-400 mt-1">Кто имеет доступ к панели управления</p>
        </div>
        <button onClick={() => { playClickSound(); onRefresh(); }} className="text-zinc-400 hover:text-white transition-colors shrink-0">
          <Icon name="RefreshCw" size={15} />
        </button>
      </div>

      {accessLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
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
                <button onClick={() => { playClickSound(); onRemove(u.nickname); }}
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
                <input
                  type="text"
                  placeholder="nickname"
                  value={newAccessNick}
                  onChange={e => setNewAccessNick(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && onAdd()}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white pl-12 pr-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors"
                />
              </div>
              <select
                value={newAccessRole}
                onChange={e => setNewAccessRole(e.target.value as Role)}
                className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors"
              >
                <option value="editor">Редактор</option>
                <option value="super_admin">Гл. Адм.</option>
              </select>
            </div>
            {accessMsg && (
              <p className={`text-xs ${accessMsg.includes("!") ? "text-green-400" : "text-red-400"}`}>{accessMsg}</p>
            )}
            <button
              onClick={() => { playClickSound(); onAdd(); }}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors"
            >
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
  );
}
