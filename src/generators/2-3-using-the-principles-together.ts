// Practice problem generators for Lesson 2.3 — Using the Principles Together.
import { choice, F, linTex, makeMasterySet, nz, p, pick, randInt, removeTerm, termTex } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 't', 'n']);

function twoStep(): Problem {
  const v = V();
  const x = nz(10);
  const a = nz(9, 2);
  const b = nz(20);
  const c = a * x + b;
  const swap = Math.random() < 0.25;
  const lhs = swap ? `${b} + ${termTex(a, v)}` : linTex(a, b, v);
  return {
    skill: 'twostep',
    prompt: `Solve: $\\;${lhs} = ${c}$`,
    answer: { type: 'number', value: x },
    hints: ['Use the addition principle first to get the variable term alone, then the multiplication principle.', `${b < 0 ? `Add $${-b}$ to` : `Subtract $${b}$ from`} both sides, then divide by $${a}$.`],
    solution: [
      `$${termTex(a, v)} = ${c} - ${p(b)} = ${c - b}$ — ${b < 0 ? `add $${-b}$ to` : `subtract $${b}$ from`} both sides`,
      `$${v} = \\dfrac{${c - b}}{${a}} = ${x}$ — divide both sides by $${a}$`,
      `Check: $${a} \\cdot ${p(x)} + ${p(b)} = ${c}$ ✓`,
    ],
    mistakes: [{ answer: String(+((c + b) / a).toFixed(6)), feedback: `Check the first step: to remove $${p(b)}$, add its **opposite**.` }],
  };
}

function bothSides(): Problem {
  const v = V();
  const x = nz(10);
  let a = nz(9);
  let c = nz(9);
  while (a === c) c = nz(9);
  const b = nz(15);
  const d = a * x + b - c * x;
  return {
    skill: 'both',
    prompt: `Solve: $\\;${linTex(a, b, v)} = ${linTex(c, d, v)}$`,
    answer: { type: 'number', value: x },
    hints: ['Collect the variable terms on one side and the numbers on the other.', `${removeTerm(c, v).replace(/^./, (ch) => ch.toUpperCase())} both sides to get all the $${v}$-terms on the left.`],
    solution: [
      `$${linTex(a - c, b, v)} = ${d}$ — ${removeTerm(c, v)} both sides`,
      `$${termTex(a - c, v)} = ${d - b}$ — ${b < 0 ? `add $${-b}$ to` : `subtract $${b}$ from`} both sides`,
      `$${v} = ${x}$ — divide by $${a - c}$`,
    ],
  };
}

function parentheses(): Problem {
  const v = V();
  const x = nz(9);
  const a = nz(6, 2);
  const b = nz(9);
  const kind = pick(['simple', 'both'] as const);
  if (kind === 'simple') {
    const c = a * (x + b);
    return {
      skill: 'parens',
      prompt: `Solve: $\\;${a}(${linTex(1, b, v)}) = ${c}$`,
      answer: { type: 'number', value: x },
      hints: ['Use the distributive law to remove the parentheses first (or divide both sides by the number in front).'],
      solution: [`$${linTex(a, a * b, v)} = ${c}$ — distribute`, `$${termTex(a, v)} = ${c - a * b}$`, `$${v} = ${x}$`],
      mistakes: [{ answer: String(+((c - b) / a).toFixed(6)), feedback: `Distribute $${a}$ to **both** terms: $${a} \\cdot ${p(b)} = ${a * b}$.` }],
    };
  }
  const c = nz(5);
  const e = a * (x + b) - c * x;
  return {
    skill: 'parens',
    prompt: `Solve: $\\;${a}(${linTex(1, b, v)}) = ${linTex(c, e, v)}$`,
    answer: { type: 'number', value: x },
    hints: ['Distribute first. Then collect variable terms on one side.'],
    solution: [
      `$${linTex(a, a * b, v)} = ${linTex(c, e, v)}$ — distribute`,
      `$${linTex(a - c, a * b, v)} = ${e}$ — ${removeTerm(c, v)} both sides`,
      `$${termTex(a - c, v)} = ${e - a * b}$`,
      `$${v} = ${x}$`,
    ],
  };
}

