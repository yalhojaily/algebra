// Practice problem generators for Lesson 2.2 — Solving Equations: The Multiplication Principle.
import { choice, coprimeTo, F, makeMasterySet, nz, p, pick, randInt, termTex } from './helpers';
import type { Problem, Skill } from './types';

const V = () => pick(['x', 'y', 't', 'a', 'n']);

function solveIntegers(): Problem {
  const v = V();
  const sol = nz(15);
  const a = Math.random() < 0.15 ? -1 : nz(12, 2);
  const b = a * sol;
  if (a === -1) {
    return {
      skill: 'integers',
      prompt: `Solve: $\\;-${v} = ${b}$`,
      answer: { type: 'number', value: sol },
      hints: [`$-${v}$ means $-1 \\cdot ${v}$. Multiply (or divide) both sides by $-1$.`],
      solution: [`$-1 \\cdot (-${v}) = -1 \\cdot ${p(b)}$`, `$${v} = ${sol}$`],
      mistakes: [{ answer: String(b), feedback: `That's the value of $-${v}$. You want $${v}$ itself, which is the opposite.` }],
    };
  }
  return {
    skill: 'integers',
    prompt: `Solve: $\\;${a}${v} = ${b}$`,
    answer: { type: 'number', value: sol },
    hints: [`$${a}${v}$ means $${a}$ times $${v}$. Undo the multiplication: divide both sides by $${a}$.`],
    solution: [`$\\dfrac{${a}${v}}{${a}} = \\dfrac{${b}}{${a}}$ — divide both sides by $${a}$`, `$${v} = ${sol}$`, `Check: $${a} \\cdot ${p(sol)} = ${b}$ ✓`],
    mistakes: [
      { answer: String(b - a), feedback: `$${a}${v}$ is a product, not a sum. Undo multiplication by **dividing**, not subtracting.` },
      { answer: String(-sol), feedback: 'Check the sign: divide using the sign rules.' },
    ],
  };
}

function divisionForm(): Problem {
  const v = V();
  const a = nz(9, 2);
  const b = nz(12);
  const sol = a * b;
  const tex = a < 0 ? `\\dfrac{${v}}{${a}} = ${b}` : pick([`\\dfrac{${v}}{${a}} = ${b}`, `\\dfrac{1}{${a}}${v} = ${b}`]);
  return {
    skill: 'division',
    prompt: `Solve: $\\;${tex}$`,
    answer: { type: 'number', value: sol },
    hints: [`$${v}$ is being divided by $${a}$. Undo it: multiply both sides by $${a}$.`],
    solution: [`$${a} \\cdot \\dfrac{${v}}{${a}} = ${a} \\cdot ${p(b)}$`, `$${v} = ${sol}$`],
    mistakes: [{ answer: String(+(b / a).toFixed(6)), feedback: `You divided by $${a}$. Since $${v}$ is **divided** by $${a}$, multiply instead.` }],
  };
}

function fractionCoefficient(): Problem {
  const v = V();
  const d = randInt(2, 9);
  const n = coprimeTo(d, 9);
  const a = F(n, d);
  // Half the time the answer is a whole number; otherwise the right side is a fraction too.
  const b = Math.random() < 0.5 ? F(n * nz(6)) : F(coprimeTo(2 * d, 9), pick([2, 3, 4, 5]));
  const sol = b.div(a);
  return {
    skill: 'fraction',
    prompt: `Solve: $\\;${termTex(a, v)} = ${b.tex()}$. (A fraction is fine.)`,
    answer: { type: 'number', value: sol.valueOf() },
    hints: [`Multiply both sides by the **reciprocal** of $${a.tex()}$, which is $${F(d, n).tex()}$.`],
    solution: [
      `$${F(d, n).tex()} \\cdot ${p(termTex(a, v))} = ${F(d, n).tex()} \\cdot ${p(b.tex())}$ — multiply by the reciprocal`,
      `$${v} = ${sol.tex()}$`,
    ],
    mistakes: [{ answer: b.mul(a).text(), feedback: `Multiply by the **reciprocal** $${F(d, n).tex()}$, not by $${a.tex()}$ itself.` }],
    placeholder: 'e.g. 15/2',
  };
}

function decimalCoefficient(): Problem {
  const v = V();
  const a = nz(9) / 10 * pick([1, 10]);
  const A = +a.toFixed(1);
  const sol = nz(20);
  const b = +(A * sol).toFixed(2);
  return {
    skill: 'decimal',
    prompt: `Solve: $\\;${A}${v} = ${b}$`,
    answer: { type: 'number', value: sol },
    hints: [`Divide both sides by $${A}$.`],
    solution: [`$${v} = \\dfrac{${b}}{${A}} = ${sol}$`],
  };
}

function whichStep(): Problem {
  const v = V();
  const kind = pick(['mul', 'div', 'neg'] as const);
  if (kind === 'mul') {
    const a = nz(9, 2);
    const b = nz(30);
    return {
      skill: 'step',
      prompt: `What is the best step to solve $\\;${a}${v} = ${b}$?`,
      answer: choice(`Divide both sides by $${a}$`, [`Subtract $${a}$ from both sides`, `Multiply both sides by $${a}$`, `Divide both sides by $${p(b)}$`]),
      hints: [`$${v}$ is being **multiplied** by $${a}$. What undoes multiplication?`],
      solution: [`Divide both sides by $${a}$ (equivalently, multiply by $\\frac{1}{${a}}$).`],
    };
  }
  if (kind === 'div') {
    const a = randInt(2, 9);
    const b = nz(12);
    return {
      skill: 'step',
      prompt: `What is the best step to solve $\\;\\dfrac{${v}}{${a}} = ${b}$?`,
      answer: choice(`Multiply both sides by $${a}$`, [`Divide both sides by $${a}$`, `Add $${a}$ to both sides`, `Multiply the left side by $${a}$`]),
      hints: [`$${v}$ is being **divided** by $${a}$. What undoes division?`],
      solution: [`Multiply both sides by $${a}$.`],
    };
  }
  const b = nz(20);
  return {
    skill: 'step',
    prompt: `What is the best step to solve $\\;-${v} = ${b}$?`,
    answer: choice('Multiply both sides by $-1$', ['Add $1$ to both sides', 'Nothing — it is already solved', `Divide both sides by $${p(b)}$`]),
    hints: [`$-${v}$ is $-1 \\cdot ${v}$, so the equation is not solved yet.`],
    solution: [`Multiply (or divide) both sides by $-1$: $${v} = ${-b}$.`],
  };
}

export const skills: Skill[] = [
  { id: 'integers', label: 'Solve ax = b', generate: solveIntegers },
  { id: 'division', label: 'Solve x/a = b', generate: divisionForm },
  { id: 'fraction', label: 'Fraction coefficients', generate: fractionCoefficient },
  { id: 'decimal', label: 'Decimal coefficients', generate: decimalCoefficient },
  { id: 'step', label: 'Choose the step', generate: whichStep },
];

export const masterySet = makeMasterySet(skills);
