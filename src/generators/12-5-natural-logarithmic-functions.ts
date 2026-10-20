// Practice problem generators for Lesson 12.5 — Natural Logarithmic Functions.
import { makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function exact(): Problem {
  const k = randInt(-4, 6);
  const kind = pick(['ln', 'exp', 'one'] as const);
  if (kind === 'exp')
    return {
      skill: 'exact',
      prompt: `Simplify: $\\;e^{\\ln ${Math.abs(k) + 2}}$`,
      answer: { type: 'number', value: Math.abs(k) + 2 },
      hints: ['$e^{\\ln x} = x$.'],
      solution: [`$= ${Math.abs(k) + 2}$`],
    };
  if (kind === 'one')
    return {
      skill: 'exact',
      prompt: `Find: $\\;\\ln 1 + \\ln e$`,
      answer: { type: 'number', value: 1 },
      hints: ['$\\ln 1 = 0$ because $e^0 = 1$; $\\ln e = 1$ because $e^1 = e$.'],
      solution: ['$0 + 1 = 1$'],
    };
  return {
    skill: 'exact',
    prompt: `Find: $\\;\\ln e^{${k}}$`,
    answer: { type: 'number', value: k },
    hints: ['$\\ln$ is $\\log_e$, and $\\log_e e^x = x$.'],
    solution: [`$= ${k}$`],
  };
}

function calculator(): Problem {
  const kind = pick(['ln', 'exp'] as const);
  if (kind === 'ln') {
    const x = pick([2, 5, 7, 10, 0.5, 20, 100, 3.6]);
    const v = Math.log(x);
    return {
      skill: 'calc',
      prompt: `Find $\\;\\ln ${x}\\;$ to four decimal places. (You may also type the exact expression, like ln(5).)`,
      answer: { type: 'number', value: +v.toFixed(4), tol: 0.00011 },
      hints: ['Use the LN key on a calculator.'],
      solution: [`$\\ln ${x} \\approx ${v.toFixed(4)}$`],
      placeholder: '1.6094',
    };
  }
  const x = pick([2, 0.5, -1, 3, 1.5, -2]);
  const v = Math.exp(x);
  return {
    skill: 'calc',
    prompt: `Find $\\;e^{${x}}\\;$ to four decimal places.`,
    answer: { type: 'number', value: +v.toFixed(4), tol: 0.00011 },
    hints: ['Use the $e^x$ key (often SHIFT + LN).'],
    solution: [`$e^{${x}} \\approx ${v.toFixed(4)}$`],
    placeholder: '7.3891',
  };
}

function changeBase(): Problem {
  const b = pick([2, 3, 5, 7, 4]), x = pick([10, 20, 50, 7, 100, 3]);
  if (b === x) return changeBase();
  const v = Math.log(x) / Math.log(b);
  return {
    skill: 'base',
    prompt: `Use the change-of-base formula to find $\\;\\log_{${b}} ${x}\\;$ to four decimal places.`,
    answer: { type: 'number', value: +v.toFixed(4), tol: 0.00011 },
    hints: ['$\\log_b M = \\dfrac{\\ln M}{\\ln b}$ (or use common logs).'],
    solution: [`$\\log_{${b}} ${x} = \\dfrac{\\ln ${x}}{\\ln ${b}} \\approx ${v.toFixed(4)}$`],
    placeholder: '2.0959',
  };
}

function domainLn(): Problem {
  const h = randInt(-5, 5);
  return {
    skill: 'domain',
    prompt: `Find the domain of $\\;f(x) = \\ln(x ${h < 0 ? '+' : '-'} ${Math.abs(h)})$. Use interval notation.`,
    answer: { type: 'interval', lo: h, hi: Infinity, loClosed: false, hiClosed: false },
    hints: ['$\\ln$ is defined only for positive numbers.'],
    solution: [`$x ${h < 0 ? '+' : '-'} ${Math.abs(h)} > 0$: domain $(${h}, \\infty)$. The graph has a vertical asymptote $x = ${h}$.`],
    placeholder: '(2, inf)',
  };
}

export const skills: Skill[] = [
  { id: 'exact', label: 'Exact values', generate: exact },
  { id: 'calc', label: 'Calculator values', generate: calculator },
  { id: 'base', label: 'Change of base', generate: changeBase },
  { id: 'domain', label: 'Domain', generate: domainLn },
];

export const masterySet = makeMasterySet(skills);
