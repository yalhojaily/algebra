// A small, dependency-free algebra engine for checking student answers.
//
// It understands what students actually type:
//   3x   2(x + 1)   xy   (a)(b)   x/4   x^2   3·x   3×x   12 ÷ y   −5
// and decides whether two answers are mathematically the same by evaluating
// both at many random points (so "2x + 2" and "2(x+1)" are both accepted).

export type Group = '(' | '[' | '{';

/** Every node can remember the grouping symbol it was written in, and can be highlighted for display. */
interface Meta {
  group?: Group;
  hl?: boolean;
}

export type Node = (
  | { kind: 'num'; value: number }
  | { kind: 'var'; name: string }
  | { kind: 'neg'; arg: Node }
  | { kind: 'bin'; op: '+' | '-' | '*' | '/' | '^'; left: Node; right: Node; implicit?: boolean }
) &
  Meta;

export class ParseError extends Error {}

type Tok =
  | { t: 'num'; v: number; s: string }
  | { t: 'var'; v: string }
  | { t: 'op'; v: '+' | '-' | '*' | '/' | '^' }
  | { t: '('; g: Group }
  | { t: ')'; g: Group };

const CLOSE: Record<Group, string> = { '(': ')', '[': ']', '{': '}' };

function tokenize(src: string): Tok[] {
  const s = src
    .replace(/[−–—]/g, '-')
    .replace(/[·×⋅∙]/g, '*')
    .replace(/÷/g, '/');
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.,]/.test(s[j])) j++;
      const raw = s.slice(i, j).replace(/,/g, '');
      const v = Number(raw);
      if (!Number.isFinite(v) || raw === '.') throw new ParseError(`"${s.slice(i, j)}" is not a number`);
      out.push({ t: 'num', v, s: raw });
      i = j;
    } else if (/[a-zA-Z]/.test(c)) {
      out.push({ t: 'var', v: c }); // single-letter variables, so "xy" means x·y
      i++;
    } else if ('+-*/^'.includes(c)) {
      out.push({ t: 'op', v: c as '+' });
      i++;
    } else if (c === '(' || c === '[' || c === '{') {
      out.push({ t: '(', g: c });
      i++;
    } else if (c === ')' || c === ']' || c === '}') {
      out.push({ t: ')', g: c === ')' ? '(' : c === ']' ? '[' : '{' });
      i++;
    } else {
      throw new ParseError(`I don't understand the symbol "${c}"`);
    }
  }
  return out;
}

class Parser {
  private i = 0;
  constructor(private toks: Tok[]) {}

  private peek() {
    return this.toks[this.i];
  }
  private next() {
    return this.toks[this.i++];
  }
  private isOp(v: string) {
    const t = this.peek();
    return t?.t === 'op' && t.v === v;
  }

  parse(): Node {
    if (this.toks.length === 0) throw new ParseError('Type an expression first');
    const n = this.expr();
    if (this.i < this.toks.length) {
      const t = this.peek();
      throw new ParseError(t.t === ')' ? 'There is an extra ")"' : 'Something is out of place');
    }
    return n;
  }

  // expr := term (('+'|'-') term)*
  private expr(): Node {
    let left = this.term();
    while (this.isOp('+') || this.isOp('-')) {
      const op = (this.next() as { v: '+' | '-' }).v;
      left = { kind: 'bin', op, left, right: this.term() };
    }
    return left;
  }

  // term := unary (('*'|'/') unary | implicit unary)*
  private term(): Node {
    let left = this.unary();
    for (;;) {
      if (this.isOp('*') || this.isOp('/')) {
        const op = (this.next() as { v: '*' | '/' }).v;
        left = { kind: 'bin', op, left, right: this.unary() };
      } else if (this.startsFactor()) {
        left = { kind: 'bin', op: '*', left, right: this.power(), implicit: true };
      } else return left;
    }
  }

  private startsFactor() {
    const t = this.peek();
    return !!t && (t.t === 'num' || t.t === 'var' || t.t === '(');
  }

  private unary(): Node {
    if (this.isOp('-')) {
      this.next();
      return { kind: 'neg', arg: this.unary() };
    }
    if (this.isOp('+')) {
      this.next();
      return this.unary();
    }
    return this.power();
  }

  // power := atom ('^' unary)?   (right-associative)
  private power(): Node {
    const base = this.atom();
    if (this.isOp('^')) {
      this.next();
      return { kind: 'bin', op: '^', left: base, right: this.unary() };
    }
    return base;
  }

