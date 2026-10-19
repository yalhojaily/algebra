// Shared helpers for writing problem generators.
import { evaluationSteps } from '../lib/expr';
import { pick, randInt, shuffle } from '../lib/random';
import type { Problem, Skill } from './types';

/** A negative number written in parentheses, for use after an operation sign: 3 + (−2). */
export const p = (n: number | string) => (Number(n) < 0 || String(n).startsWith('-') ? `(${n})` : `${n}`);

/** Format a number without floating-point noise: 0.1 + 0.2 → 0.3. */
export const fmt = (x: number) => String(+x.toFixed(10));

/** A random non-zero integer in [-max, max]. */
export const nz = (max: number, min = 1) => (Math.random() < 0.5 ? -1 : 1) * randInt(min, max);

/** A non-zero numerator in [-max, max] that has no common factor with d, so n/d is already in lowest terms. */
export function coprimeTo(d: number, max: number): number {
  for (;;) {
    const n = nz(max);
    if (gcdN(Math.abs(n), d) === 1) return n;
  }
}

const gcdN = (a: number, b: number): number => (b ? gcdN(b, a % b) : Math.abs(a));
export const gcd = gcdN;

/** A fraction in lowest terms as LaTeX, with the sign out front: −\frac{3}{4}. */
export function fracTex(num: number, den: number): string {
  if (den < 0) [num, den] = [-num, -den];
  const g = gcd(num, den) || 1;
  num /= g;
  den /= g;
  if (den === 1) return String(num);
  return `${num < 0 ? '-' : ''}\\frac{${Math.abs(num)}}{${den}}`;
}

/** The same fraction as typed input: -3/4. */
export function fracIn(num: number, den: number): string {
  if (den < 0) [num, den] = [-num, -den];
  const g = gcd(num, den) || 1;
  num /= g;
  den /= g;
  return den === 1 ? String(num) : `${num}/${den}`;
}

/** Worked-solution lines for a numeric expression, one operation at a time. */
export function orderSteps(src: string): string[] {
  const { steps, start } = evaluationSteps(src);
  const lines = [`$${start}$`];
  for (const s of steps) lines.push(`$= ${s.after}$ — ${s.action.toLowerCase()}: $${s.calc}$`);
  return lines;
}

/** Evaluate a numeric expression string. */
export const value = (src: string) => evaluationSteps(src).result;

/** A multiple-choice answer with the options shuffled. */
export function choice(correct: string, wrong: string[]) {
  const options = shuffle([correct, ...wrong.filter((w, i, all) => w !== correct && all.indexOf(w) === i)]);
  return { type: 'choice' as const, options, correct: options.indexOf(correct) };
}

/** Standard mastery set: every skill once, then random extras. */
export function makeMasterySet(skills: Skill[]) {
  return (size = 6): Problem[] => {
    const base = skills.map((s) => s.generate());
    const extra = Array.from({ length: Math.max(0, size - base.length) }, () => pick(skills).generate());
    return shuffle([...base, ...extra]);
  };
}

export { pick, randInt, shuffle };

// ---------- Linear expressions with exact coefficients ----------
import { F, Frac } from '../lib/frac';
export { F, Frac };

type Num = number | Frac;
const fr = (x: Num) => Frac.of(x);

/** The term c·v as LaTeX: 3x, -x, \frac{2}{3}x, or just the number when v is ''. */
export function termTex(c: Num, v = ''): string {
  const f = fr(c);
  if (!v) return f.tex();
  if (f.eq(1)) return v;
  if (f.eq(-1)) return `-${v}`;
  return `${f.tex()}${v}`;
}

/** Same term as text the checker can parse: 3x, -x, (2/3)x */
export function termText(c: Num, v = ''): string {
  const f = fr(c);
  if (!v) return f.text();
  if (f.eq(1)) return v;
  if (f.eq(-1)) return `-${v}`;
  return f.d === 1 ? `${f.n}${v}` : `(${f.text()})${v}`;
}

/** a·v + b as LaTeX, dropping zero parts: "3x - 5", "x", "-7". */
export function linTex(a: Num, b: Num, v = 'x'): string {
  const A = fr(a);
  const B = fr(b);
  if (A.isZero()) return B.tex();
  const first = termTex(A, v);
  if (B.isZero()) return first;
  return B.valueOf() < 0 ? `${first} - ${B.neg().tex()}` : `${first} + ${B.tex()}`;
}

export function linText(a: Num, b: Num, v = 'x'): string {
  const A = fr(a);
  const B = fr(b);
  if (A.isZero()) return B.text();
  const first = termText(A, v);
  if (B.isZero()) return first;
  return B.valueOf() < 0 ? `${first} - ${B.neg().text()}` : `${first} + ${B.text()}`;
}

/** "Add 5" / "Subtract 5" for moving a constant c off one side. */
export const undoAdd = (c: Num) => (fr(c).valueOf() < 0 ? `Add $${fr(c).neg().tex()}$ to both sides` : `Subtract $${fr(c).tex()}$ from both sides`);

/** Wording for removing the term c·v from a side: "subtract $3x$" or "add $5x$". */
export const removeTerm = (c: number, v: string) => (c < 0 ? `add $${termTex(-c, v)}$ to` : `subtract $${termTex(c, v)}$ from`);
