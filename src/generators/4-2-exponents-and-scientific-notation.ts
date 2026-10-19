// Practice problem generators for Lesson 4.2 — Exponents and Scientific Notation.
import { monoStr } from '../lib/poly';
import { fmt, makeMasterySet, nz, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 'a', 'm', 't']);
const ex = (v: string, k: number) => (k === 1 ? v : `${v}^{${k}}`);

function powerRule(): Problem {
  const v = V();
  const m = randInt(2, 7);
  const n = randInt(2, 6);
  return {
    skill: 'power',
    prompt: `Simplify: $\\;(${v}^{${m}})^{${n}}$`,
    answer: { type: 'expression', value: `${v}^${m * n}` },
    hints: ['**Power rule:** $(a^m)^n = a^{mn}$ — **multiply** the exponents.'],
    solution: [`$(${v}^{${m}})^{${n}} = ${v}^{${m} \\cdot ${n}} = ${v}^{${m * n}}$`],
    mistakes: [{ answer: `${v}^${m + n}`, feedback: 'You added the exponents. For a power of a power, **multiply** them: $(a^m)^n = a^{mn}$.' }],
    placeholder: `e.g. ${v}^12`,
  };
}

function productPower(): Problem {
  const [v, w] = pick([['x', 'y'], ['a', 'b'], ['m', 'n']]);
  const c = nz(4, 2);
  const p1 = randInt(1, 4);
  const p2 = randInt(0, 3);
  const n = c === 2 || c === -2 ? randInt(2, 4) : randInt(2, 3);
  const vars: Record<string, number> = { [v]: p1 * n };
  if (p2) vars[w] = p2 * n;
  const coef = c ** n;
  const inside = monoStr(c, p2 ? { [v]: p1, [w]: p2 } : { [v]: p1 }, true);
  return {
    skill: 'product',
    prompt: `Simplify: $\\;\\left(${inside}\\right)^{${n}}$`,
    answer: { type: 'expression', value: monoStr(coef, vars, false) },
    hints: ['**Raise each factor** to the power: $(ab)^n = a^n b^n$. Don\'t forget the number in front.', ...(c < 0 ? [`$(${c})^{${n}}$ is ${n % 2 ? 'negative' : 'positive'}.`] : [])],
    solution: [`$= ${c < 0 ? `(${c})` : c}^{${n}} \\cdot ${p2 ? `(${ex(v, p1)})^{${n}} (${ex(w, p2)})^{${n}}` : `(${ex(v, p1)})^{${n}}`}$`, `$= ${monoStr(coef, vars, true)}$`],
    mistakes: [{ answer: monoStr(c, vars, false), feedback: `Raise the coefficient to the power too: $(${c})^{${n}} = ${coef}$.` }],
    placeholder: 'e.g. 16x^8y^4',
  };
}

function quotientPower(): Problem {
  const v = V();
  const p1 = randInt(1, 5);
  const d = randInt(2, 5);
  const n = randInt(2, 3);
  return {
    skill: 'quotient',
    prompt: `Simplify: $\\;\\left(\\dfrac{${ex(v, p1)}}{${d}}\\right)^{${n}}$`,
    answer: { type: 'expression', value: `${v}^${p1 * n}/${d ** n}` },
    hints: ['**Raise the numerator and the denominator** to the power: $\\left(\\dfrac{a}{b}\\right)^n = \\dfrac{a^n}{b^n}$.'],
    solution: [`$= \\dfrac{(${ex(v, p1)})^{${n}}}{${d}^{${n}}} = \\dfrac{${ex(v, p1 * n)}}{${d ** n}}$`],
    mistakes: [{ answer: `${v}^${p1 * n}/${d}`, feedback: `Raise the denominator too: $${d}^{${n}} = ${d ** n}$.` }],
    placeholder: `e.g. ${v}^6/27`,
  };
}

// ---------- Scientific notation ----------

/** A number as a × 10^n in TeX. */
const sciTex = (a: number, n: number) => `${fmt(a)} \\times 10^{${n}}`;

