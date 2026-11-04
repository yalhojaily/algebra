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


/** Tolerance word problems: |x − target| ≤ tolerance. */
function tolerance(): Problem {
  const kind = pick(['part', 'poll', 'oven'] as const);
  if (kind === 'poll') {
    const p = randInt(35, 65), m = pick([2, 3, 4]);
    const ans = iv(p - m, p + m, true, true);
    return {
      skill: 'apply',
      prompt: `A poll says ${p}% of voters support a plan, with a margin of error of ${m} percentage points. So the true support $s$ satisfies $|s - ${p}| \\le ${m}$. Write the possible values of $s$ in interval notation.`,
      answer: { type: 'interval', ...ans },
      hints: ['Unknown: the true support $s$. "Within the margin of error" means the distance from ' + p + ' is at most ' + m + ': a **less-than** absolute value, so one interval.', `$-${m} \\le s - ${p} \\le ${m}$`],
      solution: [`$-${m} \\le s - ${p} \\le ${m}$`, `$${p - m} \\le s \\le ${p + m}$, that is $${ivTex(ans)}$`],
      placeholder: '[49, 55]',
    };
  }
  if (kind === 'oven') {
    const T = pick([180, 200, 220, 250]), d = pick([5, 10, 15]);
    const ans = iv(T - d, T + d, true, true);
    return {
      skill: 'apply',
      prompt: `An oven set to ${T}°C stays within ${d}°C of the setting. Write an interval for the possible temperatures $t$, using $|t - ${T}| \\le ${d}$.`,
      answer: { type: 'interval', ...ans },
      hints: [`Unknown: the temperature $t$. "Within ${d} of ${T}" is a distance: $|t - ${T}| \\le ${d}$, so $-${d} \\le t - ${T} \\le ${d}$.`],
      solution: [`$${T - d} \\le t \\le ${T + d}$, that is $${ivTex(ans)}$`],
      placeholder: '[190, 210]',
    };
  }
  const L = pick([25, 40, 50, 75, 120]), t = pick([0.1, 0.2, 0.25, 0.5]);
  const lo = +(L - t).toFixed(2), hi = +(L + t).toFixed(2);
  const ans = iv(lo, hi, true, true);
  const out = Math.random() < 0.4;
  if (out) {
    const parts = [iv(-Infinity, lo, false, false), iv(hi, Infinity, false, false)];
    return {
      skill: 'apply',
      prompt: `A bolt should be ${L} mm long. A bolt is **rejected** if $|x - ${L}| > ${t}$, where $x$ is its length. Which lengths are rejected? Write the set in interval notation.`,
      answer: { type: 'intervals', parts },
      hints: [`Unknown: the length $x$. A **greater-than** absolute value gives two pieces ("or"): too short **or** too long.`, `$x - ${L} < -${t}$ or $x - ${L} > ${t}$`],
      solution: [`$x < ${lo}$ or $x > ${hi}$`, `$(-\\infty, ${lo}) \\cup (${hi}, \\infty)$`],
      placeholder: '(-inf, 49.8) U (50.2, inf)',
    };
  }
  return {
    skill: 'apply',
    prompt: `A bolt must be ${L} mm long, with a tolerance of ${t} mm: its length $x$ must satisfy $|x - ${L}| \\le ${t}$. Which lengths are accepted? Write the set in interval notation.`,
    answer: { type: 'interval', ...ans },
    hints: [`Unknown: the length $x$. A **less-than** absolute value gives one interval ("and"): $-${t} \\le x - ${L} \\le ${t}$.`],
    solution: [`$-${t} \\le x - ${L} \\le ${t}$`, `$${lo} \\le x \\le ${hi}$, that is $[${lo}, ${hi}]$`],
    placeholder: '[49.8, 50.2]',
  };
}

export const skills: Skill[] = [
  { id: 'equation', label: '|X| = c', generate: equation },
  { id: 'special', label: 'How many solutions?', generate: special },
  { id: 'less', label: '|X| < c', generate: lessThan },
  { id: 'greater', label: '|X| > c', generate: greaterThan },
  { id: 'two', label: '|A| = |B|', generate: twoAbs },
  { id: 'apply', label: 'Word problems', generate: tolerance },
];

export const masterySet = makeMasterySet(skills);
