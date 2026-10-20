// Shared helpers for the Chapter 8 (systems of equations) generators.
import { nz, pick, randInt, termTex } from './helpers';

/** a₁x + a₂y + … = c as TeX, skipping zero terms: "2x - y = 7". */
export function combTex(coefs: number[], vars: string[], rhs: number | string): string {
  const parts: string[] = [];
  coefs.forEach((c, i) => {
    if (c === 0) return;
    const t = termTex(Math.abs(c), vars[i]);
    if (!parts.length) parts.push(c < 0 ? `-${t}` : t);
    else parts.push(c < 0 ? `- ${t}` : `+ ${t}`);
  });
  return `${parts.join(' ') || '0'} = ${rhs}`;
}

/** A system shown with a brace. */
export const systemTex = (rows: string[]) => `\\begin{cases} ${rows.join(' \\\\ ')} \\end{cases}`;

export interface Sys2 {
  a: number; b: number; c: number; // a x + b y = c
  d: number; e: number; f: number; // d x + e y = f
  x: number; y: number;
}

/** A 2×2 system with the integer solution (x, y). */
export function randSys2(opts: { max?: number; sol?: number } = {}): Sys2 {
  const max = opts.max ?? 5, sol = opts.sol ?? 6;
  for (;;) {
    const x = randInt(-sol, sol), y = randInt(-sol, sol);
    const a = nz(max), b = nz(max), d = nz(max), e = nz(max);
    if (a * e - b * d === 0) continue;
    return { a, b, c: a * x + b * y, d, e, f: d * x + e * y, x, y };
  }
}

export const sys2Tex = (s: Sys2, v: [string, string] = ['x', 'y']) => systemTex([combTex([s.a, s.b], v, s.c), combTex([s.d, s.e], v, s.f)]);

/** Parenthesize a negative number after an operator. */
export const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);

export const solutionWords = ['One solution', 'No solution', 'Infinitely many solutions'];
export const pickVars = (): [string, string] => pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n']] as [string, string][]);
