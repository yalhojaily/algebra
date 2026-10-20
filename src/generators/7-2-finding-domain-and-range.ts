// Practice problem generators for Lesson 7.2 — Finding Domain and Range.
import { choice, dfrac, makeMasterySet, monicFactors, nz, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

const ivTex = (lo: number, hi: number, lc: boolean, hc: boolean) =>
  `${lc ? '[' : '('}${lo === -Infinity ? '-\\infty' : lo}, ${hi === Infinity ? '\\infty' : hi}${hc ? ']' : ')'}`;

function segmentGraph(): Problem {
  for (;;) {
    const x1 = randInt(-7, 0), x2 = randInt(1, 7);
    const y1 = randInt(-6, 6), y2 = randInt(-6, 6);
    if (y1 === y2) continue;
    const c1 = Math.random() < 0.6, c2 = Math.random() < 0.6;
    const which = pick(['domain', 'range'] as const);
    const [lo, hi, lc, hc] = which === 'domain' ? [x1, x2, c1, c2] : y1 < y2 ? [y1, y2, c1, c2] : [y2, y1, c2, c1];
    return {
      skill: 'graph',
      prompt: `Find the **${which}** of the function graphed below. Write it in interval notation.`,
      figure: { kind: 'plane', segments: [{ x1, y1, x2, y2 }], points: [{ x: x1, y: y1, open: !c1 }, { x: x2, y: y2, open: !c2 }], range: 10 },
      answer: { type: 'interval', lo, hi, loClosed: lc, hiClosed: hc },
      hints: [
        which === 'domain' ? 'The domain is the set of **x-values** the graph covers — read it along the horizontal axis.' : 'The range is the set of **y-values** the graph covers — read it along the vertical axis.',
        'A solid dot means the endpoint is included: use [ or ]. An open dot means it is not: use ( or ).',
      ],
      solution: [
        `The graph runs from $(${x1}, ${y1})$ ${c1 ? '(solid)' : '(open)'} to $(${x2}, ${y2})$ ${c2 ? '(solid)' : '(open)'}.`,
        `${which === 'domain' ? 'Domain' : 'Range'}: $${ivTex(lo, hi, lc, hc)}$`,
      ],
      placeholder: '[-3, 5)',
    };
  }
}

function parabolaRange(): Problem {
  const h = randInt(-3, 3), k = randInt(-6, 4), a = pick([1, -1]);
  const P = Poly.fromCoefs([a, -2 * a * h, a * h * h + k]);
  const which = pick(['domain', 'range', 'range'] as const);
  const ans = which === 'domain' ? { lo: -Infinity, hi: Infinity, loClosed: false, hiClosed: false } : a > 0 ? { lo: k, hi: Infinity, loClosed: true, hiClosed: false } : { lo: -Infinity, hi: k, loClosed: false, hiClosed: true };
  return {
    skill: 'parabola',
    prompt: `Find the **${which}** of $f(x) = ${P.tex()}$, graphed below. Use interval notation (type inf for $\\infty$).`,
    figure: { kind: 'plane', curves: [P.coefs('x')], points: [{ x: h, y: k, label: `(${h}, ${k})` }], range: 10 },
    answer: { type: 'interval', ...ans },
    hints: which === 'domain'
      ? ['Can you put **any** number in for $x$? The graph keeps going left and right forever.']
      : [`The lowest or highest point of the graph is $(${h}, ${k})$. The graph opens ${a > 0 ? 'up' : 'down'}.`, `So every $y$-value ${a > 0 ? 'at least' : 'at most'} $${k}$ is used.`],
    solution: [which === 'domain' ? 'Any real number can be squared, so the domain is $(-\\infty, \\infty)$ — all real numbers.' : `Range: $${ivTex(ans.lo, ans.hi, ans.loClosed, ans.hiClosed)}$`],
    placeholder: '[2, inf)',
  };
}

function excludedValues(): Problem {
  const two = Math.random() < 0.5;
  let D: Poly, roots: number[];
  if (two) {
    const [A, B] = monicFactors(2);
    D = A.mul(B);
    roots = [-A.coefs()[1], -B.coefs()[1]];
  } else {
    const a = randInt(1, 4), r = nz(7);
    D = Poly.fromCoefs([a, -a * r]);
    roots = [r];
  }
  const N = Poly.fromCoefs([randInt(1, 5), nz(8)]);
  return {
    skill: 'rational',
    prompt: `Which numbers are **not** in the domain of $\\;f(x) = ${dfrac(N.tex(), D.tex())}$? (List them separated by commas.)`,
    answer: { type: 'solutions', values: roots, variable: 'x' },
    hints: ['Division by $0$ is undefined. Find the $x$-values that make the denominator $0$.'],
    solution: [`$${D.tex()} = 0$ when $x = ${roots.join('$ or $x = ')}$.`, `The domain is all real numbers except ${roots.map((r) => `$${r}$`).join(' and ')}.`],
    placeholder: 'e.g. 3, -2',
  };
}

function polyDomain(): Problem {
  const kind = pick(['poly', 'abs', 'rational'] as const);
  const r = nz(6);
  const fx = kind === 'poly' ? Poly.fromCoefs([nz(4), randInt(-6, 6), nz(9)]).tex() : kind === 'abs' ? `|x ${r < 0 ? '+' : '-'} ${Math.abs(r)}|` : dfrac('5', `x ${r < 0 ? '+' : '-'} ${Math.abs(r)}`);
  const right = kind === 'rational' ? `All real numbers except $${r}$` : 'All real numbers';
  return {
    skill: 'formula',
    prompt: `What is the domain of $\\;f(x) = ${fx}$?`,
    answer: choice(right, ['All real numbers', `All real numbers except $${r}$`, `All real numbers except $0$`, 'Only positive numbers'].filter((o) => o !== right).slice(0, 3)),
    hints: ['Ask: is there any number you are **not** allowed to put in for $x$? The usual reason is division by $0$.'],
    solution: [kind === 'rational' ? `$x = ${r}$ makes the denominator $0$, so it is excluded.` : `Any real number can be substituted — no division by zero is possible — so the domain is all real numbers.`],
  };
}

export const skills: Skill[] = [
  { id: 'graph', label: 'Domain and range from a graph', generate: segmentGraph },
  { id: 'parabola', label: 'Parabolas', generate: parabolaRange },
  { id: 'formula', label: 'Domain from a formula', generate: polyDomain },
  { id: 'rational', label: 'Excluded values', generate: excludedValues },
];

export const masterySet = makeMasterySet(skills);
