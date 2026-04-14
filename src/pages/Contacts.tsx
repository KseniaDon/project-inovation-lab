import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "@/components/ui/icon";
import { playClickSound } from "@/hooks/useSound";
import { useSiteData } from "@/hooks/useSiteData";

type StaffMember = { role: string; name: string; nickname: string; href: string; badge: string; badgeColor: string };

const defaultStaff: StaffMember[] = [
  { role: "Куратор Отделения Интернатуры", name: "Ksenia Donskaya", nickname: "Ksenia_Donskaya", href: "https://vk.ru/soul__shu", badge: "Куратор", badgeColor: "bg-red-600" },
  { role: "Заместитель Заведующего ОИ", name: "Egor Maslow", nickname: "Egor_Maslow", href: "https://vk.ru/cccuvigon", badge: "Зам. Зав.", badgeColor: "bg-zinc-700" },
  { role: "Заместитель Заведующего ОИ", name: "Andrei Schmidt", nickname: "Andrei_Schmidt", href: "https://vk.com/id392167605", badge: "Зам. Зав.", badgeColor: "bg-zinc-700" },
];

export default function Contacts() {
  const navigate = useNavigate();
  const staff = useSiteData<StaffMember[]>("staff", defaultStaff);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="max-w-2xl mx-auto px-6 py-16 w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <Icon name="ArrowLeft" size={16} />
          На главную
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-10">Руководящий состав ОИ</h1>
        </motion.div>

        <div className="flex flex-col gap-4">
          {staff.map((person, i) => (
            <motion.a
              key={person.nickname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              href={person.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="group block border border-border hover:border-red-600/60 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="flex items-stretch">
                <div className={`w-1 shrink-0 ${person.badgeColor} group-hover:w-1.5 transition-all duration-300`} />
                <div className="flex-1 px-6 py-5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {person.role}
                    </p>
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-foreground group-hover:text-red-500 transition-colors duration-300">
                    {person.name}
                  </p>
                </div>
                <div className="flex items-center pr-4 md:pr-6 gap-2 md:gap-3 shrink-0">
                  <Icon name="ExternalLink" size={15} className="text-muted-foreground group-hover:text-red-400 transition-colors duration-300" />
                  <span className={`text-xs uppercase tracking-wider text-white px-2 md:px-2.5 py-1 ${person.badgeColor} font-semibold hidden sm:inline`}>
                    {person.badge}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}