function clearFractions(): Problem {
  const v = V();
  if (Math.random() < 0.5) {
    // (p/q)x + r/s = t with LCD
    const q = pick([2, 3, 4, 5, 6]);
    const s = pick([2, 3, 4, 6].filter((z) => z !== q));
    const x = nz(6) * q;
    const a = F(nz(4), q);
    const r = F(nz(5), s);
    const t = a.mul(x).add(r);
    const lcd = (q * s) / gcdN(q, s);
    return {
      skill: 'fractions',
      prompt: `Solve: $\\;${termTex(a, v)} + ${p(r.tex())} = ${t.tex()}$`,
      answer: { type: 'number', value: x },
      hints: [`Multiply **every** term on both sides by the least common denominator, $${lcd}$, to clear the fractions.`],
      solution: [
        `Multiply both sides by $${lcd}$: $\\;${termTex(a.mul(lcd), v)} + ${p(r.mul(lcd).tex())} = ${t.mul(lcd).tex()}$`,
        `$${termTex(a.mul(lcd), v)} = ${t.mul(lcd).sub(r.mul(lcd)).tex()}$`,
        `$${v} = ${x}$`,
      ],
    };
  }
  const x = nz(20);
  const a = nz(9) / 10;
  const b = nz(99) / 10;
  const c = +(a * x + b).toFixed(2);
  const decTex = `${a}${v} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
  return {
    skill: 'fractions',
    prompt: `Solve: $\\;${decTex} = ${c}$`,
    answer: { type: 'number', value: x },
    hints: ['Multiply both sides by $10$ (or $100$) to clear the decimals. Then solve as usual.'],
    solution: [
      `Multiply every term by $10$: $\\;${linTex(Math.round(a * 10), Math.round(b * 10), v)} = ${Math.round(c * 10)}$`,
      `$${v} = ${x}$`,
    ],
  };
}

const gcdN = (a: number, b: number): number => (b ? gcdN(b, a % b) : Math.abs(a));

function special(): Problem {
  const v = V();
  const kind = pick(['none', 'all', 'one'] as const);
  const a = randInt(2, 6);
  const b = nz(9);
  const c = nz(9);
  let left: string;
  let right: string;
  let why: string;
  if (kind === 'none') {
    let d = nz(15);
    while (d === a * b) d = nz(15);
    left = `${a}(${linTex(1, b, v)})`;
    right = linTex(a, d, v);
    why = `Distribute: $${linTex(a, a * b, v)} = ${linTex(a, d, v)}$. Subtract $${termTex(a, v)}$: $${a * b} = ${d}$, which is **false**. No value of $${v}$ works: **no solution**.`;
  } else if (kind === 'all') {
    left = `${a}(${linTex(1, b, v)}) + ${p(c)}`;
    right = linTex(a, a * b + c, v);
    why = `Simplify the left side: $${linTex(a, a * b + c, v)}$ — exactly the right side. Subtracting $${termTex(a, v)}$ gives $${a * b + c} = ${a * b + c}$, which is always **true**: **every real number** is a solution.`;
  } else {
    const x = nz(8);
    const e = a * x + a * b - (a + 1) * x;
    left = `${a}(${linTex(1, b, v)})`;
    right = linTex(a + 1, e, v);
    why = `Distribute and collect: $${linTex(a, a * b, v)} = ${linTex(a + 1, e, v)}$ gives $${v} = ${x}$. **Exactly one solution**.`;
  }
  const answers = { one: 'Exactly one solution', none: 'No solution', all: 'Every real number is a solution' };
  return {
    skill: 'special',
    prompt: `How many solutions does $\\;${left} = ${right}\\;$ have?`,
    answer: choice(answers[kind], Object.values(answers).filter((x) => x !== answers[kind])),
    hints: ['Simplify both sides and try to solve. If the variable disappears, look at the statement that is left: always true, or always false?'],
    solution: [why],
  };
}

export const skills: Skill[] = [
  { id: 'twostep', label: 'Two-step equations', generate: twoStep },
  { id: 'both', label: 'Variable on both sides', generate: bothSides },
  { id: 'parens', label: 'Parentheses', generate: parentheses },
  { id: 'fractions', label: 'Clear fractions & decimals', generate: clearFractions },
  { id: 'special', label: 'No solution / all reals', generate: special },
];

export const masterySet = makeMasterySet(skills);
