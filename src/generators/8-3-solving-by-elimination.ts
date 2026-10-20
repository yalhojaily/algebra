// Practice problem generators for Lesson 8.3 — Solving by Elimination.
import { choice, makeMasterySet, nz, pick, randInt } from './helpers';
import { combTex, pickVars, systemTex } from './systems';
import type { Problem, Skill } from './types';

function opposites(): Problem {
  const [u, w] = pickVars();
  for (;;) {
    const x = randInt(-6, 6), y = randInt(-6, 6);
    const a = nz(5), b = nz(5), d = nz(5);
    const e = -b; // y-terms already opposite
    if (a + d === 0) continue;
    const c = a * x + b * y, f = d * x + e * y;
    return {
      skill: 'add',
      prompt: `Solve by elimination: $\\;${systemTex([combTex([a, b], [u, w], c), combTex([d, e], [u, w], f)])}$`,
      answer: { type: 'point', x, y },
      hints: [`The $${w}$-terms are opposites. Add the equations to eliminate $${w}$.`],
      solution: [`Add: $${combTex([a + d, 0], [u, w], c + f)}$, so $${u} = ${x}$.`, `Substitute into the first equation: $${a}(${x}) ${b < 0 ? '-' : '+'} ${Math.abs(b)}${w} = ${c}$, so $${w} = ${y}$.`, `Solution: $(${x}, ${y})$`],
      placeholder: '(1, 4)',
    };
  }
}

function multiplyOne(): Problem {
  const [u, w] = pickVars();
  for (;;) {
    const x = randInt(-6, 6), y = randInt(-6, 6);
    const a = nz(4), b = nz(5), k = pick([2, 3, -2, -3]);
    const d = nz(5), e = -k * b; // multiply the first by k to get opposite w-terms
    if (a * e - b * d === 0) continue;
    const c = a * x + b * y, f = d * x + e * y;
    return {
      skill: 'multiply',
      prompt: `Solve by elimination: $\\;${systemTex([combTex([a, b], [u, w], c), combTex([d, e], [u, w], f)])}$`,
      answer: { type: 'point', x, y },
      hints: [`Multiply the first equation by $${k}$ so its $${w}$-term becomes the opposite of $${e}${w}$.`, 'Then add the equations.'],
      solution: [`$${k} \\times$ first: $${combTex([k * a, k * b], [u, w], k * c)}$`, `Add to the second: $${combTex([k * a + d, 0], [u, w], k * c + f)}$, so $${u} = ${x}$.`, `Back-substitute: $${w} = ${y}$.`, `Solution: $(${x}, ${y})$`],
      placeholder: '(1, 4)',
    };
  }
}

function multiplyBoth(): Problem {
  const [u, w] = pickVars();
  for (;;) {
    const x = randInt(-5, 5), y = randInt(-5, 5);
    const a = pick([2, 3, 4, 5]), d = pick([2, 3, 4, 5, -2, -3]);
    if (a === Math.abs(d)) continue;
    const b = nz(5), e = nz(5);
    if (a * e - b * d === 0) continue;
    const c = a * x + b * y, f = d * x + e * y;
    // eliminate u: multiply first by d, second by −a
    return {
      skill: 'both',
      prompt: `Solve by elimination: $\\;${systemTex([combTex([a, b], [u, w], c), combTex([d, e], [u, w], f)])}$`,
      answer: { type: 'point', x, y },
      hints: [`Neither variable has opposite coefficients yet. To eliminate $${u}$, multiply the first equation by $${d}$ and the second by $${-a}$.`, 'Then add and solve.'],
      solution: [
        `$${d} \\times$ first: $${combTex([a * d, b * d], [u, w], c * d)}$`,
        `$${-a} \\times$ second: $${combTex([-a * d, -a * e], [u, w], -a * f)}$`,
        `Add: $${combTex([0, b * d - a * e], [u, w], c * d - a * f)}$, so $${w} = ${y}$.`,
        `Back-substitute: $${u} = ${x}$. Solution: $(${x}, ${y})$`,
      ],
      placeholder: '(1, 4)',
    };
  }
}

function special(): Problem {
  const a = nz(4), b = nz(4), c = randInt(-8, 8), k = pick([2, -2, 3]);
  const many = Math.random() < 0.5;
  const f = k * c + (many ? 0 : pick([1, -1, 3]));
  const label = many ? 'Infinitely many solutions' : 'No solution';
  return {
    skill: 'special',
    prompt: `Solve by elimination: $\\;${systemTex([combTex([a, b], ['x', 'y'], c), combTex([k * a, k * b], ['x', 'y'], f)])}$`,
    answer: choice(label, ['No solution', 'Infinitely many solutions', 'Exactly one solution'].filter((x) => x !== label)),
    hints: [`Multiply the first equation by $${-k}$ and add.`],
    solution: [`Both variables cancel, leaving $0 = ${f - k * c}$.`, many ? 'That is always true — **infinitely many** solutions (the same line).' : 'That is false — **no solution** (parallel lines).'],
  };
}

export const skills: Skill[] = [
  { id: 'add', label: 'Add the equations', generate: opposites },
  { id: 'multiply', label: 'Multiply one equation first', generate: multiplyOne },
  { id: 'both', label: 'Multiply both equations', generate: multiplyBoth },
  { id: 'special', label: 'No solution or infinitely many', generate: special },
];

export const masterySet = makeMasterySet(skills);
