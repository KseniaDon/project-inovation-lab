import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { playClickSound } from "@/hooks/useSound";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className={`absolute top-0 left-0 right-0 z-20 px-4 md:px-6 py-4 md:py-6 ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <div className="text-white text-sm uppercase tracking-wide font-semibold leading-tight">
          <span className="block">ЦГБ Невский</span>
          <span className="block text-xs font-normal tracking-widest opacity-70 normal-case">Отделение Интернатуры</span>
        </div>
        <nav className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => { playClickSound(); navigate("/contacts"); }}
            className="hidden sm:block text-white hover:text-red-400 transition-colors duration-300 uppercase text-xs md:text-sm"
          >
            Руководящий состав ОИ
          </button>
          <a
            href="#contact"
            onClick={playClickSound}
            className="hidden sm:block text-white hover:text-red-400 transition-colors duration-300 uppercase text-xs md:text-sm"
          >
            Правила
          </a>
          <button
            onClick={() => { playClickSound(); navigate("/contacts"); }}
            className="sm:hidden flex items-center gap-1.5 text-white hover:text-red-400 transition-colors duration-300 p-1"
            aria-label="Руководящий состав ОИ"
          >
            <Icon name="Phone" size={16} />
            <span className="text-xs uppercase tracking-wide font-semibold">РС ОИ</span>
          </button>
          <button
            onClick={() => { playClickSound(); toggleTheme(); }}
            className="text-white hover:text-red-400 transition-colors duration-300 p-1"
            aria-label="Переключить тему"
          >
            <Icon name={dark ? "Sun" : "Moon"} size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}