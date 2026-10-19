// Inequalities: parsing what students type (x > 3, x ≥ -2, 5 < x, {x | x <= 4}) and checking solved forms.
import { evaluate, parse, ParseError, toTex, variables, type Node } from './expr';

export type Rel = '<' | '>' | '<=' | '>=';

export interface Inequality {
  left: Node;
  op: Rel;
  right: Node;
}

const FLIP: Record<Rel, Rel> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
export const REL_TEX: Record<Rel, string> = { '<': '<', '>': '>', '<=': '\\le', '>=': '\\ge' };

/** Normalize the many ways students write inequality symbols and set-builder notation. */
export function normalizeInequality(src: string): string {
  let s = src
    .replace(/[−–—]/g, '-')
    .replace(/≤|=</g, '<=')
    .replace(/≥|=>/g, '>=')
    .trim();
  // {x | x > 3}  or  {x : x > 3}
  const sb = s.match(/^\{\s*[a-zA-Z]\s*[|:]\s*(.+)\}$/);
  if (sb) s = sb[1];
  return s;
}

export function parseInequality(src: string): Inequality {
  const s = normalizeInequality(src);
  const m = s.match(/(<=|>=|<|>)/g);
  if (!m) throw new ParseError('An inequality needs one of the signs <, >, ≤, ≥ (type <= or >= for ≤ and ≥)');
  if (m.length > 1) throw new ParseError('Use just one inequality sign');
  if (s.includes('=') && !/<=|>=/.test(s)) throw new ParseError('Use an inequality sign, not "="');
  const op = m[0] as Rel;
  const [l, r] = s.split(op);
  if (!l.trim() || !r.trim()) throw new ParseError('Something is missing on one side of the inequality');
  return { left: parse(l), op, right: parse(r) };
}

/** A solved inequality: one variable alone on one side, a number on the other. Returned with the variable on the left. */
export interface Solved {
  variable: string;
  op: Rel;
  bound: number;
}

export function solvedForm(q: Inequality): Solved | null {
  const isVar = (n: Node) => n.kind === 'var';
  const isNum = (n: Node) => variables(n).size === 0;
  if (isVar(q.left) && isNum(q.right)) return { variable: (q.left as { name: string }).name, op: q.op, bound: evaluate(q.right, {}) };
  if (isVar(q.right) && isNum(q.left)) return { variable: (q.right as { name: string }).name, op: FLIP[q.op], bound: evaluate(q.left, {}) };
  return null;
}

export const holds = (op: Rel, a: number, b: number) =>
  op === '<' ? a < b : op === '>' ? a > b : op === '<=' ? a <= b : a >= b;

export function inequalityTex(q: Inequality): string {
  return `${toTex(q.left)} ${REL_TEX[q.op]} ${toTex(q.right)}`;
}

/** Turn a solved inequality into words: "x is greater than or equal to 3". */
export function describe(s: Solved): string {
  const w = { '<': 'less than', '>': 'greater than', '<=': 'less than or equal to', '>=': 'greater than or equal to' }[s.op];
  return `${s.variable} is ${w} ${s.bound}`;
}
