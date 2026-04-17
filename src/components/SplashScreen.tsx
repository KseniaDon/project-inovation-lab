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
const BEAT_TIMES = [500, 1800, 3100, 4400, 5700]; // ms
const TOTAL_MS   = 7500;

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

export const MEDICAL_FACTS = [
  // Анатомия и физиология
  "Сердце взрослого человека бьётся около 100 000 раз в сутки.",
  "Мозг потребляет около 20% всего кислорода в организме, хотя весит лишь 2% от массы тела.",
  "Печень — единственный орган, способный полностью восстановиться даже после удаления 75% своей ткани.",
  "Длина капилляров в теле человека — около 100 000 км. Это почти 2,5 оборота вокруг Земли.",
  "Лёгкие расправлены площадью около 70 м² — размером теннисного корта.",
  "Скелет взрослого человека содержит 206 костей, а у новорождённого их около 270.",
  "Кровь совершает полный кругооборот по телу примерно за 60 секунд.",
  "Желудок полностью обновляет слизистую оболочку каждые 3–4 дня, иначе переварил бы сам себя.",
  "Роговица глаза — единственная ткань в теле без кровеносных сосудов: она питается прямо из воздуха.",
  "Нейроны в мозге могут передавать импульс со скоростью до 430 км/ч.",
  "Почки фильтруют около 180 литров крови в сутки, но выделяют лишь 1–2 литра мочи.",
  "Кожа — самый большой орган тела: у взрослого она весит около 4–5 кг и занимает 1,5–2 м².",
  "Кости человека прочнее бетона: они выдерживают нагрузку до 18 000 кг на 1 см².",
  "Эритроциты живут около 120 дней, а тромбоциты — всего 7–10 дней.",
  "Около 60% тела человека составляет вода, у новорождённых — до 80%.",
  "Правое лёгкое немного больше левого, потому что сердце занимает часть пространства слева.",
  "Спинной мозг заканчивается на уровне L1–L2 позвонка; ниже идут корешки — «конский хвост».",
  "Зрачок расширяется не только в темноте, но и при сильном эмоциональном возбуждении или боли.",
  "Температура тела минимальна около 4 утра, максимальна в 17–18 часов.",
  "При остановке сердца мозг начинает необратимо повреждаться уже через 4–6 минут без реанимации.",
  // Болезни
  "Инсулин был открыт в 1921 году: до этого сахарный диабет 1 типа был смертным приговором.",
  "Артериальное давление 120/80 — условная норма; у спортсменов оно часто ниже, и это хороший знак.",
  "Гипертония называется «тихим убийцей»: годами не даёт симптомов, но разрушает сосуды и сердце.",
  "Инфаркт миокарда у женщин часто протекает без классической боли в груди — вместо неё тошнота и усталость.",
  "Инсульт бывает двух типов: ишемический (закупорка) и геморрагический (разрыв сосуда); лечение принципиально разное.",
  "Аппендикс не рудиментарный орган: он является резервуаром полезных бактерий кишечника.",
  "Сепсис — системный ответ на инфекцию; без лечения летальность достигает 30–50% и растёт каждый час.",
  "Пневмония убивает больше детей до 5 лет, чем любая другая инфекционная болезнь в мире.",
  "При анафилактическом шоке адреналин (эпинефрин) — препарат первой линии, а не антигистаминные.",
  "Туберкулёз остаётся одной из ведущих инфекционных причин смерти в мире — около 1,5 млн в год.",
  "Сахарный диабет 2 типа в 90% случаев связан с образом жизни и может быть обращён вспять на ранних стадиях.",
  "ВИЧ без лечения прогрессирует до СПИДа в среднем за 10 лет; современная терапия даёт нормальную продолжительность жизни.",
  "Желчнокаменная болезнь чаще встречается у женщин: «правило 4F» — fat, forty, female, fertile.",
  // Операции и хирургия
  "Первая успешная пересадка сердца выполнена Кристианом Барнардом в 1967 году в ЮАР; пациент прожил 18 дней.",
  "Аппендэктомия — одна из самых частых экстренных операций в мире; лапароскопически выполняется за 20–40 минут.",
  "Нейрохирурги оперируют пациентов в сознании при операциях на речевых зонах мозга, чтобы не повредить функцию.",
  "Первая успешная трансплантация почки была выполнена в 1954 году между однояйцевыми близнецами.",
  "Лапароскопия сократила время восстановления после операций на органах брюшной полости с нескольких недель до нескольких дней.",
  "Во время операции на открытом сердце аппарат искусственного кровообращения полностью заменяет работу сердца и лёгких.",
  "Трепанация черепа — одна из древнейших хирургических операций: следы найдены на черепах возрастом 7 000 лет.",
  "Средняя продолжительность сложной нейрохирургической операции может достигать 12–16 часов.",
  "Хирурги используют шовный материал толщиной с человеческий волос при операциях на коронарных сосудах.",
  "Роботизированная хирургия (система da Vinci) позволяет проводить операции с точностью до долей миллиметра.",
  // История медицины и фармакология
  "Пенициллин был случайно открыт Александром Флемингом в 1928 году — плесень уничтожила культуру бактерий.",
  "Аспирин был синтезирован в 1897 году и до сих пор остаётся одним из самых назначаемых препаратов в мире.",
  "ЭКГ-зубцы P, Q, R, S, T были названы Эйнтховеном произвольно — чтобы оставить место для новых открытий.",
  "АД измеряется в мм рт. ст. потому что первые манометры были наполнены именно ртутью.",
  "Группа крови передаётся по наследству: два родителя с группой 0 не могут иметь ребёнка с группой AB.",
  "Морфин назван в честь Морфея — греческого бога сновидений; выделен из опиума в 1804 году.",
  // Органы
  "Поджелудочная железа одновременно является и железой внешней секреции (ферменты), и внутренней (инсулин, глюкагон).",
  "Надпочечники выбрасывают адреналин в кровь за доли секунды — это позволяет телу реагировать на опасность мгновенно.",
  "Селезёнка — «кладбище» эритроцитов: она разрушает старые клетки крови и хранит резерв тромбоцитов.",
  "Тимус (вилочковая железа) активен только в детстве: к 20 годам он почти полностью замещается жировой тканью.",
  "Желчный пузырь накапливает желчь, вырабатываемую печенью, и выбрасывает её в кишечник при поступлении жирной пищи.",
  "Мочевой пузырь взрослого человека вмещает в среднем 400–600 мл мочи, но позыв возникает уже при 150–200 мл.",
  "Предстательная железа размером с грецкий орех, но при аденоме может достигать размера яблока и полностью перекрыть мочеиспускание.",
  "Щитовидная железа контролирует скорость обмена веществ: при гипотиреозе человек мёрзнет и набирает вес даже без переедания.",
  "Гипофиз размером с горошину управляет почти всеми другими эндокринными железами организма.",
  "Тонкий кишечник длиной 6–7 метров — основное место всасывания питательных веществ; его ворсинки увеличивают площадь до 200 м².",
  "Толстый кишечник не переваривает пищу, но в нём живут триллионы бактерий, влияющих даже на настроение и иммунитет.",
  "Лимфатические узлы — фильтры иммунной системы: их воспаление (лимфаденит) сигнализирует об инфекции поблизости.",
  // Беременность и акушерство
  "Сердце эмбриона начинает биться уже на 22-й день после зачатия — ещё до того, как женщина узнаёт о беременности.",
  "Плацента — временный орган, который вырабатывает гормоны, питает плод и защищает его от иммунной системы матери.",
  "За время беременности объём крови у матери увеличивается примерно на 50%, чтобы обеспечить плод кислородом.",
  "Плод начинает слышать звуки с 20-й недели беременности и узнаёт голос матери уже в утробе.",
  "Кости таза у женщины немного расходятся во время родов благодаря гормону релаксину — это облегчает прохождение ребёнка.",
  "Молозиво — первое молоко после родов — содержит в 10 раз больше иммуноглобулинов, чем зрелое грудное молоко.",
  "Токсикоз первого триместра считается признаком здоровой беременности: он связан с высоким уровнем ХГЧ.",
  "Эклампсия (судороги на фоне преэклампсии) — одна из ведущих причин материнской смертности в мире.",
  "Преждевременными считаются роды до 37 недель; глубоко недоношенными — дети, рождённые до 28 недель.",
  "Кесарево сечение известно с древности; первая задокументированная выжившая мать — случай из Швейцарии 1500 года.",
  "При многоплодной беременности риск преждевременных родов возрастает в 6 раз по сравнению с одноплодной.",
  "Послеродовая депрессия развивается у 10–15% женщин и требует медицинского наблюдения, а не «просто взять себя в руки».",
  // Дополнительные болезни и состояния
  "Мигрень — не просто головная боль: это неврологическое расстройство, при котором меняется кровоток в мозге.",
  "Остеопороз называют «молчащей болезнью»: человек узнаёт о ней только после первого перелома от лёгкого удара.",
  "Болезнь Альцгеймера начинается за 15–20 лет до первых симптомов — изменения в мозге происходят задолго до забывчивости.",
  "Рак поджелудочной железы так опасен потому, что долго не даёт симптомов: 80% случаев диагностируют уже на 4-й стадии.",
  "Синдром раздражённого кишечника встречается у 10–15% населения и тесно связан со стрессом и тревожностью.",
  "Апноэ сна повышает риск инфаркта, инсульта и сахарного диабета — и часто остаётся невыявленным годами.",
  "Фибрилляция предсердий — наиболее распространённое нарушение ритма сердца; главная опасность — тромбоэмболия.",
  "Гепатит C долгие годы протекает бессимптомно, но современные препараты излечивают его более чем в 95% случаев.",
  "Анемия — не болезнь, а симптом; её причины разнообразны: от дефицита железа до хронических заболеваний и онкологии.",
  "Аутоиммунные заболевания — это когда иммунная система атакует собственные ткани; их насчитывается более 80 видов.",
];

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const startRef  = useRef<number>(0);
  const [visible, setVisible]   = useState(false);
  const [fadeOut, setFadeOut]   = useState(false);
  const [fact]                  = useState<string>(() => MEDICAL_FACTS[Math.floor(Math.random() * MEDICAL_FACTS.length)]);

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

    ac.resume().then(() => scheduleBeats());

    return () => { ac.close(); };
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

      {/* Медицинский факт */}
      <div
        className="relative z-10 text-center px-8 mt-4 select-none max-w-2xl"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease-in",
        }}
      >
        <p
          style={{
            fontSize: "clamp(0.6rem, 1.8vw, 0.75rem)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(220,38,38,0.8)",
            fontWeight: 600,
            marginBottom: "0.4rem",
          }}
        >
          Интересные факты
        </p>
        <p
          style={{
            fontSize: "clamp(0.78rem, 2.2vw, 1rem)",
            color: "rgba(255,200,200,0.85)",
            letterSpacing: "0.03em",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          {fact}
        </p>
      </div>

    </div>
  );
}