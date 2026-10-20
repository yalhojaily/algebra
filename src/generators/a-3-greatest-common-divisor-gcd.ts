// Practice problem generators for Appendix A.3 — Greatest Common Divisor (GCD).
import { gcd, lcm, makeMasterySet, pick, randInt, shuffle } from './helpers';
import { powTex } from './a-2-least-common-multiple-lcm';
import type { Problem, Skill } from './types';

const divisors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

function listing(): Problem {
  for (;;) {
    const g = randInt(2, 8), a = g * randInt(1, 6), b = g * randInt(1, 6);
    if (a === b || a > 48 || b > 48) continue;
    const G = gcd(a, b);
    return {
      skill: 'list',
      prompt: `Find the GCD (greatest common divisor) of $${a}$ and $${b}$ by listing factors.`,
      answer: { type: 'number', value: G },
      hints: [`Factors of $${a}$: ${divisors(a).join(', ')}.`, `Factors of $${b}$: ${divisors(b).join(', ')}. Which is the **largest** number in both lists?`],
      solution: [`Common factors: ${divisors(a).filter((d) => b % d === 0).join(', ')}`, `The greatest is $${G}$.`],
    };
  }
}

function primes(): Problem {
  const pool = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 54, 56, 60, 72, 84, 90, 96, 108, 120];
  for (;;) {
    const [a, b] = shuffle(pool).slice(0, 2);
    const G = gcd(a, b);
    if (G === 1) continue;
    return {
      skill: 'prime',
      prompt: `Use prime factorization to find the GCD of $${a}$ and $${b}$.`,
      answer: { type: 'number', value: G },
      hints: [`$${a} = ${powTex(a)}$ and $${b} = ${powTex(b)}$.`, 'Take only the primes the numbers **share**, each to the **smaller** power.'],
      solution: [`$${a} = ${powTex(a)}$`, `$${b} = ${powTex(b)}$`, `GCD $= ${powTex(G)} = ${G}$`],
      mistakes: [{ answer: String(lcm(a, b)), feedback: 'That is the LCM. The GCD is the **largest number that divides both** — it can be no bigger than the smaller number.' }],
    };
  }
}

function simplify(): Problem {
  for (;;) {
    const g = randInt(2, 12), n = randInt(1, 9), d = randInt(2, 12);
    if (gcd(n, d) > 1 || n >= d) continue;
    const N = n * g, D = d * g;
    return {
      skill: 'simplify',
      prompt: `Use the GCD to reduce $\\;\\dfrac{${N}}{${D}}\\;$ to lowest terms.`,
      answer: { type: 'number', value: n / d, lowest: true },
      hints: [`GCD$(${N}, ${D}) = ${g}$.`, `Divide the numerator and the denominator by $${g}$.`],
      solution: [`$\\dfrac{${N} \\div ${g}}{${D} \\div ${g}} = \\dfrac{${n}}{${d}}$`],
      placeholder: '3/4',
    };
  }
}

function apply(): Problem {
  for (;;) {
    const g = pick([4, 5, 6, 8, 9, 12]), a = g * randInt(2, 7), b = g * randInt(2, 7);
    if (a === b || gcd(a, b) !== g) continue;
    const ctx = pick([
      `A teacher has ${a} pencils and ${b} erasers. She wants to make identical kits with no supplies left over. What is the greatest number of kits she can make?`,
      `A rectangular floor is ${a} cm by ${b} cm. What is the side length of the largest square tile that covers it exactly, with no cutting?`,
      `${a} boys and ${b} girls are split into teams, each with the same number of boys and the same number of girls. What is the greatest number of teams?`,
    ]);
    return {
      skill: 'apply',
      prompt: ctx,
      answer: { type: 'number', value: g },
      hints: ['"Greatest number of equal groups" or "largest piece that fits exactly" means the GCD.'],
      solution: [`GCD$(${a}, ${b}) = ${g}$`],
    };
  }
}

export const skills: Skill[] = [
  { id: 'list', label: 'Listing factors', generate: listing },
  { id: 'prime', label: 'Prime factorization', generate: primes },
  { id: 'simplify', label: 'Reduce fractions', generate: simplify },
  { id: 'apply', label: 'Word problems', generate: apply },
];

export const masterySet = makeMasterySet(skills);
