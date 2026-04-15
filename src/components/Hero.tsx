import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import { useSiteData } from "@/hooks/useSiteData";
import Icon from "@/components/ui/icon";
import RichContent from "@/components/ui/rich-content";

const defaultHero = {
  subtitle: "Методическое пособие для сотрудников отделения. Всё, что нужно знать с первого дня службы.",
  buttonText: "Перейти к обучению",
};

export default function Hero() {
  const heroData = useSiteData("hero", defaultHero);
  const container = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "20vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://sun9-14.userapi.com/s/v1/ig2/oh9odkGbAUAKfEAPiLIT71AH3kiwlI3zMF9KfjDou7lJS_7y75faZ-icfreo8zqOMDQhKC2fFVRhwvh4aq7ag5Co.jpg?quality=95&as=32x17,48x25,72x38,108x57,160x85,240x127,360x191,480x255,540x286,640x340,720x382,1080x573,1280x679,1440x764,1919x1018&from=bu&u=EhFT96MoKQ5BFfhQ6lJs2ReadKrPQert1dApP3wydVA&cs=1919x0"
          alt="Background"
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(40%) brightness(0.45) blur(2px)" }}
        />
      </motion.div>

      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 text-white/80">
        <span className="text-xs font-bold uppercase tracking-widest text-red-400">#1 MTA PROVINCE</span>
      </div>

      <div className="relative z-10 text-center text-white flex flex-col items-center gap-6 px-6">
        {/* Логотип в медицинской рамке */}
        <div className="relative w-44 md:w-60 lg:w-72 p-5">

          {/* Угловые крестики */}
          {[
            "-top-4 -left-4",
            "-top-4 -right-4",
            "-bottom-4 -left-4",
            "-bottom-4 -right-4",
          ].map((pos, i) => (
            <svg key={i} className={`absolute ${pos} w-8 h-8 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]`} viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="20" rx="1.5" fill="#ef4444" opacity="0.9"/>
              <rect x="2" y="9" width="20" height="6" rx="1.5" fill="#ef4444" opacity="0.9"/>
              <rect x="9" y="2" width="6" height="20" rx="1.5" fill="url(#cg)" opacity="0.4"/>
              <rect x="2" y="9" width="20" height="6" rx="1.5" fill="url(#cg)" opacity="0.4"/>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff"/>
                  <stop offset="100%" stopColor="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          ))}

          {/* Угловые линии — только по углам, не полная рамка */}
          {/* Верхний левый */}
          <div className="absolute top-0 left-0 w-6 h-px bg-gradient-to-r from-red-500/80 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-6 bg-gradient-to-b from-red-500/80 to-transparent" />
          {/* Верхний правый */}
          <div className="absolute top-0 right-0 w-6 h-px bg-gradient-to-l from-red-500/80 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-6 bg-gradient-to-b from-red-500/80 to-transparent" />
          {/* Нижний левый */}
          <div className="absolute bottom-0 left-0 w-6 h-px bg-gradient-to-r from-red-500/80 to-transparent" />
          <div className="absolute bottom-0 left-0 w-px h-6 bg-gradient-to-t from-red-500/80 to-transparent" />
          {/* Нижний правый */}
          <div className="absolute bottom-0 right-0 w-6 h-px bg-gradient-to-l from-red-500/80 to-transparent" />
          <div className="absolute bottom-0 right-0 w-px h-6 bg-gradient-to-t from-red-500/80 to-transparent" />

          {/* Тонкая горизонтальная линия посередине рамки сверху и снизу */}
          <div className="absolute -top-2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          <div className="absolute -bottom-2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/9e862ab9-9ec9-4b2e-a45e-db112feda735.png"
            alt="Логотип ЦГБ Невский"
            className="w-full object-contain relative z-10"
            style={{ mixBlendMode: "screen", filter: "brightness(1.1) contrast(1.05)" }}
          />
        </div>
        <div className="text-base md:text-lg max-w-xl opacity-90 rich-content text-center">
          <RichContent html={heroData.subtitle} />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <button
            onClick={() => { playClickSound(); navigate("/learn"); }}
            className="hover-pulse-outline group relative flex items-center gap-3 bg-red-700 hover:bg-red-800 text-white px-10 py-4 text-sm uppercase tracking-widest font-bold transition-all duration-300 shadow-lg shadow-red-900/30 hover:shadow-red-800/50 hover:scale-105"
          >
            <Icon name="BookOpen" size={18} className="relative transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="relative">{heroData.buttonText}</span>
            <Icon name="ArrowRight" size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => { playClickSound(); navigate("/admin/login"); }}
            className="hover-pulse-outline flex items-center gap-2 border border-white/30 hover:border-white/60 text-white/60 hover:text-white px-6 py-4 text-xs uppercase tracking-widest font-medium transition-all duration-300"
          >
            <Icon name="UserCog" size={16} />Для РС ОИ
          </button>
        </div>
      </div>
    </div>
  );
}