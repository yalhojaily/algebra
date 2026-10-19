// Polynomials in one or more variables: expand, add, multiply, divide, and print them.
// Used by problem generators (to build correct answers) and by widgets (to show steps).
import { parse, ParseError, type Node } from './expr';

export type Vars = Record<string, number>; // variable -> exponent

/** A polynomial: monomial key -> coefficient. Key is like "x^2y^1" (sorted), "" for a constant. */
export class Poly {
  readonly terms: Map<string, number>;
  constructor(terms?: Map<string, number>) {
    this.terms = new Map();
    for (const [k, c] of terms ?? []) if (Math.abs(c) > 1e-12) this.terms.set(k, round(c));
  }

  static const(c: number) {
    return new Poly(new Map([['', c]]));
  }
  static mono(c: number, vars: Vars) {
    return new Poly(new Map([[keyOf(vars), c]]));
  }
  static v(name: string) {
    return Poly.mono(1, { [name]: 1 });
  }
  /** Parse text like "3x^2 - 2xy + 5". */
  static parse(src: string) {
    return fromNode(parse(src));
  }
  /** Univariate polynomial from coefficients, highest degree first: [1, -3, 2] → x² − 3x + 2. */
  static fromCoefs(coefs: number[], v = 'x') {
    const n = coefs.length - 1;
    let p = new Poly();
    coefs.forEach((c, i) => (p = p.add(Poly.mono(c, n - i ? { [v]: n - i } : {}))));
    return p;
  }

  add(o: Poly) {
    const m = new Map(this.terms);
    for (const [k, c] of o.terms) m.set(k, (m.get(k) ?? 0) + c);
    return new Poly(m);
  }
  scale(s: number) {
    return new Poly(new Map([...this.terms].map(([k, c]) => [k, c * s])));
  }
  neg() {
    return this.scale(-1);
  }
  sub(o: Poly) {
    return this.add(o.neg());
  }
  mul(o: Poly) {
    let out = new Poly();
    for (const [k1, c1] of this.terms)
      for (const [k2, c2] of o.terms) out = out.add(Poly.mono(c1 * c2, mergeVars(varsOf(k1), varsOf(k2))));
    return out;
  }
  pow(n: number) {
    let out = Poly.const(1);
    for (let i = 0; i < n; i++) out = out.mul(this);
    return out;
  }
  isZero() {
    return this.terms.size === 0;
  }
  equals(o: Poly) {
    return this.sub(o).isZero();
  }
  /** Number of terms. */
  get size() {
    return this.terms.size;
  }
  /** Total degree of the polynomial (−∞ for 0, written as -1 here). */
  degree() {
    let d = -1;
    for (const k of this.terms.keys()) d = Math.max(d, degOf(varsOf(k)));
    return d;
  }
  /** Degree in one variable. */
  degreeIn(v: string) {
    let d = -1;
    for (const k of this.terms.keys()) d = Math.max(d, varsOf(k)[v] ?? 0);
    return d;
  }
  variables() {
    const s = new Set<string>();
    for (const k of this.terms.keys()) Object.keys(varsOf(k)).forEach((v) => s.add(v));
    return [...s].sort();
  }
  /** Terms in standard (descending) order: [coef, vars][]. */
  ordered(): [number, Vars][] {
    const vs = this.variables();
    return [...this.terms]
      .map(([k, c]) => [c, varsOf(k)] as [number, Vars])
      .sort((a, b) => {
        const d = degOf(b[1]) - degOf(a[1]);
        if (d) return d;
        for (const v of vs) {
          const e = (b[1][v] ?? 0) - (a[1][v] ?? 0);
          if (e) return e;
        }
        return 0;
      });
  }
  /** Coefficient of a monomial. */
  coef(vars: Vars) {
    return this.terms.get(keyOf(vars)) ?? 0;
  }
  /** Univariate coefficient list, highest degree first. */
  coefs(v = 'x') {
    const n = this.degreeIn(v);
    return Array.from({ length: n + 1 }, (_, i) => this.coef(n - i ? { [v]: n - i } : {}));
  }
  leading(): [number, Vars] {
    return this.ordered()[0] ?? [0, {}];
  }
  evaluate(env: Record<string, number>) {
    let s = 0;
    for (const [k, c] of this.terms) {
      let t = c;
      for (const [v, e] of Object.entries(varsOf(k))) t *= (env[v] ?? 0) ** e;
      s += t;
    }
    return s;
  }
  tex() {
    return render(this, true);
  }
  text() {
    return render(this, false);
  }
}