  private atom(): Node {
    const t = this.next();
    if (!t) throw new ParseError('The expression ends too early');
    if (t.t === 'num') return { kind: 'num', value: t.v };
    if (t.t === 'var') return { kind: 'var', name: t.v };
    if (t.t === '(') {
      const inner = this.expr();
      const close = this.next();
      if (close?.t !== ')') throw new ParseError(`A "${t.g}" is missing its "${CLOSE[t.g]}"`);
      if (close.g !== t.g) throw new ParseError(`"${t.g}" should be closed with "${CLOSE[t.g]}"`);
      return { ...inner, group: t.g };
    }
    throw new ParseError(t.t === ')' ? 'There is an extra ")"' : `"${t.v}" needs something before it`);
  }
}

export function parse(src: string): Node {
  return new Parser(tokenize(src)).parse();
}

export function variables(n: Node, acc = new Set<string>()): Set<string> {
  if (n.kind === 'var') acc.add(n.name);
  else if (n.kind === 'neg') variables(n.arg, acc);
  else if (n.kind === 'bin') {
    variables(n.left, acc);
    variables(n.right, acc);
  }
  return acc;
}

export function evaluate(n: Node, env: Record<string, number>): number {
  switch (n.kind) {
    case 'num':
      return n.value;
    case 'var':
      if (!(n.name in env)) throw new ParseError(`No value for ${n.name}`);
      return env[n.name];
    case 'neg':
      return -evaluate(n.arg, env);
    case 'bin': {
      const a = evaluate(n.left, env);
      const b = evaluate(n.right, env);
      switch (n.op) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return a / b;
        case '^':
          return a ** b;
      }
    }
  }
}

const close = (a: number, b: number) =>
  Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

function samples(vars: string[], count = 24): Record<string, number>[] {
  const out: Record<string, number>[] = [];
  for (let k = 0; k < count; k++) {
    const env: Record<string, number> = {};
    // Mix of awkward values so coincidences are essentially impossible.
    for (const v of vars) env[v] = Math.round((Math.random() * 20 - 10) * 1000) / 1000 + 0.137;
    out.push(env);
  }
  return out;
}

/** Are two expressions equal for every value of their variables? */
export function equivalent(a: Node, b: Node): boolean {
  const vars = [...new Set([...variables(a), ...variables(b)])];
  let checked = 0;
  for (const env of samples(vars)) {
    const x = evaluate(a, env);
    const y = evaluate(b, env);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (!close(x, y)) return false;
    checked++;
  }
  return checked > 0;
}

export interface Equation {
  left: Node;
  right: Node;
}

export function parseEquation(src: string): Equation {
  const parts = src.split('=');
  if (parts.length !== 2) throw new ParseError('An equation needs exactly one "=" sign');
  return { left: parse(parts[0]), right: parse(parts[1]) };
}

/**
 * Two equations say the same thing if (L₁ − R₁) is a constant non-zero multiple of (L₂ − R₂).
 * So "x + 5 = 12", "5 + x = 12" and "12 = x + 5" are all accepted.
 */
export function equivalentEquations(a: Equation, b: Equation): boolean {
  const vars = [...new Set([a.left, a.right, b.left, b.right].flatMap((n) => [...variables(n)]))];
  let ratio: number | null = null;
  for (const env of samples(vars)) {
    const d1 = evaluate(a.left, env) - evaluate(a.right, env);
    const d2 = evaluate(b.left, env) - evaluate(b.right, env);
    if (!Number.isFinite(d1) || !Number.isFinite(d2)) continue;
    if (close(d1, 0) && close(d2, 0)) continue;
    if (close(d2, 0) || close(d1, 0)) return false;
    const r = d1 / d2;
    if (ratio === null) ratio = r;
    else if (!close(r, ratio)) return false;
  }
  return ratio !== null;
}

// ---------- Pretty printing ----------

const prec = (n: Node): number => {
  if (n.group) return 5;
  if (n.kind === 'bin') return { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 }[n.op];
  if (n.kind === 'neg') return 3;
  if (n.kind === 'num' && n.value < 0) return 3;
  return 5;
};

const isNegative = (n: Node) => !n.group && (n.kind === 'neg' || (n.kind === 'num' && n.value < 0));

const fmtNum = (v: number) => {
  if (Number.isInteger(v)) return String(v);
  return String(+v.toFixed(10));
};

const DELIM: Record<Group, [string, string]> = {
  '(': ['\\left(', '\\right)'],
  '[': ['\\left[', '\\right]'],
  '{': ['\\left\\{', '\\right\\}'],
};

