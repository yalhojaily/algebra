// Practice problem generators for Lesson 8.4 — Solving Applied Problems: Two Equations.
import { fmt, makeMasterySet, pick, randInt } from './helpers';
import { systemTex } from './systems';
import type { Problem, Skill } from './types';

function tickets(): Problem {
  const pa = pick([8, 10, 12, 15]), pc = pick([4, 5, 6]);
  const A = randInt(40, 160), C = randInt(30, 140);
  const n = A + C, total = pa * A + pc * C;
  const ask = pick(['adult', 'child'] as const);
  return {
    skill: 'tickets',
    prompt: `A theater sold ${n} tickets for a total of $${total}$ dollars. Adult tickets cost ${pa} dollars and child tickets cost ${pc} dollars. How many **${ask}** tickets were sold?`,
    answer: { type: 'number', value: ask === 'adult' ? A : C },
    hints: [`Let $a$ = adult tickets and $c$ = child tickets. One equation counts **tickets**, the other counts **money**.`, `$\\;${systemTex([`a + c = ${n}`, `${pa}a + ${pc}c = ${total}`])}$`],
    solution: [`$${systemTex([`a + c = ${n}`, `${pa}a + ${pc}c = ${total}`])}$`, `Multiply the first by $-${pc}$ and add: $${pa - pc}a = ${total - pc * n}$, so $a = ${A}$.`, `$c = ${n} - ${A} = ${C}$`],
  };
}

function mixture(): Problem {
  const [p1, p2] = pick([[10, 40], [20, 50], [5, 25], [15, 45], [30, 60]]);
  const x = 5 * randInt(2, 12), y = 5 * randInt(2, 12);
  const T = x + y;
  const conc = (p1 * x + p2 * y) / T;
  if (!Number.isInteger(conc * 10)) return mixture();
  const ask = pick(['first', 'second'] as const);
  return {
    skill: 'mixture',
    prompt: `A chemist mixes a ${p1}% acid solution with a ${p2}% acid solution to make ${T} L of a ${fmt(conc)}% solution. How many liters of the **${ask === 'first' ? `${p1}%` : `${p2}%`}** solution are used?`,
    answer: { type: 'number', value: ask === 'first' ? x : y },
    hints: ['Let $x$ = liters of the first solution and $y$ = liters of the second. One equation counts **liters of liquid**, the other counts **liters of acid**.', `Acid: $${p1 / 100}x + ${p2 / 100}y = ${fmt(conc / 100)} \\cdot ${T}$`],
    solution: [`$${systemTex([`x + y = ${T}`, `${p1 / 100}x + ${p2 / 100}y = ${fmt((conc / 100) * T)}`])}$`, `Multiply the acid equation by $100$: $${p1}x + ${p2}y = ${fmt(conc * T)}$. Then eliminate: $x = ${x}$, $y = ${y}$.`],
  };
}

function motion(): Problem {
  const boat = randInt(10, 24), cur = randInt(2, 6), tt = randInt(2, 4);
  const down = (boat + cur) * tt, up = (boat - cur) * tt;
  const ask = pick(['boat', 'current'] as const);
  return {
    skill: 'motion',
    prompt: `A boat travels ${down} km downstream in ${tt} hours and ${up} km upstream in ${tt} hours. What is the ${ask === 'boat' ? "boat's speed in still water" : 'speed of the current'} (km/h)?`,
    answer: { type: 'number', value: ask === 'boat' ? boat : cur },
    hints: ['Let $b$ = boat speed in still water and $c$ = speed of the current. Downstream speed is $b + c$; upstream speed is $b - c$.', `$\\;${systemTex([`${tt}(b + c) = ${down}`, `${tt}(b - c) = ${up}`])}$`],
    solution: [`Divide by $${tt}$: $b + c = ${boat + cur}$ and $b - c = ${boat - cur}$`, `Add: $2b = ${2 * boat}$, so $b = ${boat}$ km/h; then $c = ${cur}$ km/h.`],
  };
}

function numbers(): Problem {
  const a = randInt(-20, 40), b = randInt(-20, 40);
  if (a === b) return numbers();
  const [big, small] = a > b ? [a, b] : [b, a];
  const ask = pick(['larger', 'smaller'] as const);
  return {
    skill: 'numbers',
    prompt: `The sum of two numbers is ${big + small} and their difference (larger minus smaller) is ${big - small}. What is the **${ask}** number?`,
    answer: { type: 'number', value: ask === 'larger' ? big : small },
    hints: ['Let $x$ be the larger number and $y$ the smaller: $x + y = ' + (big + small) + '$, $x - y = ' + (big - small) + '$.', 'Add the equations.'],
    solution: [`$2x = ${2 * big}$, so $x = ${big}$; then $y = ${small}$.`],
  };
}

export const skills: Skill[] = [
  { id: 'numbers', label: 'Number problems', generate: numbers },
  { id: 'tickets', label: 'Totals and values', generate: tickets },
  { id: 'mixture', label: 'Mixtures', generate: mixture },
  { id: 'motion', label: 'Motion', generate: motion },
];

export const masterySet = makeMasterySet(skills);
