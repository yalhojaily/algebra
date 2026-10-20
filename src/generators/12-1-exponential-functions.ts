// Practice problem generators for Lesson 12.1 — Exponential Functions.
import { choice, fmt, fracTex, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function evaluate(): Problem {
  const base = pick([2, 3, 4, 5, 10]), a = pick([1, 1, 2, 3, 5]);
  const x = randInt(-3, 4);
  const val = a * base ** x;
  const exact = x >= 0 ? String(val) : fracTex(a, base ** -x);
  return {
    skill: 'evaluate',
    prompt: `For $f(x) = ${a === 1 ? '' : a}${a === 1 ? '' : '\\cdot '}${base}^x$, find $f(${x})$.`,
    answer: { type: 'number', value: val },
    hints: [`Substitute: $f(${x}) = ${a === 1 ? '' : `${a} \\cdot `}${base}^{${x}}$.`, ...(x < 0 ? [`A negative exponent means a reciprocal: $${base}^{${x}} = \\dfrac{1}{${base}^{${-x}}}$.`] : [])],
    solution: [`$f(${x}) = ${a === 1 ? '' : `${a} \\cdot `}${base}^{${x}} = ${exact}$`],
    mistakes: [{ answer: String(a * base * x), feedback: `$${base}^{${x}}$ means ${base} used as a factor ${Math.abs(x)} times — not $${base} \\cdot ${x}$.` }],
  };
}

function growthOrDecay(): Problem {
  const b = pick([2, 3, 1.5, 0.5, 0.25, 0.8, 5, 0.1]);
  const neg = Math.random() < 0.3;
  const growth = neg ? b < 1 : b > 1;
  const bTex = Number.isInteger(b) ? String(b) : b === 0.5 ? '\\left(\\tfrac{1}{2}\\right)' : b === 0.25 ? '\\left(\\tfrac{1}{4}\\right)' : `(${b})`;
  const f = neg ? `${bTex}^{-x}` : `${bTex}^x`;
  return {
    skill: 'type',
    prompt: `Is $\\;f(x) = ${f}\\;$ exponential growth or exponential decay?`,
    answer: choice(growth ? 'Growth (increasing)' : 'Decay (decreasing)', [growth ? 'Decay (decreasing)' : 'Growth (increasing)']),
    hints: ['$b^x$ grows when $b > 1$ and decays when $0 < b < 1$.', ...(neg ? ['$b^{-x} = \\left(\\frac{1}{b}\\right)^x$.'] : [])],
    solution: [neg ? `$${bTex}^{-x} = \\left(\\frac{1}{${fmt(b)}}\\right)^x$, and $\\frac{1}{${fmt(b)}} ${1 / b > 1 ? '> 1' : '< 1'}$: ${growth ? 'growth' : 'decay'}.` : `$b = ${fmt(b)} ${b > 1 ? '> 1' : '< 1'}$: ${growth ? 'growth' : 'decay'}.`],
  };
}

function yIntercept(): Problem {
  const a = pick([1, 2, 3, 5, -1]), b = pick([2, 3, 0.5, 4]), k = randInt(-3, 3);
  const val = a + k;
  return {
    skill: 'intercept',
    prompt: `What is the $y$-intercept of $\\;f(x) = ${a === 1 ? '' : a === -1 ? '-' : `${a} \\cdot `}${b === 0.5 ? '\\left(\\tfrac{1}{2}\\right)' : b}^x${k ? ` ${k < 0 ? '-' : '+'} ${Math.abs(k)}` : ''}$? (Write it as a point.)`,
    answer: { type: 'point', x: 0, y: val },
    hints: ['Set $x = 0$. Any nonzero number to the power $0$ is $1$.'],
    solution: [`$f(0) = ${a} \\cdot ${b === 0.5 ? '\\left(\\tfrac{1}{2}\\right)' : b}^0${k ? ` ${k < 0 ? '-' : '+'} ${Math.abs(k)}` : ''} = ${a}${k ? ` ${k < 0 ? '-' : '+'} ${Math.abs(k)}` : ''} = ${val}$, so the $y$-intercept is $(0, ${val})$.`],
    placeholder: '(0, 3)',
  };
}

function compound(): Problem {
  const P = pick([500, 1000, 2000, 2500, 5000]), r = pick([2, 3, 4, 5, 6]) / 100, n = pick([1, 4, 12]), t = randInt(2, 10);
  const A = P * (1 + r / n) ** (n * t);
  const nWord = { 1: 'annually', 4: 'quarterly', 12: 'monthly' }[n]!;
  return {
    skill: 'interest',
    prompt: `${P} dollars is invested at ${r * 100}% interest compounded ${nWord}. How much is in the account after ${t} years? (Round to the nearest cent.)`,
    answer: { type: 'number', value: Math.round(A * 100) / 100, tol: 0.011 },
    hints: ['$A = P\\left(1 + \\dfrac{r}{n}\\right)^{nt}$', `$P = ${P},\\ r = ${r},\\ n = ${n},\\ t = ${t}$`],
    solution: [`$A = ${P}\\left(1 + \\dfrac{${r}}{${n}}\\right)^{${n * t}} \\approx ${A.toFixed(2)}$ dollars`],
    placeholder: '1219.39',
  };
}

export const skills: Skill[] = [
  { id: 'evaluate', label: 'Evaluate', generate: evaluate },
  { id: 'type', label: 'Growth or decay?', generate: growthOrDecay },
  { id: 'intercept', label: 'y-intercept', generate: yIntercept },
  { id: 'interest', label: 'Compound interest', generate: compound },
];

export const masterySet = makeMasterySet(skills);
