// Practice problem generators for Lesson 6.1 — Multiplying and Simplifying Rational Expressions.
import { ascTex, cancelTex, ptex, dfrac, factored, factoredTex, ftex, lin, makeMasterySet, monicFactors, nz, pick, Poly, randInt, ratAnswer, ratTex, simplify } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'x', 'a', 'y', 't']);

function excluded(): Problem {
  const v = V();
  const two = Math.random() < 0.7;
  let D: Poly, roots: number[], steps: string[];
  if (two) {
    const [A, B] = monicFactors(2, v, 8);
    D = A.mul(B);
    roots = [-A.coefs(v)[1], -B.coefs(v)[1]];
    steps = [`$${D.tex()} = 0$`, `$(${A.tex()})(${B.tex()}) = 0$`, `$${v} = ${roots[0]}$ or $${v} = ${roots[1]}$`];
  } else {
    const a = randInt(2, 6), r = nz(8);
    D = lin(a, -a * r, v);
    roots = [r];
    steps = [`$${D.tex()} = 0$`, `$${v} = ${r}$`];
  }
  let N = lin(1, nz(9), v);
  while (roots.includes(-N.coefs(v)[1])) N = lin(1, nz(9), v);
  return {
    skill: 'excluded',
    prompt: `For which value${two ? 's' : ''} of $${v}$ is $\\;${dfrac(N.tex(), D.tex())}\\;$ undefined? (List them separated by commas.)`,
    answer: { type: 'solutions', values: roots, variable: v },
    hints: ['A fraction is undefined when its **denominator** is $0$ — the numerator does not matter.', `Solve $${D.tex()} = 0$${two ? ' by factoring' : ''}.`],
    solution: steps,
    mistakes: [{ answer: String(-N.coefs(v)[1]), feedback: 'That value makes the **numerator** zero, which is fine — the fraction is just $0$ there. Look at the denominator.' }],
    placeholder: two ? 'e.g. 3, -2' : 'e.g. 4',
  };
}

function simplifyOne(): Problem {
  const v = V();
  if (Math.random() < 0.3) {
    // monomials: a v^m / (b v^n)
    const g = randInt(2, 6);
    const a = g * randInt(1, 5), b = g * randInt(1, 5) * pick([1, -1]);
    const m = randInt(1, 6), n = randInt(1, 6);
    const N = Poly.mono(a, { [v]: m }), D = Poly.mono(b, { [v]: n });
    const s = simplify(N, D, v);
    return {
      skill: 'simplify',
      prompt: `Simplify: $\\;${dfrac(N.tex(), D.tex())}$`,
      answer: ratAnswer(s),
      hints: [`Divide the numbers by their greatest common factor, $${s.g}$.`, `For the powers of $${v}$, cancel $${v}^{${Math.min(m, n)}}$ from top and bottom.`],
      solution: [`$= ${cancelTex(N, D, v)}$`, `$= ${ratTex(s)}$`],
      placeholder: `3/(2${v}^2)`,
    };
  }
  const [C, A, B] = monicFactors(3, v);
  const k1 = pick([1, 1, 2, 3]), k2 = pick([1, 1, 2, 3, 4]);
  const N = C.mul(A).scale(k1);
  const D = Math.random() < 0.5 ? C.mul(B).scale(k2) : C.scale(k2 * pick([1, 2]));
  const s = simplify(N, D, v);
  return {
    skill: 'simplify',
    prompt: `Simplify: $\\;${dfrac(N.tex(), D.tex())}$`,
    answer: ratAnswer(s),
    hints: ['Factor the numerator and the denominator completely.', `Then cancel the common factor $(${C.tex()})$${s.g > 1 ? ` and the common number $${s.g}$` : ''}.`],
    solution: [`$= ${cancelTex(N, D, v)}$`, `$= ${ratTex(s)}$`],
    placeholder: `(${v} + 2)/(${v} - 3)`,
  };
}

function opposites(): Problem {
  const v = V();
  const r = randInt(1, 9);
  const L = lin(1, -r, v); // v − r
  const opp = L.neg(); // r − v
  const k = randInt(1, 5);
  let N: Poly, D: Poly;
  const kind = randInt(0, 2);
  if (kind === 0) { N = L.scale(k); D = opp; }
  else if (kind === 1) { const [B] = monicFactors(1, v); N = L.mul(B); D = opp; }
  else { N = opp.scale(randInt(2, 5)); D = L.mul(lin(1, r, v)); }
  const s = simplify(N, D, v);
  const show = (P: Poly) => (P.degree() === 1 && P.coefs(v)[0] < 0 ? ascTex(P) : P.tex());
  return {
    skill: 'opposite',
    prompt: `Simplify: $\\;${dfrac(show(N), show(D))}$`,
    answer: ratAnswer(s),
    hints: [`$${ascTex(opp)}$ and $${L.tex()}$ are **opposites**: $${ascTex(opp)} = -1(${L.tex()})$.`, 'Factor out $-1$, then cancel.'],
    solution: [`$= ${dfrac(factoredTex(factored(N, v)), factoredTex(factored(D, v)))}$ — the $-1$ comes from rewriting $${ascTex(opp)}$ as $-(${L.tex()})$`, `$= ${ratTex(s)}$`],
    placeholder: `-${v} - 4`,
  };
}

function multiply(): Problem {
  const v = V();
  const [A, B, C, E] = monicFactors(4, v);
  const k1 = pick([1, 2, 3]), k2 = pick([1, 2, 4]);
  // (A·B)/(C·E) · (k1·C)/(k2·B)
  const N1 = A.mul(B), D1 = C.mul(E), N2 = C.scale(k1), D2 = B.scale(k2);
  const s = simplify(N1.mul(N2), D1.mul(D2), v);
  return {
    skill: 'multiply',
    prompt: `Multiply and simplify: $\\;${dfrac(N1.tex(), D1.tex())} \\cdot ${dfrac(N2.tex(), D2.tex())}$`,
    answer: ratAnswer(s),
    hints: ['Factor every numerator and denominator first. Don\'t multiply out!', `Write it as one fraction and cancel the common factors $(${B.tex()})$ and $(${C.tex()})$.`],
    solution: [
      `$= ${dfrac(`${ptex(N1, v)} \\cdot ${ptex(N2, v)}`, `${ptex(D1, v)} \\cdot ${ptex(D2, v)}`)}$`,
      `$= ${cancelTex(N1.mul(N2), D1.mul(D2), v)}$`,
      `$= ${ratTex(s)}$`,
    ],
    placeholder: `(${v} + 1)/(2(${v} - 5))`,
  };
}

export const skills: Skill[] = [
  { id: 'excluded', label: 'Values that are not allowed', generate: excluded },
  { id: 'simplify', label: 'Simplify', generate: simplifyOne },
  { id: 'opposite', label: 'Opposite factors', generate: opposites },
  { id: 'multiply', label: 'Multiply and simplify', generate: multiply },
];

export const masterySet = makeMasterySet(skills);
