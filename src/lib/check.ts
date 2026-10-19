// Grades a student's answer against a Problem.
import { equivalent, equivalentEquations, parse, parseEquation, ParseError, topTerms, variables, type Node } from './expr';
import type { Problem } from '../generators/types';
import { describe, parseInequality, solvedForm } from './inequality';

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
      const n = parse(raw);
      if (variables(n).size > 0) return { status: 'invalid', message: 'The answer should be a number, without letters.' };
      if (a.decimal && raw.includes('/')) return { status: 'invalid', message: 'Write your answer as a decimal, like 0.75 — not as a fraction.' };
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
