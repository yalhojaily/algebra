// Practice problem generators for Lesson 1.6 — Division of Real Numbers.
import { choice, coprimeTo, fracIn, fracTex, makeMasterySet, nz, p, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const signRule = (a: number, b: number) =>
  Math.sign(a) === Math.sign(b) ? 'Same signs → the quotient is **positive**.' : 'Different signs → the quotient is **negative**.';

function divIntegers(): Problem {
  const q = nz(12);
  const b = nz(12);
  const a = q * b;
  const form = pick(['div', 'frac'] as const);
  const tex = form === 'div' ? `${a} \\div ${p(b)}` : `\\dfrac{${a}}{${b}}`;
  return {
    skill: 'integers',
    prompt: `Divide: $\\;${tex}$`,
    answer: { type: 'number', value: q },
    hints: ['Divide the absolute values. Same signs → positive; different signs → negative (the same rules as multiplication).', `Check: what number times $${b}$ equals $${a}$?`],
    solution: [`$${Math.abs(a)} \\div ${Math.abs(b)} = ${Math.abs(q)}$`, `${signRule(a, b)} So the quotient is $${q}$.`, `Check: $${q} \\cdot ${p(b)} = ${a}$ ✓`],
    mistakes: [{ answer: String(-q), feedback: 'The size is right but the sign is wrong. ' + signRule(a, b) }],
  };
}

function zero(): Problem {
  const n = nz(30);
  const zeroTop = Math.random() < 0.5;
  const tex = zeroTop ? `\\dfrac{0}{${n}}` : `\\dfrac{${n}}{0}`;
  return {
    skill: 'zero',
    prompt: `Divide, if possible: $\\;${tex}$`,
    answer: choice(zeroTop ? '$0$' : 'Undefined', zeroTop ? ['Undefined', `$${n}$`, '$1$'] : ['$0$', `$${n}$`, '$1$']),
    hints: [zeroTop ? `What number times $${n}$ gives $0$?` : `Is there any number that, multiplied by $0$, gives $${n}$?`],
    solution: zeroTop
      ? [`$0 \\cdot ${p(n)} = 0$, so $\\dfrac{0}{${n}} = 0$. Zero divided by any non-zero number is $0$.`]
      : [`Any number times $0$ is $0$ — never $${n}$. No number works, so $\\dfrac{${n}}{0}$ is **undefined**. You can never divide by zero.`],
  };
}

function reciprocal(): Problem {
  const kind = pick(['int', 'frac', 'frac', 'dec'] as const);
  if (kind === 'int') {
    const n = nz(12, 2);
    return {
      skill: 'reciprocal',
      prompt: `Find the reciprocal of $${n}$. (A fraction is fine.)`,
      answer: { type: 'number', value: 1 / n },
      hints: ['Two numbers are reciprocals when their product is $1$. Write the integer over $1$ and flip it.'],
      solution: [`$${n} = \\dfrac{${n}}{1}$, so its reciprocal is $${fracTex(1, n)}$. Check: $${n} \\cdot ${p(fracTex(1, n))} = 1$ ✓`],
      mistakes: [{ answer: String(-n), feedback: 'That is the **opposite** (additive inverse). The reciprocal multiplies with the number to give $1$.' }, { answer: fracIn(-1, n), feedback: 'A number and its reciprocal always have the **same** sign.' }],
      placeholder: 'e.g. -1/5',
    };
  }
  if (kind === 'frac') {
    const d = randInt(2, 9);
    let n = nz(9);
    while (Math.abs(n) === d) n = nz(9);
    return {
      skill: 'reciprocal',
      prompt: `Find the reciprocal of $${fracTex(n, d)}$. (A fraction is fine.)`,
      answer: { type: 'number', value: d / n },
      hints: ['Flip the fraction. The sign stays the same.'],
      solution: [`The reciprocal of $${fracTex(n, d)}$ is $${fracTex(d, n)}$, because $${fracTex(n, d)} \\cdot ${p(fracTex(d, n))} = 1$.`],
      mistakes: [{ answer: fracIn(-d, n), feedback: 'Flip the fraction but keep the sign: reciprocals have the same sign.' }],
      placeholder: 'e.g. -7/3',
    };
  }
  const x = pick([0.5, 0.25, 0.2, -0.5, -0.25, -0.2, 0.125, -0.4, 1.25]);
  return {
    skill: 'reciprocal',
    prompt: `Find the reciprocal of $${x}$.`,
    answer: { type: 'number', value: 1 / x },
    hints: ['Write the decimal as a fraction first, then flip it.'],
    solution: [`$${x} = ${fracTex(Math.round(x * 1000), 1000)}$, so its reciprocal is $${fmtRecip(x)}$.`],
  };
}

const fmtRecip = (x: number) => String(+(1 / x).toFixed(6));

function divFractions(): Problem {
  const d1 = pick([2, 3, 4, 5, 6, 7, 9]);
  const d2 = pick([2, 3, 4, 5, 7, 8]);
  const n1 = coprimeTo(d1, d1 * 2);
  const n2 = coprimeTo(d2, 9);
  const value = (n1 / d1) / (n2 / d2);
  return {
    skill: 'fractions',
    prompt: `Divide: $\\;${fracTex(n1, d1)} \\div ${p(fracTex(n2, d2))}$. (A fraction is fine.)`,
    answer: { type: 'number', value },
    hints: ['To divide, multiply by the **reciprocal** of the divisor.', `The reciprocal of $${fracTex(n2, d2)}$ is $${fracTex(d2, n2)}$.`],
    solution: [
      `$${fracTex(n1, d1)} \\div ${p(fracTex(n2, d2))} = ${fracTex(n1, d1)} \\cdot ${p(fracTex(d2, n2))}$`,
      `$= ${fracTex(n1 * d2, d1 * n2)}$`,
    ],
    mistakes: [{ answer: fracIn(n1 * n2, d1 * d2), feedback: 'You multiplied straight across. For division, first flip the second fraction (use its reciprocal).' }],
    placeholder: 'e.g. 8/15',
  };
}

function signsOfFractions(): Problem {
  const a = randInt(1, 9);
  const b = randInt(2, 11);
  return {
    skill: 'signs',
    prompt: `Which expression is **not** equal to $\\;-\\dfrac{${a}}{${b}}$?`,
    answer: choice(`$\\dfrac{-${a}}{-${b}}$`, [`$\\dfrac{-${a}}{${b}}$`, `$\\dfrac{${a}}{-${b}}$`]),
    hints: ['A negative sign can sit in front, in the numerator, or in the denominator — but only **one** of them. Two negatives make a positive.'],
    solution: [`$-\\dfrac{${a}}{${b}} = \\dfrac{-${a}}{${b}} = \\dfrac{${a}}{-${b}}$, but $\\dfrac{-${a}}{-${b}} = \\dfrac{${a}}{${b}}$ is **positive**.`],
  };
}

export const skills: Skill[] = [
  { id: 'integers', label: 'Divide integers', generate: divIntegers },
  { id: 'zero', label: 'Zero & undefined', generate: zero },
  { id: 'reciprocal', label: 'Reciprocals', generate: reciprocal },
  { id: 'fractions', label: 'Divide fractions', generate: divFractions },
  { id: 'signs', label: 'Signs of fractions', generate: signsOfFractions },
];

export const masterySet = makeMasterySet(skills);
