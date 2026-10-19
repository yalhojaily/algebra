// Practice problem generators for Lesson 3.2 — Graphing Linear Equations.
import { F, Frac, linTex, makeMasterySet, nz, pick, randInt, termTex } from './helpers';
import type { Problem, Skill } from './types';

/** y = m x + b  →  integers a, b', c with a x + b' y = c */
export function lineOf(m: Frac, b: Frac) {
  // y = (n/d) x + B  →  -n x + d y = d B
  const d = m.d * b.d;
  return { a: -m.n * (d / m.d), b: d, c: b.n * (d / b.d) };
}

const slopes = [F(1), F(2), F(3), F(-1), F(-2), F(-3), F(1, 2), F(-1, 2), F(1, 3), F(2, 3), F(-2, 3), F(3, 2), F(-3, 4), F(1, 4)];

function graphSlopeIntercept(): Problem {
  const m = pick(slopes);
  const b = F(randInt(-5, 5));
  const eq = `y = ${linTex(m, b)}`;
  const x2 = m.d;
  return {
    skill: 'graph',
    prompt: `Graph $\\;${eq}$. (Click two points on the line.)`,
    answer: { type: 'plot', mode: 'line', ...lineOf(m, b) },
    hints: [
      `Make a table: choose $x$-values${m.d > 1 ? ` that are multiples of $${m.d}$ (so $y$ is a whole number)` : ''}, and find $y$ for each.`,
      `For example, $x = 0$ gives $y = ${b.tex()}$, and $x = ${x2}$ gives $y = ${m.mul(x2).add(b).tex()}$.`,
    ],
    solution: [`Two points: $(0, ${b.tex()})$ and $(${x2}, ${m.mul(x2).add(b).tex()})$. Plot them and draw the line through them.`],
  };
}

function graphStandard(): Problem {
  for (;;) {
    const a = nz(4);
    const b = nz(4);
    const x0 = randInt(-4, 4);
    const y0 = randInt(-4, 4);
    const c = a * x0 + b * y0;
    if (b === 0) continue;
    const m = F(-a, b);
    const yi = F(c, b);
    if (yi.d !== 1 && m.d !== 1) continue;
    const eq = `${linTex(a, 0)} ${b < 0 ? '-' : '+'} ${termTex(Math.abs(b), 'y')} = ${c}`;
    return {
      skill: 'standard',
      prompt: `Graph $\\;${eq}$.`,
      answer: { type: 'plot', mode: 'line', a, b, c },
      hints: ['Solve for $y$ first, or make a table by choosing values of $x$ and solving for $y$.', `One point on the line is $(${x0}, ${y0})$. Find one more.`],
      solution: [`Solve for $y$: $\\;y = ${linTex(m, yi)}$`, `Points such as $(${x0}, ${y0})$ and $(${x0 + m.d}, ${y0 + m.n})$ are on the line.`],
    };
  }
}

function yIntercept(): Problem {
  const m = pick(slopes);
  const b = randInt(-9, 9);
  const form = pick(['si', 'std'] as const);
  if (form === 'si')
    return {
      skill: 'intercept',
      prompt: `What is the $y$-intercept of the graph of $\\;y = ${linTex(m, b)}$? (Write it as a point.)`,
      answer: { type: 'point', x: 0, y: b },
      hints: ['The $y$-intercept is where the line crosses the $y$-axis, so $x = 0$ there.', 'In $y = mx + b$, the $y$-intercept is $(0, b)$.'],
      solution: [`When $x = 0$, $y = ${b}$. The $y$-intercept is $(0, ${b})$.`],
      mistakes: [{ answer: `(${b}, 0)`, feedback: 'On the $y$-axis, $x = 0$. So the point is $(0, b)$, not $(b, 0)$.' }],
      placeholder: '(0, y)',
    };
  const a = nz(6);
  const k = nz(5);
  const c = k * b;
  return {
    skill: 'intercept',
    prompt: `What is the $y$-intercept of the graph of $\\;${linTex(a, 0)} ${k < 0 ? '-' : '+'} ${termTex(Math.abs(k), 'y')} = ${c}$? (Write it as a point.)`,
    answer: { type: 'point', x: 0, y: b },
    hints: ['Set $x = 0$ and solve for $y$.'],
    solution: [`$x = 0$: $\\;${k}y = ${c}$, so $y = ${b}$. The $y$-intercept is $(0, ${b})$.`],
    placeholder: '(0, y)',
  };
}

function apply(): Problem {
  const t = pick([
    () => {
      const fee = pick([20, 30, 50]);
      const rate = pick([5, 8, 10, 12]);
      const n = randInt(2, 15);
      return { prompt: `A gym charges a joining fee plus a monthly price: the total cost after $n$ months is $C = ${rate}n + ${fee}$ (in dollars). What is the total after $${n}$ months?`, value: rate * n + fee, sol: [`$C = ${rate} \\cdot ${n} + ${fee} = ${rate * n + fee}$ dollars`] };
    },
    () => {
      const start = pick([40, 50, 60]);
      const rate = pick([2, 3, 4]);
      const t = randInt(2, 12);
      return { prompt: `A candle is $${start}$ cm tall and burns down $${rate}$ cm per hour, so its height is $h = ${start} - ${rate}t$. How tall is it after $${t}$ hours?`, value: start - rate * t, sol: [`$h = ${start} - ${rate} \\cdot ${t} = ${start - rate * t}$ cm`] };
    },
    () => {
      const rate = pick([0.5, 1.5, 2, 2.5]);
      const base = pick([3, 5, 8]);
      const k = randInt(2, 20);
      return { prompt: `A taxi fare is $f = ${rate}k + ${base}$ riyals for a ride of $k$ km. Find the fare for $${k}$ km.`, value: rate * k + base, sol: [`$f = ${rate} \\cdot ${k} + ${base} = ${rate * k + base}$ riyals`] };
    },
  ])();
  return { skill: 'apply', prompt: t.prompt, answer: { type: 'number', value: t.value }, hints: ['Substitute the value into the equation.'], solution: t.sol };
}

export const skills: Skill[] = [
  { id: 'graph', label: 'Graph y = mx + b', generate: graphSlopeIntercept },
  { id: 'standard', label: 'Graph Ax + By = C', generate: graphStandard },
  { id: 'intercept', label: 'y-intercept', generate: yIntercept },
  { id: 'apply', label: 'Linear models', generate: apply },
];

export const masterySet = makeMasterySet(skills);

