// Practice problem generators for Lesson 3.1 — Introduction to Graphing.
import { linTex, makeMasterySet, nz, p, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const QUAD = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV', 'On an axis (no quadrant)'];
const quadrantOf = (x: number, y: number) => (x === 0 || y === 0 ? 4 : x > 0 ? (y > 0 ? 0 : 3) : y > 0 ? 1 : 2);

function readPoint(): Problem {
  const x = randInt(-8, 8);
  const y = randInt(-8, 8);
  const label = pick(['A', 'B', 'P', 'Q']);
  return {
    skill: 'read',
    prompt: `What are the coordinates of point $${label}$?`,
    figure: { kind: 'plane', points: [{ x, y, label }], range: 10 },
    answer: { type: 'point', x, y },
    hints: ['Start at the origin. How far **left or right** is the point? That is the $x$-coordinate. How far **up or down**? That is the $y$-coordinate.', 'Write the answer as $(x, y)$.'],
    solution: [`Move ${x === 0 ? '$0$ units' : `$${Math.abs(x)}$ units ${x > 0 ? 'right' : 'left'}`}, then ${y === 0 ? '$0$ units' : `$${Math.abs(y)}$ units ${y > 0 ? 'up' : 'down'}`}: $${label}(${x}, ${y})$.`],
    placeholder: '(x, y)',
  };
}

function quadrant(): Problem {
  const x = Math.random() < 0.15 ? 0 : nz(12);
  const y = Math.random() < 0.15 && x !== 0 ? 0 : nz(12);
  const q = quadrantOf(x, y);
  return {
    skill: 'quadrant',
    prompt: `In which quadrant is the point $(${x}, ${y})$?`,
    answer: { type: 'choice', options: QUAD, correct: q },
    hints: ['Quadrant I is upper right $(+, +)$; then go counter-clockwise: II $(-, +)$, III $(-, -)$, IV $(+, -)$.', 'A point with a $0$ coordinate lies on an axis.'],
    solution: [q === 4 ? 'One coordinate is $0$, so the point lies on an axis — not in any quadrant.' : `The signs are $(${x > 0 ? '+' : '-'}, ${y > 0 ? '+' : '-'})$, so the point is in **${QUAD[q]}**.`],
  };
}

function plotPoint(): Problem {
  const x = randInt(-9, 9);
  const y = randInt(-9, 9);
  return {
    skill: 'plot',
    prompt: `Plot the point $(${x}, ${y})$.`,
    answer: { type: 'plot', mode: 'point', x, y },
    hints: ['The first number tells you how far to move **horizontally**; the second, how far **vertically**.'],
    solution: [`From the origin, move ${Math.abs(x)} ${x >= 0 ? 'right' : 'left'} and ${Math.abs(y)} ${y >= 0 ? 'up' : 'down'}.`],
  };
}

function isSolution(): Problem {
  const m = nz(5);
  const b = randInt(-8, 8);
  const x = randInt(-5, 5);
  const yes = Math.random() < 0.5;
  const y = m * x + b + (yes ? 0 : pick([-2, -1, 1, 2]));
  const form = pick(['slope', 'standard'] as const);
  // standard form: -m x + y = b
  const eq = form === 'slope' ? `y = ${linTex(m, b)}` : `${linTex(-m, 0)} + y = ${b}`;
  const lhs = form === 'slope' ? `${y}` : `${-m} \\cdot ${p(x)} + ${p(y)}`;
  const lval = form === 'slope' ? y : -m * x + y;
  const rhs = form === 'slope' ? `${m} \\cdot ${p(x)} + ${p(b)}` : `${b}`;
  const rval = form === 'slope' ? m * x + b : b;
  return {
    skill: 'solution',
    prompt: `Is $(${x}, ${y})$ a solution of $\\;${eq}$?`,
    answer: { type: 'choice', options: ['Yes', 'No'], correct: yes ? 0 : 1 },
    hints: [`Substitute $${x}$ for $x$ and $${y}$ for $y$. Do both sides come out equal?`],
    solution: [`Left: $${lhs} = ${lval}$. Right: $${rhs} = ${rval}$.`, yes ? 'Both sides are equal, so it **is** a solution.' : 'The sides are not equal, so it is **not** a solution.'],
  };
}

function completePair(): Problem {
  const a = nz(5);
  const b = nz(4);
  const x = randInt(-6, 6);
  const y = randInt(-6, 6);
  const c = a * x + b * y;
  const askY = Math.random() < 0.6;
  const eq = `${linTex(a, 0)} ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${c}`;
  return {
    skill: 'complete',
    prompt: askY ? `Find $y$ so that $(${x}, y)$ is a solution of $\\;${eq}$.` : `Find $x$ so that $(x, ${y})$ is a solution of $\\;${eq}$.`,
    answer: { type: 'number', value: askY ? y : x },
    hints: [askY ? `Substitute $${x}$ for $x$, then solve for $y$.` : `Substitute $${y}$ for $y$, then solve for $x$.`],
    solution: askY
      ? [`$${a} \\cdot ${p(x)} + ${b}y = ${c}$`, `$${b}y = ${c - a * x}$`, `$y = ${y}$`]
      : [`$${a}x + ${b} \\cdot ${p(y)} = ${c}$`, `$${a}x = ${c - b * y}$`, `$x = ${x}$`],
  };
}

export const skills: Skill[] = [
  { id: 'read', label: 'Read a point', generate: readPoint },
  { id: 'plot', label: 'Plot a point', generate: plotPoint },
  { id: 'quadrant', label: 'Quadrants', generate: quadrant },
  { id: 'solution', label: 'Is it a solution?', generate: isSolution },
  { id: 'complete', label: 'Complete the pair', generate: completePair },
];

export const masterySet = makeMasterySet(skills);
