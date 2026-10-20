// Practice problem generators for Lesson 6.6 — Complex Rational Expressions.
import { dfrac, fracIn, fracTex, gcd, lcm, makeMasterySet, nz, pick, Poly, randInt, ratAnswer, ratTex, simplify } from './helpers';
import type { Problem, Skill } from './types';

function numeric(): Problem {
  // (1/a + 1/b) / (1/c − 1/d)
  for (;;) {
    const [a, b, c, d] = [randInt(2, 6), randInt(2, 6), randInt(2, 6), randInt(2, 6)];
    if (c === d) continue;
    const topN = b + a, topD = a * b;
    const botN = d - c, botD = c * d;
    const num = topN * botD, den = topD * botN;
    const L = lcm(a, b, c, d);
    return {
      skill: 'numeric',
      prompt: `Simplify: $\\;${dfrac(`${dfrac('1', String(a))} + ${dfrac('1', String(b))}`, `${dfrac('1', String(c))} - ${dfrac('1', String(d))}`)}$`,
      answer: { type: 'number', value: num / den },
      hints: [`Multiply the numerator and the denominator by the LCD of all the small fractions, $${L}$.`],
      solution: [
        `$= ${dfrac(`${L} \\cdot ${dfrac('1', String(a))} + ${L} \\cdot ${dfrac('1', String(b))}`, `${L} \\cdot ${dfrac('1', String(c))} - ${L} \\cdot ${dfrac('1', String(d))}`)} = ${dfrac(`${L / a} + ${L / b}`, `${L / c} - ${L / d}`)}$`,
        `$= ${dfrac(String(L / a + L / b), String(L / c - L / d))}${(L / a + L / b) / gcd(L / a + L / b, L / c - L / d) === Math.abs(L / a + L / b) && (L / c - L / d) > 0 ? '' : ` = ${fracTex(num, den)}`}$`,
      ],
      placeholder: fracIn(7, 3),
    };
  }
}

function linearOverLinear(): Problem {
  const v = pick(['x', 'a', 'y']);
  // (a + b/v) / (c + d/v)  =  (a v + b)/(c v + d)
  for (;;) {
    const a = randInt(1, 5), b = nz(9), c = randInt(1, 5), d = nz(9);
    if (a * d === b * c || gcd(gcd(a, b), gcd(c, d)) > 1) continue;
    const N = Poly.fromCoefs([a, b], v), D = Poly.fromCoefs([c, d], v);
    const s = simplify(N, D, v);
    const t = (k: number, n: number) => `${k} ${n < 0 ? '-' : '+'} ${dfrac(String(Math.abs(n)), v)}`;
    return {
      skill: 'lcd',
      prompt: `Simplify: $\\;${dfrac(t(a, b), t(c, d))}$`,
      answer: ratAnswer(s),
      hints: [`The only denominator inside is $${v}$. Multiply the top and the bottom of the big fraction by $${v}$.`],
      solution: [`$= ${dfrac(`(${t(a, b)}) \\cdot ${v}`, `(${t(c, d)}) \\cdot ${v}`)}$`, `$= ${ratTex(s)}$`],
      placeholder: `(2${v} + 3)/(${v} - 4)`,
    };
  }
}

function differenceOfSquares(): Problem {
  const v = pick(['x', 'a', 'y']);
  const k = randInt(1, 9), sign = pick([1, -1]);
  // (1 − k²/v²) / (1 + sign·k/v) = (v − sign·k)/v
  const N = Poly.fromCoefs([1, -sign * k], v), D = Poly.v(v);
  const s = simplify(N, D, v);
  return {
    skill: 'squares',
    prompt: `Simplify: $\\;${dfrac(`1 - ${dfrac(String(k * k), `${v}^2`)}`, `1 ${sign > 0 ? '+' : '-'} ${dfrac(String(k), v)}`)}$`,
    answer: ratAnswer(s),
    hints: [`Multiply the top and bottom by the LCD, $${v}^2$.`, `The numerator becomes $${v}^2 - ${k * k}$, a difference of squares.`],
    solution: [
      `$= ${dfrac(`${v}^2 - ${k * k}`, `${v}^2 ${sign > 0 ? '+' : '-'} ${k}${v}`)}$ — multiply top and bottom by $${v}^2$`,
      `$= ${dfrac(`(${v} + ${k})(${v} - ${k})`, `${v}(${v} ${sign > 0 ? '+' : '-'} ${k})`)}$`,
      `$= ${ratTex(s)}$`,
    ],
    placeholder: `(${v} - 3)/${v}`,
  };
}

function twoVariables(): Problem {
  const form = randInt(0, 1);
  if (form === 0) {
    const plusTop = pick([true, false]);
    const top = `${dfrac('1', 'x')} ${plusTop ? '+' : '-'} ${dfrac('1', 'y')}`;
    const bot = `${dfrac('1', 'x')} ${plusTop ? '-' : '+'} ${dfrac('1', 'y')}`;
    const value = plusTop ? '(y + x)/(y - x)' : '(y - x)/(y + x)';
    return {
      skill: 'twovar',
      prompt: `Simplify: $\\;${dfrac(top, bot)}$`,
      answer: { type: 'expression', value, rational: true },
      hints: ['Multiply the top and bottom by the LCD, $xy$.'],
      solution: [`$= ${dfrac(`xy \\cdot ${dfrac('1', 'x')} ${plusTop ? '+' : '-'} xy \\cdot ${dfrac('1', 'y')}`, `xy \\cdot ${dfrac('1', 'x')} ${plusTop ? '-' : '+'} xy \\cdot ${dfrac('1', 'y')}`)}$`, `$= ${dfrac(plusTop ? 'y + x' : 'y - x', plusTop ? 'y - x' : 'y + x')}$`],
      placeholder: '(y + x)/(y - x)',
    };
  }
  return {
    skill: 'twovar',
    prompt: `Simplify: $\\;${dfrac(`${dfrac('1', 'x')} - ${dfrac('1', 'y')}`, `${dfrac('1', 'x^2')} - ${dfrac('1', 'y^2')}`)}$`,
    answer: { type: 'expression', value: '(x*y)/(x + y)', rational: true },
    hints: ['Multiply the top and bottom by the LCD, $x^2y^2$.', 'The bottom becomes $y^2 - x^2 = (y + x)(y - x)$.'],
    solution: [`$= ${dfrac('xy^2 - x^2y', 'y^2 - x^2')}$`, `$= ${dfrac('xy(y - x)', '(y + x)(y - x)')}$`, `$= ${dfrac('xy', 'x + y')}$`],
    placeholder: 'xy/(x + y)',
  };
}

export const skills: Skill[] = [
  { id: 'numeric', label: 'Numbers', generate: numeric },
  { id: 'lcd', label: 'Multiply by the LCD', generate: linearOverLinear },
  { id: 'squares', label: 'Factor after clearing', generate: differenceOfSquares },
  { id: 'twovar', label: 'Two variables', generate: twoVariables },
];

export const masterySet = makeMasterySet(skills);
