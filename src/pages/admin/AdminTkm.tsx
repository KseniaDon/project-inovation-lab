import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionHeader, Inp } from "./adminHelpers";

export interface TkmAllowedEntry {
  nick: string;
  attempts: number;
}

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
    setList(prev => [...prev, { nick, attempts: MAX_ATTEMPTS }]);
    setInput("");
  };

  const remove = (nick: string) => setList(prev => prev.filter(e => e.nick !== nick));

  const addAttempt = (nick: string) => {
    setList(prev => prev.map(e => e.nick === nick ? { ...e, attempts: e.attempts + 1 } : e));
  };

  const setAttempts = (nick: string, val: number) => {
    setList(prev => prev.map(e => e.nick === nick ? { ...e, attempts: Math.max(0, val) } : e));
  };

  const attemptColor = (n: number) => {
    if (n === 0) return "text-red-500";
    if (n === 1) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="max-w-xl">
      <SectionHeader title="Допуск к ТКМ" desc="Сотрудники из этого списка могут проходить ТКМ. У каждого 3 попытки." />

      <div className="flex gap-2 mb-4">
        <Inp
          value={input}
          onChange={setInput}
          placeholder="Никнейм ВКонтакте"
          className="flex-1"
          onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && add()}
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
                <span className={`text-sm font-bold w-5 text-center tabular-nums ${attemptColor(entry.attempts)}`}>
                  {entry.attempts}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAttempts(entry.nick, entry.attempts - 1)}
                    disabled={entry.attempts <= 0}
                    title="Убрать попытку"
                    className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-zinc-700 hover:border-zinc-500"
                  >
                    <Icon name="Minus" size={11} />
                  </button>
                  <button
                    onClick={() => addAttempt(entry.nick)}
                    title="Дать ещё попытку"
                    className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-green-400 transition-colors border border-zinc-700 hover:border-green-600"
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
          Зелёный — есть попытки · Жёлтый — 1 попытка · Красный — исчерпаны
        </p>
      </div>
    </div>
  );
}
