// Practice problem generators for Lesson 4.3 — Introduction to Polynomials.
import { monoStr } from '../lib/poly';
import { choice, makeMasterySet, nz, p, pick, Poly, randInt, randPoly, shuffle } from './helpers';
import type { Problem, Skill } from './types';

function evaluate(): Problem {
  const deg = randInt(2, 3);
  const P = randPoly(deg, 'x', 6);
  const x = randInt(-3, 3);
  const val = P.evaluate({ x });
  const subst = P.ordered().map(([c, vars], i) => {
    const e = vars.x ?? 0;
    const body = e === 0 ? String(Math.abs(c)) : `${Math.abs(c) === 1 ? '' : `${Math.abs(c)} \\cdot `}${p(x)}${e > 1 ? `^{${e}}` : ''}`;
    return `${i === 0 ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + '}${body}`;
  }).join('');
  return {
    skill: 'evaluate',
    prompt: `Evaluate $\\;${P.tex()}\\;$ when $x = ${x}$.`,
    answer: { type: 'number', value: val },
    hints: ['Replace every $x$ with the number — in parentheses if it is negative — then follow the order of operations: exponents first.'],
    solution: [`$${subst}$`, `$= ${val}$`],
  };
}

function anatomy(): Problem {
  const deg = randInt(1, 5);
  const nTerms = Math.min(deg + 1, randInt(1, 4));
  // pick nTerms distinct exponents including deg
  const exps = [deg, ...shuffle(Array.from({ length: deg }, (_, i) => i)).slice(0, nTerms - 1)];
  let P = new Poly();
  for (const e of exps) P = P.add(Poly.mono(nz(9), e ? { x: e } : {}));
  // show terms in a scrambled order sometimes
  const ordered = P.ordered();
  const shown = Math.random() < 0.5 ? shuffle(ordered) : ordered;
  const tex = shown.map(([c, v], i) => {
    const s = monoStr(c, v, true);
    return i === 0 ? s : s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
  }).join('');
  const [lc, lv] = P.leading();
  const kind = pick(['degree', 'leading', 'classify'] as const);
  if (kind === 'degree')
    return {
      skill: 'anatomy',
      prompt: `What is the **degree** of the polynomial $\\;${tex}$?`,
      answer: { type: 'number', value: P.degree() },
      hints: ['The degree of a term is its exponent. The degree of the polynomial is the **largest** degree of any term.', 'A constant term like $7$ has degree $0$.'],
      solution: [`The term with the highest exponent is $${monoStr(lc, lv, true)}$, so the degree is $${P.degree()}$.`],
    };
  if (kind === 'leading')
    return {
      skill: 'anatomy',
      prompt: `What is the **leading coefficient** of $\\;${tex}$?`,
      answer: { type: 'number', value: lc },
      hints: ['The **leading term** is the term of highest degree. Its coefficient is the leading coefficient — even if it is not written first!'],
      solution: [`Leading term: $${monoStr(lc, lv, true)}$. Leading coefficient: $${lc}$.`],
      mistakes: [{ answer: String(shown[0][0]), feedback: 'That is the coefficient of the **first written** term. The leading term is the one with the **highest degree**.' }],
    };
  const names = ['Monomial', 'Binomial', 'Trinomial', 'None of these (4 or more terms)'];
  const k = Math.min(P.size, 4) - 1;
  return {
    skill: 'anatomy',
    prompt: `Classify $\\;${tex}\\;$ as a monomial, binomial, or trinomial.`,
    answer: choice(names[k], names.filter((_, i) => i !== k)),
    hints: ['Count the terms: one term → monomial, two → binomial, three → trinomial.'],
    solution: [`It has $${P.size}$ term${P.size > 1 ? 's' : ''}: **${names[k].toLowerCase()}**.`],
  };
}

function collect(): Problem {
  const deg = randInt(2, 4);
  const parts: [number, number][] = [];
  for (let e = deg; e >= 0; e--) if (e === deg || Math.random() < 0.75) parts.push([nz(9), e]);
  // split some terms into two like terms
  const all: [number, number][] = [];
  for (const [c, e] of parts) {
    if (Math.random() < 0.6) { const a = nz(9); all.push([a, e], [c - a === 0 ? 1 : c - a, e]); }
    else all.push([c, e]);
  }
  const mixed = shuffle(all);
  let P = new Poly();
  for (const [c, e] of mixed) P = P.add(Poly.mono(c, e ? { x: e } : {}));
  const tex = mixed.map(([c, e], i) => {
    const s = monoStr(c, e ? { x: e } : {}, true);
    return i === 0 ? s : s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
  }).join('');
  return {
    skill: 'collect',
    prompt: `Collect like terms and write in **descending order**: $\\;${tex}$`,
    answer: { type: 'expression', value: P.text(), maxTerms: Math.max(1, P.size) },
    hints: ['Like terms have the same variable **and the same exponent**: $3x^2$ and $-5x^2$ are like terms, $3x^2$ and $3x$ are not.', 'Descending order: highest exponent first.'],
    solution: [`$${P.tex()}$`],
    placeholder: 'e.g. 4x^3 - 2x + 7',
  };
}

function apply(): Problem {
  const t = pick([
    () => {
      const v0 = pick([10, 15, 20, 25]);
      const h0 = pick([1, 2, 5, 10]);
      const tt = randInt(1, 3);
      const h = -5 * tt * tt + v0 * tt + h0;
      return { prompt: `A ball is thrown upward. Its height in meters after $t$ seconds is approximately $h = -5t^2 + ${v0}t + ${h0}$. Find the height after $${tt}$ s.`, value: h, sol: [`$h = -5(${tt})^2 + ${v0}(${tt}) + ${h0}$`, `$= ${-5 * tt * tt} + ${v0 * tt} + ${h0} = ${h}$ m`] };
    },
    () => {
      const n = randInt(4, 12);
      return { prompt: `The number of handshakes when $n$ people each shake hands once with everyone else is $\\tfrac{1}{2}n^2 - \\tfrac{1}{2}n$. How many handshakes are there among $${n}$ people?`, value: (n * n - n) / 2, sol: [`$\\tfrac{1}{2}(${n})^2 - \\tfrac{1}{2}(${n}) = ${n * n / 2} - ${n / 2} = ${(n * n - n) / 2}$`] };
    },
    () => {
      const x = randInt(5, 20);
      return { prompt: `A company's profit (in thousands of riyals) from selling $x$ hundred units is $P = -x^2 + 30x - 50$. Find the profit when $x = ${x}$.`, value: -x * x + 30 * x - 50, sol: [`$P = -(${x})^2 + 30(${x}) - 50 = ${-x * x} + ${30 * x} - 50 = ${-x * x + 30 * x - 50}$`] };
    },
  ])();
  return { skill: 'apply', prompt: t.prompt, answer: { type: 'number', value: t.value }, hints: ['Substitute, then use the order of operations — exponents before multiplication.'], solution: t.sol };
}

export const skills: Skill[] = [
  { id: 'evaluate', label: 'Evaluate', generate: evaluate },
  { id: 'anatomy', label: 'Degree & terms', generate: anatomy },
  { id: 'collect', label: 'Collect & order', generate: collect },
  { id: 'apply', label: 'Polynomial models', generate: apply },
];

export const masterySet = makeMasterySet(skills);
