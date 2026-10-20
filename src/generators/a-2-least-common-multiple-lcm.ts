// Practice problem generators for Appendix A.2 — Least Common Multiple (LCM).
import { lcm, makeMasterySet, pick, shuffle } from './helpers';
import type { Problem, Skill } from './types';

export function primeFactors(n: number) {
  const out: number[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out;
}
/** 2^3 · 3 · 5 style TeX */
export function powTex(n: number) {
  const ps = primeFactors(n);
  if (!ps.length) return '1';
  const counts = new Map<number, number>();
  ps.forEach((p) => counts.set(p, (counts.get(p) ?? 0) + 1));
  return [...counts].map(([p, k]) => (k > 1 ? `${p}^{${k}}` : String(p))).join(' \\cdot ');
}

function listing(): Problem {
  const [a, b] = shuffle([2, 3, 4, 5, 6, 8, 9, 10]).slice(0, 2);
  const L = lcm(a, b);
  const mult = (n: number) => Array.from({ length: Math.min(8, L / n + 2) }, (_, i) => n * (i + 1)).join(', ');
  return {
    skill: 'list',
    prompt: `Find the LCM of $${a}$ and $${b}$ by listing multiples.`,
    answer: { type: 'number', value: L },
    hints: [`Multiples of $${a}$: ${mult(a)}, …`, `Multiples of $${b}$: ${mult(b)}, … Which is the first number in **both** lists?`],
    solution: [`Multiples of ${a}: ${mult(a)}`, `Multiples of ${b}: ${mult(b)}`, `The smallest common multiple is $${L}$.`],
    mistakes: [{ answer: String(a * b), feedback: a * b === L ? '' : `$${a * b}$ is a common multiple, but there is a smaller one.` }].filter((m) => m.feedback),
  };
}

function primes(): Problem {
  const pool = [12, 15, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 54, 60, 72, 84, 90];
  for (;;) {
    const [a, b] = shuffle(pool).slice(0, 2);
    const L = lcm(a, b);
    if (L === a * b) continue;
    return {
      skill: 'prime',
      prompt: `Use prime factorization to find the LCM of $${a}$ and $${b}$.`,
      answer: { type: 'number', value: L },
      hints: [`$${a} = ${powTex(a)}$ and $${b} = ${powTex(b)}$.`, 'Take each prime the **greatest** number of times it appears in either factorization.'],
      solution: [`$${a} = ${powTex(a)}$`, `$${b} = ${powTex(b)}$`, `LCM $= ${powTex(L)} = ${L}$`],
      mistakes: [{ answer: String(a * b), feedback: 'Multiplying the two numbers gives a common multiple, but not the **least** one: shared primes get counted twice.' }],
    };
  }
}

function three(): Problem {
  const [a, b, c] = shuffle([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]).slice(0, 3);
  const L = lcm(a, b, c);
  return {
    skill: 'three',
    prompt: `Find the LCM of $${a}$, $${b}$ and $${c}$.`,
    answer: { type: 'number', value: L },
    hints: [`Factor each: $${a} = ${powTex(a)}$, $${b} = ${powTex(b)}$, $${c} = ${powTex(c)}$.`, 'Use every prime that appears, each to its highest power.'],
    solution: [`LCM $= ${powTex(L)} = ${L}$`],
  };
}

function apply(): Problem {
  const ctx = pick([
    { t: (a: number, b: number) => `One bus leaves the station every ${a} minutes and another every ${b} minutes. They both leave at 8:00. After how many minutes do they next leave together?`, a: [10, 12, 15, 20], b: [6, 8, 9, 18] },
    { t: (a: number, b: number) => `Hot dogs come in packs of ${a} and buns in packs of ${b}. What is the smallest number of each you can buy so they match exactly?`, a: [8, 10, 12], b: [6, 8, 9] },
    { t: (a: number, b: number) => `Two lights blink every ${a} and every ${b} seconds. They just blinked together. After how many seconds will they blink together again?`, a: [4, 6, 9], b: [10, 14, 15] },
  ]);
  let a = pick(ctx.a), b = pick(ctx.b);
  if (a === b) b += 1;
  const L = lcm(a, b);
  return {
    skill: 'apply',
    prompt: ctx.t(a, b),
    answer: { type: 'number', value: L },
    hints: ['"Next time together" means the smallest number that is a multiple of **both** — the LCM.'],
    solution: [`LCM$(${a}, ${b}) = ${L}$`],
  };
}

export const skills: Skill[] = [
  { id: 'list', label: 'Listing multiples', generate: listing },
  { id: 'prime', label: 'Prime factorization', generate: primes },
  { id: 'three', label: 'Three numbers', generate: three },
  { id: 'apply', label: 'Word problems', generate: apply },
];

export const masterySet = makeMasterySet(skills);
