// Practice problem generators for Lesson 1.8 — Simplifying Expressions; Order of Operations.
import { toTex, parse } from '../lib/expr';
import { makeMasterySet, nz, orderSteps, p, pick, randInt, value } from './helpers';
import type { Problem, Skill } from './types';

const term = (c: number, v = '') => (v ? (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`) : String(c));
function sum(parts: string[]): string {
  const out = parts
    .filter((t) => t !== '0' && t !== '' && !/^0[a-z]/.test(t))
    .map((t, i) => (i === 0 ? t : t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t}`))
    .join('');
  return out || '0';
}
const tex = (src: string) => toTex(parse(src));

function oppositeOfSum(): Problem {
  const k = randInt(2, 3);
  const vars = ['x', 'y', 'z'].slice(0, k);
  const parts = [...vars.map((v) => term(nz(9), v)), String(nz(12))];
  const inside = sum(parts);
  const result = sum(parts.map((t) => (t.startsWith('-') ? t.slice(1) : `-${t}`)));
  return {
    skill: 'opposite',
    prompt: `Remove the parentheses: $\\;-(${inside})$`,
    answer: { type: 'expression', value: result, maxTerms: parts.length },
    hints: ['The opposite of a sum is the sum of the opposites: change the sign of **every** term inside.'],
    solution: [`$-(${inside}) = ${result}$ — every sign changes.`],
    mistakes: [
      { answer: sum([parts[0].startsWith('-') ? parts[0].slice(1) : `-${parts[0]}`, ...parts.slice(1)]), feedback: 'You changed only the first sign. The minus sign in front changes the sign of **every** term.' },
    ],
    placeholder: 'e.g. -3x + 2y - 5',
  };
}

function removeAndCollect(): Problem {
  const v = pick(['x', 'y', 'a']);
  const kind = pick(['minus', 'two'] as const);
  if (kind === 'minus') {
    const a = randInt(2, 12);
    const b = randInt(1, 9);
    const c = nz(12);
    const d = randInt(1, 15);
    const src = `${term(a, v)} ${d >= 0 ? '+' : '-'} ${Math.abs(d)} - (${sum([term(b, v), String(c)])})`;
    const res = sum([term(a - b, v), String(d - c)]);
    return {
      skill: 'collect',
      prompt: `Simplify: $\\;${tex(src)}$`,
      answer: { type: 'expression', value: res, maxTerms: 2 },
      hints: ['First remove the parentheses: the minus sign in front changes the sign of every term inside.', 'Then collect like terms.'],
      solution: [`$= ${sum([term(a, v), String(d), term(-b, v), String(-c)])}$ — remove parentheses, changing signs`, `$= ${res}$ — collect like terms`],
      mistakes: [{ answer: sum([term(a - b, v), String(d + c)]), feedback: 'Did you change the sign of the **last** term inside the parentheses too?' }],
      placeholder: `e.g. 4${v} - 3`,
    };
  }
  const a = randInt(2, 6);
  const b = nz(7);
  const c = randInt(2, 6);
  const d = nz(7);
  const src = `${a}(${v} ${b < 0 ? '-' : '+'} ${Math.abs(b)}) - ${c}(${v} ${d < 0 ? '-' : '+'} ${Math.abs(d)})`;
  const res = sum([term(a - c, v), String(a * b - c * d)]);
  return {
    skill: 'collect',
    prompt: `Simplify: $\\;${tex(src)}$`,
    answer: { type: 'expression', value: res, maxTerms: 2 },
    hints: [`Distribute $${a}$ over the first parentheses and $-${c}$ over the second.`, 'Then collect like terms.'],
    solution: [
      `$= ${sum([term(a, v), String(a * b), term(-c, v), String(-c * d)])}$ — distribute $${a}$ and $-${c}$`,
      `$= ${res}$ — collect like terms`,
    ],
    mistakes: [{ answer: sum([term(a - c, v), String(a * b + c * d)]), feedback: `Distribute the **negative** $-${c}$: it changes the sign of both terms in the second parentheses.` }],
    placeholder: `e.g. 2${v} + 11`,
  };
}

/** Random numeric expression templates whose value is an integer. */
function orderExpression(): string {
  for (;;) {
    const a = randInt(2, 12), b = randInt(2, 9), c = randInt(2, 9), d = nz(9);
    const src = pick([
      `${a} + ${b} * ${c}`,
      `${a * b} / ${b} * ${c}`,
      `${a} - ${b} * ${p(d)}`,
      `${c} * ${b} - ${a * 2} / 2`,
      `${a} - ${b}^2`,
      `(${a} - ${b})^2`,
      `${b * c} / ${p(-c)} + ${a}`,
      `${a} + ${b}(${c} - ${randInt(1, 12)})`,
      `${2 * b} - ${b}^2 / ${b}`,
      `-${b}^2 + ${p(d)} * ${c}`,
      `${a} * ${p(d)} - (${c} - ${b})`,
    ]);
    const v = value(src);
    if (Number.isInteger(v) && Math.abs(v) < 500) return src;
  }
}