const round = (c: number) => (Math.abs(c - Math.round(c)) < 1e-9 ? Math.round(c) : +c.toFixed(10));

export function keyOf(vars: Vars) {
  return Object.keys(vars)
    .filter((v) => vars[v] !== 0)
    .sort()
    .map((v) => `${v}^${vars[v]}`)
    .join('');
}
export function varsOf(key: string): Vars {
  const out: Vars = {};
  for (const m of key.matchAll(/([a-zA-Z])\^(-?\d+)/g)) out[m[1]] = Number(m[2]);
  return out;
}
const degOf = (v: Vars) => Object.values(v).reduce((a, b) => a + b, 0);
function mergeVars(a: Vars, b: Vars): Vars {
  const out = { ...a };
  for (const [v, e] of Object.entries(b)) out[v] = (out[v] ?? 0) + e;
  return out;
}

/** A monomial as TeX or text: 3x^2y, -x, 7 */
export function monoStr(c: number, vars: Vars, tex: boolean) {
  const vs = Object.keys(vars)
    .filter((v) => vars[v])
    .sort()
    .map((v) => (vars[v] === 1 ? v : tex ? `${v}^{${vars[v]}}` : `${v}^${vars[v]}`))
    .join('');
  const num = (x: number) => (tex && !Number.isInteger(x) ? fracTexOf(x) : String(x));
  if (!vs) return num(c);
  if (c === 1) return vs;
  if (c === -1) return `-${vs}`;
  return `${num(c)}${vs}`;
}

function fracTexOf(x: number) {
  for (let d = 2; d <= 100; d++) {
    const n = Math.round(x * d);
    if (Math.abs(n / d - x) < 1e-9) return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
  }
  return String(x);
}

function render(p: Poly, tex: boolean) {
  const ts = p.ordered();
  if (!ts.length) return '0';
  return ts
    .map(([c, v], i) => {
      const s = monoStr(c, v, tex);
      if (i === 0) return s;
      return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
    })
    .join('');
}

/** Expand an expression tree into a polynomial. */
export function fromNode(n: Node): Poly {
  switch (n.kind) {
    case 'num':
      return Poly.const(n.value);
    case 'var':
      return Poly.v(n.name);
    case 'neg':
      return fromNode(n.arg).neg();
    case 'bin': {
      const a = fromNode(n.left);
      if (n.op === '^') {
        const e = fromNode(n.right);
        const k = e.size === 0 ? 0 : e.terms.get('');
        if (k === undefined || !Number.isInteger(k) || k < 0 || e.size > 1) throw new ParseError('Exponents must be whole numbers here');
        return a.pow(k);
      }
      const b = fromNode(n.right);
      if (n.op === '+') return a.add(b);
      if (n.op === '-') return a.sub(b);
      if (n.op === '*') return a.mul(b);
      // division only by a constant
      const c = b.size === 0 ? 0 : b.terms.get('');
      if (c === undefined || b.size !== 1 || c === 0) throw new ParseError('Not a polynomial');
      return a.scale(1 / c);
    }
  }
}

