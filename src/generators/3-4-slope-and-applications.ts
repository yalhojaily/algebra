// Practice problem generators for Lesson 3.4 — Slope and Applications.
import { choice, F, linTex, makeMasterySet, nz, p, pick, randInt, termTex } from './helpers';
import type { Problem, Skill } from './types';

function twoPoints(): Problem {
  for (;;) {
    const x1 = randInt(-8, 8), y1 = randInt(-8, 8), x2 = randInt(-8, 8), y2 = randInt(-8, 8);
    if (x1 === x2) continue;
    const m = F(y2 - y1, x2 - x1);
    return {
      skill: 'points',
      prompt: `Find the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$. (A fraction is fine.)`,
      answer: { type: 'number', value: m.valueOf() },
      hints: ['Slope $m = \\dfrac{\\text{rise}}{\\text{run}} = \\dfrac{y_2 - y_1}{x_2 - x_1}$.', 'Subtract the $y$-coordinates and the $x$-coordinates **in the same order**.'],
      solution: [`$m = \\dfrac{${y2} - ${p(y1)}}{${x2} - ${p(x1)}} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${m.tex()}$`],
      mistakes: [
        ...(y2 !== y1 ? [{ answer: F(x2 - x1, y2 - y1).text(), feedback: 'You divided run by rise. Slope is **rise over run**: change in $y$ over change in $x$.' }] : []),
        ...(!m.isZero() ? [{ answer: m.neg().text(), feedback: 'Check the order: subtract the coordinates of the **same** point first, top and bottom.' }] : []),
      ],
      placeholder: 'e.g. -3/4',
    };
  }
}

function fromGraph(): Problem {
  for (;;) {
    const x1 = randInt(-6, 2), y1 = randInt(-6, 6);
    const run = randInt(1, 5), rise = randInt(-6, 6);
    const x2 = x1 + run, y2 = y1 + rise;
    if (Math.abs(y2) > 9) continue;
    const m = F(rise, run);
    return {
      skill: 'graph',
      prompt: 'Find the slope of the line shown. (A fraction is fine.)',
      figure: { kind: 'plane', lines: [{ a: -rise, b: run, c: -rise * x1 + run * y1 }], points: [{ x: x1, y: y1 }, { x: x2, y: y2 }], range: 10 },
      answer: { type: 'number', value: m.valueOf() },
      hints: ['Use the two marked points. Count how far you go **up or down** (rise) and how far **right** (run).'],
      solution: [`From $(${x1}, ${y1})$ to $(${x2}, ${y2})$: rise $= ${rise}$, run $= ${run}$.`, `$m = \\dfrac{${rise}}{${run}} = ${m.tex()}$`],
      placeholder: 'e.g. 2/3',
    };
  }
}

function fromEquation(): Problem {
  const m = pick([F(2), F(-3), F(1, 2), F(-2, 3), F(4), F(-1), F(3, 4), F(-5, 2)]);
  const b = randInt(-8, 8);
  if (Math.random() < 0.5)
    return {
      skill: 'equation',
      prompt: `Find the slope of the line $\\;y = ${linTex(m, b)}$.`,
      answer: { type: 'number', value: m.valueOf() },
      hints: ['In $y = mx + b$, the slope is $m$, the coefficient of $x$.'],
      solution: [`The coefficient of $x$ is $${m.tex()}$, so $m = ${m.tex()}$.`],
      mistakes: [{ answer: String(b), feedback: `That is $b$, the $y$-coordinate of the $y$-intercept. The slope is the **coefficient of $x$**.` }],
      placeholder: 'e.g. -2/3',
    };
  const A = nz(6), B = nz(5), C = randInt(-12, 12);
  const s = F(-A, B);
  return {
    skill: 'equation',
    prompt: `Find the slope of the line $\\;${linTex(A, 0)} ${B < 0 ? '-' : '+'} ${termTex(Math.abs(B), 'y')} = ${C}$.`,
    answer: { type: 'number', value: s.valueOf() },
    hints: ['Solve for $y$ to get the form $y = mx + b$. The slope is the coefficient of $x$.'],
    solution: [`$${termTex(B, 'y')} = ${linTex(-A, C)}$`, `$y = ${linTex(s, F(C, B))}$`, `The slope is $${s.tex()}$.`],
    mistakes: [{ answer: F(A, B).text(), feedback: `When you move $${termTex(A, 'x')}$ to the other side, its sign changes.` }],
    placeholder: 'e.g. 3/2',
  };
}

