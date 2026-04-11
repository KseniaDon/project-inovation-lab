import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import { useSiteData } from "@/hooks/useSiteData";
import Icon from "@/components/ui/icon";

type StaffMember = { role: string; name: string; nickname: string; href: string; badge: string; badgeColor: string };

const defaultStaff: StaffMember[] = [
  { role: "Куратор Отделения Интернатуры", name: "Ksenia Donskaya", nickname: "Ksenia_Donskaya", href: "https://vk.ru/soul__shu", badge: "Куратор", badgeColor: "bg-red-600" },
  { role: "Заместитель Заведующего ОИ", name: "Egor Maslow", nickname: "Egor_Maslow", href: "https://vk.ru/cccuvigon", badge: "Зам. Зав.", badgeColor: "bg-zinc-700" },
  { role: "Заместитель Заведующего ОИ", name: "Andrei Schmidt", nickname: "Andrei_Schmidt", href: "https://vk.com/id392167605", badge: "Зам. Зав.", badgeColor: "bg-zinc-700" },
];

export default function MobileStaff() {
  const navigate = useNavigate();
  const staff = useSiteData<StaffMember[]>("staff", defaultStaff);

  return (
    <section className="sm:hidden bg-background border-t border-border px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="UserTie" size={16} className="text-red-500 shrink-0" fallback="User" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">РС ОИ</h2>
      </div>

      <div className="flex flex-col gap-2">
        {staff.map((person) => (
          <a
            key={person.nickname}
            href={person.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="group flex items-center gap-3 border border-border hover:border-red-600/50 transition-all duration-200 px-3 py-3 overflow-hidden"
          >
            <div className={`w-1 h-full shrink-0 ${person.badgeColor} self-stretch min-h-[2.5rem]`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider truncate">{person.role}</p>
              <p className="text-sm font-bold text-foreground group-hover:text-red-500 transition-colors truncate">{person.name}</p>
            </div>
            <Icon name="ExternalLink" size={13} className="text-muted-foreground group-hover:text-red-400 transition-colors shrink-0" />
          </a>
        ))}
      </div>

      <button
        onClick={() => { playClickSound(); navigate("/contacts"); }}
        className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
      >
        Полная страница состава →
      </button>
    </section>
  );
}
