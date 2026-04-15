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
            <div className="bg-neutral-900 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 h-full w-full flex flex-col justify-between">
              <div className="flex shrink-0 gap-8 sm:gap-12 lg:gap-20"></div>
              <div className="flex justify-end items-end">
                <p className="text-neutral-400 text-xs sm:text-sm text-right max-w-sm">
                  Сделано с{" "}
                  <span className="heart-beat" aria-hidden="true">♥</span>
                  {" "}для Отделения интернатуры ЦГБ города Невский by{" "}
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
      </div>
    </>
  );
}