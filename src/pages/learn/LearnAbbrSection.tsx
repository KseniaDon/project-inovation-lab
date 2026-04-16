import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import { defaultAbbr, AbbrItem } from "@/pages/admin/adminTypes";

interface LearnAbbrSectionProps {
  go: (id: SectionId) => void;
}

export default function LearnAbbrSection({ go }: LearnAbbrSectionProps) {
  const ABBR = useSiteData<AbbrItem[]>("abbr", defaultAbbr);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-commands")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к командам
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 1: Подготовка</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Аббревиатуры</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">1.4. Аббревиатуры</p>

      <ul className="flex flex-col gap-2">
        {ABBR.map(({ abbr, full }) => (
          <li key={abbr} className="flex items-start gap-2 text-sm text-foreground">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
            <span>
              <span className="font-bold text-red-500">{abbr}</span>
              {" — "}
              {full}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы на госпортале по аббревиатурам:{" "}
        <a
          href="https://forum.gtaprovince.ru/topic/995733-cgb-g-nevskiy-informacionnyy-razdel/?do=findComment&comment=6982139"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium"
        >
          Раздел 1. Аббревиатуры.
          <Icon name="ExternalLink" size={13} />
        </a>
      </p>
    </div>
  );
}