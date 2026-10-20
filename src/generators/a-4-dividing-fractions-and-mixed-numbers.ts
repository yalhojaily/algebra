// Practice problem generators for Appendix A.4 — Dividing Fractions and Mixed Numbers.
import { fracIn, fracTex, gcd, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

/** A positive improper fraction n/d as a mixed number in LaTeX: 2\frac{3}{4}. */
export function mixedTex(n: number, d: number): string {
  const g = gcd(n, d) || 1;
  n /= g; d /= g;
  const w = Math.floor(n / d), r = n % d;
  if (r === 0) return String(w);
  return w ? `${w}\\tfrac{${r}}{${d}}` : `\\tfrac{${r}}{${d}}`;
}

/** The same as typed input: 2 3/4. */
export const mixedIn = (n: number, d: number) => {
  const g = gcd(n, d) || 1;
  n /= g; d /= g;
  const w = Math.floor(n / d), r = n % d;
  return r === 0 ? String(w) : w ? `${w} ${r}/${d}` : `${r}/${d}`;
};

const reduceLine = (n: number, d: number) => {
  const g = gcd(n, d);
  return g > 1 ? ` = ${fracTex(n, d)}` : '';
};

function divide(): Problem {
  for (;;) {
    const a = randInt(1, 9), b = randInt(2, 12), c = randInt(1, 9), d = randInt(2, 12);
    if (gcd(a, b) > 1 || gcd(c, d) > 1 || a === c && b === d || a > 2 * b || c > 2 * d) continue;
    const n = a * d, D = b * c;
    return {
      skill: 'divide',
      prompt: `Divide and simplify: $\\;\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}}$`,
      answer: { type: 'number', value: n / D, lowest: true },
      hints: [`Dividing by $\\dfrac{${c}}{${d}}$ is the same as multiplying by its reciprocal, $\\dfrac{${d}}{${c}}$.`, 'Keep the first fraction, change ÷ to ×, flip the second.'],
      solution: [
        `$\\dfrac{${a}}{${b}} \\cdot \\dfrac{${d}}{${c}}$ — multiply by the reciprocal`,
        `$= \\dfrac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = \\dfrac{${n}}{${D}}${reduceLine(n, D)}$`,
      ],
      mistakes: [
        { answer: fracIn(b * c, a * d), feedback: 'That is upside down — you flipped the **first** fraction (or both). Keep the first fraction as it is and flip only the divisor.' },
        { answer: fracIn(a * c, b * d), feedback: 'That is the **product**. To divide, flip the second fraction first, then multiply.' },
      ],
      placeholder: '15/8',
    };
  }
}

function withWhole(): Problem {
  for (;;) {
    const w = randInt(2, 9), a = randInt(1, 9), b = randInt(2, 10);
    if (gcd(a, b) > 1 || a >= b) continue;
    if (Math.random() < 0.5) {
      const n = w * b, D = a;
      return {
        skill: 'whole',
        prompt: `Divide and simplify: $\\;${w} \\div \\dfrac{${a}}{${b}}$`,
        answer: { type: 'number', value: n / D, lowest: true },
        hints: [`Write $${w}$ as $\\dfrac{${w}}{1}$, then multiply by the reciprocal $\\dfrac{${b}}{${a}}$.`, a === 1 ? `This asks: how many $\\tfrac{1}{${b}}$-pieces are in $${w}$ wholes?` : 'Dividing by a number less than 1 makes the result **bigger**.'],
        solution: [`$\\dfrac{${w}}{1} \\cdot \\dfrac{${b}}{${a}} = \\dfrac{${n}}{${D}}${reduceLine(n, D)}$`],
        mistakes: [{ answer: fracIn(w * a, b), feedback: 'That is $' + w + ' \\times \\tfrac{' + a + '}{' + b + '}$. For division, flip the fraction first.' }],
        placeholder: '20/3',
      };
    }
    const n = a, D = b * w;
    return {
      skill: 'whole',
      prompt: `Divide and simplify: $\\;\\dfrac{${a}}{${b}} \\div ${w}$`,
      answer: { type: 'number', value: n / D, lowest: true },
      hints: [`Write $${w}$ as $\\dfrac{${w}}{1}$. Its reciprocal is $\\dfrac{1}{${w}}$.`, `Splitting $\\tfrac{${a}}{${b}}$ into $${w}$ equal parts makes each part smaller.`],
      solution: [`$\\dfrac{${a}}{${b}} \\cdot \\dfrac{1}{${w}} = \\dfrac{${n}}{${D}}${reduceLine(n, D)}$`],
      mistakes: [{ answer: fracIn(a * w, b), feedback: 'That multiplies by ' + w + '. Dividing by ' + w + ' means multiplying by $\\tfrac{1}{' + w + '}$.' }],
      placeholder: '3/20',
    };
  }
}

function convert(): Problem {
  for (;;) {
    const d = pick([2, 3, 4, 5, 6, 8, 10, 12]), w = randInt(1, 9), r = randInt(1, d - 1);
    if (gcd(r, d) > 1) continue;
    const n = w * d + r;
    if (Math.random() < 0.5) {
      return {
        skill: 'convert',
        prompt: `Write as an improper fraction: $\\;${w}\\tfrac{${r}}{${d}}$`,
        answer: { type: 'number', value: n / d, lowest: true },
        hints: [`$${w}\\tfrac{${r}}{${d}}$ means $${w} + \\tfrac{${r}}{${d}}$. Each whole is $\\tfrac{${d}}{${d}}$.`, `Whole × denominator + numerator: $${w} \\cdot ${d} + ${r}$, over $${d}$.`],
        solution: [`$${w}\\tfrac{${r}}{${d}} = \\dfrac{${w} \\cdot ${d} + ${r}}{${d}} = \\dfrac{${n}}{${d}}$`],
        mistakes: [{ answer: `${w * r}/${d}`, feedback: `Don't multiply the whole number by the numerator. Multiply it by the **denominator** (there are ${d} pieces in each whole), then add the numerator.` }],
        placeholder: '11/4',
      };
    }
    return {
      skill: 'convert',
      prompt: `Write as a mixed number: $\\;\\dfrac{${n}}{${d}}$`,
      answer: { type: 'number', value: n / d, mixed: true },
      hints: [`How many times does $${d}$ go into $${n}$, and what is left over?`, `$${n} \\div ${d} = ${w}$ remainder $${r}$. Type a mixed number like 2 3/4.`],
      solution: [`$${n} \\div ${d} = ${w}\\text{ R }${r}$`, `$\\dfrac{${n}}{${d}} = ${w}\\tfrac{${r}}{${d}}$`],
      placeholder: '2 3/4',
    };
  }
}

function mixedOps(): Problem {
  for (;;) {
    const d1 = pick([2, 3, 4, 5, 6, 8]), d2 = pick([2, 3, 4, 5, 6, 8]);
    const w1 = randInt(1, 5), r1 = randInt(1, d1 - 1), w2 = randInt(1, 4), r2 = randInt(1, d2 - 1);
    if (gcd(r1, d1) > 1 || gcd(r2, d2) > 1) continue;
    const n1 = w1 * d1 + r1, n2 = w2 * d2 + r2;
    const div = Math.random() < 0.5;
    const N = div ? n1 * d2 : n1 * n2, D = div ? d1 * n2 : d1 * d2;
    const g = gcd(N, D);
    if (D / g === 1 || N <= D || N / g > 60 * (D / g)) continue;
    const t1 = `${w1}\\tfrac{${r1}}{${d1}}`, t2 = `${w2}\\tfrac{${r2}}{${d2}}`;
    return {
      skill: 'mixedops',
      prompt: `${div ? 'Divide' : 'Multiply'}. Write the answer as a mixed number: $\\;${t1} ${div ? '\\div' : '\\times'} ${t2}$`,
      answer: { type: 'number', value: N / D, mixed: true },
      hints: ['First change both mixed numbers to improper fractions.', div ? 'Then multiply by the reciprocal of the second one, simplify, and convert back.' : 'Then multiply across, simplify, and convert back.'],
      solution: [
        `$${t1} = \\dfrac{${n1}}{${d1}}, \\quad ${t2} = \\dfrac{${n2}}{${d2}}$`,
        div ? `$\\dfrac{${n1}}{${d1}} \\cdot \\dfrac{${d2}}{${n2}} = \\dfrac{${N}}{${D}}${reduceLine(N, D)}$` : `$\\dfrac{${n1}}{${d1}} \\cdot \\dfrac{${n2}}{${d2}} = \\dfrac{${N}}{${D}}${reduceLine(N, D)}$`,
        `$= ${mixedTex(N, D)}$`,
      ],
      mistakes: div ? [] : [{ answer: mixedIn(w1 * w2 * d1 * d2 + r1 * r2, d1 * d2), feedback: 'You multiplied the whole numbers and the fractions separately. That misses the cross terms — convert to improper fractions first.' }],
      placeholder: '3 1/2',
    };
  }
}

export const skills: Skill[] = [
  { id: 'divide', label: 'Dividing fractions', generate: divide },
  { id: 'whole', label: 'Whole numbers', generate: withWhole },
  { id: 'convert', label: 'Mixed ↔ improper', generate: convert },
  { id: 'mixedops', label: 'Mixed numbers × and ÷', generate: mixedOps },
];

export const masterySet = makeMasterySet(skills);
