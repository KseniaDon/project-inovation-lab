import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { SaveBtn, Field, Inp, SectionHeader } from "./adminHelpers";
import {
  BADGE_COLORS, DEPT_COLORS,
  HeroData, Section, StaffMember, Command, Floor, Department, CharterDoc, Report,
} from "./adminTypes";

type Schedule = {
  weekdays: string; saturday: string; break: string; sunday: string; note: string;
};

interface Props {
  tab: string;
  saved: boolean;
  saving: boolean;
  saveBlock: (key: string, value: unknown) => Promise<void>;

  hero: HeroData;
  setHero: React.Dispatch<React.SetStateAction<HeroData>>;

  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  editStaffIdx: number | null;
  setEditStaffIdx: React.Dispatch<React.SetStateAction<number | null>>;

  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  newItem: Record<string, string>;
  setNewItem: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;

  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;

  floors: Floor[];
  setFloors: React.Dispatch<React.SetStateAction<Floor[]>>;

  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;

  charter: CharterDoc[];
  setCharter: React.Dispatch<React.SetStateAction<CharterDoc[]>>;

  oathLines: string[];
  setOathLines: React.Dispatch<React.SetStateAction<string[]>>;

  maleReports: Report[];
  setMaleReports: React.Dispatch<React.SetStateAction<Report[]>>;
  femaleReports: Report[];
  setFemaleReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export default function AdminSiteContent({
  tab, saved, saving, saveBlock,
  hero, setHero,
  staff, setStaff, editStaffIdx, setEditStaffIdx,
  sections, setSections, newItem, setNewItem,
  commands, setCommands,
  schedule, setSchedule,
  floors, setFloors,
  departments, setDepartments,
  charter, setCharter,
  oathLines, setOathLines,
  maleReports, setMaleReports,
  femaleReports, setFemaleReports,
}: Props) {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      {tab === "hero" && (
        <div className="max-w-2xl">
          <SectionHeader title="Главная страница" desc="Заголовок и кнопка на экране-приветствии" />
          <div className="flex flex-col gap-4">
            <Field label="Подзаголовок">
              <textarea rows={3} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <Field label="Текст кнопки">
              <Inp value={hero.buttonText} onChange={v => setHero({ ...hero, buttonText: v })} />
            </Field>
            <SaveBtn onClick={() => saveBlock("hero", hero)} saved={saved} loading={saving} />
          </div>
        </div>
      )}

      {/* ── STAFF ──────────────────────────────────────────────────────── */}
      {tab === "staff" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Руководящий состав" desc='Отображается на странице "Контакты"' />
            <button onClick={() => { playClickSound(); setStaff(s => [...s, { role: "Должность", name: "Имя Фамилия", nickname: "nickname", href: "https://vk.ru/", badge: "Роль", badgeColor: "bg-red-600" }]); setEditStaffIdx(staff.length); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {staff.map((person, idx) => (
              <div key={idx} className="border border-zinc-800 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-sm shrink-0 ${person.badgeColor}`} />
                  <span className="font-semibold text-sm flex-1">{person.name}</span>
                  <button onClick={() => { playClickSound(); setEditStaffIdx(editStaffIdx === idx ? null : idx); }} className="text-zinc-500 hover:text-white transition-colors">
                    <Icon name={editStaffIdx === idx ? "ChevronUp" : "Pencil"} size={14} />
                  </button>
                  <button onClick={() => { playClickSound(); setStaff(s => s.filter((_, i) => i !== idx)); }} className="text-zinc-600 hover:text-red-500 transition-colors">
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
                {editStaffIdx === idx && (
                  <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Имя"><Inp value={person.name} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, name: v } : p))} /></Field>
                      <Field label="Должность"><Inp value={person.role} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, role: v } : p))} /></Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Никнейм ВК"><Inp value={person.nickname} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, nickname: v } : p))} placeholder="nickname" /></Field>
                      <Field label="Ссылка ВК"><Inp value={person.href} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, href: v } : p))} placeholder="https://vk.ru/..." /></Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Текст бейджа"><Inp value={person.badge} onChange={v => setStaff(s => s.map((p, i) => i === idx ? { ...p, badge: v } : p))} /></Field>
                      <Field label="Цвет бейджа">
                        <div className="flex gap-2 flex-wrap pt-1">
                          {BADGE_COLORS.map(c => <button key={c} onClick={() => setStaff(s => s.map((p, i) => i === idx ? { ...p, badgeColor: c } : p))} className={`w-6 h-6 rounded-sm ${c} ${person.badgeColor === c ? "ring-2 ring-white" : ""}`} />)}
                        </div>
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("staff", staff)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── SECTIONS ───────────────────────────────────────────────────── */}
      {tab === "sections" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Разделы обучения" desc="Этапы и пункты программы интернатуры" />
            <button onClick={() => { playClickSound(); setSections(s => [...s, { id: `sec_${Date.now()}`, title: "Новый раздел", items: [] }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Раздел
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {sections.map((sec) => (
              <div key={sec.id} className="border border-zinc-800 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Inp value={sec.title} onChange={v => setSections(s => s.map(x => x.id === sec.id ? { ...x, title: v } : x))} className="font-semibold" />
                  <button onClick={() => { playClickSound(); setSections(s => s.filter(x => x.id !== sec.id)); }} className="text-zinc-600 hover:text-red-500 transition-colors shrink-0">
                    <Icon name="Trash2" size={15} />
                  </button>
                </div>
                <ul className="flex flex-col gap-1.5 mb-4">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 group">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      <input type="text" value={item} onChange={e => setSections(s => s.map(x => x.id === sec.id ? { ...x, items: x.items.map((it, i) => i === idx ? e.target.value : it) } : x))}
                        className="flex-1 bg-transparent text-sm text-zinc-300 outline-none border-b border-transparent focus:border-zinc-600 transition-colors py-0.5" />
                      <button onClick={() => { playClickSound(); setSections(s => s.map(x => x.id === sec.id ? { ...x, items: x.items.filter((_, i) => i !== idx) } : x)); }}
                        className="text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"><Icon name="X" size={13} /></button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input type="text" placeholder="Новый пункт..." value={newItem[sec.id] || ""}
                    onChange={e => setNewItem(p => ({ ...p, [sec.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter" && newItem[sec.id]?.trim()) { setSections(s => s.map(x => x.id === sec.id ? { ...x, items: [...x.items, newItem[sec.id].trim()] } : x)); setNewItem(p => ({ ...p, [sec.id]: "" })); } }}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { if (!newItem[sec.id]?.trim()) return; playClickSound(); setSections(s => s.map(x => x.id === sec.id ? { ...x, items: [...x.items, newItem[sec.id].trim()] } : x)); setNewItem(p => ({ ...p, [sec.id]: "" })); }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 transition-colors"><Icon name="Plus" size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("sections", sections)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── COMMANDS ───────────────────────────────────────────────────── */}
      {tab === "commands" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Основные команды" desc="Список команд для сотрудников" />
            <button onClick={() => { playClickSound(); setCommands(c => [...c, { cmd: "/команда", desc: "Описание" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {commands.map((cmd, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input value={cmd.cmd} onChange={e => setCommands(c => c.map((x, i) => i === idx ? { ...x, cmd: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors w-40 shrink-0" />
                <input value={cmd.desc} onChange={e => setCommands(c => c.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                <button onClick={() => { playClickSound(); setCommands(c => c.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("commands", commands)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── SCHEDULE ───────────────────────────────────────────────────── */}
      {tab === "schedule" && (
        <div className="max-w-2xl">
          <SectionHeader title="График работы" desc="Расписание рабочих дней и перерывов" />
          <div className="flex flex-col gap-4">
            <Field label="Пн–Пт"><Inp value={schedule.weekdays} onChange={v => setSchedule(s => ({ ...s, weekdays: v }))} /></Field>
            <Field label="Суббота"><Inp value={schedule.saturday} onChange={v => setSchedule(s => ({ ...s, saturday: v }))} /></Field>
            <Field label="Перерыв (ежедневно)"><Inp value={schedule.break} onChange={v => setSchedule(s => ({ ...s, break: v }))} /></Field>
            <Field label="Воскресенье"><Inp value={schedule.sunday} onChange={v => setSchedule(s => ({ ...s, sunday: v }))} /></Field>
            <Field label="Примечание">
              <textarea rows={2} value={schedule.note} onChange={e => setSchedule(s => ({ ...s, note: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <SaveBtn onClick={() => saveBlock("schedule", schedule)} saved={saved} loading={saving} />
          </div>
        </div>
      )}

      {/* ── FLOORS ─────────────────────────────────────────────────────── */}
      {tab === "floors" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Распределение этажей" desc="Описание каждого этажа больницы" />
            <button onClick={() => { playClickSound(); setFloors(f => [...f, { num: `${f.length + 1} этаж`, desc: "Описание" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {floors.map((floor, idx) => (
              <div key={idx} className="flex items-start gap-2 group">
                <input value={floor.num} onChange={e => setFloors(f => f.map((x, i) => i === idx ? { ...x, num: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors w-28 shrink-0 font-semibold" />
                <input value={floor.desc} onChange={e => setFloors(f => f.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                <button onClick={() => { playClickSound(); setFloors(f => f.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-2.5"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("floors", floors)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── DEPARTMENTS ────────────────────────────────────────────────── */}
      {tab === "departments" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Отделения ЦГБ-Н" desc="Структура и аббревиатуры подразделений" />
            <button onClick={() => { playClickSound(); setDepartments(d => [...d, { abbr: "ОТД", full: "Новое отделение", color: "text-zinc-400" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {departments.map((dept, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input value={dept.abbr} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm font-bold outline-none focus:border-red-600 transition-colors w-20 shrink-0" />
                <input value={dept.full} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, full: e.target.value } : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors" />
                <select value={dept.color} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, color: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2.5 text-xs outline-none focus:border-red-600 transition-colors w-28 shrink-0">
                  {DEPT_COLORS.map(c => <option key={c} value={c}>{c.replace("text-", "")}</option>)}
                </select>
                <button onClick={() => { playClickSound(); setDepartments(d => d.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("departments", departments)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── CHARTER ────────────────────────────────────────────────────── */}
      {tab === "charter" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Уставная документация" desc="Ссылки на официальные документы и уставы" />
            <button onClick={() => { playClickSound(); setCharter(c => [...c, { abbr: "АБВ", title: "Название документа", href: "https://forum.gtaprovince.ru/" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {charter.map((doc, idx) => (
              <div key={idx} className="border border-zinc-800 p-4 group">
                <div className="flex items-start gap-2 mb-2">
                  <input value={doc.abbr} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                    className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-bold outline-none focus:border-red-600 transition-colors w-24 shrink-0" />
                  <input value={doc.title} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { playClickSound(); setCharter(c => c.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                </div>
                <input value={doc.href} onChange={e => setCharter(c => c.map((x, i) => i === idx ? { ...x, href: e.target.value } : x))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-400 px-3 py-2 text-xs outline-none focus:border-red-600 transition-colors" placeholder="https://..." />
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("charter", charter)} saved={saved} loading={saving} /></div>
        </div>
      )}

      {/* ── OATH ───────────────────────────────────────────────────────── */}
      {tab === "oath" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Клятва врача" desc="Строки клятвы (say-команды для консоли)" />
            <button onClick={() => { playClickSound(); setOathLines(l => [...l, "say Новая строка клятвы."]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-2 mb-6">
            {oathLines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input value={line} onChange={e => setOathLines(l => l.map((x, i) => i === idx ? e.target.value : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors" />
                <button onClick={() => { playClickSound(); setOathLines(l => l.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <SaveBtn onClick={() => saveBlock("oath_lines", oathLines)} saved={saved} loading={saving} />
        </div>
      )}

      {/* ── REPORTS ────────────────────────────────────────────────────── */}
      {tab === "reports" && (
        <div className="max-w-2xl">
          <SectionHeader title="Доклады в рацию" desc="Шаблоны докладов для мужчин и женщин" />
          {([
            { label: "♂ Мужские доклады", items: maleReports, setItems: setMaleReports, key: "reports_male" },
            { label: "♀ Женские доклады", items: femaleReports, setItems: setFemaleReports, key: "reports_female" },
          ] as const).map(({ label, items, setItems, key }) => (
            <div key={key} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-zinc-300">{label}</p>
                <button onClick={() => { playClickSound(); setItems(l => [...l, { label: "Новый доклад", template: "/r ОИ-Инициалы. Текст." }]); }}
                  className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                  <Icon name="Plus" size={12} />Добавить
                </button>
              </div>
              <div className="flex flex-col gap-2 border border-zinc-800 p-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <input value={item.label} onChange={e => setItems(l => l.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))}
                      className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs outline-none focus:border-red-600 transition-colors w-36 shrink-0" />
                    <input value={item.template} onChange={e => setItems(l => l.map((x, i) => i === idx ? { ...x, template: e.target.value } : x))}
                      className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors" />
                    <button onClick={() => { playClickSound(); setItems(l => l.filter((_, i) => i !== idx)); }}
                      className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={13} /></button>
                  </div>
                ))}
              </div>
              <div className="mt-3"><SaveBtn onClick={() => saveBlock(key, items)} saved={saved} loading={saving} /></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
