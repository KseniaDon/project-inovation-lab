import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

export type StaffMember = {
  role: string;
  name: string;
  nickname: string;
  href: string;
  badge: string;
  badgeColor: string;
};

interface Props {
  staff: StaffMember[];
  staffSaving: boolean;
  staffSaved: boolean;
  onUpdate: (i: number, field: keyof StaffMember, val: string) => void;
  onRemove: (i: number) => void;
  onAdd: () => void;
  onSave: () => void;
}

export default function AdminStaff({ staff, staffSaving, staffSaved, onUpdate, onRemove, onAdd, onSave }: Props) {
  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Управление</p>
          <h2 className="text-xl font-bold">Контакты РС ОИ</h2>
          <p className="text-sm text-zinc-400 mt-1">Изменения мгновенно отображаются на странице контактов.</p>
        </div>
        <a
          href="/contacts"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playClickSound}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors shrink-0"
        >
          <Icon name="Eye" size={13} />
          <span>Предпросмотр</span>
        </a>
      </div>

      <div className="flex flex-col gap-4">
        {staff.map((member, i) => (
          <div key={i} className="border border-zinc-800 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-widest text-zinc-500">Сотрудник {i + 1}</p>
              <button onClick={() => onRemove(i)} className="text-zinc-600 hover:text-red-500 transition-colors">
                <Icon name="Trash2" size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Должность</label>
                <input
                  value={member.role}
                  onChange={e => onUpdate(i, "role", e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                  placeholder="Куратор Отделения Интернатуры"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Имя (отображается)</label>
                <input
                  value={member.name}
                  onChange={e => onUpdate(i, "name", e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                  placeholder="Ivan Petrov"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Ник VK (без vk.ru/)</label>
                <input
                  value={member.nickname}
                  onChange={e => onUpdate(i, "nickname", e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                  placeholder="ivan_petrov"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Ссылка VK (полная)</label>
                <input
                  value={member.href}
                  onChange={e => onUpdate(i, "href", e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                  placeholder="https://vk.ru/ivan_petrov"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Бейдж (текст)</label>
                <input
                  value={member.badge}
                  onChange={e => onUpdate(i, "badge", e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                  placeholder="Куратор"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Цвет бейджа</label>
                <select
                  value={member.badgeColor}
                  onChange={e => onUpdate(i, "badgeColor", e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                >
                  <option value="bg-red-600">Красный — КОИ</option>
                  <option value="bg-purple-700">Фиолетовый — ЗОИ</option>
                  <option value="bg-orange-600">Оранжевый — ЗЗОИ</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => { playClickSound(); onAdd(); }}
          className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          <Icon name="Plus" size={13} />Добавить сотрудника
        </button>
        <button
          onClick={() => { playClickSound(); onSave(); }}
          disabled={staffSaving}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors ${staffSaved ? "bg-green-700 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}
        >
          <Icon name={staffSaved ? "Check" : "Save"} size={13} />
          {staffSaving ? "Сохранение..." : staffSaved ? "Сохранено" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}