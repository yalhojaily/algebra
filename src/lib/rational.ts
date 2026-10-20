// Rational expressions: a polynomial over a polynomial.
// Used by the Chapter 6 generators (to build answers), the widgets (to show factoring and cancelling)
// and the answer checker (to decide whether a fraction is in lowest terms).
import { ParseError, toTex, type Node } from './expr';
import { factorPoly, fromNode, Poly } from './poly';

export interface Rat {
  num: Poly;
  den: Poly;
}

const igcd = (a: number, b: number): number => (b ? igcd(b, a % b) : Math.abs(a));

/** Any expression built from + − × ÷ and whole-number powers, combined into one fraction (not reduced). */
export function ratFromNode(n: Node): Rat {
  switch (n.kind) {
    case 'num':
      return { num: Poly.const(n.value), den: Poly.const(1) };
    case 'var':
      return { num: Poly.v(n.name), den: Poly.const(1) };
    case 'neg': {
      const a = ratFromNode(n.arg);
      return { num: a.num.neg(), den: a.den };
    }
    case 'bin': {
      const a = ratFromNode(n.left);
      if (n.op === '^') {
        const e = ratFromNode(n.right);
        const k = e.num.size === 0 ? 0 : e.num.terms.get('');
        const d = e.den.size === 1 ? e.den.terms.get('') : undefined;
        if (k === undefined || d === undefined || e.num.size > 1) throw new ParseError('Exponents must be numbers here');
        const p = k / d;
        if (!Number.isInteger(p)) throw new ParseError('Exponents must be whole numbers here');
        return p >= 0 ? { num: a.num.pow(p), den: a.den.pow(p) } : { num: a.den.pow(-p), den: a.num.pow(-p) };
      }
      const b = ratFromNode(n.right);
      if (n.op === '+') return { num: a.num.mul(b.den).add(b.num.mul(a.den)), den: a.den.mul(b.den) };
      if (n.op === '-') return { num: a.num.mul(b.den).sub(b.num.mul(a.den)), den: a.den.mul(b.den) };
      if (n.op === '*') return { num: a.num.mul(b.num), den: a.den.mul(b.den) };
      return { num: a.num.mul(b.den), den: a.den.mul(b.num) };
    }
  }
}

/** A factored polynomial: a number times a list of factors (x counts as a factor, repeated for powers). */
export interface Factored {
  c: number;
  factors: Poly[];
}

export function factored(P: Poly, v = 'x'): Factored {
  if (P.isZero()) return { c: 0, factors: [] };
  if (P.degreeIn(v) <= 0) {
    // constant in v (may still be a number)
    const c = P.size === 1 ? P.terms.get('') : undefined;
    if (c !== undefined) return { c, factors: [] };
    return { c: 1, factors: [P] };
  }
  const f = factorPoly(P, v);
  const lowest = f.common.degreeIn(v);
  const c = f.common.coefs(v)[0];
  return { c, factors: [...Array.from({ length: Math.max(0, lowest) }, () => Poly.v(v)), ...f.factors] };
}

/** TeX for a factored polynomial, e.g. 3x^2(x − 1)(x + 2)^2. */
export function factoredTex(f: Factored, opts: { highlight?: Poly[]; strike?: boolean } = {}): string {
  const groups: { p: Poly; n: number }[] = [];
  for (const p of f.factors) {
    const g = groups.find((x) => x.p.equals(p));
    if (g) g.n++;
    else groups.push({ p, n: 1 });
  }
  const hl = [...(opts.highlight ?? [])];
  if (groups.length === 1 && groups[0].n === 1 && !hl.length && f.c === 1) return groups[0].p.tex();
  const parts: string[] = [];
  for (const { p, n } of groups) {
    const mono = p.size === 1;
    const base = mono ? p.tex() : `(${p.tex()})`;
    // how many copies of this factor are highlighted (cancelled)?
    let h = 0;
    for (let i = hl.length - 1; i >= 0; i--) if (hl[i].equals(p) && h < n) { hl.splice(i, 1); h++; }
    const piece = (k: number) => (k === 1 ? base : mono ? `${p.tex()}^{${k}}` : `${base}^{${k}}`);
    const wrap = (s: string) => (opts.strike ? `\\htmlClass{cancel}{\\cancel{${s}}}` : `\\htmlClass{c-op}{${s}}`);
    if (h) parts.push(wrap(piece(h)));
    if (n - h) parts.push(piece(n - h));
  }
  const body = parts.join(' ');
  const c = f.c;
  if (!body) return String(c);
  if (c === 1) return body;
  if (c === -1) return `-${body}`;
  return `${c}${body}`;
}

export function product(f: Factored): Poly {
  return f.factors.reduce((a, b) => a.mul(b), Poly.const(f.c));
}

export interface Simplified {
  num: Factored;
  den: Factored;
  /** Factors cancelled from both. */
  common: Poly[];
  /** The numeric common factor that was divided out. */
  g: number;
}

