import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { WhatsNewEntry } from "@/components/WhatsNew";

interface Props {
  entries: WhatsNewEntry[];
  saving: boolean;
  saved: boolean;
  canEdit: boolean;
  onUpdate: (i: number, field: keyof WhatsNewEntry, val: string | boolean) => void;
  onRemove: (i: number) => void;
  onAdd: () => void;
  onSave: () => void;
}

export default function AdminWhatsNew({ entries, saving, saved, canEdit, onUpdate, onRemove, onAdd, onSave }: Props) {
  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Управление</p>
        <h2 className="text-xl font-bold">Что нового</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Записи отображаются на главной странице сайта. Если список пуст — блок скрыт.
          {!canEdit && <span className="ml-1 text-orange-400">· Только просмотр</span>}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {entries.length === 0 && (
          <p className="text-sm text-zinc-500 py-4 text-center border border-zinc-800">Записей нет — блок скрыт на сайте</p>
        )}
        {entries.map((entry, i) => (
          <div key={i} className="border border-zinc-800 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-widest text-zinc-500">Запись {i + 1}</p>
              {canEdit && (
                <button onClick={() => { playClickSound(); onRemove(i); }} className="text-zinc-600 hover:text-red-500 transition-colors">
                  <Icon name="Trash2" size={14} />
                </button>
              )}
            </div>
            {canEdit ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500">Дата (например: 16 апреля 2026)</label>
                    <input
                      value={entry.date}
                      onChange={e => onUpdate(i, "date", e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                      placeholder="16 апреля 2026"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500">Заголовок</label>
                    <input
                      value={entry.title}
                      onChange={e => onUpdate(i, "title", e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                      placeholder="Добавлен новый раздел"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">Описание</label>
                  <textarea
                    value={entry.desc}
                    onChange={e => onUpdate(i, "desc", e.target.value)}
                    rows={2}
                    className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors resize-none"
                    placeholder="Краткое описание обновления..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500">Ссылка (необязательно)</label>
                    <input
                      value={entry.link || ""}
                      onChange={e => onUpdate(i, "link", e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                      placeholder="/learn#intern-hierarchy"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-500">Текст кнопки</label>
                    <input
                      value={entry.linkLabel || ""}
                      onChange={e => onUpdate(i, "linkLabel", e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors"
                      placeholder="Перейти к разделу"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`ext-${i}`}
                    checked={!!entry.linkExternal}
                    onChange={e => onUpdate(i, "linkExternal", e.target.checked)}
                    className="accent-red-600"
                  />
                  <label htmlFor={`ext-${i}`} className="text-xs text-zinc-400 cursor-pointer">Внешняя ссылка (открывать в новой вкладке)</label>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-zinc-500">{entry.date}</p>
                <p className="text-sm font-semibold text-white">{entry.title}</p>
                {entry.desc && <p className="text-xs text-zinc-400 leading-relaxed">{entry.desc}</p>}
                {entry.link && <p className="text-xs text-zinc-600">→ {entry.link}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => { playClickSound(); onAdd(); }}
            className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            <Icon name="Plus" size={13} />Добавить запись
          </button>
          <button
            onClick={() => { playClickSound(); onSave(); }}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors ${saved ? "bg-green-700 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}
          >
            <Icon name={saved ? "Check" : "Save"} size={13} />
            {saving ? "Сохранение..." : saved ? "Сохранено" : "Сохранить"}
          </button>
        </div>
      )}

      <div className="border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-xs text-zinc-500 flex flex-col gap-1">
        <p className="text-zinc-400 font-semibold mb-1">Подсказки:</p>
        <p>· Записи отображаются в том порядке, в котором добавлены (первая — сверху)</p>
        <p>· Ссылка на внутренний раздел: <span className="text-zinc-300">/learn#intern-hierarchy</span></p>
        <p>· Если список пуст — блок «Что нового» полностью скрыт на сайте</p>
      </div>
    </div>
  );
}