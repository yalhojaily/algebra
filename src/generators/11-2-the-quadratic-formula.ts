// Practice problem generators for Lesson 11.2 — The Quadratic Formula.
import { makeMasterySet, nz, pick, randInt } from './helpers';
import { quadRoots, quadTex } from './quad';
import type { Problem, Skill } from './types';

function formulaSteps(a: number, b: number, c: number) {
  const D = b * b - 4 * a * c;
  const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);
  return `$x = \\dfrac{-${p(b)} \\pm \\sqrt{${p(b)}^2 - 4(${a})(${c})}}{2(${a})} = \\dfrac{${-b} \\pm \\sqrt{${D}}}{${2 * a}}$`;
}

function rational(): Problem {
  for (;;) {
    const p = randInt(1, 4), q = nz(7), r = randInt(1, 3), s = nz(7);
    const a = p * r, b = p * s + q * r, c = q * s;
    if (b === 0) continue;
    const Q = quadRoots(a, b, c);
    return {
      skill: 'rational',
      prompt: `Solve using the quadratic formula: $\\;${quadTex(a, b, c)} = 0$`,
      answer: { type: 'solutions', values: Q.real, variable: 'x' },
      hints: [`$a = ${a},\\ b = ${b},\\ c = ${c}$`, '$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$'],
      solution: [formulaSteps(a, b, c), `$${Q.tex}$`],
      placeholder: '3/2, -1',
    };
  }
}

function irrational(): Problem {
  for (;;) {
    const a = pick([1, 1, 2, 3]), b = nz(8), c = randInt(-9, 9);
    const D = b * b - 4 * a * c;
    if (D <= 0 || Number.isInteger(Math.sqrt(D))) continue;
    const Q = quadRoots(a, b, c);
    return {
      skill: 'irrational',
      prompt: `Solve using the quadratic formula: $\\;${quadTex(a, b, c)} = 0$ (Give exact answers.)`,
      answer: { type: 'solutions', values: Q.real, variable: 'x' },
      hints: [`$a = ${a},\\ b = ${b},\\ c = ${c}$. The discriminant is $b^2 - 4ac = ${D}$.`, 'Simplify the square root and reduce the fraction if possible. Type ± as +-.'],
      solution: [formulaSteps(a, b, c), `$${Q.tex}$`],
      placeholder: '(-3 ± sqrt(17))/4',
    };
  }
}

function complexRoots(): Problem {
  for (;;) {
    const a = pick([1, 1, 2]), b = randInt(-6, 6), c = randInt(1, 15);
    const D = b * b - 4 * a * c;
    if (D >= 0) continue;
    const Q = quadRoots(a, b, c);
    return {
      skill: 'complex',
      prompt: `Solve: $\\;${quadTex(a, b, c)} = 0$`,
      answer: { type: 'csolutions', values: Q.complex, variable: 'x' },
      hints: [`The discriminant is $${D}$, which is negative — the solutions are complex.`, `$\\sqrt{${D}} = i\\sqrt{${-D}}$.`],
      solution: [formulaSteps(a, b, c), `$${Q.tex}$`],
      placeholder: '1 ± 2i',
    };
  }
}

function standardForm(): Problem {
  for (;;) {
    // a x² + b x = c x + d form to rearrange
    const a = pick([1, 2]), b = nz(6), c = randInt(-12, 12), extra = nz(5);
    const D = b * b - 4 * a * c;
    if (D < 0) continue;
    const Q = quadRoots(a, b, c);
    // show as a x² + (b + extra) x = extra x − c
    return {
      skill: 'standard',
      prompt: `Solve: $\\;${quadTex(a, b + extra, 0)} = ${quadTex(0, extra, -c)}$`,
      answer: { type: 'solutions', values: Q.real, variable: 'x' },
      hints: ['First write the equation in standard form $ax^2 + bx + c = 0$.', `$${quadTex(a, b, c)} = 0$`],
      solution: [`$${quadTex(a, b, c)} = 0$`, formulaSteps(a, b, c), `$${Q.tex}$`],
      placeholder: '2 ± sqrt(3)',
    };
  }
}

export const skills: Skill[] = [
  { id: 'rational', label: 'Rational solutions', generate: rational },
  { id: 'irrational', label: 'Irrational solutions', generate: irrational },
  { id: 'standard', label: 'Write in standard form first', generate: standardForm },
  { id: 'complex', label: 'Complex solutions', generate: complexRoots },
];

export const masterySet = makeMasterySet(skills);
