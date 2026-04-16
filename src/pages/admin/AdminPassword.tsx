import { playClickSound } from "@/hooks/useSound";
import Icon from "@/components/ui/icon";

interface Props {
  pwCurrent: string;
  setPwCurrent: (v: string) => void;
  pwNew: string;
  setPwNew: (v: string) => void;
  pwConfirm: string;
  setPwConfirm: (v: string) => void;
  pwMsg: string;
  pwLoading: boolean;
  onChangePassword: () => void;
}

export default function AdminPassword({
  pwCurrent, setPwCurrent,
  pwNew, setPwNew,
  pwConfirm, setPwConfirm,
  pwMsg, pwLoading,
  onChangePassword,
}: Props) {
  return (
    <div className="max-w-md">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Управление</p>
        <h2 className="text-xl font-bold">Мой пароль</h2>
        <p className="text-sm text-zinc-400 mt-1">Смена пароля для входа в панель</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-400 uppercase tracking-wider">Текущий пароль</label>
          <input
            type="password"
            value={pwCurrent}
            onChange={e => setPwCurrent(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-400 uppercase tracking-wider">Новый пароль</label>
          <input
            type="password"
            value={pwNew}
            onChange={e => setPwNew(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-400 uppercase tracking-wider">Повторите новый пароль</label>
          <input
            type="password"
            value={pwConfirm}
            onChange={e => setPwConfirm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onChangePassword()}
            className="bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 text-sm outline-none focus:border-red-600 transition-colors"
          />
        </div>
        {pwMsg && (
          <p className={`text-sm ${pwMsg.includes("успешно") ? "text-green-400" : "text-red-400"}`}>{pwMsg}</p>
        )}
        <button
          onClick={() => { playClickSound(); onChangePassword(); }}
          disabled={pwLoading}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          {pwLoading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Icon name="KeyRound" size={13} />
          }
          Изменить пароль
        </button>
      </div>
    </div>
  );
}
