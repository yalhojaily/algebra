// Practice problem generators for Lesson 5.3 — Factoring ax² + bx + c, a ≠ 1: The FOIL Method.
import { factoredAnswer, gcd, lin, makeMasterySet, nz, par, parTex, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

export const V = () => pick(['x', 'y', 'a', 't']);

/** (p v + q)(r v + s) with a = p·r > 1 and no common factors inside either binomial. */
export function randomAC(v: string) {
  for (;;) {
    const p = randInt(1, 5), r = randInt(1, 5);
    if (p * r === 1) continue;
    const q = nz(7), s = nz(7);
    if (gcd(p, q) !== 1 || gcd(r, s) !== 1) continue;
    const F1 = lin(p, q, v), F2 = lin(r, s, v);
    const P = F1.mul(F2);
    if (P.size < 3) continue;
    return { F1, F2, P, p, q, r, s };
  }
}

function foilFactor(): Problem {
  const v = V();
  const { F1, F2, P } = randomAC(v);
  const [a, b, c] = P.coefs(v);
  return {
    skill: 'foil',
    prompt: `Factor: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${par(F1)}${par(F2)}`),
    hints: [
      `**First** terms must multiply to $${Poly.mono(a, { [v]: 2 }).tex()}$; **Last** terms must multiply to $${c}$.`,
      `Try the possible pairs. Keep the arrangement whose **Outer + Inner** products add to $${Poly.mono(b, { [v]: 1 }).tex()}$.`,
    ],
    solution: [`$${parTex(F1)}${parTex(F2)}$`, `Check: Outer + Inner $= ${Poly.mono(F1.coefs(v)[0] * F2.coefs(v)[1], { [v]: 1 }).add(Poly.mono(0, {})).tex()} ${F1.coefs(v)[1] * F2.coefs(v)[0] < 0 ? '-' : '+'} ${Poly.mono(Math.abs(F1.coefs(v)[1] * F2.coefs(v)[0]), { [v]: 1 }).tex()} = ${Poly.mono(b, { [v]: 1 }).tex()}$ ✓`],
    placeholder: `(2${v} + 3)(${v} - 1)`,
  };
}

function withGCF(): Problem {
  const v = V();
  const { F1, F2, P } = randomAC(v);
  const g = randInt(2, 4);
  const G = Math.random() < 0.3 ? Poly.mono(g, { [v]: 1 }) : Poly.const(g);
  const full = G.mul(P);
  return {
    skill: 'gcf',
    prompt: `Factor completely: $\\;${full.tex()}$`,
    answer: factoredAnswer(`${G.text()}${par(F1)}${par(F2)}`),
    hints: [`Always look for a common factor first: $${G.tex()}$.`, `Then factor $${P.tex()}$.`],
    solution: [`$= ${G.tex()}${parTex(P)}$`, `$= ${G.tex()}${parTex(F1)}${parTex(F2)}$`],
    placeholder: `2(3${v} + 1)(${v} - 4)`,
  };
}

function negativeLead(): Problem {
  const v = V();
  const { F1, F2, P } = randomAC(v);
  const full = P.neg();
  return {
    skill: 'negative',
    prompt: `Factor: $\\;${full.tex()}$`,
    answer: factoredAnswer(`-${par(F1)}${par(F2)}`),
    hints: ['When the leading coefficient is negative, factor out $-1$ first. Then factor the trinomial left inside.'],
    solution: [`$= -${parTex(P)}$`, `$= -${parTex(F1)}${parTex(F2)}$`],
    placeholder: `-(2${v} - 1)(${v} + 3)`,
  };
}

export const skills: Skill[] = [
  { id: 'foil', label: 'Factor ax² + bx + c', generate: foilFactor },
  { id: 'gcf', label: 'GCF first', generate: withGCF },
  { id: 'negative', label: 'Negative leading coefficient', generate: negativeLead },
];

export const masterySet = makeMasterySet(skills);
