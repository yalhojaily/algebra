// Practice problem generators for Lesson 9.4 — Systems of Inequalities in Two Variables.
import { choice, F, linTex, makeMasterySet, nz, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

type Op = '<' | '<=' | '>' | '>=';
const opTex: Record<Op, string> = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' };
const holds = (l: number, op: Op, r: number) => (op === '<' ? l < r : op === '<=' ? l <= r : op === '>' ? l > r : l >= r);

/** y (op) m x + b  as a region a x + b y (op) c */
const regionOf = (m: number, b: number, op: Op) => ({ a: -m, b: 1, c: b, op });

function testPoint(): Problem {
  const m = nz(3), b = randInt(-4, 4), op = pick(['<', '<=', '>', '>='] as Op[]);
  const px = randInt(-5, 5);
  const onLine = Math.random() < 0.25;
  const py = onLine ? m * px + b : randInt(-8, 8);
  const ok = holds(py, op, m * px + b);
  return {
    skill: 'test',
    prompt: `Is $(${px}, ${py})$ a solution of $\\;y ${opTex[op]} ${linTex(F(m), F(b))}$?`,
    answer: choice(ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes']),
    hints: ['Substitute the coordinates and see whether the inequality is true.'],
    solution: [`$${py} ${opTex[op]} ${m}(${px}) ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${m * px + b}$ is ${ok ? '**true**' : '**false**'}${py === m * px + b ? ' — the point is on the boundary line, which is included only for ≤ or ≥' : ''}.`],
  };
}

function whichGraph(): Problem {
  const m = pick([1, 2, -1, -2, 0.5, -0.5]), b = randInt(-3, 3), op = pick(['<', '<=', '>', '>='] as Op[]);
  const label = `$y ${opTex[op]} ${linTex(F(m * 2, 2), F(b))}$`;
  const others = (['<', '<=', '>', '>='] as Op[]).filter((o) => o !== op).map((o) => `$y ${opTex[o]} ${linTex(F(m * 2, 2), F(b))}$`);
  const r = regionOf(m, b, op);
  return {
    skill: 'graph',
    prompt: 'Which inequality is graphed? (A dashed line means the line is not included.)',
    figure: { kind: 'plane', regions: [{ a: r.a * 2, b: 2, c: r.c * 2, op }], range: 8 },
    answer: choice(label, others),
    hints: ['Shading **above** the line means $y >$ (or $\\ge$); **below** means $y <$ (or $\\le$).', 'A solid line is included: $\\le$ or $\\ge$. A dashed line is not: $<$ or $>$.'],
    solution: [`The shading is ${op.startsWith('>') ? 'above' : 'below'} the line and the line is ${op.length === 2 ? 'solid' : 'dashed'}: ${label}.`],
  };
}

function systemPoint(): Problem {
  const m1 = nz(2), b1 = randInt(-3, 3), op1 = pick(['<', '<=', '>', '>='] as Op[]);
  const m2 = -m1, b2 = randInt(-3, 3), op2 = pick(['<', '<=', '>', '>='] as Op[]);
  const px = randInt(-4, 4), py = randInt(-6, 6);
  const ok1 = holds(py, op1, m1 * px + b1), ok2 = holds(py, op2, m2 * px + b2);
  const ok = ok1 && ok2;
  return {
    skill: 'system',
    prompt: `Is $(${px}, ${py})$ a solution of the system $\\;\\begin{cases} y ${opTex[op1]} ${linTex(F(m1), F(b1))} \\\\ y ${opTex[op2]} ${linTex(F(m2), F(b2))} \\end{cases}$?`,
    figure: { kind: 'plane', regions: [{ ...regionOf(m1, b1, op1) }, { ...regionOf(m2, b2, op2), cls: 'alt' }], points: [{ x: px, y: py }], range: 8 },
    answer: choice(ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes']),
    hints: ['A solution of a system must satisfy **every** inequality — it lies where the shaded regions overlap.'],
    solution: [`First: ${ok1 ? 'true ✓' : 'false ✗'}. Second: ${ok2 ? 'true ✓' : 'false ✗'}.`, ok ? 'Both are true: it **is** a solution.' : 'At least one is false: it is **not** a solution.'],
  };
}

function vertex(): Problem {
  for (;;) {
    const x = randInt(-4, 4), y = randInt(-4, 4);
    const m1 = nz(3), m2 = nz(3);
    if (m1 === m2) continue;
    const b1 = y - m1 * x, b2 = y - m2 * x;
    const o1 = pick(['<=', '>='] as Op[]), o2 = pick(['<=', '>='] as Op[]);
    return {
      skill: 'vertex',
      prompt: `Find the vertex (corner point) of the region described by $\\;\\begin{cases} y ${opTex[o1]} ${linTex(F(m1), F(b1))} \\\\ y ${opTex[o2]} ${linTex(F(m2), F(b2))} \\end{cases}$`,
      figure: { kind: 'plane', regions: [regionOf(m1, b1, o1), { ...regionOf(m2, b2, o2), cls: 'alt' }], range: 8 },
      answer: { type: 'point', x, y },
      hints: ['The vertex is where the two **boundary lines** cross. Solve the system of equations you get by changing each inequality sign to $=$.'],
      solution: [`$${linTex(F(m1), F(b1))} = ${linTex(F(m2), F(b2))}$ gives $x = ${x}$`, `then $y = ${y}$: the vertex is $(${x}, ${y})$.`],
      placeholder: '(1, -2)',
    };
  }
}

export const skills: Skill[] = [
  { id: 'test', label: 'Test a point', generate: testPoint },
  { id: 'graph', label: 'Read a graph', generate: whichGraph },
  { id: 'system', label: 'Systems of inequalities', generate: systemPoint },
  { id: 'vertex', label: 'Vertices', generate: vertex },
];

export const masterySet = makeMasterySet(skills);
