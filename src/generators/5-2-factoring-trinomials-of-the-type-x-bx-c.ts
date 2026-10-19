// Practice problem generators for Lesson 5.2 — Factoring Trinomials of the Type x² + bx + c.
import { choice, factoredAnswer, factorPairs, lin, makeMasterySet, nz, par, parTex, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 'a', 't', 'm']);

function pairTable(b: number, c: number) {
  const rows = factorPairs(c).map(([p, q]) => `$${p}, ${q}$ → sum $${p + q}$${p + q === b ? ' ✓' : ''}`);
  return rows.slice(0, 8).join('; ');
}

function basic(): Problem {
  const v = V();
  const r = nz(9), s = nz(9);
  const P = lin(1, r, v).mul(lin(1, s, v));
  const [, b, c] = P.coefs(v);
  return {
    skill: 'basic',
    prompt: `Factor: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${par(lin(1, r, v))}${par(lin(1, s, v))}`),
    hints: [`Find two numbers whose **product** is $${c}$ and whose **sum** is $${b}$.`, c > 0 ? `Since $${c}$ is positive, both numbers have the same sign as $${b}$.` : `Since $${c}$ is negative, the numbers have opposite signs.`],
    solution: [`Pairs that multiply to $${c}$: ${pairTable(b, c)}`, `$${P.tex()} = ${parTex(lin(1, r, v))}${parTex(lin(1, s, v))}$`, `Check with FOIL ✓`],
    mistakes: [{ answer: `${par(lin(1, -r, v))}${par(lin(1, -s, v))}`, feedback: `Close — but check the signs. Multiply out: the middle term should be $${b > 0 ? '+' : ''}${b}${v}$.` }],
    placeholder: `(${v} + 2)(${v} - 5)`,
  };
}

function withGCF(): Problem {
  const v = V();
  const g = randInt(2, 5);
  const r = nz(7), s = nz(7);
  const T = lin(1, r, v).mul(lin(1, s, v));
  const lead = Math.random() < 0.4 ? Poly.mono(g, { [v]: 1 }) : Poly.const(g);
  const sign = Math.random() < 0.25 ? -1 : 1;
  const G = lead.scale(sign);
  const P = G.mul(T);
  return {
    skill: 'gcf',
    prompt: `Factor completely: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${G.text()}${par(lin(1, r, v))}${par(lin(1, s, v))}`),
    hints: [`First factor out the GCF, $${G.tex()}$.`, `Then factor the trinomial that is left, $${T.tex()}$.`],
    solution: [`$= ${G.tex()}${parTex(T)}$`, `$= ${G.tex()}${parTex(lin(1, r, v))}${parTex(lin(1, s, v))}$`],
    placeholder: `2(${v} + 1)(${v} - 3)`,
  };
}

function twoVars(): Problem {
  const [v, w] = pick([['x', 'y'], ['a', 'b'], ['m', 'n']]);
  const r = nz(8), s = nz(8);
  const F1 = Poly.v(v).add(Poly.mono(r, { [w]: 1 }));
  const F2 = Poly.v(v).add(Poly.mono(s, { [w]: 1 }));
  const P = F1.mul(F2);
  return {
    skill: 'twovars',
    prompt: `Factor: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${par(F1)}${par(F2)}`),
    hints: [`Think of it as $${v}^2 + (\\ldots)${w} \\cdot ${v} + (\\ldots)${w}^2$. Find two numbers with product $${r * s}$ and sum $${r + s}$.`, `Put $${w}$ with each number: $(${v} + \\square ${w})(${v} + \\square ${w})$.`],
    solution: [`$${r} \\cdot ${s < 0 ? `(${s})` : s} = ${r * s}$ and $${r} + ${s < 0 ? `(${s})` : s} = ${r + s}$`, `$= ${parTex(F1)}${parTex(F2)}$`],
    placeholder: `(${v} + 2${w})(${v} - 3${w})`,
  };
}

function isPrime(): Problem {
  const v = V();
  const factorable = Math.random() < 0.5;
  let P: Poly;
  if (factorable) P = lin(1, nz(9), v).mul(lin(1, nz(9), v));
  else {
    for (;;) {
      const b = nz(12), c = nz(30);
      if (factorPairs(c).some(([p, q]) => p + q === b)) continue;
      P = Poly.fromCoefs([1, b, c], v);
      break;
    }
  }
  const [, b, c] = P!.coefs(v);
  const ok = factorPairs(c).find(([p, q]) => p + q === b);
  return {
    skill: 'prime',
    prompt: `Can $\\;${P!.tex()}\\;$ be factored using integers?`,
    answer: choice(ok ? 'Yes' : 'No — it is prime', [ok ? 'No — it is prime' : 'Yes']),
    hints: [`List the factor pairs of $${c}$ and check whether any pair adds to $${b}$.`],
    solution: ok
      ? [`$${ok[0]} \\cdot ${ok[1] < 0 ? `(${ok[1]})` : ok[1]} = ${c}$ and $${ok[0]} + ${ok[1] < 0 ? `(${ok[1]})` : ok[1]} = ${b}$, so it factors: $${parTex(lin(1, ok[0], v))}${parTex(lin(1, ok[1], v))}$.`]
      : [`Pairs for $${c}$: ${pairTable(b, c)}. None adds to $${b}$, so the trinomial is **prime** (not factorable over the integers).`],
  };
}

export const skills: Skill[] = [
  { id: 'basic', label: 'Factor x² + bx + c', generate: basic },
  { id: 'gcf', label: 'GCF first', generate: withGCF },
  { id: 'twovars', label: 'Two variables', generate: twoVars },
  { id: 'prime', label: 'Prime or not?', generate: isPrime },
];

export const masterySet = makeMasterySet(skills);
