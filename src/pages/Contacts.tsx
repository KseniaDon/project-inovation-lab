import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Contacts() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="max-w-2xl mx-auto px-6 py-16 w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <Icon name="ArrowLeft" size={16} />
          На главную
        </button>

        <p className="text-xs uppercase tracking-widest text-red-600 mb-2">ЦГБ Невский</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-10">Контакты</h1>

        <div className="border border-border p-6 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Куратор Отделения Интернатуры
          </p>
          <a
            href="https://vk.ru/soul__shu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl md:text-2xl font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
          >
            Ksenia_Donskaya
            <Icon name="ExternalLink" size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
