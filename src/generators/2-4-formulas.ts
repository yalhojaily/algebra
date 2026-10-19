// Practice problem generators for Lesson 2.4 — Formulas.
import { fmt, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function evaluate(): Problem {
  const t = pick([
    () => {
      const l = randInt(5, 30), w = randInt(2, 20);
      return { tex: 'P = 2l + 2w', given: `$l = ${l}$ and $w = ${w}$`, find: 'P', value: 2 * l + 2 * w, steps: [`$P = 2 \\cdot ${l} + 2 \\cdot ${w}$`, `$= ${2 * l} + ${2 * w} = ${2 * l + 2 * w}$`] };
    },
    () => {
      const P = randInt(1, 20) * 100, r = pick([0.03, 0.04, 0.05, 0.06, 0.08]), t = randInt(1, 5);
      const I = +(P * r * t).toFixed(2);
      return { tex: 'I = Prt', given: `$P = ${P}$, $r = ${r}$, and $t = ${t}$`, find: 'I', value: I, steps: [`$I = ${P} \\cdot ${r} \\cdot ${t}$`, `$= ${I}$`] };
    },
    () => {
      const C = pick([-40, -10, 0, 5, 10, 15, 20, 25, 30, 35, 40, 100]);
      const F = (9 / 5) * C + 32;
      return { tex: 'F = \\tfrac{9}{5}C + 32', given: `$C = ${C}$`, find: 'F', value: F, steps: [`$F = \\tfrac{9}{5} \\cdot ${C < 0 ? `(${C})` : C} + 32$`, `$= ${fmt((9 / 5) * C)} + 32 = ${fmt(F)}$`] };
    },
    () => {
      const a = randInt(50, 100), b = randInt(50, 100), c = randInt(50, 100);
      const A = (a + b + c) / 3;
      return { tex: 'A = \\dfrac{a + b + c}{3}', given: `$a = ${a}$, $b = ${b}$, and $c = ${c}$`, find: 'A', value: A, steps: [`$A = \\dfrac{${a} + ${b} + ${c}}{3} = \\dfrac{${a + b + c}}{3}$`, `$= ${fmt(A)}$`] };
    },
    () => {
      const r = randInt(40, 120), t = pick([0.5, 1.5, 2, 2.5, 3, 4]);
      return { tex: 'd = rt', given: `$r = ${r}$ and $t = ${t}$`, find: 'd', value: r * t, steps: [`$d = ${r} \\cdot ${t} = ${fmt(r * t)}$`] };
    },
  ])();
  return {
    skill: 'evaluate',
    prompt: `Use the formula $\\;${t.tex}\\;$ to find $${t.find}$ when ${t.given}.`,
    answer: { type: 'number', value: t.value },
    hints: ['Substitute each value for its letter, then follow the order of operations.'],
    solution: t.steps,
  };
}

interface Rearrange {
  formula: string; // TeX
  v: string;
  answer: string; // input form
  answerTex: string;
  steps: string[];
  context?: string;
}

const formulas: Rearrange[] = [
  { formula: 'A = lw', v: 'w', answer: 'w = A/l', answerTex: 'w = \\dfrac{A}{l}', steps: ['Divide both sides by $l$: $\\dfrac{A}{l} = \\dfrac{lw}{l}$'], context: 'area of a rectangle' },
  { formula: 'A = lw', v: 'l', answer: 'l = A/w', answerTex: 'l = \\dfrac{A}{w}', steps: ['Divide both sides by $w$.'], context: 'area of a rectangle' },
  { formula: 'd = rt', v: 't', answer: 't = d/r', answerTex: 't = \\dfrac{d}{r}', steps: ['Divide both sides by $r$.'], context: 'distance, rate, time' },
  { formula: 'd = rt', v: 'r', answer: 'r = d/t', answerTex: 'r = \\dfrac{d}{t}', steps: ['Divide both sides by $t$.'], context: 'distance, rate, time' },
  { formula: 'I = Prt', v: 'P', answer: 'P = I/(rt)', answerTex: 'P = \\dfrac{I}{rt}', steps: ['Divide both sides by $rt$.'], context: 'simple interest' },
  { formula: 'I = Prt', v: 't', answer: 't = I/(Pr)', answerTex: 't = \\dfrac{I}{Pr}', steps: ['Divide both sides by $Pr$.'], context: 'simple interest' },
  { formula: 'A = \\tfrac{1}{2}bh', v: 'h', answer: 'h = 2A/b', answerTex: 'h = \\dfrac{2A}{b}', steps: ['Multiply both sides by $2$: $2A = bh$', 'Divide both sides by $b$.'], context: 'area of a triangle' },
  { formula: 'A = \\tfrac{1}{2}bh', v: 'b', answer: 'b = 2A/h', answerTex: 'b = \\dfrac{2A}{h}', steps: ['Multiply both sides by $2$: $2A = bh$', 'Divide both sides by $h$.'], context: 'area of a triangle' },
  { formula: 'P = 2l + 2w', v: 'l', answer: 'l = (P - 2w)/2', answerTex: 'l = \\dfrac{P - 2w}{2}', steps: ['Subtract $2w$ from both sides: $P - 2w = 2l$', 'Divide both sides by $2$.'], context: 'perimeter of a rectangle' },
  { formula: 'P = 2l + 2w', v: 'w', answer: 'w = (P - 2l)/2', answerTex: 'w = \\dfrac{P - 2l}{2}', steps: ['Subtract $2l$ from both sides: $P - 2l = 2w$', 'Divide both sides by $2$.'], context: 'perimeter of a rectangle' },
  { formula: 'y = mx + b', v: 'x', answer: 'x = (y - b)/m', answerTex: 'x = \\dfrac{y - b}{m}', steps: ['Subtract $b$ from both sides: $y - b = mx$', 'Divide both sides by $m$.'], context: 'equation of a line' },
  { formula: 'y = mx + b', v: 'b', answer: 'b = y - mx', answerTex: 'b = y - mx', steps: ['Subtract $mx$ from both sides.'], context: 'equation of a line' },
  { formula: 'A = \\dfrac{a + b}{2}', v: 'b', answer: 'b = 2A - a', answerTex: 'b = 2A - a', steps: ['Multiply both sides by $2$: $2A = a + b$', 'Subtract $a$ from both sides.'], context: 'average of two numbers' },
  { formula: 'P = a + b + c', v: 'c', answer: 'c = P - a - b', answerTex: 'c = P - a - b', steps: ['Subtract $a$ and $b$ from both sides.'], context: 'perimeter of a triangle' },
  { formula: 'F = \\tfrac{9}{5}C + 32', v: 'C', answer: 'C = (5/9)(F - 32)', answerTex: 'C = \\tfrac{5}{9}(F - 32)', steps: ['Subtract $32$ from both sides: $F - 32 = \\tfrac{9}{5}C$', 'Multiply both sides by $\\tfrac{5}{9}$.'], context: 'Fahrenheit and Celsius' },
  { formula: '3x + 2y = 12', v: 'y', answer: 'y = (12 - 3x)/2', answerTex: 'y = \\dfrac{12 - 3x}{2} = 6 - \\tfrac{3}{2}x', steps: ['Subtract $3x$ from both sides: $2y = 12 - 3x$', 'Divide both sides by $2$.'] },
  { formula: 'Ax + By = C', v: 'y', answer: 'y = (C - Ax)/B', answerTex: 'y = \\dfrac{C - Ax}{B}', steps: ['Subtract $Ax$ from both sides: $By = C - Ax$', 'Divide both sides by $B$.'] },
];

function solveFor(): Problem {
  const f = pick(formulas);
  return {
    skill: 'solvefor',
    prompt: `Solve for $${f.v}$: $\\;${f.formula}$${f.context ? ` (${f.context})` : ''}`,
    answer: { type: 'equation', value: f.answer, solveFor: f.v },
    hints: [
      `Treat every letter except $${f.v}$ as if it were a number. Undo the operations around $${f.v}$ in reverse order.`,
      f.steps[0],
    ],
    solution: [...f.steps, `$${f.answerTex}$`],
    placeholder: `${f.v} = …`,
  };
}

function useSolved(): Problem {
  const t = pick([
    () => {
      const A = randInt(4, 20) * 6, l = pick([6, 8, 12, 4, 3]);
      return { prompt: `A rectangle has area $${A}$ cm² and length $${l}$ cm. Solve $A = lw$ for $w$, then find the width.`, value: A / l, steps: [`$w = \\dfrac{A}{l} = \\dfrac{${A}}{${l}} = ${fmt(A / l)}$ cm`] };
    },
    () => {
      const d = randInt(2, 12) * 60, r = pick([40, 60, 80, 120]);
      return { prompt: `A train travels $${d}$ km at $${r}$ km/h. Solve $d = rt$ for $t$, then find the time in hours.`, value: d / r, steps: [`$t = \\dfrac{d}{r} = \\dfrac{${d}}{${r}} = ${fmt(d / r)}$ hours`] };
    },
    () => {
      const P = randInt(20, 60) * 2, w = randInt(3, 15);
      return { prompt: `A garden's perimeter is $${P}$ m and its width is $${w}$ m. Solve $P = 2l + 2w$ for $l$, then find the length.`, value: (P - 2 * w) / 2, steps: [`$l = \\dfrac{P - 2w}{2} = \\dfrac{${P} - ${2 * w}}{2} = ${fmt((P - 2 * w) / 2)}$ m`] };
    },
    () => {
      const F = pick([32, 50, 68, 86, 104, 212, 14, -4]);
      return { prompt: `It is $${F}^\\circ$F. Solve $F = \\tfrac{9}{5}C + 32$ for $C$, then find the temperature in degrees Celsius.`, value: (5 / 9) * (F - 32), steps: [`$C = \\tfrac{5}{9}(F - 32) = \\tfrac{5}{9}(${F} - 32) = ${fmt((5 / 9) * (F - 32))}$`] };
    },
  ])();
  return {
    skill: 'use',
    prompt: t.prompt,
    answer: { type: 'number', value: t.value },
    hints: ['First rearrange the formula, then substitute the numbers you know.'],
    solution: t.steps,
  };
}

export const skills: Skill[] = [
  { id: 'evaluate', label: 'Evaluate a formula', generate: evaluate },
  { id: 'solvefor', label: 'Solve for a letter', generate: solveFor },
  { id: 'use', label: 'Rearrange, then use', generate: useSolved },
];

export const masterySet = makeMasterySet(skills);
