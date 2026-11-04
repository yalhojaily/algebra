// Practice problem generators for Lesson 5.5 — Factoring Trinomial Squares and Differences of Squares.
import { choice, factoredAnswer, gcd, lin, makeMasterySet, par, parTex, pick, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 'a', 't']);

function trinomialSquare(): Problem {
  const v = V();
  const a = pick([1, 1, 2, 3, 4, 5]);
  let b = randInt(1, 9) * pick([1, -1]);
  while (gcd(a, b) !== 1) b = randInt(1, 9) * pick([1, -1]);
  const F = Poly.fromCoefs([a, b], v);
  const P = F.mul(F);
  return {
    skill: 'square',
    prompt: `Factor: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${par(F)}^2`),
    hints: [
      `Is it a trinomial square? Check that the first and last terms are squares: $(${Poly.mono(a, { [v]: 1 }).tex()})^2$ and $${Math.abs(b)}^2$.`,
      `Then check the middle term: $2 \\cdot ${Poly.mono(a, { [v]: 1 }).tex()} \\cdot ${Math.abs(b)} = ${Poly.mono(2 * a * Math.abs(b), { [v]: 1 }).tex()}$. The sign of the middle term goes inside: $A^2 ${b < 0 ? '-' : '+'} 2AB + B^2 = (A ${b < 0 ? '-' : '+'} B)^2$.`,
    ],
    solution: [`$A = ${Poly.mono(a, { [v]: 1 }).tex()}$, $B = ${Math.abs(b)}$`, `$= ${parTex(F)}^2$`],
    mistakes: [{ answer: `${par(Poly.fromCoefs([a, -b], v))}^2`, feedback: 'The sign inside the parentheses matches the sign of the **middle** term.' }],
    placeholder: `(${v} - 3)^2`,
  };
}

function differenceOfSquares(): Problem {
  const v = V();
  const a = pick([1, 1, 2, 3, 4, 5, 6]);
  let b = randInt(1, 10);
  while (gcd(a, b) !== 1) b = randInt(1, 10);
  const e = pick([1, 1, 1, 2]);
  const A = Poly.mono(a, { [v]: e });
  const plus = A.add(Poly.const(b)), minus = A.sub(Poly.const(b));
  const P = plus.mul(minus);
  const isSq = (n: number) => Number.isInteger(Math.sqrt(n));
  // With x^4-type terms, A − B may itself be a difference of squares.
  const further = e === 2 && isSq(a) && isSq(b);
  if (further) {
    const ra = Math.sqrt(a), rb = Math.sqrt(b);
    const m1 = Poly.fromCoefs([ra, -rb], v), m2 = Poly.fromCoefs([ra, rb], v);
    return {
      skill: 'difference',
      prompt: `Factor completely: $\\;${P.tex()}$`,
      answer: factoredAnswer(`${par(plus)}${par(m1)}${par(m2)}`),
      hints: ['$A^2 - B^2 = (A + B)(A - B)$.', `One of the factors is itself a difference of squares — factor it again.`],
      solution: [`$= ${parTex(plus)}${parTex(minus)}$`, `$= ${parTex(plus)}${parTex(m1)}${parTex(m2)}$ — $${minus.tex()}$ is a difference of squares too`],
      placeholder: `(${v}^2 + 4)(${v} + 2)(${v} - 2)`,
    };
  }
  return {
    skill: 'difference',
    prompt: `Factor: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${par(plus)}${par(minus)}`),
    hints: ['A **difference of squares** factors: $A^2 - B^2 = (A + B)(A - B)$.', `Here $A = ${A.tex()}$ and $B = ${b}$.`],
    solution: [`$${P.tex()} = (${A.tex()})^2 - ${b}^2$`, `$= ${parTex(plus)}${parTex(minus)}$`],
    placeholder: `(3${v} + 5)(3${v} - 5)`,
  };
}

