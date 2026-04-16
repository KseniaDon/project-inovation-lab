import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.2); }
          70% { transform: scale(1); }
        }
        .heart-beat {
          display: inline-block;
          animation: heartbeat 1.4s ease infinite;
          color: #ef4444;
          font-size: 1.25em;
          line-height: 1;
          vertical-align: middle;
        }
      `}</style>
      <div
        className="relative h-[120px] max-h-[120px]"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="relative h-[calc(100vh+120px)] -top-[100vh]">
          <div className="h-[120px] sticky top-[calc(100vh-120px)]">
            <div className="bg-neutral-900 py-4 sm:py-6 px-4 sm:px-6 h-full w-full flex items-center justify-between gap-4">
              {/* Левая часть — трамвай */}
              <div className="flex items-center gap-2.5 shrink-0">
                <img
                  src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/057720b9-4728-4e1d-b58f-259e234c21d2.png"
                  alt="Province-RP Logo"
                  className="w-10 h-10 sm:w-20 sm:h-20 object-contain"
                />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white leading-tight whitespace-nowrap">
                  Province-RP<br />Сервер #1
                </span>
              </div>
              {/* Правая часть — подпись */}
              <p className="text-neutral-400 text-[10px] sm:text-xs text-right">
                Сделано с{" "}
                <span className="heart-beat" aria-hidden="true">♥</span>
                {" "}для Отделения интернатуры<br className="hidden sm:inline" /> ЦГБ города Невский by{" "}
                <a
                  href="https://vk.com/id132273284"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-400 transition-colors duration-300 font-semibold"
                >
                  Ksenia_Donskaya
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}