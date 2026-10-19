// Practice problem generators for Lesson 1.7 — Properties of Real Numbers.
import { choice, gcd, makeMasterySet, nz, p, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const PROPS = [
  'Commutative law of addition',
  'Commutative law of multiplication',
  'Associative law of addition',
  'Associative law of multiplication',
  'Distributive law',
  'Identity property of 0',
  'Identity property of 1',
] as const;

/** A term like 3x, -x, 5 written for both display and input. */
const term = (c: number, v = '') => (v ? (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`) : String(c));

/** Join terms into a sum: [3x, -2, 5y] → "3x - 2 + 5y" */
function sum(parts: string[]): string {
  return parts
    .filter((t) => t !== '0' && t !== '')
    .map((t, i) => (i === 0 ? t : t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t}`))
    .join('');
}

function identifyProperty(): Problem {
  const [x, y, z] = pick([['a', 'b', 'c'], ['x', 'y', 'z'], ['m', 'n', 'p']]);
  const k = randInt(2, 9);
  const examples: [string, number][] = [
    [`${x} + ${y} = ${y} + ${x}`, 0],
    [`${k} + ${x} = ${x} + ${k}`, 0],
    [`${x}${y} = ${y}${x}`, 1],
    [`${k} \\cdot ${x} = ${x} \\cdot ${k}`, 1],
    [`(${x} + ${y}) + ${z} = ${x} + (${y} + ${z})`, 2],
    [`(${x} + ${k}) + ${y} = ${x} + (${k} + ${y})`, 2],
    [`(${x}${y})${z} = ${x}(${y}${z})`, 3],
    [`${k}(${x}${y}) = (${k}${x})${y}`, 3],
    [`${x}(${y} + ${z}) = ${x}${y} + ${x}${z}`, 4],
    [`${k}(${x} - ${y}) = ${k}${x} - ${k}${y}`, 4],
    [`${x} + 0 = ${x}`, 5],
    [`${x} \\cdot 1 = ${x}`, 6],
    [`\\dfrac{${x}}{${y}} \\cdot \\dfrac{${k}}{${k}} = \\dfrac{${k}${x}}{${k}${y}}`, 6],
  ];
  const [tex, idx] = pick(examples);
  const wrong = PROPS.filter((_, i) => i !== idx);
  // Offer the most confusable options.
  const near = wrong.filter((w) => w.split(' ').slice(-1)[0] === PROPS[idx].split(' ').slice(-1)[0] || w.startsWith(PROPS[idx].split(' ')[0]));
  const pool = [...near, ...wrong.filter((w) => !near.includes(w))].slice(0, 3);
  return {
    skill: 'property',
    prompt: `Which property does this illustrate? $\\;${tex}$`,
    answer: choice(PROPS[idx], pool),
    hints: [
      '**Commutative** = the **order** changes. **Associative** = the **grouping** (parentheses) changes, order stays.',
      '**Distributive** = multiplying a sum or difference. **Identity** = adding $0$ or multiplying by $1$ leaves the number unchanged.',
    ],
    solution: [`This is the **${PROPS[idx]}**.`],
  };
}

function distribute(): Problem {
  const a = nz(9, 2);
  const v = pick(['x', 'y', 't', 'a']);
  const b = randInt(1, 6);
  const c = nz(12);
  const second = pick([true, false]);
  const inside = second ? sum([term(b, v), String(c)]) : sum([String(Math.abs(c)), term(c < 0 ? -b : b, v)]);
  const t1 = second ? a * b : a * Math.abs(c);
  const t2 = second ? a * c : a * (c < 0 ? -b : b);
  const result = second ? sum([term(t1, v), String(t2)]) : sum([String(t1), term(t2, v)]);
  return {
    skill: 'distribute',
    prompt: `Multiply (use the distributive law): $\\;${a}(${inside})$`,
    answer: { type: 'expression', value: result, maxTerms: 2 },
    hints: [`Multiply $${a}$ by **each** term inside the parentheses.`, a < 0 ? 'Be careful: the negative sign multiplies both terms.' : 'Then write the two products with the right signs.'],
    solution: [`$${a}(${inside}) = ${a} \\cdot ${p(second ? term(b, v) : String(Math.abs(c)))} + ${p(a)} \\cdot ${p(second ? String(c) : term(c < 0 ? -b : b, v))}$`, `$= ${result}$`],
    mistakes: [
      { answer: second ? sum([term(t1, v), String(c)]) : sum([String(t1), term(c < 0 ? -b : b, v)]), feedback: `You multiplied only the first term. $${a}$ must multiply **both** terms.` },
    ],
    placeholder: `e.g. 6${v} - 15`,
  };
}

