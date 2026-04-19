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
  const [list, setList] = useState<TkmAllowedEntry[]>(
    allowed.map(e => ({ ...e, allowed: e.allowed ?? true }))
  );
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
    setList(prev => [...prev, { nick, attempts: 0, allowed: true }]);
    setInput("");
  };

  const remove = (nick: string) => setList(prev => prev.filter(e => e.nick !== nick));

  const allowRetake = (nick: string) => {
    setList(prev => prev.map(e =>
      e.nick === nick ? { ...e, allowed: true } : e
    ));
  };

  const attemptsLabel = (entry: TkmAllowedEntry) => {
    const { attempts, allowed: isAllowed } = entry;
    if (attempts === 0 && isAllowed) return { text: "Ещё не писал", color: "text-zinc-400" };
    if (attempts >= MAX_ATTEMPTS && !isAllowed) return { text: `${attempts} из ${MAX_ATTEMPTS} — лимит`, color: "text-red-400" };
    if (!isAllowed) return { text: `${attempts} из ${MAX_ATTEMPTS} — ожидает`, color: "text-yellow-400" };
    return { text: `${attempts} из ${MAX_ATTEMPTS} — допущен`, color: "text-green-400" };
  };

  return (
    <div className="max-w-xl">
      <SectionHeader title="Допуск к ТКМ" desc="Добавьте сотрудника — он сразу допущен к первой попытке. После сдачи теста разрешайте пересдачу вручную." />

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
            const label = attemptsLabel(entry);
            const canRetake = !entry.allowed && entry.attempts < MAX_ATTEMPTS;
            const limitReached = entry.attempts >= MAX_ATTEMPTS && !entry.allowed;
            return (
              <div key={entry.nick} className="flex items-center gap-3 px-3 py-2.5 border border-zinc-800 bg-zinc-900/40">
                <Icon name="User" size={14} className="text-zinc-500 shrink-0" />

                <span className="text-sm text-zinc-200 flex-1 min-w-0 truncate">{entry.nick}</span>

                <span className={`text-xs font-semibold tabular-nums shrink-0 ${label.color}`}>
                  {label.text}
                </span>

                {/* Разрешить пересдачу */}
                {canRetake && (
                  <button
                    onClick={() => allowRetake(entry.nick)}
                    title="Разрешить пересдачу"
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 border transition-colors shrink-0 border-green-700 text-green-400 hover:bg-green-900/30"
                  >
                    <Icon name="Unlock" size={12} />
                    Пересдача
                  </button>
                )}

                {/* Лимит исчерпан */}
                {limitReached && (
                  <span className="text-xs text-red-500 font-semibold px-2.5 py-1.5 border border-red-900 shrink-0">
                    Лимит
                  </span>
                )}

                {/* Сброс сессии */}
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
          После проверки теста нажмите «Пересдача», чтобы разрешить следующую попытку
        </p>
      </div>
    </div>
  );
}
