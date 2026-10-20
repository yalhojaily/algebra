// Practice problem generators for Lesson 11.3 — Applications Involving Quadratic Equations.
import { choice, makeMasterySet, pick, randInt } from './helpers';
import { radTex, rootSplit } from './radicals';
import type { Problem, Skill } from './types';

function falling(): Problem {
  const h = pick([64, 100, 144, 256, 400, 576, 200, 300, 500, 1000]);
  const t = Math.sqrt(h / 16);
  const { out, inside } = rootSplit(h);
  return {
    skill: 'falling',
    prompt: `An object is dropped from a height of ${h} ft. The distance it falls in $t$ seconds is $s = 16t^2$. How long does it take to reach the ground? (Exact answer, in seconds — type sqrt( ) if needed.)`,
    answer: { type: 'number', value: t },
    hints: [`Solve $16t^2 = ${h}$: divide by $16$, then take the positive square root.`],
    solution: [`$t^2 = \\dfrac{${h}}{16}$`, `$t = \\dfrac{\\sqrt{${h}}}{4} = \\dfrac{${radTex(out, inside)}}{4}${Number.isInteger(t) ? ` = ${t}` : ` \\approx ${t.toFixed(2)}`}$ s (time is positive)`],
    placeholder: '5sqrt(2)/2',
  };
}

function solveFormula(): Problem {
  const f = pick([
    { prompt: 'A = \\pi r^2', v: 'r', ans: 'r = sqrt(A/pi)', tex: 'r = \\sqrt{\\dfrac{A}{\\pi}}' },
    { prompt: 'V = \\pi r^2 h', v: 'r', ans: 'r = sqrt(V/(pi*h))', tex: 'r = \\sqrt{\\dfrac{V}{\\pi h}}' },
    { prompt: 'E = mc^2', v: 'c', ans: 'c = sqrt(E/m)', tex: 'c = \\sqrt{\\dfrac{E}{m}}' },
    { prompt: 'a^2 + b^2 = c^2', v: 'b', ans: 'b = sqrt(c^2 - a^2)', tex: 'b = \\sqrt{c^2 - a^2}' },
    { prompt: 'S = 4\\pi r^2', v: 'r', ans: 'r = sqrt(S/(4pi))', tex: 'r = \\dfrac{1}{2}\\sqrt{\\dfrac{S}{\\pi}}' },
  ]);
  return {
    skill: 'formula',
    prompt: `Solve for $${f.v}$ (assume all variables are positive): $\\;${f.prompt}$`,
    answer: choice(`$${f.tex}$`, [`$${f.v} = \\dfrac{${f.prompt.split('=')[0].trim()}}{2}$`, `$${f.tex.replace('\\sqrt', '')}$`]),
    hints: [`Isolate $${f.v}^2$, then take the positive square root.`],
    solution: [`$${f.tex}$`],
  };
}

function rectangle(): Problem {
  const w = randInt(3, 15), extra = randInt(2, 10);
  const L = w + extra, A = w * L;
  const ask = pick(['width', 'length'] as const);
  return {
    skill: 'area',
    prompt: `A rectangle is ${extra} m longer than it is wide, and its area is ${A} m². Find its **${ask}** (m).`,
    answer: { type: 'number', value: ask === 'width' ? w : L },
    hints: [`Let $w$ be the width: $w(w + ${extra}) = ${A}$.`, `Write $w^2 + ${extra}w - ${A} = 0$ and solve; reject the negative solution.`],
    solution: [`$w^2 + ${extra}w - ${A} = 0 \\Rightarrow (w - ${w})(w + ${L}) = 0$`, `$w = ${w}$ (a width can't be negative), length $= ${L}$`],
  };
}

function motion(): Problem {
  // two legs of a trip with speeds r and r + d, total time T
  for (;;) {
    const r = randInt(20, 60), d = pick([5, 10, 15, 20]), t1 = pick([2, 3]), t2 = pick([1, 2, 3]);
    const D1 = r * t1, D2 = (r + d) * t2;
    const T = t1 + t2;
    // check uniqueness: D1/x + D2/(x + d) = T  → T x² + (T d − D1 − D2) x − D1 d = 0
    const a = T, b = T * d - D1 - D2, c = -D1 * d;
    const disc = b * b - 4 * a * c;
    const other = (-b - Math.sqrt(disc)) / (2 * a);
    if (other > 0) continue;
    return {
      skill: 'motion',
      prompt: `A cyclist rides ${D1} km at one speed, then ${D2} km at a speed ${d} km/h faster. The whole trip takes ${T} hours. What was the first speed (km/h)?`,
      answer: { type: 'number', value: r },
      hints: [`Time = distance ÷ speed: $\\dfrac{${D1}}{r} + \\dfrac{${D2}}{r + ${d}} = ${T}$.`, 'Multiply through by $r(r + ' + d + ')$ to get a quadratic equation.'],
      solution: [`$${D1}(r + ${d}) + ${D2}r = ${T}r(r + ${d})$`, `$${a}r^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}r - ${-c} = 0$`, `$r = ${r}$ (the other solution is negative)`],
    };
  }
}

export const skills: Skill[] = [
  { id: 'falling', label: 'Falling objects', generate: falling },
  { id: 'formula', label: 'Solve a formula', generate: solveFormula },
  { id: 'area', label: 'Area', generate: rectangle },
  { id: 'motion', label: 'Motion', generate: motion },
];

export const masterySet = makeMasterySet(skills);
