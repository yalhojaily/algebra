// Practice problem generators for Appendix A.1 — Adding, Subtracting and Multiplying Fractions.
import { fracIn, fracTex, gcd, lcm, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const reduceLine = (n: number, d: number) => {
  const g = gcd(Math.abs(n), d);
  return g > 1 ? ` = \\dfrac{${n} \\div ${g}}{${d} \\div ${g}} = ${fracTex(n, d)}` : '';
};

function sameDenominator(): Problem {
  const d = pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
  const a = randInt(1, d - 1), b = randInt(1, d - 1);
  const minus = Math.random() < 0.45;
  const n = minus ? a - b : a + b;
  return {
    skill: 'same',
    prompt: `${minus ? 'Subtract' : 'Add'} and simplify: $\\;\\dfrac{${a}}{${d}} ${minus ? '-' : '+'} \\dfrac{${b}}{${d}}$`,
    answer: { type: 'number', value: n / d, lowest: true },
    hints: [`The denominators are the same, so ${minus ? 'subtract' : 'add'} the **numerators** and keep the denominator $${d}$.`, 'Then reduce to lowest terms if you can.'],
    solution: [`$\\dfrac{${a} ${minus ? '-' : '+'} ${b}}{${d}} = \\dfrac{${n}}{${d}}${reduceLine(n, d)}$`],
    mistakes: [{ answer: `${n}/${2 * d}`, feedback: 'Don\'t add the denominators. The denominator tells the size of the pieces — that stays the same.' }],
    placeholder: '5/8',
  };
}

function differentDenominators(): Problem {
  for (;;) {
    const d1 = pick([2, 3, 4, 5, 6, 8, 9, 10, 12]), d2 = pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]);
    if (d1 === d2) continue;
    const a = randInt(1, d1 - 1), b = randInt(1, d2 - 1);
    if (gcd(a, d1) > 1 || gcd(b, d2) > 1) continue;
    const minus = Math.random() < 0.45;
    const L = lcm(d1, d2);
    const A = a * (L / d1), Bn = b * (L / d2);
    const n = minus ? A - Bn : A + Bn;
    return {
      skill: 'different',
      prompt: `${minus ? 'Subtract' : 'Add'} and simplify: $\\;\\dfrac{${a}}{${d1}} ${minus ? '-' : '+'} \\dfrac{${b}}{${d2}}$`,
      answer: { type: 'number', value: n / L, lowest: true },
      hints: [`Find a common denominator — the least common multiple of $${d1}$ and $${d2}$ is $${L}$.`, `Rewrite: $\\dfrac{${a}}{${d1}} = \\dfrac{${A}}{${L}}$ and $\\dfrac{${b}}{${d2}} = \\dfrac{${Bn}}{${L}}$.`],
      solution: [
        `LCD $= ${L}$`,
        `$\\dfrac{${a} \\cdot ${L / d1}}{${d1} \\cdot ${L / d1}} ${minus ? '-' : '+'} \\dfrac{${b} \\cdot ${L / d2}}{${d2} \\cdot ${L / d2}} = \\dfrac{${A}}{${L}} ${minus ? '-' : '+'} \\dfrac{${Bn}}{${L}}$`,
        `$= \\dfrac{${n}}{${L}}${reduceLine(n, L)}$`,
      ],
      mistakes: [{ answer: `${minus ? a - b : a + b}/${minus ? d1 - d2 : d1 + d2}`, feedback: 'You can\'t add (or subtract) tops and bottoms straight across. Rewrite both fractions with a common denominator first.' }],
      placeholder: '7/12',
    };
  }
}

function multiply(): Problem {
  for (;;) {
    const a = randInt(1, 9), b = randInt(2, 12), c = randInt(1, 9), d = randInt(2, 12);
    if (gcd(a, b) > 1 || gcd(c, d) > 1 || a >= b * 2 || c >= d * 2) continue;
    const n = a * c, D = b * d;
    const cross = gcd(a, d) > 1 || gcd(c, b) > 1;
    return {
      skill: 'multiply',
      prompt: `Multiply and simplify: $\\;\\dfrac{${a}}{${b}} \\cdot \\dfrac{${c}}{${d}}$`,
      answer: { type: 'number', value: n / D, lowest: true },
      hints: ['Multiply the numerators and multiply the denominators — no common denominator needed.', cross ? 'You can cancel a common factor between a numerator and the **other** denominator before multiplying.' : 'Then reduce if possible.'],
      solution: [`$\\dfrac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = \\dfrac{${n}}{${D}}${reduceLine(n, D)}$`],
      mistakes: [{ answer: fracIn(a * d + b * c, b * d), feedback: 'That is the **sum**. To multiply, multiply straight across: top × top, bottom × bottom.' }],
      placeholder: '3/10',
    };
  }
}

function withWholes(): Problem {
  const kind = pick(['times', 'plus', 'minus'] as const);
  const w = randInt(2, 9);
  for (;;) {
    const a = randInt(1, 11), b = randInt(2, 12);
    if (gcd(a, b) > 1 || a >= b) continue;
    if (kind === 'times') {
      const n = w * a;
      return {
        skill: 'whole',
        prompt: `Multiply and simplify: $\\;${w} \\cdot \\dfrac{${a}}{${b}}$`,
        answer: { type: 'number', value: n / b, lowest: true },
        hints: [`Write the whole number as a fraction: $${w} = \\dfrac{${w}}{1}$.`],
        solution: [`$\\dfrac{${w}}{1} \\cdot \\dfrac{${a}}{${b}} = \\dfrac{${n}}{${b}}${reduceLine(n, b)}$`],
        placeholder: '12/5',
      };
    }
    const n = kind === 'plus' ? w * b + a : w * b - a;
    return {
      skill: 'whole',
      prompt: `${kind === 'plus' ? 'Add' : 'Subtract'} and write as a single fraction: $\\;${w} ${kind === 'plus' ? '+' : '-'} \\dfrac{${a}}{${b}}$`,
      answer: { type: 'number', value: n / b, lowest: true },
      hints: [`$${w} = \\dfrac{${w * b}}{${b}}$ — rewrite the whole number with denominator $${b}$.`],
      solution: [`$\\dfrac{${w * b}}{${b}} ${kind === 'plus' ? '+' : '-'} \\dfrac{${a}}{${b}} = \\dfrac{${n}}{${b}}$`],
      placeholder: '17/4',
    };
  }
}

export const skills: Skill[] = [
  { id: 'same', label: 'Same denominators', generate: sameDenominator },
  { id: 'different', label: 'Different denominators', generate: differentDenominators },
  { id: 'multiply', label: 'Multiplying', generate: multiply },
  { id: 'whole', label: 'Whole numbers and fractions', generate: withWholes },
];

export const masterySet = makeMasterySet(skills);
