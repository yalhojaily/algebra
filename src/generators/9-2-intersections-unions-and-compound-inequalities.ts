// Practice problem generators for Lesson 9.2 — Intersections, Unions, and Compound Inequalities.
import { choice, makeMasterySet, nz, pick, randInt, shuffle, termTex } from './helpers';
import { intersect, iv, ivsTex, ivTex, union, type Iv } from './sets';
import type { Problem, Skill } from './types';

function finiteSets(): Problem {
  const pool = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const A = pool.slice(0, 5).sort((a, b) => a - b), B = [...pool.slice(3, 5), ...pool.slice(5, 8)].sort((a, b) => a - b);
  const op = pick(['cap', 'cup'] as const);
  const res = op === 'cap' ? A.filter((x) => B.includes(x)) : [...new Set([...A, ...B])].sort((a, b) => a - b);
  const set = (xs: number[]) => (xs.length ? `$\\{${xs.join(', ')}\\}$` : '$\\varnothing$');
  const wrong = op === 'cap' ? [...new Set([...A, ...B])].sort((a, b) => a - b) : A.filter((x) => B.includes(x));
  return {
    skill: 'sets',
    prompt: `Let $A = \\{${A.join(', ')}\\}$ and $B = \\{${B.join(', ')}\\}$. Find $A \\${op} B$.`,
    answer: choice(set(res), [set(wrong), set(A.filter((x) => !B.includes(x))), set(B)]),
    hints: [op === 'cap' ? 'The **intersection** $A \\cap B$ contains the elements that are in **both** sets.' : 'The **union** $A \\cup B$ contains the elements that are in **either** set (or both).'],
    solution: [`$A \\${op} B = $ ${set(res)}`],
  };
}

function conjunction(): Problem {
  // lo (op1) a x + b (op2) hi
  const a = nz(4), b = randInt(-8, 8);
  const x1 = randInt(-6, 2), x2 = x1 + randInt(2, 6);
  const c1 = Math.random() < 0.5, c2 = Math.random() < 0.5;
  // values of ax + b at x1, x2
  const v1 = a * x1 + b, v2 = a * x2 + b;
  const [lo, hi] = a > 0 ? [v1, v2] : [v2, v1];
  const [cl, ch] = a > 0 ? [c1, c2] : [c2, c1];
  const ans = iv(x1, x2, c1, c2);
  const le = (c: boolean) => (c ? '\\le' : '<');
  return {
    skill: 'and',
    prompt: `Solve and write in interval notation: $\\;${lo} ${le(cl)} ${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${Math.abs(b)} ${le(ch)} ${hi}$`,
    answer: { type: 'interval', ...ans },
    hints: [`Work on all three parts at once: ${b < 0 ? 'add' : 'subtract'} $${Math.abs(b)}$ everywhere, then divide every part by $${a}$.`, a < 0 ? 'Dividing by a negative number reverses **both** inequality signs — then rewrite with the smaller number on the left.' : 'The solution is the set of $x$ between the two results.'],
    solution: [`$${lo - b} ${le(cl)} ${termTex(a, 'x')} ${le(ch)} ${hi - b}$`, `$${x1} ${le(c1)} x ${le(c2)} ${x2}$${a < 0 ? ' (after dividing by a negative and reordering)' : ''}`, `$${ivTex(ans)}$`],
    placeholder: '[-1, 4)',
  };
}

function disjunction(): Problem {
  const k1 = randInt(-7, 1), k2 = k1 + randInt(2, 7);
  const a = randInt(1, 4), b = randInt(1, 4), p = randInt(-5, 5), q = randInt(-5, 5);
  const c1 = Math.random() < 0.5, c2 = Math.random() < 0.5;
  // a x + p < a k1 + p (x < k1)  or  b x + q ≥ b k2 + q (x ≥ k2)
  const ans = union([iv(-Infinity, k1, false, c1)], [iv(k2, Infinity, c2, false)]);
  const lhs1 = `${termTex(a, 'x')} ${p < 0 ? '-' : '+'} ${Math.abs(p)}`, lhs2 = `${termTex(b, 'x')} ${q < 0 ? '-' : '+'} ${Math.abs(q)}`;
  return {
    skill: 'or',
    prompt: `Solve and write in interval notation: $\\;${lhs1} ${c1 ? '\\le' : '<'} ${a * k1 + p}\\;$ **or** $\\;${lhs2} ${c2 ? '\\ge' : '>'} ${b * k2 + q}$`,
    answer: { type: 'intervals', parts: ans },
    hints: ['Solve each inequality separately.', '"Or" means a number is a solution if it satisfies **either** inequality — take the **union**. Type U for ∪.'],
    solution: [`$x ${c1 ? '\\le' : '<'} ${k1}$ or $x ${c2 ? '\\ge' : '>'} ${k2}$`, `$${ivsTex(ans)}$`],
    placeholder: '(-inf, -2) U [3, inf)',
  };
}

