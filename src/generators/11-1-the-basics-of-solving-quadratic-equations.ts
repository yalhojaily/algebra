// Practice problem generators for Lesson 11.1 — The Basics of Solving Quadratic Equations.
import { fracTex, makeMasterySet, nz, pick, randInt } from './helpers';
import { quadRoots, quadTex } from './quad';
import { radicands, radTex, rootSplit } from './radicals';
import type { Problem, Skill } from './types';

function principle(): Problem {
  const a = pick([1, 1, 2, 3, 4]);
  const perfect = Math.random() < 0.4;
  const k = perfect ? randInt(1, 12) ** 2 : pick(radicands) * pick([1, 4, 9]);
  const { out, inside } = rootSplit(k);
  const neg = Math.random() < 0.2;
  const rhs = neg ? -k : k;
  const lhs = a === 1 ? 'x^2' : `${a}x^2`;
  const values = neg ? [] : [Math.sqrt(k), -Math.sqrt(k)];
  if (neg)
    return {
      skill: 'principle',
      prompt: `Solve: $\\;${lhs} = ${a * rhs}$`,
      answer: { type: 'csolutions', values: [{ re: 0, im: Math.sqrt(k) }, { re: 0, im: -Math.sqrt(k) }], variable: 'x' },
      hints: [a === 1 ? '' : `Divide both sides by $${a}$ first.`, '$x^2 = -k$ has the imaginary solutions $x = \\pm i\\sqrt{k}$.'].filter(Boolean),
      solution: [`$x^2 = ${rhs}$`, `$x = \\pm\\sqrt{${rhs}} = \\pm ${inside === 1 ? `${out}i` : `${radTex(out, inside)}\\,i`}$`],
      placeholder: '± 3i',
    };
  return {
    skill: 'principle',
    prompt: `Solve: $\\;${lhs} = ${a * rhs}$`,
    answer: { type: 'solutions', values, variable: 'x' },
    hints: [...(a === 1 ? [] : [`Divide both sides by $${a}$: $x^2 = ${k}$.`]), 'Principle of square roots: if $x^2 = k$, then $x = \\sqrt{k}$ or $x = -\\sqrt{k}$. Type ± as +-.'],
    solution: [`$x^2 = ${k}$`, `$x = \\pm\\sqrt{${k}} = \\pm ${radTex(out, inside)}$`],
    mistakes: [{ answer: inside === 1 ? String(out) : `${out === 1 ? '' : out}sqrt(${inside})`, feedback: 'Don\'t forget the negative square root: $x = \\pm\\sqrt{k}$.' }],
    placeholder: '± 2sqrt(3)',
  };
}

function shifted(): Problem {
  const h = nz(6), k = pick([...radicands, 4, 9, 16, 25, 12, 18, 20]);
  const { out, inside } = rootSplit(k);
  const inner = `x ${h < 0 ? '+' : '-'} ${Math.abs(h)}`;
  return {
    skill: 'shifted',
    prompt: `Solve: $\\;(${inner})^2 = ${k}$`,
    answer: { type: 'solutions', values: [h + Math.sqrt(k), h - Math.sqrt(k)], variable: 'x' },
    hints: [`Take square roots: $${inner} = \\pm\\sqrt{${k}}$.`, `Then ${h < 0 ? 'subtract' : 'add'} $${Math.abs(h)}$.`],
    solution: [`$${inner} = \\pm ${radTex(out, inside)}$`, inside === 1 ? `$x = ${h} \\pm ${out}$: $x = ${h + out}$ or $x = ${h - out}$` : `$x = ${h} \\pm ${radTex(out, inside)}$`],
    placeholder: '3 ± sqrt(5)',
  };
}

function completingTerm(): Problem {
  const b = nz(12) * pick([1, 1, 1, 0.5]);
  const sq = (b / 2) ** 2;
  const bTex = fracTex(Math.abs(b) * 2, 2), hTex = fracTex(b * 2, 4), sqTex = fracTex(Math.round(b * b * 4), 16);
  return {
    skill: 'term',
    prompt: `What number completes the square? $\\;x^2 ${b < 0 ? '-' : '+'} ${bTex}x + \\underline{\\quad}$`,
    answer: { type: 'number', value: sq },
    hints: ['Take **half** the coefficient of $x$, then **square** it.'],
    solution: [`Half of $${b < 0 ? '-' : ''}${bTex}$ is $${hTex}$; squared: $${sqTex}$.`, `$x^2 ${b < 0 ? '-' : '+'} ${bTex}x + ${sqTex} = \\left(x ${b < 0 ? '-' : '+'} ${fracTex(Math.abs(b) * 2, 4)}\\right)^2$`],
    mistakes: [{ answer: String(b / 2), feedback: 'Half the coefficient is the first step — now **square** it.' }],
  };
}

function complete(): Problem {
  for (;;) {
    const b = nz(5) * 2, c = randInt(-12, 12);
    const D = b * b - 4 * c;
    if (D <= 0) continue;
    const q = quadRoots(1, b, c);
    const h = b / 2, k = h * h - c; // (x + h)² = k
    return {
      skill: 'complete',
      prompt: `Solve by completing the square: $\\;${quadTex(1, b, c)} = 0$`,
      answer: { type: 'solutions', values: q.real, variable: 'x' },
      hints: [`Move the constant: $${quadTex(1, b, 0)} = ${-c}$.`, `Add $\\left(\\frac{${b}}{2}\\right)^2 = ${h * h}$ to both sides, then use the principle of square roots.`],
      solution: [`$${quadTex(1, b, 0)} + ${h * h} = ${-c} + ${h * h}$`, `$(x ${h < 0 ? '-' : '+'} ${Math.abs(h)})^2 = ${k}$`, `$${q.tex}$`],
      placeholder: '-2 ± sqrt(7)',
    };
  }
}

export const skills: Skill[] = [
  { id: 'principle', label: 'Principle of square roots', generate: principle },
  { id: 'shifted', label: '(x − h)² = k', generate: shifted },
  { id: 'term', label: 'Complete the square', generate: completingTerm },
  { id: 'complete', label: 'Solve by completing the square', generate: complete },
];

export const masterySet = makeMasterySet(skills);
