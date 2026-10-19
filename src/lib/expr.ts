// A small, dependency-free algebra engine for checking student answers.
//
// It understands what students actually type:
//   3x   2(x + 1)   xy   (a)(b)   x/4   x^2   3·x   3×x   12 ÷ y   −5
// and decides whether two answers are mathematically the same by evaluating
// both at many random points (so "2x + 2" and "2(x+1)" are both accepted).

export type Node =
  | { kind: 'num'; value: number }
  | { kind: 'var'; name: string }
  | { kind: 'neg'; arg: Node }
  | { kind: 'bin'; op: '+' | '-' | '*' | '/' | '^'; left: Node; right: Node; implicit?: boolean };

export class ParseError extends Error {}

type Tok =
  | { t: 'num'; v: number; s: string }
  | { t: 'var'; v: string }
  | { t: 'op'; v: '+' | '-' | '*' | '/' | '^' }
  | { t: '(' }
  | { t: ')' };

function tokenize(src: string): Tok[] {
  const s = src
    .replace(/[−–—]/g, '-')
    .replace(/[·×⋅∙]/g, '*')
    .replace(/÷/g, '/')
    .replace(/[\[{]/g, '(')
    .replace(/[\]}]/g, ')');
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
    } else if (c === '(') {
      out.push({ t: '(' });
      i++;
    } else if (c === ')') {
      out.push({ t: ')' });
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
      if (this.next()?.t !== ')') throw new ParseError('A "(" is missing its ")"');
      return inner;
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
  if (n.kind === 'bin') return { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 }[n.op];
  if (n.kind === 'neg') return 3;
  return 5;
};

/** Convert an expression to LaTeX for display with KaTeX. */
export function toTex(n: Node): string {
  switch (n.kind) {
    case 'num':
      return String(n.value);
    case 'var':
      return n.name;
    case 'neg': {
      const inner = toTex(n.arg);
      return prec(n.arg) <= 3 ? `-\\left(${inner}\\right)` : `-${inner}`;
    }
    case 'bin': {
      const wrap = (c: Node, min: number) => (prec(c) < min ? `\\left(${toTex(c)}\\right)` : toTex(c));
      switch (n.op) {
        case '+':
          return `${toTex(n.left)} + ${wrap(n.right, 1)}`;
        case '-':
          return `${toTex(n.left)} - ${wrap(n.right, 2)}`;
        case '/':
          return `\\frac{${toTex(n.left)}}{${toTex(n.right)}}`;
        case '^':
          return `${wrap(n.left, 5)}^{${toTex(n.right)}}`;
        case '*': {
          const l = wrap(n.left, 2);
          const r = wrap(n.right, 3);
          // Number followed by number needs a visible dot: 3 · 4. Otherwise juxtapose: 3x, 2(x+1).
          const needsDot = n.right.kind === 'num' || (n.right.kind === 'neg') || (n.right.kind === 'bin' && n.right.op === '^' && n.right.left.kind === 'num');
          return needsDot ? `${l} \\cdot ${r}` : `${l}${r}`;
        }
      }
    }
  }
}

/** Try to render user input as LaTeX; returns null if it doesn't parse yet. */
export function tryTex(src: string, allowEquation = false): string | null {
  try {
    if (allowEquation && src.includes('=')) {
      const e = parseEquation(src);
      return `${toTex(e.left)} = ${toTex(e.right)}`;
    }
    return toTex(parse(src));
  } catch {
    return null;
  }
}
