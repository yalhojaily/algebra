// Practice problem generators for Lesson 1.5 — Multiplication of Real Numbers.
import { coprimeTo, fmt, fracTex, makeMasterySet, nz, p, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const signRule = (a: number, b: number) =>
  Math.sign(a) === Math.sign(b)
    ? 'Same signs → the product is **positive**.'
    : 'Different signs → the product is **negative**.';

function mulIntegers(): Problem {
  const a = nz(12);
  const b = Math.random() < 0.08 ? 0 : nz(12);
  const prod = a * b;
  return {
    skill: 'integers',
    prompt: `Multiply: $\\;${a} \\cdot ${p(b)}$`,
    answer: { type: 'number', value: prod },
    hints: ['Multiply the absolute values. Then decide the sign: same signs give a positive product; different signs give a negative product.'],
    solution:
      b === 0
        ? ['Any number times $0$ is $0$.']
        : [`$${Math.abs(a)} \\cdot ${Math.abs(b)} = ${Math.abs(prod)}$`, `${signRule(a, b)} So $${a} \\cdot ${p(b)} = ${prod}$.`],
    mistakes: prod !== 0 ? [{ answer: String(-prod), feedback: 'The size is right but the sign is wrong. ' + signRule(a, b) }] : [],
  };
}

function mulRational(): Problem {
  if (Math.random() < 0.5) {
    const a = nz(9) / 10 * pick([1, 10]);
    const b = nz(9) * pick([1, 0.1]);
    const A = +a.toFixed(1);
    const B = +b.toFixed(1);
    const prod = +(A * B).toFixed(4);
    return {
      skill: 'rational',
      prompt: `Multiply: $\\;${A} \\cdot ${p(B)}$`,
      answer: { type: 'number', value: prod },
      hints: ['Multiply as if there were no decimal points or signs, then place the decimal point and choose the sign.'],
      solution: [`$${fmt(Math.abs(A))} \\cdot ${fmt(Math.abs(B))} = ${fmt(Math.abs(prod))}$`, `${signRule(A, B)} So the product is $${fmt(prod)}$.`],
    };
  }
  const d1 = pick([2, 3, 4, 5, 7]);
  const d2 = pick([2, 3, 4, 5, 9]);
  const n1 = coprimeTo(d1, d1 * 2);
  const n2 = coprimeTo(d2, d2 * 2);
  return {
    skill: 'rational',
    prompt: `Multiply: $\\;${fracTex(n1, d1)} \\cdot ${p(fracTex(n2, d2))}$. (A fraction is fine.)`,
    answer: { type: 'number', value: (n1 * n2) / (d1 * d2) },
    hints: ['Multiply the numerators and multiply the denominators. Then simplify and choose the sign.'],
    solution: [
      `$\\dfrac{${Math.abs(n1)} \\cdot ${Math.abs(n2)}}{${d1} \\cdot ${d2}} = \\dfrac{${Math.abs(n1 * n2)}}{${d1 * d2}}$`,
      `${signRule(n1, n2)} So the product is $${fracTex(n1 * n2, d1 * d2)}$.`,
    ],
    placeholder: 'e.g. -6/35',
  };
}

function many(): Problem {
  const k = randInt(3, 5);
  const xs = Array.from({ length: k }, () => nz(k > 3 ? 4 : 6));
  if (Math.random() < 0.1) xs[randInt(0, k - 1)] = 0;
  const prod = xs.reduce((a, b) => a * b, 1);
  const negs = xs.filter((x) => x < 0).length;
  const hasZero = xs.includes(0);
  return {
    skill: 'many',
    prompt: `Multiply: $\\;${xs.map((x, i) => (i ? p(x) : String(x))).join(' \\cdot ')}$`,
    answer: { type: 'number', value: prod },
    hints: ['Count the negative factors. An **even** number of negatives gives a positive product; an **odd** number gives a negative product.'],
    solution: hasZero
      ? ['One of the factors is $0$, so the whole product is $0$.']
      : [
          `There ${negs === 1 ? 'is $1$ negative factor' : `are $${negs}$ negative factors`} — ${negs % 2 === 0 ? 'even, so the product is **positive**' : 'odd, so the product is **negative**'}.`,
          `Multiply the absolute values: $${xs.map((x) => Math.abs(x)).join(' \\cdot ')} = ${Math.abs(prod)}$.`,
          `So the product is $${prod}$.`,
        ],
    mistakes: prod !== 0 ? [{ answer: String(-prod), feedback: `Count the negative factors again: there are ${negs}.` }] : [],
  };
}

function signOnly(): Problem {
  const negs = randInt(1, 8);
  const pos = randInt(0, 4);
  const even = negs % 2 === 0;
  return {
    skill: 'sign',
    prompt: `A product has $${negs}$ negative factor${negs > 1 ? 's' : ''} and $${pos}$ positive factor${pos === 1 ? '' : 's'} (none of them zero). Is the product positive or negative?`,
    answer: { type: 'choice', options: ['Positive', 'Negative'], correct: even ? 0 : 1 },
    hints: ['Each pair of negative factors makes a positive. What is left over?'],
    solution: [`$${negs}$ is ${even ? 'even, so the negatives pair up and the product is **positive**' : 'odd, so one negative is left over and the product is **negative**'}. Positive factors never change the sign.`],
  };
}

function applications(): Problem {
  const t = pick([
    () => {
      const rate = randInt(2, 6);
      const hours = randInt(3, 8);
      return {
        prompt: `After sunset, the temperature in the desert drops $${rate}^\\circ$C every hour. What is the total change in temperature after $${hours}$ hours? (A drop is negative.)`,
        value: -rate * hours,
        sol: [`Each hour is a change of $-${rate}$. Over $${hours}$ hours: $${hours} \\cdot (-${rate}) = ${-rate * hours}$ degrees.`],
      };
    },
    () => {
      const loss = randInt(2, 9);
      const shares = randInt(10, 60);
      return {
        prompt: `A stock lost $${loss}$ riyals per share. You own $${shares}$ shares. What was the total change in the value of your shares?`,
        value: -loss * shares,
        sol: [`$${shares} \\cdot (-${loss}) = ${-loss * shares}$ riyals`],
      };
    },
    () => {
      const drop = randInt(2, 8);
      const min = randInt(3, 12);
      return {
        prompt: `A diver descends at a rate of $${drop}$ m per minute. Where is the diver, relative to the surface, after $${min}$ minutes? (Below the surface is negative.)`,
        value: -drop * min,
        sol: [`$${min} \\cdot (-${drop}) = ${-drop * min}$ m`],
      };
    },
  ])();
  return {
    skill: 'apply',
    prompt: t.prompt,
    answer: { type: 'number', value: t.value },
    hints: ['Repeated change = (number of times) × (change each time). A decrease is a negative change.'],
    solution: t.sol,
  };
}

export const skills: Skill[] = [
  { id: 'integers', label: 'Multiply integers', generate: mulIntegers },
  { id: 'rational', label: 'Decimals & fractions', generate: mulRational },
  { id: 'many', label: 'Several factors', generate: many },
  { id: 'sign', label: 'Predict the sign', generate: signOnly },
  { id: 'apply', label: 'Word problems', generate: applications },
];

export const masterySet = makeMasterySet(skills);