function toSci(): Problem {
  const digits = pick([1, 2, 3]);
  const a = +(randInt(10 ** (digits - 1), 10 ** digits - 1) / 10 ** (digits - 1)).toFixed(digits - 1);
  const lead = a < 1 ? a * 10 : a;
  const n = pick([randInt(3, 9), -randInt(2, 8)]);
  const value = +(lead * 10 ** n).toPrecision(digits);
  const std = n >= 0 ? value.toLocaleString('en-US', { useGrouping: true, maximumFractionDigits: 0 }) : value.toFixed(-n + digits - 1);
  return {
    skill: 'tosci',
    prompt: `Write in scientific notation: $\\;${std.replace(/,/g, '{,}')}$. (Type it like 3.2*10^5.)`,
    answer: { type: 'number', value, sci: true },
    hints: [
      'Move the decimal point so there is exactly **one non-zero digit** in front of it.',
      n >= 0 ? 'A large number gets a **positive** power of 10: count how many places you moved the point.' : 'A small number (less than 1) gets a **negative** power of 10.',
    ],
    solution: [`Move the decimal point $${Math.abs(n)}$ places ${n >= 0 ? 'left' : 'right'}: $\\;${sciTex(lead, n)}$`],
    placeholder: 'e.g. 4.7*10^-3',
  };
}

function fromSci(): Problem {
  const a = +(randInt(11, 99) / 10).toFixed(1);
  const n = pick([randInt(2, 7), -randInt(1, 6)]);
  const value = +(a * 10 ** n).toPrecision(2);
  return {
    skill: 'fromsci',
    prompt: `Write in decimal (standard) notation: $\\;${sciTex(a, n)}$`,
    answer: { type: 'number', value },
    hints: [n >= 0 ? `A positive exponent: move the decimal point $${n}$ places to the **right** (the number gets bigger).` : `A negative exponent: move the decimal point $${-n}$ places to the **left** (the number gets smaller).`],
    solution: [`$${sciTex(a, n)} = ${n >= 0 ? value.toLocaleString('en-US').replace(/,/g, '{,}') : value.toFixed(-n + 1)}$`],
    mistakes: [{ answer: String(+(a * 10 ** -n).toPrecision(2)), feedback: 'You moved the decimal point the wrong way. A positive exponent makes the number larger; a negative one makes it smaller.' }],
  };
}

function sciArithmetic(): Problem {
  const a = +(randInt(11, 49) / 10).toFixed(1);
  const b = +(randInt(11, 49) / 10).toFixed(1);
  const m = randInt(-6, 9);
  const n = randInt(-6, 9);
  const op = pick(['mul', 'div'] as const);
  let c = op === 'mul' ? a * b : a / b;
  let e = op === 'mul' ? m + n : m - n;
  const raw = c;
  const rawE = e;
  while (Math.abs(c) >= 10) { c /= 10; e++; }
  while (Math.abs(c) < 1) { c *= 10; e--; }
  const cr = op === 'mul' ? +c.toPrecision(8) : +c.toPrecision(3);
  return {
    skill: 'arith',
    prompt: `${op === 'mul' ? 'Multiply' : 'Divide'} and write the answer in scientific notation${op === 'div' ? ' (round to 3 significant digits)' : ''}: $\\;(${sciTex(a, m)})${op === 'mul' ? ' \\cdot ' : ' \\div '}(${sciTex(b, n)})$`,
    answer: { type: 'number', value: cr * 10 ** e, sci: true },
    hints: [op === 'mul' ? 'Multiply the decimal parts and **add** the exponents.' : 'Divide the decimal parts and **subtract** the exponents.', 'If the decimal part is not between 1 and 10, adjust it and the exponent.'],
    solution: [
      `$(${fmt(a)} ${op === 'mul' ? '\\times' : '\\div'} ${fmt(b)}) \\times 10^{${m} ${op === 'mul' ? '+' : '-'} ${n < 0 ? `(${n})` : n}} = ${+raw.toPrecision(4)} \\times 10^{${rawE}}$`,
      ...(rawE !== e ? [`Adjust: $= ${cr} \\times 10^{${e}}$`] : []),
    ],
    placeholder: 'e.g. 1.2*10^7',
  };
}

export const skills: Skill[] = [
  { id: 'power', label: 'Power rule', generate: powerRule },
  { id: 'product', label: 'Raise a product', generate: productPower },
  { id: 'quotient', label: 'Raise a quotient', generate: quotientPower },
  { id: 'tosci', label: 'To scientific notation', generate: toSci },
  { id: 'fromsci', label: 'To standard notation', generate: fromSci },
  { id: 'arith', label: '× and ÷ in sci. notation', generate: sciArithmetic },
];

export const masterySet = makeMasterySet(skills);
