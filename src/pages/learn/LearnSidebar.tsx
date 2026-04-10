import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionId, NAV } from "./learnConfig";

interface LearnSidebarProps {
  active: SectionId;
  go: (id: SectionId) => void;
}

const ACCORDION_PARENTS: SectionId[] = ["intern", "feldsher"];

export default function LearnSidebar({ active, go }: LearnSidebarProps) {
  const isInternActive = NAV.some((n) => n.parent === "intern" && n.id === active) || active === "intern";
  const isFeldsherActive = active === "feldsher";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    intern: isInternActive,
    feldsher: isFeldsherActive,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const topItems = NAV.filter((item) => !item.parent && !ACCORDION_PARENTS.includes(item.id));

  return (
    <aside className="w-64 shrink-0 border-r border-border flex flex-col py-6 sticky top-0 h-screen overflow-y-auto">
      <p className="px-5 text-xs uppercase tracking-widest text-muted-foreground mb-3">Разделы</p>
      <nav className="flex flex-col gap-0.5 px-3">

        {/* Вступление и прочие top-level не-аккордеон */}
        {topItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left rounded-none
                ${isActive
                  ? "bg-red-600/10 text-red-500 border-l-2 border-red-600"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
                }`}
            >
              <Icon name={item.icon as "Flag"} size={16} className={isActive ? "text-red-500" : ""} />
              {item.label}
            </button>
          );
        })}

        {/* Аккордеон: Интерн */}
        <div className="flex flex-col">
          <button
            onClick={() => { toggleGroup("intern"); if (!openGroups["intern"]) go("intern"); }}
            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 text-sm transition-colors text-left rounded-none
              ${active === "intern"
                ? "bg-red-600/10 text-red-500 border-l-2 border-red-600"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
              }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon name="GraduationCap" size={16} className={active === "intern" ? "text-red-500" : ""} />
              Интерн
            </span>
            <Icon
              name="ChevronDown"
              size={14}
              className={`shrink-0 transition-transform duration-200 ${openGroups["intern"] ? "rotate-180" : ""}`}
            />
          </button>

          {openGroups["intern"] && (
            <div className="flex flex-col gap-0.5">
              {NAV.filter((n) => n.parent === "intern").map((item) => {
                const isActive = active === item.id;
                return (
                  <div key={item.id}>
                    {item.divider && (
                      <p className="px-3 pt-3 pb-1 text-xs text-zinc-500 uppercase tracking-widest select-none">
                        {item.divider}
                      </p>
                    )}
                    <button
                      onClick={() => go(item.id)}
                      className={`w-full flex items-center gap-2.5 ml-4 pl-3 pr-3 py-2.5 text-xs transition-colors text-left rounded-none
                        ${isActive
                          ? "bg-red-600/10 text-red-500 border-l-2 border-red-600"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
                        }`}
                    >
                      <Icon name={item.icon as "Flag"} size={14} className={isActive ? "text-red-500" : ""} />
                      {item.label}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Аккордеон: Фельдшер */}
        <div className="flex flex-col">
          <button
            onClick={() => { toggleGroup("feldsher"); if (!openGroups["feldsher"]) go("feldsher"); }}
            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 text-sm transition-colors text-left rounded-none
              ${active === "feldsher"
                ? "bg-red-600/10 text-red-500 border-l-2 border-red-600"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
              }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon name="Stethoscope" size={16} className={active === "feldsher" ? "text-red-500" : ""} />
              Фельдшер
            </span>
            <Icon
              name="ChevronDown"
              size={14}
              className={`shrink-0 transition-transform duration-200 ${openGroups["feldsher"] ? "rotate-180" : ""}`}
            />
          </button>

          {openGroups["feldsher"] && (
            <div className="flex flex-col gap-0.5">
              {NAV.filter((n) => n.parent === "feldsher").map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={`w-full flex items-center gap-2.5 ml-4 pl-3 pr-3 py-2.5 text-xs transition-colors text-left rounded-none
                      ${isActive
                        ? "bg-red-600/10 text-red-500 border-l-2 border-red-600"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
                      }`}
                  >
                    <Icon name={item.icon as "Flag"} size={14} className={isActive ? "text-red-500" : ""} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </nav>
    </aside>
  );
}
