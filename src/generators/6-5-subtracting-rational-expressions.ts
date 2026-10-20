// Practice problem generators for Lesson 6.5 — Subtracting Rational Expressions.
import { differentDenominators, factorFirst, oppositeDenominators, sameDenominator } from './6-4-adding-rational-expressions';
import { dfrac, ftex, makeMasterySet, monicFactors, pick, Poly, randInt, ratAnswer, ratTex, simplify, cancelTex } from './helpers';
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

export const skills: Skill[] = [
  { id: 'same', label: 'Same denominator', generate: () => sameDenominator('-') },
  { id: 'opposite', label: 'Opposite denominators', generate: () => oppositeDenominators('-') },
  { id: 'different', label: 'Different denominators', generate: () => differentDenominators('-') },
  { id: 'factor', label: 'Factor to find the LCD', generate: () => factorFirst('-') },
  { id: 'mixed', label: 'Add and subtract', generate: mixed },
];

export const masterySet = makeMasterySet(skills);
