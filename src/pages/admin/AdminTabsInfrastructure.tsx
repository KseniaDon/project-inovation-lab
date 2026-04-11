import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { SaveBtn, Field, Inp, SectionHeader } from "./adminHelpers";
import { DEPT_COLORS, Floor, Department, CharterDoc } from "./adminTypes";

type Schedule = {
  weekdays: string; saturday: string; break: string; sunday: string; note: string;
};

interface Props {
  tab: string;
  saved: boolean;
  saving: boolean;
  saveBlock: (key: string, value: unknown) => Promise<void>;

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

  activityData: { ja_link: string; app_link: string; forum_link: string; afk_rules: string[] };
  setActivityData: React.Dispatch<React.SetStateAction<{ ja_link: string; app_link: string; forum_link: string; afk_rules: string[] }>>;
}

export default function AdminTabsInfrastructure({
  tab, saved, saving, saveBlock,
  schedule, setSchedule,
  floors, setFloors,
  departments, setDepartments,
  charter, setCharter,
  oathLines, setOathLines,
  activityData, setActivityData,
}: Props) {
  return (
    <>
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
            <SectionHeader title="Отделения ЦГБ-Н" desc="Структура, описания и аббревиатуры подразделений" />
            <button onClick={() => { playClickSound(); setDepartments(d => [...d, { abbr: "ОТД", full: "Новое отделение", color: "text-zinc-400", desc: "" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {departments.map((dept, idx) => (
              <div key={idx} className="border border-zinc-800 p-4 group">
                <div className="flex items-center gap-2 mb-3">
                  <input value={dept.abbr} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                    className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors w-20 shrink-0" />
                  <input value={dept.full} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, full: e.target.value } : x))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <select value={dept.color} onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, color: e.target.value } : x))}
                    className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs outline-none focus:border-red-600 transition-colors w-28 shrink-0">
                    {DEPT_COLORS.map(c => <option key={c} value={c}>{c.replace("text-", "")}</option>)}
                  </select>
                  <button onClick={() => { playClickSound(); setDepartments(d => d.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                </div>
                <textarea
                  value={dept.desc || ""}
                  onChange={e => setDepartments(d => d.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                  rows={2}
                  placeholder="Описание отделения..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors resize-none"
                />
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
              <div key={idx} className="flex items-start gap-2 group">
                <span className="text-zinc-600 text-xs pt-2.5 shrink-0 w-5 text-right">{idx + 1}.</span>
                <textarea
                  value={line}
                  onChange={e => setOathLines(l => l.map((x, i) => i === idx ? e.target.value : x))}
                  rows={2}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors resize-none"
                />
                <button onClick={() => { playClickSound(); setOathLines(l => l.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-2"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <SaveBtn onClick={() => saveBlock("oath_lines", oathLines)} saved={saved} loading={saving} />
        </div>
      )}

      {/* ── ACTIVITY ───────────────────────────────────────────────────── */}
      {tab === "activity" && (
        <div className="max-w-2xl">
          <SectionHeader title="Журнал активности (ЖА)" desc="Правила АФК и ссылки на ресурсы" />
          <div className="flex flex-col gap-4 mb-6">
            <Field label="Ссылка на сайт ЖА">
              <Inp value={activityData.ja_link} onChange={v => setActivityData(d => ({ ...d, ja_link: v }))} />
            </Field>
            <Field label="Ссылка на приложение ЖА">
              <Inp value={activityData.app_link} onChange={v => setActivityData(d => ({ ...d, app_link: v }))} />
            </Field>
            <Field label="Ссылка на госпортал">
              <Inp value={activityData.forum_link} onChange={v => setActivityData(d => ({ ...d, forum_link: v }))} />
            </Field>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-300">Правила АФК</p>
              <button onClick={() => { playClickSound(); setActivityData(d => ({ ...d, afk_rules: [...d.afk_rules, "Новое правило"] })); }}
                className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                <Icon name="Plus" size={12} />Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {activityData.afk_rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <input value={rule} onChange={e => setActivityData(d => ({ ...d, afk_rules: d.afk_rules.map((r, i) => i === idx ? e.target.value : r) }))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { playClickSound(); setActivityData(d => ({ ...d, afk_rules: d.afk_rules.filter((_, i) => i !== idx) })); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <SaveBtn onClick={() => saveBlock("activity", activityData)} saved={saved} loading={saving} />
        </div>
      )}
    </>
  );
}