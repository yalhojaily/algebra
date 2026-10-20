// Practice problem generators for Lesson 8.1 — Systems of Equations in Two Variables.
import { choice, makeMasterySet, nz, pick, randInt } from './helpers';
import { combTex, randSys2, sys2Tex, systemTex } from './systems';
import type { Problem, Skill } from './types';

function checkPoint(): Problem {
  const s = randSys2();
  const good = Math.random() < 0.5;
  // a near-miss point satisfies the first equation only
  let px = s.x, py = s.y;
  if (!good) {
    // move along the first line: (x + b, y − a)
    px = s.x + s.b; py = s.y - s.a;
  }
  const v1 = s.a * px + s.b * py, v2 = s.d * px + s.e * py;
  return {
    skill: 'check',
    prompt: `Is $(${px}, ${py})$ a solution of the system $\\;${sys2Tex(s)}$?`,
    answer: choice(good ? 'Yes' : 'No', [good ? 'No' : 'Yes']),
    hints: ['Substitute the point into **both** equations. It is a solution only if **both** are true.'],
    solution: [
      `First: $${s.a}(${px}) ${s.b < 0 ? '-' : '+'} ${Math.abs(s.b)}(${py}) = ${v1}$ ${v1 === s.c ? '✓' : `$\\ne ${s.c}$ ✗`}`,
      `Second: $${s.d}(${px}) ${s.e < 0 ? '-' : '+'} ${Math.abs(s.e)}(${py}) = ${v2}$ ${v2 === s.f ? '✓' : `$\\ne ${s.f}$ ✗`}`,
      good ? 'Both are true, so it **is** a solution.' : 'It makes the first equation true but not the second, so it is **not** a solution.',
    ],
  };
}

function readGraph(): Problem {
  for (;;) {
    const x = randInt(-5, 5), y = randInt(-5, 5);
    const m1 = pick([1, 2, -1, -2, 3, 0.5, -0.5]);
    let m2 = pick([1, 2, -1, -2, -3, 0.5]);
    if (m2 === m1) continue;
    const b1 = y - m1 * x, b2 = y - m2 * x;
    if (!Number.isInteger(b1 * 2) || !Number.isInteger(b2 * 2)) continue;
    // y = m x + b  →  −m x + y = b, scaled to integers
    const L = (m: number, b: number) => ({ a: -m * 2, b: 2, c: b * 2 });
    return {
      skill: 'graph',
      prompt: 'The graphs of the two equations in a system are shown. What is the solution of the system?',
      figure: { kind: 'plane', lines: [L(m1, b1), L(m2, b2)], range: 8 },
      answer: { type: 'point', x, y },
      hints: ['The solution is the point where the two lines **cross** — it lies on both lines.'],
      solution: [`The lines intersect at $(${x}, ${y})$.`],
      placeholder: '(2, -1)',
    };
  }
}

function countSolutions(): Problem {
  const kind = pick(['one', 'none', 'many'] as const);
  const a = nz(4), b = nz(4), k = pick([2, 3, -2]);
  const c = randInt(-8, 8);
  let rows: string[];
  if (kind === 'one') {
    const s = randSys2();
    rows = [combTex([s.a, s.b], ['x', 'y'], s.c), combTex([s.d, s.e], ['x', 'y'], s.f)];
  } else if (kind === 'none') {
    rows = [combTex([a, b], ['x', 'y'], c), combTex([k * a, k * b], ['x', 'y'], k * c + pick([1, -1, 2]) * Math.abs(k))];
  } else {
    rows = [combTex([a, b], ['x', 'y'], c), combTex([k * a, k * b], ['x', 'y'], k * c)];
  }
  const label = { one: 'Exactly one solution', none: 'No solution', many: 'Infinitely many solutions' }[kind];
  return {
    skill: 'count',
    prompt: `How many solutions does this system have? $\\;${systemTex(rows)}$`,
    answer: choice(label, ['Exactly one solution', 'No solution', 'Infinitely many solutions'].filter((x) => x !== label)),
    hints: ['Compare the equations. Is one a multiple of the other? Then compare the slopes (solve each for $y$).'],
    solution: [
      kind === 'one' ? 'The slopes are different, so the lines cross at exactly one point.' : kind === 'none' ? `The left side of the second equation is $${k}$ times the first, but the right side is not: the lines are **parallel** (same slope, different intercepts) and never meet.` : `The second equation is just $${k}$ times the first: both describe the **same line**, so every point on it is a solution.`,
    ],
  };
}

function classify(): Problem {
  const kind = pick(['one', 'none', 'many'] as const);
  const label = { one: 'Consistent and independent', none: 'Inconsistent', many: 'Consistent and dependent' }[kind];
  const desc = { one: 'cross at exactly one point', none: 'are parallel and never meet', many: 'are the same line' }[kind];
  return {
    skill: 'classify',
    prompt: `The graphs of the two equations of a system ${desc}. How is the system described?`,
    answer: choice(label, ['Consistent and independent', 'Inconsistent', 'Consistent and dependent'].filter((x) => x !== label)),
    hints: ['**Consistent** means there is at least one solution. **Dependent** means the equations describe the same line (infinitely many solutions).'],
    solution: [kind === 'one' ? 'One solution: consistent; different lines: independent.' : kind === 'none' ? 'No solution: the system is **inconsistent**.' : 'Infinitely many solutions: consistent; the equations are equivalent, so they are **dependent**.'],
  };
}

export const skills: Skill[] = [
  { id: 'check', label: 'Check a solution', generate: checkPoint },
  { id: 'graph', label: 'Solve by graphing', generate: readGraph },
  { id: 'count', label: 'How many solutions?', generate: countSolutions },
  { id: 'classify', label: 'Consistent? Dependent?', generate: classify },
];

export const masterySet = makeMasterySet(skills);
