// Practice problem generators for Lesson 10.4 — Addition, Subtraction, and More Multiplication.
import { makeMasterySet, nz, pick, randInt } from './helpers';
import { radicands, radTex, radText } from './radicals';
import type { Problem, Skill } from './types';

function likeRadicals(): Problem {
  const r = pick([2, 3, 5, 6, 7]);
  const k2 = pick([2, 3]);
  const a = randInt(1, 6), b = nz(5);
  // a√(r) + b√(k2² r)
  const total = a + b * k2;
  const sign = b < 0 ? '-' : '+';
  return {
    skill: 'like',
    prompt: `Simplify: $\\;${radTex(a, r)} ${sign} ${Math.abs(b) === 1 ? '' : Math.abs(b)}\\sqrt{${k2 * k2 * r}}$`,
    answer: { type: 'expression', value: radText(total, r), radical: true },
    hints: [`First simplify $\\sqrt{${k2 * k2 * r}} = ${k2}\\sqrt{${r}}$.`, 'Then combine like radicals, just like like terms: $3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$.'],
    solution: [`$= ${radTex(a, r)} ${sign} ${Math.abs(b) * k2}\\sqrt{${r}} = ${radTex(total, r)}$`],
    mistakes: [{ answer: `${a + b}sqrt(${r + k2 * k2 * r})`, feedback: 'You can only combine radicals with the **same** radicand, and you never add the radicands.' }],
    placeholder: '7sqrt(3)',
  };
}

function distribute(): Problem {
  for (;;) {
    const a = pick([2, 3, 5, 6]), b = pick([2, 3, 5, 6, 10]), c = nz(5);
    if (a === b) continue;
    // √a(√b + c) = √(ab) + c√a
    const ab = a * b;
    let out = 1, inside = ab;
    for (let p = 2; p * p <= inside; p++) while (inside % (p * p) === 0) { inside /= p * p; out *= p; }
    const val = `${radText(out, inside)} + (${c})*sqrt(${a})`;
    return {
      skill: 'distribute',
      prompt: `Multiply and simplify: $\\;\\sqrt{${a}}\\left(\\sqrt{${b}} ${c < 0 ? '-' : '+'} ${Math.abs(c)}\\right)$`,
      answer: { type: 'expression', value: val, radical: true },
      hints: ['Distribute: multiply $\\sqrt{' + a + '}$ by each term.', `$\\sqrt{${a}}\\cdot\\sqrt{${b}} = \\sqrt{${ab}}$ — simplify it.`],
      solution: [`$= \\sqrt{${ab}} ${c < 0 ? '-' : '+'} ${Math.abs(c)}\\sqrt{${a}}${out > 1 ? ` = ${radTex(out, inside)} ${c < 0 ? '-' : '+'} ${Math.abs(c)}\\sqrt{${a}}` : ''}$`],
      placeholder: '3sqrt(2) + 2sqrt(3)',
    };
  }
}

function foil(): Problem {
  const r = pick(radicands.slice(0, 6)), a = nz(6), b = nz(6);
  // (√r + a)(√r + b) = r + (a + b)√r + ab
  const rational = r + a * b, coef = a + b;
  const val = coef === 0 ? String(rational) : `${rational} + (${coef})*sqrt(${r})`;
  const t = (k: number) => `${k < 0 ? '-' : '+'} ${Math.abs(k)}`;
  return {
    skill: 'foil',
    prompt: `Multiply: $\\;(\\sqrt{${r}} ${t(a)})(\\sqrt{${r}} ${t(b)})$`,
    answer: { type: 'expression', value: val, radical: true },
    hints: ['Use FOIL. $\\sqrt{' + r + '}\\cdot\\sqrt{' + r + '} = ' + r + '$.', 'Then combine the like radical terms and the plain numbers.'],
    solution: [`$= ${r} ${t(b)}\\sqrt{${r}} ${t(a)}\\sqrt{${r}} ${t(a * b)}$`, `$= ${rational}${coef ? ` ${coef < 0 ? '-' : '+'} ${radTex(Math.abs(coef), r)}` : ''}$`],
    placeholder: '1 + 3sqrt(5)',
  };
}

function conjugates(): Problem {
  const r = pick([2, 3, 5, 6, 7, 10, 11]), a = randInt(1, 6), s = pick([1, 2, 3]);
  // (s√r + a)(s√r − a) = s² r − a²
  const val = s * s * r - a * a;
  const R = s === 1 ? `\\sqrt{${r}}` : `${s}\\sqrt{${r}}`;
  return {
    skill: 'conjugate',
    prompt: `Multiply: $\\;(${R} + ${a})(${R} - ${a})$`,
    answer: { type: 'number', value: val },
    hints: ['These are **conjugates**: $(A + B)(A - B) = A^2 - B^2$.', `$(${R})^2 = ${s * s * r}$.`],
    solution: [`$= (${R})^2 - ${a}^2 = ${s * s * r} - ${a * a} = ${val}$ — the radicals disappear.`],
  };
}

export const skills: Skill[] = [
  { id: 'like', label: 'Like radicals', generate: likeRadicals },
  { id: 'distribute', label: 'Distribute', generate: distribute },
  { id: 'foil', label: 'FOIL with radicals', generate: foil },
  { id: 'conjugate', label: 'Conjugates', generate: conjugates },
];

export const masterySet = makeMasterySet(skills);
