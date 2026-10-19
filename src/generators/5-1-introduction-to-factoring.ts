// Practice problem generators for Lesson 5.1 — Introduction to Factoring.
import { factoredAnswer, gcd, lin, makeMasterySet, nz, par, parTex, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 'a', 't']);

function gcfMonomials(): Problem {
  const v = V();
  const g = randInt(2, 9);
  const ge = randInt(1, 4);
  const terms = Array.from({ length: randInt(2, 3) }, () => {
    let k = randInt(1, 6);
    return [g * k, ge + randInt(0, 3)] as [number, number];
  });
  // make sure the coefficients' gcd is exactly g and the smallest exponent is ge
  terms[0][1] = ge;
  const coefs = terms.map((t) => t[0] / g);
  const cg = coefs.reduce((a, b) => gcd(a, b));
  const G = g * cg;
  const gTex = Poly.mono(G, { [v]: ge });
  const tex = terms.map(([c, e]) => Poly.mono(c, { [v]: e }).tex()).join(',\\; ');
  return {
    skill: 'gcf',
    prompt: `Find the greatest common factor (GCF) of $\\;${tex}$.`,
    answer: { type: 'expression', value: gTex.text() },
    hints: ['For the number part, find the largest number that divides every coefficient.', `For the variable part, take the **smallest** power of $${v}$ that appears.`],
    solution: [`Numbers: GCF of ${terms.map((t) => `$${t[0]}$`).join(', ')} is $${G}$.`, `Variables: the smallest power is $${Poly.mono(1, { [v]: ge }).tex()}$.`, `GCF $= ${gTex.tex()}$`],
    placeholder: `e.g. 6${v}^2`,
  };
}

function factorOutGCF(): Problem {
  const v = V();
  const gc = randInt(2, 8);
  const ge = randInt(0, 3);
  const n = randInt(2, 3);
  // inner polynomial with coefficients whose gcd is 1 and constant/lowest term present
  let inner: Poly;
  for (;;) {
    const coefs = Array.from({ length: n }, () => nz(7));
    if (coefs.reduce((a, b) => gcd(a, b)) !== 1) continue;
    if (coefs[0] < 0) coefs[0] = -coefs[0];
    inner = Poly.fromCoefs(coefs, v);
    break;
  }
  const G = Poly.mono(gc, ge ? { [v]: ge } : {});
  const full = G.mul(inner);
  return {
    skill: 'factor',
    prompt: `Factor out the greatest common factor: $\\;${full.tex()}$`,
    answer: factoredAnswer(`${G.text()}${par(inner)}`),
    hints: ['Find the GCF of all the terms (number part and variable part).', `The GCF is $${G.tex()}$. Divide each term by it to find what goes in the parentheses.`],
    solution: [`GCF $= ${G.tex()}$`, `$${full.tex()} = ${G.tex()}${parTex(inner)}$`, `Check by multiplying: $${G.tex()}${parTex(inner)} = ${full.tex()}$ ✓`],
    placeholder: `e.g. 3${v}(${v}^2 - 2${v} + 5)`,
  };
}

function grouping(): Problem {
  const v = 'x';
  for (;;) {
    const a = randInt(1, 3), b = nz(7), c = randInt(1, 3), d = nz(7);
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue;
    // (a x + b)(c x^2 + d)
    const F1 = lin(a, b, v);
    const F2 = Poly.fromCoefs([c, 0, d], v);
    const full = F1.mul(F2);
    if (full.size !== 4) continue;
    const [p3, p2, p1, p0] = full.coefs(v);
    return {
      skill: 'grouping',
      prompt: `Factor by grouping: $\\;${full.tex()}$`,
      answer: factoredAnswer(`${par(F1)}${par(F2)}`),
      hints: ['Group the first two terms and the last two terms.', 'Factor the GCF out of each group. You should get the same binomial twice — factor it out.'],
      solution: [
        `$(${Poly.fromCoefs([p3, p2, 0, 0], v).tex()}) + (${Poly.fromCoefs([p1, p0], v).tex()})$`,
        `$= ${Poly.mono(c, { [v]: 2 }).tex()}${parTex(F1)} ${d < 0 ? '-' : '+'} ${Math.abs(d)}${parTex(F1)}$`,
        `$= ${parTex(F1)}${parTex(F2)}$`,
      ],
      placeholder: '(x + 3)(x^2 + 2)',
    };
  }
}

function negativeGCF(): Problem {
  const v = V();
  const g = randInt(2, 6);
  const inner = Poly.fromCoefs([randInt(1, 6), nz(7), ...(Math.random() < 0.5 ? [nz(7)] : [])], v);
  const full = inner.scale(-g);
  return {
    skill: 'negative',
    prompt: `Factor out $-${g}$: $\\;${full.tex()}$`,
    answer: factoredAnswer(`-${g}${par(inner)}`),
    hints: [`Divide **each** term by $-${g}$. Every sign inside the parentheses changes.`],
    solution: [`$${full.tex()} = -${g}${parTex(inner)}$`],
    placeholder: `-${g}(…)`,
  };
}

export const skills: Skill[] = [
  { id: 'gcf', label: 'Find the GCF', generate: gcfMonomials },
  { id: 'factor', label: 'Factor out the GCF', generate: factorOutGCF },
  { id: 'negative', label: 'Factor out a negative', generate: negativeGCF },
  { id: 'grouping', label: 'Factor by grouping', generate: grouping },
];

export const masterySet = makeMasterySet(skills);
