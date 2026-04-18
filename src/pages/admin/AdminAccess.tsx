import { useState, useEffect } from "react";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { Role, AccessUser, ROLE_HIERARCHY, ROLE_META, canManage, canAddUsers, normalizeRole, roleRank, TkmAllowedEntry } from "./adminTypes";

export const HOSPITAL_ROLES = ["Нет", "ГВ", "ПЗГВ", "КОИ", "ЗОИ", "ЗЗОИ"] as const;
export type HospitalRole = typeof HOSPITAL_ROLES[number];

interface EditState {
  role: Role;
  href: string;
  hospital_role: string;
  tkm: boolean;
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
  tkmAllowed: TkmAllowedEntry[];
  onRefresh: () => void;
  onAdd: () => void;
  onRemove: (nick: string) => void;
  onEdit: (nick: string, data: { role?: Role; href?: string; hospital_role?: string }) => Promise<void>;
  onSaveTkm: (list: TkmAllowedEntry[]) => Promise<void>;
}

export default function AdminAccess({
  me,
  accessUsers, accessLoading,
  newAccessNick, setNewAccessNick,
  newAccessRole, setNewAccessRole,
  newHospitalRole, setNewHospitalRole,
  accessMsg,
  tkmAllowed,
  onRefresh, onAdd, onRemove, onEdit, onSaveTkm,
}: Props) {
  const myRole = normalizeRole(me.role as string);
  const canAdd = canAddUsers(myRole);
  const assignableRoles = ROLE_HIERARCHY.filter(r => canManage(myRole, r));
  const canSeeHints = ["super_admin", "head_admin", "admin"].includes(myRole);

  const [editingNick, setEditingNick] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ role: "editor", href: "", hospital_role: "", tkm: false });
  const [editSaving, setEditSaving] = useState(false);

  // Локальный порядок карточек
  const [sortedUsers, setSortedUsers] = useState<AccessUser[]>([]);
  const [sortMode, setSortMode] = useState<"manual" | "hierarchy">("hierarchy");

  // Синхронизируем при получении новых данных
  useEffect(() => {
    if (accessUsers.length === 0) return;
    if (sortMode === "hierarchy") {
      setSortedUsers([...accessUsers].sort((a, b) =>
        roleRank(normalizeRole(a.role as string)) - roleRank(normalizeRole(b.role as string))
      ));
    } else {
      // При manual — сохраняем текущий порядок, добавляем новых в конец
      setSortedUsers(prev => {
        const existing = prev.filter(p => accessUsers.some(u => u.nickname === p.nickname));
        const updated = existing.map(p => accessUsers.find(u => u.nickname === p.nickname)!);
        const newOnes = accessUsers.filter(u => !prev.some(p => p.nickname === u.nickname));
        return [...updated, ...newOnes];
      });
    }
  }, [accessUsers, sortMode]);

  const applyHierarchy = () => {
    playClickSound();
    setSortMode("hierarchy");
    setSortedUsers([...accessUsers].sort((a, b) =>
      roleRank(normalizeRole(a.role as string)) - roleRank(normalizeRole(b.role as string))
    ));
  };

  const moveCard = (idx: number, dir: -1 | 1) => {
    playClickSound();
    setSortMode("manual");
    setSortedUsers(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const startEdit = (u: AccessUser) => {
    playClickSound();
    setEditingNick(u.nickname);
    const nick = u.nickname.toLowerCase();
    setEditState({
      role: normalizeRole(u.role as string),
      href: u.href || "",
      hospital_role: u.hospital_role || "Нет",
      tkm: tkmAllowed.some(e => e.nick.toLowerCase() === nick),
    });
  };

  const cancelEdit = () => { setEditingNick(null); };

  const saveEdit = async () => {
    if (!editingNick) return;
    setEditSaving(true);
    await onEdit(editingNick, { role: editState.role, href: editState.href, hospital_role: editState.hospital_role });
    const nick = editingNick.toLowerCase();
    const hasTkm = tkmAllowed.some(e => e.nick.toLowerCase() === nick);
    if (editState.tkm && !hasTkm) {
      await onSaveTkm([...tkmAllowed, { nick: editingNick.toLowerCase(), attempts: 3 }]);
    } else if (!editState.tkm && hasTkm) {
      await onSaveTkm(tkmAllowed.filter(e => e.nick.toLowerCase() !== nick));
    }
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
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={applyHierarchy}
            title="Отсортировать по иерархии"
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 border transition-colors ${sortMode === "hierarchy" ? "border-red-600/60 text-red-400 bg-red-950/20" : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"}`}
          >
            <Icon name="ArrowUpDown" size={12} />
            <span className="hidden sm:inline">По иерархии</span>
          </button>
          <button onClick={() => { playClickSound(); onRefresh(); }} className="text-zinc-400 hover:text-white transition-colors">
            <Icon name="RefreshCw" size={15} />
          </button>
        </div>
      </div>

      {accessLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {sortedUsers.map((u, idx) => {
            const normRole = normalizeRole(u.role as string);
            const meta = ROLE_META[normRole] ?? { label: u.role, hospitalLabel: u.role, short: u.role, color: "text-zinc-400", bg: "bg-zinc-800" };
            const canDelete = u.nickname !== me.nickname && canManage(myRole, normRole);
            const canEdit = canManage(myRole, normRole) || (u.nickname === me.nickname && myRole === "super_admin");
            const isEditing = editingNick === u.nickname;

            return (
              <div key={u.nickname} className="border border-zinc-800">
                <div className="p-4 flex items-center gap-2">
                  {/* Кнопки перемещения */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      onClick={() => moveCard(idx, -1)}
                      disabled={idx === 0}
                      className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon name="ChevronUp" size={13} />
                    </button>
                    <button
                      onClick={() => moveCard(idx, 1)}
                      disabled={idx === sortedUsers.length - 1}
                      className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon name="ChevronDown" size={13} />
                    </button>
                  </div>

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
                      {tkmAllowed.some(e => e.nick.toLowerCase() === u.nickname.toLowerCase()) && (
                        <span className="ml-2 text-blue-500">· ТКМ ({tkmAllowed.find(e => e.nick.toLowerCase() === u.nickname.toLowerCase())?.attempts ?? 0})</span>
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
                    <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                      <input
                        type="checkbox"
                        checked={editState.tkm}
                        onChange={e => setEditState(s => ({ ...s, tkm: e.target.checked }))}
                        className="w-3.5 h-3.5 accent-red-600"
                      />
                      <span className="text-xs text-zinc-300">Допуск к ТКМ</span>
                    </label>
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
            <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-blue-400 font-semibold">Суперадмин</p>
                <p>Полный контроль над всей панелью. Может добавлять и удалять любого участника, включая Главного Админа. Редактирует всех — роли, ссылки, должности. Единственный, кто может редактировать себя самого. Единственный, кто может редактировать раздел «Что нового» на главной странице сайта.</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-green-400 font-semibold">Главный Админ</p>
                <p>Может добавлять и удалять Старшего Админа, Админа, Младшего Админа. Редактирует их роли, ссылки, должности. Не может трогать Суперадмина.</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-red-400 font-semibold">Старший Админ</p>
                <p>Может добавлять и удалять Админа и Младшего Админа. Не может трогать Суперадмина и Главного Админа.</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-purple-400 font-semibold">Админ</p>
                <p>Может добавлять и удалять только Младшего Админа. Вкладка «Контакты РС ОИ» недоступна.</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-orange-400 font-semibold">Младший Админ</p>
                <p>Только просмотр кабинета. Не может добавлять или удалять никого. Вкладка «Контакты РС ОИ» недоступна.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}