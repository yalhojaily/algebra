// Practice problem generators for Lesson 4.1 — Integers as Exponents.
import { makeMasterySet, nz, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 'a', 'n', 't']);
/** x^k in TeX/text with positive exponents only, e.g. x^{5}, \frac{1}{x^{3}}, 1 */
const powTex = (v: string, k: number) => (k === 0 ? '1' : k === 1 ? v : k > 0 ? `${v}^{${k}}` : `\\dfrac{1}{${v}^{${-k}}}`);
const powText = (v: string, k: number) => (k === 0 ? '1' : k === 1 ? v : k > 0 ? `${v}^${k}` : `1/${v}^${-k}`);
const ex = (v: string, k: number) => (k === 1 ? v : `${v}^{${k}}`);

function evaluate(): Problem {
  const kind = pick(['zero', 'one', 'neg', 'negfrac'] as const);
  if (kind === 'zero') {
    const b = pick(['7', '(-4)', '128', '0.5', '\\left(\\tfrac{3}{4}\\right)', '(-2)', 'x', '(5y)']);
    return {
      skill: 'evaluate',
      prompt: `Evaluate: $\\;${b}^{0}$${/[xy]/.test(b) ? ' (assume the variable is not 0)' : ''}.`,
      answer: { type: 'number', value: 1 },
      hints: ['Any non-zero number raised to the power $0$ is $1$.'],
      solution: [`$${b}^{0} = 1$`],
      mistakes: [{ answer: '0', feedback: 'It is tempting, but $a^0 = 1$ for any $a \\ne 0$. Think of $\\frac{a^3}{a^3} = 1$.' }],
    };
  }
  if (kind === 'one') {
    const b = nz(30, 2);
    return { skill: 'evaluate', prompt: `Evaluate: $\\;${b < 0 ? `(${b})` : b}^{1}$.`, answer: { type: 'number', value: b }, hints: ['Any number to the first power is itself.'], solution: [`$${b < 0 ? `(${b})` : b}^{1} = ${b}$`] };
  }
  const base = pick([2, 3, 4, 5, 10]);
  const k = base === 2 ? randInt(1, 5) : randInt(1, 3);
  if (kind === 'neg')
    return {
      skill: 'evaluate',
      prompt: `Evaluate: $\\;${base}^{-${k}}$. (A fraction is fine.)`,
      answer: { type: 'number', value: base ** -k },
      hints: ['A negative exponent means "one over": $a^{-n} = \\dfrac{1}{a^n}$.'],
      solution: [`$${base}^{-${k}} = \\dfrac{1}{${base}^{${k}}} = \\dfrac{1}{${base ** k}}$`],
      mistakes: [{ answer: String(-(base ** k)), feedback: 'A negative exponent does **not** make the number negative. It means take the reciprocal: $\\frac{1}{' + base ** k + '}$.' }],
      placeholder: 'e.g. 1/8',
    };
  return {
    skill: 'evaluate',
    prompt: `Evaluate: $\\;\\dfrac{1}{${base}^{-${k}}}$.`,
    answer: { type: 'number', value: base ** k },
    hints: ['$\\dfrac{1}{a^{-n}} = a^n$: a negative exponent in the denominator moves up to the numerator as a positive exponent.'],
    solution: [`$\\dfrac{1}{${base}^{-${k}}} = ${base}^{${k}} = ${base ** k}$`],
  };
}

function productRule(): Problem {
  const v = V();
  const m = randInt(-4, 9);
  const n = randInt(-4, 9);
  const withCoef = Math.random() < 0.4;
  const a = withCoef ? nz(6, 2) : 1;
  const b = withCoef ? nz(6, 2) : 1;
  const k = m + n;
  const c = a * b;
  const coefTex = (x: number) => (x === 1 ? '' : x === -1 ? '-' : String(x));
  const ansText = c === 1 ? powText(v, k) : k < 0 ? `${c}/${v}^${-k}` : k === 0 ? String(c) : `${c}${k === 1 ? v : `${v}^${k}`}`;
  const ansTex = c === 1 ? powTex(v, k) : k < 0 ? `\\dfrac{${c}}{${ex(v, -k)}}` : k === 0 ? String(c) : `${c}${ex(v, k)}`;
  return {
    skill: 'product',
    prompt: `Multiply and simplify. Write the answer with positive exponents: $\\;${coefTex(a)}${ex(v, m)} \\cdot ${b < 0 ? `(${coefTex(b)}${ex(v, n)})` : `${coefTex(b)}${ex(v, n)}`}$`,
    answer: { type: 'expression', value: ansText, positiveExponents: true },
    hints: ['**Product rule:** $a^m \\cdot a^n = a^{m+n}$ — when multiplying with the same base, **add** the exponents.', ...(withCoef ? ['Multiply the coefficients separately.'] : [])],
    solution: [
      `${withCoef ? `$${a} \\cdot ${b < 0 ? `(${b})` : b} = ${c}$, and ` : ''}$${ex(v, m)} \\cdot ${ex(v, n)} = ${v}^{${m} + ${n < 0 ? `(${n})` : n}} = ${v}^{${k}}$`,
      `$= ${ansTex}$`,
    ],
    mistakes: [{ answer: c === 1 ? powText(v, m * n) : `${c}${v}^${m * n}`, feedback: 'You multiplied the exponents. With the **same base**, multiplying means **adding** exponents.' }],
    placeholder: `e.g. ${v}^7`,
  };
}

