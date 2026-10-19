// Practice problem generators for Lesson 5.7 — Factoring: A General Strategy.
import { randomAC } from './5-3-factoring-ax-bx-c-a-1-the-foil-method';
import { choice, factoredAnswer, gcd, lin, makeMasterySet, nz, par, parTex, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

type Kind = 'gcf' | 'diff' | 'square' | 'trinomial' | 'ac' | 'grouping' | 'cubes';
const LABEL: Record<Kind, string> = {
  gcf: 'Only a common factor',
  diff: 'Difference of squares',
  square: 'Trinomial square',
  trinomial: 'Trinomial x² + bx + c',
  ac: 'Trinomial ax² + bx + c (a ≠ 1)',
  grouping: 'Grouping (four terms)',
  cubes: 'Sum or difference of cubes',
};

function build(kind: Kind) {
  const v = pick(['x', 'y', 'a']);
  const g = Math.random() < 0.5 ? randInt(2, 5) : 1;
  const G = Poly.const(g);
  let factors: Poly[];
  let steps: string;
  switch (kind) {
    case 'gcf': {
      let inner: Poly;
      do inner = Poly.fromCoefs([randInt(1, 5), nz(7), nz(7)], v);
      while (inner.coefs(v).reduce((a, b) => gcd(a, b)) !== 1 || inner.coefs(v)[1] ** 2 - 4 * inner.coefs(v)[0] * inner.coefs(v)[2] >= 0);
      factors = [Poly.mono(randInt(2, 5), { [v]: randInt(1, 2) }), inner];
      steps = 'Take out the GCF. The trinomial left over is prime.';
      break;
    }
    case 'diff': {
      const a = pick([1, 2, 3]);
      let b = randInt(1, 7);
      while (gcd(a, b) !== 1) b = randInt(1, 7);
      factors = [G, lin(a, b, v), lin(a, -b, v)];
      steps = 'Two terms with a minus between two squares: a difference of squares.';
      break;
    }
    case 'square': {
      const a = pick([1, 2, 3]);
      let b = nz(6);
      while (gcd(a, b) !== 1) b = nz(6);
      factors = [G, lin(a, b, v), lin(a, b, v)];
      steps = 'First and last terms are squares and the middle term is $\\pm 2AB$: a trinomial square.';
      break;
    }
    case 'trinomial':
      factors = [G, lin(1, nz(8), v), lin(1, nz(8), v)];
      steps = 'Leading coefficient 1: find two numbers with product $c$ and sum $b$.';
      break;
    case 'ac': {
      const { F1, F2 } = randomAC(v);
      factors = [G, F1, F2];
      steps = 'Leading coefficient not 1: use FOIL trial-and-error or the ac-method.';
      break;
    }
    case 'grouping': {
      const c = randInt(1, 3);
      let d = randInt(1, 6);
      while (gcd(c, d) !== 1) d = randInt(1, 6);
      factors = [G, lin(1, nz(6), v), Poly.fromCoefs([c, 0, d], v)];
      steps = 'Four terms: try grouping in pairs.';
      break;
    }
    case 'cubes': {
      const b = randInt(1, 4) * pick([1, -1]);
      const A = Poly.v(v), B = Poly.const(b);
      factors = [G, A.add(B), A.mul(A).sub(A.mul(B)).add(B.mul(B))];
      steps = 'Two terms that are cubes: use the sum or difference of cubes pattern.';
      break;
    }
  }
  const nonUnit = factors.filter((f) => !(f.size === 1 && f.degree() === 0 && f.coef({}) === 1));
  const P = nonUnit.reduce((a, b) => a.mul(b), Poly.const(1));
  // merge equal factors into a square
  const text = nonUnit.map((f) => (f.degree() === 0 || (f.size === 1) ? f.text() : par(f))).join('');
  const tex = nonUnit.map((f) => (f.degree() === 0 || f.size === 1 ? f.tex() : parTex(f))).join('');
  return { P, text, tex, g, steps };
}

function factorCompletely(): Problem {
  const kind = pick<Kind>(['gcf', 'diff', 'square', 'trinomial', 'ac', 'grouping', 'cubes']);
  const { P, text, tex, g, steps } = build(kind);
  return {
    skill: 'factor',
    prompt: `Factor completely: $\\;${P.tex()}$`,
    answer: factoredAnswer(text),
    hints: ['**Step 1:** always look for a common factor first.', '**Step 2:** count the terms. Two → difference of squares or cubes. Three → trinomial square, or FOIL / ac-method. Four → grouping.', '**Step 3:** make sure every factor is completely factored.'],
    solution: [...(g > 1 ? [`Common factor: $${g}$.`] : []), steps, `$= ${tex}$`],
    placeholder: 'e.g. 2(x + 3)(x - 3)',
  };
}

function whichMethod(): Problem {
  const kind = pick<Kind>(['diff', 'square', 'trinomial', 'ac', 'grouping', 'cubes']);
  const { P } = build(kind);
  // Remove a common factor from the prompt so the method is about the remaining polynomial.
  const coefs = [...P.terms.values()];
  const g = coefs.reduce((a, b) => gcd(a, b));
  const Q = P.scale(1 / Math.abs(g));
  const wrong = (Object.keys(LABEL) as Kind[]).filter((k) => k !== kind && k !== 'gcf');
  return {
    skill: 'method',
    prompt: `Which factoring method fits $\\;${Q.tex()}$?`,
    answer: choice(LABEL[kind], wrong.sort(() => Math.random() - 0.5).slice(0, 3).map((k) => LABEL[k])),
    hints: ['Count the terms first, then look at the special patterns.'],
    solution: [`**${LABEL[kind]}**.`],
  };
}

export const skills: Skill[] = [
  { id: 'method', label: 'Choose the method', generate: whichMethod },
  { id: 'factor', label: 'Factor completely', generate: factorCompletely },
];

export const masterySet = makeMasterySet(skills);
