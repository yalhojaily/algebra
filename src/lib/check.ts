// Grades a student's answer against a Problem.
import { equivalent, equivalentEquations, parse, parseEquation, ParseError, topTerms, variables, type Node } from './expr';
import type { Problem } from '../generators/types';
import { describe, parseInequality, solvedForm } from './inequality';
import { evaluate } from './expr';
import { notSimplifiedFraction } from './rational';

export type Verdict =
  | { status: 'correct' }
  | { status: 'wrong'; feedback?: string }
  | { status: 'invalid'; message: string };

const normalize = (s: string) => s.replace(/\s+/g, '').replace(/[−–]/g, '-').toLowerCase();

/** If the student used a different single letter (n instead of x), rename it so it still counts. */
function renameSingleVar(student: Node[], expected: Node[]): Record<string, string> | null {
  const sv = new Set(student.flatMap((n) => [...variables(n)]));
  const ev = new Set(expected.flatMap((n) => [...variables(n)]));
  if (sv.size === 1 && ev.size === 1) {
    const [s] = sv;
    const [e] = ev;
    if (s !== e) return { [s]: e };
  }
  return null;
}

function rename(n: Node, map: Record<string, string>): Node {
  switch (n.kind) {
    case 'var':
      return { kind: 'var', name: map[n.name] ?? n.name };
    case 'neg':
      return { kind: 'neg', arg: rename(n.arg, map) };
    case 'bin':
      return { ...n, left: rename(n.left, map), right: rename(n.right, map) };
    default:
      return n;
  }
}