function combine(): Problem {
  const r = () => randInt(-8, 8);
  const mk = (): Iv => {
    const kind = pick(['l', 'r', 'b'] as const);
    const a = r(), b = a + randInt(1, 7);
    if (kind === 'l') return iv(-Infinity, b, false, Math.random() < 0.5);
    if (kind === 'r') return iv(a, Infinity, Math.random() < 0.5, false);
    return iv(a, b, Math.random() < 0.5, Math.random() < 0.5);
  };
  const A = mk(), B = mk();
  const op = pick(['cap', 'cup'] as const);
  const res = op === 'cap' ? intersect([A], [B]) : union([A], [B]);
  return {
    skill: 'combine',
    prompt: `Let $A = ${ivTex(A)}$ and $B = ${ivTex(B)}$. Find $A \\${op} B$ in interval notation. (Type U for ∪ and ∅ — or "no solution" — for the empty set.)`,
    answer: { type: 'intervals', parts: res },
    hints: [op === 'cap' ? 'The intersection is where the two sets **overlap**.' : 'The union is everything in **either** set.', 'Sketch both sets on one number line.'],
    solution: [`$A \\${op} B = ${ivsTex(res)}$`],
    placeholder: '[1, 4)',
  };
}


/** Word problems with "and": a range for a test score, or a temperature range in another unit. */
function compoundWords(): Problem {
  if (Math.random() < 0.5) {
    for (;;) {
      const tests = [randInt(70, 95), randInt(68, 96), randInt(70, 95)];
      const S = tests.reduce((s, t) => s + t, 0);
      const lo = 80 * 4 - S, hi = 90 * 4 - S;
      if (lo < 30 || hi > 100) continue;
      const ans = iv(lo, hi, true, false);
      return {
        skill: 'apply',
        prompt: `A **B** grade needs an average of at least 80 **and** less than 90. Your first three test scores are ${tests.join(', ')}. What scores on the fourth test give a B? Write the set in interval notation.`,
        answer: { type: 'interval', ...ans },
        hints: [`Unknown: the fourth score $x$. "At least 80 and less than 90" is a double inequality: $\\;80 \\le \\dfrac{${S} + x}{4} < 90$.`, 'Multiply all three parts by 4, then subtract.'],
        solution: [`$320 \\le ${S} + x < 360$`, `$${lo} \\le x < ${hi}$`, `Interval: $${ivTex(ans)}$ — the bracket includes ${lo}, the parenthesis excludes ${hi}.`],
        mistakes: [{ answer: `[${lo}, ${hi}]`, feedback: `"Less than 90" excludes the endpoint: ${hi} would give an average of exactly 90, an A.` }],
        placeholder: '[72, 100)',
      };
    }
  }
  const a = pick([-10, -5, 0, 5, 10, 15]), b = a + pick([10, 15, 20, 25, 30]);
  const lo = (9 * a) / 5 + 32, hi = (9 * b) / 5 + 32;
  const ans = iv(lo, hi, true, true);
  const what = pick(['A medicine must be stored', 'A plant grows best', 'A fish tank should be kept']);
  return {
    skill: 'apply',
    prompt: `${what} between ${a}°C and ${b}°C (inclusive). Using $C = \\dfrac{5}{9}(F - 32)$, find the range in degrees **Fahrenheit**. Write it in interval notation.`,
    answer: { type: 'interval', ...ans },
    hints: [`Unknown: the Fahrenheit temperature $F$. "Between … inclusive" means "and": $\\;${a} \\le \\dfrac{5}{9}(F - 32) \\le ${b}$.`, 'Multiply all three parts by $\\dfrac{9}{5}$, then add 32.'],
    solution: [`$${(9 * a) / 5} \\le F - 32 \\le ${(9 * b) / 5}$`, `$${lo} \\le F \\le ${hi}$, that is $${ivTex(ans)}$`],
    placeholder: '[41, 77]',
  };
}

export const skills: Skill[] = [
  { id: 'sets', label: 'Intersection and union of sets', generate: finiteSets },
  { id: 'combine', label: 'Intervals', generate: combine },
  { id: 'and', label: '"And" (conjunctions)', generate: conjunction },
  { id: 'or', label: '"Or" (disjunctions)', generate: disjunction },
  { id: 'apply', label: 'Word problems', generate: compoundWords },
];

export const masterySet = makeMasterySet(skills);
