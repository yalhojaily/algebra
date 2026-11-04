// Practice problem generators for Lesson 10.5 — More on Division of Radical Expressions.
import { gcd, makeMasterySet, pick, randInt } from './helpers';
import { radicands, radTex, radText, rootSplit } from './radicals';
import type { Problem, Skill } from './types';

function quotient(): Problem {
  const b = pick([2, 3, 5, 6, 7]), k = randInt(2, 6), r = pick([1, 1, 2, 3]);
  const a = b * k * k * r;
  const { out, inside } = rootSplit(k * k * r);
  return {
    skill: 'quotient',
    prompt: `Divide and simplify: $\\;\\dfrac{\\sqrt{${a}}}{\\sqrt{${b}}}$`,
    answer: { type: 'expression', value: radText(out, inside), radical: true },
    hints: ['$\\dfrac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\dfrac{a}{b}}$.', `$\\dfrac{${a}}{${b}} = ${a / b}$.`],
    solution: [`$= \\sqrt{${a / b}} = ${radTex(out, inside)}$`],
    placeholder: '4sqrt(3)',
  };
}

function rationalize(): Problem {
  const r = pick(radicands), k = randInt(1, 12);
  // k/√r = k√r / r, reduced
  const g = gcd(k, r);
  const num = k / g, den = r / g;
  const value = den === 1 ? radText(num, r) : `(${radText(num, r)})/${den}`;
  return {
    skill: 'rationalize',
    prompt: `Rationalize the denominator: $\\;\\dfrac{${k}}{\\sqrt{${r}}}$`,
    answer: { type: 'expression', value, radical: true },
    hints: [`Multiply the top and bottom by $\\sqrt{${r}}$ (that is, by $1$).`, `$\\sqrt{${r}}\\cdot\\sqrt{${r}} = ${r}$.`],
    solution: [`$= \\dfrac{${k}\\sqrt{${r}}}{${r}}${g > 1 ? ` = ${den === 1 ? radTex(num, r) : `\\dfrac{${radTex(num, r)}}{${den}}`}` : ''}$`],
    placeholder: '3sqrt(5)/5',
  };
}

function conjugate(): Problem {
  for (;;) {
    const r = pick([2, 3, 5, 6, 7, 10]), a = randInt(1, 4), sgn = pick([1, -1]);
    const D = r - a * a; // (√r + a)(√r − a)
    if (D === 0) continue;
    const k = Math.abs(D) * randInt(1, 3); // numerator chosen so the answer has integer coefficients
    // k/(√r + sgn a) = k(√r − sgn a)/D
    const c = k / D;
    const value = `${c}*sqrt(${r}) + (${-sgn * a * c})`;
    return {
      skill: 'conjugate',
      prompt: `Rationalize the denominator: $\\;\\dfrac{${k}}{\\sqrt{${r}} ${sgn > 0 ? '+' : '-'} ${a}}$`,
      answer: { type: 'expression', value, radical: true },
      hints: [`Multiply the top and bottom by the **conjugate** $\\sqrt{${r}} ${sgn > 0 ? '-' : '+'} ${a}$.`, `The denominator becomes $(\\sqrt{${r}})^2 - ${a}^2 = ${D}$.`],
      solution: [`$= \\dfrac{${k}(\\sqrt{${r}} ${sgn > 0 ? '-' : '+'} ${a})}{${r} - ${a * a}} = \\dfrac{${k}(\\sqrt{${r}} ${sgn > 0 ? '-' : '+'} ${a})}{${D}}$`, `$= ${radTex(c, r)} ${-sgn * a * c < 0 ? '-' : '+'} ${Math.abs(sgn * a * c)}$`],
      placeholder: '2sqrt(3) - 2',
    };
  }
}

function fractionRoot(): Problem {
  const r = pick([2, 3, 5, 7]), a = pick([1, 2, 3, 5, 7, 11].filter((x) => x !== r));
  // √(a/r) = √(ar)/r
  const { out, inside } = rootSplit(a * r);
  const g = gcd(out, r);
  const value = `(${radText(out / g, inside)})/${r / g}`;
  return {
    skill: 'fraction',
    prompt: `Simplify, with a rational denominator: $\\;\\sqrt{\\dfrac{${a}}{${r}}}$`,
    answer: { type: 'expression', value, radical: true },
    hints: [`Write it as $\\dfrac{\\sqrt{${a}}}{\\sqrt{${r}}}$, then multiply top and bottom by $\\sqrt{${r}}$.`],
    solution: [`$= \\dfrac{\\sqrt{${a}}\\cdot\\sqrt{${r}}}{${r}} = \\dfrac{${radTex(out, inside)}}{${r}}${g > 1 ? ` = \\dfrac{${radTex(out / g, inside)}}{${r / g}}` : ''}$`],
    placeholder: 'sqrt(6)/3',
  };
}


/** Side of a square with a fractional area, rationalized. */
function fractionWords(): Problem {
  for (;;) {
    const a = randInt(1, 9), b = pick([2, 3, 5, 6, 7, 8, 10, 12]);
    if (gcd(a, b) > 1 || a >= b * 3) continue;
    const { out, inside } = rootSplit(a * b);
    if (inside === 1) continue;
    const g = gcd(out, b), num = out / g, den = b / g;
    const value = den === 1 ? radText(num, inside) : `(${radText(num, inside)})/${den}`;
    return {
      skill: 'apply',
      prompt: `A square photo has an area of $\\dfrac{${a}}{${b}}$ m². Find the exact length of a side, with a rational denominator (m).`,
      answer: { type: 'expression', value, radical: true },
      hints: [`Unknown: the side $s = \\sqrt{\\dfrac{${a}}{${b}}} = \\dfrac{\\sqrt{${a}}}{\\sqrt{${b}}}$.`, `Multiply top and bottom by $\\sqrt{${b}}$ to clear the radical from the denominator.`],
      solution: [`$s = \\dfrac{\\sqrt{${a}}}{\\sqrt{${b}}} \\cdot \\dfrac{\\sqrt{${b}}}{\\sqrt{${b}}} = \\dfrac{\\sqrt{${a * b}}}{${b}}${out > 1 ? ` = \\dfrac{${radTex(out, inside)}}{${b}}` : ''}${g > 1 ? ` = ${den === 1 ? radTex(num, inside) : `\\dfrac{${radTex(num, inside)}}{${den}}`}` : ''}$ m`],
      placeholder: 'sqrt(6)/3',
    };
  }
}

export const skills: Skill[] = [
  { id: 'quotient', label: 'Quotients of radicals', generate: quotient },
  { id: 'rationalize', label: 'Rationalize one-term denominators', generate: rationalize },
  { id: 'fraction', label: 'Roots of fractions', generate: fractionRoot },
  { id: 'conjugate', label: 'Use the conjugate', generate: conjugate },
  { id: 'apply', label: 'Word problems', generate: fractionWords },
];

export const masterySet = makeMasterySet(skills);
