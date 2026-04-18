import Icon from "@/components/ui/icon";

export function SaveBtn({ onClick, saved, loading }: { onClick: () => void; saved: boolean; loading?: boolean }) {
  return (
    <button onClick={onClick} disabled={loading || saved}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors">
      {saved ? <><Icon name="Check" size={14} />Сохранено</> : loading ? "Сохраняю..." : <><Icon name="Save" size={14} />Сохранить</>}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

export function Inp({ value, onChange, placeholder, className = "", onKeyDown }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string; onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onKeyDown={onKeyDown}
      className={`w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors ${className}`} />
  );
}

export function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-1">{title}</h2>
      {desc && <p className="text-zinc-500 text-sm">{desc}</p>}
    </div>
  );
}