function factor(): Problem {
  const g = randInt(2, 9);
  const v = pick(['x', 'y', 'a', 'n']);
  let b = randInt(1, 7);
  let c = randInt(1, 9);
  while (gcd(b, c) !== 1) c = randInt(1, 9);
  const sign = pick(['+', '-']);
  const three = Math.random() < 0.3;
  const d = three ? randInt(1, 6) : 0;
  const w = pick(['y', 'z', 'w'].filter((z) => z !== v));
  const coefs = three ? [b, sign === '-' ? -c : c, d] : [b, sign === '-' ? -c : c];
  if (three && gcd(gcd(b, c), d) !== 1) b = 1;
  const innerParts = three ? [term(b, v), term(coefs[1], w), String(d)] : [term(b, v), String(coefs[1])];
  const outerParts = three ? [term(g * b, v), term(g * coefs[1], w), String(g * d)] : [term(g * b, v), String(g * coefs[1])];
  const inner = sum(innerParts);
  const outer = sum(outerParts);
  return {
    skill: 'factor',
    prompt: `Factor: $\\;${outer}$`,
    answer: { type: 'expression', value: `${g}(${inner})`, factor: String(g) },
    hints: [`Find the largest number that divides every term: ${outerParts.map((t) => `$${t}$`).join(', ')}.`, `It is $${g}$. Write $${g}(\\;\\ldots\\;)$ and divide each term by $${g}$.`],
    solution: [`The greatest common factor is $${g}$.`, `$${outer} = ${g} \\cdot ${p(innerParts[0])} ${innerParts.slice(1).map((t) => (t.startsWith('-') ? `- ${g} \\cdot ${t.slice(1)}` : `+ ${g} \\cdot ${t}`)).join(' ')}$`, `$= ${g}(${inner})$`, `Check by multiplying back: $${g}(${inner}) = ${outer}$ ✓`],
    placeholder: `e.g. 4(2${v} + 3)`,
  };
}

function likeTerms(): Problem {
  const v = pick(['x', 'y', 'a']);
  const w = pick(['y', 'b', 'z'].filter((z) => z !== v));
  const two = Math.random() < 0.4;
  const parts: { c: number; t: string }[] = [
    { c: nz(9), t: v },
    { c: nz(12), t: '' },
    { c: nz(9), t: v },
    ...(two ? [{ c: nz(9), t: w }, { c: nz(9), t: w }] : [{ c: nz(12), t: '' }]),
  ];
  // shuffle order but keep the first term a variable term for readability
  const order = [parts[0], ...parts.slice(1).sort(() => Math.random() - 0.5)];
  const shown = sum(order.map((x) => term(x.c, x.t)));
  const groups = new Map<string, number>();
  for (const x of order) groups.set(x.t, (groups.get(x.t) ?? 0) + x.c);
  const result = sum([...groups.entries()].sort((a, b) => (a[0] === '' ? 1 : b[0] === '' ? -1 : 0)).map(([t, c]) => (c === 0 ? '0' : term(c, t))));
  const finalExpr = result || '0';
  const nonZero = [...groups.values()].filter((c) => c !== 0).length;
  return {
    skill: 'like',
    prompt: `Collect like terms: $\\;${shown}$`,
    answer: { type: 'expression', value: finalExpr, maxTerms: Math.max(1, nonZero) },
    hints: ['**Like terms** have exactly the same variable part. Constants are like terms with each other.', 'Add the coefficients of each group of like terms. Remember $x$ means $1x$.'],
    solution: [...groups.entries()].map(([t, c]) => {
      const items = order.filter((x) => x.t === t).map((x) => term(x.c, x.t));
      return `${t ? `$${t}$-terms` : 'Constants'}: $${sum(items)} = ${term(c, t) === '0' || c === 0 ? '0' : term(c, t)}$`;
    }).concat([`Result: $${finalExpr}$`]),
    placeholder: `e.g. 3${v} - 7`,
  };
}

export const skills: Skill[] = [
  { id: 'property', label: 'Name the property', generate: identifyProperty },
  { id: 'distribute', label: 'Distribute', generate: distribute },
  { id: 'factor', label: 'Factor', generate: factor },
  { id: 'like', label: 'Collect like terms', generate: likeTerms },
];

export const masterySet = makeMasterySet(skills);
