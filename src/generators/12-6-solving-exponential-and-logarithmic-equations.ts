// Practice problem generators for Lesson 12.6 — Solving Exponential and Logarithmic Equations.
import { makeMasterySet, nz, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function sameBase(): Problem {
  const [b, B] = pick([[2, 4], [2, 8], [3, 9], [3, 27], [2, 16], [5, 25]] as [number, number][]);
  const k = Math.round(Math.log(B) / Math.log(b));
  const a = randInt(1, 3), c = randInt(-4, 4), x = randInt(-3, 5);
  // b^(a x + c) = B^m where k m = a x + c → need integer m
  const t = a * x + c;
  if (t % k !== 0) return sameBase();
  const m = t / k;
  return {
    skill: 'same',
    prompt: `Solve: $\\;${b}^{${a === 1 ? '' : a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}} = ${B}^{${m}}$`,
    answer: { type: 'solutions', values: [x], variable: 'x' },
    hints: [`Write both sides with base $${b}$: $${B} = ${b}^{${k}}$.`, 'Then set the exponents equal.'],
    solution: [`$${b}^{${a === 1 ? '' : a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}} = ${b}^{${k * m}}$`, `$${a === 1 ? '' : a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${k * m}$, so $x = ${x}$`],
    placeholder: 'x = 2',
  };
}

function takeLogs(): Problem {
  const b = pick([2, 3, 5, 7, 1.05, 1.08]), y = pick([10, 20, 50, 3, 100, 2]);
  if (b === y) return takeLogs();
  const x = Math.log(y) / Math.log(b);
  return {
    skill: 'logs',
    prompt: `Solve: $\\;${b}^x = ${y}$. Give the answer to four decimal places (or as an exact expression).`,
    answer: { type: 'number', value: +x.toFixed(4), tol: 0.00011 },
    hints: ['Take the natural log of both sides: $x \\ln ' + b + ' = \\ln ' + y + '$.', 'Divide: $x = \\dfrac{\\ln ' + y + '}{\\ln ' + b + '}$.'],
    solution: [`$x = \\dfrac{\\ln ${y}}{\\ln ${b}} \\approx ${x.toFixed(4)}$`],
    placeholder: 'ln(20)/ln(3)',
  };
}

function logEq(): Problem {
  const b = pick([2, 3, 5, 10]), e = randInt(1, 3), a = randInt(1, 3), c = nz(8);
  const rhs = b ** e;
  // log_b(a x + c) = e → x = (b^e − c)/a ; keep integer
  if ((rhs - c) % a !== 0) return logEq();
  const x = (rhs - c) / a;
  return {
    skill: 'log',
    prompt: `Solve: $\\;${b === 10 ? '\\log' : `\\log_{${b}}`}(${a === 1 ? '' : a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}) = ${e}$`,
    answer: { type: 'solutions', values: [x], variable: 'x' },
    hints: ['Rewrite in exponential form: $' + `${a === 1 ? '' : a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${b}^{${e}}` + '$.'],
    solution: [`$${a === 1 ? '' : a}x ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${rhs}$, so $x = ${x}$`, `Check: the argument is $${rhs} > 0$ ✓`],
    placeholder: 'x = 7',
  };
}

function logSum(): Problem {
  // log_b x + log_b(x − d) = k  → x(x − d) = b^k ; roots r and −s, reject the negative
  for (;;) {
    const b = pick([2, 3, 10]);
    const k = b === 10 ? 1 : pick([2, 3]);
    const N = b ** k;
    const d = randInt(1, 9);
    // x² − d x − N = 0 integer roots?
    const D = d * d + 4 * N;
    const s = Math.sqrt(D);
    if (!Number.isInteger(s) || (d + s) % 2 !== 0) continue;
    const r1 = (d + s) / 2, r2 = (d - s) / 2;
    const L = b === 10 ? '\\log' : `\\log_{${b}}`;
    return {
      skill: 'sum',
      prompt: `Solve: $\\;${L} x + ${L}(x - ${d}) = ${k}$`,
      answer: { type: 'solutions', values: [r1], variable: 'x' },
      hints: ['Combine with the product rule: $' + L + '[x(x - ' + d + ')] = ' + k + '$.', `Exponential form: $x(x - ${d}) = ${N}$. Solve, then check each answer — logarithms of negative numbers are undefined.`],
      solution: [`$x^2 - ${d}x - ${N} = 0 \\Rightarrow (x - ${r1})(x + ${-r2}) = 0$`, `$x = ${r1}$ or $x = ${r2}$; reject $${r2}$ (it makes $${L} x$ undefined).`, `Solution: $x = ${r1}$`],
      mistakes: [{ answer: `${r1}, ${r2}`, feedback: `Check $x = ${r2}$: $${L}(${r2})$ is not defined.` }, { answer: `${r2}, ${r1}`, feedback: `Check $x = ${r2}$: $${L}(${r2})$ is not defined.` }],
      placeholder: 'x = 8',
    };
  }
}


/** When does an exponential process reach a value? Take logarithms. */
function whenWords(): Problem {
  if (Math.random() < 0.5) {
    const r = pick([3, 4, 5, 6, 7, 8]), k = pick([2, 3, 1.5]);
    const t = Math.log(k) / Math.log(1 + r / 100);
    return {
      skill: 'apply',
      prompt: `Money in an account grows by ${r}% a year, compounded annually: $A = P(1.${String(r).padStart(2, '0')})^t$. How many years until it is **${k === 2 ? 'double' : k === 3 ? 'triple' : '1.5 times'}** the starting amount? Round to the nearest hundredth.`,
      answer: { type: 'number', value: +t.toFixed(2), tol: 0.006 },
      hints: [`Unknown: the time $t$. "${k === 2 ? 'Double' : k === 3 ? 'Triple' : '1.5 times'}" means $A = ${k}P$, so $P(1.${String(r).padStart(2, '0')})^t = ${k}P$ — divide by $P$.`, `Take $\\ln$ of both sides: $t\\ln 1.${String(r).padStart(2, '0')} = \\ln ${k}$.`],
      solution: [`$(1.${String(r).padStart(2, '0')})^t = ${k}$`, `$t = \\dfrac{\\ln ${k}}{\\ln 1.${String(r).padStart(2, '0')}} \\approx ${t.toFixed(2)}$ years`],
      mistakes: [{ answer: (k / (1 + r / 100)).toFixed(2), feedback: 'The unknown is in the **exponent**: take logarithms, then divide.' }],
      placeholder: '14.21',
    };
  }
  const P0 = pick([20000, 50000, 80000]), kk = pick([1.5, 2, 2.5, 3]), N = P0 * pick([1.5, 2, 3]);
  const t = Math.log(N / P0) / (kk / 100);
  return {
    skill: 'apply',
    prompt: `A town of ${P0.toLocaleString('en-US')} people grows as $P(t) = ${P0}e^{${kk / 100}t}$, with $t$ in years. When will it reach ${N.toLocaleString('en-US')} people? Round to the nearest hundredth of a year.`,
    answer: { type: 'number', value: +t.toFixed(2), tol: 0.006 },
    hints: [`Unknown: the time $t$. Set $${P0}e^{${kk / 100}t} = ${N}$ and isolate the exponential: divide by ${P0} first.`, `$e^{${kk / 100}t} = ${N / P0}$, so $${kk / 100}t = \\ln ${N / P0}$.`],
    solution: [`$e^{${kk / 100}t} = ${N / P0}$`, `$t = \\dfrac{\\ln ${N / P0}}{${kk / 100}} \\approx ${t.toFixed(2)}$ years`],
    placeholder: '23.5',
  };
}

export const skills: Skill[] = [
  { id: 'same', label: 'Same base', generate: sameBase },
  { id: 'logs', label: 'Take logarithms', generate: takeLogs },
  { id: 'log', label: 'Logarithmic equations', generate: logEq },
  { id: 'sum', label: 'Combine logs first', generate: logSum },
  { id: 'apply', label: 'Word problems', generate: whenWords },
];

export const masterySet = makeMasterySet(skills);
