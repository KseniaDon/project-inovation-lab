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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <Icon name="ArrowLeft" size={16} />
          На главную
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-6 sm:mb-10">Руководящий состав ОИ</h1>
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
              className="hover-pulse-outline group block border border-border hover:border-[hsl(var(--red-border-hover))] transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="flex items-stretch">
                <div className={`w-1 shrink-0 ${person.badgeColor} group-hover:w-1.5 transition-all duration-300`} />
                <div className="flex-1 px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-1.5 sm:gap-2 min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">
                    {person.role}
                  </p>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-red-500 transition-colors duration-300 truncate">
                    {person.name}
                  </p>
                </div>
                <div className="flex items-center pr-3 sm:pr-4 md:pr-6 gap-2 shrink-0">
                  <span className={`text-xs uppercase tracking-wider text-white px-2 py-1 ${person.badgeColor} font-semibold hidden xs:inline sm:inline`}>
                    {person.badge}
                  </span>
                  <Icon name="ExternalLink" size={14} className="text-muted-foreground group-hover:text-red-400 transition-colors duration-300" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 border border-[hsl(var(--red-border)/0.4)] bg-[hsl(var(--red-bg-subtle))] px-5 py-4 flex gap-3 items-start"
        >
          <Icon name="TriangleAlert" size={18} className="text-[hsl(var(--red-border))] shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/75 leading-relaxed">
            <span className="font-bold uppercase tracking-wide text-[hsl(var(--red-border))]">Внимание:</span>{" "}
            Соблюдайте иерархию и субординацию при обращении к Вашему руководству отделения. Также, напоминаем, что проверка отчёта производится в течение 24-х часов с момента опубликования заявления.
          </p>
        </motion.div>

      </div>
    </div>
  );
}