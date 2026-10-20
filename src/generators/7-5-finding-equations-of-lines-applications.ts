// Practice problem generators for Lesson 7.5 — Finding Equations of Lines; Applications.
import { F, fmt, linTex, makeMasterySet, p, pick, randInt, type Frac } from './helpers';
import type { Problem, Skill } from './types';

const slopes = [F(2), F(-3), F(1, 2), F(-2, 3), F(3, 4), F(4), F(-1), F(-1, 2), F(5), F(3)];

/** y = m x + b as an answer string the checker can parse */
const eqText = (m: Frac, b: Frac) => `y = (${m.text()})*x + (${b.text()})`;

function pointSlope(): Problem {
  const m = pick(slopes);
  const x1 = randInt(-5, 5) * m.d, y1 = randInt(-6, 6);
  const b = m.mul(-x1).add(y1);
  return {
    skill: 'pointslope',
    prompt: `Find an equation of the line with slope $${m.tex()}$ through $(${x1}, ${y1})$. Write it in the form $y = mx + b$.`,
    answer: { type: 'equation', value: eqText(m, b), solveFor: 'y' },
    hints: ['Point–slope form: $y - y_1 = m(x - x_1)$.', `Substitute: $y - ${p(y1)} = ${m.tex()}(x - ${p(x1)})$. Then solve for $y$.`],
    solution: [`$y - ${p(y1)} = ${m.tex()}(x - ${p(x1)})$`, `$y = ${linTex(m, b)}$`],
    placeholder: 'y = 2x - 3',
  };
}

function twoPoints(): Problem {
  for (;;) {
    const m = pick(slopes);
    const x1 = randInt(-6, 6), y1 = randInt(-6, 6);
    const k = pick([1, 2, -1]);
    const x2 = x1 + k * m.d, y2 = y1 + k * m.n;
    if (Math.abs(x2) > 9 || Math.abs(y2) > 12) continue;
    const b = m.mul(-x1).add(y1);
    return {
      skill: 'twopoints',
      prompt: `Find an equation of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$. Write it in the form $y = mx + b$.`,
      answer: { type: 'equation', value: eqText(m, b), solveFor: 'y' },
      hints: ['First find the slope: $m = \\dfrac{y_2 - y_1}{x_2 - x_1}$.', 'Then use either point in $y - y_1 = m(x - x_1)$ and solve for $y$.'],
      solution: [`$m = \\dfrac{${y2} - ${p(y1)}}{${x2} - ${p(x1)}} = ${m.tex()}$`, `$y - ${p(y1)} = ${m.tex()}(x - ${p(x1)})$`, `$y = ${linTex(m, b)}$`],
      placeholder: 'y = -x + 4',
    };
  }
}

function parallelPerp(): Problem {
  const m0 = pick(slopes.filter((s) => !s.isZero()));
  const b0 = randInt(-6, 6);
  const perp = Math.random() < 0.5;
  const m = perp ? F(-m0.d, m0.n) : m0;
  const x1 = randInt(-4, 4) * m.d, y1 = randInt(-6, 6);
  const b = m.mul(-x1).add(y1);
  return {
    skill: 'parperp',
    prompt: `Find an equation of the line through $(${x1}, ${y1})$ that is **${perp ? 'perpendicular' : 'parallel'}** to $\\;y = ${linTex(m0, b0)}$. Write it as $y = mx + b$.`,
    answer: { type: 'equation', value: eqText(m, b), solveFor: 'y' },
    hints: [perp ? `A perpendicular slope is the opposite reciprocal of $${m0.tex()}$: $${m.tex()}$.` : `A parallel line has the same slope, $${m0.tex()}$.`, `Use point–slope form with $(${x1}, ${y1})$.`],
    solution: [`Slope $= ${m.tex()}$`, `$y - ${p(y1)} = ${m.tex()}(x - ${p(x1)})$`, `$y = ${linTex(m, b)}$`],
    placeholder: 'y = 3x + 1',
  };
}

function modelPredict(): Problem {
  const ctx = pick([
    { thing: 'The value of a car', unit: 'thousand dollars', t: 'years after purchase', rate: -pick([1, 1.5, 2, 2.5]), start: pick([20, 24, 28, 30]) },
    { thing: 'The number of members of a club', unit: 'members', t: 'years after it started', rate: pick([12, 15, 20, 25]), start: pick([40, 60, 80]) },
    { thing: 'The height of a tree', unit: 'feet', t: 'years after planting', rate: pick([1.5, 2, 3]), start: pick([4, 5, 6]) },
  ]);
  const t1 = randInt(1, 3), t2 = t1 + randInt(2, 4), tq = t2 + randInt(2, 5);
  const v = (t: number) => ctx.start + ctx.rate * t;
  return {
    skill: 'model',
    prompt: `${ctx.thing} was ${fmt(v(t1))} ${ctx.unit} ${t1} ${ctx.t} and ${fmt(v(t2))} ${ctx.unit} ${t2} ${ctx.t}. Assuming a linear model, predict the value ${tq} ${ctx.t}.`,
    answer: { type: 'number', value: v(tq) },
    hints: [`Use the data points $(${t1}, ${fmt(v(t1))})$ and $(${t2}, ${fmt(v(t2))})$ to find the slope (the rate of change).`, 'Write the equation of the line, then substitute the new time.'],
    solution: [`$m = \\dfrac{${fmt(v(t2))} - ${fmt(v(t1))}}{${t2} - ${t1}} = ${fmt(ctx.rate)}$ per year`, `$y = ${fmt(ctx.rate)}t + ${fmt(ctx.start)}$`.replace('+ -', '- '), `At $t = ${tq}$: $y = ${fmt(v(tq))}$ ${ctx.unit}`],
  };
}

export const skills: Skill[] = [
  { id: 'pointslope', label: 'Slope and a point', generate: pointSlope },
  { id: 'twopoints', label: 'Two points', generate: twoPoints },
  { id: 'parperp', label: 'Parallel or perpendicular line', generate: parallelPerp },
  { id: 'model', label: 'Linear models', generate: modelPredict },
];

export const masterySet = makeMasterySet(skills);
