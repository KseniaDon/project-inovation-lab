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
        <img
          src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/9e862ab9-9ec9-4b2e-a45e-db112feda735.png"
          alt="Логотип ЦГБ Невский"
          className="w-44 md:w-60 lg:w-72 object-contain"
          style={{ mixBlendMode: "screen", filter: "brightness(1.1) contrast(1.05)" }}
        />
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