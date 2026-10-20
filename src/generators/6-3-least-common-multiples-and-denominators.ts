// Practice problem generators for Lesson 6.3 — Least Common Multiples and Denominators.
import { dfrac, ftex, lcm, makeMasterySet, monicFactors, pick, Poly, randInt, shuffle } from './helpers';
import type { Problem, Skill } from './types';

function primeTex(n: number) {
  const out: number[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out.join(' \\cdot ');
}

function lcmNumbers(): Problem {
  const pool = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 28, 30, 36, 45];
  const ns = shuffle(pool).slice(0, pick([2, 2, 3])).sort((a, b) => a - b);
  const L = lcm(...ns);
  return {
    skill: 'lcm',
    prompt: `Find the least common multiple (LCM) of $${ns.join(',\\ ')}$.`,
    answer: { type: 'number', value: L },
    hints: ['Write each number as a product of primes.', 'The LCM uses each prime the **greatest** number of times it appears in any one factorization.'],
    solution: [...ns.map((n) => `$${n} = ${primeTex(n)}$`), `LCM $= ${primeTex(L)} = ${L}$`],
    mistakes: [{ answer: String(ns.reduce((a, b) => a * b)), feedback: 'Multiplying the numbers gives a common multiple, but not the **least** one.' }],
  };
}

function lcmMonomials(): Problem {
  const a = pick([4, 6, 8, 9, 10, 12, 15]), b = pick([4, 6, 8, 9, 10, 12, 15, 18]);
  const [p, q] = [randInt(1, 4), randInt(0, 3)];
  const [r, s] = [randInt(1, 4), randInt(1, 3)];
  const M1 = Poly.mono(a, { x: p, y: q }), M2 = Poly.mono(b, { x: r, y: s });
  const L = Poly.mono(lcm(a, b), { x: Math.max(p, r), y: Math.max(q, s) });
  return {
    skill: 'monomial',
    prompt: `Find the LCM of $\\;${M1.tex()}\\;$ and $\\;${M2.tex()}$.`,
    answer: { type: 'expression', value: L.text() },
    hints: [`The number part is the LCM of $${a}$ and $${b}$, which is $${lcm(a, b)}$.`, 'For each variable, use the **highest** power that appears.'],
    solution: [`LCM of $${a}$ and $${b}$: $${lcm(a, b)}$`, `Highest powers: $x^{${Math.max(p, r)}}$${Math.max(q, s) ? `, $y^{${Math.max(q, s)}}$` : ''}`, `LCM $= ${L.tex()}$`],
    placeholder: '24x^3y^2',
  };
}

function lcd(): Problem {
  const [A, B, C] = monicFactors(3);
  const squared = Math.random() < 0.4;
  const D1 = A.mul(B);
  const D2 = squared ? B.mul(B) : B.mul(C);
  const L = squared ? A.mul(B).mul(B) : A.mul(B).mul(C);
  const n1 = randInt(1, 7), n2 = randInt(1, 7);
  return {
    skill: 'lcd',
    prompt: `Find the least common denominator (LCD) of $\\;${dfrac(String(n1), D1.tex())}\\;$ and $\\;${dfrac(String(n2), D2.tex())}$. (You may leave it factored.)`,
    answer: { type: 'expression', value: L.text() },
    hints: ['Factor each denominator.', `Use each factor the greatest number of times it appears in any one denominator.`],
    solution: [`$${D1.tex()} = ${ftex(D1)}$`, `$${D2.tex()} = ${ftex(D2)}$`, `LCD $= ${ftex(L)}$`],
    mistakes: [{ answer: `(${D1.text()})(${D2.text()})`, feedback: 'That is a common denominator, but not the **least** one — a factor is repeated more times than it needs to be.' }],
    placeholder: '(x + 1)(x - 2)^2',
  };
}

function rename(): Problem {
  const [A, B] = monicFactors(2);
  const k = randInt(1, 9);
  const L = A.mul(B);
  const top = B.scale(k);
  return {
    skill: 'rename',
    prompt: `Fill in the missing numerator: $\\;${dfrac(String(k), A.tex())} = ${dfrac('?', `(${A.tex()})(${B.tex()})`)}$`,
    answer: { type: 'expression', value: top.text() },
    hints: [`The denominator was multiplied by $(${B.tex()})$. Multiply the numerator by the same factor.`],
    solution: [`$${dfrac(String(k), A.tex())} \\cdot ${dfrac(`${B.tex()}`, `${B.tex()}`)} = ${dfrac(`${k === 1 ? '' : k}(${B.tex()})`, ftex(L))}$`, `Missing numerator: $${top.tex()}$`],
    placeholder: '3x + 6',
  };
}

export const skills: Skill[] = [
  { id: 'lcm', label: 'LCM of numbers', generate: lcmNumbers },
  { id: 'monomial', label: 'LCM of monomials', generate: lcmMonomials },
  { id: 'lcd', label: 'LCD of rational expressions', generate: lcd },
  { id: 'rename', label: 'Rename with the LCD', generate: rename },
];

export const masterySet = makeMasterySet(skills);
