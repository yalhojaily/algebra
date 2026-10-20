// Practice problem generators for Lesson 11.6 — Graphing f(x) = ax² + bx + c.
import { choice, makeMasterySet, nz, pick, randInt } from './helpers';
import { quadRoots, quadTex } from './quad';
import type { Problem, Skill } from './types';

function rand() {
  const a = pick([1, -1, 2, -2, 3]), h = randInt(-4, 4), k = randInt(-6, 6);
  return { a, h, k, b: -2 * a * h, c: a * h * h + k };
}

function vertex(): Problem {
  const { a, b, c, h, k } = rand();
  return {
    skill: 'vertex',
    prompt: `Find the vertex of $\\;f(x) = ${quadTex(a, b, c)}$.`,
    answer: { type: 'point', x: h, y: k },
    hints: ['The $x$-coordinate of the vertex is $-\\dfrac{b}{2a}$.', 'Substitute it into $f$ to get the $y$-coordinate.'],
    solution: [`$x = -\\dfrac{${b}}{2(${a})} = ${h}$`, `$f(${h}) = ${k}$`, `Vertex: $(${h}, ${k})$`],
    placeholder: '(1, -4)',
  };
}

function vertexForm(): Problem {
  const { a, b, c, h, k } = rand();
  const f = (A: number, H: number, K: number) => `${A === 1 ? '' : A === -1 ? '-' : A}(x ${H < 0 ? '+' : '-'} ${Math.abs(H)})^2 ${K < 0 ? '-' : '+'} ${Math.abs(K)}`.replace('(x - 0)', 'x').replace('(x + 0)', 'x').replace(' + 0', '').replace(' - 0', '');
  const correct = `$f(x) = ${f(a, h, k)}$`;
  const wrong = [`$f(x) = ${f(a, -h, k)}$`, `$f(x) = ${f(a, h, c)}$`, `$f(x) = ${f(1, h, k)}$`].filter((w) => w !== correct);
  return {
    skill: 'form',
    prompt: `Complete the square to write $\\;f(x) = ${quadTex(a, b, c)}\\;$ in the form $a(x - h)^2 + k$.`,
    answer: choice(correct, wrong),
    hints: [a === 1 ? `Add and subtract $\\left(\\frac{${b}}{2}\\right)^2 = ${(b / 2) ** 2}$.` : `First factor $${a}$ out of the $x^2$ and $x$ terms.`, 'Or: find the vertex $(h, k)$ with $h = -\\frac{b}{2a}$, $k = f(h)$; the value of $a$ does not change.'],
    solution: [`Vertex $(${h}, ${k})$, and $a = ${a}$: ${correct}`],
  };
}

function intercepts(): Problem {
  for (;;) {
    const p = nz(6), q = nz(6), a = pick([1, -1, 2]);
    if (p === q) continue;
    const b = -a * (p + q), c = a * p * q;
    const Q = quadRoots(a, b, c);
    const yi = Math.random() < 0.35;
    if (yi)
      return {
        skill: 'intercepts',
        prompt: `Find the $y$-intercept of $\\;f(x) = ${quadTex(a, b, c)}$.`,
        answer: { type: 'point', x: 0, y: c },
        hints: ['The $y$-intercept is $(0, f(0))$.'],
        solution: [`$f(0) = ${c}$, so the $y$-intercept is $(0, ${c})$.`],
        placeholder: '(0, 5)',
      };
    return {
      skill: 'intercepts',
      prompt: `Find the $x$-intercepts of $\\;f(x) = ${quadTex(a, b, c)}$. (Give the $x$-values.)`,
      answer: { type: 'solutions', values: Q.real, variable: 'x' },
      hints: ['Solve $f(x) = 0$ — by factoring or with the quadratic formula.'],
      solution: [`$${quadTex(a, b, c)} = 0$`, `$${Q.tex}$`],
      placeholder: '-2, 3',
    };
  }
}

function plotVertex(): Problem {
  const { a, b, c, h, k } = rand();
  return {
    skill: 'plot',
    prompt: `Click the vertex of $\\;f(x) = ${quadTex(a, b, c)}$.`,
    answer: { type: 'plot', mode: 'point', x: h, y: k },
    hints: ['$x = -\\dfrac{b}{2a}$, then $y = f(x)$.'],
    solution: [`$x = ${h}$, $f(${h}) = ${k}$: vertex $(${h}, ${k})$.`],
  };
}

export const skills: Skill[] = [
  { id: 'vertex', label: 'Vertex with −b/2a', generate: vertex },
  { id: 'form', label: 'Vertex form', generate: vertexForm },
  { id: 'intercepts', label: 'Intercepts', generate: intercepts },
  { id: 'plot', label: 'Plot the vertex', generate: plotVertex },
];

export const masterySet = makeMasterySet(skills);
