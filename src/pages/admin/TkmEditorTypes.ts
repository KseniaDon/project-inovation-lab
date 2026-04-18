import {
  TKM_QUESTIONS,
  TKM_SECTION3,
  TKM_SECTION3_OPEN,
  TKM_SECTION4_RADIO,
  TKM_SECTION4_RADIO2,
  TKM_SECTION4_MULTI,
  TKM_SECTION4_STYLED,
  TKM_SECTION4_OPEN,
  TKM_SECTION5_MULTI,
  TKM_SECTION5_OPEN,
  TkmStyledMultiQuestion,
  TkmSection4OpenQuestion,
  TkmSection5OpenQuestion,
} from "../learn/tkmAnswerKey";

export type EditableQuestion = { key: string; text: string; options: string[]; correct: string; points: number };
export type EditableOpenQuestion = { key: string; num: number; title: string; situation?: string; example: string; notRequired: string; warning: string; points: number };
export type EditableStyledMulti = TkmStyledMultiQuestion & { points: number };
export type EditableSimpleOpen = TkmSection4OpenQuestion & { points: number };
export type EditableMultiQuestion = { key: string; num: number; text: string; options: string[]; correct: string[]; points: number };
export type EditableS5Open = TkmSection5OpenQuestion & { points: number };

export const DEPT_LABELS: Record<string, string> = {
  ОИК: "ОИК — Отделение инфекционного контроля",
  СОП: "СОП — Стоматологическое отделение поликлиники",
  ОДС: "ОДС — Отделение дневного стационара",
};

export function initMcq(): EditableQuestion[] { return TKM_SECTION3.map(q => ({ ...q, points: 1 })); }
export function initDeptMcq(): Record<string, EditableQuestion[]> {
  const r: Record<string, EditableQuestion[]> = {};
  for (const d of Object.keys(TKM_QUESTIONS)) r[d] = TKM_QUESTIONS[d].map(q => ({ ...q, points: 1 }));
  return r;
}
export function initOpen(): EditableOpenQuestion[] { return TKM_SECTION3_OPEN.map(q => ({ ...q, points: 5 })); }
export function initS4Radio(): EditableQuestion[] { return TKM_SECTION4_RADIO.map(q => ({ ...q, points: 1 })); }
export function initS4Radio2(): EditableQuestion[] { return TKM_SECTION4_RADIO2.map(q => ({ ...q, points: 1 })); }
export function initS4Multi(): EditableMultiQuestion[] { return TKM_SECTION4_MULTI.map(q => ({ ...q, points: 1 })); }
export function initS4Styled(): EditableStyledMulti[] { return TKM_SECTION4_STYLED.map(q => ({ ...q, points: 4 })); }
export function initS4Open(): EditableSimpleOpen[] { return TKM_SECTION4_OPEN.map(q => ({ ...q, points: 4 })); }
export function initS5Multi(): EditableMultiQuestion[] { return TKM_SECTION5_MULTI.map(q => ({ ...q, points: 3 })); }
export function initS5Open(): EditableS5Open[] { return TKM_SECTION5_OPEN.map(q => ({ ...q, points: q.key === "4.30" ? 5 : 3 })); }
