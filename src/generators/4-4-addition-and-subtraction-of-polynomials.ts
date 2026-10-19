// Practice problem generators for Lesson 4.4 — Addition and Subtraction of Polynomials.
import { makeMasterySet, pick, Poly, randInt, randPoly } from './helpers';
import type { Problem, Skill } from './types';

const ans = (P: Poly) => ({ type: 'expression' as const, value: P.text(), maxTerms: Math.max(1, P.size) });

function add(): Problem {
  const A = randPoly(randInt(2, 3), 'x', 9, 0.3);
  const B = randPoly(randInt(1, 3), 'x', 9, 0.3);
  const S = A.add(B);
  return {
    skill: 'add',
    prompt: `Add: $\\;(${A.tex()}) + (${B.tex()})$`,
    answer: ans(S),
    hints: ['Remove the parentheses (nothing changes with a + in front), then collect like terms.', 'Line up terms with the same power of $x$ if it helps.'],
    solution: [`Collect like terms: $${S.tex()}$`],
    placeholder: 'e.g. 3x^2 - x + 4',
  };
}

function opposite(): Problem {
  const A = randPoly(randInt(2, 4), pick(['x', 'y', 'a']), 9, 0.3);
  const O = A.neg();
  return {
    skill: 'opposite',
    prompt: `Write the opposite of the polynomial: $\\;-(${A.tex()})$`,
    answer: ans(O),
    hints: ['Change the sign of **every** term.'],
    solution: [`$-(${A.tex()}) = ${O.tex()}$`],
    placeholder: 'e.g. -2x^3 + 5x - 1',
  };
}

function subtract(): Problem {
  const A = randPoly(randInt(2, 3), 'x', 9, 0.3);
  const B = randPoly(randInt(1, 3), 'x', 9, 0.3);
  const D = A.sub(B);
  // Common slip: changing the sign of only the first term of B.
  const [first, ...rest] = B.ordered();
  const slip = A.sub(Poly.mono(first[0], first[1])).add(B.sub(Poly.mono(first[0], first[1])));
  return {
    skill: 'subtract',
    prompt: `Subtract: $\\;(${A.tex()}) - (${B.tex()})$`,
    answer: ans(D),
    hints: ['Subtracting a polynomial = adding its **opposite**. Change the sign of **every** term in the second polynomial.', 'Then collect like terms.'],
    solution: [`$= ${A.tex()} + (${B.neg().tex()})$ — add the opposite`, `$= ${D.tex()}$`],
    mistakes: rest.length ? [{ answer: slip.text(), feedback: 'It looks like only the **first** term of the second polynomial changed sign. The minus sign applies to **every** term.' }] : [],
    placeholder: 'e.g. 2x^2 + 3x - 8',
  };
}

function perimeter(): Problem {
  const sides = Array.from({ length: randInt(3, 4) }, () => randPoly(1, 'x', 6, 0).add(randPoly(0, 'x', 9, 0)));
  // make leading coefficients positive (lengths)
  const fixed = sides.map((s) => (s.leading()[0] < 0 ? s.neg() : s));
  const P = fixed.reduce((a, b) => a.add(b));
  return {
    skill: 'apply',
    prompt: `A ${fixed.length === 3 ? 'triangle' : 'four-sided figure'} has sides of lengths ${fixed.map((s) => `$${s.tex()}$`).join(', ')}. Write a polynomial for its perimeter.`,
    answer: ans(P),
    hints: ['Perimeter = the sum of all the side lengths.'],
    solution: [`$${fixed.map((s) => `(${s.tex()})`).join(' + ')} = ${P.tex()}$`],
    placeholder: 'e.g. 9x + 4',
  };
}

export const skills: Skill[] = [
  { id: 'add', label: 'Add', generate: add },
  { id: 'opposite', label: 'Opposites', generate: opposite },
  { id: 'subtract', label: 'Subtract', generate: subtract },
  { id: 'apply', label: 'Perimeter', generate: perimeter },
];

export const masterySet = makeMasterySet(skills);