/** Convert an expression to LaTeX for display with KaTeX. Grouping symbols the student typed are kept. */
export function toTex(n: Node): string {
  let core = texCore(n);
  if (n.group) core = `${DELIM[n.group][0]}${core}${DELIM[n.group][1]}`;
  return n.hl ? `\\htmlClass{hl}{${core}}` : core;
}

function texCore(n: Node): string {
  switch (n.kind) {
    case 'num':
      return fmtNum(n.value);
    case 'var':
      return n.name;
    case 'neg': {
      const inner = toTex(n.arg);
      return prec(n.arg) <= 3 ? `-\\left(${inner}\\right)` : `-${inner}`;
    }
    case 'bin': {
      const wrap = (c: Node, min: number) => (prec(c) < min ? `\\left(${toTex(c)}\\right)` : toTex(c));
      // A negative number on the right of an operation is written in parentheses: 3 + (−2), 4 · (−5).
      const right = (c: Node, min: number) => (isNegative(c) ? `\\left(${toTex(c)}\\right)` : wrap(c, min));
      switch (n.op) {
        case '+':
          return `${toTex(n.left)} + ${right(n.right, 1)}`;
        case '-':
          return `${toTex(n.left)} - ${right(n.right, 2)}`;
        case '/':
          return `\\frac{${toTex(n.left)}}{${toTex(n.right)}}`;
        case '^':
          return `${wrap(n.left, 5)}^{${toTex(n.right)}}`;
        case '*': {
          const l = wrap(n.left, 2);
          const r = right(n.right, 3);
          const rr = n.right;
          // Two numbers side by side need a visible dot: 3 · 4. Otherwise juxtapose: 3x, 2(x + 1), 2(−3).
          const needsDot = !rr.group && !isNegative(rr) && (rr.kind === 'num' || (rr.kind === 'bin' && rr.op === '^' && rr.left.kind === 'num'));
          return needsDot ? `${l} \\cdot ${r}` : `${l}${r}`;
        }
      }
    }
  }
}

// ---------- Step-by-step evaluation (order of operations) ----------

export interface EvalStep {
  /** The expression before this step, with the part being worked on highlighted. */
  before: string;
  /** The expression after this step. */
  after: string;
  /** What was done, e.g. "Multiply". */
  action: string;
  /** The small calculation, e.g. "3 \\cdot 4 = 12". */
  calc: string;
}

const RANK: Record<string, number> = { '^': 3, '*': 2, '/': 2, '+': 1, '-': 1 };
const ACTION: Record<string, string> = { '^': 'Exponent', '*': 'Multiply', '/': 'Divide', '+': 'Add', '-': 'Subtract' };

type Path = ('left' | 'right' | 'arg')[];

function at(n: Node, path: Path): Node {
  return path.reduce<Node>((node, k) => (node as any)[k], n);
}

function replaceAt(n: Node, path: Path, fn: (old: Node) => Node): Node {
  if (path.length === 0) return fn(n);
  const [k, ...rest] = path;
  return { ...(n as any), [k]: replaceAt((n as any)[k], rest, fn) } as Node;
}

/** Turn −(number) into a negative number, keeping any grouping symbols around it. */
function normalize(n: Node): Node {
  switch (n.kind) {
    case 'neg': {
      const a = normalize(n.arg);
      if (a.kind === 'num' && !a.group) return { kind: 'num', value: -a.value, group: n.group };
      return { ...n, arg: a };
    }
    case 'bin':
      return { ...n, left: normalize(n.left), right: normalize(n.right) };
    default:
      return n;
  }
}

const isNum = (n: Node) => n.kind === 'num';

/** Find the operation that order of operations says comes next. */
function nextReducible(root: Node): Path | null {
  let best: { path: Path; depth: number; rank: number; order: number } | null = null;
  let order = 0;
  const visit = (n: Node, path: Path, depth: number) => {
    const d = depth + (n.group ? 1 : 0);
    if (n.kind === 'bin') {
      visit(n.left, [...path, 'left'], d);
      const me = order++;
      if (isNum(n.left) && isNum(n.right)) {
        const cand = { path, depth: d, rank: RANK[n.op], order: me };
        if (
          !best ||
          cand.depth > best.depth ||
          (cand.depth === best.depth && cand.rank > best.rank) ||
          (cand.depth === best.depth && cand.rank === best.rank && cand.order < best.order)
        )
          best = cand;
      }
      visit(n.right, [...path, 'right'], d);
    } else if (n.kind === 'neg') {
      visit(n.arg, [...path, 'arg'], d);
    }
  };
  visit(root, [], 0);
  return best ? (best as { path: Path }).path : null;
}

function compute(op: string, a: number, b: number) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      return a ** b;
  }
}

