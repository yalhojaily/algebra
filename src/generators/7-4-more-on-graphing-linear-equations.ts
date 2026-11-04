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

function contextLines(): Problem {
  const kind = pick(['flat', 'parallel', 'perp'] as const);
  if (kind === 'flat') {
    const k = pick([25, 30, 40, 45, 60]);
    return {
      skill: 'apply',
      prompt: `A phone plan costs ${k} dollars per month no matter how many minutes you use. On a graph of cost (vertical) against minutes (horizontal), what is the slope of the line?`,
      answer: choice('$0$', ['Undefined', `$${k}$`, '$1$']),
      hints: ['Unknown: the slope. Key words: "no matter how many minutes" — the cost never changes.', 'A constant cost gives a **horizontal** line, $C = ' + k + '$.'],
      solution: [`The graph is the horizontal line $C = ${k}$.`, 'Horizontal lines have slope $0$: the rise is always $0$.'],
    };
  }
  if (kind === 'parallel') {
    const r = pick([0.05, 0.1, 0.15, 0.2]), a = pick([10, 15, 20]), b = a + pick([5, 10, 15]);
    return {
      skill: 'apply',
      prompt: `Plan A costs $C = ${a} + ${r}m$ dollars and Plan B costs $C = ${b} + ${r}m$ dollars for $m$ minutes. How are their graphs related?`,
      answer: choice('Parallel', ['Perpendicular', 'The same line', 'Neither']),
      hints: ['Unknown: how the lines are related. Key words: compare the **slopes** (per-minute rates) and the intercepts (base fees).', `Both slopes are $${r}$; the $y$-intercepts are different.`],
      solution: [`Slopes: $${r}$ and $${r}$ — equal.`, `Intercepts: $${a}$ and $${b}$ — different.`, 'Equal slopes, different intercepts: **parallel** lines. Plan B always costs ' + (b - a) + ' dollars more.'],
    };
  }
  const [n, d] = pick([[1, 2], [2, 3], [3, 4], [1, 3], [3, 2], [4, 3], [2, 5]]);
  return {
    skill: 'apply',
    prompt: `On a city map, Main Street has slope $\\frac{${n}}{${d}}$. Oak Street is perpendicular to it. What is the slope of Oak Street?`,
    answer: { type: 'number', value: -d / n },
    hints: ['Unknown: the slope of the perpendicular street. Key words: "perpendicular" — the slopes multiply to $-1$.', `Take the reciprocal of $\\frac{${n}}{${d}}$ and change its sign.`],
    solution: [`$m = -\\frac{${d}}{${n}}$`, `Check: $\\frac{${n}}{${d}} \\cdot \\left(-\\frac{${d}}{${n}}\\right) = -1$ ✓`],
    placeholder: 'e.g. -3/2',
  };
}

export const skills: Skill[] = [
  { id: 'hv', label: 'Horizontal and vertical lines', generate: horizontalVertical },
  { id: 'hvslope', label: 'Slope of horizontal/vertical lines', generate: hvSlope },
  { id: 'classify', label: 'Parallel or perpendicular?', generate: classify },
  { id: 'perp', label: 'Parallel and perpendicular slopes', generate: perpSlope },
  { id: 'apply', label: 'Word problems', generate: contextLines },
];

export const masterySet = makeMasterySet(skills);
