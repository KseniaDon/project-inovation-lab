import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import { useSiteData } from "@/hooks/useSiteData";
import Icon from "@/components/ui/icon";

export type WhatsNewEntry = {
  date: string;
  title: string;
  desc: string;
  link?: string;
  linkLabel?: string;
  linkExternal?: boolean;
};

const defaultEntries: WhatsNewEntry[] = [];

export default function WhatsNew() {
  const entries = useSiteData<WhatsNewEntry[]>("whats_new", defaultEntries);
  const navigate = useNavigate();

  if (!entries || entries.length === 0) return null;

  return (
    <section className="bg-background border-t border-border px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">Обновления</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Что нового</h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="group border border-border hover:border-[hsl(var(--red-border)/0.5)] transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-stretch">
                <div className="w-1 shrink-0 bg-red-600 group-hover:w-1.5 transition-all duration-300" />
                <div className="flex-1 px-5 py-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{entry.date}</p>
                  </div>
                  <p className="text-base font-bold text-foreground">{entry.title}</p>
                  {entry.desc && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.desc}</p>
                  )}
                  {entry.link && (
                    entry.linkExternal ? (
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playClickSound}
                        className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium mt-1 w-fit"
                      >
                        <Icon name="ExternalLink" size={13} />
                        {entry.linkLabel || "Перейти"}
                      </a>
                    ) : (
                      <button
                        onClick={() => { playClickSound(); navigate(entry.link!); }}
                        className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium mt-1 w-fit"
                      >
                        <Icon name="ArrowRight" size={13} />
                        {entry.linkLabel || "Перейти"}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
