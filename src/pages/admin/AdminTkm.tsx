import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SectionHeader, Inp } from "./adminHelpers";

interface Props {
  allowed: string[];
  saving: boolean;
  saved: boolean;
  onSave: (list: string[]) => void;
}

export default function AdminTkm({ allowed, saving, saved, onSave }: Props) {
  const [list, setList] = useState<string[]>(allowed);
  const [input, setInput] = useState("");

  const add = () => {
    const nick = input.trim().toLowerCase().replace(/^(https?:\/\/)?(vk\.(ru|com)\/)?@?/, "").replace(/\/$/, "");
    if (!nick || list.includes(nick)) { setInput(""); return; }
    setList(prev => [...prev, nick]);
    setInput("");
  };

  const remove = (nick: string) => setList(prev => prev.filter(n => n !== nick));

  return (
    <div className="max-w-xl">
      <SectionHeader title="Допуск к ТКМ" desc="Люди из этого списка увидят раздел ТКМ в обучении" />

      <div className="flex gap-2 mb-4">
        <Inp
          value={input}
          onChange={setInput}
          placeholder="Никнейм ВКонтакте"
          className="flex-1"
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
          {list.map((nick) => (
            <div key={nick} className="flex items-center justify-between px-3 py-2.5 border border-zinc-800 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <Icon name="User" size={14} className="text-zinc-500 shrink-0" />
                <span className="text-sm text-zinc-200">{nick}</span>
              </div>
              <button
                onClick={() => remove(nick)}
                className="text-zinc-600 hover:text-red-400 transition-colors"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => onSave(list)}
        disabled={saving || saved}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors"
      >
        {saved ? <><Icon name="Check" size={14} />Сохранено</> : saving ? "Сохраняю..." : <><Icon name="Save" size={14} />Сохранить</>}
      </button>
    </div>
  );
}
