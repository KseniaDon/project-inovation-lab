import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";
const VK_APP_ID = 54606591;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VKIDSDK: any;
  }
}

type VkCallbackData = {
  code?: string;
  device_id?: string;
  code_verifier?: string;
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const handleVkSuccess = useCallback(async (data: VkCallbackData) => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}?action=vk_callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: data.code,
          device_id: data.device_id,
          code_verifier: data.code_verifier,
        }),
      });
      const result = await r.json();
      if (r.status === 403 || result.error === "denied") {
        setDenied(true);
        setLoading(false);
        return;
      }
      if (!r.ok || !result.token) {
        setError(result.error || "Ошибка авторизации");
        setLoading(false);
        return;
      }
      localStorage.setItem("admin_token", result.token);
      localStorage.setItem("admin_nickname", result.nickname);
      localStorage.setItem("admin_role", result.role);
      navigate("/admin");
    } catch {
      setError("Ошибка соединения");
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const initSdk = () => {
      if (!window.VKIDSDK || !containerRef.current) return;
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: VK_APP_ID,
        redirectUrl: "https://mz-cgbn-oi.ru/admin/login",
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: "",
      });

      const oneTap = new VKID.OneTap();
      oneTap
        .render({ container: containerRef.current, showAlternativeLogin: true })
        .on(VKID.WidgetEvents.ERROR, (err: { message?: string }) => {
          setError("Ошибка виджета VK: " + (err?.message || ""));
        })
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: { code: string; device_id: string }) => {
          const { code, device_id } = payload;
          VKID.Auth.exchangeCode(code, device_id)
            .then((result: VkCallbackData) => handleVkSuccess({ ...result, code, device_id }))
            .catch(() => setError("Ошибка авторизации VK"));
        });

      setSdkReady(true);
    };

    if (window.VKIDSDK) {
      initSdk();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js";
      script.onload = initSdk;
      script.onerror = () => setError("Не удалось загрузить VK SDK");
      document.head.appendChild(script);
    }
  }, [handleVkSuccess]);

  if (denied) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 font-[Montserrat,sans-serif]">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-red-950/50 border border-red-800 flex items-center justify-center mx-auto mb-6">
            <Icon name="ShieldOff" size={28} className="text-red-500" />
          </div>
          <p className="text-xs uppercase tracking-widest text-red-600 mb-3">Доступ закрыт</p>
          <h1 className="text-xl font-bold text-white mb-2">Нет доступа к панели</h1>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            Этот аккаунт ВКонтакте не имеет доступа к панели управления.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { playClickSound(); setDenied(false); setError(""); }}
              className="w-full py-3 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm transition-colors uppercase tracking-widest"
            >
              Попробовать снова
            </button>
            <button
              onClick={() => { playClickSound(); navigate("/"); }}
              className="w-full py-3 text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
            >
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/5538aeba-2e9c-4083-8eca-e47726470bbe.png"
            alt="Герб"
            className="w-16 h-16 object-contain mb-4"
            style={{ mixBlendMode: "screen", filter: "brightness(1.1)" }}
          />
          <p className="text-xs uppercase tracking-widest text-red-600 mb-1">ЦГБ Невский</p>
          <h1 className="text-xl font-bold text-white tracking-tight text-center">
            Кабинет администратора
          </h1>
          <p className="text-zinc-500 text-sm mt-1 text-center">
            Войдите через аккаунт ВКонтакте
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/60 text-red-400 text-sm px-4 py-3 mb-5">
            <Icon name="AlertCircle" size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-500 text-sm">Проверяем доступ…</p>
          </div>
        ) : (
          <div ref={containerRef} className="w-full" />
        )}

        {!sdkReady && !loading && !error && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => { playClickSound(); navigate("/"); }}
            className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}