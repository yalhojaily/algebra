// Practice problem generators for Lesson 4.6 — Special Products.
import { makeMasterySet, nz, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

const ans = (P: Poly) => ({ type: 'expression' as const, value: P.text(), maxTerms: Math.max(1, P.size) });
const V = () => pick(['x', 'y', 'a', 't', 'p']);
const pos = (n: number) => randInt(1, n);

function foil(): Problem {
  const v = V();
  const A = Poly.fromCoefs([nz(4), nz(9)], v);
  const B = Poly.fromCoefs([nz(4), nz(9)], v);
  const [a, b] = A.coefs(v);
  const [c, d] = B.coefs(v);
  const R = A.mul(B);
  const t = (k: number, e: number) => Poly.mono(k, e ? { [v]: e } : {}).tex();
  return {
    skill: 'foil',
    prompt: `Multiply using FOIL: $\\;(${A.tex()})(${B.tex()})$`,
    answer: ans(R),
    hints: ['**F**irst · **O**uter · **I**nner · **L**ast — then collect the two middle terms.'],
    solution: [
      `F: $${t(a * c, 2)}$, O: $${t(a * d, 1)}$, I: $${t(b * c, 1)}$, L: $${t(b * d, 0)}$`,
      `$= ${R.tex()}$`,
    ],
    placeholder: `e.g. 6${v}^2 - 7${v} - 3`,
  };
}

function diffSquares(): Problem {
  const v = V();
  const a = pick([1, 1, 2, 3, 4, 5]);
  const b = pos(9);
  const e = pick([1, 1, 1, 2]);
  const A = Poly.mono(a, { [v]: e });
  const plus = A.add(Poly.const(b));
  const minus = A.sub(Poly.const(b));
  const R = plus.mul(minus);
  return {
    skill: 'diff',
    prompt: `Multiply: $\\;(${plus.tex()})(${minus.tex()})$`,
    answer: ans(R),
    hints: ['$(A + B)(A - B) = A^2 - B^2$. The outer and inner products cancel.', `Here $A = ${A.tex()}$ and $B = ${b}$.`],
    solution: [`$A^2 - B^2 = (${A.tex()})^2 - ${b}^2 = ${R.tex()}$`],
    mistakes: [{ answer: A.mul(A).add(Poly.const(b * b)).text(), feedback: 'The last term is $B \\cdot (-B) = -B^2$, so it is **subtracted**.' }],
    placeholder: `e.g. 9${v}^2 - 16`,
  };
}

function squareBinomial(): Problem {
  const v = V();
  const a = pick([1, 1, 2, 3, 4]);
  const b = nz(8);
  const B = Poly.fromCoefs([a, b], v);
  const R = B.mul(B);
  const A = Poly.mono(a, { [v]: 1 });
  return {
    skill: 'square',
    prompt: `Multiply: $\\;(${B.tex()})^2$`,
    answer: ans(R),
    hints: [`$(A + B)^2 = A^2 + 2AB + B^2$ and $(A - B)^2 = A^2 - 2AB + B^2$.`, 'Don\'t forget the middle term!'],
    solution: [`$A = ${A.tex()}$, $B = ${b}$`, `$A^2 = ${A.mul(A).tex()}$, $\\;2AB = ${A.scale(2 * b).tex()}$, $\\;B^2 = ${b * b}$`, `$= ${R.tex()}$`],
    mistakes: [{ answer: A.mul(A).add(Poly.const(b * b)).text(), feedback: '$(A + B)^2$ is **not** $A^2 + B^2$. You are missing the middle term $2AB$.' }],
    placeholder: `e.g. 4${v}^2 + 12${v} + 9`,
  };
}

function mixed(): Problem {
  return pick([foil, diffSquares, squareBinomial])();
}

function areaApply(): Problem {
  const v = 'x';
  const k = randInt(1, 9);
  const plus = Poly.fromCoefs([1, k], v), minus = Poly.fromCoefs([1, -k], v);
  const thing = pick(['garden', 'tile', 'patio', 'carpet', 'photo']);
  const kind = pick(['grow', 'shrink', 'increase', 'rect'] as const);
  if (kind === 'grow' || kind === 'shrink') {
    const S = kind === 'grow' ? plus : minus, A = S.mul(S);
    return {
      skill: 'apply',
      prompt: `Each side of a square ${thing} is $x$ m. Each side is ${kind === 'grow' ? `increased by $${k}$ m` : `reduced by $${k}$ m`}. Write a polynomial for the **new area**.`,
      answer: ans(A),
      hints: [`Unknown: the new area. Key words: "square" means area = side², and the new side is $${S.tex()}$.`, `Square the binomial: $(A ${kind === 'grow' ? '+' : '-'} B)^2 = A^2 ${kind === 'grow' ? '+' : '-'} 2AB + B^2$.`],
      solution: [`$(${S.tex()})^2 = ${A.tex()}$`],
      mistakes: [{ answer: `x^2 ${kind === 'grow' ? '+' : '-'} ${k * k}`, feedback: 'The middle term $2AB$ is missing: $(A \\pm B)^2 \\ne A^2 \\pm B^2$.' }],
      placeholder: 'e.g. x^2 + 10x + 25',
    };
  }
  if (kind === 'increase') {
    const inc = Poly.fromCoefs([2 * k, k * k], v);
    return {
      skill: 'apply',
      prompt: `Each side of a square ${thing} of side $x$ m is increased by $${k}$ m. By how much does its area **increase**? Write a polynomial.`,
      answer: ans(inc),
      hints: ['Unknown: the increase in area. Key words: "increase" means new area minus old area.', `New area $(x + ${k})^2$, old area $x^2$. Subtract.`],
      solution: [`$(x + ${k})^2 - x^2 = x^2 + ${2 * k}x + ${k * k} - x^2 = ${inc.tex()}$`],
      mistakes: [{ answer: String(k * k), feedback: 'Two strips of size ' + k + ' by $x$ are added too, not only the corner square.' }],
      placeholder: 'e.g. 6x + 9',
    };
  }
  const A = plus.mul(minus);
  return {
    skill: 'apply',
    prompt: `A square ${thing} has side $x$ m. It is reshaped into a rectangle $${k}$ m longer and $${k}$ m narrower. Write a polynomial for the rectangle's area.`,
    answer: ans(A),
    hints: [`Unknown: the new area. Key words: "${k} m longer and ${k} m narrower" gives sides $x + ${k}$ and $x - ${k}$.`, 'A sum times a difference: $(A + B)(A - B) = A^2 - B^2$.'],
    solution: [`$(x + ${k})(x - ${k}) = ${A.tex()}$`, `The area went **down** by $${k * k}$ m², even though the perimeter is the same.`],
    placeholder: 'e.g. x^2 - 9',
  };
}

export const skills: Skill[] = [
  { id: 'foil', label: 'FOIL', generate: foil },
  { id: 'diff', label: '(A + B)(A − B)', generate: diffSquares },
  { id: 'square', label: '(A ± B)²', generate: squareBinomial },
  { id: 'mixed', label: 'Which pattern?', generate: () => ({ ...mixed(), skill: 'mixed' }) },
  { id: 'apply', label: 'Area', generate: areaApply },
];

export const masterySet = makeMasterySet(skills);
