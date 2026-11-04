// Practice problem generators for Lesson 11.5 — Graphing f(x) = a(x − h)² + k.
import { choice, makeMasterySet, nz, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const fTex = (a: number, h: number, k: number) => {
  const A = a === 1 ? '' : a === -1 ? '-' : a;
  const inner = h === 0 ? 'x' : `x ${h < 0 ? '+' : '-'} ${Math.abs(h)}`;
  return `${A}${h === 0 ? 'x' : `(${inner})`}^2${k ? ` ${k < 0 ? '-' : '+'} ${Math.abs(k)}` : ''}`;
};
const coefs = (a: number, h: number, k: number) => [a, -2 * a * h, a * h * h + k];
const rand = () => ({ a: pick([1, -1, 2, -2, 0.5, -0.5, 3]), h: randInt(-5, 5), k: randInt(-5, 5) });

function vertex(): Problem {
  const { a, h, k } = rand();
  return {
    skill: 'vertex',
    prompt: `What is the vertex of the graph of $\\;f(x) = ${fTex(a, h, k)}$?`,
    answer: { type: 'point', x: h, y: k },
    hints: ['$f(x) = a(x - h)^2 + k$ has vertex $(h, k)$.', 'Careful with signs: $(x + 3)^2 = (x - (-3))^2$, so $h = -3$.'],
    solution: [`The vertex is $(${h}, ${k})$.`],
    mistakes: [{ answer: `(${-h}, ${k})`, feedback: `Watch the sign of $h$: in $(x ${h < 0 ? '+' : '-'} ${Math.abs(h)})^2$, $h = ${h}$.` }],
    placeholder: '(2, -3)',
  };
}

function plotVertex(): Problem {
  const { a, h, k } = rand();
  return {
    skill: 'plot',
    prompt: `Click the vertex of $\\;f(x) = ${fTex(a, h, k)}$ on the grid.`,
    answer: { type: 'plot', mode: 'point', x: h, y: k },
    hints: ['The vertex of $a(x - h)^2 + k$ is $(h, k)$.'],
    solution: [`Vertex $(${h}, ${k})$.`],
  };
}

function axis(): Problem {
  const { a, h, k } = rand();
  return {
    skill: 'axis',
    prompt: `Find the axis of symmetry of $\\;f(x) = ${fTex(a, h, k)}$. (Write an equation.)`,
    answer: { type: 'equation', value: `x = ${h}` },
    hints: ['The axis of symmetry is the vertical line through the vertex: $x = h$.'],
    solution: [`$x = ${h}$`],
    placeholder: 'x = 2',
  };
}

function maxMin(): Problem {
  const { a, h, k } = rand();
  const label = a > 0 ? `Minimum value ${k}` : `Maximum value ${k}`;
  return {
    skill: 'maxmin',
    prompt: `Does $\\;f(x) = ${fTex(a, h, k)}\\;$ have a maximum or a minimum value? What is it?`,
    figure: { kind: 'plane', curves: [coefs(a, h, k)], range: 8 },
    answer: choice(label, [a > 0 ? `Maximum value ${k}` : `Minimum value ${k}`, `${a > 0 ? 'Minimum' : 'Maximum'} value ${h}`, `${a > 0 ? 'Maximum' : 'Minimum'} value ${h}`]),
    hints: ['If $a > 0$ the parabola opens **up** and has a minimum; if $a < 0$ it opens **down** and has a maximum.', 'The max or min value is the $y$-coordinate of the vertex, $k$.'],
    solution: [`$a = ${a}$ ${a > 0 ? '> 0: opens up, minimum' : '< 0: opens down, maximum'} value $k = ${k}$ at $x = ${h}$.`],
  };
}

function transform(): Problem {
  const a = pick([2, 3, 0.5, -1, -2]), h = nz(5), k = randInt(-4, 4);
  const shift = `${h > 0 ? 'right' : 'left'} ${Math.abs(h)}`;
  const correct = `$f(x) = ${fTex(a, h, k)}$`;
  const others = [`$f(x) = ${fTex(a, -h, k)}$`, `$f(x) = ${fTex(a, k, h)}$`, `$f(x) = ${fTex(-a, h, k)}$`];
  return {
    skill: 'transform',
    prompt: `The graph of $y = ${a === -1 ? '-' : a}x^2$ is shifted **${shift}**${k ? ` and **${k > 0 ? 'up' : 'down'} ${Math.abs(k)}**` : ''}. Which function is it?`,
    answer: choice(correct, others),
    hints: ['Shifting right $h$ units replaces $x$ with $x - h$; shifting up $k$ adds $k$.'],
    solution: [correct],
  };
}


/** Read the vertex of a model in vertex form. */
function vertexWords(): Problem {
  const a = pick([-0.5, -1, -2, -0.25]), h = randInt(2, 8), k = randInt(3, 12);
  const kind = pick(['fountain', 'cable'] as const);
  const askH = Math.random() < 0.5;
  if (kind === 'fountain') {
    return {
      skill: 'apply',
      prompt: `The water from a fountain follows the path $y = ${a}(x - ${h})^2 + ${k}$, where $x$ is the horizontal distance from the nozzle and $y$ the height, both in meters. ${askH ? 'How far from the nozzle (horizontally) is the water highest (m)?' : 'What is the greatest height of the water (m)?'}`,
      answer: { type: 'number', value: askH ? h : k },
      hints: [`Unknown: ${askH ? 'the horizontal position of the highest point' : 'the greatest height'}. "Highest" means the **vertex**; $a = ${a} < 0$, so it is a maximum.`, `In $a(x - h)^2 + k$ the vertex is $(h, k)$: here $(${h}, ${k})$.`],
      solution: [`Vertex $(${h}, ${k})$`, askH ? `The water is highest ${h} m from the nozzle.` : `The greatest height is ${k} m.`],
      mistakes: [{ answer: String(askH ? k : h), feedback: askH ? 'That is the greatest **height**, the second coordinate of the vertex.' : 'That is the horizontal distance, the first coordinate of the vertex.' }],
      placeholder: '3',
    };
  }
  const b = pick([0.01, 0.02, 0.05]), H = randInt(20, 80), low = randInt(2, 10);
  return {
    skill: 'apply',
    prompt: `The cable of a small suspension bridge hangs in the shape $y = ${b}(x - ${H})^2 + ${low}$, where $x$ is the distance (m) from one tower and $y$ the cable's height (m) above the road. What is the **lowest** height of the cable (m)?`,
    answer: { type: 'number', value: low },
    hints: ['Unknown: the lowest height. $a = ' + b + ' > 0$, so the parabola opens up and the vertex is the **minimum**.', `The vertex of $a(x - h)^2 + k$ is $(h, k)$.`],
    solution: [`Vertex $(${H}, ${low})$: the cable is lowest, ${low} m above the road, at ${H} m from the tower.`],
    mistakes: [{ answer: String(H), feedback: 'That is where the lowest point is, not how high it is.' }],
    placeholder: '4',
  };
}

export const skills: Skill[] = [
  { id: 'vertex', label: 'Vertex', generate: vertex },
  { id: 'plot', label: 'Plot the vertex', generate: plotVertex },
  { id: 'axis', label: 'Axis of symmetry', generate: axis },
  { id: 'maxmin', label: 'Maximum or minimum', generate: maxMin },
  { id: 'transform', label: 'Shifts', generate: transform },
  { id: 'apply', label: 'Word problems', generate: vertexWords },
];

export const masterySet = makeMasterySet(skills);