export function check(problem: Problem, input: string | number): Verdict {
  const a = problem.answer;
  const mistake = (raw: string) =>
    problem.mistakes?.find((m) => m.answer && normalize(m.answer) === normalize(raw))?.feedback;

  if (a.type === 'choice') {
    return input === a.correct ? { status: 'correct' } : { status: 'wrong' };
  }

  const raw = String(input).trim();
  if (!raw) return { status: 'invalid', message: 'Type your answer first.' };

  try {
    if (a.type === 'number') {
      // In scientific notation people write "3.2 x 10^5" with an x for "times".
      const src = a.sci ? raw.replace(/(\d)\s*[xX]\s*10/g, '$1*10') : raw;
      const n = parse(src);
      if (variables(n).size > 0) return { status: 'invalid', message: 'The answer should be a number, without letters.' };
      if (a.decimal && raw.includes('/')) return { status: 'invalid', message: 'Write your answer as a decimal, like 0.75 — not as a fraction.' };
      if (a.sci) {
        const m = src.replace(/\s+/g, '').replace(/[×xX·]/g, '*').replace(/[−–]/g, '-').match(/^(-?\d+(?:\.\d+)?)\*10\^\(?(-?\d+)\)?$/);
        if (!m) return { status: 'invalid', message: 'Write it in scientific notation, like 3.2 × 10^5 (type 3.2*10^5).' };
        const lead = Math.abs(Number(m[1]));
        if (lead < 1 || lead >= 10) return { status: 'invalid', message: 'In scientific notation the first number must be at least 1 and less than 10.' };
      }
      const got = equivalent(n, { kind: 'num', value: a.value });
      if (got) return { status: 'correct' };
      return { status: 'wrong', feedback: mistake(raw) };
    }

    if (a.type === 'expression') {
      if (raw.includes('=')) return { status: 'invalid', message: 'An expression has no "=" sign. Just write the expression.' };
      const expected = parse(a.value);
      let got = parse(raw);
      const map = renameSingleVar([got], [expected]);
      if (map) got = rename(got, map);
      if (!equivalent(got, expected)) return { status: 'wrong', feedback: mistake(raw) };
      if (a.maxTerms !== undefined) {
        const terms = topTerms(got).length;
        if (/[()[\]{}]/.test(raw) || terms > a.maxTerms)
          return { status: 'invalid', message: 'That is equal to the right answer, but not simplified yet. Remove parentheses and combine like terms.' };
      }
      if (a.positiveExponents && /\^\s*\(?\s*[-−]/.test(raw))
        return { status: 'invalid', message: 'That is equal to the right answer, but write it using only positive exponents.' };
      if (a.rational) {
        const why = notSimplifiedFraction(got, expected);
        if (why) return { status: 'invalid', message: why };
      }
      if (a.factored) {
        const why = notFullyFactored(got, expected);
        if (why) return { status: 'invalid', message: why };
      }
      if (a.factor !== undefined) {
        const gcf = parse(a.factor);
        const g = { ...got, group: undefined } as Node;
        const factored =
          g.kind === 'bin' && g.op === '*' && (equivalent(g.left, gcf) || equivalent(g.right, gcf)) && /[(]/.test(raw);
        if (!factored)
          return { status: 'invalid', message: `That is equal to the right answer, but it is not factored completely. Take out the greatest common factor.` };
      }
      return { status: 'correct' };
    }

    if (a.type === 'point') {
      const pt = parsePoint(raw);
      if (!pt) return { status: 'invalid', message: 'Write an ordered pair like (3, -2).' };
      if (close(pt[0], a.x) && close(pt[1], a.y)) return { status: 'correct' };
      if (close(pt[0], a.y) && close(pt[1], a.x)) return { status: 'wrong', feedback: 'The numbers are right but in the wrong order. The **x**-coordinate comes first: (x, y).' };
      return { status: 'wrong', feedback: mistake(raw) };
    }

    if (a.type === 'solutions') {
      const vals = parseSolutions(raw, a.variable);
      if (!vals) return { status: 'invalid', message: 'List the solutions separated by commas, like 2, -3 (or x = 2 or x = -3).' };
      const want = [...new Set(a.values.map((v) => +v.toFixed(9)))];
      const got = [...new Set(vals.map((v) => +v.toFixed(9)))];
      const missing = want.filter((w) => !got.some((g) => close(g, w)));
      const extra = got.filter((g) => !want.some((w) => close(g, w)));
      if (!missing.length && !extra.length) return { status: 'correct' };
      const m = mistake(raw);
      if (m) return { status: 'wrong', feedback: m };
      if (!extra.length) return { status: 'wrong', feedback: `Those are correct, but there ${missing.length === 1 ? 'is another solution' : 'are more solutions'}.` };
      return { status: 'wrong', feedback: extra.length === got.length ? undefined : 'Some of those are right, but at least one is not a solution. Check each one.' };
    }

    if (a.type === 'plot') {
      const pts = raw.split(';').filter(Boolean).map((s) => s.split(',').map(Number) as [number, number]);
      if (a.mode === 'point') {
        if (pts.length !== 1) return { status: 'invalid', message: 'Click once on the grid to place your point.' };
        const [x, y] = pts[0];
        if (x === a.x && y === a.y) return { status: 'correct' };
        if (x === a.y && y === a.x) return { status: 'wrong', feedback: 'You swapped the coordinates. Move **across** by the x-coordinate first, then **up or down** by the y-coordinate.' };
        return { status: 'wrong' };
      }
      if (pts.length !== 2) return { status: 'invalid', message: 'Click two points on the grid to draw your line.' };
      const [[x1, y1], [x2, y2]] = pts;
      if (x1 === x2 && y1 === y2) return { status: 'invalid', message: 'Pick two different points.' };
      const on = (x: number, y: number) => close(a.a * x + a.b * y, a.c);
      if (on(x1, y1) && on(x2, y2)) return { status: 'correct' };
      return { status: 'wrong', feedback: on(x1, y1) || on(x2, y2) ? 'One of your points is on the line, but the other is not.' : 'Neither point is on the line. Make a table of values to find points.' };
    }

    if (a.type === 'interval') return checkInterval(a, raw);

    if (a.type === 'tuple') {
      const n = a.values.length;
      const got = parseTuple(raw);
      if (!got || got.length !== n) return { status: 'invalid', message: `Write an ordered ${n === 3 ? 'triple like (1, -2, 3)' : `list of ${n} numbers in parentheses`}.` };
      if (got.every((v, i) => close(v, a.values[i]))) return { status: 'correct' };
      const sorted = (xs: number[]) => [...xs].sort((u, v) => u - v);
      if (sorted(got).every((v, i) => close(v, sorted(a.values)[i]))) return { status: 'wrong', feedback: 'Those are the right numbers, but in the wrong order. Write them in alphabetical order of the variables: (x, y, z).' };
      return { status: 'wrong', feedback: mistake(raw) };
    }

    if (a.type === 'inequality') {
      const expected = solvedForm(parseInequality(a.value))!;
      if (!/[<>≤≥]/.test(raw)) {
        // A bare number is a common slip: they found the boundary but not the inequality.
        if (/^[-−]?[\d.\/\s]+$/.test(raw)) return { status: 'invalid', message: `Write the whole inequality, for example ${expected.variable} > 3 — not just the number.` };
        return { status: 'invalid', message: 'An inequality needs one of the signs <, >, ≤, ≥ (type <= or >= for ≤ and ≥).' };
      }
      const got = solvedForm(parseInequality(raw));
      if (!got) return { status: 'invalid', message: `Finish solving: get ${expected.variable} alone on one side, with just a number on the other.` };
      if (got.variable !== expected.variable) return { status: 'invalid', message: `Use the variable ${expected.variable}.` };
      const sameBound = Math.abs(got.bound - expected.bound) < 1e-9;
      if (sameBound && got.op === expected.op) return { status: 'correct' };
      const m = mistake(raw);
      if (m) return { status: 'wrong', feedback: m };
      if (sameBound) {
        const strictGot = got.op.length === 1;
        const strictExp = expected.op.length === 1;
        if (strictGot !== strictExp)
          return { status: 'wrong', feedback: `The boundary ${expected.bound} is right, but check whether it is included: ${strictExp ? 'it is **not** a solution, so use < or >' : 'it **is** a solution, so use ≤ or ≥'}.` };
        return { status: 'wrong', feedback: 'The boundary is right, but the inequality points the wrong way. Did you multiply or divide by a negative number? Then the sign must be reversed.' };
      }
      return { status: 'wrong', feedback: `Your answer says "${describe(got)}".` };
    }

    // equation
    if (!raw.includes('=')) return { status: 'invalid', message: 'An equation needs an "=" sign.' };
    const expected = parseEquation(a.value);
    let got = parseEquation(raw);
    const map = renameSingleVar([got.left, got.right], [expected.left, expected.right]);
    if (map) got = { left: rename(got.left, map), right: rename(got.right, map) };
    if (!equivalentEquations(got, expected)) return { status: 'wrong', feedback: mistake(raw) };
    if (a.solveFor) {
      const v = a.solveFor;
      const alone = (n: Node) => n.kind === 'var' && n.name === v;
      const ok = (alone(got.left) && !variables(got.right).has(v)) || (alone(got.right) && !variables(got.left).has(v));
      if (!ok) return { status: 'invalid', message: `That equation is true, but it isn't solved for ${v} yet. Get ${v} alone on one side.` };
    }
    return { status: 'correct' };
  } catch (e) {
    if (e instanceof ParseError) return { status: 'invalid', message: e.message };
    throw e;
  }
}

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/** "(3, -2)" → [3, -2]. Fractions and decimals are allowed. */
export function parsePoint(raw: string): [number, number] | null {
  const m = raw.replace(/[−–]/g, '-').match(/^\s*\(\s*([^,]+?)\s*,\s*([^,]+?)\s*\)\s*$/);
  if (!m) return null;
  try {
    const x = evaluate(parse(m[1]), {});
    const y = evaluate(parse(m[2]), {});
    return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : null;
  } catch {
    return null;
  }
}

/** "(1, -2, 3)" → [1, -2, 3]. */
export function parseTuple(raw: string): number[] | null {
  const m = raw.replace(/[−–]/g, '-').match(/^\s*\((.*)\)\s*$/);
  if (!m) return null;
  const parts = m[1].split(',').map((t) => t.trim());
  if (parts.some((t) => !t)) return null;
  try {
    const vs = parts.map((t) => evaluate(parse(t), {}));
    return vs.every(Number.isFinite) ? vs : null;
  } catch {
    return null;
  }
}

/** "2, -3", "x = 2 or x = -3", "{2, -3}" → [2, -3]. */
export function parseSolutions(raw: string, v?: string): number[] | null {
  const s = raw.replace(/[−–]/g, '-').replace(/[{}]/g, '').replace(/\band\b|\bor\b|;/gi, ',');
  const parts = s.split(',').map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return null;
  const out: number[] = [];
  for (let part of parts) {
    const eq = part.match(/^([a-zA-Z])\s*=\s*(.+)$/);
    if (eq) {
      if (v && eq[1] !== v) return null;
      part = eq[2];
    }
    try {
      const n = parse(part);
      if (variables(n).size) return null;
      out.push(evaluate(n, {}));
    } catch {
      return null;
    }
  }
  return out;
}

// ---------- Is a product factored completely? ----------

/** Split a product into its factors: 3x(x + 2)^2 → [3, x, (x+2), (x+2)]. */
function factorsOf(n: Node): Node[] {
  const g = { ...n, group: undefined } as Node;
  if (g.kind === 'neg') return [{ kind: 'num', value: -1 }, ...factorsOf(g.arg)];
  if (g.kind === 'bin' && g.op === '*') return [...factorsOf(g.left), ...factorsOf(g.right)];
  if (g.kind === 'bin' && g.op === '^' && g.right.kind === 'num' && Number.isInteger(g.right.value) && g.right.value > 0 && topTerms({ ...g.left, group: undefined } as Node).length > 1)
    return Array.from({ length: g.right.value }, () => g.left);
  return [g];
}

const isMonomial = (n: Node) => topTerms({ ...n, group: undefined } as Node).length === 1;

function product(ns: Node[]): Node {
  return ns.reduce<Node>((acc, f) => ({ kind: 'bin', op: '*', left: acc, right: f }), { kind: 'num', value: 1 });
}

/** Returns why `got` is not factored as completely as `expected`, or null if it is. */
export function notFullyFactored(got: Node, expected: Node): string | null {
  const gf = factorsOf(got);
  const ef = factorsOf(expected);
  const gPoly = gf.filter((f) => !isMonomial(f));
  const ePoly = ef.filter((f) => !isMonomial(f));
  if (gPoly.length === 0 && ePoly.length > 0) return 'That is equal to the right answer, but it is not factored. Write it as a product.';
  if (gPoly.length < ePoly.length) return 'That is equal to the right answer, but it can be factored further. Check each factor again.';
  const gm = product(gf.filter(isMonomial));
  const em = product(ef.filter(isMonomial));
  if (!equivalent(gm, em) && !equivalent(gm, { kind: 'neg', arg: em }))
    return 'That is equal to the right answer, but a common factor is still inside parentheses. Take out the greatest common factor first.';
  return null;
}

// ---------- Interval notation ----------

export interface Interval {
  lo: number;
  hi: number;
  loClosed: boolean;
  hiClosed: boolean;
}

/** "[−3, 5)", "(-inf, 2]", "(-∞, ∞)", "all real numbers" → an Interval, or null. */
export function parseInterval(raw: string): Interval | { error: string } | null {
  const s = raw.trim().replace(/[−–]/g, '-').replace(/infinity|inf|∞/gi, 'inf').replace(/\s+/g, ' ');
  if (/^(all real numbers|all reals|r|ℝ|\(-inf, ?inf\))$/i.test(s)) return { lo: -Infinity, hi: Infinity, loClosed: false, hiClosed: false };
  const m = s.match(/^([[(])\s*([^,]+?)\s*,\s*([^,]+?)\s*([\])])$/);
  if (!m) return null;
  const num = (t: string): number | null => {
    if (/^\+?inf$/i.test(t)) return Infinity;
    if (/^-inf$/i.test(t)) return -Infinity;
    try {
      const v = evaluate(parse(t), {});
      return Number.isFinite(v) ? v : null;
    } catch {
      return null;
    }
  };
  const lo = num(m[2]), hi = num(m[3]);
  if (lo === null || hi === null) return null;
  const loClosed = m[1] === '[', hiClosed = m[4] === ']';
  if ((lo === -Infinity && loClosed) || (hi === Infinity && hiClosed)) return { error: 'Infinity is not a number you can reach, so it always gets a round parenthesis: (−∞, 3] — not [−∞, 3].' };
  if (lo === Infinity || hi === -Infinity) return { error: 'Write the smaller end first: −∞ on the left, ∞ on the right.' };
  if (lo > hi) return { error: 'Write the smaller number first, like [−2, 5].' };
  return { lo, hi, loClosed, hiClosed };
}

export function checkInterval(a: Interval, raw: string): Verdict {
  const got = parseInterval(raw);
  if (!got) return { status: 'invalid', message: 'Write an interval like [−2, 5) or (−∞, 3]. Type inf for ∞.' };
  if ('error' in got) return { status: 'invalid', message: got.error };
  const same = (x: number, y: number) => (x === y) || Math.abs(x - y) < 1e-9;
  const endsOk = same(got.lo, a.lo) && same(got.hi, a.hi);
  if (endsOk && got.loClosed === a.loClosed && got.hiClosed === a.hiClosed) return { status: 'correct' };
  if (endsOk) return { status: 'wrong', feedback: 'The endpoints are right, but check the brackets: use [ ] when the endpoint is included (a solid dot) and ( ) when it is not (an open dot).' };
  return { status: 'wrong' };
}
