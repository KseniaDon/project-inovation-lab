import { useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

const TKM_URL = func2url["tkm"];

const DEPARTMENTS = [
  { value: "ОИК", label: "ОИК (Отделение Инфекционного Контроля)" },
  { value: "СОП", label: "СОП (Стоматологическое Отделение Поликлиники)" },
  { value: "ОДС", label: "ОДС (Отделение Дневного Стационара)" },
];

interface TkmFormProps {
  onDepartmentSelected: (dept: string, meta: { nickname: string; vkLink: string; activationCode: string }) => void;
}

export default function TkmForm({ onDepartmentSelected }: TkmFormProps) {
  const [vkLink, setVkLink] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);

  const handleCheckAccess = async () => {
    setError("");
    setAccessChecked(false);
    setAttemptsLeft(null);

    if (!vkLink.trim()) {
      setError("Введите ссылку на страницу ВКонтакте");
      return;
    }

    setChecking(true);
    try {
      const res = await fetch(`${TKM_URL}?action=check_access&vk_link=${encodeURIComponent(vkLink.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "У вас нет доступа к прохождению ТКМ");
        setChecking(false);
        return;
      }
      setAttemptsLeft(data.attempts_left ?? null);
      setAccessChecked(true);
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    }
    setChecking(false);
  };

  const handleStart = () => {
    if (!department) {
      setError("Выберите отделение");
      return;
    }

    const nick = vkLink.trim().replace(/^https?:\/\/(vk\.com|vk\.ru)\//, "").replace(/\/$/, "") || vkLink.trim();
    onDepartmentSelected(department, { nickname: nick, vkLink: vkLink.trim(), activationCode: "" });
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      {/* Описание ТКМ */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
        <h2 className="text-lg font-bold">Теоретический Квалификационный Модуль (ТКМ)</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Данный Квалификационный Модуль (КМ) содержит заданий и состоит из нескольких разделов,
          которые предусматривают вашу профессиональную пригодность к работе в ЦГБ г. Невский.
        </p>
        <div className="text-sm text-foreground leading-relaxed space-y-0.5">
          <p>1. Ваше будущее отделение — <span className="font-semibold text-red-500">3 балла</span>;</p>
          <p>2. Уставная документация — <span className="font-semibold text-red-500">36 баллов</span>;</p>
          <p>3. РП-составляющая — <span className="font-semibold text-red-500">31 балл</span>;</p>
          <p>4. Препараты — <span className="font-semibold text-red-500">11 баллов</span>;</p>
          <p>5. Медицина — <span className="font-semibold text-red-500">19 баллов</span>.</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          На выполнение всех заданий отводится <span className="font-semibold text-foreground">60 минут</span>. Задания рекомендуется выполнять по порядку.
          Если какое-либо из них вызовет у Вас затруднение, перейдите к следующему. После выполнения всех заданий вернитесь к пропущенным.
        </p>
        <p className="text-sm font-semibold text-foreground">
          По завершении работы нажмите "Отправить". Будьте внимательны! Желаем успеха!{" "}
          <span className="text-red-500">Центральная Городская Больница города Невский © 2026</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Министерство здравоохранения республики Провинция<br />
          Версия от 18.04.2026
        </p>
      </div>

      {/* Ввод ВК */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold">
            Ссылка на вашу страницу ВКонтакте: <span className="text-red-500">*</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Пример: https://vk.com/id... или https://vk.ru/никнейм</p>
        </div>
        <div className="flex gap-2 items-end">
          <input
            type="url"
            value={vkLink}
            onChange={e => { setVkLink(e.target.value); setAccessChecked(false); setAttemptsLeft(null); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleCheckAccess()}
            placeholder="https://vk.com/..."
            className="flex-1 bg-transparent border-b border-border focus:border-red-500 outline-none text-sm py-1.5 text-foreground placeholder:text-muted-foreground/50 transition-colors"
          />
          <button
            onClick={handleCheckAccess}
            disabled={checking}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            {checking ? <Icon name="Loader2" size={13} className="animate-spin" /> : <Icon name="Search" size={13} />}
            Проверить
          </button>
        </div>

        {/* Нет доступа */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
            <Icon name="ShieldX" size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Есть доступ */}
        {accessChecked && attemptsLeft !== null && (
          <div className={`flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg border ${
            attemptsLeft <= 1
              ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
              : "border-green-700/40 bg-green-900/10 text-green-400"
          }`}>
            <Icon name="ShieldCheck" size={15} className="shrink-0" />
            <span>Доступ подтверждён. Осталось попыток: <span className="font-bold">{attemptsLeft}</span></span>
          </div>
        )}
      </div>

      {/* Выбор отделения — только если доступ подтверждён */}
      {accessChecked && (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold">
              В какое отделение ЦГБ вы собираетесь пойти: <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-yellow-500 font-medium mt-1.5">
              Надеемся, что Вы определились.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 mt-1">
            {DEPARTMENTS.map(dept => (
              <label key={dept.value} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    department === dept.value
                      ? "border-red-500 bg-red-500"
                      : "border-muted-foreground group-hover:border-red-400"
                  }`}
                  onClick={() => setDepartment(dept.value)}
                >
                  {department === dept.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className="text-sm text-foreground"
                  onClick={() => setDepartment(dept.value)}
                >
                  {dept.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {accessChecked && (
        <button
          onClick={handleStart}
          className="w-full sm:w-auto self-start px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <Icon name="PlayCircle" size={16} />
          Начать прохождение ТКМ
        </button>
      )}
    </div>
  );
}
