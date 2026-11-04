// Practice problem generators for Lesson 11.2 — The Quadratic Formula.
import { makeMasterySet, nz, pick, randInt } from './helpers';
import { quadRoots, quadTex } from './quad';
import type { Problem, Skill } from './types';

function formulaSteps(a: number, b: number, c: number) {
  const D = b * b - 4 * a * c;
  const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);
  return `$x = \\dfrac{-${p(b)} \\pm \\sqrt{${p(b)}^2 - 4(${a})(${c})}}{2(${a})} = \\dfrac{${-b} \\pm \\sqrt{${D}}}{${2 * a}}$`;
}

function rational(): Problem {
  for (;;) {
    const p = randInt(1, 4), q = nz(7), r = randInt(1, 3), s = nz(7);
    const a = p * r, b = p * s + q * r, c = q * s;
    if (b === 0) continue;
    const Q = quadRoots(a, b, c);
    return {
      skill: 'rational',
      prompt: `Solve using the quadratic formula: $\\;${quadTex(a, b, c)} = 0$`,
      answer: { type: 'solutions', values: Q.real, variable: 'x' },
      hints: [`$a = ${a},\\ b = ${b},\\ c = ${c}$`, '$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$'],
      solution: [formulaSteps(a, b, c), `$${Q.tex}$`],
      placeholder: '3/2, -1',
    };
  }
}

function irrational(): Problem {
  for (;;) {
    const a = pick([1, 1, 2, 3]), b = nz(8), c = randInt(-9, 9);
    const D = b * b - 4 * a * c;
    if (D <= 0 || Number.isInteger(Math.sqrt(D))) continue;
    const Q = quadRoots(a, b, c);
    return {
      skill: 'irrational',
      prompt: `Solve using the quadratic formula: $\\;${quadTex(a, b, c)} = 0$ (Give exact answers.)`,
      answer: { type: 'solutions', values: Q.real, variable: 'x' },
      hints: [`$a = ${a},\\ b = ${b},\\ c = ${c}$. The discriminant is $b^2 - 4ac = ${D}$.`, 'Simplify the square root and reduce the fraction if possible. Type ± as +-.'],
      solution: [formulaSteps(a, b, c), `$${Q.tex}$`],
      placeholder: '(-3 ± sqrt(17))/4',
    };
  }
}

function complexRoots(): Problem {
  for (;;) {
    const a = pick([1, 1, 2]), b = randInt(-6, 6), c = randInt(1, 15);
    const D = b * b - 4 * a * c;
    if (D >= 0) continue;
    const Q = quadRoots(a, b, c);
    return {
      skill: 'complex',
      prompt: `Solve: $\\;${quadTex(a, b, c)} = 0$`,
      answer: { type: 'csolutions', values: Q.complex, variable: 'x' },
      hints: [`The discriminant is $${D}$, which is negative — the solutions are complex.`, `$\\sqrt{${D}} = i\\sqrt{${-D}}$.`],
      solution: [formulaSteps(a, b, c), `$${Q.tex}$`],
      placeholder: '1 ± 2i',
    };
  }
}

function standardForm(): Problem {
  for (;;) {
    // a x² + b x = c x + d form to rearrange
    const a = pick([1, 2]), b = nz(6), c = randInt(-12, 12), extra = nz(5);
    const D = b * b - 4 * a * c;
    if (D < 0) continue;
    const Q = quadRoots(a, b, c);
    // show as a x² + (b + extra) x = extra x − c
    return {
      skill: 'standard',
      prompt: `Solve: $\\;${quadTex(a, b + extra, 0)} = ${quadTex(0, extra, -c)}$`,
      answer: { type: 'solutions', values: Q.real, variable: 'x' },
      hints: ['First write the equation in standard form $ax^2 + bx + c = 0$.', `$${quadTex(a, b, c)} = 0$`],
      solution: [`$${quadTex(a, b, c)} = 0$`, formulaSteps(a, b, c), `$${Q.tex}$`],
      placeholder: '2 ± sqrt(3)',
    };
  }
}


/** Word problems whose equations need the quadratic formula (irrational answers, rounded). */
function formulaWords(): Problem {
  for (;;) {
    if (Math.random() < 0.5) {
      const d = randInt(1, 8), A = randInt(10, 90);
      const disc = d * d + 4 * A;
      if (Number.isInteger(Math.sqrt(disc))) continue;
      const w = (-d + Math.sqrt(disc)) / 2;
      return {
        skill: 'apply',
        prompt: `A rectangular rug is ${d} ft longer than it is wide, and its area is ${A} ft². Find its **width** to the nearest hundredth of a foot.`,
        answer: { type: 'number', value: +w.toFixed(2), tol: 0.006 },
        hints: [`Unknown: the width $w$; the length is $w + ${d}$. Area: $w(w + ${d}) = ${A}$, so $w^2 + ${d}w - ${A} = 0$.`, `It doesn't factor: use the quadratic formula with $a = 1$, $b = ${d}$, $c = -${A}$, and keep the positive solution.`],
        solution: [`$w^2 + ${d}w - ${A} = 0$`, `$w = \\dfrac{-${d} \\pm \\sqrt{${d * d} + ${4 * A}}}{2} = \\dfrac{-${d} \\pm \\sqrt{${disc}}}{2}$`, `$w = \\dfrac{-${d} + \\sqrt{${disc}}}{2} \\approx ${w.toFixed(2)}$ ft (the other solution is negative)`],
        placeholder: '5.62',
      };
    }
    const c = randInt(6, 25), dd = pick([1, 2, 3, 4, 5]);
    // legs x and x + dd, hypotenuse c: 2x² + 2dd x + dd² − c² = 0
    const disc = 4 * dd * dd - 8 * (dd * dd - c * c);
    if (disc <= 0 || Number.isInteger(Math.sqrt(disc))) continue;
    const x = (-2 * dd + Math.sqrt(disc)) / 4;
    if (x <= 0) continue;
    return {
      skill: 'apply',
      prompt: `One leg of a right triangle is ${dd} cm longer than the other, and the hypotenuse is ${c} cm. Find the length of the **shorter leg** to the nearest hundredth of a centimeter.`,
      answer: { type: 'number', value: +x.toFixed(2), tol: 0.006 },
      hints: [`Unknown: the shorter leg $x$; the other leg is $x + ${dd}$. Pythagorean theorem: $x^2 + (x + ${dd})^2 = ${c * c}$.`, `Standard form: $2x^2 + ${2 * dd}x + ${dd * dd - c * c} = 0$. Use the quadratic formula and keep the positive solution.`],
      solution: [`$2x^2 + ${2 * dd}x ${dd * dd - c * c < 0 ? '-' : '+'} ${Math.abs(dd * dd - c * c)} = 0$`, `$x = \\dfrac{-${2 * dd} + \\sqrt{${disc}}}{4} \\approx ${x.toFixed(2)}$ cm (reject the negative solution)`],
      placeholder: '6.42',
    };
  }
}

export const skills: Skill[] = [
  { id: 'rational', label: 'Rational solutions', generate: rational },
  { id: 'irrational', label: 'Irrational solutions', generate: irrational },
  { id: 'standard', label: 'Write in standard form first', generate: standardForm },
  { id: 'complex', label: 'Complex solutions', generate: complexRoots },
  { id: 'apply', label: 'Word problems', generate: formulaWords },
];

export const masterySet = makeMasterySet(skills);
