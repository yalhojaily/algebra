// Practice problem generators for Lesson 5.6 — Factoring Sums or Differences of Cubes.
import { factoredAnswer, gcd, makeMasterySet, par, parTex, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 'a', 't']);

function cubes(withGcf = false): Problem {
  const v = V();
  const a = pick([1, 1, 1, 2, 3, 4, 5]);
  const b = randInt(1, 6);
  const plus = Math.random() < 0.5;
  const A = Poly.mono(a, { [v]: 1 });
  const B = Poly.const(plus ? b : -b);
  const lin = A.add(B);
  const quad = A.mul(A).sub(A.mul(B)).add(B.mul(B));
  const g = withGcf ? randInt(2, 4) : 1;
  const G = Poly.const(g);
  const P = G.mul(lin).mul(quad);
  return {
    skill: withGcf ? 'gcf' : 'cubes',
    prompt: `${withGcf ? 'Factor completely' : 'Factor'}: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${g > 1 ? g : ''}${par(lin)}${par(quad)}`),
    hints: [
      ...(withGcf ? [`Factor out the GCF, $${g}$, first.`] : []),
      plus ? '$A^3 + B^3 = (A + B)(A^2 - AB + B^2)$' : '$A^3 - B^3 = (A - B)(A^2 + AB + B^2)$',
      `Here $A = ${A.tex()}$ (since $(${A.tex()})^3 = ${A.mul(A).mul(A).tex()}$) and $B = ${b}$ (since $${b}^3 = ${b ** 3}$).`,
    ],
    solution: [
      ...(withGcf ? [`$= ${g}(${lin.mul(quad).tex()})$`] : []),
      `$A = ${A.tex()}$, $B = ${b}$`,
      `$= ${g > 1 ? g : ''}${parTex(lin)}${parTex(quad)}$`,
    ],
    mistakes: [{ answer: `${g > 1 ? g : ''}${par(lin)}${par(A.mul(A).add(A.mul(B)).add(B.mul(B)))}`, feedback: 'Check the sign of the middle term in the trinomial: it is the **opposite** of the sign in the binomial. (Remember SOAP: Same, Opposite, Always Positive.)' }],
    placeholder: `(${v} - 2)(${v}^2 + 2${v} + 4)`,
  };
}

function identify(): Problem {
  const n = pick([1, 8, 27, 64, 125, 216, 1000]);
  const notCube = pick([9, 16, 25, 32, 36, 81, 100]);
  const isC = Math.random() < 0.5;
  const val = isC ? n : notCube;
  return {
    skill: 'identify',
    prompt: `Is $${val}$ a perfect cube? If it is, enter its cube root; if not, enter $0$.`,
    answer: { type: 'number', value: isC ? Math.cbrt(n) : 0 },
    hints: ['Perfect cubes: $1, 8, 27, 64, 125, 216, \\ldots, 1000$ — that is, $1^3, 2^3, 3^3, \\ldots$'],
    solution: [isC ? `$${val} = ${Math.round(Math.cbrt(n))}^3$` : `$${val}$ is not the cube of a whole number.`],
  };
}

export const skills: Skill[] = [
  { id: 'identify', label: 'Perfect cubes', generate: identify },
  { id: 'cubes', label: 'Sum or difference of cubes', generate: () => cubes(false) },
  { id: 'gcf', label: 'GCF first', generate: () => cubes(true) },
];

export const masterySet = makeMasterySet(skills);
