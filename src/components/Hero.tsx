import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
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
        />
      </motion.div>

      <div className="relative z-10 text-center text-white flex flex-col items-center gap-6 px-6">
        <img
          src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/9e862ab9-9ec9-4b2e-a45e-db112feda735.png"
          alt="Логотип ЦГБ Невский"
          className="w-44 md:w-60 lg:w-72 object-contain drop-shadow-2xl"
        />
        <p className="text-base md:text-lg max-w-xl opacity-90">
          Методическое пособие для сотрудников отделения. Всё, что нужно знать с первого дня службы.
        </p>
        <button
          onClick={() => navigate("/learn")}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-sm uppercase tracking-widest font-semibold transition-all duration-300"
        >
          Перейти к обучению
        </button>
      </div>
    </div>
  );
}