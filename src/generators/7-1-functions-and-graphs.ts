// Practice problem generators for Lesson 7.1 — Functions and Graphs.
import { choice, makeMasterySet, nz, p, pick, Poly, randInt, shuffle } from './helpers';

import type { PlaneFig, Problem, Skill } from './types';

function isFunctionPairs(): Problem {
  const xs = shuffle([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 4);
  const pairs = xs.map((x) => [x, randInt(-5, 5)] as [number, number]);
  const yes = Math.random() < 0.5;
  if (!yes) pairs.push([pairs[1][0], pairs[1][1] + pick([1, 2, -3])]);
  // sometimes repeat an output (still a function) to catch the common misconception
  if (yes && Math.random() < 0.6) pairs[3][1] = pairs[0][1];
  const shown = shuffle(pairs);
  const set = `\\{${shown.map(([x, y]) => `(${x}, ${y})`).join(',\\ ')}\\}`;
  const dupX = pairs[1][0];
  return {
    skill: 'pairs',
    prompt: `Is this correspondence a function? $\\;${set}$`,
    answer: choice(yes ? 'Yes, it is a function' : 'No, it is not a function', [yes ? 'No, it is not a function' : 'Yes, it is a function']),
    hints: ['A function assigns **exactly one** output to each input. Look for an $x$-value (first coordinate) that appears twice with **different** $y$-values.'],
    solution: [yes
      ? `Every first coordinate appears only once${pairs[3][1] === pairs[0][1] ? ' (two inputs share the same output, which is allowed)' : ''}, so this **is** a function.`
      : `The input $${dupX}$ is paired with two different outputs, so this is **not** a function.`],
  };
}

function evaluate(): Problem {
  const f = pick(['f', 'g', 'h']);
  const deg = pick([1, 2, 2]);
  const P = deg === 1 ? Poly.fromCoefs([nz(6), nz(9)]) : Poly.fromCoefs([nz(3), randInt(-6, 6), nz(9)]);
  const a = nz(5);
  const val = P.evaluate({ x: a });
  const sub = P.ordered().map(([c, v], i) => {
    const e = v.x ?? 0;
    const body = e === 0 ? String(Math.abs(c)) : `${Math.abs(c) === 1 ? '' : Math.abs(c)}(${a})${e === 2 ? '^2' : ''}`;
    const sign = c < 0 ? '-' : i ? '+' : '';
    return `${i ? ` ${sign} ` : sign}${body}`;
  }).join('');
  return {
    skill: 'evaluate',
    prompt: `For $${f}(x) = ${P.tex()}$, find $${f}(${a})$.`,
    answer: { type: 'number', value: val },
    hints: [`Replace **every** $x$ with $${p(a)}$ — use parentheses.`, deg === 2 ? `Square first: $${p(a)}^2 = ${a * a}$.` : 'Then multiply and add.'],
    solution: [`$${f}(${a}) = ${sub}$`, `$= ${val}$`],
    mistakes: [{ answer: String(P.evaluate({ x: -a })), feedback: `Careful with the sign — substitute $x = ${p(a)}$ exactly, in parentheses.` }],
  };
}

function verticalLine(): Problem {
  const k = randInt(0, 4);
  const shapes: { fig: PlaneFig; fn: boolean; name: string }[] = [
    { fig: { kind: 'plane', curves: [[pick([1, -1, 0.5]), 0, randInt(-4, 2)]], range: 10 }, fn: true, name: 'a parabola opening up or down' },
    { fig: { kind: 'plane', lines: [{ a: nz(3), b: nz(3), c: randInt(-6, 6) }], range: 10 }, fn: true, name: 'a slanted line' },
    { fig: { kind: 'plane', xcurves: [[pick([1, -1, 0.5]), 0, randInt(-4, 2)]], range: 10 }, fn: false, name: 'a sideways parabola' },
    { fig: { kind: 'plane', circles: [{ cx: randInt(-2, 2), cy: randInt(-2, 2), r: randInt(3, 6) }], range: 10 }, fn: false, name: 'a circle' },
    { fig: { kind: 'plane', lines: [{ a: 1, b: 0, c: randInt(-6, 6) }], range: 10 }, fn: false, name: 'a vertical line' },
  ];
  const s = shapes[k];
  return {
    skill: 'vertical',
    prompt: 'Is this the graph of a function?',
    figure: s.fig,
    answer: choice(s.fn ? 'Yes, it is a function' : 'No, it is not a function', [s.fn ? 'No, it is not a function' : 'Yes, it is a function']),
    hints: ['Use the **vertical-line test**: imagine sliding a vertical line across the graph. If it ever crosses the graph more than once, it is not a function.'],
    solution: [s.fn ? `This is ${s.name}. Every vertical line crosses it at most once, so it **is** a function.` : `This is ${s.name}. Some vertical line crosses it more than once${k === 4 ? ' (in fact, infinitely many times)' : ''}, so it is **not** a function.`],
  };
}

function readGraph(): Problem {
  for (;;) {
    const h = randInt(-3, 3), kk = randInt(-5, 3), a = pick([1, -1]);
    // y = a (x − h)² + k
    const P = Poly.fromCoefs([a, -2 * a * h, a * h * h + kk]);
    const x0 = h + pick([-2, -1, 1, 2]);
    const y0 = P.evaluate({ x: x0 });
    if (Math.abs(y0) > 9) continue;
    const linear = Math.random() < 0.4;
    if (linear) {
      const m = nz(2), b = randInt(-4, 4);
      const xl = randInt(-4, 4), yl = m * xl + b;
      if (Math.abs(yl) > 9) continue;
      return {
        skill: 'read',
        prompt: `The graph of $f$ is shown. Find $f(${xl})$.`,
        figure: { kind: 'plane', lines: [{ a: -m, b: 1, c: b }], range: 10 },
        answer: { type: 'number', value: yl },
        hints: [`Find $x = ${xl}$ on the $x$-axis. Go straight up or down to the graph, then across to the $y$-axis.`],
        solution: [`The point on the graph above $x = ${xl}$ is $(${xl}, ${yl})$, so $f(${xl}) = ${yl}$.`],
      };
    }
    return {
      skill: 'read',
      prompt: `The graph of $f$ is shown. Find $f(${x0})$.`,
      figure: { kind: 'plane', curves: [P.coefs('x')], range: 10 },
      answer: { type: 'number', value: y0 },
      hints: [`Find $x = ${x0}$ on the $x$-axis. Go straight up or down to the graph, then across to the $y$-axis to read the output.`],
      solution: [`The point on the graph above $x = ${x0}$ is $(${x0}, ${y0})$, so $f(${x0}) = ${y0}$.`],
      mistakes: [{ answer: String(x0), feedback: 'That is the input. $f(x)$ is the **output** — the $y$-value of the point.' }],
    };
  }
}

export const skills: Skill[] = [
  { id: 'pairs', label: 'Function or not?', generate: isFunctionPairs },
  { id: 'evaluate', label: 'Evaluate f(x)', generate: evaluate },
  { id: 'vertical', label: 'Vertical-line test', generate: verticalLine },
  { id: 'read', label: 'Read values from a graph', generate: readGraph },
];

export const masterySet = makeMasterySet(skills);
