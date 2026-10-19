// Grades a student's answer against a Problem.
import { equivalent, equivalentEquations, parse, parseEquation, ParseError, variables, type Node } from './expr';
import type { Problem } from '../generators/types';

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
      if (equivalent(got, expected)) return { status: 'correct' };
      return { status: 'wrong', feedback: mistake(raw) };
    }

    // equation
    if (!raw.includes('=')) return { status: 'invalid', message: 'An equation needs an "=" sign.' };
    const expected = parseEquation(a.value);
    let got = parseEquation(raw);
    const map = renameSingleVar([got.left, got.right], [expected.left, expected.right]);
    if (map) got = { left: rename(got.left, map), right: rename(got.right, map) };
    if (equivalentEquations(got, expected)) return { status: 'correct' };
    return { status: 'wrong', feedback: mistake(raw) };
  } catch (e) {
    if (e instanceof ParseError) return { status: 'invalid', message: e.message };
    throw e;
  }
}
