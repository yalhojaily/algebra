// Practice problem generators for Lesson 7.4 — More on Graphing Linear Equations.
import { choice, F, linTex, makeMasterySet, nz, pick, randInt, termTex } from './helpers';
import type { Problem, Skill } from './types';

function horizontalVertical(): Problem {
  const k = nz(7);
  const vertical = Math.random() < 0.5;
  return {
    skill: 'hv',
    prompt: `Graph $\\;${vertical ? 'x' : 'y'} = ${k}$. (Click two points on the line.)`,
    answer: { type: 'plot', mode: 'line', a: vertical ? 1 : 0, b: vertical ? 0 : 1, c: k },
    hints: [vertical ? `Every point on this line has $x$-coordinate $${k}$, whatever $y$ is.` : `Every point on this line has $y$-coordinate $${k}$, whatever $x$ is.`],
    solution: [vertical ? `A **vertical** line through $(${k}, 0)$ — for example $(${k}, 0)$ and $(${k}, 3)$.` : `A **horizontal** line through $(0, ${k})$ — for example $(0, ${k})$ and $(3, ${k})$.`],
  };
}

function hvSlope(): Problem {
  const k = nz(7);
  const vertical = Math.random() < 0.5;
  return {
    skill: 'hvslope',
    prompt: `What is the slope of the line $\\;${vertical ? 'x' : 'y'} = ${k}$?`,
    answer: choice(vertical ? 'Undefined' : '$0$', [vertical ? '$0$' : 'Undefined', `$${k}$`, '$1$']),
    hints: ['Pick two points on the line and compute $\\dfrac{\\text{change in } y}{\\text{change in } x}$.'],
    solution: [vertical ? 'On a vertical line the run (change in $x$) is $0$, and division by $0$ is undefined. The slope is **undefined**.' : 'On a horizontal line the rise (change in $y$) is $0$, so the slope is $\\frac{0}{\\text{run}} = 0$.'],
  };
}

/** a x + b y = c written nicely */
const stdTex = (a: number, b: number, c: number) => `${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${termTex(Math.abs(b), 'y')} = ${c}`;

function classify(): Problem {
  const m = pick([F(2), F(-3), F(1, 2), F(-2, 3), F(3, 4), F(4), F(-1)]);
  const kind = pick(['parallel', 'perpendicular', 'neither'] as const);
  const m2 = kind === 'parallel' ? m : kind === 'perpendicular' ? F(-m.d, m.n) : m.add(pick([1, -1, 2]));
  if (kind === 'neither' && (m2.eq(F(-m.d, m.n)) || m2.eq(m))) return classify();
  const b1 = randInt(-6, 6);
  let b2 = randInt(-6, 6);
  while (b2 === b1) b2 = randInt(-6, 6);
  // write the second line in standard form: y = m2 x + b2  →  -n x + d y = d b2
  const a = -m2.n, bb = m2.d, c = m2.d * b2;
  const second = a < 0 ? stdTex(-a, -bb, -c) : stdTex(a, bb, c);
  const label = { parallel: 'Parallel', perpendicular: 'Perpendicular', neither: 'Neither' }[kind];
  return {
    skill: 'classify',
    prompt: `Are these lines parallel, perpendicular, or neither? $\\;y = ${linTex(m, b1)}\\;$ and $\\;${second}$`,
    answer: choice(label, ['Parallel', 'Perpendicular', 'Neither'].filter((x) => x !== label)),
    hints: ['Find both slopes — solve the second equation for $y$.', 'Parallel: equal slopes (and different intercepts). Perpendicular: slopes multiply to $-1$.'],
    solution: [`Slopes: $${m.tex()}$ and $${m2.tex()}$.`, kind === 'parallel' ? 'The slopes are equal and the $y$-intercepts differ, so the lines are **parallel**.' : kind === 'perpendicular' ? `$${m.tex()} \\cdot ${m2.neg().valueOf() > 0 ? `\\left(${m2.tex()}\\right)` : m2.tex()} = -1$, so the lines are **perpendicular**.` : 'The slopes are not equal, and their product is not $-1$: **neither**.'],
  };
}

function perpSlope(): Problem {
  const m = pick([F(2), F(-3), F(1, 2), F(-2, 3), F(3, 4), F(5), F(-1, 4), F(-5, 2)]);
  const want = pick(['parallel', 'perpendicular', 'perpendicular'] as const);
  const ans = want === 'parallel' ? m : F(-m.d, m.n);
  const b = randInt(-8, 8);
  return {
    skill: 'perp',
    prompt: `What is the slope of a line **${want}** to $\\;y = ${linTex(m, b)}$?`,
    answer: { type: 'number', value: ans.valueOf() },
    hints: [want === 'parallel' ? 'Parallel lines have the same slope.' : 'Perpendicular slopes are **opposite reciprocals**: flip the fraction and change the sign.'],
    solution: [want === 'parallel' ? `Same slope: $${m.tex()}$.` : `Flip $${m.tex()}$ and change its sign: $${ans.tex()}$. Check: $${m.tex()} \\cdot ${ans.valueOf() < 0 ? `\\left(${ans.tex()}\\right)` : ans.tex()} = -1$.`],
    mistakes: want === 'perpendicular' ? [{ answer: F(m.d, m.n).text(), feedback: 'You flipped it — now also change the sign.' }, { answer: m.neg().text(), feedback: 'You changed the sign — now also flip the fraction (take the reciprocal).' }] : [],
    placeholder: 'e.g. -1/2',
  };
}

export const skills: Skill[] = [
  { id: 'hv', label: 'Horizontal and vertical lines', generate: horizontalVertical },
  { id: 'hvslope', label: 'Slope of horizontal/vertical lines', generate: hvSlope },
  { id: 'classify', label: 'Parallel or perpendicular?', generate: classify },
  { id: 'perp', label: 'Parallel and perpendicular slopes', generate: perpSlope },
];

export const masterySet = makeMasterySet(skills);
