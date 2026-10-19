// Practice problem generators for Lesson 4.5 — Multiplication of Polynomials.
import { makeMasterySet, nz, pick, Poly, randInt, randPoly } from './helpers';
import type { Problem, Skill } from './types';

const ans = (P: Poly) => ({ type: 'expression' as const, value: P.text(), maxTerms: Math.max(1, P.size) });
const V = () => pick(['x', 'y', 'a', 't']);

function monomials(): Problem {
  const v = V();
  const A = Poly.mono(nz(9), { [v]: randInt(1, 6) });
  const B = Poly.mono(nz(9), { [v]: randInt(0, 6) });
  const R = A.mul(B);
  return {
    skill: 'monomials',
    prompt: `Multiply: $\\;(${A.tex()})(${B.tex()})$`,
    answer: ans(R),
    hints: ['Multiply the coefficients. Multiply the variable parts by **adding** exponents.'],
    solution: [`$= ${R.tex()}$`],
    placeholder: `e.g. -12${v}^7`,
  };
}

function monoTimesPoly(): Problem {
  const v = V();
  const M = Poly.mono(nz(6), { [v]: randInt(1, 3) });
  const P = randPoly(randInt(1, 3), v, 7, 0.2);
  const R = M.mul(P);
  return {
    skill: 'distribute',
    prompt: `Multiply: $\\;${M.tex()}(${P.tex()})$`,
    answer: ans(R),
    hints: ['Use the distributive law: multiply the monomial by **each** term inside.'],
    solution: [`$= ${P.ordered().map(([c, vv]) => `(${M.tex()})(${Poly.mono(c, vv).tex()})`).join(' + ')}$`, `$= ${R.tex()}$`],
    placeholder: 'e.g. 6x^3 - 15x^2',
  };
}

function binomials(): Problem {
  const v = V();
  const A = Poly.fromCoefs([nz(5), nz(9)], v);
  const B = Poly.fromCoefs([nz(5), nz(9)], v);
  const R = A.mul(B);
  const [a, b] = A.coefs(v);
  return {
    skill: 'binomials',
    prompt: `Multiply: $\\;(${A.tex()})(${B.tex()})$`,
    answer: ans(R),
    hints: ['Multiply each term of the first binomial by each term of the second (4 products), then collect like terms.'],
    solution: [
      `$= ${Poly.mono(a, { [v]: 1 }).tex()}(${B.tex()}) + ${b < 0 ? `(${b})` : b}(${B.tex()})$`,
      `$= (${Poly.mono(a, { [v]: 1 }).mul(B).tex()}) + (${Poly.const(b).mul(B).tex()})$`,
      `$= ${R.tex()}$`,
    ],
    mistakes: [{ answer: Poly.mono(a * B.coefs(v)[0], { [v]: 2 }).add(Poly.const(b * B.coefs(v)[1])).text(), feedback: 'You multiplied only the first terms and the last terms. Every term must multiply every other term — the two middle products are missing.' }],
    placeholder: `e.g. 6${v}^2 + ${v} - 15`,
  };
}

function polyTimesPoly(): Problem {
  const v = V();
  const A = Poly.fromCoefs([nz(4), nz(6)], v);
  const B = randPoly(2, v, 5, 0.15);
  const R = A.mul(B);
  return {
    skill: 'general',
    prompt: `Multiply: $\\;(${A.tex()})(${B.tex()})$`,
    answer: ans(R),
    hints: ['Multiply each term of the binomial by **every** term of the trinomial (6 products). A table (box) keeps it organized.', 'Then collect like terms.'],
    solution: A.ordered().map(([c, vv]) => `$${Poly.mono(c, vv).tex()} \\cdot (${B.tex()}) = ${Poly.mono(c, vv).mul(B).tex()}$`).concat([`Sum: $${R.tex()}$`]),
    placeholder: 'e.g. 2x^3 - x^2 + 4x - 6',
  };
}

export const skills: Skill[] = [
  { id: 'monomials', label: 'Monomials', generate: monomials },
  { id: 'distribute', label: 'Monomial × polynomial', generate: monoTimesPoly },
  { id: 'binomials', label: 'Two binomials', generate: binomials },
  { id: 'general', label: 'Any two polynomials', generate: polyTimesPoly },
];

export const masterySet = makeMasterySet(skills);
