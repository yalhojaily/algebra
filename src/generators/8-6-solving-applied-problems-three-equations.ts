// Practice problem generators for Lesson 8.6 — Solving Applied Problems: Three Equations.
import { makeMasterySet, pick, randInt } from './helpers';
import { systemTex } from './systems';
import type { Problem, Skill } from './types';

function triangle(): Problem {
  for (;;) {
    const d1 = randInt(5, 40), d2 = randInt(-20, 30);
    // angles A, B, C: B = A + d1, C = A + d2... built from a valid A
    const A = randInt(20, 60), B = A + d1, C = 180 - A - B;
    if (C <= 5 || C === A || C === B) continue;
    const k = pick([2, 3]);
    if (C - k * A === 0) continue;
    return {
      skill: 'triangle',
      prompt: `In triangle $ABC$, angle $B$ is ${d1}° more than angle $A$, and angle $C$ is ${C - k * A >= 0 ? `${C - k * A}° more than` : `${k * A - C}° less than`} ${k} times angle $A$. Find angle $C$ (degrees).`,
      answer: { type: 'number', value: C },
      hints: ['The three angles of a triangle add up to $180°$.', `$\\;${systemTex(['A + B + C = 180', `B = A + ${d1}`, `C = ${k}A ${C - k * A >= 0 ? '+' : '-'} ${Math.abs(C - k * A)}`])}$`],
      solution: [`Substitute into $A + B + C = 180$: $A + (A + ${d1}) + (${k}A ${C - k * A >= 0 ? '+' : '-'} ${Math.abs(C - k * A)}) = 180$`, `$${k + 2}A = ${180 - d1 - (C - k * A)}$, so $A = ${A}$°`, `$B = ${B}$°, $C = ${C}$°`],
    };
  }
}

function threeNumbers(): Problem {
  const x = randInt(-10, 20), y = randInt(-10, 20), z = randInt(-10, 20);
  const sum = x + y + z, d = x - y, k = z - x;
  const ask = pick([['first', x], ['second', y], ['third', z]] as [string, number][]);
  const sgn = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);
  return {
    skill: 'numbers',
    prompt: `The sum of three numbers is ${sum}. The first number minus the second is ${d}. The third number is ${k >= 0 ? `${k} more` : `${-k} less`} than the first. What is the **${ask[0]}** number?`,
    answer: { type: 'number', value: ask[1] },
    hints: [`Let the numbers be $x$, $y$, $z$: $\\;${systemTex([`x + y + z = ${sum}`, `x - y = ${d}`, `z = x ${sgn(k)}`])}$`, `Write $y$ and $z$ in terms of $x$ and substitute into the first equation.`],
    solution: [`$y = x ${sgn(-d)}$ and $z = x ${sgn(k)}$`, `$x + (x ${sgn(-d)}) + (x ${sgn(k)}) = ${sum}$, so $3x = ${3 * x}$ and $x = ${x}$`, `$y = ${y}$, $z = ${z}$`],
  };
}

function investment(): Problem {
  const r = [3, 4, 5];
  const amts = [randInt(2, 10) * 1000, randInt(2, 10) * 1000, randInt(2, 10) * 1000];
  const total = amts[0] + amts[1] + amts[2];
  const interest = amts.reduce((s, a, i) => s + (a * r[i]) / 100, 0);
  const diff = amts[2] - amts[0];
  const ask = pick([0, 1, 2]);
  return {
    skill: 'invest',
    prompt: `$${total}$ dollars is invested in three accounts paying 3%, 4% and 5% simple interest. The total interest after one year is $${interest}$ dollars. The amount at 5% is ${diff >= 0 ? `${diff} dollars more` : `${-diff} dollars less`} than the amount at 3%. How much is invested at **${r[ask]}%** (dollars)?`,
    answer: { type: 'number', value: amts[ask] },
    hints: [`Let $x$, $y$, $z$ be the amounts at 3%, 4%, 5%: $\\;${systemTex([`x + y + z = ${total}`, `0.03x + 0.04y + 0.05z = ${interest}`, `z = x ${diff >= 0 ? '+' : '-'} ${Math.abs(diff)}`])}$`, 'Substitute the third equation into the other two to get a system in $x$ and $y$.'],
    solution: [`$x = ${amts[0]}$, $y = ${amts[1]}$, $z = ${amts[2]}$`, `Check: total $${total}$, interest $${amts[0] * 0.03} + ${amts[1] * 0.04} + ${amts[2] * 0.05} = ${interest}$ ✓`],
  };
}

export const skills: Skill[] = [
  { id: 'triangle', label: 'Triangle angles', generate: triangle },
  { id: 'numbers', label: 'Three numbers', generate: threeNumbers },
  { id: 'invest', label: 'Investments', generate: investment },
];

export const masterySet = makeMasterySet(skills);
