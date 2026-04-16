import { useEffect, useRef, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

// Плавная ЭКГ-волна: используем кривые Безье через промежуточные точки
// [x 0..1, y -1..1] positive = вверх
const BEAT: [number, number][] = [
  [0.00,  0.00],
  [0.05,  0.00],
  [0.10,  0.02],
  [0.14, -0.05],
  [0.17,  0.03],
  [0.21,  0.00],
  [0.28,  0.00],
  [0.32,  0.00],
  [0.35, -0.04],
  [0.37,  0.30],   // подъём к R
  [0.39,  1.00],   // R-пик
  [0.41,  0.30],   // спуск
  [0.43, -0.40],   // S
  [0.46, -0.10],
  [0.49,  0.00],
  [0.52,  0.00],
  [0.55,  0.06],
  [0.58,  0.14],   // T-волна начало
  [0.62,  0.18],   // T-пик
  [0.66,  0.14],
  [0.70,  0.06],
  [0.74,  0.00],
  [1.00,  0.00],
];

// Сплайн Катмулл-Рома для плавного прохождения через точки
function catmullRom(pts: [number,number][], t: number): [number, number] {
  const n = pts.length;
  if (n < 2) return pts[0] ?? [0, 0];
  const seg = Math.min(Math.floor(t * (n - 1)), n - 2);
  const lt = t * (n - 1) - seg;
  const p0 = pts[Math.max(seg - 1, 0)];
  const p1 = pts[seg];
  const p2 = pts[Math.min(seg + 1, n - 1)];
  const p3 = pts[Math.min(seg + 2, n - 1)];
  const tt = lt, tt2 = tt * tt, tt3 = tt2 * tt;
  const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * tt + (2*p0[0] - 5*p1[0] + 4*p2[0] - p3[0]) * tt2 + (-p0[0] + 3*p1[0] - 3*p2[0] + p3[0]) * tt3);
  const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * tt + (2*p0[1] - 5*p1[1] + 4*p2[1] - p3[1]) * tt2 + (-p0[1] + 3*p1[1] - 3*p2[1] + p3[1]) * tt3);
  return [x, y];
}

// Генерация сглаженных точек для одного бита
function buildBeatPoints(steps = 120): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    result.push(catmullRom(BEAT, t));
  }
  return result;
}

const SMOOTH_BEAT = buildBeatPoints(160);
const BEAT_W_PX  = 520;   // шире — крупнее диаграмма
const AMPLITUDE  = 90;    // выше амплитуда
const BEAT_MS    = 1300;  // ~46 уд/мин — медленно и чётко
const BEAT_TIMES = [500, 1800, 3100]; // ms
const TOTAL_MS   = 4500;

