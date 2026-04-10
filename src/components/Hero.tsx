import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";

const HERO_KEY = "admin_hero";
const defaultHero = {
  subtitle: "Методическое пособие для сотрудников отделения. Всё, что нужно знать с первого дня службы.",
  buttonText: "Перейти к обучению",
};

export default function Hero() {
  const heroData = (() => {
    try { return JSON.parse(localStorage.getItem(HERO_KEY) || "null") || defaultHero; }
    catch { return defaultHero; }
  })();

  const container = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);

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
          src="/images/mountain-landscape.jpg"
          alt="Mountain landscape"
          className="w-full h-full object-cover brightness-50"
          style={{ filter: "grayscale(100%) blur(3px) brightness(0.45)" }}
        />
      </motion.div>

      <div className="relative z-10 text-center text-white flex flex-col items-center gap-6 px-6">
        <img
          src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/9e862ab9-9ec9-4b2e-a45e-db112feda735.png"
          alt="Логотип ЦГБ Невский"
          className="w-44 md:w-60 lg:w-72 object-contain"
          style={{ mixBlendMode: "screen", filter: "brightness(1.1) contrast(1.05)" }}
        />
        <p className="text-base md:text-lg max-w-xl opacity-90">
          {heroData.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <button
            onClick={() => { playClickSound(); navigate("/learn"); }}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-sm uppercase tracking-widest font-semibold transition-all duration-300"
          >
            {heroData.buttonText}
          </button>
          <button
            onClick={() => { playClickSound(); navigate("/admin/login"); }}
            className="border border-white/30 hover:border-white/60 text-white/60 hover:text-white px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all duration-300"
          >
            Для администрации
          </button>
        </div>
      </div>
    </div>
  );
}