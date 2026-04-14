import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import { useSiteData } from "@/hooks/useSiteData";
import { defaultActivityData } from "@/pages/admin/adminTypes";

interface LearnActivitySectionProps {
  go: (id: SectionId) => void;
}

export default function LearnActivitySection({ go }: LearnActivitySectionProps) {
  const activity = useSiteData("activity", defaultActivityData);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("intern-floors")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к распределению этажей
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 2: Устав и правила</p>
        <h1 className="text-3xl font-bold">Журнал активности (ЖА)</h1>
      </div>

      <p className="text-base font-semibold text-muted-foreground">2.3. Журнал Активности (ЖА) и система AFK</p>

      <p className="text-base text-foreground leading-relaxed">
        В больнице существует Журнал Активности (ЖА).
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 bg-green-950/30 border border-green-700/50 rounded-sm px-4 py-3">
          <Icon name="LogIn" size={16} className="text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">
            При заступлении на смену —{" "}
            <code className="bg-green-900/40 border border-green-700/50 rounded px-1.5 py-0.5 text-xs font-mono text-green-300">!онлайн</code>.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-red-950/30 border border-red-700/50 rounded-sm px-4 py-3">
          <Icon name="LogOut" size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-foreground">
            Когда выходите из игры полностью —{" "}
            <code className="bg-red-900/40 border border-red-700/50 rounded px-1.5 py-0.5 text-xs font-mono text-red-300">!вышел</code>.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-yellow-950/30 border border-yellow-700/50 rounded-sm px-4 py-3">
          <Icon name="Clock" size={16} className="text-yellow-400 shrink-0" />
          <p className="text-sm text-foreground">
            Когда покидаете смену (AFK) —{" "}
            <code className="bg-yellow-900/40 border border-yellow-700/50 rounded px-1.5 py-0.5 text-xs font-mono text-yellow-300">!афк</code>.
          </p>
        </div>
      </div>

      <p className="text-base text-foreground leading-relaxed">
        За несоответствие ЖА Вас могут наказать, поэтому внимательно следите за тем, чтобы качественно вести его.
      </p>

      <div className="flex flex-col gap-3">
        <p className="text-base font-bold text-foreground">Правила AFK</p>
        <ul className="flex flex-col gap-2">
          {activity.afk_rules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${idx === 0 ? "bg-green-500" : idx === 1 ? "bg-orange-500" : "bg-red-500"}`} />
              {rule}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Ссылка на Журнал Активности:{" "}
          <a href={activity.ja_link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium">
            Сайт ЖА <Icon name="ExternalLink" size={13} />
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          Приложение на ПК Журнала Активности:{" "}
          <a href={activity.app_link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium">
            Приложение ЖА <Icon name="ExternalLink" size={13} />
          </a>
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Информационный раздел нашей больницы на госпортале по системе АФК:{" "}
        <a href={activity.forum_link} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors font-medium">
          Раздел 9. Журнал Активности. <Icon name="ExternalLink" size={13} />
        </a>
      </p>
    </div>
  );
}