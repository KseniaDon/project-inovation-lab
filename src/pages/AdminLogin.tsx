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

  useEffect(() => {
    if (localStorage.getItem("admin_token")) navigate("/admin");
  }, [navigate]);

  const cleanNick = (v: string) => {
    let s = v.trim().toLowerCase();
    for (const p of ["https://vk.ru/", "https://vk.com/", "vk.ru/", "vk.com/", "@"]) {
      if (s.startsWith(p)) s = s.slice(p.length);
    }
    return s.replace(/^\/+|\/+$/g, "");
  };

  // Шаг 1: проверяем никнейм
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
      if (r.status === 403 || data.error === "denied") {
        setError("denied");
        setLoading(false);
        return;
      }
      if (!r.ok) { setError(data.error || "Ошибка"); setLoading(false); return; }
      setNickname(nick);
      setUserRole(data.role);
      setStep(data.has_password ? "enter_password" : "create_password");
    } catch { setError("Ошибка соединения"); }
    setLoading(false);
  };

  // Шаг 2а: создаём пароль
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

  // Шаг 2б: входим с паролем
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
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-6xl mb-6">🚫</div>
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
          <h1 className="text-xl font-bold text-white mb-3">Ой, а вы не администратор…</h1>
          <p className="text-zinc-500 text-sm mb-8">Этот никнейм ВКонтакте не имеет доступа к панели управления.</p>
          <button onClick={() => { playClickSound(); setError(""); setNickname(""); setStep("nickname"); }}
            className="text-zinc-400 hover:text-white text-sm transition-colors mr-6">Попробовать снова</button>
          <button onClick={() => { playClickSound(); navigate("/"); }}
            className="text-zinc-600 hover:text-white text-sm transition-colors">На главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <button onClick={() => { playClickSound(); navigate("/"); }}
          className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors mb-8">
          ← На главную
        </button>

        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Кабинет администратора</h1>
          {step === "nickname" && <p className="text-zinc-500 text-sm">Введите ваш никнейм ВКонтакте</p>}
          {step === "create_password" && (
            <div>
              <p className="text-zinc-400 text-sm">vk.ru/<span className="text-white font-semibold">{nickname}</span></p>
              <p className="text-zinc-500 text-xs mt-1">{roleLabel} · Придумайте пароль для входа</p>
            </div>
          )}
          {step === "enter_password" && (
            <div>
              <p className="text-zinc-400 text-sm">vk.ru/<span className="text-white font-semibold">{nickname}</span></p>
              <p className="text-zinc-500 text-xs mt-1">{roleLabel}</p>
            </div>
          )}
        </div>

        {error && error !== "denied" && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-400 text-sm px-4 py-3 mb-5 text-center">
            {error}
          </div>
        )}

        {/* ── Шаг 1: никнейм ── */}
        {step === "nickname" && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm select-none">vk.ru/</span>
              <input type="text" placeholder="nickname" value={nickname}
                onChange={e => setNickname(e.target.value)}
                onKeyDown={e => e.key === "Enter" && checkNick()}
                autoComplete="off" autoCapitalize="none"
                className="w-full bg-zinc-900 border border-zinc-700 text-white pl-14 pr-4 py-3.5 text-sm outline-none focus:border-red-600 transition-colors" />
            </div>
            <button onClick={checkNick} disabled={loading || !nickname.trim()}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3.5 text-sm uppercase tracking-widest font-semibold transition-colors">
              {loading ? "Проверяю…" : "Продолжить"}
            </button>
          </div>
        )}

        {/* ── Шаг 2а: создание пароля ── */}
        {step === "create_password" && (
          <div className="flex flex-col gap-4">
            <div className="bg-sky-950/30 border border-sky-700/40 px-4 py-3 text-sm text-sky-300 text-center">
              Первый вход — придумайте пароль, который закрепится за вашим никнеймом
            </div>
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="Придумайте пароль (от 6 символов)"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createPassword()}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 pr-11 py-3.5 text-sm outline-none focus:border-red-600 transition-colors" />
              <button onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                <Icon name={showPw ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>
            <input type={showPw ? "text" : "password"} placeholder="Повторите пароль"
              value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createPassword()}
              className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3.5 text-sm outline-none focus:border-red-600 transition-colors" />
            <button onClick={createPassword} disabled={loading || !password || !passwordConfirm}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3.5 text-sm uppercase tracking-widest font-semibold transition-colors">
              {loading ? "Сохраняю…" : "Установить пароль"}
            </button>
            <button onClick={() => { setStep("nickname"); setError(""); }}
              className="text-zinc-600 hover:text-zinc-400 text-xs text-center transition-colors">
              ← Изменить никнейм
            </button>
          </div>
        )}

        {/* ── Шаг 2б: ввод пароля ── */}
        {step === "enter_password" && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="Пароль"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 pr-11 py-3.5 text-sm outline-none focus:border-red-600 transition-colors" />
              <button onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                <Icon name={showPw ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>
            <button onClick={login} disabled={loading || !password}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3.5 text-sm uppercase tracking-widest font-semibold transition-colors">
              {loading ? "Вхожу…" : "Войти"}
            </button>
            <button onClick={() => { setStep("nickname"); setPassword(""); setError(""); }}
              className="text-zinc-600 hover:text-zinc-400 text-xs text-center transition-colors">
              ← Изменить никнейм
            </button>
          </div>
        )}

        <p className="text-zinc-700 text-xs text-center mt-6">Доступ только для сотрудников администрации ОИ</p>
      </div>
    </div>
  );
}
