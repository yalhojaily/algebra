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

// ---------- Random polynomials ----------
import { Poly } from '../lib/poly';
export { Poly };

/** A random polynomial in one variable with integer coefficients; `sparse` is the chance a non-leading term is 0. */
export function randPoly(deg: number, v = 'x', max = 9, sparse = 0.25): Poly {
  const coefs = Array.from({ length: deg + 1 }, (_, i) => (i === 0 ? nz(max) : Math.random() < sparse ? 0 : nz(max)));
  return Poly.fromCoefs(coefs, v);
}

/** A random linear binomial ax + b with small coefficients. */
export const randBinomial = (v = 'x', maxA = 5, maxB = 9) => Poly.fromCoefs([nz(maxA), nz(maxB)], v);

// ---------- Factoring helpers ----------

/** (a·v + b) as a Poly. */
export const lin = (a: number, b: number, v = 'x') => Poly.fromCoefs([a, b], v);

/** "(2x + 3)" style text and TeX for a polynomial factor. */
export const par = (P: Poly) => `(${P.text()})`;
export const parTex = (P: Poly) => `(${P.tex()})`;

/** Factored-answer helper: the expected value and the standard options. */
export const factoredAnswer = (value: string) => ({ type: 'expression' as const, value, factored: true });

/** Integer factor pairs of n (positive and negative), e.g. 6 → [1,6],[2,3],[-1,-6],[-2,-3]. */
export function factorPairs(n: number): [number, number][] {
  const out: [number, number][] = [];
  const m = Math.abs(n);
  for (let a = 1; a * a <= m; a++)
    if (m % a === 0) {
      const b = m / a;
      if (n > 0) out.push([a, b], [-a, -b]);
      else out.push([a, -b], [-a, b]);
    }
  return out;
}

// ---------- Rational expressions (Chapter 6) ----------
import { parse as parseExpr } from '../lib/expr';
import { factored, factoredTex, product, ratFromNode, ratTex, ratText, simplify, type Simplified } from '../lib/rational';
export { factored, factoredTex, product, ratTex, ratText, simplify, type Simplified };

/** \frac{n}{d} */
export const dfrac = (n: string, d: string) => `\\frac{${n}}{${d}}`;

/** A polynomial written in factored form as TeX. */
export const ftex = (P: Poly, v = 'x') => factoredTex(factored(P, v));

/** The polynomial fraction N/D written with both parts factored, the cancelled factors highlighted. */
export function cancelTex(N: Poly, D: Poly, v = 'x') {
  const s = simplify(N, D, v);
  const fn = factored(N, v), fd = factored(D, v);
  return `\\frac{${factoredTex(fn, { highlight: s.common })}}{${factoredTex(fd, { highlight: s.common })}}`;
}

/** Combine an expression typed as text into one reduced fraction. */
export function reduceText(src: string, v = 'x'): Simplified {
  const r = ratFromNode(parseExpr(src));
  return simplify(r.num, r.den, v);
}

/** The expected answer for a "simplify to one fraction" problem. */
export const ratAnswer = (s: Simplified) => ({ type: 'expression' as const, value: ratText(s), rational: true });

/** n distinct random monic linear factors x + b (b ≠ 0, all b different). */
export function monicFactors(n: number, v = 'x', max = 7): Poly[] {
  const bs = new Set<number>();
  while (bs.size < n) bs.add(nz(max));
  return [...bs].map((b) => lin(1, b, v));
}

/** Least common multiple of whole numbers. */
export const lcm = (...ns: number[]) => ns.reduce((a, b) => (a * b) / gcdN(a, b));

/** A polynomial written with the constant first, e.g. 8 − x (for "opposite" binomials). */
export function ascTex(P: Poly): string {
  const ts = P.ordered().reverse();
  return ts
    .map(([c, vars], i) => {
      const s = Poly.mono(c, vars).tex();
      if (i === 0) return s;
      return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
    })
    .join('');
}

/** Factored TeX, wrapped in parentheses when it is a single sum (so it can be multiplied). */
export function ptex(P: Poly, v = 'x') {
  const t = ftex(P, v);
  return P.size > 1 && !t.includes('(') ? `(${t})` : t;
}
