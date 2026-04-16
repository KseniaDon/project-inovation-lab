import { useState } from "react";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

export type HomeLink = { title: string; desc: string; href: string };

const DEFAULT_LINKS: HomeLink[] = [
  {
    title: "Медицинская информационная система (МИС «Здоровье»)",
    desc: "Для проверки работы сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/1bFmfSAkaK7AiDpBfUQq0Gu8Iy047_2FUTCB0_sof6sU/edit#response=ACYDBNgCstyyo1UxDgpGbcvFOo6CjTUfrZ_HeNE3rOccl21kj2CqhFAJo5nL9CwI9Espcm0",
  },
  {
    title: "Информационный раздел Отделения Интернатуры",
    desc: "Для проверки заявлений на повышение и допуск сотрудников ОИ.",
    href: "https://forum.gtaprovince.ru/topic/995718-cgb-g-nevskiy-informacionnyy-razdel-otdeleniya-internatury/",
  },
  {
    title: "Система отработки наказаний",
    desc: "Для проверки отчётов отработки наказаний сотрудников ОИ.",
    href: "https://forum.gtaprovince.ru/topic/995714-cgb-g-nevskiy-sistema-otrabotki-nakazaniy/",
  },
  {
    title: "Теоретический Квалификационный Модуль (ТКМ)",
    desc: "Для проходящих экзамен сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdB429Yr16E5rsm-MMxd4BtE3zq9Bxk-urv7pHDhV8iByU4yQ/viewform",
  },
  {
    title: "Теоретический Квалификационный Модуль (ТКМ) — результаты",
    desc: "Для проверки результатов прохождения сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/1iZIIxc36mxKpBi-rilgO2VtEt7TrEle0mxrRcp_oDVU/edit",
  },
];

interface Props {
  links: HomeLink[];
  linksSaving: boolean;
  linksSaved: boolean;
  onUpdateLink: (i: number, field: keyof HomeLink, val: string) => void;
  onRemoveLink: (i: number) => void;
  onAddLink: () => void;
  onSaveLinks: () => void;
}

export default function AdminHome({ links, linksSaving, linksSaved, onUpdateLink, onRemoveLink, onAddLink, onSaveLinks }: Props) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Заголовок */}
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Панель управления</p>
        <h2 className="text-lg sm:text-2xl font-bold">Добро пожаловать, дорогое руководство ОИ!</h2>
      </div>

      {/* Ссылки */}
      <div className="flex flex-col gap-2.5">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="group flex items-start justify-between gap-3 border border-zinc-800 hover:border-red-600/60 transition-all duration-300 px-3 sm:px-4 py-3 overflow-hidden"
          >
            <div className="flex items-stretch gap-0 min-w-0">
              <div className="w-1 shrink-0 bg-red-600 group-hover:w-1.5 transition-all duration-300 mr-3 rounded-sm" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-xs sm:text-sm text-red-400 font-semibold leading-snug">{link.title}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{link.desc}</p>
              </div>
            </div>
            <Icon name="ExternalLink" size={14} className="text-zinc-600 group-hover:text-red-400 transition-colors duration-300 shrink-0 mt-0.5" />
          </a>
        ))}
      </div>

      {/* Редактор ссылок */}
      <div className="border-t border-zinc-800 pt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Редактор ссылок</p>
          <button
            onClick={() => { playClickSound(); setEditMode(v => !v); }}
            className={`text-xs px-2.5 py-1 border transition-colors ${editMode ? "border-red-600 text-red-400 bg-red-950/30" : "border-zinc-700 text-zinc-400 hover:text-white"}`}
          >
            {editMode ? "Скрыть" : "Редактировать"}
          </button>
        </div>

        {editMode && (
          <div className="flex flex-col gap-4">
            {links.map((link, i) => (
              <div key={i} className="border border-zinc-800 p-3 sm:p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Ссылка {i + 1}</p>
                  <button onClick={() => { playClickSound(); onRemoveLink(i); }} className="text-zinc-600 hover:text-red-500 transition-colors p-1">
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">Название</label>
                  <input
                    value={link.title}
                    onChange={e => onUpdateLink(i, "title", e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-2.5 py-1.5 text-xs outline-none focus:border-red-600 transition-colors w-full"
                    placeholder="Название ссылки"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">Описание</label>
                  <input
                    value={link.desc}
                    onChange={e => onUpdateLink(i, "desc", e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-2.5 py-1.5 text-xs outline-none focus:border-red-600 transition-colors w-full"
                    placeholder="Для чего эта ссылка"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">URL</label>
                  <input
                    value={link.href}
                    onChange={e => onUpdateLink(i, "href", e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white px-2.5 py-1.5 text-xs outline-none focus:border-red-600 transition-colors w-full"
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <button
                onClick={() => { playClickSound(); onAddLink(); }}
                className="flex items-center gap-1.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                <Icon name="Plus" size={12} />Добавить
              </button>
              <button
                onClick={() => { playClickSound(); onSaveLinks(); }}
                disabled={linksSaving}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${linksSaved ? "bg-green-700 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}
              >
                <Icon name={linksSaved ? "Check" : "Save"} size={12} />
                {linksSaving ? "Сохранение..." : linksSaved ? "Сохранено" : "Сохранить"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { DEFAULT_LINKS };