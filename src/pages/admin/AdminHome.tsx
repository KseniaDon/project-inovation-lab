import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

const HOME_LINKS: { title: string; desc: string; href: string; icon: string }[] = [
  {
    title: "Медицинская информационная система (МИС «Здоровье»)",
    desc: "Для проверки работы сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/1bFmfSAkaK7AiDpBfUQq0Gu8Iy047_2FUTCB0_sof6sU/edit#response=ACYDBNgCstyyo1UxDgpGbcvFOo6CjTUfrZ_HeNE3rOccl21kj2CqhFAJo5nL9CwI9Espcm0",
    icon: "MonitorCheck",
  },
  {
    title: "Информационный раздел Отделения Интернатуры",
    desc: "Для проверки заявлений на повышение и допуск сотрудников ОИ.",
    href: "https://forum.gtaprovince.ru/topic/995718-cgb-g-nevskiy-informacionnyy-razdel-otdeleniya-internatury/",
    icon: "FileText",
  },
  {
    title: "Система отработки наказаний",
    desc: "Для проверки отчётов отработки наказаний сотрудников ОИ.",
    href: "https://forum.gtaprovince.ru/topic/995714-cgb-g-nevskiy-sistema-otrabotki-nakazaniy/",
    icon: "ClipboardList",
  },
  {
    title: "Теоретический Квалификационный Модуль (ТКМ)",
    desc: "Для проходящих экзамен сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdB429Yr16E5rsm-MMxd4BtE3zq9Bxk-urv7pHDhV8iByU4yQ/viewform",
    icon: "GraduationCap",
  },
  {
    title: "Теоретический Квалификационный Модуль (ТКМ) — результаты",
    desc: "Для проверки результатов прохождения сотрудников ОИ.",
    href: "https://docs.google.com/forms/d/1iZIIxc36mxKpBi-rilgO2VtEt7TrEle0mxrRcp_oDVU/edit",
    icon: "ClipboardCheck",
  },
];

export default function AdminHome() {
  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Панель управления</p>
        <h2 className="text-2xl font-bold">Добро пожаловать, дорогое руководство ОИ!</h2>
      </div>
      <div className="flex flex-col gap-3">
        {HOME_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="group flex items-start justify-between gap-4 border border-zinc-800 hover:border-red-600/60 transition-all duration-300 px-4 py-4 overflow-hidden"
          >
            <div className="flex items-stretch gap-0">
              <div className="w-1 shrink-0 bg-red-600 group-hover:w-1.5 transition-all duration-300 mr-4 rounded-sm" />
              <div className="flex flex-col gap-1">
                <p className="text-sm text-red-400 font-semibold leading-snug">{link.title}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{link.desc}</p>
              </div>
            </div>
            <Icon name="ExternalLink" size={15} className="text-zinc-600 group-hover:text-red-400 transition-colors duration-300 shrink-0 mt-0.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
