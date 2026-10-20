// Practice problem generators for Lesson 11.4 — More on Quadratic Equations.
import { choice, makeMasterySet, nz, pick, randInt } from './helpers';
import { quadTex } from './quad';
import type { Problem, Skill } from './types';

function discriminant(): Problem {
  const kind = pick(['two', 'one', 'complex'] as const);
  let a: number, b: number, c: number;
  for (;;) {
    a = nz(4); b = randInt(-9, 9); c = randInt(-9, 9);
    const D = b * b - 4 * a * c;
    if ((kind === 'two' && D > 0) || (kind === 'complex' && D < 0)) break;
    if (kind === 'one') { const r = nz(5); a = pick([1, 4, 9]); const s = Math.sqrt(a); b = -2 * s * r; c = r * r; break; }
  }
  const D = b * b - 4 * a * c;
  const label = D > 0 ? 'Two real solutions' : D === 0 ? 'One real solution (a double root)' : 'Two complex (non-real) solutions';
  return {
    skill: 'discriminant',
    prompt: `Use the discriminant to describe the solutions of $\\;${quadTex(a, b, c)} = 0$.`,
    answer: choice(label, ['Two real solutions', 'One real solution (a double root)', 'Two complex (non-real) solutions'].filter((x) => x !== label)),
    hints: ['The discriminant is $b^2 - 4ac$. Positive: two real solutions. Zero: one. Negative: two complex.'],
    solution: [`$b^2 - 4ac = ${b < 0 ? `(${b})` : b}^2 - 4(${a})(${c}) = ${D}$`, `${D > 0 ? 'Positive' : D === 0 ? 'Zero' : 'Negative'}: ${label.toLowerCase()}.`],
  };
}

function fromSolutions(): Problem {
  const r = randInt(-8, 8), s = randInt(-8, 8);
  const b = -(r + s), c = r * s;
  const f = (k: number) => `x ${k < 0 ? '+' : '-'} ${Math.abs(k)}`.replace('x - 0', 'x');
  return {
    skill: 'write',
    prompt: `Find a quadratic equation with solutions $${r}$ and $${s}$. (Write it as $x^2 + bx + c = 0$.)`,
    answer: { type: 'equation', value: `${quadTex(1, b, c)} = 0` },
    hints: ['If $r$ and $s$ are solutions, then $(x - r)(x - s) = 0$. Multiply it out.'],
    solution: [`$(${f(r)})(${f(s)}) = 0$`, `$${quadTex(1, b, c)} = 0$`],
    placeholder: 'x^2 - x - 6 = 0',
  };
}

function quadraticForm(): Problem {
  for (;;) {
    const p = pick([1, 4, 9, 16, 25]), q = pick([1, 4, 9, 16, 25, 36]);
    if (p === q) continue;
    // x⁴ − (p + q)x² + pq = 0 → x² = p or x² = q
    const roots = [Math.sqrt(p), -Math.sqrt(p), Math.sqrt(q), -Math.sqrt(q)];
    return {
      skill: 'form',
      prompt: `Solve: $\\;x^4 - ${p + q}x^2 + ${p * q} = 0$ (List all four real solutions.)`,
      answer: { type: 'solutions', values: roots, variable: 'x' },
      hints: ['This is **quadratic in form**: let $u = x^2$. Then $u^2 - ' + (p + q) + 'u + ' + p * q + ' = 0$.', 'Solve for $u$, then go back: $x^2 = u$.'],
      solution: [`$u^2 - ${p + q}u + ${p * q} = 0 \\Rightarrow (u - ${p})(u - ${q}) = 0$`, `$x^2 = ${p}$ or $x^2 = ${q}$`, `$x = \\pm ${Math.sqrt(p)}$ or $x = \\pm ${Math.sqrt(q)}$`],
      placeholder: '±2, ±3',
    };
  }
}

function sqrtForm(): Problem {
  for (;;) {
    const a = randInt(1, 5), b = randInt(1, 6);
    if (a === b) continue;
    // x − (a + b)√x + ab = 0 → √x = a or b → x = a², b²
    return {
      skill: 'sqrtform',
      prompt: `Solve: $\\;x - ${a + b}\\sqrt{x} + ${a * b} = 0$`,
      answer: { type: 'solutions', values: [a * a, b * b], variable: 'x' },
      hints: ['Let $u = \\sqrt{x}$, so $x = u^2$.', `$u^2 - ${a + b}u + ${a * b} = 0$`],
      solution: [`$(u - ${a})(u - ${b}) = 0$, so $\\sqrt{x} = ${a}$ or $\\sqrt{x} = ${b}$`, `$x = ${a * a}$ or $x = ${b * b}$ (both check)`],
      placeholder: '4, 9',
    };
  }
}

export const skills: Skill[] = [
  { id: 'discriminant', label: 'The discriminant', generate: discriminant },
  { id: 'write', label: 'Equations from solutions', generate: fromSolutions },
  { id: 'form', label: 'Quadratic in form', generate: quadraticForm },
  { id: 'sqrtform', label: 'Substitution with √x', generate: sqrtForm },
];

export const masterySet = makeMasterySet(skills);