function orderOfOperations(): Problem {
  const src = orderExpression();
  const v = value(src);
  return {
    skill: 'order',
    prompt: `Simplify: $\\;${tex(src)}$`,
    answer: { type: 'number', value: v },
    hints: ['1. Grouping symbols  2. Exponents  3. Multiply & divide, left to right  4. Add & subtract, left to right.'],
    solution: orderSteps(src),
  };
}

function exponents(): Problem {
  const kind = pick(['pos', 'negParen', 'negNoParen', 'notation'] as const);
  if (kind === 'notation') {
    const v = pick(['x', 'y', 'a', '5', '3']);
    const n = randInt(3, 6);
    const isNum = /\d/.test(v);
    return {
      skill: 'exponents',
      prompt: `Write in exponential notation: $\\;${Array(n).fill(v).join(' \\cdot ')}$`,
      answer: { type: 'expression', value: `${v}^${n}` },
      hints: ['Count how many times the factor appears. That count is the exponent.'],
      solution: [`The factor $${v}$ appears $${n}$ times, so it is $${v}^{${n}}$.${isNum ? ` (Its value is $${Number(v) ** n}$.)` : ''}`],
      placeholder: 'e.g. x^4',
    };
  }
  const b = randInt(2, 5);
  const n = b > 3 ? randInt(2, 3) : randInt(2, 4);
  if (kind === 'pos') {
    return {
      skill: 'exponents',
      prompt: `Evaluate: $\\;${b}^{${n}}$`,
      answer: { type: 'number', value: b ** n },
      hints: [`$${b}^{${n}}$ means $${Array(n).fill(b).join(' \\cdot ')}$ — not $${b} \\cdot ${n}$.`],
      solution: [`$${b}^{${n}} = ${Array(n).fill(b).join(' \\cdot ')} = ${b ** n}$`],
      mistakes: [{ answer: String(b * n), feedback: `The exponent tells how many times to **multiply** $${b}$ by itself, not to multiply by $${n}$.` }],
    };
  }
  if (kind === 'negParen') {
    const v = (-b) ** n;
    return {
      skill: 'exponents',
      prompt: `Evaluate: $\\;(-${b})^{${n}}$`,
      answer: { type: 'number', value: v },
      hints: [`The base is $-${b}$ (in parentheses), so multiply $-${b}$ by itself $${n}$ times.`, 'An even number of negative factors is positive; odd is negative.'],
      solution: [`$(-${b})^{${n}} = ${Array(n).fill(`(-${b})`).join(' \\cdot ')} = ${v}$`],
      mistakes: [{ answer: String(-v), feedback: `Count the negative factors: there are $${n}$, which is ${n % 2 ? 'odd → negative' : 'even → positive'}.` }],
    };
  }
  const v = -(b ** n);
  return {
    skill: 'exponents',
    prompt: `Evaluate: $\\;-${b}^{${n}}$`,
    answer: { type: 'number', value: v },
    hints: [`Without parentheses, the exponent applies only to $${b}$. Find $${b}^{${n}}$ first, then take the opposite.`],
    solution: [`$-${b}^{${n}} = -(${Array(n).fill(b).join(' \\cdot ')}) = ${v}$`],
    mistakes: n % 2 === 0 ? [{ answer: String(-v), feedback: `That would be $(-${b})^{${n}}$. Here the exponent applies only to $${b}$, so the answer is negative.` }] : [],
  };
}

function grouping(): Problem {
  for (;;) {
    const a = randInt(2, 9), b = randInt(2, 9), c = randInt(1, 9), d = randInt(2, 5), e = nz(9);
    const src = pick([
      `${a}[${b} + (${c} - ${d * 3})]`,
      `[${a * d} - (${b} + ${c})] / ${d}`,
      `${a} - [${b} - (${c} - ${d})]`,
      `{${a} + [${b} * (${c} - ${d})]} - ${e}`,
      `${d}{${a} - [${b} - ${c}]}`,
      `[(${a} + ${b}) * 2 - ${c}] + ${p(e)}`,
    ]);
    const v = value(src);
    if (Number.isInteger(v) && Math.abs(v) < 400) {
      return {
        skill: 'grouping',
        prompt: `Simplify: $\\;${tex(src)}$`,
        answer: { type: 'number', value: v },
        hints: ['Work from the **innermost** grouping symbols outward: ( ) first, then [ ], then { }.'],
        solution: orderSteps(src),
      };
    }
  }
}

export const skills: Skill[] = [
  { id: 'opposite', label: 'Opposite of a sum', generate: oppositeOfSum },
  { id: 'collect', label: 'Remove ( ) & collect', generate: removeAndCollect },
  { id: 'exponents', label: 'Exponents', generate: exponents },
  { id: 'order', label: 'Order of operations', generate: orderOfOperations },
  { id: 'grouping', label: 'Nested grouping', generate: grouping },
];

export const masterySet = makeMasterySet(skills);
