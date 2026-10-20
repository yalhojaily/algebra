// Practice problem generators for Lesson 6.4 — Adding Rational Expressions.
// The builders are shared with Lesson 6.5 (subtraction).
import { ascTex, cancelTex, dfrac, ftex, lin, makeMasterySet, monicFactors, nz, pick, Poly, randInt, ratAnswer, ratTex, simplify } from './helpers';
import type { Problem, Skill } from './types';

export type Op = '+' | '-';
const opTex = (op: Op) => (op === '+' ? '+' : '-');
const sgn = (op: Op, P: Poly) => (op === '+' ? P : P.neg());
const V = () => pick(['x', 'x', 'a', 'y']);

/** The finishing lines: combined numerator over the LCD, then cancel if possible. */
function finish(N: Poly, D: Poly, v: string) {
  const s = simplify(N, D, v);
  const lines = [`$= ${dfrac(N.tex(), ftex(D, v))}$`];
  if (s.common.length || s.g > 1) lines.push(`$= ${cancelTex(N, D, v)} = ${ratTex(s)}$ — factor the numerator and cancel`);
  return { s, lines };
}

export function sameDenominator(op: Op): Problem {
  const v = V();
  const [A, B] = monicFactors(2, v);
  const D = A.mul(B);
  // Make the result simplify about half the time.
  const S = Math.random() < 0.5 ? A.scale(pick([1, 2, 3])) : lin(randInt(1, 5), nz(9), v);
  const n1 = lin(randInt(1, 6), nz(9), v);
  const n2 = op === '+' ? S.sub(n1) : n1.sub(S);
  if (n2.isZero() || n2.degree() < 0) return sameDenominator(op);
  const { s, lines } = finish(S, D, v);
  const mistakes = op === '-' ? [{ answer: `(${n1.sub(lin(n2.coefs(v)[0], -n2.coefs(v)[1], v)).text()})/(${D.text()})`, feedback: 'Remember to subtract **every** term of the second numerator — put it in parentheses first.' }] : [];
  return {
    skill: 'same',
    prompt: `${op === '+' ? 'Add' : 'Subtract'} and simplify: $\\;${dfrac(n1.tex(), D.tex())} ${opTex(op)} ${dfrac(n2.tex(), D.tex())}$`,
    answer: ratAnswer(s),
    hints: [`The denominators are the same, so ${op === '+' ? 'add' : 'subtract'} the numerators and keep the denominator.`, op === '-' ? `Put the second numerator in parentheses: $${n1.tex()} - (${n2.tex()})$.` : 'Then factor and see if anything cancels.'],
    solution: [`$= ${dfrac(`${n1.tex()} ${opTex(op)} ${op === '-' || n2.coefs(v)[0] < 0 ? `(${n2.tex()})` : n2.tex()}`, D.tex())}$`, ...lines],
    mistakes,
    placeholder: `(2${v} + 1)/(${v} - 3)`,
  };
}

export function oppositeDenominators(op: Op): Problem {
  const v = V();
  const r = randInt(1, 9);
  const L = lin(1, -r, v);
  const n1 = lin(randInt(1, 5), nz(9), v), n2 = lin(randInt(1, 5), nz(9), v);
  // n1/(v − r) op n2/(r − v)  =  n1/(v − r) (op flipped) n2/(v − r)
  const flipped: Op = op === '+' ? '-' : '+';
  const S = n1.add(sgn(flipped, n2));
  if (S.isZero()) return oppositeDenominators(op);
  const { s, lines } = finish(S, L, v);
  return {
    skill: 'opposite',
    prompt: `${op === '+' ? 'Add' : 'Subtract'} and simplify: $\\;${dfrac(n1.tex(), L.tex())} ${opTex(op)} ${dfrac(n2.tex(), ascTex(L.neg()))}$`,
    answer: ratAnswer(s),
    hints: [`The denominators are opposites. Multiply the second fraction by $\\frac{-1}{-1}$ so its denominator becomes $${L.tex()}$.`, `That changes the ${op === '+' ? 'addition into a subtraction' : 'subtraction into an addition'}.`],
    solution: [`$= ${dfrac(n1.tex(), L.tex())} ${opTex(flipped)} ${dfrac(n2.tex(), L.tex())}$`, `$= ${dfrac(`${n1.tex()} ${opTex(flipped)} ${flipped === '-' ? `(${n2.tex()})` : n2.tex()}`, L.tex())}$`, ...lines],
    placeholder: `(3${v} - 2)/(${v} - 5)`,
  };
}

