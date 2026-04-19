import { useState } from "react";
import Icon from "@/components/ui/icon";

export function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
      >
        <span>{label}</span>
        <Icon
          name="ChevronDown"
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-border text-sm text-foreground leading-relaxed flex flex-col gap-4">
          {children}
        </div>
      )}
    </div>
  );
}

export function SubAccordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
      >
        <span>{label}</span>
        <Icon
          name="ChevronDown"
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-2 px-3 pb-3 pt-2 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}

export function CopyRow({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copied) { setCopied(false); return; }
    const write = () => {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      } catch (e) { void e; }
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(write);
    } else {
      write();
    }
    setCopied(true);
  };

  return (
    <button
      onClick={handleCopy}
      title="Нажмите, чтобы скопировать"
      className={`flex items-start justify-between gap-2 w-full text-left rounded-sm px-3 py-2 border transition-all duration-150 group ${
        copied
          ? "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600"
          : "bg-secondary border-border hover:bg-secondary/80"
      }`}
    >
      <code className={`text-xs font-mono flex-1 leading-relaxed transition-colors duration-150 ${copied ? "text-green-700 dark:text-green-300" : "text-muted-foreground"}`}>
        {text}
      </code>
      <Icon
        name={copied ? "Check" : "Copy"}
        size={14}
        className={`shrink-0 mt-0.5 transition-colors duration-150 ${copied ? "text-green-600 dark:text-green-400" : "text-muted-foreground group-hover:text-foreground"}`}
      />
    </button>
  );
}

export function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 px-4 py-3">
      <Icon name="TriangleAlert" size={18} className="text-orange-500 shrink-0 mt-0.5" />
      <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed">{children}</p>
    </div>
  );
}
