import { useEffect, useRef, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

// One ECG beat: [x 0..1, y -1..1]  (positive = up)
const BEAT: [number, number][] = [
  [0.00,  0.00],
  [0.08,  0.00],
  [0.13,  0.04],
  [0.16, -0.08],
  [0.19,  0.04],
  [0.22,  0.00],
  [0.30,  0.00],
  [0.34, -0.06],
  [0.38,  1.00],
  [0.42, -0.55],
  [0.46,  0.00],
  [0.54,  0.10],
  [0.62,  0.12],
  [0.68,  0.10],
  [0.72,  0.00],
  [1.00,  0.00],
];

const BEAT_W_PX = 300;
const AMPLITUDE  = 52;
const BEAT_MS    = 950;
const BEAT_TIMES = [450, 1450, 2450]; // ms after start

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const startRef   = useRef<number>(0);
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setVisible(true),  100);
    const t1 = setTimeout(() => setFadeOut(true),  2400);
    const t2 = setTimeout(() => onFinish(),         3300);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  // ── Audio ─────────────────────────────────────────────────────
  useEffect(() => {
    const AC = window.AudioContext ||
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();

    const playBeat = (t: number) => {
      const data: [number, number, number, number, number][] = [
        [80, 40, 0,    0.09, 0.60],
        [68, 32, 0.20, 0.30, 0.38],
      ];
      data.forEach(([f0, f1, d, stop, vol]) => {
        const osc = ac.createOscillator();
        const g   = ac.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f0, t + d);
        osc.frequency.exponentialRampToValueAtTime(f1, t + stop);
        g.gain.setValueAtTime(vol, t + d);
        g.gain.exponentialRampToValueAtTime(0.001, t + stop + 0.05);
        osc.connect(g); g.connect(ac.destination);
        osc.start(t + d); osc.stop(t + stop + 0.1);
      });
    };

    BEAT_TIMES.forEach((ms) => playBeat(ac.currentTime + ms / 1000));
    return () => { ac.close(); };
  }, []);

  // ── Canvas ECG ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const flash = { v: 0 };

    const draw = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const cy = H / 2;
      const speed = BEAT_W_PX / BEAT_MS; // px per ms

      // Flash decay
      BEAT_TIMES.forEach((bm) => {
        const diff = elapsed - bm;
        if (diff >= 0 && diff < 500) {
          const v = Math.max(0, 1 - diff / 500);
          if (v > flash.v) flash.v = v;
        }
      });
      flash.v *= 0.97;

      // Grid
      ctx.strokeStyle = `rgba(160,20,20,${0.07 + flash.v * 0.07})`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const totalPx = elapsed * speed;
      const scrollX = Math.max(0, totalPx - W * 0.65);

      // Build drawn ECG points
      const drawn: [number, number][] = [];
      const numBeats = Math.ceil((W + BEAT_W_PX * 2) / BEAT_W_PX) + 2;
      outer: for (let b = 0; b < numBeats; b++) {
        for (const [tx, ty] of BEAT) {
          const px = b * BEAT_W_PX + tx * BEAT_W_PX;
          const sx = px - scrollX;
          drawn.push([sx, ty]);
          if (px >= totalPx) break outer;
        }
      }

      if (drawn.length < 2) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Neon layers
      const neonColor = (a: number) =>
        `rgba(255,${Math.round(40 + flash.v * 60)},${Math.round(40 + flash.v * 40)},${Math.min(1, a)})`;

      [
        { lw: 16, a: 0.06 + flash.v * 0.18, blur: 28 },
        { lw: 8,  a: 0.18 + flash.v * 0.28, blur: 14 },
        { lw: 3,  a: 0.70 + flash.v * 0.30, blur: 5  },
        { lw: 1,  a: 1.00,                  blur: 0  },
      ].forEach(({ lw, a, blur }) => {
        ctx.save();
        ctx.shadowBlur  = blur;
        ctx.shadowColor = neonColor(a);
        ctx.strokeStyle = neonColor(a);
        ctx.lineWidth   = lw;
        ctx.lineJoin    = "round";
        ctx.lineCap     = "round";
        ctx.beginPath();
        drawn.forEach(([x, y], i) => {
          const sy = cy - y * AMPLITUDE;
          if (i === 0) { ctx.moveTo(x, sy); } else { ctx.lineTo(x, sy); }
        });
        ctx.stroke();
        ctx.restore();
      });

      // Head glow dot
      const [hx, hy] = drawn[drawn.length - 1];
      const headY = cy - hy * AMPLITUDE;
      const r = 12 + flash.v * 10;
      const grad = ctx.createRadialGradient(hx, headY, 0, hx, headY, r);
      grad.addColorStop(0,   `rgba(255,200,180,0.95)`);
      grad.addColorStop(0.4, `rgba(255,60,40,0.6)`);
      grad.addColorStop(1,   "rgba(255,0,0,0)");
      ctx.beginPath();
      ctx.arc(hx, headY, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#0d0000",
        opacity: fadeOut ? 0 : visible ? 1 : 0,
        transition: fadeOut ? "opacity 0.9s ease-out" : "opacity 0.4s ease-in",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(160,0,0,0.40) 0%, transparent 80%)",
        }}
      />

      {/* Title */}
      <div className="relative z-10 text-center mb-4 px-6 select-none">
        <p
          className="text-3xl md:text-5xl font-black tracking-widest uppercase"
          style={{
            color: "#ff3333",
            textShadow:
              "0 0 10px rgba(255,50,50,1), 0 0 30px rgba(255,0,0,0.7), 0 0 60px rgba(200,0,0,0.4)",
            letterSpacing: "0.12em",
          }}
        >
          ЦГБ Невский
        </p>
        <p
          className="text-sm md:text-lg tracking-[0.35em] uppercase mt-2 font-semibold"
          style={{
            color: "rgba(255,110,110,0.9)",
            textShadow: "0 0 14px rgba(255,60,60,0.8)",
          }}
        >
          спасает жизни
        </p>
      </div>

      {/* ECG strip */}
      <div className="relative z-10 w-full" style={{ height: 130 }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}