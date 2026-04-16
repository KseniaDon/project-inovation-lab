import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { playClickSound } from "@/hooks/useSound";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`absolute top-0 left-0 right-0 z-20 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/c307311f-f41f-4364-96ce-f301e9e8e2a3.png"
            alt="Герб Невского района"
            className="w-7 sm:w-8 md:w-10 object-contain shrink-0"
            style={{ mixBlendMode: "screen", filter: "brightness(1.1) contrast(1.05)" }}
          />
          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/5538aeba-2e9c-4083-8eca-e47726470bbe.png"
            alt="Герб Минздрава"
            className="w-7 sm:w-8 md:w-10 object-contain shrink-0"
            style={{ mixBlendMode: "screen", filter: "brightness(1.1) contrast(1.05)" }}
          />
          <div className="text-white leading-tight min-w-0">
            <span className="block text-xs sm:text-sm uppercase tracking-wide font-semibold">ЦГБ Невский</span>
            <span className="block text-[10px] sm:text-xs font-normal tracking-widest opacity-70 normal-case">Отделение Интернатуры</span>
          </div>
        </div>
        <nav>
          <button
            onClick={() => { playClickSound(); navigate("/contacts"); }}
            className="flex items-center gap-1.5 text-white hover:text-red-400 transition-colors duration-300 py-2 px-1"
          >
            <Icon name="Phone" size={14} />
            <span className="hidden sm:inline uppercase text-xs md:text-sm">Руководящий состав ОИ</span>
            <span className="sm:hidden text-xs uppercase tracking-wide font-semibold">РС ОИ</span>
          </button>
        </nav>
      </div>
    </header>
  );
}