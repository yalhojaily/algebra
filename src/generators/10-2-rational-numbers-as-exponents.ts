// Practice problem generators for Lesson 10.2 — Rational Numbers as Exponents.
import { fracTex, gcd, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function evaluate(): Problem {
  const [base, n] = pick([[4, 2], [9, 2], [16, 2], [25, 2], [36, 2], [8, 3], [27, 3], [64, 3], [125, 3], [16, 4], [81, 4], [32, 5]] as [number, number][]);
  const r = Math.round(base ** (1 / n));
  let m = pick([1, 2, 3]);
  while (gcd(m, n) !== 1) m = pick([1, 2, 3]);
  const neg = Math.random() < 0.3;
  const val = r ** m;
  const value = neg ? 1 / val : val;
  return {
    skill: 'evaluate',
    prompt: `Evaluate: $\\;${base}^{${neg ? '-' : ''}${m}/${n}}$`,
    answer: { type: 'number', value },
    hints: [`$a^{m/n} = (\\sqrt[n]{a})^m$. Take the root first: $\\sqrt[${n}]{${base}} = ${r}$.`, ...(neg ? ['A negative exponent means the reciprocal: $a^{-k} = \\dfrac{1}{a^k}$.'] : [])],
    solution: [`$${neg ? `\\dfrac{1}{${base}^{${m}/${n}}} = \\dfrac{1}{(${n === 2 ? `\\sqrt{${base}}` : `\\sqrt[${n}]{${base}}`})^{${m}}} = \\dfrac{1}{${r}^{${m}}}` : `(${n === 2 ? `\\sqrt{${base}}` : `\\sqrt[${n}]{${base}}`})^{${m}} = ${r}^{${m}}`} = ${neg ? fracTex(1, val) : val}$`],
    placeholder: neg ? '1/4' : '8',
  };
}

function toRadical(): Problem {
  const n = pick([2, 3]);
  let m = randInt(1, 5);
  while (gcd(m, n) !== 1) m = randInt(1, 5);
  const inner = m === 1 ? 'x' : `x^${m}`;
  const root = n === 2 ? `sqrt(${inner})` : `cbrt(${inner})`;
  return {
    skill: 'toradical',
    prompt: `Write with a radical: $\\;x^{${m}/${n}}$ (Assume $x \\ge 0$. Type sqrt( ) or cbrt( ).)`,
    answer: { type: 'expression', value: root },
    hints: ['$a^{m/n} = \\sqrt[n]{a^m}$: the **denominator** is the index of the root, the **numerator** is the power.'],
    solution: [`$x^{${m}/${n}} = ${n === 2 ? `\\sqrt{${m === 1 ? 'x' : `x^{${m}}`}}` : `\\sqrt[3]{${m === 1 ? 'x' : `x^{${m}}`}}`}$`],
    mistakes: [{ answer: n === 2 ? `cbrt(x^2)`.replace('2', String(m)) : `sqrt(x^3)`.replace('3', String(m)), feedback: 'The denominator of the exponent is the index of the root.' }],
    placeholder: 'cbrt(x^2)',
  };
}

function toExponent(): Problem {
  const n = pick([2, 3, 4, 5]);
  let m = randInt(1, 7);
  while (gcd(m, n) !== 1) m = randInt(1, 7);
  const rootTex = n === 2 ? `\\sqrt{x^{${m}}}` : `\\sqrt[${n}]{x^{${m}}}`;
  return {
    skill: 'toexponent',
    prompt: `Write with a rational exponent: $\\;${rootTex}$ (Assume $x \\ge 0$.)`,
    answer: { type: 'expression', value: `x^(${m}/${n})`, noRadicals: true },
    hints: ['$\\sqrt[n]{a^m} = a^{m/n}$. Put the power on top and the index on the bottom.'],
    solution: [`$${rootTex} = x^{${m}/${n}}$`],
    mistakes: [{ answer: `x^(${n}/${m})`, feedback: 'Upside down: the index of the root goes in the **denominator**.' }],
    placeholder: 'x^(2/3)',
  };
}

function laws(): Problem {
  const kind = pick(['mul', 'div', 'pow'] as const);
  const frac = () => { for (;;) { const p = randInt(1, 4), q = randInt(2, 5); if (gcd(p, q) === 1) return [p, q]; } };
  const [a, b] = frac();
  const [c, d] = frac();
  const F = (p: number, q: number) => { const g = gcd(p, q); return [p / g, q / g]; };
  let num: number, den: number, tex: string;
  if (kind === 'mul') { [num, den] = F(a * d + c * b, b * d); tex = `x^{${a}/${b}} \\cdot x^{${c}/${d}}`; }
  else if (kind === 'div') { [num, den] = F(a * d - c * b, b * d); tex = `\\dfrac{x^{${a}/${b}}}{x^{${c}/${d}}}`; if (num <= 0) return laws(); }
  else { [num, den] = F(a * c, b * d); tex = `\\left(x^{${a}/${b}}\\right)^{${c}/${d}}`; }
  const val = den === 1 ? (num === 1 ? 'x' : `x^${num}`) : `x^(${num}/${den})`;
  return {
    skill: 'laws',
    prompt: `Simplify and write with a single exponent: $\\;${tex}$ (Assume $x > 0$.)`,
    answer: { type: 'expression', value: val, combined: true, noRadicals: true },
    hints: [kind === 'mul' ? 'Same base, multiplying: **add** the exponents.' : kind === 'div' ? 'Same base, dividing: **subtract** the exponents.' : 'Power of a power: **multiply** the exponents.', 'Use a common denominator for the fractions.'],
    solution: [`$= x^{${kind === 'mul' ? `${a}/${b} + ${c}/${d}` : kind === 'div' ? `${a}/${b} - ${c}/${d}` : `(${a}/${b})(${c}/${d})`}} = x^{${den === 1 ? num : `${num}/${den}`}}$`],
    placeholder: 'x^(5/6)',
  };
}

export const skills: Skill[] = [
  { id: 'evaluate', label: 'Evaluate', generate: evaluate },
  { id: 'toradical', label: 'Exponent → radical', generate: toRadical },
  { id: 'toexponent', label: 'Radical → exponent', generate: toExponent },
  { id: 'laws', label: 'Laws of exponents', generate: laws },
];

export const masterySet = makeMasterySet(skills);
