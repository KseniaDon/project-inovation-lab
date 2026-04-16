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

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
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
          style={{ filter: "grayscale(85%) brightness(0.45) blur(1.5px)" }}
        />
      </motion.div>

      <div className="relative z-10 text-center text-white flex flex-col items-center gap-5 sm:gap-7 px-4 sm:px-6 w-full max-w-2xl mx-auto">

        {/* Логотипы */}
        <div className="flex items-center gap-6 sm:gap-10 md:gap-16">
          <motion.img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/c307311f-f41f-4364-96ce-f301e9e8e2a3.png"
            alt="Герб Санкт-Петербург Невский"
            className="w-20 sm:w-32 md:w-40 lg:w-48 object-contain drop-shadow-[0_0_22px_rgba(220,38,38,0.4)]"
            style={{ mixBlendMode: "screen", filter: "brightness(1.15) contrast(1.08)" }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          />
          <motion.div
            className="h-16 sm:h-24 md:h-32 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)" }}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.3}
          />
          <motion.img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/5538aeba-2e9c-4083-8eca-e47726470bbe.png"
            alt="Герб Министерства Здравоохранения"
            className="w-20 sm:w-32 md:w-40 lg:w-48 object-contain drop-shadow-[0_0_22px_rgba(220,38,38,0.4)]"
            style={{ mixBlendMode: "screen", filter: "brightness(1.15) contrast(1.08)" }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
          />
        </div>

        {/* Табличка */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="relative w-full"
        >
          {/* Угловые акценты */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/60" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t border-r border-white/60" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-white/60" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/60" />

          <div
            className="px-6 sm:px-12 py-5 sm:py-6 flex flex-col items-center gap-2.5"
            style={{
              background: "linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.5) 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Верхний орнамент */}
            <div className="flex items-center gap-3 w-full mb-0.5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-white/40" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="w-2 h-2 rotate-45 bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.9)]" />
                <div className="w-1 h-1 rounded-full bg-white/30" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/40 to-white/40" />
            </div>

            <span className="font-light text-sm sm:text-base md:text-lg tracking-[0.25em] uppercase text-white/95">
              Министерство Здравоохранения
            </span>

            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/25" />
              <div className="w-2 h-2 rotate-45 bg-red-600 shrink-0 shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/25" />
            </div>

            <span className="text-xs sm:text-sm md:text-base tracking-[0.12em] text-white/80 font-extralight">
              Центральная Городская Больница города Невский
            </span>

            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1">
                <div className="w-6 h-px bg-gradient-to-r from-transparent to-white/35" />
                <div className="w-1.5 h-1.5 rotate-45 bg-red-600/70 shrink-0" />
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-medium text-white/55">
                Отделение Интернатуры
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rotate-45 bg-red-600/70 shrink-0" />
                <div className="w-6 h-px bg-gradient-to-l from-transparent to-white/35" />
              </div>
            </div>

            {/* Нижний орнамент */}
            <div className="flex items-center gap-3 w-full mt-0.5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-white/40" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="w-2 h-2 rotate-45 bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.9)]" />
                <div className="w-1 h-1 rounded-full bg-white/30" />
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/40 to-white/40" />
            </div>
          </div>
        </motion.div>

        {/* Подзаголовок */}
        <motion.div
          className="text-sm sm:text-base md:text-lg max-w-xl opacity-90 rich-content text-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
        >
          <RichContent html={heroData.subtitle} />
        </motion.div>

        {/* Кнопки */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.75}
        >
          <button
            onClick={() => { playClickSound(); navigate("/learn"); }}
            className="hover-pulse-outline group relative flex items-center justify-center gap-3 bg-red-700 hover:bg-red-800 text-white w-full sm:w-auto px-8 py-3.5 sm:py-4 text-sm uppercase tracking-widest font-bold transition-all duration-300 shadow-lg shadow-red-900/30 hover:shadow-red-800/50 hover:scale-105"
          >
            <Icon name="BookOpen" size={18} className="relative transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="relative">{heroData.buttonText}</span>
            <Icon name="ArrowRight" size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => {
              playClickSound();
              const hasSession = localStorage.getItem("admin_token") && localStorage.getItem("admin_nickname");
              navigate(hasSession ? "/admin" : "/admin/login");
            }}
            className="hover-pulse-outline flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white/60 hover:text-white w-full sm:w-auto px-6 py-3.5 sm:py-4 text-xs uppercase tracking-widest font-medium transition-all duration-300"
          >
            <Icon name="UserCog" size={16} />Для РС ОИ
          </button>
        </motion.div>
      </div>
    </div>
  );
}