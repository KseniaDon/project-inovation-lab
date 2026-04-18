import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionHeader, Inp } from "./adminHelpers";
import type { TkmAllowedEntry } from "./adminTypes";

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

  const add = () => {
    const nick = input.trim().toLowerCase().replace(/^(https?:\/\/)?(vk\.(ru|com)\/)?@?/, "").replace(/\/$/, "");
    if (!nick) { setInput(""); return; }
    if (list.some(e => e.nick === nick)) { setInput(""); return; }
    setList(prev => [...prev, { nick, attempts: 0 }]);
    setInput("");
  };

  const remove = (nick: string) => setList(prev => prev.filter(e => e.nick !== nick));

  const changeAttempts = (nick: string, delta: number) => {
    setList(prev => prev.map(e => {
      if (e.nick !== nick) return e;
      const next = Math.min(MAX_ATTEMPTS, Math.max(0, e.attempts + delta));
      return { ...e, attempts: next };
    }));
  };

  const attemptColor = (n: number) => {
    if (n === 0) return "text-red-500";
    if (n === 1) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="max-w-xl">
      <SectionHeader title="Допуск к ТКМ" desc="Добавьте сотрудника и выдайте ему попытки. Без попыток пройти ТКМ невозможно." />

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
          {list.map((entry) => (
            <div key={entry.nick} className="flex items-center gap-3 px-3 py-2.5 border border-zinc-800 bg-zinc-900/40">
              <Icon name="User" size={14} className="text-zinc-500 shrink-0" />

              <span className="text-sm text-zinc-200 flex-1 min-w-0 truncate">{entry.nick}</span>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-zinc-500">Попытки:</span>
                <span className={`text-sm font-bold w-4 text-center tabular-nums ${attemptColor(entry.attempts)}`}>
                  {entry.attempts}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => changeAttempts(entry.nick, -1)}
                    disabled={entry.attempts <= 0}
                    title="Убрать попытку"
                    className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-zinc-700 hover:border-zinc-500"
                  >
                    <Icon name="Minus" size={11} />
                  </button>
                  <button
                    onClick={() => changeAttempts(entry.nick, 1)}
                    disabled={entry.attempts >= MAX_ATTEMPTS}
                    title={entry.attempts >= MAX_ATTEMPTS ? "Максимум 3 попытки" : "Дать попытку"}
                    className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-green-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-zinc-700 hover:border-green-600"
                  >
                    <Icon name="Plus" size={11} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => remove(entry.nick)}
                title="Удалить из списка"
                className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          ))}
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
          🟢 есть попытки · 🟡 1 попытка · 🔴 исчерпаны (нельзя пройти)
        </p>
      </div>
    </div>
  );
}