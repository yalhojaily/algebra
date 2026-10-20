// Practice problem generators for Lesson 11.8 — Polynomial Inequalities and Rational Inequalities.
import { makeMasterySet, pick, randInt } from './helpers';
import { quadTex } from './quad';
import { iv, ivsTex, normalize, type Iv } from './sets';
import type { Problem, Skill } from './types';

type Op = '<' | '<=' | '>' | '>=';
const opTex: Record<Op, string> = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' };

/** Solution set of P(x) (op) 0 for P = sign·∏(x − r) with simple roots rs; holes are excluded points (denominator zeros). */
function solveSign(rs: number[], holes: number[], op: Op, lead = 1): Iv[] {
  const pts = [...new Set([...rs, ...holes])].sort((a, b) => a - b);
  const sign = (x: number) => lead * [...rs, ...holes].reduce((s, r) => s * (x - r), 1);
  const want = (v: number) => (op[0] === '<' ? v < 0 : v > 0);
  const closed = op.length === 2;
  const edges = [-Infinity, ...pts, Infinity];
  const out: Iv[] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const lo = edges[i], hi = edges[i + 1];
    const mid = !Number.isFinite(lo) ? hi - 1 : !Number.isFinite(hi) ? lo + 1 : (lo + hi) / 2;
    if (want(sign(mid))) out.push(iv(lo, hi, closed && rs.includes(lo), closed && rs.includes(hi)));
  }
  if (closed) for (const r of rs) if (!out.some((p) => p.lo === r || p.hi === r)) out.push(iv(r, r, true, true));
  return normalize(out);
}

function quadratic(): Problem {
  const r = randInt(-6, 3), s = r + randInt(1, 7), op = pick(['<', '<=', '>', '>='] as Op[]);
  const parts = solveSign([r, s], [], op);
  return {
    skill: 'quadratic',
    prompt: `Solve and write in interval notation: $\\;${quadTex(1, -(r + s), r * s)} ${opTex[op]} 0$`,
    answer: { type: 'intervals', parts },
    hints: [`Factor: $(x ${r < 0 ? '+' : '-'} ${Math.abs(r)})(x ${s < 0 ? '+' : '-'} ${Math.abs(s)})$. The zeros $${r}$ and $${s}$ split the number line into three intervals.`, 'Test one number in each interval to see whether the product is positive or negative.'],
    solution: [`Zeros: $${r}$, $${s}$. The parabola opens up, so it is negative between the zeros and positive outside.`, `$${ivsTex(parts)}$`],
    placeholder: '(-inf, -2) U (3, inf)',
  };
}

function cubic(): Problem {
  const rs = [randInt(-6, -2), randInt(-1, 1), randInt(2, 6)];
  const op = pick(['<', '>', '<=', '>='] as Op[]);
  const parts = solveSign(rs, [], op);
  const fac = rs.map((r) => (r === 0 ? 'x' : `(x ${r < 0 ? '+' : '-'} ${Math.abs(r)})`)).join('');
  return {
    skill: 'cubic',
    prompt: `Solve and write in interval notation: $\\;${fac} ${opTex[op]} 0$`,
    answer: { type: 'intervals', parts },
    hints: [`The zeros are $${rs.join(', ')}$. They create four intervals.`, 'Make a sign chart: test a number in each interval.'],
    solution: [`Signs from left to right: $-, +, -, +$.`, `$${ivsTex(parts)}$`],
    placeholder: '(-3, 0) U (4, inf)',
  };
}

function rational(): Problem {
  const a = randInt(-6, 2), b = a + randInt(1, 6) * pick([1, -1]);
  const op = pick(['<', '<=', '>', '>='] as Op[]);
  const parts = solveSign([a], [b], op);
  const f = (r: number) => `x ${r < 0 ? '+' : '-'} ${Math.abs(r)}`.replace('x - 0', 'x');
  return {
    skill: 'rational',
    prompt: `Solve and write in interval notation: $\\;\\dfrac{${f(a)}}{${f(b)}} ${opTex[op]} 0$`,
    answer: { type: 'intervals', parts },
    hints: [`Critical values: $${a}$ (numerator zero) and $${b}$ (denominator zero).`, `$${b}$ is **never** included — it makes the expression undefined.`],
    solution: [`Test each interval around $${Math.min(a, b)}$ and $${Math.max(a, b)}$.`, `$${ivsTex(parts)}$`],
    mistakes: [],
    placeholder: '(-inf, -1] U (3, inf)',
  };
}

export const skills: Skill[] = [
  { id: 'quadratic', label: 'Quadratic inequalities', generate: quadratic },
  { id: 'cubic', label: 'Polynomial inequalities', generate: cubic },
  { id: 'rational', label: 'Rational inequalities', generate: rational },
];

export const masterySet = makeMasterySet(skills);
