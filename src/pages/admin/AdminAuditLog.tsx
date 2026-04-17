import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

export type AuditEntry = {
  actor: string;
  action: string;
  details: Record<string, string>;
  created_at: string;
};

const ACTION_META: Record<string, { label: string; icon: string; color: string }> = {
  add_access:      { label: "Добавил доступ",       icon: "UserPlus",   color: "text-green-400" },
  remove_access:   { label: "Удалил доступ",         icon: "UserMinus",  color: "text-red-400" },
  edit_access:     { label: "Изменил участника",     icon: "UserCog",    color: "text-blue-400" },
  edit_content:    { label: "Изменил контент",       icon: "Pencil",     color: "text-zinc-400" },
};

const CONTENT_KEY_LABELS: Record<string, string> = {
  staff:      "Контакты РС ОИ",
  home_links: "Ссылки на главной",
  whats_new:  "Что нового",
};

interface Props {
  logs: AuditEntry[];
  loading: boolean;
  onRefresh: () => void;
}

export default function AdminAuditLog({ logs, loading, onRefresh }: Props) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Управление</p>
          <h2 className="text-xl font-bold">Журнал изменений</h2>
          <p className="text-sm text-zinc-400 mt-1">Последние 50 действий в панели управления</p>
        </div>
        <button onClick={() => { playClickSound(); onRefresh(); }} className="text-zinc-400 hover:text-white transition-colors shrink-0">
          <Icon name="RefreshCw" size={15} />
        </button>
      </div>

      <div className="border border-zinc-800 bg-zinc-900/40 px-4 py-3 flex flex-col gap-1.5 mb-6 text-xs text-zinc-500">
        <p className="text-zinc-400 font-semibold mb-1">Журнал записывает:</p>
        <p>✅ Добавление / удаление пользователя в доступы;</p>
        <p>✅ Изменение роли / должности / ссылки участника;</p>
        <p>✅ Сохранение контактов РС ОИ, ссылок на главной, блока «Что нового».</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-zinc-500 py-8 text-center">Журнал пуст</p>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map((entry, i) => {
            const meta = ACTION_META[entry.action] ?? { label: entry.action, icon: "Activity", color: "text-zinc-400" };
            const date = new Date(entry.created_at);
            const dateStr = date.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

            let detailText = "";
            if (entry.action === "add_access" || entry.action === "remove_access") {
              detailText = `vk.ru/${entry.details.nickname}` + (entry.details.role ? ` · ${entry.details.role}` : "");
            } else if (entry.action === "edit_access") {
              detailText = `vk.ru/${entry.details.nickname}`;
              if (entry.details.old_role && entry.details.new_role) {
                detailText += ` · роль: ${entry.details.old_role} → ${entry.details.new_role}`;
              }
              if (entry.details.hospital_role) {
                detailText += ` · должность: ${entry.details.hospital_role}`;
              }
            } else if (entry.action === "edit_content") {
              detailText = CONTENT_KEY_LABELS[entry.details.key] ?? entry.details.key;
            } else if (entry.action === "change_password") {
              detailText = `vk.ru/${entry.details.nickname}`;
            }

            return (
              <div key={i} className="border border-zinc-800 px-4 py-3 flex items-center gap-3">
                <Icon name={meta.icon as "Activity"} size={15} className={`${meta.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                    {detailText && <span className="text-xs text-zinc-400 truncate">{detailText}</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">vk.ru/{entry.actor}</p>
                </div>
                <span className="text-xs text-zinc-600 shrink-0">{dateStr}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}