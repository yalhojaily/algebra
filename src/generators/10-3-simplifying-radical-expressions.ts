// Practice problem generators for Lesson 10.3 — Simplifying Radical Expressions.
import { makeMasterySet, pick, randInt } from './helpers';
import { radicands, radTex, radText, rootSplit } from './radicals';
import type { Problem, Skill } from './types';

function numeric(): Problem {
  const r = pick(radicands), k = randInt(2, 8);
  const n = r * k * k;
  return {
    skill: 'numeric',
    prompt: `Simplify: $\\;\\sqrt{${n}}$`,
    answer: { type: 'expression', value: radText(k, r), radical: true },
    hints: [`Find the largest perfect-square factor of $${n}$: $${n} = ${k * k} \\cdot ${r}$.`, '$\\sqrt{ab} = \\sqrt{a}\\,\\sqrt{b}$.'],
    solution: [`$\\sqrt{${n}} = \\sqrt{${k * k}}\\cdot\\sqrt{${r}} = ${radTex(k, r)}$`],
    placeholder: '6sqrt(2)',
  };
}

function cube(): Problem {
  const r = pick([2, 3, 4, 5, 6, 7, 9, 10]), k = randInt(2, 4) * pick([1, 1, -1]);
  const n = r * k ** 3;
  return {
    skill: 'cube',
    prompt: `Simplify: $\\;\\sqrt[3]{${n}}$`,
    answer: { type: 'expression', value: radText(k, r, 3), radical: true },
    hints: [`Look for a perfect-**cube** factor: $${n} = ${k ** 3} \\cdot ${r}$.`],
    solution: [`$\\sqrt[3]{${n}} = \\sqrt[3]{${k ** 3}}\\cdot\\sqrt[3]{${r}} = ${radTex(k, r, 3)}$`],
    placeholder: '2cbrt(5)',
  };
}

function variables(): Problem {
  const r = pick([1, 2, 3, 5, 6, 7]), k = randInt(1, 5);
  const e = randInt(2, 7);
  const out = Math.floor(e / 2), rest = e % 2;
  const coefIn = r * k * k;
  const inside = `${r === 1 ? '' : r}${rest ? 'x' : ''}`;
  const outside = `${k === 1 ? '' : k}${out ? (out === 1 ? 'x' : `x^${out}`) : ''}`;
  const value = inside ? `${outside || '1'}*sqrt(${inside})` : outside;
  const insideTex = inside || '';
  return {
    skill: 'variables',
    prompt: `Simplify: $\\;\\sqrt{${coefIn === 1 ? '' : coefIn}x^{${e}}}$ (Assume $x \\ge 0$.)`,
    answer: { type: 'expression', value, radical: true },
    hints: [`Split into perfect squares: $${coefIn} = ${k * k} \\cdot ${r}$ and $x^{${e}} = x^{${2 * out}}${rest ? ' \\cdot x' : ''}$.`, `$\\sqrt{x^{${2 * out}}} = x^{${out}}$`],
    solution: [`$= \\sqrt{${k * k}x^{${2 * out}}}\\cdot\\sqrt{${insideTex || 1}} = ${outside.replace(/\^(\d+)/, '^{$1}')}${insideTex ? `\\sqrt{${insideTex}}` : ''}$`],
    placeholder: '3x^2 sqrt(2x)',
  };
}

function product(): Problem {
  for (;;) {
    const a = pick([2, 3, 5, 6, 7, 10, 14, 15]), b = pick([2, 3, 5, 6, 10, 12, 15, 21]);
    const { out, inside } = rootSplit(a * b);
    if (out === 1) continue;
    return {
      skill: 'product',
      prompt: `Multiply and simplify: $\\;\\sqrt{${a}}\\cdot\\sqrt{${b}}$`,
      answer: { type: 'expression', value: radText(out, inside), radical: true },
      hints: ['$\\sqrt{a}\\cdot\\sqrt{b} = \\sqrt{ab}$.', `Then simplify $\\sqrt{${a * b}}$.`],
      solution: [`$= \\sqrt{${a * b}} = ${radTex(out, inside)}$`],
      placeholder: '2sqrt(15)',
    };
  }
}

export const skills: Skill[] = [
  { id: 'numeric', label: 'Square roots of numbers', generate: numeric },
  { id: 'cube', label: 'Cube roots', generate: cube },
  { id: 'variables', label: 'Variables under the radical', generate: variables },
  { id: 'product', label: 'Multiply radicals', generate: product },
];

export const masterySet = makeMasterySet(skills);
