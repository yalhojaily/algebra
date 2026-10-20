// Practice problem generators for Lesson 9.3 — Absolute-Value Equations and Inequalities.
import { choice, makeMasterySet, nz, pick, randInt, termTex } from './helpers';
import { iv, ivsTex, ivTex, numTex } from './sets';
import type { Problem, Skill } from './types';

const inner = (a: number, b: number) => `${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;

function equation(): Problem {
  for (;;) {
    const a = pick([1, 1, 2, 3, -2]), b = nz(9), c = randInt(1, 12);
    const r1 = (c - b) / a, r2 = (-c - b) / a;
    if (!Number.isInteger(r1 * 2) || !Number.isInteger(r2 * 2)) continue;
    return {
      skill: 'equation',
      prompt: `Solve: $\\;|${inner(a, b)}| = ${c}$`,
      answer: { type: 'solutions', values: [r1, r2], variable: 'x' },
      hints: [`$|X| = ${c}$ means $X = ${c}$ or $X = -${c}$ — the expression inside is ${c} units from 0.`],
      solution: [`$${inner(a, b)} = ${c}$ or $${inner(a, b)} = -${c}$`, `$x = ${numTex(r1)}$ or $x = ${numTex(r2)}$`],
      mistakes: [{ answer: Number.isInteger(r1) ? String(r1) : `${r1 * 2}/2`, feedback: `That is one solution. An absolute value equation like this has **two**: also solve $${inner(a, b)} = -${c}$.` }],
      placeholder: 'x = 2 or x = -5',
    };
  }
}

function special(): Problem {
  const a = randInt(1, 3), b = nz(8);
  const kind = pick(['neg', 'zero', 'two'] as const);
  const c = kind === 'neg' ? -randInt(1, 9) : kind === 'zero' ? 0 : randInt(1, 9);
  const label = kind === 'neg' ? 'No solution' : kind === 'zero' ? 'Exactly one solution' : 'Two solutions';
  return {
    skill: 'special',
    prompt: `How many solutions does $\\;|${inner(a, b)}| = ${c}\\;$ have?`,
    answer: choice(label, ['No solution', 'Exactly one solution', 'Two solutions'].filter((x) => x !== label)),
    hints: ['An absolute value is a distance, so it is never negative. Only $0$ is its own opposite.'],
    solution: [kind === 'neg' ? `An absolute value can never equal a negative number like $${c}$: **no solution**.` : kind === 'zero' ? `$|X| = 0$ only when $X = 0$: **one solution**, $x = ${numTex(-b / a)}$.` : `$X = ${c}$ or $X = -${c}$ give **two solutions**.`],
  };
}

function lessThan(): Problem {
  const h = nz(7), d = randInt(1, 8), closed = Math.random() < 0.5;
  // |x − h| < d  →  h − d < x < h + d
  const ans = iv(h - d, h + d, closed, closed);
  return {
    skill: 'less',
    prompt: `Solve and write in interval notation: $\\;|x ${h < 0 ? '+' : '-'} ${Math.abs(h)}| ${closed ? '\\le' : '<'} ${d}$`,
    answer: { type: 'interval', ...ans },
    hints: [`$|X| ${closed ? '\\le' : '<'} ${d}$ means $-${d} ${closed ? '\\le' : '<'} X ${closed ? '\\le' : '<'} ${d}$: the distance from ${numTex(h)} is less than ${d}.`],
    solution: [`$-${d} ${closed ? '\\le' : '<'} x ${h < 0 ? '+' : '-'} ${Math.abs(h)} ${closed ? '\\le' : '<'} ${d}$`, `$${h - d} ${closed ? '\\le' : '<'} x ${closed ? '\\le' : '<'} ${h + d}$`, `$${ivTex(ans)}$`],
    placeholder: '(-1, 7)',
  };
}

function greaterThan(): Problem {
  for (;;) {
    const a = pick([1, 2, 3]), b = nz(8), c = randInt(1, 9), closed = Math.random() < 0.5;
    const r1 = (-c - b) / a, r2 = (c - b) / a;
    if (!Number.isInteger(r1) || !Number.isInteger(r2)) continue;
    const parts = [iv(-Infinity, r1, false, closed), iv(r2, Infinity, closed, false)];
    return {
      skill: 'greater',
      prompt: `Solve and write in interval notation: $\\;|${inner(a, b)}| ${closed ? '\\ge' : '>'} ${c}$ (Type U for ∪.)`,
      answer: { type: 'intervals', parts },
      hints: [`$|X| ${closed ? '\\ge' : '>'} ${c}$ means $X ${closed ? '\\le' : '<'} -${c}$ **or** $X ${closed ? '\\ge' : '>'} ${c}$ — far from 0 in either direction.`],
      solution: [`$${inner(a, b)} ${closed ? '\\le' : '<'} -${c}$ or $${inner(a, b)} ${closed ? '\\ge' : '>'} ${c}$`, `$x ${closed ? '\\le' : '<'} ${r1}$ or $x ${closed ? '\\ge' : '>'} ${r2}$`, `$${ivsTex(parts)}$`],
      mistakes: [{ answer: `${closed ? '[' : '('}${r1}, ${r2}${closed ? ']' : ')'}`, feedback: 'That is the set of numbers **close** to the center. "Greater than" means **far** from it: two separate pieces.' }],
      placeholder: '(-inf, -3] U [5, inf)',
    };
  }
}

function twoAbs(): Problem {
  for (;;) {
    const a = randInt(1, 3), b = nz(8), c = randInt(1, 3), d = nz(8);
    if (a === c) continue;
    // ax + b = cx + d  or  ax + b = −(cx + d)
    const r1 = (d - b) / (a - c), r2 = (-d - b) / (a + c);
    if (!Number.isInteger(r1) || !Number.isInteger(r2) || r1 === r2) continue;
    return {
      skill: 'two',
      prompt: `Solve: $\\;|${inner(a, b)}| = |${inner(c, d)}|$`,
      answer: { type: 'solutions', values: [r1, r2], variable: 'x' },
      hints: ['Two absolute values are equal when the insides are **equal** or **opposites**.'],
      solution: [`$${inner(a, b)} = ${inner(c, d)}$ gives $x = ${r1}$`, `$${inner(a, b)} = -(${inner(c, d)})$ gives $x = ${r2}$`],
      placeholder: 'x = 1 or x = -3',
    };
  }
}

export const skills: Skill[] = [
  { id: 'equation', label: '|X| = c', generate: equation },
  { id: 'special', label: 'How many solutions?', generate: special },
  { id: 'less', label: '|X| < c', generate: lessThan },
  { id: 'greater', label: '|X| > c', generate: greaterThan },
  { id: 'two', label: '|A| = |B|', generate: twoAbs },
];

export const masterySet = makeMasterySet(skills);
