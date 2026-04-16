import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

type Step = "nickname" | "create_password" | "enter_password";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("nickname");
  const [nickname, setNickname] = useState("");
  const [userRole, setUserRole] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {}, []);

  const cleanNick = (v: string) => {
    let s = v.trim().toLowerCase();
    for (const p of ["https://vk.ru/", "https://vk.com/", "vk.ru/", "vk.com/", "@"]) {
      if (s.startsWith(p)) s = s.slice(p.length);
    }
    return s.replace(/^\/+|\/+$/g, "");
  };

  const checkNick = async () => {
    playClickSound();
    const nick = cleanNick(nickname);
    if (!nick) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}?action=check_nick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nick }),
      });
      const data = await r.json();
      if (r.status === 403 || data.error === "denied") { setError("denied"); setLoading(false); return; }
      if (!r.ok) { setError(data.error || "Ошибка"); setLoading(false); return; }
      setNickname(nick);
      setUserRole(data.role);
      setStep(data.has_password ? "enter_password" : "create_password");
    } catch { setError("Ошибка соединения"); }
    setLoading(false);
  };

  const createPassword = async () => {
    playClickSound();
    if (password.length < 6) { setError("Пароль должен быть не менее 6 символов"); return; }
    if (password !== passwordConfirm) { setError("Пароли не совпадают"); return; }
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}?action=set_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, password }),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error || "Ошибка"); setLoading(false); return; }
      setStep("enter_password");
      setPassword(""); setPasswordConfirm("");
    } catch { setError("Ошибка соединения"); }
    setLoading(false);
  };

  const login = async () => {
    playClickSound();
    if (!password) return;
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, password }),
      });
      const data = await r.json();
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_nickname", data.nickname);
        localStorage.setItem("admin_role", data.role);
        navigate("/admin");
      } else {
        setError(data.message || data.error || "Неверный пароль");
      }
    } catch { setError("Ошибка соединения"); }
    setLoading(false);
  };

  const roleLabel = userRole === "super_admin" ? "Главный администратор" : "Редактор";

  if (error === "denied") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 font-[Montserrat,sans-serif]">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-red-950/50 border border-red-800 flex items-center justify-center mx-auto mb-6">
            <Icon name="ShieldOff" size={28} className="text-red-500" />
          </div>
          <p className="text-xs uppercase tracking-widest text-red-600 mb-3">Доступ закрыт</p>
          <h1 className="text-xl font-bold text-white mb-2">Нет доступа к панели</h1>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Этот никнейм ВКонтакте не имеет доступа к панели управления.</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => { playClickSound(); setError(""); setNickname(""); setStep("nickname"); }}
              className="w-full py-3 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm transition-colors uppercase tracking-widest">
              Попробовать снова
            </button>
            <button onClick={() => { playClickSound(); navigate("/"); }}
              className="w-full py-3 text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-[Montserrat,sans-serif] relative"
      style={{ background: "linear-gradient(135deg, #09090b 0%, #18080a 50%, #09090b 100%)" }}
    >
      {/* Декоративный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Лого */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/5538aeba-2e9c-4083-8eca-e47726470bbe.png"
            alt="Герб"
            className="w-16 h-16 object-contain mb-4"
            style={{ mixBlendMode: "screen", filter: "brightness(1.1)" }}
          />
          <p className="text-xs uppercase tracking-widest text-red-600 mb-1">ЦГБ Невский</p>
          <h1 className="text-xl font-bold text-white tracking-tight text-center">
            {step === "nickname" && "Кабинет администратора"}
            {step === "create_password" && "Создайте пароль"}
            {step === "enter_password" && "Добро пожаловать"}
          </h1>
          {step !== "nickname" && (
            <div className="mt-2 text-center">
              <span className="text-zinc-400 text-sm">vk.ru/<span className="text-white font-semibold">{nickname}</span></span>
              <p className="text-zinc-500 text-xs mt-0.5">{roleLabel}</p>
            </div>
          )}
          {step === "nickname" && (
            <p className="text-zinc-500 text-sm mt-1">Введите ваш никнейм ВКонтакте</p>
          )}
        </div>

        {/* Ошибка */}
        {error && error !== "denied" && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/60 text-red-400 text-sm px-4 py-3 mb-5">
            <Icon name="AlertCircle" size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Шаг 1: никнейм */}
        {step === "nickname" && (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm select-none">vk.ru/</span>
              <input
                type="text" placeholder="nickname" value={nickname}
                onChange={e => setNickname(e.target.value)}
                onKeyDown={e => e.key === "Enter" && checkNick()}
                autoComplete="off" autoCapitalize="none"
                className="w-full bg-zinc-900/80 border border-zinc-700 text-white pl-14 pr-4 py-4 text-sm outline-none focus:border-red-600 transition-colors"
              />
            </div>
            <button
              onClick={checkNick} disabled={loading || !nickname.trim()}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white py-4 text-sm uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Icon name="Loader" size={15} className="animate-spin" />Проверяю…</> : "Продолжить"}
            </button>
          </div>
        )}

        {/* Шаг 2а: создание пароля */}
        {step === "create_password" && (
          <div className="flex flex-col gap-3">
            <div className="bg-sky-950/30 border border-sky-700/40 px-4 py-3 text-xs text-sky-300 flex items-start gap-2">
              <Icon name="Info" size={14} className="shrink-0 mt-0.5" />
              Первый вход — придумайте пароль для дальнейших входов
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} placeholder="Пароль (не менее 6 символов)"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createPassword()}
                className="w-full bg-zinc-900/80 border border-zinc-700 text-white px-4 pr-11 py-4 text-sm outline-none focus:border-red-600 transition-colors"
              />
              <button onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1">
                <Icon name={showPw ? "EyeOff" : "Eye"} size={15} />
              </button>
            </div>
            <input
              type={showPw ? "text" : "password"} placeholder="Повторите пароль"
              value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createPassword()}
              className="w-full bg-zinc-900/80 border border-zinc-700 text-white px-4 py-4 text-sm outline-none focus:border-red-600 transition-colors"
            />
            <button
              onClick={createPassword} disabled={loading || !password || !passwordConfirm}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white py-4 text-sm uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Icon name="Loader" size={15} className="animate-spin" />Сохраняю…</> : "Установить пароль"}
            </button>
            <button onClick={() => { playClickSound(); setStep("nickname"); setPassword(""); setPasswordConfirm(""); }}
              className="text-zinc-500 hover:text-zinc-300 text-xs text-center transition-colors py-1">
              ← Назад
            </button>
          </div>
        )}

        {/* Шаг 2б: ввод пароля */}
        {step === "enter_password" && (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} placeholder="Ваш пароль"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                autoFocus
                className="w-full bg-zinc-900/80 border border-zinc-700 text-white px-4 pr-11 py-4 text-sm outline-none focus:border-red-600 transition-colors"
              />
              <button onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1">
                <Icon name={showPw ? "EyeOff" : "Eye"} size={15} />
              </button>
            </div>
            <button
              onClick={login} disabled={loading || !password}
              className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white py-4 text-sm uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Icon name="Loader" size={15} className="animate-spin" />Вхожу…</> : <>Войти <Icon name="ArrowRight" size={15} /></>}
            </button>
            <button onClick={() => { playClickSound(); setStep("nickname"); setPassword(""); }}
              className="text-zinc-500 hover:text-zinc-300 text-xs text-center transition-colors py-1">
              ← Назад
            </button>
          </div>
        )}

        <button
          onClick={() => { playClickSound(); navigate("/"); }}
          className="mt-8 flex items-center gap-1.5 text-zinc-600 hover:text-zinc-400 text-xs transition-colors mx-auto"
        >
          <Icon name="ArrowLeft" size={12} />
          На главную
        </button>
      </div>
    </div>
  );
}
