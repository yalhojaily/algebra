// Practice problem generators for Lesson 6.8 — Applications Using Rational Equations and Proportions.
import { dfrac, fmt, fracIn, fracTex, lcm, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function work(): Problem {
  const [a, b] = pick([[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [5, 20], [6, 30], [4, 6], [6, 9], [8, 24], [9, 18], [12, 36], [2, 3], [3, 5], [4, 5]] as [number, number][]);
  const ctx = pick([
    { who: ['Ana', 'Ben'], job: 'paint a room', unit: 'hours' },
    { who: ['One pipe', 'a second pipe'], job: 'fill a tank', unit: 'hours' },
    { who: ['Lee', 'Sam'], job: 'mow a lawn', unit: 'hours' },
    { who: ['Machine A', 'machine B'], job: 'print an order', unit: 'minutes' },
  ]);
  const t = (a * b) / (a + b);
  return {
    skill: 'work',
    prompt: `${ctx.who[0]} can ${ctx.job} in ${a} ${ctx.unit}; ${ctx.who[1]} can do it in ${b} ${ctx.unit}. How long will it take working together? (Exact answer, in ${ctx.unit}.)`,
    answer: { type: 'number', value: t },
    hints: [`In one ${ctx.unit.slice(0, -1)}, the first does $\\frac{1}{${a}}$ of the job and the second does $\\frac{1}{${b}}$.`, `Solve $\\frac{t}{${a}} + \\frac{t}{${b}} = 1$.`],
    solution: [`$${dfrac('t', String(a))} + ${dfrac('t', String(b))} = 1$`, `Multiply by the LCD, $${lcm(a, b)}$: $\\;${lcm(a, b) / a}t + ${lcm(a, b) / b}t = ${lcm(a, b)}$`, `$t = ${fracTex(a * b, a + b)}${Number.isInteger(t) ? '' : ` \\approx ${fmt(+t.toFixed(2))}`}$ ${ctx.unit}`],
    mistakes: [{ answer: String((a + b) / 2), feedback: 'Working together must be **faster** than either one alone. Add the rates (jobs per hour), not the times.' }, { answer: String(a + b), feedback: 'Working together must be **faster** than either one alone. Add the rates (jobs per hour), not the times.' }],
    placeholder: fracIn(12, 5),
  };
}

function motion(): Problem {
  const c = randInt(2, 6), r = c + randInt(3, 15), t = randInt(2, 5);
  const d1 = (r + c) * t, d2 = (r - c) * t;
  return {
    skill: 'motion',
    prompt: `A boat travels ${d1} km downstream in the same time it travels ${d2} km upstream. The current is ${c} km/h. What is the boat's speed in still water (km/h)?`,
    answer: { type: 'number', value: r },
    hints: [`Let $r$ be the speed in still water. Downstream speed $= r + ${c}$, upstream speed $= r - ${c}$.`, `Time = distance ÷ speed, and the times are equal: $${dfrac(String(d1), `r + ${c}`)} = ${dfrac(String(d2), `r - ${c}`)}$.`],
    solution: [`$${dfrac(String(d1), `r + ${c}`)} = ${dfrac(String(d2), `r - ${c}`)}$`, `$${d1}(r - ${c}) = ${d2}(r + ${c})$`, `$${d1}r - ${d1 * c} = ${d2}r + ${d2 * c}$`, `$${d1 - d2}r = ${(d1 + d2) * c}$, so $r = ${r}$ km/h`],
  };
}

function proportion(): Problem {
  const ctx = pick([
    { a: 'cups of flour', b: 'cookies', A: [2, 3, 4], B: [24, 36, 30, 40] },
    { a: 'gallons of gas', b: 'miles', A: [5, 8, 12], B: [140, 200, 288] },
    { a: 'inches on the map', b: 'miles', A: [2, 3, 4], B: [50, 75, 120] },
  ]);
  const a = pick(ctx.A), b = pick(ctx.B);
  const k = pick([2, 3, 5, 1.5, 2.5]);
  const b2 = b * k;
  const x = a * k;
  return {
    skill: 'proportion',
    prompt: `If ${a} ${ctx.a} give ${b} ${ctx.b}, how many ${ctx.a} are needed for ${fmt(b2)} ${ctx.b}?`,
    answer: { type: 'number', value: x },
    hints: [`Set up a proportion with the same order on both sides: $${dfrac(String(a), String(b))} = ${dfrac('x', fmt(b2))}$.`],
    solution: [`$${dfrac(String(a), String(b))} = ${dfrac('x', fmt(b2))}$`, `Cross-multiply: $${b}x = ${a} \\cdot ${fmt(b2)}$`, `$x = ${fmt(x)}$`],
  };
}

export const skills: Skill[] = [
  { id: 'work', label: 'Work together', generate: work },
  { id: 'motion', label: 'Motion', generate: motion },
  { id: 'proportion', label: 'Proportions', generate: proportion },
];

export const masterySet = makeMasterySet(skills);
