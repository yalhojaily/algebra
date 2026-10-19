// Practice problem generators for Lesson 3.3 — More with Graphing and Intercepts.
import { choice, linTex, makeMasterySet, nz, pick, randInt, termTex } from './helpers';
import type { Problem, Skill } from './types';

/** a x + b y = c with intercepts that are whole numbers. */
function niceLine() {
  const xi = nz(6);
  const yi = nz(6);
  // a x + b y = c with c = lcm-ish: choose c = xi*yi*k so a = c/xi, b = c/yi
  const c = xi * yi * pick([1, -1]);
  let a = c / xi;
  let b = c / yi;
  let C = c;
  const g = gcd3(a, b, C);
  a /= g; b /= g; C /= g;
  return { a, b, c: C, xi, yi };
}
const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : Math.abs(x));
const gcd3 = (a: number, b: number, c: number) => gcd(gcd(a, b), c) || 1;
const eqTex = (a: number, b: number, c: number) => `${linTex(a, 0)} ${b < 0 ? '-' : '+'} ${termTex(Math.abs(b), 'y')} = ${c}`;

function intercepts(): Problem {
  const { a, b, c, xi, yi } = niceLine();
  const askX = Math.random() < 0.5;
  return {
    skill: 'intercepts',
    prompt: `Find the **${askX ? 'x' : 'y'}-intercept** of $\\;${eqTex(a, b, c)}$. (Write it as a point.)`,
    answer: { type: 'point', x: askX ? xi : 0, y: askX ? 0 : yi },
    hints: [askX ? 'At the $x$-intercept, $y = 0$. Set $y = 0$ and solve for $x$.' : 'At the $y$-intercept, $x = 0$. Set $x = 0$ and solve for $y$.', 'Cover up the other term with your finger and solve what is left.'],
    solution: askX ? [`$y = 0$: $\\;${a}x = ${c}$`, `$x = ${xi}$, so the $x$-intercept is $(${xi}, 0)$.`] : [`$x = 0$: $\\;${b}y = ${c}$`, `$y = ${yi}$, so the $y$-intercept is $(0, ${yi})$.`],
    mistakes: askX ? [{ answer: `(0, ${xi})`, feedback: 'The $x$-intercept lies on the $x$-axis, where $y = 0$: write it as $(x, 0)$.' }] : [{ answer: `(${yi}, 0)`, feedback: 'The $y$-intercept lies on the $y$-axis, where $x = 0$: write it as $(0, y)$.' }],
    placeholder: '(x, y)',
  };
}

function graphIntercepts(): Problem {
  const { a, b, c, xi, yi } = niceLine();
  return {
    skill: 'graph',
    prompt: `Graph $\\;${eqTex(a, b, c)}\\;$ using its intercepts.`,
    answer: { type: 'plot', mode: 'line', a, b, c },
    hints: ['Find the $x$-intercept (set $y = 0$) and the $y$-intercept (set $x = 0$). Plot both and connect them.'],
    solution: [`$x$-intercept: $(${xi}, 0)$. $y$-intercept: $(0, ${yi})$.`, 'Plot these two points and draw the line through them.'],
  };
}

function horizontalVertical(): Problem {
  const k = randInt(-7, 7);
  const kind = pick(['graphH', 'graphV', 'name', 'equation'] as const);
  if (kind === 'graphH')
    return {
      skill: 'hv',
      prompt: `Graph $\\;y = ${k}$.`,
      answer: { type: 'plot', mode: 'line', a: 0, b: 1, c: k },
      hints: [`Every point on this line has $y = ${k}$, whatever $x$ is: $(0, ${k})$, $(3, ${k})$, $(-5, ${k})$, …`],
      solution: [`A **horizontal** line through $(0, ${k})$.`],
    };
  if (kind === 'graphV')
    return {
      skill: 'hv',
      prompt: `Graph $\\;x = ${k}$.`,
      answer: { type: 'plot', mode: 'line', a: 1, b: 0, c: k },
      hints: [`Every point on this line has $x = ${k}$, whatever $y$ is.`],
      solution: [`A **vertical** line through $(${k}, 0)$.`],
    };
  if (kind === 'name') {
    const v = pick(['x', 'y']);
    return {
      skill: 'hv',
      prompt: `Is the graph of $\\;${v} = ${k}\\;$ horizontal or vertical?`,
      answer: { type: 'choice', options: ['Horizontal', 'Vertical'], correct: v === 'y' ? 0 : 1 },
      hints: [`List a few points with ${v} = ${k}. Which coordinate stays the same?`],
      solution: [v === 'y' ? `$y$ is always $${k}$ while $x$ changes — the points line up **horizontally**.` : `$x$ is always $${k}$ while $y$ changes — the points line up **vertically**.`],
    };
  }
  const x = randInt(-6, 6);
  const y = randInt(-6, 6);
  const hz = Math.random() < 0.5;
  return {
    skill: 'hv',
    prompt: `Write an equation of the **${hz ? 'horizontal' : 'vertical'}** line through $(${x}, ${y})$.`,
    answer: { type: 'equation', value: hz ? `y = ${y}` : `x = ${x}` },
    hints: [hz ? 'On a horizontal line, every point has the same $y$-coordinate.' : 'On a vertical line, every point has the same $x$-coordinate.'],
    solution: [hz ? `$y = ${y}$` : `$x = ${x}$`],
    mistakes: [{ answer: hz ? `x = ${x}` : `y = ${y}`, feedback: hz ? 'That line is vertical. A horizontal line has a constant $y$.' : 'That line is horizontal. A vertical line has a constant $x$.' }],
    placeholder: hz ? 'y = …' : 'x = …',
  };
}

function whichGraph(): Problem {
  const k = nz(6);
  const opts = [`$x = ${k}$`, `$y = ${k}$`, `$y = ${k}x$`, `$x + y = ${k}$`];
  const kind = randInt(0, 1);
  return {
    skill: 'which',
    prompt: 'Which equation has the graph shown?',
    figure: { kind: 'plane', lines: [kind === 0 ? { a: 1, b: 0, c: k } : { a: 0, b: 1, c: k }], range: 10 },
    answer: choice(opts[kind], opts.filter((_, i) => i !== kind)),
    hints: ['Is the line vertical or horizontal? Which coordinate never changes?'],
    solution: [kind === 0 ? `Vertical line crossing the $x$-axis at $${k}$: $x = ${k}$.` : `Horizontal line crossing the $y$-axis at $${k}$: $y = ${k}$.`],
  };
}

export const skills: Skill[] = [
  { id: 'intercepts', label: 'Find intercepts', generate: intercepts },
  { id: 'graph', label: 'Graph with intercepts', generate: graphIntercepts },
  { id: 'hv', label: 'Horizontal & vertical lines', generate: horizontalVertical },
  { id: 'which', label: 'Match the graph', generate: whichGraph },
];

export const masterySet = makeMasterySet(skills);
