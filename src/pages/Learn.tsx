import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Learn() {
  const [open, setOpen] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggle = (id: string) => {
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <Icon name="ArrowLeft" size={16} />
          На главную
        </button>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-red-600 mb-2">Отделение интернатуры</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Обучение</h1>
          <p className="mt-4 text-muted-foreground">
            Выберите раздел, чтобы ознакомиться с программой подготовки.
          </p>
        </div>

        <div className="flex flex-col gap-4">

          {/* ── Вступление (статичный, не гармошка) ── */}
          <div className="border border-border rounded-none overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 bg-card">
              <Icon name="Flag" size={20} className="text-red-600" />
              <span className="text-lg font-semibold">Вступление</span>
            </div>
            <div className="px-6 py-5 bg-background border-t border-border flex flex-col gap-4">
              <p className="text-xl font-bold text-foreground">
                Добро пожаловать в ЦГБ города Невский!
              </p>
              <p className="text-base text-foreground leading-relaxed">
                С этого момента Вы являетесь сотрудником Отделения Интернатуры.
              </p>
              <p className="text-base text-foreground leading-relaxed">
                На выход из Отделения Интернатуры и повышения до лаборанта вам дается{" "}
                <span className="text-red-600 font-semibold">14 дней</span>.
              </p>
            </div>
          </div>

          {/* ── Интерн ── */}
          <div className="border border-border rounded-none overflow-hidden">
            <button
              onClick={() => toggle("intern")}
              className="w-full flex items-center justify-between px-6 py-5 bg-card hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="GraduationCap" size={20} className="text-red-600" />
                <span className="text-lg font-semibold">Интерн</span>
              </div>
              <Icon name={open.includes("intern") ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground" />
            </button>

            {open.includes("intern") && (
              <div className="px-6 py-5 bg-background border-t border-border flex flex-col gap-5">
                {/* Главная задача */}
                <p className="text-xl font-bold text-red-400">
                  Твоя первая и главная задача: Получить допуск к лечению.
                </p>
                <p className="text-base text-foreground leading-relaxed">
                  До получения допуска к лечению вам нельзя абсолютно ничего. Лечить пациентов сможете только тогда, когда получите допуск к лечению.
                </p>

                <p className="text-base text-foreground font-medium">Чтобы получить допуск, вам нужно сдать:</p>

                <ol className="flex flex-col gap-5">
                  {/* 1 */}
                  <li className="flex items-start gap-3">
                    <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5">1</span>
                    <span className="text-base text-foreground">Прослушать вступительную лекцию;</span>
                  </li>

                  {/* 2 */}
                  <li className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5">2</span>
                      <span className="text-base text-foreground">Сдать устную речь;</span>
                    </div>
                    <div className="ml-8 border-l-2 border-red-600/40 pl-4 flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground italic">
                        Устная речь — это бинды. Слово «Бинд» в РП мы не используем!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        В устной речи мы проверяем, как Вы установили бинды и в случае чего, помогаем исправлять вместе с Вами.
                      </p>
                      <a
                        href="https://forum.gtaprovince.ru/topic/995732-cgb-g-nevskiy-bindy-dlya-sotrudnikov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium mt-1"
                      >
                        <Icon name="ExternalLink" size={13} />
                        Бинды для сотрудников
                      </a>
                    </div>
                  </li>

                  {/* 3 */}
                  <li className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5">3</span>
                      <span className="text-base text-foreground">Сдать Первичный Медицинский Экзамен;</span>
                    </div>
                    <div className="ml-8 border-l-2 border-red-600/40 pl-4 flex flex-col gap-2">
                      <p className="text-sm text-foreground font-medium">Первичный Медицинский Экзамен (ПМЭ) включает в себя:</p>
                      <ul className="flex flex-col gap-1.5">
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full border border-muted-foreground shrink-0" />
                          Информацию о больнице, которую Вам расскажут в процессе обучения;
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full border border-muted-foreground shrink-0" />
                          Практический экзамен по выдаче препаратов пациентам;
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full border border-muted-foreground shrink-0" />
                          Вопросы по Внутреннему уставу нашей больницы.
                        </li>
                      </ul>
                      <a
                        href="https://forum.gtaprovince.ru/topic/995741-cgb-g-nevskiy-vnutrenniy-ustav/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors font-medium mt-1"
                      >
                        <Icon name="ExternalLink" size={13} />
                        Внутренний Устав ЦГБ-Н
                      </a>
                    </div>
                  </li>

                  {/* 4 */}
                  <li className="flex items-start gap-3">
                    <span className="text-muted-foreground text-base w-5 shrink-0 pt-0.5">4</span>
                    <span className="text-base text-foreground">Клятву врача.</span>
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* ── Фельдшер ── */}
          <div className="border border-border rounded-none overflow-hidden">
            <button
              onClick={() => toggle("feldsher")}
              className="w-full flex items-center justify-between px-6 py-5 bg-card hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="Stethoscope" size={20} className="text-red-600" />
                <span className="text-lg font-semibold">Фельдшер</span>
              </div>
              <Icon name={open.includes("feldsher") ? "ChevronUp" : "ChevronDown"} size={18} className="text-muted-foreground" />
            </button>

            {open.includes("feldsher") && (
              <div className="px-6 py-5 bg-background border-t border-border">
                <ul className="flex flex-col gap-3">
                  {[
                    "Протоколы первичной диагностики пациентов",
                    "Алгоритмы оказания неотложной помощи",
                    "Ведение сестринской документации и карт наблюдения",
                    "Правила хранения и выдачи лекарственных средств",
                    "Взаимодействие с дежурным врачом и старшим медперсоналом",
                    "Инфекционная безопасность и работа с биоматериалом",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-1 w-2 h-2 rounded-full bg-red-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}