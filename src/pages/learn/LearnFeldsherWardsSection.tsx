import Icon from "@/components/ui/icon";
import { SectionId } from "./learnConfig";
import WardOIK from "./WardOIK";
import WardSOP from "./WardSOP";
import WardODS from "./WardODS";

interface Props {
  go: (id: SectionId) => void;
}

export default function LearnFeldsherWardsSection({ go }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          onClick={() => go("feldsher")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <Icon name="ChevronLeft" size={14} />
          Назад к Фельдшеру
        </button>
        <p className="text-xs uppercase tracking-widest text-red-600 mb-1">Шаг 1: Сдача ОМЭ</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Специализация отделений</h1>
        <p className="text-base font-semibold text-muted-foreground">1.8 Специализация отделений.</p>
      </div>

      <div className="flex flex-col gap-4 text-base text-foreground leading-relaxed">
        <p>
          Прежде, чем повыситься в должности, Вам предстоит выбрать отделение, в котором Вы будете работать и предоставлять услуги пациентам. На сдаче ОМЭ, в конце экзамена Вам нужно будет выбрать пробное одно отделение, где расскажут о работе и как выполнять эту саму работу. В дальнейшем, когда Вы будете уже на шаге повышения — Вам нужно будет определиться окончательно.
        </p>
        <p>
          Наши отделения отличаются работой, но каждое из них приносит большой вклад в нашу больницу и имеет интересное разнообразие. Возможно, что выбор будет крайне тяжел, но благодаря полному рассказу о каждом отделении — Вы определитесь.
        </p>
        <p>Давайте подробно разберём терапевтические отделения нашей больницы.</p>
      </div>

      <WardOIK />
      <WardSOP />
      <WardODS />
    </div>
  );
}
