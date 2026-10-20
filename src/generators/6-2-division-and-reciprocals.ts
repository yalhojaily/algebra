// Practice problem generators for Lesson 6.2 — Division and Reciprocals.
import { cancelTex, ptex, dfrac, makeMasterySet, monicFactors, pick, Poly, randInt, ratAnswer, ratTex, simplify } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'x', 'a', 'y', 't']);

function reciprocal(): Problem {
  const v = V();
  const [A, B] = monicFactors(2, v);
  const poly = Math.random() < 0.3;
  const N = poly ? A.mul(B) : A.scale(pick([1, 2, 3]));
  const D = poly ? Poly.const(1) : B.scale(pick([1, 5, 7]));
  const s = simplify(D, N, v);
  const shown = poly ? N.tex() : dfrac(N.tex(), D.tex());
  return {
    skill: 'reciprocal',
    prompt: `Find the reciprocal of $\\;${shown}$`,
    answer: ratAnswer(s),
    hints: [poly ? `A polynomial $P$ is the fraction $\\frac{P}{1}$. Flip it.` : 'Flip the fraction: the numerator becomes the denominator and the denominator becomes the numerator.'],
    solution: [`The reciprocal is $${ratTex(s, true)}$, because their product is $1$.`],
    placeholder: `(${v} + 4)/(2${v} - 1)`,
  };
}

function divide(): Problem {
  const v = V();
  const [A, B, C, E, G] = monicFactors(5, v, 8);
  const k = pick([1, 1, 2, 3]);
  // (A·B)/(C·E) ÷ (k·B)/(C·G)  =  (A·B)/(C·E) · (C·G)/(k·B)  =  A·G/(k·E)
  const N1 = A.mul(B), D1 = C.mul(E), N2 = B.scale(k), D2 = C.mul(G);
  const N = N1.mul(D2), D = D1.mul(N2);
  const s = simplify(N, D, v);
  return {
    skill: 'divide',
    prompt: `Divide and simplify: $\\;${dfrac(N1.tex(), D1.tex())} \\div ${dfrac(N2.tex(), D2.tex())}$`,
    answer: ratAnswer(s),
    hints: ['To divide, multiply by the **reciprocal** of the second fraction.', 'Then factor everything and cancel common factors.'],
    solution: [
      `$= ${dfrac(N1.tex(), D1.tex())} \\cdot ${dfrac(D2.tex(), N2.tex())}$ — multiply by the reciprocal`,
      `$= ${dfrac(`${ptex(N1, v)} \\cdot ${ptex(D2, v)}`, `${ptex(D1, v)} \\cdot ${ptex(N2, v)}`)}$`,
      `$= ${cancelTex(N, D, v)}$`,
      `$= ${ratTex(s)}$`,
    ],
    mistakes: [{ answer: `(${N1.mul(N2).text()})/(${D1.mul(D2).text()})`, feedback: 'It looks like you multiplied straight across. For division, flip the **second** fraction first.' }],
    placeholder: `(${v} + 1)(${v} - 2)/(${v} + 3)`,
  };
}

function monomials(): Problem {
  const v = V();
  const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 9), d = randInt(2, 9);
  const m = randInt(2, 5), n = randInt(1, m);
  const N1 = Poly.mono(a, { [v]: m }), N2 = Poly.mono(c, { [v]: n });
  const N = N1.scale(d), D = N2.scale(b);
  const s = simplify(N, D, v);
  return {
    skill: 'monomial',
    prompt: `Divide and simplify: $\\;${dfrac(N1.tex(), String(b))} \\div ${dfrac(N2.tex(), String(d))}$`,
    answer: ratAnswer(s),
    hints: [`Multiply by the reciprocal: $${dfrac(N1.tex(), String(b))} \\cdot ${dfrac(String(d), N2.tex())}$.`],
    solution: [`$= ${dfrac(`${N1.tex()} \\cdot ${d}`, `${b} \\cdot ${N2.tex()}`)} = ${dfrac(N.tex(), D.tex())}$`, `$= ${ratTex(s)}$`],
    placeholder: `3${v}^2/2`,
  };
}

export const skills: Skill[] = [
  { id: 'reciprocal', label: 'Reciprocals', generate: reciprocal },
  { id: 'monomial', label: 'Divide monomial fractions', generate: monomials },
  { id: 'divide', label: 'Divide and simplify', generate: divide },
];

export const masterySet = makeMasterySet(skills);
