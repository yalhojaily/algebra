// Practice problem generators for Lesson 12.4 — Properties of Logarithmic Functions.
import { makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const lg = (b: number | string) => (b === 10 ? '\\log' : `\\log_{${b}}`);
const lt = (b: number | string) => (b === 10 ? 'log' : b === 'b' ? 'log_b' : `log_${b}`);

function expand(): Problem {
  const b = pick([2, 3, 5, 10]);
  const p = randInt(2, 5), q = randInt(1, 4);
  const kind = pick(['prod', 'quot', 'root'] as const);
  if (kind === 'root') {
    const value = `(1/2)*${lt(b)}(x) + ${p}*${lt(b)}(y)`.replace(/log_(\d+)/g, 'log_$1');
    return {
      skill: 'expand',
      prompt: `Expand: $\\;${lg(b)} \\left(\\sqrt{x}\\,y^{${p}}\\right)$`,
      answer: { type: 'expression', value, expandedLogs: true },
      hints: ['$\\sqrt{x} = x^{1/2}$. Use the product rule, then the power rule on each factor.'],
      solution: [`$= ${lg(b)} x^{1/2} + ${lg(b)} y^{${p}} = \\tfrac{1}{2}${lg(b)} x + ${p}${lg(b)} y$`],
      placeholder: `(1/2)${lt(b)}(x) + 3${lt(b)}(y)`,
    };
  }
  const value = kind === 'prod' ? `${p}*${lt(b)}(x) + ${q}*${lt(b)}(y)` : `${p}*${lt(b)}(x) - ${q}*${lt(b)}(y)`;
  const argTex = kind === 'prod' ? `x^{${p}}${q === 1 ? 'y' : `y^{${q}}`}` : `\\dfrac{x^{${p}}}{${q === 1 ? 'y' : `y^{${q}}`}}`;
  return {
    skill: 'expand',
    prompt: `Expand into a sum or difference of logarithms: $\\;${lg(b)} ${kind === 'prod' ? `\\left(${argTex}\\right)` : `${argTex}`}$`,
    answer: { type: 'expression', value, expandedLogs: true },
    hints: [kind === 'prod' ? 'Product rule: $\\log_b(MN) = \\log_b M + \\log_b N$.' : 'Quotient rule: $\\log_b\\dfrac{M}{N} = \\log_b M - \\log_b N$.', 'Power rule: $\\log_b M^p = p\\log_b M$.'],
    solution: [`$= ${p}${lg(b)} x ${kind === 'prod' ? '+' : '-'} ${q === 1 ? '' : q}${lg(b)} y$`],
    placeholder: `3${lt(b)}(x) + 2${lt(b)}(y)`,
  };
}

function condense(): Problem {
  const b = pick([2, 3, 10]);
  const p = randInt(2, 4), q = randInt(1, 3);
  const kind = pick(['sum', 'diff'] as const);
  const value = kind === 'sum' ? `${lt(b)}(x^${p}*y^${q})` : `${lt(b)}(x^${p}/y^${q})`;
  return {
    skill: 'condense',
    prompt: `Write as a single logarithm: $\\;${p}${lg(b)} x ${kind === 'sum' ? '+' : '-'} ${q === 1 ? '' : q}${lg(b)} y$`,
    answer: { type: 'expression', value, singleLog: true },
    hints: ['First use the power rule backwards: $p\\log_b M = \\log_b M^p$.', kind === 'sum' ? 'Then a sum of logs is the log of a product.' : 'Then a difference of logs is the log of a quotient.'],
    solution: [`$= ${lg(b)} x^{${p}} ${kind === 'sum' ? '+' : '-'} ${lg(b)} ${q === 1 ? 'y' : `y^{${q}}`} = ${lg(b)} ${kind === 'sum' ? `\\left(x^{${p}}${q === 1 ? 'y' : `y^{${q}}`}\\right)` : `\\dfrac{x^{${p}}}{${q === 1 ? 'y' : `y^{${q}}`}}`}$`],
    placeholder: `${lt(b)}(x^2 y)`,
  };
}

function numeric(): Problem {
  // given log_b 2 ≈ 0.301 style: use exact base-2 values
  const b = pick([2, 3]);
  const m = randInt(1, 4), n = randInt(1, 4);
  const kind = pick(['prod', 'quot', 'pow'] as const);
  if (kind === 'pow') {
    const k = randInt(2, 5);
    return {
      skill: 'numeric',
      prompt: `Simplify: $\\;\\log_{${b}} \\left(${b}^{${m}}\\right)^{${k}}$`,
      answer: { type: 'number', value: m * k },
      hints: ['Power rule, then $\\log_b b^c = c$.'],
      solution: [`$= ${k}\\log_{${b}} ${b}^{${m}} = ${k} \\cdot ${m} = ${m * k}$`],
    };
  }
  const v = kind === 'prod' ? m + n : m - n;
  return {
    skill: 'numeric',
    prompt: `Simplify: $\\;\\log_{${b}} ${b ** m} ${kind === 'prod' ? '+' : '-'} \\log_{${b}} ${b ** n}$`,
    answer: { type: 'number', value: v },
    hints: [`Evaluate each: $\\log_{${b}} ${b ** m} = ${m}$ and $\\log_{${b}} ${b ** n} = ${n}$ — or combine first.`],
    solution: [`$= ${m} ${kind === 'prod' ? '+' : '-'} ${n} = ${v}$`],
  };
}

function inverseProps(): Problem {
  const kind = pick(['a', 'b'] as const);
  const b = pick([2, 5, 7, 10]), k = randInt(2, 9);
  if (kind === 'a')
    return {
      skill: 'inverse',
      prompt: `Simplify: $\\;${b}^{\\log_{${b}} ${k}}$`,
      answer: { type: 'number', value: k },
      hints: ['$b^{\\log_b x} = x$ — exponential and logarithm with the same base undo each other.'],
      solution: [`$= ${k}$`],
    };
  return {
    skill: 'inverse',
    prompt: `Simplify: $\\;\\log_{${b}} ${b}^{${k}}$`,
    answer: { type: 'number', value: k },
    hints: ['$\\log_b b^x = x$.'],
    solution: [`$= ${k}$`],
  };
}


/** Log rules on logarithmic scales: multiplying the intensity adds to the level. */
function scaleRules(): Problem {
  if (Math.random() < 0.5) {
    const k = randInt(1, 3), M = randInt(3, 6) + pick([0, 0.5]);
    return {
      skill: 'apply',
      prompt: `Richter magnitude is $M = \\log\\dfrac{A}{A_0}$. One earthquake has magnitude ${M}. Another has seismic waves ${(10 ** k).toLocaleString('en-US')} times as large in amplitude. What is the magnitude of the second earthquake?`,
      answer: { type: 'number', value: M + k },
      hints: [`Unknown: the new magnitude. The new amplitude is $${10 ** k}A$, so its magnitude is $\\log\\dfrac{${10 ** k}A}{A_0}$.`, `Product rule: $\\log\\left(${10 ** k}\\cdot\\dfrac{A}{A_0}\\right) = \\log ${10 ** k} + \\log\\dfrac{A}{A_0}$.`],
      solution: [`$\\log\\left(${10 ** k}\\cdot\\dfrac{A}{A_0}\\right) = \\log ${10 ** k} + \\log\\dfrac{A}{A_0} = ${k} + ${M} = ${M + k}$`, `Multiplying the amplitude by ${10 ** k} **adds** ${k} to the magnitude.`],
      mistakes: [{ answer: String(M * 10 ** k), feedback: 'A logarithmic scale doesn\'t multiply: the product rule turns “times ' + 10 ** k + '” into “plus ' + k + '”.' }],
      placeholder: '7',
    };
  }
  const f = pick([2, 3, 4, 5, 10, 100]), L = randInt(4, 9) * 10;
  const add = 10 * Math.log10(f);
  return {
    skill: 'apply',
    prompt: `Sound level is $L = 10\\log\\dfrac{I}{I_0}$ decibels. A speaker plays at ${L} dB. If the sound intensity is multiplied by ${f}, what is the new level? Round to the nearest hundredth of a decibel.`,
    answer: { type: 'number', value: +(L + add).toFixed(2), tol: 0.006 },
    hints: [`Unknown: the new level. New intensity $${f}I$: $\;10\\log\\dfrac{${f}I}{I_0} = 10\\left(\\log ${f} + \\log\\dfrac{I}{I_0}\\right)$.`, `That is $10\\log ${f} + ${L}$.`],
    solution: [`$10\\log\\dfrac{${f}I}{I_0} = 10\\log ${f} + 10\\log\\dfrac{I}{I_0} = ${+add.toFixed(2)} + ${L}$`, `$\\approx ${(L + add).toFixed(2)}$ dB`],
    mistakes: [{ answer: String(L * f), feedback: `Multiplying the intensity by ${f} doesn't multiply the decibels — it **adds** $10\\log ${f}$.` }],
    placeholder: '63.01',
  };
}

export const skills: Skill[] = [
  { id: 'expand', label: 'Expand', generate: expand },
  { id: 'condense', label: 'Condense', generate: condense },
  { id: 'numeric', label: 'Simplify with numbers', generate: numeric },
  { id: 'inverse', label: 'Inverse properties', generate: inverseProps },
  { id: 'apply', label: 'Word problems', generate: scaleRules },
];

export const masterySet = makeMasterySet(skills);