/** Reduce N/D to lowest terms by cancelling common factors. */
export function simplify(N: Poly, D: Poly, v = 'x'): Simplified {
  const fn = factored(N, v);
  const fd = factored(D, v);
  const common: Poly[] = [];
  const rest = [...fd.factors];
  const numRest: Poly[] = [];
  for (const p of fn.factors) {
    const i = rest.findIndex((q) => q.equals(p));
    if (i >= 0) {
      common.push(p);
      rest.splice(i, 1);
    } else numRest.push(p);
  }
  let g = fn.c === 0 ? Math.abs(fd.c) : igcd(Math.round(fn.c), Math.round(fd.c)) || 1;
  if (!Number.isInteger(fn.c) || !Number.isInteger(fd.c)) g = 1;
  let nc = fn.c / g, dc = fd.c / g;
  if (dc < 0) { nc = -nc; dc = -dc; }
  return { num: { c: nc, factors: numRest }, den: { c: dc, factors: rest }, common, g };
}

/** TeX for a fraction in lowest terms. */
export function ratTex(s: Simplified, expanded = false): string {
  const n = expanded ? product(s.num).tex() : factoredTex(s.num);
  const d = expanded ? product(s.den).tex() : factoredTex(s.den);
  if (d === '1') return n;
  if (n.startsWith('-')) return `-\\frac{${n.slice(1)}}{${d}}`;
  return `\\frac{${n}}{${d}}`;
}

/** Plain-text answer string for a fraction in lowest terms, e.g. "(x + 2)/(x - 3)". */
export function ratText(s: Simplified): string {
  const n = product(s.num), d = product(s.den);
  if (d.equals(Poly.const(1))) return n.text();
  const top = n.size > 1 ? `(${n.text()})` : n.text();
  const bottom = d.size > 1 || d.variables().length ? `(${d.text()})` : d.text();
  return `${top}/${bottom}`;
}

// ---------- Checking a student's fraction ----------

function peel(n: Node): Node {
  let g = { ...n, group: undefined } as Node;
  while (g.kind === 'neg') g = { ...g.arg, group: undefined } as Node;
  return g;
}

/** The numerator and denominator of an answer written as one fraction, or null if it isn't one. */
export function fractionParts(n: Node): [Poly, Poly] | null {
  const g = peel(n);
  try {
    if (g.kind === 'bin' && g.op === '/') return [fromNode(g.left), fromNode(g.right)];
    return [fromNode(g), Poly.const(1)];
  } catch {
    return null;
  }
}

function content(P: Poly): number[] {
  return [...P.terms.values()];
}

/** Why `got` (already known to equal `expected`) is not a single fraction in lowest terms — or null if it is. */
export function notSimplifiedFraction(got: Node, expected: Node): string | null {
  const g = fractionParts(got);
  if (!g) return 'That is equal to the right answer, but write it as a single fraction: (numerator)/(denominator).';
  const e = fractionParts(expected);
  if (!e) return null;
  const deg = ([n, d]: [Poly, Poly]) => Math.max(0, n.degree()) + Math.max(0, d.degree());
  if (!g[0].isZero() && deg(g) > deg(e)) return 'That is equal to the right answer, but it is not simplified. Factor the numerator and denominator and cancel the common factors.';
  const cs = [...content(g[0]), ...content(g[1])];
  if (cs.every((c) => Number.isInteger(c))) {
    const k = cs.reduce((a, b) => igcd(a, b), 0);
    if (k > 1 && !g[0].isZero()) return `That is equal to the right answer, but it is not simplified: the numerator and denominator still have a common factor of ${k}.`;
  }
  return null;
}

/** Least common multiple of factored polynomials: every factor, as many times as it appears in any one of them. */
export function lcdOf(...fs: Factored[]): Factored {
  let out: Poly[] = [];
  let c = 1;
  for (const f of fs) {
    const rest = [...out];
    const add: Poly[] = [];
    for (const p of f.factors) {
      const i = rest.findIndex((q) => q.equals(p));
      if (i >= 0) rest.splice(i, 1);
      else add.push(p);
    }
    out = [...out, ...add];
    const a = Math.abs(Math.round(f.c)) || 1;
    c = (c * a) / igcd(c, a);
  }
  return { c, factors: out };
}

/** What a factored denominator must be multiplied by to become the LCD. */
export function missingFactors(have: Factored, lcd: Factored): Factored {
  const rest = [...have.factors];
  const need: Poly[] = [];
  for (const p of lcd.factors) {
    const i = rest.findIndex((q) => q.equals(p));
    if (i >= 0) rest.splice(i, 1);
    else need.push(p);
  }
  return { c: lcd.c / have.c, factors: need };
}

/** TeX for a typed expression, dropping the parentheses that were only needed to type a fraction: (x − 2)/(x + 1) → \frac{x − 2}{x + 1}. */
export function fracTexOf(n: Node): string {
  const strip = (m: Node): Node => {
    if (m.kind === 'neg') return { ...m, arg: strip(m.arg) };
    if (m.kind !== 'bin') return m;
    const left = strip(m.left), right = strip(m.right);
    if (m.op === '/') return { ...m, left: { ...left, group: undefined }, right: { ...right, group: undefined } };
    return { ...m, left, right };
  };
  return toTex(strip(n));
}
