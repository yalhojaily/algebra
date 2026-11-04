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
  const k = nz(4);
  const d = Poly.fromCoefs([1, -k], v);
  // x^3 + p x^2 + q x + r with one of the middle terms missing, built so that (x - k) divides it.
  const kind = pick(['x2', 'x', 'both'] as const);
  const p = kind === 'x' ? nz(5) : 0;
  const q = kind === 'x2' ? nz(9) : 0;
  const r = -(k ** 3 + p * k * k + q * k);
  const D = Poly.fromCoefs([1, p, q, r], v);
  const Q = Poly.fromCoefs([1, p + k, q + k * (p + k)], v);
  const filled = `x^3 ${p < 0 ? '-' : '+'} ${Math.abs(p)}x^2 ${q < 0 ? '-' : '+'} ${Math.abs(q)}x ${r < 0 ? '-' : '+'} ${Math.abs(r)}`;
  return {
    skill: 'missing',
    prompt: `Divide: $\;(${D.tex()}) \\div (${d.tex()})$`,
    answer: { type: 'expression', value: Q.text(), maxTerms: 3 },
    hints: [`Write the missing terms with zero coefficients: $${filled}$. Then divide as usual.`, 'The zero terms keep the columns lined up when you subtract.'],
    solution: [`$${filled}$`, ...stepsTex(D, d, v), `Quotient: $${Q.tex()}$`],
    placeholder: 'e.g. x^2 + 2x + 4',
  };
}


/** Find a missing side from an area polynomial. */
function sideWords(): Problem {
  const r = randInt(1, 8), s = randInt(1, 9);
  const W = Poly.fromCoefs([1, r], 'x');
  const L = Poly.fromCoefs([pick([1, 2, 3]), s], 'x');
  const A = L.mul(W);
  return {
    skill: 'apply',
    prompt: `A rectangle has area $${A.tex()}$ and width $${W.tex()}$. Find its length.`,
    answer: { type: 'expression', value: L.text(), maxTerms: 2 },
    hints: ['Unknown: the length. Area = length × width, so length = area ÷ width.', `Divide $(${A.tex()}) \\div (${W.tex()})$ by long division.`],
    solution: [...stepsTex(A, W, 'x'), `Length: $${L.tex()}$. Check: $(${L.tex()})(${W.tex()}) = ${A.tex()}$ ✓`],
    placeholder: 'x + 5',
  };
}

export const skills: Skill[] = [
  { id: 'monomial', label: 'Divide by a monomial', generate: byMonomial },
  { id: 'long', label: 'Long division', generate: longNoRemainder },
  { id: 'remainder', label: 'With a remainder', generate: longRemainder },
  { id: 'missing', label: 'Missing terms', generate: missingTerm },
  { id: 'apply', label: 'Word problems', generate: sideWords },
];

export const masterySet = makeMasterySet(skills);
