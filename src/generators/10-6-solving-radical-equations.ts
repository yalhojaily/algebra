// Practice problem generators for Lesson 10.6 — Solving Radical Equations.
import { makeMasterySet, nz, pick, randInt, termTex } from './helpers';
import type { Problem, Skill } from './types';

const lin = (a: number, b: number) => `${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;

function basic(): Problem {
  const a = pick([1, 1, 2, 3]), c = randInt(1, 9);
  const x = randInt(-8, 12);
  const b = c * c - a * x;
  if (b === 0) return basic();
  const isolate = Math.random() < 0.4 ? randInt(1, 6) : 0;
  return {
    skill: 'basic',
    prompt: `Solve: $\\;\\sqrt{${lin(a, b)}}${isolate ? ` + ${isolate}` : ''} = ${c + isolate}$`,
    answer: { type: 'solutions', values: [x], variable: 'x' },
    hints: [isolate ? `First isolate the radical: subtract $${isolate}$.` : 'The radical is already alone on one side.', 'Square both sides, then solve. Check your answer in the original equation.'],
    solution: [...(isolate ? [`$\\sqrt{${lin(a, b)}} = ${c}$`] : []), `$${lin(a, b)} = ${c * c}$`, `$x = ${x}$ — check: $\\sqrt{${c * c}} = ${c}$ ✓`],
    placeholder: 'x = 7',
  };
}

function extraneous(): Problem {
  // √(x + p) = x − q  →  x + p = (x − q)²  →  roots r1 (real) and r2 (extraneous)
  for (;;) {
    const r1 = randInt(-2, 9), r2 = randInt(-6, 6);
    if (r1 === r2) continue;
    // need x + p = (x − q)² with roots r1, r2: (x − r1)(x − r2) = 0 = x² − (2q + 1)x + q² − p
    const s = r1 + r2; // = 2q + 1
    if ((s - 1) % 2 !== 0) continue;
    const q = (s - 1) / 2, p = q * q - r1 * r2;
    if (r1 - q < 0 || r2 - q >= 0) continue; // r1 makes the right side ≥ 0, r2 makes it negative
    if (p === 0) continue;
    return {
      skill: 'extraneous',
      prompt: `Solve: $\\;\\sqrt{x ${p < 0 ? '-' : '+'} ${Math.abs(p)}} = x ${q < 0 ? '+' : '-'} ${Math.abs(q)}$`,
      answer: { type: 'solutions', values: [r1], variable: 'x' },
      hints: ['Square both sides: the right side becomes a binomial square.', 'Solve the quadratic, then **check both** answers in the original equation — squaring can create a false solution.'],
      solution: [
        `$x ${p < 0 ? '-' : '+'} ${Math.abs(p)} = (x ${q < 0 ? '+' : '-'} ${Math.abs(q)})^2$`,
        `$(x ${r1 < 0 ? '+' : '-'} ${Math.abs(r1)})(x ${r2 < 0 ? '+' : '-'} ${Math.abs(r2)}) = 0$, so $x = ${r1}$ or $x = ${r2}$`,
        `Check $x = ${r2}$: the right side is $${r2 - q}$, but a square root is never negative ✗`,
        `Check $x = ${r1}$: $\\sqrt{${r1 + p}} = ${r1 - q}$ ✓. The only solution is $x = ${r1}$.`,
      ],
      mistakes: [{ answer: `${r1}, ${r2}`, feedback: `Check $x = ${r2}$ in the original equation: the right side is negative, so it can't equal a square root.` }, { answer: `${r2}, ${r1}`, feedback: `Check $x = ${r2}$ in the original equation: the right side is negative, so it can't equal a square root.` }],
      placeholder: 'x = 5',
    };
  }
}

function cubeRoot(): Problem {
  const a = pick([1, 2, 3]), c = randInt(-4, 4), x = randInt(-8, 8);
  const b = c ** 3 - a * x;
  if (b === 0) return cubeRoot();
  return {
    skill: 'cube',
    prompt: `Solve: $\\;\\sqrt[3]{${lin(a, b)}} = ${c}$`,
    answer: { type: 'solutions', values: [x], variable: 'x' },
    hints: ['**Cube** both sides to undo the cube root.'],
    solution: [`$${lin(a, b)} = ${c < 0 ? `(${c})` : c}^3 = ${c ** 3}$`, `$x = ${x}$`],
    placeholder: 'x = 2',
  };
}

function twoRadicals(): Problem {
  for (;;) {
    const a = randInt(1, 5), c = randInt(1, 5);
    if (a === c) continue;
    const x = randInt(-3, 10);
    const b = nz(10);
    const d = a * x + b - c * x;
    if (a * x + b < 0 || d === 0) continue;
    return {
      skill: 'two',
      prompt: `Solve: $\\;\\sqrt{${lin(a, b)}} = \\sqrt{${lin(c, d)}}$`,
      answer: { type: 'solutions', values: [x], variable: 'x' },
      hints: ['Square both sides: both radicals disappear.', 'Check that the expressions under the radicals are not negative for your answer.'],
      solution: [`$${lin(a, b)} = ${lin(c, d)}$`, `$x = ${x}$ — check: both sides equal $\\sqrt{${a * x + b}}$ ✓`],
      placeholder: 'x = 3',
    };
  }
}

export const skills: Skill[] = [
  { id: 'basic', label: 'One radical', generate: basic },
  { id: 'extraneous', label: 'Check for false solutions', generate: extraneous },
  { id: 'cube', label: 'Cube roots', generate: cubeRoot },
  { id: 'two', label: 'Two radicals', generate: twoRadicals },
];

export const masterySet = makeMasterySet(skills);