/** Long division of univariate polynomials, with the steps a student would write. */
export interface DivStep {
  term: Poly; // next quotient term
  product: Poly; // term × divisor
  remainder: Poly; // after subtracting
}
export function longDivide(dividend: Poly, divisor: Poly, v = 'x') {
  let r = dividend;
  let q = new Poly();
  const steps: DivStep[] = [];
  const dd = divisor.degreeIn(v);
  const lc = divisor.coefs(v)[0];
  for (let guard = 0; guard < 20 && !r.isZero() && r.degreeIn(v) >= dd; guard++) {
    const rd = r.degreeIn(v);
    const term = Poly.mono(r.coefs(v)[0] / lc, rd - dd ? { [v]: rd - dd } : {});
    const product = term.mul(divisor);
    r = r.sub(product);
    q = q.add(term);
    steps.push({ term, product, remainder: r });
  }
  return { quotient: q, remainder: r, steps };
}

// ---------- Factoring (one variable, integer coefficients) ----------

const igcd = (a: number, b: number): number => (b ? igcd(b, a % b) : Math.abs(a));

export interface Factorization {
  /** Common monomial factor, e.g. 3x² (may be 1). */
  common: Poly;
  /** Remaining factors, each with integer coefficients and positive leading coefficient where possible. */
  factors: Poly[];
}

/** Factor a one-variable polynomial with integer coefficients as far as possible over the integers. */
export function factorPoly(P: Poly, v = 'x'): Factorization {
  if (P.isZero()) return { common: Poly.const(0), factors: [] };
  let coefs = P.coefs(v);
  // Common factor: gcd of coefficients and lowest power of v
  let g = coefs.filter((c) => c !== 0).reduce((a, b) => igcd(a, b));
  if (coefs[0] < 0) g = -g;
  let low = 0;
  while (coefs[coefs.length - 1 - low] === 0) low++;
  coefs = coefs.slice(0, coefs.length - low).map((c) => c / g);
  const common = Poly.mono(g, low ? { [v]: low } : {});
  const factors: Poly[] = [];
  // Pull out rational roots p/q → (q v − p)
  const evalAt = (cs: number[], x: number) => cs.reduce((s, c) => s * x + c, 0);
  const divisors = (n: number) => {
    const out: number[] = [];
    for (let i = 1; i <= Math.abs(n); i++) if (n % i === 0) out.push(i);
    return out;
  };
  let guard = 0;
  outer: while (coefs.length > 2 && guard++ < 10) {
    const lead = coefs[0], last = coefs[coefs.length - 1];
    if (last === 0) break;
    for (const p of divisors(last))
      for (const q of divisors(lead))
        for (const sgn of [1, -1]) {
          const r = (sgn * p) / q;
          if (Math.abs(evalAt(coefs, r)) < 1e-9 && igcd(p, q) === 1) {
            // synthetic division by (v − r), then scale by q so the factor is (q v − s p)
            const out: number[] = [];
            let acc = 0;
            for (let i = 0; i < coefs.length - 1; i++) {
              acc = acc * r + coefs[i];
              out.push(acc);
            }
            coefs = out.map((c) => c / q);
            factors.push(Poly.fromCoefs([q, -sgn * p], v));
            continue outer;
          }
        }
    break;
  }
  if (coefs.length > 1 || (coefs.length === 1 && coefs[0] !== 1)) factors.push(Poly.fromCoefs(coefs, v));
  return { common, factors };
}

/** TeX for a factorization, grouping repeated factors with exponents. */
export function factorizationTex(f: Factorization): string {
  const groups: { p: Poly; n: number }[] = [];
  for (const p of f.factors) {
    const g = groups.find((x) => x.p.equals(p));
    if (g) g.n++;
    else groups.push({ p, n: 1 });
  }
  const c = f.common;
  const cTex = c.equals(Poly.const(1)) ? '' : c.equals(Poly.const(-1)) ? '-' : c.tex();
  const parts = groups.map(({ p, n }) => (groups.length === 1 && n === 1 && !cTex ? p.tex() : `(${p.tex()})`) + (n > 1 ? `^{${n}}` : ''));
  return cTex + parts.join('') || '1';
}
