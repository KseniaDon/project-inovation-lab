import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { SaveBtn, Inp, SectionHeader } from "./adminHelpers";
import { Section, Command, Report, AbbrItem, RadioCommand, RadioRule } from "./adminTypes";

interface Props {
  tab: string;
  saved: boolean;
  saving: boolean;
  saveBlock: (key: string, value: unknown) => Promise<void>;

  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  newItem: Record<string, string>;
  setNewItem: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;

  maleReports: Report[];
  setMaleReports: React.Dispatch<React.SetStateAction<Report[]>>;
  femaleReports: Report[];
  setFemaleReports: React.Dispatch<React.SetStateAction<Report[]>>;

  abbr: AbbrItem[];
  setAbbr: React.Dispatch<React.SetStateAction<AbbrItem[]>>;

  radioCommands: RadioCommand[];
  setRadioCommands: React.Dispatch<React.SetStateAction<RadioCommand[]>>;
  radioRules: RadioRule[];
  setRadioRules: React.Dispatch<React.SetStateAction<RadioRule[]>>;
}

export default function AdminTabsLearning({
  tab, saved, saving, saveBlock,
  sections, setSections, newItem, setNewItem,
  commands, setCommands,
  maleReports, setMaleReports,
  femaleReports, setFemaleReports,
  abbr, setAbbr,
  radioCommands, setRadioCommands,
  radioRules, setRadioRules,
}: Props) {
  return (
    <>
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

      {/* ── RADIO ──────────────────────────────────────────────────────── */}
      {tab === "radio" && (
        <div className="max-w-2xl">
          <SectionHeader title="Использование рации" desc="Команды рации и правила использования" />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-300">Команды рации</p>
              <button onClick={() => { playClickSound(); setRadioCommands(c => [...c, { cmd: "/r", desc: "Описание" }]); }}
                className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                <Icon name="Plus" size={12} />Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2 border border-zinc-800 p-4">
              {radioCommands.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <input value={item.cmd} onChange={e => setRadioCommands(c => c.map((x, i) => i === idx ? { ...x, cmd: e.target.value } : x))}
                    className="bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-xs font-mono outline-none focus:border-red-600 transition-colors w-24 shrink-0" />
                  <input value={item.desc} onChange={e => setRadioCommands(c => c.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { playClickSound(); setRadioCommands(c => c.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={13} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3"><SaveBtn onClick={() => saveBlock("radio_commands", radioCommands)} saved={saved} loading={saving} /></div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-300">Правила использования</p>
              <button onClick={() => { playClickSound(); setRadioRules(r => [...r, { text: "Новое правило" }]); }}
                className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                <Icon name="Plus" size={12} />Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2 border border-zinc-800 p-4">
              {radioRules.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 group">
                  <span className="text-zinc-500 text-xs shrink-0 pt-2.5">{idx + 1}.</span>
                  <textarea value={item.text} onChange={e => setRadioRules(r => r.map((x, i) => i === idx ? { ...x, text: e.target.value } : x))}
                    rows={2}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-2 py-2 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
                  <button onClick={() => { playClickSound(); setRadioRules(r => r.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-2"><Icon name="X" size={13} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3"><SaveBtn onClick={() => saveBlock("radio_rules", radioRules)} saved={saved} loading={saving} /></div>
          </div>
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

      {/* ── ABBR ───────────────────────────────────────────────────────── */}
      {tab === "abbr" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader title="Аббревиатуры" desc="Список сокращений и расшифровок" />
            <button onClick={() => { playClickSound(); setAbbr(a => [...a, { abbr: "АБВ", full: "Расшифровка" }]); }}
              className="flex items-center gap-2 border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-white px-3 py-2 text-xs uppercase tracking-wider transition-colors shrink-0">
              <Icon name="Plus" size={13} />Добавить
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {abbr.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input value={item.abbr} onChange={e => setAbbr(a => a.map((x, i) => i === idx ? { ...x, abbr: e.target.value } : x))}
                  className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-xs font-bold outline-none focus:border-red-600 transition-colors w-24 shrink-0" />
                <input value={item.full} onChange={e => setAbbr(a => a.map((x, i) => i === idx ? { ...x, full: e.target.value } : x))}
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                <button onClick={() => { playClickSound(); setAbbr(a => a.filter((_, i) => i !== idx)); }}
                  className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
              </div>
            ))}
          </div>
          <div className="mt-6"><SaveBtn onClick={() => saveBlock("abbr", abbr)} saved={saved} loading={saving} /></div>
        </div>
      )}
    </>
  );
}
