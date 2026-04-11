import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";
import { SaveBtn, Field, Inp, SectionHeader } from "./adminHelpers";
import { BADGE_COLORS, HeroData, StaffMember } from "./adminTypes";

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

  introData: { welcome: string; line1: string; days_total: string; days_feldsher: string };
  setIntroData: React.Dispatch<React.SetStateAction<{ welcome: string; line1: string; days_total: string; days_feldsher: string }>>;

  internExam: { title: string; desc: string; binds_link: string; charter_link: string; exam_items: string[] };
  setInternExam: React.Dispatch<React.SetStateAction<{ title: string; desc: string; binds_link: string; charter_link: string; exam_items: string[] }>>;
}

export default function AdminTabsSiteBasic({
  tab, saved, saving, saveBlock,
  hero, setHero,
  staff, setStaff, editStaffIdx, setEditStaffIdx,
  introData, setIntroData,
  internExam, setInternExam,
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

      {/* ── INTRO ──────────────────────────────────────────────────────── */}
      {tab === "intro" && (
        <div className="max-w-2xl">
          <SectionHeader title="Вступление" desc="Текст приветствия при входе в раздел обучения" />
          <div className="flex flex-col gap-4">
            <Field label="Заголовок-приветствие">
              <Inp value={introData.welcome} onChange={v => setIntroData(d => ({ ...d, welcome: v }))} />
            </Field>
            <Field label="Первое предложение">
              <textarea rows={2} value={introData.line1} onChange={e => setIntroData(d => ({ ...d, line1: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Дней всего в ОИ">
                <Inp value={introData.days_total} onChange={v => setIntroData(d => ({ ...d, days_total: v }))} />
              </Field>
              <Field label="Дней до Фельдшера">
                <Inp value={introData.days_feldsher} onChange={v => setIntroData(d => ({ ...d, days_feldsher: v }))} />
              </Field>
            </div>
            <SaveBtn onClick={() => saveBlock("intro_data", introData)} saved={saved} loading={saving} />
          </div>
        </div>
      )}

      {/* ── INTERN EXAM ────────────────────────────────────────────────── */}
      {tab === "intern_exam" && (
        <div className="max-w-2xl">
          <SectionHeader title="Раздел Интерн" desc="Задача и требования для получения допуска к лечению" />
          <div className="flex flex-col gap-4 mb-6">
            <Field label="Главная задача (красный заголовок)">
              <Inp value={internExam.title} onChange={v => setInternExam(d => ({ ...d, title: v }))} />
            </Field>
            <Field label="Описание">
              <textarea rows={3} value={internExam.desc} onChange={e => setInternExam(d => ({ ...d, desc: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <Field label="Ссылка на бинды">
              <Inp value={internExam.binds_link} onChange={v => setInternExam(d => ({ ...d, binds_link: v }))} />
            </Field>
            <Field label="Ссылка на Внутренний Устав">
              <Inp value={internExam.charter_link} onChange={v => setInternExam(d => ({ ...d, charter_link: v }))} />
            </Field>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-zinc-300">Пункты ПМЭ</p>
              <button onClick={() => { playClickSound(); setInternExam(d => ({ ...d, exam_items: [...d.exam_items, "Новый пункт"] })); }}
                className="flex items-center gap-1 text-zinc-500 hover:text-white text-xs transition-colors">
                <Icon name="Plus" size={12} />Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2 border border-zinc-800 p-4">
              {internExam.exam_items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <input value={item} onChange={e => setInternExam(d => ({ ...d, exam_items: d.exam_items.map((x, i) => i === idx ? e.target.value : x) }))}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 text-sm outline-none focus:border-red-600 transition-colors" />
                  <button onClick={() => { playClickSound(); setInternExam(d => ({ ...d, exam_items: d.exam_items.filter((_, i) => i !== idx) })); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Icon name="X" size={14} /></button>
                </div>
              ))}
            </div>
            <div className="mt-3"><SaveBtn onClick={() => saveBlock("intern_exam", internExam)} saved={saved} loading={saving} /></div>
          </div>
        </div>
      )}
    </>
  );
}
