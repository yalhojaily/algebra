// Practice problem generators for Lesson 12.3 — Logarithmic Functions.
import { choice, fracTex, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const pairs: [number, number][] = [[2, 3], [2, 5], [2, 6], [3, 2], [3, 4], [5, 2], [5, 3], [10, 2], [10, 3], [4, 3], [7, 2], [6, 2]];

function evaluate(): Problem {
  const [b, e] = pick(pairs);
  const kind = pick(['pos', 'pos', 'neg', 'one', 'self'] as const);
  const exp = kind === 'neg' ? -e : kind === 'one' ? 0 : kind === 'self' ? 1 : e;
  const arg = b ** exp;
  const argTex = exp < 0 ? fracTex(1, b ** -exp) : String(arg);
  const fn = b === 10 && Math.random() < 0.5 ? '\\log' : `\\log_{${b}}`;
  return {
    skill: 'evaluate',
    prompt: `Find $\\;${fn} ${argTex.includes('frac') ? `\\left(${argTex}\\right)` : argTex}$`,
    answer: { type: 'number', value: exp },
    hints: [`Ask: $${b}$ to what power is $${argTex}$?`, `$${fn.includes('_') ? fn : '\\log_{10}'} a = c$ means $${b}^c = a$.${fn === '\\log' ? ' (No base written means base 10.)' : ''}`],
    solution: [`$${b}^{${exp}} = ${argTex}$, so the answer is $${exp}$.`],
  };
}

function convert(): Problem {
  const [b, e] = pick(pairs);
  const toLog = Math.random() < 0.5;
  const a = b ** e;
  const right = toLog ? `$\\log_{${b}} ${a} = ${e}$` : `$${b}^{${e}} = ${a}$`;
  const wrong = toLog ? [`$\\log_{${e}} ${a} = ${b}$`, `$\\log_{${b}} ${e} = ${a}$`, `$\\log_{${a}} ${b} = ${e}$`] : [`$${e}^{${b}} = ${a}$`, `$${a}^{${e}} = ${b}$`, `$${b}^{${a}} = ${e}$`];
  return {
    skill: 'convert',
    prompt: `Rewrite in ${toLog ? 'logarithmic' : 'exponential'} form: $\\;${toLog ? `${b}^{${e}} = ${a}` : `\\log_{${b}} ${a} = ${e}`}$`,
    answer: choice(right, wrong),
    hints: ['$\\log_b a = c$ and $b^c = a$ say the same thing: **the logarithm is the exponent**.'],
    solution: [`The base is $${b}$ and the exponent is $${e}$: ${right}`],
  };
}

function solveLog(): Problem {
  const [b, e] = pick(pairs);
  const which = pick(['arg', 'base'] as const);
  if (which === 'arg')
    return {
      skill: 'solve',
      prompt: `Solve: $\\;\\log_{${b}} x = ${e}$`,
      answer: { type: 'number', value: b ** e },
      hints: ['Rewrite in exponential form: $x = ' + b + '^{' + e + '}$.'],
      solution: [`$x = ${b}^{${e}} = ${b ** e}$`],
    };
  return {
    skill: 'solve',
    prompt: `Solve: $\\;\\log_{x} ${b ** e} = ${e}$`,
    answer: { type: 'number', value: b },
    hints: [`Exponential form: $x^{${e}} = ${b ** e}$. The base of a logarithm is positive.`],
    solution: [`$x^{${e}} = ${b ** e}$, so $x = ${b}$`],
  };
}

function domain(): Problem {
  const h = randInt(-6, 6);
  return {
    skill: 'domain',
    prompt: `Find the domain of $\\;f(x) = \\log_{2}(x ${h < 0 ? '+' : '-'} ${Math.abs(h)})$. Use interval notation.`,
    answer: { type: 'interval', lo: h, hi: Infinity, loClosed: false, hiClosed: false },
    hints: ['You can take the logarithm only of a **positive** number.'],
    solution: [`$x ${h < 0 ? '+' : '-'} ${Math.abs(h)} > 0$, so $x > ${h}$: $(${h}, \\infty)$`],
    placeholder: '(3, inf)',
  };
}


/** Logarithmic scales: pH, decibels, Richter magnitude. */
function logScales(): Problem {
  const kind = pick(['ph', 'db', 'quake'] as const);
  if (kind === 'ph') {
    const k = randInt(2, 12);
    const thing = k <= 3 ? 'lemon juice' : k <= 5 ? 'coffee' : k <= 7 ? 'milk' : k <= 9 ? 'baking soda solution' : 'household ammonia';
    return {
      skill: 'apply',
      prompt: `The pH of a solution is $\\text{pH} = -\\log[\\text{H}^+]$, where $[\\text{H}^+]$ is the hydrogen-ion concentration. A sample of ${thing} has $[\\text{H}^+] = 10^{-${k}}$. What is its pH?`,
      answer: { type: 'number', value: k },
      hints: ['Unknown: the pH. Substitute the concentration into the formula.', `$\\log 10^{-${k}}$ asks: 10 to what power is $10^{-${k}}$?`],
      solution: [`$\\text{pH} = -\\log 10^{-${k}} = -(-${k}) = ${k}$`],
      placeholder: '7',
    };
  }
  if (kind === 'db') {
    const k = randInt(3, 12);
    const thing = k <= 4 ? 'a quiet library' : k <= 6 ? 'normal conversation' : k <= 8 ? 'busy traffic' : k <= 10 ? 'a lawn mower' : 'a rock concert';
    return {
      skill: 'apply',
      prompt: `Sound level in decibels is $L = 10\\log\\dfrac{I}{I_0}$, where $I_0$ is the faintest sound we can hear. The sound of ${thing} is $10^{${k}}$ times as intense as $I_0$. What is its sound level (dB)?`,
      answer: { type: 'number', value: 10 * k },
      hints: [`Unknown: the level $L$. Here $\\dfrac{I}{I_0} = 10^{${k}}$.`, `$\\log 10^{${k}} = ${k}$; then multiply by 10.`],
      solution: [`$L = 10\\log 10^{${k}} = 10 \\cdot ${k} = ${10 * k}$ dB`],
      mistakes: [{ answer: String(k), feedback: `$\\log 10^{${k}} = ${k}$, but the formula multiplies by 10.` }],
      placeholder: '60',
    };
  }
  const k = randInt(2, 8);
  return {
    skill: 'apply',
    prompt: `An earthquake's Richter magnitude is $M = \\log\\dfrac{A}{A_0}$, where $A$ is the amplitude of its seismic waves and $A_0$ a tiny reference amplitude. An earthquake has $A = ${(10 ** k).toLocaleString('en-US')}A_0$. What is its magnitude?`,
    answer: { type: 'number', value: k },
    hints: [`Unknown: the magnitude $M$. $\\dfrac{A}{A_0} = ${(10 ** k).toLocaleString('en-US')} = 10^{${k}}$.`, 'A logarithm is an exponent: 10 to what power?'],
    solution: [`$M = \\log ${10 ** k} = \\log 10^{${k}} = ${k}$`],
    placeholder: '5',
  };
}

export const skills: Skill[] = [
  { id: 'convert', label: 'Exponential ↔ logarithmic form', generate: convert },
  { id: 'evaluate', label: 'Evaluate logarithms', generate: evaluate },
  { id: 'solve', label: 'Solve simple log equations', generate: solveLog },
  { id: 'domain', label: 'Domain', generate: domain },
  { id: 'apply', label: 'Word problems', generate: logScales },
];

export const masterySet = makeMasterySet(skills);
