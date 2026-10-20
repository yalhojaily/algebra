// Practice problem generators for Lesson 10.7 — Applications Involving Powers and Roots.
import { makeMasterySet, pick, randInt } from './helpers';
import { radTex, radText, rootSplit } from './radicals';
import type { Problem, Skill } from './types';

const exact = (n: number) => {
  const { out, inside } = rootSplit(n);
  return { tex: radTex(out, inside), text: radText(out, inside) };
};

function hypotenuse(): Problem {
  const a = randInt(1, 9), b = randInt(1, 12);
  const c2 = a * a + b * b;
  const e = exact(c2);
  return {
    skill: 'hypotenuse',
    prompt: `A right triangle has legs of length ${a} and ${b}. Find the exact length of the hypotenuse. (Type sqrt( ) if needed.)`,
    answer: { type: 'number', value: Math.sqrt(c2) },
    hints: ['$a^2 + b^2 = c^2$.', `$c = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${c2}}$ — simplify if you can.`],
    solution: [`$c^2 = ${a}^2 + ${b}^2 = ${c2}$`, `$c = \\sqrt{${c2}}${e.tex !== `\\sqrt{${c2}}` ? ` = ${e.tex}` : ''}${Number.isInteger(Math.sqrt(c2)) ? '' : ` \\approx ${Math.sqrt(c2).toFixed(2)}`}$`],
    placeholder: 'sqrt(41)',
  };
}

function leg(): Problem {
  const a = randInt(1, 9), c = a + randInt(1, 8);
  const b2 = c * c - a * a;
  const e = exact(b2);
  const ctx = pick([
    `A ${c}-ft ladder leans against a wall with its foot ${a} ft from the wall. How high up the wall does it reach (exact, in feet)?`,
    `A right triangle has hypotenuse ${c} and one leg ${a}. Find the exact length of the other leg.`,
  ]);
  return {
    skill: 'leg',
    prompt: `${ctx} (Type sqrt( ) if needed.)`,
    answer: { type: 'number', value: Math.sqrt(b2) },
    hints: ['$a^2 + b^2 = c^2$, so $b = \\sqrt{c^2 - a^2}$.'],
    solution: [`$b = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${b2}}${e.tex !== `\\sqrt{${b2}}` ? ` = ${e.tex}` : ''}${Number.isInteger(Math.sqrt(b2)) ? '' : ` \\approx ${Math.sqrt(b2).toFixed(2)}`}$`],
    mistakes: [{ answer: `sqrt(${c * c + a * a})`, feedback: 'The hypotenuse is the longest side. Subtract: $b^2 = c^2 - a^2$.' }],
    placeholder: 'sqrt(33)',
  };
}

function distance(): Problem {
  const x1 = randInt(-6, 6), y1 = randInt(-6, 6), x2 = randInt(-6, 6), y2 = randInt(-6, 6);
  if (x1 === x2 && y1 === y2) return distance();
  const d2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  const e = exact(d2);
  const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);
  return {
    skill: 'distance',
    prompt: `Find the exact distance between $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
    figure: { kind: 'plane', points: [{ x: x1, y: y1 }, { x: x2, y: y2 }], segments: [{ x1, y1, x2, y2 }], range: 8 },
    answer: { type: 'number', value: Math.sqrt(d2) },
    hints: ['$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ — the Pythagorean theorem on the grid.'],
    solution: [`$d = \\sqrt{(${x2} - ${p(x1)})^2 + (${y2} - ${p(y1)})^2} = \\sqrt{${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}} = \\sqrt{${d2}}${e.tex !== `\\sqrt{${d2}}` ? ` = ${e.tex}` : ''}$`],
    placeholder: '2sqrt(10)',
  };
}

function special(): Problem {
  const kind = pick(['45', '30'] as const);
  const a = randInt(2, 9);
  if (kind === '45')
    return {
      skill: 'special',
      prompt: `An isosceles right triangle (45°–45°–90°) has legs of length ${a}. Find the exact length of the hypotenuse.`,
      answer: { type: 'number', value: a * Math.SQRT2 },
      hints: ['In a 45°–45°–90° triangle, the hypotenuse is $\\sqrt{2}$ times a leg.'],
      solution: [`$c = \\sqrt{${a}^2 + ${a}^2} = \\sqrt{${2 * a * a}} = ${a}\\sqrt{2}$`],
      placeholder: '5sqrt(2)',
    };
  return {
    skill: 'special',
    prompt: `In a 30°–60°–90° triangle the shorter leg is ${a}. Find the exact length of the longer leg.`,
    answer: { type: 'number', value: a * Math.sqrt(3) },
    hints: ['In a 30°–60°–90° triangle, the hypotenuse is twice the shorter leg, and the longer leg is $\\sqrt{3}$ times the shorter leg.'],
    solution: [`Hypotenuse $= ${2 * a}$. Longer leg $= \\sqrt{${2 * a}^2 - ${a}^2} = \\sqrt{${3 * a * a}} = ${a}\\sqrt{3}$`],
    placeholder: '4sqrt(3)',
  };
}

export const skills: Skill[] = [
  { id: 'hypotenuse', label: 'Hypotenuse', generate: hypotenuse },
  { id: 'leg', label: 'Missing leg', generate: leg },
  { id: 'distance', label: 'Distance between points', generate: distance },
  { id: 'special', label: 'Special right triangles', generate: special },
];

export const masterySet = makeMasterySet(skills);