export function differentDenominators(op: Op): Problem {
  const v = V();
  const [A, B] = monicFactors(2, v);
  const p = randInt(1, 7), q = randInt(1, 7);
  const N = Poly.const(p).mul(B).add(sgn(op, Poly.const(q).mul(A)));
  if (N.isZero()) return differentDenominators(op);
  const D = A.mul(B);
  const { s, lines } = finish(N, D, v);
  return {
    skill: 'different',
    prompt: `${op === '+' ? 'Add' : 'Subtract'} and simplify: $\\;${dfrac(String(p), A.tex())} ${opTex(op)} ${dfrac(String(q), B.tex())}$`,
    answer: ratAnswer(s),
    hints: [`The LCD is $(${A.tex()})(${B.tex()})$.`, `Multiply the first fraction by $\\frac{${B.tex()}}{${B.tex()}}$ and the second by $\\frac{${A.tex()}}{${A.tex()}}$, then combine the numerators.`],
    solution: [
      `$= ${dfrac(`${p === 1 ? '' : p}(${B.tex()})`, `(${A.tex()})(${B.tex()})`)} ${opTex(op)} ${dfrac(`${q === 1 ? '' : q}(${A.tex()})`, `(${A.tex()})(${B.tex()})`)}$`,
      `$= ${dfrac(`${Poly.const(p).mul(B).tex()} ${opTex(op)} (${Poly.const(q).mul(A).tex()})`, ftex(D, v))}$`,
      ...lines,
    ],
    mistakes: [{ answer: `(${p + (op === '+' ? q : -q)})/(${A.add(sgn(op, B)).text()})`, feedback: 'You can\'t add or subtract the denominators. Rewrite both fractions with the LCD first.' }],
    placeholder: `(5${v} + 2)/((${v} + 1)(${v} - 3))`,
  };
}

export function factorFirst(op: Op): Problem {
  const v = V();
  const [A, B] = monicFactors(2, v);
  const D1 = A.mul(B);
  const p = randInt(1, 9), q = randInt(1, 5);
  // p/(A·B) op q/A  →  (p op q·B)/(A·B)
  const N = Poly.const(p).add(sgn(op, B.scale(q)));
  const { s, lines } = finish(N, D1, v);
  return {
    skill: 'factor',
    prompt: `${op === '+' ? 'Add' : 'Subtract'} and simplify: $\\;${dfrac(String(p), D1.tex())} ${opTex(op)} ${dfrac(String(q), A.tex())}$`,
    answer: ratAnswer(s),
    hints: [`Factor the first denominator: $${D1.tex()} = (${A.tex()})(${B.tex()})$. That is the LCD.`, `Multiply the second fraction by $\\frac{${B.tex()}}{${B.tex()}}$.`],
    solution: [`$= ${dfrac(String(p), `(${A.tex()})(${B.tex()})`)} ${opTex(op)} ${dfrac(`${q === 1 ? '' : q}(${B.tex()})`, `(${A.tex()})(${B.tex()})`)}$`, ...lines],
    placeholder: `(2${v} + 7)/((${v} + 1)(${v} - 3))`,
  };
}

export const skills: Skill[] = [
  { id: 'same', label: 'Same denominator', generate: () => sameDenominator('+') },
  { id: 'opposite', label: 'Opposite denominators', generate: () => oppositeDenominators('+') },
  { id: 'different', label: 'Different denominators', generate: () => differentDenominators('+') },
  { id: 'factor', label: 'Factor to find the LCD', generate: () => factorFirst('+') },
];

export const masterySet = makeMasterySet(skills);
