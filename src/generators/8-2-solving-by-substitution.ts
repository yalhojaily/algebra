// Practice problem generators for Lesson 8.2 — Solving by Substitution.
import { choice, linTex, makeMasterySet, nz, pick, randInt, termTex } from './helpers';
import { combTex, pickVars, pn, systemTex } from './systems';
import type { Problem, Skill } from './types';

/** One equation already solved for a variable: y = m x + k, plus a x + b y = c. */
function solvedFor(): Problem {
  const [u, w] = pickVars();
  const x = randInt(-6, 6), y = randInt(-6, 6);
  const m = nz(4), k = y - m * x;
  let a = nz(5), b = nz(5);
  while (a + b * m === 0) { a = nz(5); b = nz(5); }
  const c = a * x + b * y;
  const coef = a + b * m, rhs = c - b * k;
  return {
    skill: 'solved',
    prompt: `Solve by substitution: $\\;${systemTex([`${w} = ${linTex(m, k, u)}`, combTex([a, b], [u, w], c)])}$`,
    answer: { type: 'point', x, y },
    hints: [`The first equation says $${w}$ equals $${linTex(m, k, u)}$. Replace $${w}$ in the second equation with $(${linTex(m, k, u)})$.`, `Solve for $${u}$, then put it back into $${w} = ${linTex(m, k, u)}$.`],
    solution: [
      `$${termTex(a, u)} ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}(${linTex(m, k, u)}) = ${c}$`,
      `$${termTex(coef, u)} = ${rhs}$ after distributing and combining, so $${u} = ${x}$`,
      `$${w} = ${m}(${pn(x)}) ${k < 0 ? '-' : '+'} ${Math.abs(k)} = ${y}$`,
      `Solution: $(${x}, ${y})$ — check it in both equations.`,
    ],
    mistakes: [{ answer: `(${y}, ${x})`, feedback: `Write the ordered pair as $(${u}, ${w})$: the ${u}-value first.` }],
    placeholder: '(2, -3)',
  };
}

/** Neither solved: one equation has a coefficient of 1 to isolate. */
function isolate(): Problem {
  const [u, w] = pickVars();
  for (;;) {
    const x = randInt(-6, 6), y = randInt(-6, 6);
    const a = pick([1, -1]), b = nz(5), d = nz(5), e = nz(5);
    if (a * e - b * d === 0) continue;
    const c = a * x + b * y, f = d * x + e * y;
    // a = ±1: u = (c − b w)/a
    const iso = a === 1 ? `${u} = ${linTex(-b, c, w)}` : `${u} = ${linTex(b, -c, w)}`;
    return {
      skill: 'isolate',
      prompt: `Solve by substitution: $\\;${systemTex([combTex([a, b], [u, w], c), combTex([d, e], [u, w], f)])}$`,
      answer: { type: 'point', x, y },
      hints: [`Solve the first equation for $${u}$ (its coefficient is $${a}$): $${iso}$.`, `Substitute that expression for $${u}$ in the second equation.`],
      solution: [`$${iso}$`, `Substitute into the second equation and solve: $${w} = ${y}$`, `Then $${u} = ${x}$.`, `Solution: $(${x}, ${y})$`],
      placeholder: '(2, -3)',
    };
  }
}

function special(): Problem {
  const [u, w] = pickVars();
  const m = nz(4), k = randInt(-6, 6);
  const many = Math.random() < 0.5;
  const t = pick([2, 3]);
  // w = m u + k  and  −t m u + t w = t k (+ shift)
  const shift = many ? 0 : pick([1, 2, -1]) * t;
  const second = combTex([-t * m, t], [u, w], t * k + shift);
  const label = many ? 'Infinitely many solutions' : 'No solution';
  return {
    skill: 'special',
    prompt: `Solve by substitution: $\\;${systemTex([`${w} = ${linTex(m, k, u)}`, second])}$`,
    answer: choice(label, ['No solution', 'Infinitely many solutions', `Exactly one solution`].filter((x) => x !== label)),
    hints: ['Substitute and simplify. If the variable disappears, look at what is left: a true statement like $6 = 6$, or a false one like $6 = 9$?'],
    solution: [`Substituting, the $${u}$-terms cancel and you get $${t * k} = ${t * k + shift}$.`, many ? 'That is always true: the equations describe the same line — **infinitely many** solutions.' : 'That is false: the lines are parallel — **no solution**.'],
  };
}

export const skills: Skill[] = [
  { id: 'solved', label: 'One equation already solved', generate: solvedFor },
  { id: 'isolate', label: 'Isolate a variable first', generate: isolate },
  { id: 'special', label: 'No solution or infinitely many', generate: special },
];

export const masterySet = makeMasterySet(skills);