// Приятное сердцебиение: двойной удар «lub-dub»
function playHeartbeat(ac: AudioContext, t: number) {
  const thump = (start: number, freq: number, gain: number, dur: number) => {
    const osc  = ac.createOscillator();
    const g    = ac.createGain();
    const filt = ac.createBiquadFilter();
    filt.type            = "lowpass";
    filt.frequency.value = 180;
    filt.Q.value         = 1.2;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, start + dur);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(filt); filt.connect(g); g.connect(ac.destination);
    osc.start(start); osc.stop(start + dur + 0.02);
  };
  // «lub» — первый, более сильный удар
  thump(t,        70, 0.55, 0.13);
  thump(t,       110, 0.30, 0.11);
  // «dub» — второй, тише, через ~220мс
  thump(t + 0.22, 60, 0.35, 0.11);
  thump(t + 0.22, 95, 0.18, 0.09);
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const startRef  = useRef<number>(0);
  const [visible, setVisible]   = useState(false);
  const [fadeOut, setFadeOut]   = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setVisible(true),   100);
    const t1 = setTimeout(() => setFadeOut(true),  TOTAL_MS - 900);
    const t2 = setTimeout(() => onFinish(),         TOTAL_MS);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  // ── Звук ЭКГ-аппарата ─────────────────────────────────────────
  useEffect(() => {
    const AC = window.AudioContext ||
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();

    const scheduleBeats = () => {
      BEAT_TIMES.forEach(ms => {
        const peakOffset = BEAT_MS * 0.39 / 1000;
        playHeartbeat(ac, ac.currentTime + ms / 1000 + peakOffset);
      });
    };

    const tryPlay = () => {
      ac.resume().then(() => {
        scheduleBeats();
      });
      document.removeEventListener("pointerdown", tryPlay);
      document.removeEventListener("keydown", tryPlay);
    };

    if (ac.state === "running") {
      scheduleBeats();
    } else {
      document.addEventListener("pointerdown", tryPlay, { once: true });
      document.addEventListener("keydown", tryPlay, { once: true });
    }

    return () => {
      document.removeEventListener("pointerdown", tryPlay);
      document.removeEventListener("keydown", tryPlay);
      ac.close();
    };
  }, []);

  // ── Canvas ────────────────────────────────────────────────────
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
      const speed = BEAT_W_PX / BEAT_MS;

      // Flash при R-пике
      BEAT_TIMES.forEach(bm => {
        const peakMs = bm + BEAT_MS * 0.39;
        const diff = elapsed - peakMs;
        if (diff >= 0 && diff < 400) {
          const v = Math.max(0, 1 - diff / 400);
          if (v > flash.v) flash.v = v;
        }
      });
      flash.v *= 0.96;

      // Сетка ЭКГ-бумаги
      const gridAlpha = 0.09 + flash.v * 0.06;
      ctx.lineWidth = 0.5;
      // Мелкая сетка
      ctx.strokeStyle = `rgba(180,30,30,${gridAlpha})`;
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      // Крупная сетка
      ctx.strokeStyle = `rgba(200,40,40,${gridAlpha * 1.8})`;
      ctx.lineWidth = 0.8;
      for (let x = 0; x < W; x += 100) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 100) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const totalPx  = elapsed * speed;
      // Голова линии идёт на 65% ширины экрана
      const scrollX  = Math.max(0, totalPx - W * 0.65);

      // Строим отрисованные точки из сглаженного бита
      const drawn: [number, number][] = [];
      const numBeats = Math.ceil((W + BEAT_W_PX * 2) / BEAT_W_PX) + 2;

      outer: for (let b = 0; b < numBeats; b++) {
        for (const [tx, ty] of SMOOTH_BEAT) {
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

      // Неоновые слои
      const r = Math.round(255);
      const g2 = Math.round(40  + flash.v * 80);
      const b2 = Math.round(40  + flash.v * 40);
      const neon = (a: number) => `rgba(${r},${g2},${b2},${Math.min(1, a)})`;

      [
        { lw: 18, a: 0.05 + flash.v * 0.15, blur: 32 },
        { lw: 10, a: 0.14 + flash.v * 0.22, blur: 16 },
        { lw: 4,  a: 0.65 + flash.v * 0.35, blur: 6  },
        { lw: 1.5,a: 1.00,                  blur: 0  },
      ].forEach(({ lw, a, blur }) => {
        ctx.save();
        ctx.shadowBlur  = blur;
        ctx.shadowColor = neon(a);
        ctx.strokeStyle = neon(a);
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

      // Светящаяся голова
      const [hx, hy] = drawn[drawn.length - 1];
      const headY = cy - hy * AMPLITUDE;
      const dotR = 10 + flash.v * 12;
      const grad = ctx.createRadialGradient(hx, headY, 0, hx, headY, dotR);
      grad.addColorStop(0,   `rgba(255,220,200,1)`);
      grad.addColorStop(0.3, `rgba(255,80,50,0.8)`);
      grad.addColorStop(1,   `rgba(255,0,0,0)`);
      ctx.beginPath();
      ctx.arc(hx, headY, dotR, 0, Math.PI * 2);
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
        backgroundColor: "#080000",
        opacity: fadeOut ? 0 : visible ? 1 : 0,
        transition: fadeOut ? "opacity 0.9s ease-out" : "opacity 0.4s ease-in",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 55%, rgba(140,0,0,0.45) 0%, transparent 75%)",
        }}
      />

      {/* Title — крупно */}
      <div className="relative z-10 text-center mb-6 px-6 select-none">
        <p
          style={{
            fontSize: "clamp(2.4rem, 7vw, 5rem)",
            fontWeight: 900,
            letterSpacing: "0.10em",
            color: "#ff2222",
            textTransform: "uppercase",
            textShadow: "0 0 12px rgba(255,40,40,1), 0 0 35px rgba(255,0,0,0.75), 0 0 70px rgba(200,0,0,0.45)",
            lineHeight: 1.1,
          }}
        >
          ЦГБ Невский
        </p>
        <p
          style={{
            fontSize: "clamp(1rem, 2.8vw, 1.6rem)",
            fontWeight: 600,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginTop: "0.5rem",
            color: "rgba(255,120,120,0.95)",
            textShadow: "0 0 16px rgba(255,60,60,0.85)",
          }}
        >
          спасает жизни
        </p>
      </div>

      {/* ECG — крупная полоса по центру */}
      <div className="relative z-10 w-full" style={{ height: "clamp(160px, 28vh, 260px)" }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}