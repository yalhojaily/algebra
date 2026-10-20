// Practice problem generators for Lesson 6.7 — Solving Rational Equations.
import { dfrac, fracIn, fracTex, gcd, lcm, makeMasterySet, nz, Poly, randInt } from './helpers';
import type { Problem, Skill } from './types';

function clearFractions(): Problem {
  // x/a + x/b = c with an integer solution
  for (;;) {
    const a = randInt(2, 6), b = randInt(2, 8);
    if (a === b) continue;
    const L = lcm(a, b);
    const x0 = L * nz(3);
    const c = x0 / a + x0 / b;
    if (c === 0) continue;
    return {
      skill: 'clear',
      prompt: `Solve: $\\;${dfrac('x', String(a))} + ${dfrac('x', String(b))} = ${c}$`,
      answer: { type: 'solutions', values: [x0], variable: 'x' },
      hints: [`Multiply both sides by the LCD, $${L}$, to clear the fractions.`],
      solution: [`$${L} \\cdot ${dfrac('x', String(a))} + ${L} \\cdot ${dfrac('x', String(b))} = ${L} \\cdot ${c < 0 ? `(${c})` : c}$`, `$${L / a}x + ${L / b}x = ${L * c}$`, `$${L / a + L / b}x = ${L * c}$`, `$x = ${x0}$`],
      placeholder: 'x = 12',
    };
  }
}

function reciprocals(): Problem {
  // 1/a + 1/b = 1/x  →  x = ab/(a + b)
  const a = randInt(2, 12), b = randInt(2, 12);
  const num = a * b, den = a + b;
  return {
    skill: 'variable',
    prompt: `Solve: $\\;${dfrac('1', String(a))} + ${dfrac('1', String(b))} = ${dfrac('1', 'x')}$`,
    answer: { type: 'solutions', values: [num / den], variable: 'x' },
    hints: [`The LCD is $${a === b ? a : `${a * b / gcd(a, b)}`}x$. Multiply every term by it.`, 'Check that your answer does not make a denominator $0$.'],
    solution: [`Multiply by $${a}\\cdot ${b}\\cdot x$: $\\;${b}x + ${a}x = ${a * b}$`, `$${a + b}x = ${a * b}$`, `$x = ${fracTex(num, den)}$`],
    placeholder: fracIn(12, 7),
  };
}

function quadratic(): Problem {
  // x + k/x = m with solutions r and s
  for (;;) {
    const r = nz(8), s = nz(8);
    if (r === s) continue;
    const k = r * s, m = r + s;
    const kT = k < 0 ? `- ${dfrac(String(-k), 'x')}` : `+ ${dfrac(String(k), 'x')}`;
    const Q = Poly.fromCoefs([1, -m, k]);
    return {
      skill: 'quadratic',
      prompt: `Solve: $\\;x ${kT} = ${m}$`,
      answer: { type: 'solutions', values: [r, s], variable: 'x' },
      hints: ['Multiply every term by $x$.', `You get a quadratic equation: $${Q.tex()} = 0$. Factor it.`],
      solution: [`$x^2 ${k < 0 ? '-' : '+'} ${Math.abs(k)} = ${m === 1 ? '' : m === -1 ? '-' : m}x$`, `$${Q.tex()} = 0$`, `$(${Poly.fromCoefs([1, -r]).tex()})(${Poly.fromCoefs([1, -s]).tex()}) = 0$`, `$x = ${r}$ or $x = ${s}$ — neither makes $x = 0$, so both check.`],
      placeholder: 'x = 2 or x = -5',
    };
  }
}

function extraneous(): Problem {
  // x²/(x − r) = ((r + s)x − rs)/(x − r)  →  (x − r)(x − s) = 0, but x = r is not allowed
  for (;;) {
    const r = nz(7), s = nz(7);
    if (r === s) continue;
    const den = Poly.fromCoefs([1, -r]);
    const rhs = Poly.fromCoefs([r + s, -r * s]);
    if (rhs.isZero()) continue;
    return {
      skill: 'extraneous',
      prompt: `Solve: $\\;${dfrac('x^2', den.tex())} = ${dfrac(rhs.tex(), den.tex())}$`,
      answer: { type: 'solutions', values: [s], variable: 'x' },
      hints: [`First note that $x \\ne ${r}$ (it would make the denominator $0$).`, `Multiply both sides by $${den.tex()}$ and solve the quadratic. Then check each solution.`],
      solution: [
        `$x^2 = ${rhs.tex()}$`,
        `$${Poly.fromCoefs([1, -(r + s), r * s]).tex()} = 0$`,
        `$(${den.tex()})(${Poly.fromCoefs([1, -s]).tex()}) = 0$, so $x = ${r}$ or $x = ${s}$`,
        `$x = ${r}$ makes a denominator $0$, so it is **not** a solution. The only solution is $x = ${s}$.`,
      ],
      mistakes: [
        { answer: `${r}, ${s}`, feedback: `Check each value in the original equation: $x = ${r}$ makes the denominator $${den.tex()}$ equal to $0$.` },
        { answer: `${s}, ${r}`, feedback: `Check each value in the original equation: $x = ${r}$ makes the denominator $${den.tex()}$ equal to $0$.` },
      ],
      placeholder: 'x = 4',
    };
  }
}

export const skills: Skill[] = [
  { id: 'clear', label: 'Clear the fractions', generate: clearFractions },
  { id: 'variable', label: 'Variable in a denominator', generate: reciprocals },
  { id: 'quadratic', label: 'Equations that become quadratic', generate: quadratic },
  { id: 'extraneous', label: 'Check for extra "solutions"', generate: extraneous },
];

export const masterySet = makeMasterySet(skills);
