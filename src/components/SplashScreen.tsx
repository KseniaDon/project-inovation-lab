import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const outTimer = setTimeout(() => setFadeOut(true), 1800);
    const doneTimer = setTimeout(() => onFinish(), 2800);
    return () => {
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <>
      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes splashFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        style={{
          animation: fadeOut
            ? "splashFadeOut 1s ease-out forwards"
            : "splashFadeIn 0.9s ease-out forwards",
        }}
      >
        <img
          src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/60314116-cc27-4f93-a0fa-5f807475ed8c.png"
          alt="ЦГБ Невский"
          className="w-full max-w-2xl object-contain px-8"
        />
      </div>
    </>
  );
}
