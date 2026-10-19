// Practice problem generators for Lesson 5.4 — Factoring ax² + bx + c, a ≠ 1: The ac-Method.
import { randomAC, V } from './5-3-factoring-ax-bx-c-a-1-the-foil-method';
import { factoredAnswer, factorPairs, makeMasterySet, par, parTex, Poly } from './helpers';
import type { Problem, Skill } from './types';

function acPair(): Problem {
  const v = V();
  const { P } = randomAC(v);
  const [a, b, c] = P.coefs(v);
  const ac = a * c;
  const pair = factorPairs(ac).find(([m, n]) => m + n === b)!;
  return {
    skill: 'pair',
    prompt: `To factor $\\;${P.tex()}\\;$ with the ac-method, find the two numbers whose product is $ac$ and whose sum is $b$. (Enter both, separated by a comma.)`,
    answer: { type: 'solutions', values: pair },
    hints: [`$ac = ${a} \\cdot ${c < 0 ? `(${c})` : c} = ${ac}$ and $b = ${b}$.`, `List factor pairs of $${ac}$ and look for the pair that adds to $${b}$.`],
    solution: [`$ac = ${ac}$. The pair is $${pair[0]}$ and $${pair[1]}$: product $${ac}$, sum $${b}$.`],
    placeholder: 'e.g. 9, -4',
  };
}

function acFactor(): Problem {
  const v = V();
  const { F1, F2, P } = randomAC(v);
  const [a, b, c] = P.coefs(v);
  const ac = a * c;
  const [m, n] = factorPairs(ac).find(([x, y]) => x + y === b)!;
  const t = (k: number, e: number) => Poly.mono(k, e ? { [v]: e } : {}).tex();
  const sgn = (k: number) => (k < 0 ? '-' : '+');
  return {
    skill: 'factor',
    prompt: `Factor using the ac-method: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${par(F1)}${par(F2)}`),
    hints: [
      `Multiply $a \\cdot c = ${ac}$. Find two numbers with product $${ac}$ and sum $${b}$: they are $${m}$ and $${n}$.`,
      `Split the middle term: $${t(a, 2)} ${sgn(m)} ${t(Math.abs(m), 1)} ${sgn(n)} ${t(Math.abs(n), 1)} ${sgn(c)} ${Math.abs(c)}$, then factor by grouping.`,
    ],
    solution: [
      `$ac = ${ac}$; the pair is $${m}$ and $${n}$.`,
      `$${t(a, 2)} ${sgn(m)} ${t(Math.abs(m), 1)} ${sgn(n)} ${t(Math.abs(n), 1)} ${sgn(c)} ${Math.abs(c)}$ — split the middle term`,
      'Group the first two and last two terms, and factor each group.',
      `$= ${parTex(F1)}${parTex(F2)}$`,
    ],
    placeholder: `(3${v} - 2)(2${v} + 5)`,
  };
}

export const skills: Skill[] = [
  { id: 'pair', label: 'Find the ac pair', generate: acPair },
  { id: 'factor', label: 'Factor with the ac-method', generate: acFactor },
];

export const masterySet = makeMasterySet(skills);
