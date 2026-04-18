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
  const [nickname, setNickname] = useState("");
  const [vkLink, setVkLink] = useState("");
  const [code, setCode] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleNext = async () => {
    setError("");
    setCodeError("");

    if (!nickname.trim()) { setError("Введите ваш никнейм"); return; }
    if (!vkLink.trim()) { setError("Введите ссылку на страницу ВКонтакте"); return; }
    if (!code.trim()) { setCodeError("Введите код активации"); return; }
    if (!department) { setError("Выберите отделение"); return; }

    setChecking(true);
    try {
      const res = await fetch(`${TKM_URL}?action=check_access&vk_link=${encodeURIComponent(vkLink.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Нет доступа к ТКМ");
        setChecking(false);
        return;
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
      setChecking(false);
      return;
    }
    setChecking(false);

    onDepartmentSelected(department, { nickname: nickname.trim(), vkLink: vkLink.trim(), activationCode: code.trim() });
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

      {/* Никнейм */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold">
            Ваш никнейм: <span className="text-red-500">*</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Пример: Ivan_Ivanov</p>
        </div>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="Краткий ответ"
          className="bg-transparent border-b border-border focus:border-red-500 outline-none text-sm py-1.5 text-foreground placeholder:text-muted-foreground/50 transition-colors w-full"
        />
      </div>

      {/* ВКонтакте */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold">
            Ссылка на вашу страницу ВКонтакте: <span className="text-red-500">*</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Пример: https://vk.com/id...</p>
        </div>
        <input
          type="url"
          value={vkLink}
          onChange={e => setVkLink(e.target.value)}
          placeholder="Краткий ответ"
          className="bg-transparent border-b border-border focus:border-red-500 outline-none text-sm py-1.5 text-foreground placeholder:text-muted-foreground/50 transition-colors w-full"
        />
      </div>

      {/* Код активации */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold">
            Код активации: <span className="text-red-500">*</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Код вам скажет куратор/заведующий/заместитель заведующего отделением интернатуры
          </p>
        </div>
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value); setCodeError(""); }}
          placeholder="Краткий ответ"
          className={`bg-transparent border-b outline-none text-sm py-1.5 text-foreground placeholder:text-muted-foreground/50 transition-colors w-full ${codeError ? "border-red-500" : "border-border focus:border-red-500"}`}
        />
        {codeError && (
          <p className="text-xs text-red-500 flex items-start gap-1.5">
            <Icon name="AlertCircle" size={13} className="mt-0.5 shrink-0" />
            {codeError}
          </p>
        )}
      </div>

      {/* Выбор отделения */}
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

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <Icon name="AlertCircle" size={15} />
          {error}
        </p>
      )}

      <button
        onClick={handleNext}
        disabled={checking}
        className="self-start px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
      >
        {checking && <Icon name="Loader2" size={15} className="animate-spin" />}
        {checking ? "Проверка..." : "Далее"}
      </button>
    </div>
  );
}