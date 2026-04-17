import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { WhatsNewEntry } from "@/components/WhatsNew";

const LEARN_SECTIONS = [
  { id: "intern", label: "Интерн" },
  { id: "intern-binds", label: "Настройка биндов" },
  { id: "intern-radio", label: "Использование рации" },
  { id: "intern-reports", label: "Доклады в рацию" },
  { id: "intern-commands", label: "Основные команды" },
  { id: "intern-abbr", label: "Аббревиатуры" },
  { id: "intern-hierarchy", label: "Иерархия" },
  { id: "intern-schedule", label: "График работы" },
  { id: "intern-floors", label: "Распределение этажей" },
  { id: "intern-activity", label: "Журнал активности (ЖА)" },
  { id: "intern-charter", label: "Уставная документация" },
  { id: "intern-departments", label: "Отделения ЦГБ-Н" },
  { id: "intern-drugs", label: "Препараты" },
  { id: "intern-oath", label: "Клятва врача" },
  { id: "intern-report", label: "Подготовка к повышению" },
  { id: "intern-evidence", label: "Фиксация доказательств" },
  { id: "intern-mis", label: "МИС «Здоровье»" },
  { id: "intern-gov", label: "Госпортал" },
  { id: "feldsher", label: "Фельдшер" },
  { id: "feldsher-ksmp", label: "Рабочий транспорт" },
  { id: "feldsher-radio", label: "Работа с рацией (Фельдшер)" },
  { id: "feldsher-pmp", label: "ПМП" },
  { id: "feldsher-mzportal", label: "МЗ Портал" },
  { id: "feldsher-patrol", label: "Пост и патрулирование" },
  { id: "feldsher-prmo", label: "ПРМО" },
  { id: "feldsher-medhelp", label: "Оказание врачебной помощи" },
  { id: "feldsher-wards", label: "Специализация отделений" },
];

interface Props {
  entries: WhatsNewEntry[];
  saving: boolean;
  saved: boolean;
  canEdit: boolean;
  onUpdate: (i: number, field: keyof WhatsNewEntry, val: string | boolean) => void;
  onRemove: (i: number) => void;
  onAdd: () => void;
  onSave: () => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

interface SortableItemProps {
  entry: WhatsNewEntry;
  i: number;
  canEdit: boolean;
  openSelect: number | null;
  setOpenSelect: (v: number | null) => void;
  onUpdate: (i: number, field: keyof WhatsNewEntry, val: string | boolean) => void;
  onRemove: (i: number) => void;
}

function SortableItem({ entry, i, canEdit, openSelect, setOpenSelect, onUpdate, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-zinc-800 p-5 flex flex-col gap-3 bg-zinc-950">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              {...attributes}
              {...listeners}
              className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing transition-colors touch-none"
            >
              <Icon name="GripVertical" size={14} />
            </button>
          )}
          <p className="text-xs uppercase tracking-widest text-zinc-500">Запись {i + 1}</p>
        </div>
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
              <div className="flex gap-1">
                <input
                  value={entry.link || ""}
                  onChange={e => onUpdate(i, "link", e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors flex-1 min-w-0"
                  placeholder="/learn#intern-hierarchy"
                />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenSelect(openSelect === i ? null : i)}
                    className="h-full px-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors"
                    title="Выбрать раздел обучения"
                  >
                    <Icon name="BookOpen" size={13} />
                  </button>
                  {openSelect === i && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-zinc-900 border border-zinc-700 shadow-xl w-64 max-h-64 overflow-y-auto flex flex-col">
                      <p className="text-xs text-zinc-500 px-3 py-2 border-b border-zinc-800">Разделы обучения</p>
                      {LEARN_SECTIONS.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            onUpdate(i, "link", `/learn#${s.id}`);
                            onUpdate(i, "title", s.label);
                            setOpenSelect(null);
                          }}
                          className="text-left text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 px-3 py-2 transition-colors"
                        >
                          {s.label}
                          <span className="block text-zinc-600 text-[10px]">/learn#{s.id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
              id={`ext-${entry.id}`}
              checked={!!entry.linkExternal}
              onChange={e => onUpdate(i, "linkExternal", e.target.checked)}
              className="accent-red-600"
            />
            <label htmlFor={`ext-${entry.id}`} className="text-xs text-zinc-400 cursor-pointer">Внешняя ссылка (открывать в новой вкладке)</label>
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
  );
}

export default function AdminWhatsNew({ entries, saving, saved, canEdit, onUpdate, onRemove, onAdd, onSave, onReorder }: Props) {
  const [openSelect, setOpenSelect] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = entries.findIndex(e => e.id === active.id);
    const newIndex = entries.findIndex(e => e.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(oldIndex, newIndex);
    }
  };

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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={entries.map(e => e.id!)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {entries.length === 0 && (
              <p className="text-sm text-zinc-500 py-4 text-center border border-zinc-800">Записей нет — блок скрыт на сайте</p>
            )}
            {entries.map((entry, i) => (
              <SortableItem
                key={entry.id}
                entry={entry}
                i={i}
                canEdit={canEdit}
                openSelect={openSelect}
                setOpenSelect={setOpenSelect}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
        <p>· Записи можно перетаскивать за иконку <span className="text-zinc-300">⠿</span> слева от номера</p>
        <p>· Записи отображаются в том порядке, в котором добавлены (первая — сверху)</p>
        <p>· Ссылка на внутренний раздел: <span className="text-zinc-300">/learn#intern-hierarchy</span></p>
        <p>· Если список пуст — блок «Что нового» полностью скрыт на сайте</p>
      </div>
    </div>
  );
}
