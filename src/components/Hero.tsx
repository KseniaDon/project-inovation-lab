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

const ANIM = `
@keyframes bcn-l {
  0%, 100% { opacity: 0.08; box-shadow: 0 0 2px 1px #60c8ff44; }
  50%       { opacity: 1;    box-shadow: 0 0 6px 3px #60c8ff, 0 0 16px 7px #60c8ffaa, 0 0 28px 12px #60c8ff33; }
}
@keyframes bcn-r {
  0%, 100% { opacity: 1;    box-shadow: 0 0 6px 3px #60c8ff, 0 0 16px 7px #60c8ffaa, 0 0 28px 12px #60c8ff33; }
  50%       { opacity: 0.08; box-shadow: 0 0 2px 1px #60c8ff44; }
}
@keyframes hl {
  0%, 60%    { opacity: 0; box-shadow: none; }
  63%, 72%   { opacity: 1; box-shadow: 0 0 5px 2px #ffffffcc, 0 0 14px 5px #ffffff66; }
  75%, 100%  { opacity: 0; box-shadow: none; }
}
`;

/* Пара маячков на одной машине — мигают попеременно */
function BeaconPair({ left, top }: { left: string; top: string }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#60c8ff",
    transform: "translate(-50%, -50%)",
  };
  return (
    <>
      <div style={{ ...base, left, top, animation: "bcn-l 0.85s ease-in-out infinite" }} />
      <div style={{ ...base, left: `calc(${left} + 8px)`, top, animation: "bcn-r 0.85s ease-in-out infinite" }} />
    </>
  );
}

/* Одна фара автобуса */
function Headlight({ left, top, delay }: { left: string; top: string; delay: string }) {
  return (
    <div style={{
      position: "absolute", left, top,
      width: 7, height: 4, borderRadius: "2px",
      background: "#ffffff",
      transform: "translate(-50%, -50%)",
      animation: `hl 4s ease-in-out ${delay} infinite`,
    }} />
  );
}

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
      <style>{ANIM}</style>

      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://sun9-14.userapi.com/s/v1/ig2/oh9odkGbAUAKfEAPiLIT71AH3kiwlI3zMF9KfjDou7lJS_7y75faZ-icfreo8zqOMDQhKC2fFVRhwvh4aq7ag5Co.jpg?quality=95&as=32x17,48x25,72x38,108x57,160x85,240x127,360x191,480x255,540x286,640x340,720x382,1080x573,1280x679,1440x764,1919x1018&from=bu&u=EhFT96MoKQ5BFfhQ6lJs2ReadKrPQert1dApP3wydVA&cs=1919x0"
          alt="Background"
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(35%) brightness(0.42) sepia(20%) hue-rotate(-15deg) saturate(120%)" }}
        />

        {/* Красный оттенок-оверлей */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(80, 0, 0, 0.18)",
          pointerEvents: "none",
        }} />

        {/* Маячки АСМП — 3 машины, крыши (дальняя → ближняя, слева направо) */}
        <BeaconPair left="33%" top="37%" />
        <BeaconPair left="42%" top="35%" />
        <BeaconPair left="52%" top="33%" />

        {/* Фары автобуса — 4 лампочки */}
        <Headlight left="63%"   top="58%" delay="0s" />
        <Headlight left="65.5%" top="58%" delay="0.05s" />
        <Headlight left="74%"   top="58%" delay="0.1s" />
        <Headlight left="76.5%" top="58%" delay="0.15s" />
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
            onClick={() => {
              playClickSound();
              const hasSession = localStorage.getItem("admin_token") && localStorage.getItem("admin_nickname");
              navigate(hasSession ? "/admin" : "/admin/login");
            }}
            className="hover-pulse-outline flex items-center gap-2 border border-white/30 hover:border-white/60 text-white/60 hover:text-white px-6 py-4 text-xs uppercase tracking-widest font-medium transition-all duration-300"
          >
            <Icon name="UserCog" size={16} />Для РС ОИ
          </button>
        </div>
      </div>
    </div>
  );
}