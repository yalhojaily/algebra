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

export const skills: Skill[] = [
  { id: 'sets', label: 'Intersection and union of sets', generate: finiteSets },
  { id: 'combine', label: 'Intervals', generate: combine },
  { id: 'and', label: '"And" (conjunctions)', generate: conjunction },
  { id: 'or', label: '"Or" (disjunctions)', generate: disjunction },
];

export const masterySet = makeMasterySet(skills);
