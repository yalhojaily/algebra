// Practice problem generators for Lesson 9.1 — Sets, Inequalities, and Interval Notation.
import { makeMasterySet, nz, pick, randInt, termTex } from './helpers';
import { ineqTex, iv, ivTex, type Iv } from './sets';
import type { Problem, Skill } from './types';

function randIv(): Iv {
  const kind = pick(['left', 'right', 'both'] as const);
  const a = randInt(-8, 4), b = a + randInt(2, 8);
  if (kind === 'left') return iv(-Infinity, b, false, Math.random() < 0.5);
  if (kind === 'right') return iv(a, Infinity, Math.random() < 0.5, false);
  return iv(a, b, Math.random() < 0.5, Math.random() < 0.5);
}

function notation(): Problem {
  const p = randIv();
  return {
    skill: 'notation',
    prompt: `Write $\\;${ineqTex(p)}\\;$ in interval notation. (Type inf for $\\infty$.)`,
    answer: { type: 'interval', ...p },
    hints: ['Use [ or ] when the endpoint is included (≤ or ≥), and ( or ) when it is not (< or >).', 'An end that goes on forever is $\\infty$ or $-\\infty$, always with a round parenthesis.'],
    solution: [`$${ineqTex(p)}$ is $${ivTex(p)}$.`],
    placeholder: '[-2, 5)',
  };
}

function fromGraph(): Problem {
  const p = randIv();
  return {
    skill: 'graph',
    prompt: 'Write the set graphed below in interval notation.',
    figure: { kind: 'numberline', parts: [p], min: -10, max: 12 },
    answer: { type: 'interval', ...p },
    hints: ['A solid dot is included (bracket); an open dot is not (parenthesis). An arrow means the set continues forever (∞).'],
    solution: [`The graph shows $${ineqTex(p)}$, which is $${ivTex(p)}$.`],
    placeholder: '(-inf, 3]',
  };
}

function solveLinear(): Problem {
  const a = nz(6), x0 = randInt(-6, 6), b = randInt(-9, 9);
  const c = a * x0 + b;
  const op = pick(['<', '\\le', '>', '\\ge']);
  const strict = op === '<' || op === '>';
  const less = op === '<' || op === '\\le';
  // a x + b (op) c  →  x (op') x0, flipped when a < 0
  const xLess = a > 0 ? less : !less;
  const ans = xLess ? iv(-Infinity, x0, false, !strict) : iv(x0, Infinity, !strict, false);
  return {
    skill: 'solve',
    prompt: `Solve and write the solution set in interval notation: $\\;${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${Math.abs(b)} ${op} ${c}$`,
    answer: { type: 'interval', ...ans },
    hints: [`${b < 0 ? 'Add' : 'Subtract'} $${Math.abs(b)}$ on both sides, then divide by $${a}$.`, a < 0 ? 'You are dividing by a **negative** number — reverse the inequality sign.' : 'Dividing by a positive number keeps the inequality sign.'],
    solution: [`$${termTex(a, 'x')} ${op} ${c - b}$`, `$x ${xLess ? (strict ? '<' : '\\le') : strict ? '>' : '\\ge'} ${x0}$${a < 0 ? ' (sign reversed)' : ''}`, `Solution set: $${ivTex(ans)}$`],
    mistakes: [{ answer: xLess ? `(${x0}, inf)` : `(-inf, ${x0})`, feedback: a < 0 ? 'When you divide by a negative number, the inequality sign must be reversed.' : 'Check the direction of the inequality.' }],
    placeholder: '(-inf, 4]',
  };
}

function scores(): Problem {
  const tests = [randInt(70, 92), randInt(70, 95), randInt(65, 95)];
  const target = pick([80, 85, 90]);
  const need = target * 4 - tests.reduce((s, t) => s + t, 0);
  if (need > 100 || need < 40) return scores();
  return {
    skill: 'apply',
    prompt: `Your test scores are ${tests.join(', ')}. What scores on a fourth test (from 0 to 100) give an average of **at least** ${target}? Write the set in interval notation.`,
    answer: { type: 'interval', ...iv(need, 100, true, true) },
    hints: [`Let $x$ be the fourth score: $\\dfrac{${tests.join(' + ')} + x}{4} \\ge ${target}$.`, 'Remember the score cannot be more than 100.'],
    solution: [`$${tests.reduce((s, t) => s + t, 0)} + x \\ge ${target * 4}$, so $x \\ge ${need}$.`, `With $x \\le 100$: $${ivTex(iv(need, 100, true, true))}$`],
    placeholder: '[85, 100]',
  };
}

export const skills: Skill[] = [
  { id: 'notation', label: 'Inequality → interval', generate: notation },
  { id: 'graph', label: 'Read a graph', generate: fromGraph },
  { id: 'solve', label: 'Solve inequalities', generate: solveLinear },
  { id: 'apply', label: 'Applications', generate: scores },
];

export const masterySet = makeMasterySet(skills);
