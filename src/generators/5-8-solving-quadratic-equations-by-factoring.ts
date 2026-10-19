// Practice problem generators for Lesson 5.8 — Solving Quadratic Equations by Factoring.
import { randomAC } from './5-3-factoring-ax-bx-c-a-1-the-foil-method';
import { F, lin, makeMasterySet, nz, parTex, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

const solTex = (vals: number[]) => vals.map((x) => F(x).tex()).join(' \\text{ and } ');

function zeroProducts(): Problem {
  const v = 'x';
  const a = pick([1, 1, 2, 3]), b = nz(9), c = pick([1, 1, 4, 5]), d = nz(9);
  const F1 = lin(a, b, v), F2 = lin(c, d, v);
  const roots = [-b / a, -d / c];
  return {
    skill: 'zero',
    prompt: `Solve: $\\;${parTex(F1)}${parTex(F2)} = 0$. (Enter all solutions, separated by commas.)`,
    answer: { type: 'solutions', values: roots, variable: v },
    hints: ['**Principle of zero products:** if $AB = 0$, then $A = 0$ or $B = 0$.', 'Set each factor equal to 0 and solve.'],
    solution: [`$${F1.tex()} = 0$ or $${F2.tex()} = 0$`, `$x = ${F(-b, a).tex()}$ or $x = ${F(-d, c).tex()}$`],
    mistakes: [{ answer: `${b / a}, ${d / c}`, feedback: 'Check the signs: $x + 3 = 0$ gives $x = -3$, not $3$.' }],
    placeholder: 'e.g. -3, 5/2',
  };
}

function factorAndSolve(): Problem {
  const v = 'x';
  const kind = pick(['simple', 'ac', 'common', 'rearrange'] as const);
  let P: Poly, roots: number[], shown: string, steps: string[];
  if (kind === 'simple') {
    const r = nz(9), s = nz(9);
    P = lin(1, -r, v).mul(lin(1, -s, v));
    roots = [r, s];
    shown = `${P.tex()} = 0`;
    steps = [`$${parTex(lin(1, -r, v))}${parTex(lin(1, -s, v))} = 0$`];
  } else if (kind === 'ac') {
    const { F1, F2, P: Q } = randomAC(v);
    P = Q;
    roots = [-F1.coefs(v)[1] / F1.coefs(v)[0], -F2.coefs(v)[1] / F2.coefs(v)[0]];
    shown = `${P.tex()} = 0`;
    steps = [`$${parTex(F1)}${parTex(F2)} = 0$`];
  } else if (kind === 'common') {
    const k = nz(9), a = randInt(1, 5);
    P = Poly.fromCoefs([a, -a * k, 0], v);
    roots = [0, k];
    shown = `${P.tex()} = 0`;
    steps = [`$${a === 1 ? '' : a}x${parTex(lin(1, -k, v))} = 0$ — factor out the common factor`, 'Don\'t divide by $x$ — that would lose the solution $x = 0$.'];
  } else {
    const r = nz(8), s = nz(8);
    P = lin(1, -r, v).mul(lin(1, -s, v));
    const [, b, c] = P.coefs(v);
    // show as x^2 + bx = -c  or  x^2 = -bx - c
    shown = Math.random() < 0.5 ? `x^2 ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x = ${-c}` : `x^2 = ${Poly.fromCoefs([-b, -c], v).tex()}`;
    roots = [r, s];
    steps = [`$${P.tex()} = 0$ — get $0$ on one side first`, `$${parTex(lin(1, -r, v))}${parTex(lin(1, -s, v))} = 0$`];
  }
  return {
    skill: 'solve',
    prompt: `Solve: $\\;${shown}$. (Enter all solutions, separated by commas.)`,
    answer: { type: 'solutions', values: roots, variable: v },
    hints: ['Get $0$ on one side, factor the other side, then set each factor equal to $0$.'],
    solution: [...steps, `Solutions: $${solTex([...new Set(roots)])}$`],
    placeholder: 'e.g. 0, 4',
  };
}

function intercepts(): Problem {
  const v = 'x';
  const r = randInt(-6, 6), s = randInt(-6, 6);
  const P = lin(1, -r, v).mul(lin(1, -s, v));
  const roots = [...new Set([r, s])];
  return {
    skill: 'intercepts',
    prompt: `Find the $x$-intercepts of the graph of $\\;y = ${P.tex()}$. (Enter the $x$-values, separated by commas.)`,
    figure: { kind: 'plane', curves: [P.coefs(v)], range: 10 },
    answer: { type: 'solutions', values: roots, variable: v },
    hints: ['At an $x$-intercept, $y = 0$. Solve $' + P.tex() + ' = 0$.', 'You can check your answer against where the curve crosses the $x$-axis.'],
    solution: [`$${P.tex()} = 0 \\Rightarrow ${parTex(lin(1, -r, v))}${parTex(lin(1, -s, v))} = 0$`, `$x = ${solTex(roots)}$, so the $x$-intercepts are ${roots.map((x) => `$(${x}, 0)$`).join(' and ')}.`],
    placeholder: 'e.g. -2, 3',
  };
}

export const skills: Skill[] = [
  { id: 'zero', label: 'Zero products', generate: zeroProducts },
  { id: 'solve', label: 'Factor & solve', generate: factorAndSolve },
  { id: 'intercepts', label: 'x-intercepts', generate: intercepts },
];

export const masterySet = makeMasterySet(skills);