function quotientRule(): Problem {
  const v = V();
  const m = randInt(-3, 10);
  const n = randInt(-3, 10);
  const k = m - n;
  return {
    skill: 'quotient',
    prompt: `Divide and simplify. Write the answer with positive exponents: $\\;\\dfrac{${ex(v, m)}}{${ex(v, n)}}$`,
    answer: { type: 'expression', value: powText(v, k), positiveExponents: true },
    hints: ['**Quotient rule:** $\\dfrac{a^m}{a^n} = a^{m-n}$ — **subtract** the exponent in the denominator from the exponent in the numerator.'],
    solution: [`$${v}^{${m} - ${n < 0 ? `(${n})` : n}} = ${v}^{${k}}$`, ...(k < 0 ? [`$= ${powTex(v, k)}$ — rewrite the negative exponent`] : [])],
    mistakes: [{ answer: powText(v, n - m), feedback: 'Subtract in the right order: (top exponent) − (bottom exponent).' }],
    placeholder: `e.g. 1/${v}^3`,
  };
}

function negative(): Problem {
  const v = V();
  const k = randInt(1, 8);
  const kind = pick(['down', 'up', 'coef'] as const);
  if (kind === 'down')
    return {
      skill: 'negative',
      prompt: `Write with a positive exponent: $\\;${v}^{-${k}}$`,
      answer: { type: 'expression', value: `1/${v}^${k}`, positiveExponents: true },
      hints: ['$a^{-n} = \\dfrac{1}{a^n}$.'],
      solution: [`$${v}^{-${k}} = \\dfrac{1}{${ex(v, k)}}$`],
      mistakes: [{ answer: `-${v}^${k}`, feedback: 'A negative exponent is not a negative number. It means "reciprocal": $\\frac{1}{' + ex(v, k) + '}$.' }],
      placeholder: `e.g. 1/${v}^2`,
    };
  if (kind === 'up')
    return {
      skill: 'negative',
      prompt: `Write with a positive exponent: $\\;\\dfrac{1}{${v}^{-${k}}}$`,
      answer: { type: 'expression', value: `${v}^${k}`, positiveExponents: true },
      hints: ['$\\dfrac{1}{a^{-n}} = a^n$.'],
      solution: [`$\\dfrac{1}{${v}^{-${k}}} = ${ex(v, k)}$`],
    };
  const c = nz(9, 2);
  return {
    skill: 'negative',
    prompt: `Write with a positive exponent: $\\;${c}${v}^{-${k}}$`,
    answer: { type: 'expression', value: `${c}/${v}^${k}`, positiveExponents: true },
    hints: [`The exponent $-${k}$ belongs to $${v}$ only, not to $${c}$.`],
    solution: [`$${c}${v}^{-${k}} = ${c} \\cdot \\dfrac{1}{${ex(v, k)}} = \\dfrac{${c}}{${ex(v, k)}}$`],
    mistakes: [{ answer: `1/(${c}${v}^${k})`, feedback: `Only $${v}$ has the negative exponent, so only $${v}$ moves to the denominator. The $${c}$ stays on top.` }],
    placeholder: `e.g. 5/${v}^2`,
  };
}

function mixed(): Problem {
  const v = V();
  const m = randInt(-5, 6), n = randInt(-5, 6), q = randInt(-5, 6);
  const k = m + n - q;
  return {
    skill: 'mixed',
    prompt: `Simplify. Write the answer with positive exponents: $\\;\\dfrac{${ex(v, m)} \\cdot ${ex(v, n)}}{${ex(v, q)}}$`,
    answer: { type: 'expression', value: powText(v, k), positiveExponents: true },
    hints: ['Use the product rule on top, then the quotient rule.'],
    solution: [`Top: $${v}^{${m + n}}$`, `$\\dfrac{${v}^{${m + n}}}{${ex(v, q)}} = ${v}^{${k}}$${k < 0 ? ` $= ${powTex(v, k)}$` : k === 0 ? ' $= 1$' : ''}`],
    placeholder: `e.g. ${v}^4`,
  };
}

export const skills: Skill[] = [
  { id: 'evaluate', label: '0, 1 & negative exponents', generate: evaluate },
  { id: 'product', label: 'Product rule', generate: productRule },
  { id: 'quotient', label: 'Quotient rule', generate: quotientRule },
  { id: 'negative', label: 'Negative exponents', generate: negative },
  { id: 'mixed', label: 'Mixed', generate: mixed },
];

export const masterySet = makeMasterySet(skills);
