// Practice problem generators for Lesson 2.1 — Solving Equations: The Addition Principle.
import { choice, coprimeTo, F, makeMasterySet, nz, p, pick } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 't', 'a', 'n']);

/** x + a = b style, in a few layouts. */
function solveIntegers(): Problem {
  const v = V();
  const sol = nz(25);
  const a = nz(20);
  const b = sol + a;
  const layout = pick(['x+a=b', 'a+x=b', 'b=x+a', 'x-a=b'] as const);
  let tex: string;
  let steps: string[];
  if (layout === 'x-a=b') {
    // x - c = b  with c > 0 written as subtraction
    const c = Math.abs(a);
    const rhs = sol - c;
    tex = `${v} - ${c} = ${rhs}`;
    steps = [`$${v} - ${c} + ${c} = ${rhs} + ${c}$ — add $${c}$ to both sides`, `$${v} = ${sol}$`, `Check: $${sol} - ${c} = ${rhs}$ ✓`];
    return {
      skill: 'integers',
      prompt: `Solve: $\\;${tex}$`,
      answer: { type: 'number', value: sol },
      hints: [`To undo subtracting $${c}$, **add** $${c}$ to both sides.`],
      solution: steps,
      mistakes: [{ answer: String(rhs - c), feedback: `You subtracted $${c}$. To undo "minus $${c}$", **add** $${c}$ to both sides.` }],
      placeholder: `the value of ${v}`,
    };
  }
  const lhs = layout === 'a+x=b' ? `${a} + ${v}` : `${v} + ${p(a)}`;
  tex = layout === 'b=x+a' ? `${b} = ${v} + ${p(a)}` : `${lhs} = ${b}`;
  const move = a < 0 ? `add $${-a}$ to both sides` : `subtract $${a}$ from both sides`;
  steps = [
    layout === 'b=x+a' ? `$${b} + ${p(-a)} = ${v} + ${p(a)} + ${p(-a)}$ — ${move}` : `$${lhs} + ${p(-a)} = ${b} + ${p(-a)}$ — ${move} (add the opposite of $${a}$)`,
    layout === 'b=x+a' ? `$${sol} = ${v}$, so $${v} = ${sol}$` : `$${v} = ${sol}$`,
    `Check: $${sol} + ${p(a)} = ${b}$ ✓`,
  ];
  return {
    skill: 'integers',
    prompt: `Solve: $\\;${tex}$`,
    answer: { type: 'number', value: sol },
    hints: [`Get $${v}$ alone. The number added to $${v}$ is $${a}$, so add its opposite, $${-a}$, to **both** sides.`],
    solution: steps,
    mistakes: [{ answer: String(b + a), feedback: `You added $${a}$. To undo adding $${a}$, add its **opposite**, $${-a}$.` }],
    placeholder: `the value of ${v}`,
  };
}

function solveRational(): Problem {
  const v = V();
  if (Math.random() < 0.5) {
    const sol = nz(99) / 10;
    const a = nz(99) / 10;
    const b = +(sol + a).toFixed(1);
    return {
      skill: 'rational',
      prompt: `Solve: $\\;${v} + ${p(a)} = ${b}$`,
      answer: { type: 'number', value: sol },
      hints: [`Add $${p(+(-a).toFixed(1))}$ to both sides.`],
      solution: [`$${v} = ${b} + ${p(+(-a).toFixed(1))}$`, `$${v} = ${sol}$`],
    };
  }
  const d = pick([2, 3, 4, 5, 6, 8]);
  const d2 = pick([d, 2 * d].filter((x) => x <= 12));
  const a = F(coprimeTo(d, 2 * d), d);
  const sol = F(coprimeTo(d2, 2 * d2), d2);
  const b = sol.add(a);
  return {
    skill: 'rational',
    prompt: `Solve: $\\;${v} + ${p(a.tex())} = ${b.tex()}$. (A fraction is fine.)`,
    answer: { type: 'number', value: sol.valueOf() },
    hints: [`Subtract $${a.tex()}$ from both sides (add $${a.neg().tex()}$).`, 'Use a common denominator to combine the fractions.'],
    solution: [`$${v} = ${b.tex()} - ${p(a.tex())}$`, `$${v} = ${sol.tex()}$`],
    placeholder: 'e.g. -5/6',
  };
}

function simplifyFirst(): Problem {
  const v = V();
  const sol = nz(20);
  const a = nz(12);
  const c = nz(12);
  const b = sol + a + c;
  const onRight = Math.random() < 0.4;
  const left = `${a} + ${v} + ${p(c)}`;
  const tex = onRight ? `${b} = ${left}` : `${left} = ${b}`;
  return {
    skill: 'simplify',
    prompt: `Solve: $\\;${tex}$`,
    answer: { type: 'number', value: sol },
    hints: ['First collect the numbers that are on the same side as the variable.', `Then undo the addition.`],
    solution: [
      `$${onRight ? `${b} = ${v} + ${p(a + c)}` : `${v} + ${p(a + c)} = ${b}`}$ — combine $${a} + ${p(c)} = ${a + c}$`,
      `$${v} = ${b} - ${p(a + c)} = ${sol}$`,
    ],
  };
}

function whichStep(): Problem {
  const v = V();
  const a = nz(15);
  const b = nz(20);
  const eqTex = a < 0 ? `${v} - ${-a} = ${b}` : `${v} + ${a} = ${b}`;
  const right = a < 0 ? `Add $${-a}$ to both sides` : `Subtract $${a}$ from both sides`;
  const wrong = a < 0
    ? [`Subtract $${-a}$ from both sides`, `Add $${p(b)}$ to both sides`, `Add $${-a}$ to the left side only`]
    : [`Add $${a}$ to both sides`, `Subtract $${p(b)}$ from both sides`, `Subtract $${a}$ from the left side only`];
  return {
    skill: 'step',
    prompt: `What is the best first step to solve $\\;${eqTex}$?`,
    answer: choice(right, wrong),
    hints: [`Which number is keeping $${v}$ from being alone? Undo it — and do the same to **both** sides.`],
    solution: [`${right}. That leaves $${v}$ alone: $${v} = ${b - a}$.`],
  };
}

export const skills: Skill[] = [
  { id: 'integers', label: 'Solve', generate: solveIntegers },
  { id: 'rational', label: 'Fractions & decimals', generate: solveRational },
  { id: 'simplify', label: 'Simplify first', generate: simplifyFirst },
  { id: 'step', label: 'Choose the step', generate: whichStep },
];

export const masterySet = makeMasterySet(skills);