/** Evaluate a numeric expression one operation at a time, following the order of operations. */
export function evaluationSteps(src: string | Node, maxSteps = 40): { steps: EvalStep[]; result: number; start: string } {
  let cur = normalize(typeof src === 'string' ? parse(src) : src);
  if (variables(cur).size) throw new ParseError('Only numbers here, no variables');
  const start = toTex(cur);
  const steps: EvalStep[] = [];
  for (let i = 0; i < maxSteps; i++) {
    const path = nextReducible(cur);
    if (!path) break;
    const node = at(cur, path) as Extract<Node, { kind: 'bin' }>;
    const a = (node.left as { value: number }).value;
    const b = (node.right as { value: number }).value;
    if (node.op === '/' && b === 0) throw new ParseError('Division by zero is undefined');
    const value = compute(node.op, a, b);
    const before = toTex(replaceAt(cur, path, (o) => ({ ...o, hl: true })));
    const calcNode: Node = { ...node, group: undefined, hl: false };
    // The result keeps grouping symbols only when it is negative and they are still needed, e.g. (−3)².
    cur = normalize(replaceAt(cur, path, (o) => ({ kind: 'num', value, group: value < 0 && o.group && path.length > 0 ? o.group : undefined })));
    steps.push({
      before,
      after: toTex(cur),
      action: ACTION[node.op],
      calc: `${toTex(calcNode)} = ${fmtNum(value)}`,
    });
  }
  return { steps, result: evaluate(cur, {}), start };
}

/** The additive terms at the top level: 3x - 2y + 5 → [3x, -2y, 5]. */
export function topTerms(n: Node): Node[] {
  if (!n.group && n.kind === 'bin' && (n.op === '+' || n.op === '-')) {
    const right = n.op === '-' ? ({ kind: 'neg', arg: n.right } as Node) : n.right;
    return [...topTerms(n.left), right];
  }
  return [n];
}

/** Try to render user input as LaTeX; returns null if it doesn't parse yet. */
export function tryTex(src: string, allowEquation = false): string | null {
  try {
    // Union of intervals "(-inf, 1) U [3, inf)" and the empty set
    if (/^\s*(∅|no solution)\s*$/i.test(src)) return '\\varnothing';
    if (/\s(U|∪)\s/.test(src)) {
      const parts = src.split(/\s*(?:∪|\bU\b)\s*/).map((p) => tryTex(p));
      if (parts.every(Boolean)) return parts.join(' \\cup ');
    }
    // Interval "[−3, 5)" or "(-inf, 2]"
    const iv = src.replace(/infinity|inf|∞/gi, '∞').match(/^\s*([[(])\s*([^,]+?)\s*,\s*([^,]+?)\s*([\])])\s*$/);
    if (iv && (iv[1] === '[' || iv[4] === ']' || iv[2].includes('∞') || iv[3].includes('∞'))) {
      const end = (t: string) => (t.replace(/\s/g, '') === '∞' ? '\\infty' : t.replace(/\s/g, '') === '-∞' ? '-\\infty' : toTex(parse(t)));
      return `\\left${iv[1]}${end(iv[2])},\\ ${end(iv[3])}\\right${iv[4]}`;
    }
    // Ordered pair "(3, -2)" or a list of solutions "2, -3"
    const tup = src.match(/^\s*\(([^()]*,[^()]*)\)\s*$/);
    if (tup) return `\\left(${tup[1].split(',').map((t) => toTex(parse(t))).join(',\\ ')}\\right)`;
    if (/,\s*\S/.test(src) && !/^\s*[\d,.]+\s*$/.test(src)) {
      return src
        .split(/,|\bor\b/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (p.includes('=') ? `${toTex(parse(p.split('=')[0]))} = ${toTex(parse(p.split('=')[1]))}` : toTex(parse(p))))
        .join(',\\quad ');
    }
    if (allowEquation && /[<>≤≥]/.test(src)) {
      const s = src.replace(/≤|=</g, '<=').replace(/≥|=>/g, '>=');
      const m = s.match(/(<=|>=|<|>)/);
      if (m) {
        const [l, r] = [s.slice(0, m.index), s.slice(m.index! + m[0].length)];
        const rel = { '<': '<', '>': '>', '<=': '\\le', '>=': '\\ge' }[m[0]]!;
        return `${toTex(parse(l))} ${rel} ${toTex(parse(r))}`;
      }
    }
    if (allowEquation && src.includes('=')) {
      const e = parseEquation(src);
      return `${toTex(e.left)} = ${toTex(e.right)}`;
    }
    return toTex(parse(src));
  } catch {
    return null;
  }
}
