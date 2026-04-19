import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionHeader, Inp } from "./adminHelpers";
import type { TkmAllowedEntry } from "./adminTypes";
import func2url from "../../../backend/func2url.json";

const TKM_URL = func2url["tkm"];

export type { TkmAllowedEntry };

interface Props {
  allowed: TkmAllowedEntry[];
  saving: boolean;
  saved: boolean;
  onSave: (list: TkmAllowedEntry[]) => void;
}

const MAX_ATTEMPTS = 3;

export default function AdminTkm({ allowed, saving, saved, onSave }: Props) {
  const [list, setList] = useState<TkmAllowedEntry[]>(allowed);
  const [input, setInput] = useState("");
  const [resetting, setResetting] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState<string | null>(null);

  const resetSession = async (nick: string) => {
    setResetting(nick);
    try {
      await fetch(`${TKM_URL}?action=reset_session&nick=${encodeURIComponent(nick)}`, { method: "POST" });
      setResetDone(nick);
      setTimeout(() => setResetDone(null), 2500);
    } finally {
      setResetting(null);
    }
  };

  const add = () => {
    const nick = input.trim().toLowerCase().replace(/^(https?:\/\/)?(vk\.(ru|com)\/)?@?/, "").replace(/\/$/, "");
    if (!nick) { setInput(""); return; }
    if (list.some(e => e.nick === nick)) { setInput(""); return; }
    setList(prev => [...prev, { nick, attempts: 0 }]);
    setInput("");
  };

  const remove = (nick: string) => setList(prev => prev.filter(e => e.nick !== nick));

  // Выдать следующую попытку (+1, но не выше MAX)
  const grantAttempt = (nick: string) => {
    setList(prev => prev.map(e =>
      e.nick === nick ? { ...e, attempts: Math.min(MAX_ATTEMPTS, e.attempts + 1) } : e
    ));
  };

  const attemptLabel = (n: number) => {
    if (n === 0) return { text: "Нет попыток", color: "text-red-500", bg: "" };
    if (n === MAX_ATTEMPTS) return { text: `${n} из ${MAX_ATTEMPTS}`, color: "text-green-400", bg: "" };
    return { text: `${n} из ${MAX_ATTEMPTS}`, color: "text-yellow-400", bg: "" };
  };

  return (
    <div className="max-w-xl">
      <SectionHeader title="Допуск к ТКМ" desc="Добавьте сотрудника и нажмите «Допустить до теста», чтобы выдать попытку." />

      <div className="flex gap-2 mb-4">
        <Inp
          value={input}
          onChange={setInput}
          placeholder="Никнейм ВКонтакте"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button
          onClick={add}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-semibold px-4 py-2.5 transition-colors shrink-0"
        >
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-zinc-500 text-sm py-4">Список пуст — никто не допущен</p>
      ) : (
        <div className="flex flex-col gap-1 mb-6">
          {list.map((entry) => {
            const label = attemptLabel(entry.attempts);
            const canGrant = entry.attempts < MAX_ATTEMPTS;
            return (
              <div key={entry.nick} className="flex items-center gap-3 px-3 py-2.5 border border-zinc-800 bg-zinc-900/40">
                <Icon name="User" size={14} className="text-zinc-500 shrink-0" />

                <span className="text-sm text-zinc-200 flex-1 min-w-0 truncate">{entry.nick}</span>

                {/* Счётчик попыток */}
                <span className={`text-xs font-semibold tabular-nums shrink-0 ${label.color}`}>
                  {label.text}
                </span>

                {/* Кнопка допуска */}
                <button
                  onClick={() => grantAttempt(entry.nick)}
                  disabled={!canGrant}
                  title={canGrant ? `Выдать попытку (будет ${entry.attempts + 1} из ${MAX_ATTEMPTS})` : "Максимум попыток выдан"}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 border transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed border-green-700 text-green-400 hover:bg-green-900/30 disabled:border-zinc-700 disabled:text-zinc-500"
                >
                  <Icon name="Unlock" size={12} />
                  Допустить
                </button>

                {/* Кнопка сброса сессии */}
                <button
                  onClick={() => resetSession(entry.nick)}
                  disabled={resetting === entry.nick}
                  title="Сбросить активную сессию ТКМ у пользователя"
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 border transition-colors shrink-0 border-yellow-700 text-yellow-400 hover:bg-yellow-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resetDone === entry.nick ? (
                    <><Icon name="Check" size={12} />Сброшено</>
                  ) : resetting === entry.nick ? (
                    <><Icon name="Loader2" size={12} className="animate-spin" />...</>
                  ) : (
                    <><Icon name="RotateCcw" size={12} />Сброс</>
                  )}
                </button>

                <button
                  onClick={() => remove(entry.nick)}
                  title="Удалить из списка"
                  className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => onSave(list)}
          disabled={saving || saved}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors"
        >
          {saved ? <><Icon name="Check" size={14} />Сохранено</> : saving ? "Сохраняю..." : <><Icon name="Save" size={14} />Сохранить</>}
        </button>
        <p className="text-xs text-zinc-600">
          Нажмите «Допустить» после проверки теста, чтобы выдать следующую попытку
        </p>
      </div>
    </div>
  );
}