function classify(): Problem {
  const kind = pick(['pos', 'neg', 'zero', 'undef'] as const);
  const k = randInt(-6, 6);
  const fig =
    kind === 'zero' ? { a: 0, b: 1, c: k } : kind === 'undef' ? { a: 1, b: 0, c: k } : kind === 'pos' ? { a: -randInt(1, 3), b: randInt(1, 3), c: k } : { a: randInt(1, 3), b: randInt(1, 3), c: k };
  const names = { pos: 'Positive', neg: 'Negative', zero: 'Zero', undef: 'Undefined' };
  return {
    skill: 'classify',
    prompt: 'What kind of slope does this line have?',
    figure: { kind: 'plane', lines: [fig], range: 10 },
    answer: choice(names[kind], Object.values(names).filter((n) => n !== names[kind])),
    hints: ['Read the line from **left to right**. Going up → positive. Going down → negative. Flat → zero. Straight up and down → undefined.'],
    solution: [
      { pos: 'It rises from left to right: **positive** slope.', neg: 'It falls from left to right: **negative** slope.', zero: 'It is horizontal: the rise is $0$, so the slope is **zero**.', undef: 'It is vertical: the run is $0$, and you cannot divide by $0$, so the slope is **undefined**.' }[kind],
    ],
  };
}

function rates(): Problem {
  const t = pick([
    () => {
      const rise = pick([3, 4, 5, 6, 8]);
      const run = pick([50, 100, 200]);
      return { prompt: `A road rises $${rise}$ m over a horizontal distance of $${run}$ m. What is its **grade** (slope as a percent)? Enter just the number.`, value: (rise / run) * 100, sol: [`$\\dfrac{${rise}}{${run}} = ${rise / run} = ${+((rise / run) * 100).toFixed(2)}\\%$`] };
    },
    () => {
      const h = randInt(2, 6);
      const d = pick([60, 80, 90, 100]) * h;
      return { prompt: `A car travels $${d}$ km in $${h}$ hours at a steady speed. On a graph of distance (vertical) against time (horizontal), what is the slope, in km per hour?`, value: d / h, sol: [`slope $= \\dfrac{\\text{change in distance}}{\\text{change in time}} = \\dfrac{${d}}{${h}} = ${d / h}$ km/h`] };
    },
    () => {
      const y1 = pick([2010, 2014, 2016]);
      const n = randInt(4, 8);
      const a = randInt(200, 500) * 10;
      const change = nz(40) * 10 * n;
      return { prompt: `A town's population was $${a}$ in $${y1}$ and $${a + change}$ in $${y1 + n}$. What was the average rate of change, in people per year?`, value: change / n, sol: [`rate $= \\dfrac{${a + change} - ${a}}{${y1 + n} - ${y1}} = \\dfrac{${change}}{${n}} = ${change / n}$ people per year`] };
    },
  ])();
  return { skill: 'rates', prompt: t.prompt, answer: { type: 'number', value: t.value }, hints: ['A rate of change is a slope: (change in the vertical quantity) ÷ (change in the horizontal quantity).'], solution: t.sol };
}

export const skills: Skill[] = [
  { id: 'points', label: 'Slope from two points', generate: twoPoints },
  { id: 'graph', label: 'Slope from a graph', generate: fromGraph },
  { id: 'equation', label: 'Slope from an equation', generate: fromEquation },
  { id: 'classify', label: 'Zero & undefined slope', generate: classify },
  { id: 'rates', label: 'Rates & grade', generate: rates },
];

export const masterySet = makeMasterySet(skills);
