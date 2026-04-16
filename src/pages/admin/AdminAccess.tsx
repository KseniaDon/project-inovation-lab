import { useState } from "react";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { Role, AccessUser, ROLE_HIERARCHY, ROLE_META, canManage, canAddUsers, normalizeRole } from "./adminTypes";

export const HOSPITAL_ROLES = ["Нет", "ГВ", "КОИ", "ЗОИ", "ЗЗОИ"] as const;
export type HospitalRole = typeof HOSPITAL_ROLES[number];

interface EditState {
  role: Role;
  href: string;
  hospital_role: string;
}

interface Props {
  me: { nickname: string; role: Role };
  accessUsers: AccessUser[];
  accessLoading: boolean;
  newAccessNick: string;
  setNewAccessNick: (v: string) => void;
  newAccessRole: Role;
  setNewAccessRole: (v: Role) => void;
  newHospitalRole: HospitalRole;
  setNewHospitalRole: (v: HospitalRole) => void;
  accessMsg: string;
  onRefresh: () => void;
  onAdd: () => void;
  onRemove: (nick: string) => void;
  onEdit: (nick: string, data: { role?: Role; href?: string; hospital_role?: string }) => Promise<void>;
}

export default function AdminAccess({
  me,
  accessUsers, accessLoading,
  newAccessNick, setNewAccessNick,
  newAccessRole, setNewAccessRole,
  newHospitalRole, setNewHospitalRole,
  accessMsg,
  onRefresh, onAdd, onRemove, onEdit,
}: Props) {
  const myRole = normalizeRole(me.role as string);
  const canAdd = canAddUsers(myRole);
  const assignableRoles = ROLE_HIERARCHY.filter(r => canManage(myRole, r));
  const canSeeHints = ["super_admin", "head_admin", "admin"].includes(myRole);

  const [editingNick, setEditingNick] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ role: "editor", href: "", hospital_role: "" });
  const [editSaving, setEditSaving] = useState(false);

  const startEdit = (u: AccessUser) => {
    playClickSound();
    setEditingNick(u.nickname);
    setEditState({ role: normalizeRole(u.role as string), href: u.href || "", hospital_role: u.hospital_role || "Нет" });
  };

  const cancelEdit = () => { setEditingNick(null); };

  const saveEdit = async () => {
    if (!editingNick) return;
    setEditSaving(true);
    await onEdit(editingNick, { role: editState.role, href: editState.href, hospital_role: editState.hospital_role });
    setEditSaving(false);
    setEditingNick(null);
  };

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
          {accessUsers.map((u) => {
            const normRole = normalizeRole(u.role as string);
            const meta = ROLE_META[normRole] ?? { label: u.role, hospitalLabel: u.role, short: u.role, color: "text-zinc-400", bg: "bg-zinc-800" };
            const canDelete = u.nickname !== me.nickname && canManage(myRole, normRole);
            const canEdit = canManage(myRole, normRole) || (u.nickname === me.nickname && myRole === "super_admin");
            const isEditing = editingNick === u.nickname;

            return (
              <div key={u.nickname} className="border border-zinc-800">
                {/* Основная строка */}
                <div className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <Icon name="User" size={15} className="text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href={u.href || `https://vk.ru/${u.nickname}`} target="_blank" rel="noopener noreferrer"
                      className="font-semibold text-sm hover:text-red-400 transition-colors block">
                      vk.ru/{u.nickname}
                    </a>
                    <p className="text-xs text-zinc-500">
                      {u.created_by ? `Добавил: ${u.created_by}` : "Основатель"}
                      {u.hospital_role && u.hospital_role !== "Нет" && u.hospital_role !== "" && (
                        <span className="ml-2 text-zinc-600">· {u.hospital_role}</span>
                      )}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 font-semibold uppercase tracking-wider shrink-0 ${meta.bg} ${meta.color}`}>
                    {meta.label}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {canEdit && (
                      <button
                        onClick={() => isEditing ? cancelEdit() : startEdit(u)}
                        className={`transition-colors ${isEditing ? "text-red-400" : "text-zinc-600 hover:text-zinc-300"}`}
                      >
                        <Icon name={isEditing ? "X" : "Pencil"} size={14} />
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => { playClickSound(); onRemove(u.nickname); }}
                        className="text-zinc-600 hover:text-red-500 transition-colors">
                        <Icon name="UserX" size={15} />
                      </button>
                    )}
                    {!canEdit && !canDelete && <div className="w-[15px]" />}
                  </div>
                </div>

                {/* Форма редактирования */}
                {isEditing && (
                  <div className="border-t border-zinc-700 p-4 flex flex-col gap-3 bg-zinc-900/50">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500">Роль в системе</label>
                        <select
                          value={editState.role}
                          onChange={e => setEditState(s => ({ ...s, role: e.target.value as Role }))}
                          className="bg-zinc-900 border border-zinc-700 text-white px-2.5 py-1.5 text-xs outline-none focus:border-red-600 transition-colors"
                        >
                          {(myRole === "super_admin"
                            ? ROLE_HIERARCHY
                            : ROLE_HIERARCHY.filter(r => canManage(myRole, r))
                          ).map(r => (
                            <option key={r} value={r}>{ROLE_META[r].label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-500">Должность в больнице</label>
                        <select
                          value={editState.hospital_role || "Нет"}
                          onChange={e => setEditState(s => ({ ...s, hospital_role: e.target.value }))}
                          className="bg-zinc-900 border border-zinc-700 text-white px-2.5 py-1.5 text-xs outline-none focus:border-red-600 transition-colors"
                        >
                          {HOSPITAL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-zinc-500">Ссылка VK (полная)</label>
                      <input
                        value={editState.href}
                        onChange={e => setEditState(s => ({ ...s, href: e.target.value }))}
                        placeholder="https://vk.ru/nickname"
                        className="bg-zinc-900 border border-zinc-700 text-white px-2.5 py-1.5 text-xs outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <button
                      onClick={saveEdit}
                      disabled={editSaving}
                      className="flex items-center gap-1.5 self-start bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      <Icon name="Save" size={12} />
                      {editSaving ? "Сохранение..." : "Сохранить"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {canAdd && (
        <div className="border border-zinc-700/40 bg-zinc-900/40 p-5">
          <p className="text-sm font-semibold mb-3 text-zinc-300">Добавить пользователя</p>
          <div className="flex flex-col gap-3">
            <div className="relative">
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
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs text-zinc-500">Роль в системе</label>
                <select
                  value={newAccessRole}
                  onChange={e => setNewAccessRole(e.target.value as Role)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                >
                  {assignableRoles.map(r => (
                    <option key={r} value={r}>{ROLE_META[r].label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs text-zinc-500">Должность в больнице</label>
                <select
                  value={newHospitalRole}
                  onChange={e => setNewHospitalRole(e.target.value as HospitalRole)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                >
                  {HOSPITAL_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
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
          {canSeeHints && (
            <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col gap-1.5">
              <p><span className="text-blue-400 font-semibold">Суперадмин</span> — полный доступ, управляет всеми</p>
              <p><span className="text-green-400 font-semibold">Главный Админ</span> — управляет Админом, Модератором, Редактором</p>
              <p><span className="text-red-400 font-semibold">Админ</span> — управляет Модератором, Редактором</p>
              <p><span className="text-purple-400 font-semibold">Модератор</span> — управляет Редактором</p>
              <p><span className="text-orange-400 font-semibold">Редактор</span> — только просмотр кабинета</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
