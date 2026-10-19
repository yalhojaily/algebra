// Practice problem generators for Lesson 5.9 — Applications of Quadratic Equations.
import { makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const five = (translate: string, solve: string[], check: string, state: string) => [`**Translate:** ${translate}`, ...solve.map((s, i) => (i ? s : `**Solve:** ${s}`)), `**Check:** ${check}`, `**State:** ${state}`];

function rectangle(): Problem {
  const w = randInt(3, 15), k = randInt(2, 8);
  const l = w + k;
  const A = l * w;
  return {
    skill: 'area',
    prompt: `A rectangle is $${k}$ cm longer than it is wide. Its area is $${A}$ cm². Find the **width**.`,
    answer: { type: 'number', value: w },
    hints: [`Let $w$ = width. Length $= w + ${k}$. Area $= w(w + ${k})$.`, 'Set the equation equal to 0, factor, and solve. A width can\'t be negative.'],
    solution: five(`$w(w + ${k}) = ${A}$`, [`$w^2 + ${k}w - ${A} = 0$`, `$(w - ${w})(w + ${l}) = 0$`, `$w = ${w}$ or $w = -${l}$`], `$${w} \\cdot ${l} = ${A}$ ✓ (a negative width makes no sense)`, `The width is $${w}$ cm (and the length is $${l}$ cm).`),
    mistakes: [{ answer: String(l), feedback: 'That is the **length**.' }],
  };
}

function consecutive(): Problem {
  const x = randInt(3, 20);
  const odd = Math.random() < 0.4;
  const step = odd ? 2 : 1;
  const a = odd && x % 2 === 0 ? x + 1 : x;
  const prod = a * (a + step);
  return {
    skill: 'consecutive',
    prompt: `The product of two consecutive ${odd ? 'odd ' : ''}positive integers is $${prod}$. Find the **smaller** integer.`,
    answer: { type: 'number', value: a },
    hints: [`Let $x$ = the smaller. The larger is $x + ${step}$.`, `Solve $x(x + ${step}) = ${prod}$.`],
    solution: five(`$x(x + ${step}) = ${prod}$`, [`$x^2 + ${step}x - ${prod} = 0$`, `$(x - ${a})(x + ${a + step}) = 0$`, `$x = ${a}$ or $x = -${a + step}$`], `$${a} \\cdot ${a + step} = ${prod}$ ✓; $-${a + step}$ is not positive.`, `The integers are $${a}$ and $${a + step}$.`),
  };
}

function pythagorean(): Problem {
  const [a0, b0, c0] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]]);
  const ask = pick(['leg', 'hyp'] as const);
  if (ask === 'hyp') {
    return {
      skill: 'pythagorean',
      prompt: `The legs of a right triangle are $${a0}$ m and $${b0}$ m. How long is the hypotenuse?`,
      answer: { type: 'number', value: c0 },
      hints: ['**Pythagorean theorem:** $a^2 + b^2 = c^2$, where $c$ is the hypotenuse (the side opposite the right angle).'],
      solution: [`$${a0}^2 + ${b0}^2 = c^2$`, `$${a0 * a0 + b0 * b0} = c^2$`, `$c = ${c0}$ (length is positive)`],
      mistakes: [{ answer: String(a0 + b0), feedback: 'You can\'t just add the legs. Square them, add, then take the square root.' }],
    };
  }
  // ladder problem: one leg is k more than the other, hypotenuse known
  const k = b0 - a0;
  return {
    skill: 'pythagorean',
    prompt: `A ladder $${c0}$ m long leans against a wall. The top of the ladder is $${k}$ m higher up the wall than the bottom is from the wall. How far is the bottom of the ladder from the wall?`,
    answer: { type: 'number', value: a0 },
    hints: [`Let $x$ = distance from the wall. Height $= x + ${k}$. Use $a^2 + b^2 = c^2$.`],
    solution: five(`$x^2 + (x + ${k})^2 = ${c0}^2$`, [`$2x^2 + ${2 * k}x + ${k * k} = ${c0 * c0}$`, `$2x^2 + ${2 * k}x - ${c0 * c0 - k * k} = 0$`, `$x^2 + ${k}x - ${(c0 * c0 - k * k) / 2} = 0$`, `$(x - ${a0})(x + ${b0}) = 0$, so $x = ${a0}$`], `$${a0}^2 + ${b0}^2 = ${c0 * c0} = ${c0}^2$ ✓`, `The bottom is $${a0}$ m from the wall.`),
  };
}

function falling(): Problem {
  const t = randInt(2, 8);
  const h = 5 * t * t;
  return {
    skill: 'falling',
    prompt: `An object is dropped from a height of $${h}$ m. Its distance fallen after $t$ seconds is about $5t^2$ meters. How many seconds until it hits the ground?`,
    answer: { type: 'number', value: t },
    hints: [`Solve $5t^2 = ${h}$: subtract to get 0 on one side, factor, and keep the positive solution.`],
    solution: [`$5t^2 - ${h} = 0$`, `$5(t^2 - ${t * t}) = 0 \\Rightarrow 5(t - ${t})(t + ${t}) = 0$`, `$t = ${t}$ (time can't be negative)`],
  };
}

export const skills: Skill[] = [
  { id: 'area', label: 'Area', generate: rectangle },
  { id: 'consecutive', label: 'Consecutive integers', generate: consecutive },
  { id: 'pythagorean', label: 'Pythagorean theorem', generate: pythagorean },
  { id: 'falling', label: 'Falling objects', generate: falling },
];

export const masterySet = makeMasterySet(skills);
