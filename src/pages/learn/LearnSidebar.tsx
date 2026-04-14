import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { SectionId, NAV } from "./learnConfig";

interface LearnSidebarProps {
  active: SectionId;
  go: (id: SectionId) => void;
}

const ACCORDION_PARENTS: SectionId[] = ["intern", "feldsher"];

function SidebarContent({ active, go, onClose }: { active: SectionId; go: (id: SectionId) => void; onClose?: () => void }) {
  const isInternActive = NAV.some((n) => n.parent === "intern" && n.id === active) || active === "intern";
  const isFeldsherActive = NAV.some((n) => n.parent === "feldsher" && n.id === active) || active === "feldsher";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    intern: isInternActive,
    feldsher: isFeldsherActive,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const topItems = NAV.filter((item) => !item.parent && !ACCORDION_PARENTS.includes(item.id));

  const handleGo = (id: SectionId) => {
    go(id);
    onClose?.();
  };

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {topItems.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleGo(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 text-base font-semibold transition-colors text-left rounded-none
              ${isActive
                ? "bg-[hsl(var(--red-border)/0.1)] text-[hsl(var(--red-border))] border-l-2 border-[hsl(var(--red-border))]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
              }`}
          >
            <span className="relative flex shrink-0">
              {isActive && <span className="absolute inset-0 animate-ping rounded-full bg-[hsl(var(--red-border))] opacity-30" />}
              <Icon name={item.icon as "Flag"} size={18} className={isActive ? "text-[hsl(var(--red-border))]" : ""} />
            </span>
            {item.label}
          </button>
        );
      })}

      {/* Аккордеон: Интерн */}
      <div className="flex flex-col">
        <button
          onClick={() => { toggleGroup("intern"); if (!openGroups["intern"]) handleGo("intern"); }}
          className={`w-full flex items-center justify-between gap-3 px-3 py-3 text-base font-semibold transition-colors text-left rounded-none
            ${isInternActive
              ? "bg-[hsl(var(--red-border)/0.1)] text-[hsl(var(--red-border))] border-l-2 border-[hsl(var(--red-border))]"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
            }`}
        >
          <span className="flex items-center gap-3">
            <span className="relative flex shrink-0">
              {isInternActive && <span className="absolute inset-0 animate-ping rounded-full bg-[hsl(var(--red-border))] opacity-30" />}
              <Icon name="GraduationCap" size={18} className={isInternActive ? "text-[hsl(var(--red-border))]" : ""} />
            </span>
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
                    onClick={() => handleGo(item.id)}
                    className={`w-full flex items-center gap-2.5 ml-4 pl-3 pr-3 py-2.5 text-sm font-medium transition-colors text-left rounded-none
                      ${isActive
                        ? "bg-[hsl(var(--red-border)/0.1)] text-[hsl(var(--red-border))] border-l-2 border-[hsl(var(--red-border))] font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
                      }`}
                  >
                    <span className="relative flex shrink-0">
                      {isActive && <span className="absolute inset-0 animate-ping rounded-full bg-[hsl(var(--red-border))] opacity-30" />}
                      <Icon name={item.icon as "Flag"} size={15} className={isActive ? "text-[hsl(var(--red-border))]" : ""} />
                    </span>
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
          onClick={() => { toggleGroup("feldsher"); if (!openGroups["feldsher"]) handleGo("feldsher"); }}
          className={`w-full flex items-center justify-between gap-3 px-3 py-3 text-base font-semibold transition-colors text-left rounded-none
            ${isFeldsherActive
              ? "bg-[hsl(var(--red-border)/0.1)] text-[hsl(var(--red-border))] border-l-2 border-[hsl(var(--red-border))]"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
            }`}
        >
          <span className="flex items-center gap-3">
            <span className="relative flex shrink-0">
              {isFeldsherActive && <span className="absolute inset-0 animate-ping rounded-full bg-[hsl(var(--red-border))] opacity-30" />}
              <Icon name="Stethoscope" size={18} className={isFeldsherActive ? "text-[hsl(var(--red-border))]" : ""} />
            </span>
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
                <div key={item.id}>
                  {item.divider && (
                    <p className="px-3 pt-3 pb-1 text-xs text-zinc-500 uppercase tracking-widest select-none">
                      {item.divider}
                    </p>
                  )}
                  <button
                    onClick={() => handleGo(item.id)}
                    className={`w-full flex items-center gap-2.5 ml-4 pl-3 pr-3 py-2.5 text-sm font-medium transition-colors text-left rounded-none
                      ${isActive
                        ? "bg-[hsl(var(--red-border)/0.1)] text-[hsl(var(--red-border))] border-l-2 border-[hsl(var(--red-border))] font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border-l-2 border-transparent"
                      }`}
                  >
                    <span className="relative flex shrink-0">
                      {isActive && <span className="absolute inset-0 animate-ping rounded-full bg-[hsl(var(--red-border))] opacity-30" />}
                      <Icon name={item.icon as "Flag"} size={15} className={isActive ? "text-[hsl(var(--red-border))]" : ""} />
                    </span>
                    {item.label}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

function SidebarSearch({ go }: { go: (id: SectionId) => void }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<typeof NAV>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (val: string) => {
    setSearch(val);
    if (!val.trim()) { setResults([]); return; }
    setResults(NAV.filter(n => n.label.toLowerCase().includes(val.toLowerCase())));
  };

  const handleGo = (id: SectionId) => {
    go(id);
    setSearch("");
    setResults([]);
  };

  return (
    <div className="relative px-3 mb-3">
      <div className="flex items-center gap-2 bg-muted border border-border rounded px-3 py-2 focus-within:border-red-500 transition-colors">
        <Icon name="Search" size={14} className="text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          value={search}
          onChange={e => handleChange(e.target.value)}
          placeholder="Поиск по разделам..."
          className="bg-transparent text-xs outline-none flex-1 text-foreground placeholder:text-muted-foreground"
        />
        {search && (
          <button onClick={() => handleChange("")}>
            <Icon name="X" size={12} className="text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      {results.length > 0 && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-popover border border-border rounded shadow-lg z-50 py-1 max-h-52 overflow-y-auto">
          {results.map(r => (
            <button
              key={r.id}
              onClick={() => handleGo(r.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors text-left"
            >
              <Icon name={r.icon as "Home"} size={13} className="text-red-500 shrink-0" />
              {r.label}
            </button>
          ))}
        </div>
      )}
      {search.trim() && results.length === 0 && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-popover border border-border rounded shadow-lg z-50 py-3 text-center text-xs text-muted-foreground">
          Ничего не найдено
        </div>
      )}
    </div>
  );
}

export default function LearnSidebar({ active, go }: LearnSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = NAV.find((n) => n.id === active)?.label ?? "Меню";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-border flex-col py-6 sticky top-0 h-screen overflow-y-auto">
        <p className="px-5 text-xs uppercase tracking-widest text-muted-foreground mb-3">Разделы</p>
        <SidebarSearch go={go} />
        <SidebarContent active={active} go={go} />
      </aside>

      {/* Mobile: bottom bar button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground truncate max-w-[60%]">{activeLabel}</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm text-foreground font-medium"
        >
          <Icon name="Menu" size={18} />
          Разделы
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative ml-auto w-72 max-w-[85vw] bg-background h-full flex flex-col overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Разделы</p>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="py-4">
              <SidebarContent active={active} go={go} onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}