function withGCF(): Problem {
  const v = V();
  const g = randInt(2, 5);
  const b = randInt(1, 9);
  const kind = pick(['diff', 'sq'] as const);
  const G = Math.random() < 0.4 ? Poly.mono(g, { [v]: 1 }) : Poly.const(g);
  if (kind === 'diff') {
    const P = G.mul(Poly.fromCoefs([1, 0, -b * b], v));
    return {
      skill: 'gcf',
      prompt: `Factor completely: $\\;${P.tex()}$`,
      answer: factoredAnswer(`${G.text()}${par(Poly.fromCoefs([1, b], v))}${par(Poly.fromCoefs([1, -b], v))}`),
      hints: [`Factor out the GCF, $${G.tex()}$, first. What's left is a difference of squares.`],
      solution: [`$= ${G.tex()}(${v}^2 - ${b * b})$`, `$= ${G.tex()}${parTex(Poly.fromCoefs([1, b], v))}${parTex(Poly.fromCoefs([1, -b], v))}$`],
      placeholder: `3(${v} + 2)(${v} - 2)`,
    };
  }
  const s = b * pick([1, -1]);
  const F = Poly.fromCoefs([1, s], v);
  const P = G.mul(F).mul(F);
  return {
    skill: 'gcf',
    prompt: `Factor completely: $\\;${P.tex()}$`,
    answer: factoredAnswer(`${G.text()}${par(F)}^2`),
    hints: [`Factor out the GCF, $${G.tex()}$, first. What's left is a trinomial square.`],
    solution: [`$= ${G.tex()}${parTex(F.mul(F))}$`, `$= ${G.tex()}${parTex(F)}^2$`],
    placeholder: `2(${v} - 3)^2`,
  };
}

function recognize(): Problem {
  const v = 'x';
  const b = randInt(2, 9);
  const kinds = [
    { tex: `${v}^2 - ${b * b}`, ans: 'Difference of squares' },
    { tex: `${v}^2 + ${b * b}`, ans: 'Neither — a sum of squares is prime' },
    { tex: `${v}^2 + ${2 * b}${v} + ${b * b}`, ans: 'Trinomial square' },
    { tex: `${v}^2 - ${2 * b}${v} + ${b * b}`, ans: 'Trinomial square' },
    { tex: `${v}^2 + ${b}${v} + ${b * b}`, ans: 'Neither — a sum of squares is prime' },
  ];
  const k = pick(kinds);
  const neither = k.ans.startsWith('Neither');
  const label = neither ? 'Neither of these' : k.ans;
  return {
    skill: 'recognize',
    prompt: `Which type is $\\;${k.tex}$?`,
    answer: choice(label, ['Difference of squares', 'Trinomial square', 'Neither of these'].filter((x) => x !== label)),
    hints: ['A difference of squares has **two** square terms with a **minus** between them. A trinomial square has two square terms plus a middle term equal to $\\pm 2AB$.'],
    solution: [neither ? (k.tex.includes(`${b}${v} +`) ? `The middle term would have to be $\\pm ${2 * b}${v}$ for a trinomial square, so this is neither.` : 'A **sum** of squares $A^2 + B^2$ cannot be factored over the real numbers, so this is neither.') : `This is a **${k.ans.toLowerCase()}**.`],
  };
}

function shapeWords(): Problem {
  if (Math.random() < 0.5) {
    const a = pick([1, 2, 3, 4, 5]), b = randInt(1, 9);
    if (gcd(a, b) !== 1) return shapeWords();
    const S = lin(a, b, 'x'), A = S.mul(S);
    return {
      skill: 'apply',
      prompt: `A square ${pick(['tile', 'patio', 'garden', 'courtyard'])} has area $${A.tex()}$ square meters. Find the length of one side.`,
      answer: { type: 'expression', value: S.text() },
      hints: ['Unknown: the side. Key words: the area of a **square** is side², so look for a trinomial square.', `$${A.tex()} = (\\;?\\;)^2$: the first term is $(${a === 1 ? '' : a}x)^2$, the last is $${b}^2$, and the middle should be $2 \\cdot ${a === 1 ? '' : a}x \\cdot ${b}$.`],
      solution: [`$${A.tex()} = ${parTex(S)}^2$`, `Side $= ${S.tex()}$ m`],
      placeholder: '2x + 3',
    };
  }
  const k = randInt(1, 9);
  return {
    skill: 'apply',
    prompt: `A square metal sheet is $x$ cm on a side. A square of side $${k}$ cm is cut out of one corner, leaving area $x^2 - ${k * k}$ cm². Factor the remaining area.`,
    answer: factoredAnswer(`(x + ${k})(x - ${k})`),
    hints: ['Unknown: the factored form. Key words: one square **minus** another square — a difference of squares.', `$A^2 - B^2 = (A + B)(A - B)$ with $A = x$, $B = ${k}$.`],
    solution: [`$x^2 - ${k * k} = x^2 - ${k}^2 = (x + ${k})(x - ${k})$`],
    placeholder: '(x + 3)(x - 3)',
  };
}

export const skills: Skill[] = [
  { id: 'recognize', label: 'Recognize the type', generate: recognize },
  { id: 'square', label: 'Trinomial squares', generate: trinomialSquare },
  { id: 'difference', label: 'Differences of squares', generate: differenceOfSquares },
  { id: 'gcf', label: 'Factor completely', generate: withGCF },
  { id: 'apply', label: 'Word problems', generate: shapeWords },
];

export const masterySet = makeMasterySet(skills);
