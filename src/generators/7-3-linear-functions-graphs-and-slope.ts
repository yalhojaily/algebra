// Practice problem generators for Lesson 7.3 — Linear Functions: Graphs and Slope.
import { lineOf } from './3-2-graphing-linear-equations';
import { F, fmt, linTex, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const slopes = [F(1), F(2), F(3), F(-1), F(-2), F(-3), F(1, 2), F(-1, 2), F(2, 3), F(-2, 3), F(3, 2), F(-3, 4), F(1, 3)];
const fn = () => pick(['f', 'g', 'h']);

function slopeOf(): Problem {
  const m = pick(slopes), b = randInt(-9, 9), f = fn();
  return {
    skill: 'slope',
    prompt: `What is the slope of the graph of $${f}(x) = ${linTex(m, b)}$?`,
    answer: { type: 'number', value: m.valueOf() },
    hints: ['A linear function $f(x) = mx + b$ has slope $m$ — the coefficient of $x$.'],
    solution: [`The coefficient of $x$ is $${m.tex()}$, so the slope is $${m.tex()}$.`],
    mistakes: [{ answer: String(b), feedback: 'That is $b$, which gives the **y-intercept**. The slope is the coefficient of $x$.' }],
    placeholder: 'e.g. -2/3',
  };
}

function interceptOf(): Problem {
  const m = pick(slopes), b = randInt(-9, 9), f = fn();
  return {
    skill: 'intercept',
    prompt: `What is the $y$-intercept of the graph of $${f}(x) = ${linTex(m, b)}$? (Write it as a point.)`,
    answer: { type: 'point', x: 0, y: b },
    hints: [`The $y$-intercept is where $x = 0$: find $${f}(0)$.`],
    solution: [`$${f}(0) = ${b}$, so the $y$-intercept is $(0, ${b})$.`],
    placeholder: '(0, 3)',
  };
}

function graphFn(): Problem {
  const m = pick(slopes), b = F(randInt(-5, 5)), f = fn();
  return {
    skill: 'graph',
    prompt: `Graph $\\;${f}(x) = ${linTex(m, b)}$ using the slope and $y$-intercept. (Click two points.)`,
    answer: { type: 'plot', mode: 'line', ...lineOf(m, b) },
    hints: [`Start at the $y$-intercept $(0, ${b.tex()})$.`, `The slope is $${m.tex()} = \\dfrac{${m.n}}{${m.d}}$: move ${m.n < 0 ? 'down' : 'up'} $${Math.abs(m.n)}$ and right $${m.d}$ to find another point.`],
    solution: [`Plot $(0, ${b.tex()})$, then $(${m.d}, ${b.add(m.n).tex()})$, and draw the line.`],
  };
}

function model(): Problem {
  const ctx = pick([
    { what: 'A taxi ride', unit: 'dollars', x: 'miles', rate: pick([2, 2.5, 3]), base: pick([3, 4, 5]), fn: 'C', var: 'm' },
    { what: 'A gym membership', unit: 'dollars', x: 'months', rate: pick([25, 30, 40]), base: pick([50, 75, 100]), fn: 'C', var: 't' },
    { what: 'A candle', unit: 'cm tall', x: 'hours of burning', rate: pick([-2, -1.5, -3]), base: pick([24, 30, 36]), fn: 'H', var: 't' },
  ]);
  const ask = pick(['rate', 'value'] as const);
  const x0 = randInt(2, 8);
  const val = ctx.base + ctx.rate * x0;
  const formula = `${ctx.fn}(${ctx.var}) = ${fmt(ctx.rate)}${ctx.var} + ${ctx.base}`.replace('+ -', '- ');
  if (ask === 'rate')
    return {
      skill: 'model',
      prompt: `${ctx.what} is modeled by $${formula}$, where $${ctx.var}$ is the number of ${ctx.x}. What is the rate of change (the change in ${ctx.unit.split(' ')[0]} per ${ctx.x.split(' ')[0].replace(/s$/, '')})?`,
      answer: { type: 'number', value: ctx.rate },
      hints: ['In a linear function, the rate of change is the slope — the coefficient of the variable.'],
      solution: [`The slope is $${fmt(ctx.rate)}$: ${ctx.rate < 0 ? 'it decreases' : 'it increases'} by $${fmt(Math.abs(ctx.rate))}$ for each additional ${ctx.x.split(' ')[0].replace(/s$/, '')}.`],
    };
  return {
    skill: 'model',
    prompt: `${ctx.what} is modeled by $${formula}$, where $${ctx.var}$ is the number of ${ctx.x}. Find $${ctx.fn}(${x0})$.`,
    answer: { type: 'number', value: val },
    hints: [`Substitute $${x0}$ for $${ctx.var}$.`],
    solution: [`$${ctx.fn}(${x0}) = ${fmt(ctx.rate)} \\cdot ${x0} + ${ctx.base} = ${fmt(val)}$ ${ctx.unit}`],
  };
}

export const skills: Skill[] = [
  { id: 'slope', label: 'Slope of f(x) = mx + b', generate: slopeOf },
  { id: 'intercept', label: 'y-intercept', generate: interceptOf },
  { id: 'graph', label: 'Graph a linear function', generate: graphFn },
  { id: 'model', label: 'Linear models', generate: model },
];

export const masterySet = makeMasterySet(skills);
