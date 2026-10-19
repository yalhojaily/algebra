// Practice problem generators for Lesson 2.7 — Solving Inequalities.
import { holds, REL_TEX, type Rel } from '../lib/inequality';
import { choice, F, linTex, makeMasterySet, nz, p, pick, randInt, removeTerm, termTex } from './helpers';
import type { Problem, Skill } from './types';

const RELS: Rel[] = ['<', '>', '<=', '>='];
const FLIP: Record<Rel, Rel> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
const V = () => pick(['x', 'y', 't', 'n']);
const txt = (v: string, op: Rel, b: string | number) => `${v} ${op} ${b}`;

function isSolution(): Problem {
  const v = V();
  const op = pick(RELS);
  const b = nz(10);
  const c = pick([b, b - randInt(1, 4), b + randInt(1, 4), b, -b]);
  const yes = holds(op, c, b);
  return {
    skill: 'check',
    prompt: `Is $${c}$ a solution of $\\;${v} ${REL_TEX[op]} ${b}$?`,
    answer: { type: 'choice', options: ['Yes', 'No'], correct: yes ? 0 : 1 },
    hints: [`Substitute $${c}$ for $${v}$. Is $${c} ${REL_TEX[op]} ${b}$ a true statement?`, ...(c === b ? [`$${REL_TEX[op]}$ ${op.length === 2 ? 'includes "or equal to"' : 'does **not** include equality'}.`] : [])],
    solution: [`$${c} ${REL_TEX[op]} ${b}$ is **${yes ? 'true' : 'false'}**, so $${c}$ ${yes ? 'is' : 'is not'} a solution.`],
  };
}

function graph(): Problem {
  const v = 'x';
  const b = nz(6);
  const op = pick(RELS);
  const right = op === '>' || op === '>=';
  const closed = op.length === 2;
  const correct = `$${v} ${REL_TEX[op]} ${b}$`;
  return {
    skill: 'graph',
    prompt: `Which inequality is graphed below?`,
    figure: { kind: 'ray', boundary: b, closed, dir: right ? 'right' : 'left' },
    answer: choice(correct, RELS.filter((r) => r !== op).map((r) => `$${v} ${REL_TEX[r]} ${b}$`)),
    hints: ['A **closed** (filled) dot means the boundary is included: $\\le$ or $\\ge$. An **open** dot means it is not: $<$ or $>$.', 'Shading to the **right** means greater; to the **left** means less.'],
    solution: [`${closed ? 'Closed' : 'Open'} dot at $${b}$, shaded to the ${right ? 'right' : 'left'}: ${correct}.`],
  };
}

function additionPrinciple(): Problem {
  const v = V();
  const op = pick(RELS);
  const sol = nz(15);
  const a = nz(15);
  const rhs = sol + a;
  const layout = Math.random() < 0.3 ? 'rev' : 'std';
  const tex = layout === 'std' ? `${v} + ${p(a)} ${REL_TEX[op]} ${rhs}` : `${rhs} ${REL_TEX[op]} ${v} + ${p(a)}`;
  const finalOp = layout === 'std' ? op : FLIP[op];
  return {
    skill: 'addition',
    prompt: `Solve: $\\;${tex}$`,
    answer: { type: 'inequality', value: txt(v, finalOp, sol) },
    hints: [`Use the addition principle: ${a < 0 ? `add $${-a}$ to` : `subtract $${a}$ from`} both sides. The inequality sign stays the same.`, layout === 'rev' ? `You'll get $${sol} ${REL_TEX[op]} ${v}$. Read it from the variable's side: $${v} ${REL_TEX[FLIP[op]]} ${sol}$.` : ''].filter(Boolean),
    solution: [
      layout === 'std' ? `$${v} ${REL_TEX[op]} ${rhs} - ${p(a)}$` : `$${rhs} - ${p(a)} ${REL_TEX[op]} ${v}$`,
      layout === 'std' ? `$${v} ${REL_TEX[op]} ${sol}$` : `$${sol} ${REL_TEX[op]} ${v}$, which means $${v} ${REL_TEX[finalOp]} ${sol}$`,
    ],
    placeholder: `e.g. ${v} >= -3`,
  };
}

function multiplicationPrinciple(): Problem {
  const v = V();
  const op = pick(RELS);
  const a = nz(9, 2);
  // Usually a whole-number boundary; sometimes a fraction.
  const solF = Math.random() < 0.7 ? F(nz(10)) : F(nz(9), Math.abs(a));
  const rhs = solF.mul(a);
  const neg = a < 0;
  const finalOp = neg ? FLIP[op] : op;
  return {
    skill: 'multiplication',
    prompt: `Solve: $\\;${termTex(a, v)} ${REL_TEX[op]} ${rhs.tex()}$`,
    answer: { type: 'inequality', value: txt(v, finalOp, solF.text()) },
    hints: [`Divide both sides by $${a}$.`, neg ? '**Dividing by a negative number reverses the inequality sign!**' : 'Dividing by a positive number keeps the sign the same.'],
    solution: [
      `$\\dfrac{${termTex(a, v)}}{${a}} ${REL_TEX[finalOp]} \\dfrac{${rhs.tex()}}{${a}}$ — divide by $${a}$${neg ? ' and **reverse** the sign' : ''}`,
      `$${v} ${REL_TEX[finalOp]} ${solF.tex()}$`,
    ],
    mistakes: neg ? [{ answer: txt(v, op, solF.text()), feedback: 'You divided by a **negative** number, so the inequality sign must be reversed.' }] : [],
    placeholder: `e.g. ${v} < 4`,
  };
}

function together(): Problem {
  const v = V();
  const op = pick(RELS);
  const x = nz(8);
  let a = nz(7);
  let c = nz(7);
  while (a === c) c = nz(7);
  const b = nz(12);
  const d = a * x + b - c * x;
  const k = a - c;
  const finalOp = k < 0 ? FLIP[op] : op;
  return {
    skill: 'together',
    prompt: `Solve: $\\;${linTex(a, b, v)} ${REL_TEX[op]} ${linTex(c, d, v)}$`,
    answer: { type: 'inequality', value: txt(v, finalOp, x) },
    hints: ['Collect the variable terms on one side and the numbers on the other, just like an equation.', 'If you divide by a negative number at the end, reverse the sign.'],
    solution: [
      `$${termTex(k, v)} ${REL_TEX[op]} ${d - b}$ — ${removeTerm(c, v).replace(/ (to|from)$/, '')} and ${b < 0 ? `add $${-b}$` : `subtract $${b}$`} on both sides`,
      `$${v} ${REL_TEX[finalOp]} ${x}$ — divide by $${k}$${k < 0 ? ' and reverse the sign' : ''}`,
    ],
    mistakes: k < 0 ? [{ answer: txt(v, op, x), feedback: `You divided by $${k}$, a negative number — so reverse the inequality sign.` }] : [],
    placeholder: `e.g. ${v} <= 2`,
  };
}

export const skills: Skill[] = [
  { id: 'check', label: 'Check a solution', generate: isSolution },
  { id: 'graph', label: 'Read a graph', generate: graph },
  { id: 'addition', label: 'Addition principle', generate: additionPrinciple },
  { id: 'multiplication', label: 'Multiplication principle', generate: multiplicationPrinciple },
  { id: 'together', label: 'Both principles', generate: together },
];

export const masterySet = makeMasterySet(skills);
