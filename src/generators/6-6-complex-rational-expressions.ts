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
  const term = (c: number, v: string) => `${c === 1 ? '' : c}${v}`;
  if (Math.random() < 0.6) {
    for (;;) {
      const a = randInt(1, 5), b = randInt(1, 5), c = randInt(1, 5), d = randInt(1, 5);
      const plusTop = pick([true, false]);
      if (gcd(gcd(a, b), gcd(c, d)) > 1 || a * d === b * c) continue;
      const s1 = plusTop ? '+' : '-', s2 = plusTop ? '-' : '+';
      const top = `${dfrac(String(a), 'x')} ${s1} ${dfrac(String(b), 'y')}`;
      const bot = `${dfrac(String(c), 'x')} ${s2} ${dfrac(String(d), 'y')}`;
      const num = `${term(a, 'y')} ${s1} ${term(b, 'x')}`, den = `${term(c, 'y')} ${s2} ${term(d, 'x')}`;
      return {
        skill: 'twovar',
        prompt: `Simplify: $\\;${dfrac(top, bot)}$`,
        answer: { type: 'expression', value: `(${a}*y ${s1} ${b}*x)/(${c}*y ${s2} ${d}*x)`, rational: true },
        hints: ['Multiply the top and bottom by the LCD, $xy$.', `$xy \\cdot ${dfrac(String(a), 'x')} = ${term(a, 'y')}$ and $xy \\cdot ${dfrac(String(b), 'y')} = ${term(b, 'x')}$.`],
        solution: [`$= ${dfrac(`xy \\cdot ${dfrac(String(a), 'x')} ${s1} xy \\cdot ${dfrac(String(b), 'y')}`, `xy \\cdot ${dfrac(String(c), 'x')} ${s2} xy \\cdot ${dfrac(String(d), 'y')}`)}$`, `$= ${dfrac(num, den)}$`],
        placeholder: '(2y + x)/(y - 3x)',
      };
    }
  }
  const a = randInt(1, 4), b = randInt(1, 4);
  const sq = (n: number) => (n === 1 ? '1' : String(n * n));
  return {
    skill: 'twovar',
    prompt: `Simplify: $\\;${dfrac(`${dfrac(String(a), 'x')} - ${dfrac(String(b), 'y')}`, `${dfrac(sq(a), 'x^2')} - ${dfrac(sq(b), 'y^2')}`)}$`,
    answer: { type: 'expression', value: `(x*y)/(${a}*y + ${b}*x)`, rational: true },
    hints: ['Multiply the top and bottom by the LCD, $x^2y^2$.', `The bottom becomes $${term(a * a, 'y^2')} - ${term(b * b, 'x^2')}$, a difference of squares.`],
    solution: [
      `$= ${dfrac(`${term(a, 'xy^2')} - ${term(b, 'x^2y')}`, `${term(a * a, 'y^2')} - ${term(b * b, 'x^2')}`)}$`,
      `$= ${dfrac(`xy(${term(a, 'y')} - ${term(b, 'x')})`, `(${term(a, 'y')} + ${term(b, 'x')})(${term(a, 'y')} - ${term(b, 'x')})`)}$`,
      `$= ${dfrac('xy', `${term(a, 'y')} + ${term(b, 'x')}`)}$`,
    ],
    placeholder: 'xy/(2y + x)',
  };
}

function avgSpeedWords(): Problem {
  const [a, b] = pick([[30, 60], [40, 60], [20, 30], [60, 90], [12, 24], [10, 15], [6, 12], [45, 90], [50, 75]]);
  const avg = (2 * a * b) / (a + b);
  const [who, how] = pick([['A cyclist', 'rides'], ['A driver', 'travels'], ['A runner', 'runs']]);
  return {
    skill: 'apply',
    prompt: `${who} ${how} to a town at $${a}$ km/h and returns the same way at $${b}$ km/h. What is the average speed for the whole round trip (in km/h)?`,
    answer: { type: 'number', value: avg },
    hints: ['Unknown: the average speed. Key words: average speed = **total distance ÷ total time**, not the average of the two speeds.', `Call the one-way distance $d$: average $= \\dfrac{2d}{\\frac{d}{${a}} + \\frac{d}{${b}}}$. Simplify this complex fraction — $d$ cancels.`],
    solution: [`$\\dfrac{2d}{\\frac{d}{${a}} + \\frac{d}{${b}}} = \\dfrac{2}{\\frac{1}{${a}} + \\frac{1}{${b}}}$`, `Multiply top and bottom by $${a * b / gcd(a, b)}$: $\;\\dfrac{${(2 * a * b) / gcd(a, b)}}{${b / gcd(a, b)} + ${a / gcd(a, b)}} = ${avg}$`, `The average speed is $${avg}$ km/h.`],
    mistakes: [{ answer: String((a + b) / 2), feedback: 'That is the average of the two speeds, but more time is spent at the slower speed. Use total distance ÷ total time.' }],
    placeholder: 'e.g. 40',
  };
}

export const skills: Skill[] = [
  { id: 'numeric', label: 'Numbers', generate: numeric },
  { id: 'lcd', label: 'Multiply by the LCD', generate: linearOverLinear },
  { id: 'squares', label: 'Factor after clearing', generate: differenceOfSquares },
  { id: 'twovar', label: 'Two variables', generate: twoVariables },
  { id: 'apply', label: 'Word problems', generate: avgSpeedWords },
];

export const masterySet = makeMasterySet(skills);
