// Practice problem generators for Lesson 8.5 — Systems of Equations in Three Variables.
import { choice, makeMasterySet, nz, pick, randInt } from './helpers';
import { combTex, systemTex } from './systems';
import type { Problem, Skill } from './types';

const V = ['x', 'y', 'z'];
const det3 = (m: number[][]) =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

export function randSys3(max = 3) {
  for (;;) {
    const sol = [randInt(-4, 4), randInt(-4, 4), randInt(-4, 4)];
    const M = Array.from({ length: 3 }, () => V.map(() => (Math.random() < 0.15 ? 0 : nz(max))));
    if (M.some((r) => r.filter((c) => c !== 0).length < 2)) continue;
    if (det3(M) === 0) continue;
    // at least one equation with a coefficient ±1 keeps hand work reasonable
    if (!M.flat().some((c) => Math.abs(c) === 1)) continue;
    const rhs = M.map((r) => r.reduce((s, c, i) => s + c * sol[i], 0));
    return { M, rhs, sol };
  }
}

const rowsTex = (M: number[][], rhs: number[]) => systemTex(M.map((r, i) => combTex(r, V, rhs[i])));

function checkTriple(): Problem {
  const { M, rhs, sol } = randSys3();
  const good = Math.random() < 0.5;
  const pt = good ? sol : sol.map((v, i) => (i === pick([0, 1, 2]) ? v + pick([1, -1]) : v));
  const vals = M.map((r) => r.reduce((s, c, i) => s + c * pt[i], 0));
  const ok = vals.every((v, i) => v === rhs[i]);
  return {
    skill: 'check',
    prompt: `Is $(${pt.join(', ')})$ a solution of $\\;${rowsTex(M, rhs)}$?`,
    answer: choice(ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes']),
    hints: ['Substitute $x$, $y$ and $z$ into **all three** equations. Every one must be true.'],
    solution: vals.map((v, i) => `Equation ${i + 1}: ${v === rhs[i] ? `$${v} = ${rhs[i]}$ ✓` : `$${v} \\ne ${rhs[i]}$ ✗`}`).concat([ok ? 'All three are true: it **is** a solution.' : 'At least one is false: it is **not** a solution.']),
  };
}

function eliminateStep(): Problem {
  for (;;) {
    const { M, rhs } = randSys3();
    // eliminate z from equations 1 and 2
    const [a, b] = [M[0][2], M[1][2]];
    if (a === 0 || b === 0) continue;
    const g = (p: number, q: number): number => (q ? g(q, p % q) : Math.abs(p));
    const L = Math.abs(a * b) / g(a, b);
    const k1 = L / a, k2 = -L / b;
    const res = [0, 1].map((j) => k1 * M[0][j] + k2 * M[1][j]);
    const r = k1 * rhs[0] + k2 * rhs[1];
    if (res.every((c) => c === 0)) continue;
    return {
      skill: 'eliminate',
      prompt: `Use equations (1) and (2) to eliminate $z$. Write the resulting equation in $x$ and $y$. $\\;${rowsTex(M, rhs)}$`,
      answer: { type: 'equation', value: combTex(res, ['x', 'y'], r).replace(/ = /, ' = ') },
      hints: [`Make the $z$-coefficients opposites: multiply (1) by $${k1}$ and (2) by $${k2}$.`, 'Then add the two equations.'],
      solution: [`$${k1} \\times (1)$: $${combTex(M[0].map((c) => c * k1), V, rhs[0] * k1)}$`, `$${k2} \\times (2)$: $${combTex(M[1].map((c) => c * k2), V, rhs[1] * k2)}$`, `Add: $${combTex(res, ['x', 'y'], r)}$`],
      placeholder: '5x - 2y = 7',
    };
  }
}

function solve3(): Problem {
  const { M, rhs, sol } = randSys3();
  return {
    skill: 'solve',
    prompt: `Solve: $\\;${rowsTex(M, rhs)}$ (Give the answer as an ordered triple.)`,
    answer: { type: 'tuple', values: sol },
    hints: ['Pick one variable to eliminate. Use two different pairs of equations to eliminate it — you get two equations in two variables.', 'Solve that 2×2 system, then substitute back into one of the original equations to find the third variable.'],
    solution: [`The solution is $(${sol.join(', ')})$.`, `Check: ${M.map((r, i) => `$${r.reduce((s, c, j) => s + c * sol[j], 0)} = ${rhs[i]}$ ✓`).join(', ')}`],
    placeholder: '(1, -2, 3)',
  };
}

function triangular(): Problem {
  const sol = [randInt(-5, 5), randInt(-5, 5), randInt(-5, 5)];
  const a = nz(3), b = nz(3), c = nz(3);
  const M = [[1, a, b], [0, 1, c], [0, 0, pick([1, 2, 3, -2])]];
  const rhs = M.map((r) => r.reduce((s, k, i) => s + k * sol[i], 0));
  return {
    skill: 'back',
    prompt: `Solve by back-substitution: $\\;${rowsTex(M, rhs)}$`,
    answer: { type: 'tuple', values: sol },
    hints: ['Start with the last equation — it has only $z$. Then use $z$ in the second equation to find $y$, and finally find $x$.'],
    solution: [`$z = ${sol[2]}$`, `$y + ${c < 0 ? `(${c})` : c}(${sol[2]}) = ${rhs[1]}$, so $y = ${sol[1]}$`, `$x = ${sol[0]}$`, `Solution: $(${sol.join(', ')})$`],
    placeholder: '(1, -2, 3)',
  };
}

export const skills: Skill[] = [
  { id: 'check', label: 'Check a solution', generate: checkTriple },
  { id: 'back', label: 'Back-substitution', generate: triangular },
  { id: 'eliminate', label: 'Eliminate a variable', generate: eliminateStep },
  { id: 'solve', label: 'Solve a 3 × 3 system', generate: solve3 },
];

export const masterySet = makeMasterySet(skills);
