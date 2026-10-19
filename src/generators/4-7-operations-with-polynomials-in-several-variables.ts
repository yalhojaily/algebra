// Practice problem generators for Lesson 4.7 — Operations with Polynomials in Several Variables.
import { monoStr } from '../lib/poly';
import { makeMasterySet, nz, p, pick, Poly, randInt, shuffle } from './helpers';
import type { Problem, Skill } from './types';

const ans = (P: Poly) => ({ type: 'expression' as const, value: P.text(), maxTerms: Math.max(1, P.size) });
const pair = () => pick([['x', 'y'], ['a', 'b'], ['m', 'n']]);

function randTerm(v: string, w: string, maxDeg = 3) {
  const e1 = randInt(0, maxDeg);
  const e2 = randInt(e1 === 0 ? 1 : 0, maxDeg);
  return Poly.mono(nz(9), { ...(e1 ? { [v]: e1 } : {}), ...(e2 ? { [w]: e2 } : {}) });
}
const randMulti = (v: string, w: string, n: number) => {
  let P = new Poly();
  while (P.size < n) P = P.add(randTerm(v, w));
  return P;
};

function evaluate(): Problem {
  const [v, w] = pair();
  const P = randMulti(v, w, 3);
  const x = nz(3), y = nz(3);
  const val = P.evaluate({ [v]: x, [w]: y });
  return {
    skill: 'evaluate',
    prompt: `Evaluate $\\;${P.tex()}\\;$ when $${v} = ${x}$ and $${w} = ${y}$.`,
    answer: { type: 'number', value: val },
    hints: ['Substitute both values, using parentheses for negatives. Exponents first, then multiply, then add.'],
    solution: [...P.ordered().map(([c, vars]) => `$${monoStr(c, vars, true)} \\to ${c} ${Object.entries(vars).map(([k, e]) => `\\cdot ${p(k === v ? x : y)}${e > 1 ? `^{${e}}` : ''}`).join(' ')} = ${Poly.mono(c, vars).evaluate({ [v]: x, [w]: y })}$`), `Total: $${val}$`],
  };
}

function degree(): Problem {
  const [v, w] = pair();
  const P = randMulti(v, w, randInt(2, 4));
  const [lc, lv] = P.leading();
  return {
    skill: 'degree',
    prompt: `What is the **degree** of $\\;${P.tex()}$?`,
    answer: { type: 'number', value: P.degree() },
    hints: ['The degree of a term is the **sum** of the exponents of its variables. The degree of the polynomial is the largest term degree.'],
    solution: [...P.ordered().map(([c, vars]) => `$${monoStr(c, vars, true)}$: degree $${Object.values(vars).reduce((a, b) => a + b, 0)}$`), `Highest: $${P.degree()}$ (from $${monoStr(lc, lv, true)}$).`],
  };
}

function collect(): Problem {
  const [v, w] = pair();
  const base = [randTerm(v, w, 2), randTerm(v, w, 2), randTerm(v, w, 2)];
  const pieces: Poly[] = [];
  for (const t of base) {
    const [[c, vars]] = t.ordered();
    const a = nz(9);
    pieces.push(Poly.mono(a, vars), Poly.mono(c - a || 1, vars));
  }
  const mixed = shuffle(pieces);
  const P = mixed.reduce((s, t) => s.add(t), new Poly());
  const tex = mixed.map((t, i) => {
    const s = t.tex();
    return i === 0 ? s : s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
  }).join('');
  return {
    skill: 'collect',
    prompt: `Collect like terms: $\\;${tex}$`,
    answer: ans(P),
    hints: [`Like terms must have the **same variables with the same exponents**: $3${v}^2${w}$ and $-${v}^2${w}$ are like terms; $${v}^2${w}$ and $${v}${w}^2$ are not.`],
    solution: [`$= ${P.tex()}$`],
    placeholder: `e.g. 5${v}^2${w} - 2${v}${w} + 3`,
  };
}

function addSub(): Problem {
  const [v, w] = pair();
  const A = randMulti(v, w, 3);
  const B = randMulti(v, w, 3);
  const sub = Math.random() < 0.6;
  const R = sub ? A.sub(B) : A.add(B);
  return {
    skill: 'addsub',
    prompt: `${sub ? 'Subtract' : 'Add'}: $\\;(${A.tex()}) ${sub ? '-' : '+'} (${B.tex()})$`,
    answer: ans(R),
    hints: [sub ? 'Change the sign of every term in the second polynomial, then collect like terms.' : 'Collect like terms.'],
    solution: [`$= ${R.tex()}$`],
    placeholder: 'e.g. 3xy - y^2',
  };
}

function multiply(): Problem {
  const [v, w] = pair();
  const kind = pick(['binomials', 'square', 'diff', 'mono'] as const);
  let A: Poly, B: Poly, label: string;
  const a = randInt(1, 4), b = nz(5), c = randInt(1, 4), d = nz(5);
  if (kind === 'binomials') {
    A = Poly.mono(a, { [v]: 1 }).add(Poly.mono(b, { [w]: 1 }));
    B = Poly.mono(c, { [v]: 1 }).add(Poly.mono(d, { [w]: 1 }));
    label = `(${A.tex()})(${B.tex()})`;
  } else if (kind === 'square') {
    A = Poly.mono(a, { [v]: 1 }).add(Poly.mono(b, { [w]: 1 }));
    B = A;
    label = `(${A.tex()})^2`;
  } else if (kind === 'diff') {
    A = Poly.mono(a, { [v]: 1 }).add(Poly.mono(Math.abs(b), { [w]: 1 }));
    B = Poly.mono(a, { [v]: 1 }).sub(Poly.mono(Math.abs(b), { [w]: 1 }));
    label = `(${A.tex()})(${B.tex()})`;
  } else {
    A = Poly.mono(nz(5), { [v]: randInt(1, 2), [w]: randInt(1, 2) });
    B = randMulti(v, w, 2);
    label = `${A.tex()}(${B.tex()})`;
  }
  const R = A.mul(B);
  return {
    skill: 'multiply',
    prompt: `Multiply: $\\;${label}$`,
    answer: ans(R),
    hints: [kind === 'square' ? '$(A + B)^2 = A^2 + 2AB + B^2$.' : kind === 'diff' ? '$(A + B)(A - B) = A^2 - B^2$.' : 'Multiply every term by every term, then collect like terms.'],
    solution: [`$= ${R.tex()}$`],
    placeholder: `e.g. 6${v}^2 + ${v}${w} - 2${w}^2`,
  };
}

export const skills: Skill[] = [
  { id: 'evaluate', label: 'Evaluate', generate: evaluate },
  { id: 'degree', label: 'Degree', generate: degree },
  { id: 'collect', label: 'Collect like terms', generate: collect },
  { id: 'addsub', label: 'Add & subtract', generate: addSub },
  { id: 'multiply', label: 'Multiply', generate: multiply },
];

export const masterySet = makeMasterySet(skills);
