// Practice problem generators for Lesson 6.5 — Subtracting Rational Expressions.
import { differentDenominators, factorFirst, oppositeDenominators, sameDenominator } from './6-4-adding-rational-expressions';
import { dfrac, ftex, lin, makeMasterySet, monicFactors, pick, Poly, randInt, ratAnswer, ratTex, simplify, cancelTex } from './helpers';
import type { Problem, Skill } from './types';

/** a/A + b/B − c/(A·B): add and subtract in one problem. */
function mixed(): Problem {
  const v = pick(['x', 'a', 'y']);
  const [A, B] = monicFactors(2, v);
  const a = randInt(1, 6), b = randInt(1, 6), c = randInt(1, 9);
  const N = B.scale(a).add(A.scale(b)).sub(Poly.const(c));
  const D = A.mul(B);
  if (N.isZero()) return mixed();
  const s = simplify(N, D, v);
  return {
    skill: 'mixed',
    prompt: `Simplify: $\\;${dfrac(String(a), A.tex())} + ${dfrac(String(b), B.tex())} - ${dfrac(String(c), D.tex())}$`,
    answer: ratAnswer(s),
    hints: [`Factor the last denominator: $${ftex(D, v)}$. That is the LCD.`, 'Rewrite each fraction with the LCD, then combine all three numerators.'],
    solution: [
      `$= ${dfrac(`${a}(${B.tex()}) + ${b}(${A.tex()}) - ${c}`, ftex(D, v))}$`,
      `$= ${dfrac(N.tex(), ftex(D, v))}$`,
      ...(s.common.length || s.g > 1 ? [`$= ${cancelTex(N, D, v)} = ${ratTex(s)}$`] : []),
    ],
    placeholder: `(3${v} + 1)/((${v} + 2)(${v} - 1))`,
  };
}

function tripWords(): Problem {
  const k = pick([5, 10, 10, 15, 20]), d = pick([60, 80, 100, 120, 150, 200]);
  const D = Poly.mono(1, { x: 1 }).mul(lin(1, k, 'x'));
  const s = simplify(Poly.const(d * k), D, 'x');
  return {
    skill: 'apply',
    prompt: `A trip of ${d} km is driven at $x$ km/h one day and at $x + ${k}$ km/h the next. How many more hours does the slower trip take? Write the difference as a single fraction.`,
    answer: ratAnswer(s),
    hints: [`Unknown: the difference in time. Key words: time = distance ÷ speed, and "how many more" means subtract: $\\frac{${d}}{x} - \\frac{${d}}{x + ${k}}$.`, `Use the LCD $x(x + ${k})$; subtract the **whole** second numerator.`],
    solution: [`$\\frac{${d}(x + ${k})}{x(x + ${k})} - \\frac{${d}x}{x(x + ${k})} = \\frac{${d}x + ${d * k} - ${d}x}{x(x + ${k})}$`, `$= ${ratTex(s)}$ hours`],
    placeholder: '1200/(x(x + 10))',
  };
}

export const skills: Skill[] = [
  { id: 'same', label: 'Same denominator', generate: () => sameDenominator('-') },
  { id: 'opposite', label: 'Opposite denominators', generate: () => oppositeDenominators('-') },
  { id: 'different', label: 'Different denominators', generate: () => differentDenominators('-') },
  { id: 'factor', label: 'Factor to find the LCD', generate: () => factorFirst('-') },
  { id: 'mixed', label: 'Add and subtract', generate: mixed },
  { id: 'apply', label: 'Word problems', generate: tripWords },
];

export const masterySet = makeMasterySet(skills);
