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

  introData: { welcome: string; line1: string; line2: string; days_total: string; line3: string; days_feldsher: string; line4: string; line5: string; line6: string };
  setIntroData: React.Dispatch<React.SetStateAction<{ welcome: string; line1: string; line2: string; days_total: string; line3: string; days_feldsher: string; line4: string; line5: string; line6: string }>>;

  internExam: { title: string; desc: string; binds_link: string; charter_link: string; exam_items: string[] };
  setInternExam: React.Dispatch<React.SetStateAction<{ title: string; desc: string; binds_link: string; charter_link: string; exam_items: string[] }>>;
}

export default function AdminTabsSiteBasic({
  tab, saved, saving, saveBlock,
  hero, setHero,
  staff, setStaff,
  introData, setIntroData,
  internExam, setInternExam,
}: Props) {

  const upd = (idx: number, patch: Partial<StaffMember>) =>
    setStaff(s => s.map((p, i) => i === idx ? { ...p, ...patch } : p));

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

      {/* ── STAFF / CONTACTS ───────────────────────────────────────────── */}
      {tab === "staff" && (
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <SectionHeader title="Руководящий состав" desc='Страница «Контакты» — список людей с должностями и ссылками ВК' />
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {staff.map((person, idx) => (
              <div key={idx} className="border border-zinc-700 bg-zinc-900/40 rounded-sm">
                {/* Шапка карточки */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${person.badgeColor}`} />
                  <span className="text-sm font-semibold flex-1 truncate text-white">{person.name || "Новый сотрудник"}</span>
                  <a
                    href={person.href || "https://vk.ru/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-zinc-500 hover:text-blue-400 transition-colors"
                    title="Открыть ВК"
                  >
                    <Icon name="ExternalLink" size={13} />
                  </a>
                  <button
                    onClick={() => { playClickSound(); setStaff(s => s.filter((_, i) => i !== idx)); }}
                    className="text-zinc-600 hover:text-red-500 transition-colors"
                    title="Удалить"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>

                {/* Поля редактирования — всегда открыты */}
                <div className="px-4 py-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Имя и фамилия">
                      <Inp value={person.name} onChange={v => upd(idx, { name: v })} placeholder="Имя Фамилия" />
                    </Field>
                    <Field label="Должность">
                      <Inp value={person.role} onChange={v => upd(idx, { role: v })} placeholder="Куратор" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Никнейм ВК (без vk.ru/)">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs select-none">vk.ru/</span>
                        <input
                          type="text"
                          value={person.nickname}
                          onChange={e => upd(idx, { nickname: e.target.value, href: `https://vk.ru/${e.target.value}` })}
                          placeholder="nickname"
                          className="w-full bg-zinc-900 border border-zinc-700 text-white pl-12 pr-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                    </Field>
                    <Field label="Прямая ссылка ВК">
                      <Inp value={person.href} onChange={v => upd(idx, { href: v })} placeholder="https://vk.ru/..." />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Текст бейджа">
                      <Inp value={person.badge} onChange={v => upd(idx, { badge: v })} placeholder="Куратор" />
                    </Field>
                    <Field label="Цвет бейджа">
                      <div className="flex gap-2 flex-wrap pt-1">
                        {BADGE_COLORS.map(c => (
                          <button
                            key={c}
                            onClick={() => upd(idx, { badgeColor: c })}
                            className={`w-7 h-7 rounded-sm ${c} transition-all ${person.badgeColor === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"}`}
                          />
                        ))}
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Добавить */}
          <button
            onClick={() => {
              playClickSound();
              setStaff(s => [...s, {
                role: "Должность",
                name: "Имя Фамилия",
                nickname: "nickname",
                href: "https://vk.ru/nickname",
                badge: "Роль",
                badgeColor: "bg-red-600",
              }]);
            }}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-red-600 text-zinc-500 hover:text-white py-3 text-sm transition-colors mb-4"
          >
            <Icon name="Plus" size={15} />
            Добавить сотрудника
          </button>

          <SaveBtn onClick={() => saveBlock("staff", staff)} saved={saved} loading={saving} />
        </div>
      )}

      {/* ── INTRO ──────────────────────────────────────────────────────── */}
      {tab === "intro" && (
        <div className="max-w-2xl">
          <SectionHeader title="Вступление" desc="Текст страницы приветствия в разделе обучения" />
          <div className="flex flex-col gap-4">
            <Field label="Заголовок (крупный текст)">
              <Inp value={introData.welcome} onChange={v => setIntroData(d => ({ ...d, welcome: v }))} />
            </Field>
            <Field label="Строка 1 — Вы являетесь сотрудником...">
              <textarea rows={2} value={introData.line1} onChange={e => setIntroData(d => ({ ...d, line1: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <Field label="Строка 2 — На выход из ОИ вам дается...">
              <textarea rows={2} value={introData.line2} onChange={e => setIntroData(d => ({ ...d, line2: e.target.value }))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors resize-none" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Число дней (всего в ОИ)">
                <Inp value={introData.days_total} onChange={v => setIntroData(d => ({ ...d, days_total: v }))} placeholder="14" />
              </Field>
              <Field label="Число дней (до Фельдшера)">
                <Inp value={introData.days_feldsher} onChange={v => setIntroData(d => ({ ...d, days_feldsher: v }))} placeholder="7" />
              </Field>
            </div>
            <Field label="Строка 3 — За N дней (текст перед числом)">
              <Inp value={introData.line3} onChange={v => setIntroData(d => ({ ...d, line3: v }))} />
            </Field>
            <Field label="Строка 4 — ...дней — повыситься до Фельдшера.">
              <Inp value={introData.line4} onChange={v => setIntroData(d => ({ ...d, line4: v }))} />
            </Field>
            <Field label="Строка 5 — После повышения ещё (текст перед числом)">
              <Inp value={introData.line5} onChange={v => setIntroData(d => ({ ...d, line5: v }))} />
            </Field>
            <Field label="Строка 6 — ...дней — выйти из ОИ.">
              <Inp value={introData.line6} onChange={v => setIntroData(d => ({ ...d, line6: v }))} />
            </Field>
            <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-3 rounded-sm text-xs text-zinc-500">
              <span className="text-zinc-400 font-semibold">Предпросмотр:</span><br />
              <span className="text-white">{introData.welcome}</span><br />
              <span>{introData.line1}</span><br />
              <span>{introData.line2} <span className="text-red-400 font-bold">{introData.days_total} дней</span>.</span><br />
              <span>{introData.line3} <span className="text-red-400 font-bold">{introData.days_feldsher} дней</span> — {introData.line4}</span><br />
              <span>{introData.line5} <span className="text-red-400 font-bold">{introData.days_feldsher} дней</span> — {introData.line6}</span>
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