// Practice problem generators for Lesson 4.8 — Division of Polynomials.
import { longDivide } from '../lib/poly';
import { makeMasterySet, nz, pick, Poly, randInt, randPoly } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 'a']);

function byMonomial(): Problem {
  const v = V();
  const m = Poly.mono(nz(6, 2), { [v]: randInt(1, 2) });
  const Q = randPoly(randInt(1, 3), v, 6, 0.2);
  // keep the quotient a polynomial: every term of Q has exponent ≥ 0 by construction
  const D = Q.mul(m);
  return {
    skill: 'monomial',
    prompt: `Divide: $\\;\\dfrac{${D.tex()}}{${m.tex()}}$`,
    answer: { type: 'expression', value: Q.text(), maxTerms: Q.size },
    hints: ['Divide **each term** of the numerator by the monomial: divide the coefficients and subtract exponents.'],
    solution: [`$= ${D.ordered().map(([c, vv]) => `\\dfrac{${Poly.mono(c, vv).tex()}}{${m.tex()}}`).join(' + ')}$`, `$= ${Q.tex()}$`],
    placeholder: `e.g. 3${v}^2 - 2${v} + 5`,
  };
}

function stepsTex(D: Poly, d: Poly, v: string) {
  const r = longDivide(D, d, v);
  return r.steps.map(
    (s) => `$${s.term.tex()}$: multiply $${s.term.tex()}(${d.tex()}) = ${s.product.tex()}$, subtract → $${s.remainder.tex()}$`,
  );
}

function longNoRemainder(): Problem {
  const v = V();
  const d = Poly.fromCoefs([1, nz(7)], v);
  const Q = Poly.fromCoefs([nz(4), nz(8), ...(Math.random() < 0.4 ? [nz(8)] : [])], v);
  const D = Q.mul(d);
  return {
    skill: 'long',
    prompt: `Divide: $\\;(${D.tex()}) \\div (${d.tex()})$`,
    answer: { type: 'expression', value: Q.text(), maxTerms: Q.size },
    hints: [
      'Use long division. Divide the **first term** of what is left by the first term of the divisor, multiply, subtract, bring down. Repeat.',
      `First step: $\\dfrac{${D.leading()[0] === 1 ? '' : D.leading()[0]}${v}^{${D.degreeIn(v)}}}{${v}} = ${Poly.mono(D.leading()[0], { [v]: D.degreeIn(v) - 1 }).tex()}$.`,
    ],
    solution: [...stepsTex(D, d, v), `Quotient: $${Q.tex()}$, remainder $0$.`],
    placeholder: `e.g. 2${v} - 5`,
  };
}

function longRemainder(): Problem {
  const v = V();
  const d = Poly.fromCoefs([1, nz(6)], v);
  const Q = Poly.fromCoefs([nz(4), nz(8)], v);
  const r = nz(9);
  const D = Q.mul(d).add(Poly.const(r));
  return {
    skill: 'remainder',
    prompt: `Divide: $\\;(${D.tex()}) \\div (${d.tex()})$. Write the answer as quotient + $\\dfrac{\\text{remainder}}{\\text{divisor}}$.`,
    answer: { type: 'expression', value: `${Q.text()} + ${r}/(${d.text()})` },
    hints: ['Divide as usual. When the remainder has a lower degree than the divisor, stop.', `Write the answer as $Q + \\dfrac{R}{${d.tex()}}$.`],
    solution: [...stepsTex(D, d, v), `$= ${Q.tex()} ${r < 0 ? '-' : '+'} \\dfrac{${Math.abs(r)}}{${d.tex()}}$`],
    placeholder: `e.g. 2${v} + 3 + 5/(${v} - 1)`,
  };
}

function missingTerm(): Problem {
  const v = 'x';
  const k = pick([1, 2, 3, 4, 5]);
  const d = Poly.fromCoefs([1, -k], v);
  const D = Poly.fromCoefs([1, 0, 0, -(k ** 3)], v); // x^3 - k^3
  const Q = Poly.fromCoefs([1, k, k * k], v);
  return {
    skill: 'missing',
    prompt: `Divide: $\\;(${D.tex()}) \\div (${d.tex()})$`,
    answer: { type: 'expression', value: Q.text(), maxTerms: 3 },
    hints: [`Write the missing terms with zero coefficients: $x^3 + 0x^2 + 0x - ${k ** 3}$. Then divide as usual.`],
    solution: [...stepsTex(D, d, v), `Quotient: $${Q.tex()}$`],
    placeholder: 'e.g. x^2 + 2x + 4',
  };
}

export const skills: Skill[] = [
  { id: 'monomial', label: 'Divide by a monomial', generate: byMonomial },
  { id: 'long', label: 'Long division', generate: longNoRemainder },
  { id: 'remainder', label: 'With a remainder', generate: longRemainder },
  { id: 'missing', label: 'Missing terms', generate: missingTerm },
];

export const masterySet = makeMasterySet(skills);
