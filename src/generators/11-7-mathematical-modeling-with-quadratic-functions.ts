// Practice problem generators for Lesson 11.7 — Mathematical Modeling with Quadratic Functions.
import { fmt, makeMasterySet, pick, randInt } from './helpers';
import { systemTex } from './systems';
import type { Problem, Skill } from './types';

function fence(): Problem {
  const P = 4 * randInt(10, 60);
  const three = Math.random() < 0.4; // fence on three sides (one side is a wall)
  if (three) {
    // 2w + l = P → A = w(P − 2w), max at w = P/4, A = P²/8
    const A = (P * P) / 8;
    return {
      skill: 'fence',
      prompt: `A farmer has ${P} m of fence to enclose a rectangular pen against a long wall (so only three sides need fence). What is the largest possible area (m²)?`,
      answer: { type: 'number', value: A },
      hints: [`Let $w$ be the width (the two sides touching the wall). Then the length is $${P} - 2w$ and $A(w) = w(${P} - 2w)$.`, 'The maximum of $A(w) = -2w^2 + ' + P + 'w$ is at $w = -\\frac{b}{2a}$.'],
      solution: [`$A(w) = -2w^2 + ${P}w$`, `$w = -\\dfrac{${P}}{2(-2)} = ${P / 4}$, length $= ${P / 2}$`, `$A = ${P / 4} \\cdot ${P / 2} = ${fmt(A)}$ m²`],
    };
  }
  const A = (P / 4) ** 2;
  return {
    skill: 'fence',
    prompt: `What is the largest area (m²) of a rectangle with a perimeter of ${P} m?`,
    answer: { type: 'number', value: A },
    hints: [`If the width is $w$, the length is $${P / 2} - w$. So $A(w) = w(${P / 2} - w)$.`, 'Find the vertex of this downward parabola.'],
    solution: [`$A(w) = -w^2 + ${P / 2}w$, maximum at $w = ${P / 4}$`, `The best rectangle is a ${P / 4} × ${P / 4} square: $A = ${A}$ m²`],
  };
}

function projectile(): Problem {
  const v = pick([32, 48, 64, 80, 96, 112, 128]), h0 = pick([0, 6, 16, 48, 100]);
  const t = v / 32, H = -16 * t * t + v * t + h0;
  const ask = pick(['height', 'time'] as const);
  return {
    skill: 'projectile',
    prompt: `A ball is thrown upward; its height after $t$ seconds is $h(t) = -16t^2 + ${v}t${h0 ? ` + ${h0}` : ''}$ (ft). ${ask === 'height' ? 'What is its maximum height (ft)?' : 'After how many seconds does it reach its highest point?'}`,
    answer: { type: 'number', value: ask === 'height' ? H : t },
    hints: ['The highest point is the vertex: $t = -\\dfrac{b}{2a}$.', ask === 'height' ? 'Then evaluate $h$ at that time.' : ''].filter(Boolean),
    solution: [`$t = -\\dfrac{${v}}{2(-16)} = ${fmt(t)}$ s`, `$h(${fmt(t)}) = ${fmt(H)}$ ft`],
  };
}

function revenue(): Problem {
  const p0 = pick([10, 20, 30, 40]), n0 = pick([200, 300, 400, 600]), dn = pick([2, 4, 5]);
  // price p0 + x, sales n0 − dn x → R = (p0 + x)(n0 − dn x); max at x = (n0 − dn p0)/(2 dn)
  const x = (n0 - dn * p0) / (2 * dn);
  if (!Number.isInteger(x * 2) || x <= 0) return revenue();
  const price = p0 + x;
  return {
    skill: 'revenue',
    prompt: `A store sells ${n0} items a week at ${p0} dollars each. For every 1 dollar increase in price, it sells ${dn} fewer. What price gives the greatest revenue (dollars)?`,
    answer: { type: 'number', value: price },
    hints: [`If the price goes up $x$ dollars: $R(x) = (${p0} + x)(${n0} - ${dn}x)$.`, 'Expand and find the vertex.'],
    solution: [`$R(x) = (${p0} + x)(${n0} - ${dn}x) = -${dn}x^2 + ${n0 - dn * p0}x + ${p0 * n0}$`, `Vertex: $x = -\\dfrac{${n0 - dn * p0}}{2(-${dn})} = ${fmt(x)}$, so the best price is $${p0} + ${fmt(x)} = ${fmt(price)}$ dollars`],
  };
}

function fit(): Problem {
  const a = pick([1, -1, 2, -2]), b = randInt(-4, 4), c = randInt(-5, 5);
  const xs = [-1, 0, 2];
  const pts = xs.map((x) => [x, a * x * x + b * x + c]);
  return {
    skill: 'fit',
    prompt: `Find $a$, $b$, $c$ so that $f(x) = ax^2 + bx + c$ passes through $(${pts[0].join(', ')})$, $(${pts[1].join(', ')})$ and $(${pts[2].join(', ')})$. Answer as $(a, b, c)$.`,
    answer: { type: 'tuple', values: [a, b, c] },
    hints: ['Substitute each point to get three equations in $a$, $b$, $c$.', `The point with $x = 0$ gives $c$ right away: $c = ${c}$.`],
    solution: [`$${systemTex([`a - b + c = ${pts[0][1]}`, `c = ${c}`, `4a + 2b + c = ${pts[2][1]}`])}$`, `$(a, b, c) = (${a}, ${b}, ${c})$`],
    placeholder: '(1, -2, 3)',
  };
}

export const skills: Skill[] = [
  { id: 'fence', label: 'Maximum area', generate: fence },
  { id: 'projectile', label: 'Projectiles', generate: projectile },
  { id: 'revenue', label: 'Maximum revenue', generate: revenue },
  { id: 'fit', label: 'Fit a quadratic', generate: fit },
];

export const masterySet = makeMasterySet(skills);
