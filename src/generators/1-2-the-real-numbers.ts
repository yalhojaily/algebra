// Practice problem generators for Lesson 1.2 — The Real Numbers.
import { pick, randInt, shuffle } from '../lib/random';
import type { Problem, Skill } from './types';

const SETS = [
  'Natural number',
  'Whole number (but not natural)',
  'Integer (but not whole)',
  'Rational (but not an integer)',
  'Irrational',
] as const;

// ---------------------------------------------------------------------------
// Skill 1: Integers in real situations
// ---------------------------------------------------------------------------

function contextProblem(): Problem {
  const n = randInt(3, 40);
  const t = pick([
    { text: `The temperature is **${n}° below zero**.`, value: -n },
    { text: `A diver is **${n} m below** sea level.`, value: -n },
    { text: `A store **lost ${n * 100} riyals** this month.`, value: -n * 100 },
    { text: `A plane climbs to **${n * 100} m above** sea level.`, value: n * 100 },
    { text: `Your account has a **deposit of ${n * 10} riyals**.`, value: n * 10 },
    { text: `A football team **lost ${n} yards** on a play.`, value: -n },
    { text: `The stock price **rose ${n} riyals** today.`, value: n },
  ]);
  const neg = t.value < 0;
  return {
    skill: 'context',
    prompt: `Write an integer for the situation: ${t.text}`,
    answer: { type: 'number', value: t.value },
    hints: ['Words like *below*, *lost*, *fell*, *owe*, and *withdraw* usually mean a **negative** number. Words like *above*, *gained*, *rose*, and *deposit* mean **positive**.'],
    solution: [neg ? `This is a decrease or a position below zero, so the integer is negative: $${t.value}$.` : `This is an increase or a position above zero, so the integer is positive: $${t.value}$.`],
    mistakes: [{ answer: String(-t.value), feedback: neg ? 'Check the sign: "below" or "lost" means the number is **negative**.' : 'Check the sign: this situation is above zero or a gain, so it is **positive**.' }],
  };
}

// ---------------------------------------------------------------------------
// Skill 2: Classify a number into the smallest set it belongs to
// ---------------------------------------------------------------------------

interface Classified { tex: string; set: number; why: string }

/** A decimal like 2.25 or -0.4 that is not an integer. */
function terminatingDecimal(sign: string): Classified {
  let v: number;
  do v = randInt(1, 999) / pick([4, 10, 100]);
  while (Number.isInteger(v));
  return { tex: `${sign}${v}`, set: 3, why: 'A terminating decimal can be written as a fraction, so it is rational.' };
}

function randomNumberToClassify(): Classified {
  const kind = randInt(0, 4);
  if (kind === 0) {
    const n = randInt(1, 99);
    return pick([
      { tex: `${n}`, set: 0, why: `$${n}$ is a counting number: $1, 2, 3, \\dots$` },
      { tex: `\\sqrt{${n * n}}`, set: 0, why: `$\\sqrt{${n * n}} = ${n}$, a counting number.` },
      { tex: `\\dfrac{${n * 3}}{3}`, set: 0, why: `$\\dfrac{${n * 3}}{3} = ${n}$, a counting number.` },
    ]);
  }
  if (kind === 1) return { tex: '0', set: 1, why: '$0$ is a whole number, but counting starts at $1$, so it is not natural.' };
  if (kind === 2) {
    const n = randInt(1, 60);
    return pick([
      { tex: `-${n}`, set: 2, why: `$-${n}$ is a negative whole number — an integer, but not a whole number.` },
      { tex: `-\\sqrt{${n * n}}`, set: 2, why: `$-\\sqrt{${n * n}} = -${n}$, a negative integer.` },
    ]);
  }
  if (kind === 3) {
    const d = pick([2, 3, 4, 5, 7, 8, 9]);
    let nu = randInt(1, 3 * d);
    while (nu % d === 0) nu++;
    const sign = pick(['', '-']);
    return pick([
      { tex: `${sign}\\dfrac{${nu}}{${d}}`, set: 3, why: `It is a ratio of two integers, and it does not simplify to an integer.` },
      terminatingDecimal(sign),
      { tex: `0.\\overline{${randInt(1, 9)}}`, set: 3, why: 'A repeating decimal can be written as a fraction, so it is rational.' },
    ]);
  }
  const notSquare = pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 19, 20]);
  return pick([
    { tex: `\\sqrt{${notSquare}}`, set: 4, why: `$${notSquare}$ is not a perfect square, so $\\sqrt{${notSquare}}$ is a non-terminating, non-repeating decimal.` },
    { tex: '\\pi', set: 4, why: '$\\pi \\approx 3.14159\\dots$ never ends and never repeats.' },
    { tex: `-\\sqrt{${notSquare}}`, set: 4, why: `$\\sqrt{${notSquare}}$ is irrational, and so is its opposite.` },
    { tex: '1.010010001\\dots', set: 4, why: 'The pattern keeps changing (one more 0 each time), so the digits never repeat in a fixed block.' },
  ]);
}

function classifyProblem(): Problem {
  const c = randomNumberToClassify();
  return {
    skill: 'classify',
    prompt: `What is the **most specific** set that $${c.tex}$ belongs to?`,
    answer: { type: 'choice', options: [...SETS], correct: c.set },
    hints: [
      'First simplify the number if you can (for example, $\\sqrt{25} = 5$).',
      'Ask in order: Is it a counting number? Zero? A negative integer? A fraction or a decimal that ends or repeats? Otherwise it is irrational.',
    ],
    solution: [c.why, `So the answer is: **${SETS[c.set]}**.`],
  };
}

// ---------------------------------------------------------------------------
// Skill 3: Order — insert < or > and judge inequalities
// ---------------------------------------------------------------------------

interface Num { tex: string; value: number }

function randomNum(): Num {
  const k = randInt(0, 3);
  if (k === 0) {
    const n = randInt(-20, 20);
    return { tex: String(n), value: n };
  }
  if (k === 1) {
    const n = randInt(-99, 99) / 10;
    return { tex: String(n), value: n };
  }
  if (k === 2) {
    const d = pick([2, 3, 4, 5, 8]);
    const nu = randInt(-3 * d, 3 * d);
    if (nu % d === 0) return { tex: String(nu / d), value: nu / d };
    return { tex: `${nu < 0 ? '-' : ''}\\frac{${Math.abs(nu)}}{${d}}`, value: nu / d };
  }
  const n = -randInt(1, 15);
  return { tex: String(n), value: n };
}

function compareProblem(): Problem {
  let a = randomNum();
  let b = randomNum();
  while (a.value === b.value) b = randomNum();
  // Favor the tricky case: both negative.
  if (Math.random() < 0.35) {
    const x = randInt(1, 30);
    const y = x + randInt(1, 15);
    [a, b] = shuffle([{ tex: `-${x}`, value: -x }, { tex: `-${y}`, value: -y }]) as [Num, Num];
  }

  if (Math.random() < 0.3) {
    // True / false version
    const sym = pick(['<', '>', '\\le', '\\ge']);
    const truth =
      sym === '<' ? a.value < b.value : sym === '>' ? a.value > b.value : sym === '\\le' ? a.value <= b.value : a.value >= b.value;
    const desc = a.value < b.value ? `$${a.tex}$ is to the **left** of $${b.tex}$, so $${a.tex} < ${b.tex}$.` : `$${a.tex}$ is to the **right** of $${b.tex}$, so $${a.tex} > ${b.tex}$.`;
    return {
      skill: 'compare',
      prompt: `True or false: $\\;${a.tex} ${sym} ${b.tex}$`,
      answer: { type: 'choice', options: ['True', 'False'], correct: truth ? 0 : 1 },
      hints: ['Picture both numbers on a number line. The number farther **right** is the greater one.'],
      solution: [desc, `So $${a.tex} ${sym} ${b.tex}$ is **${truth ? 'true' : 'false'}**.`],
    };
  }

  const less = a.value < b.value;
  const negPair = a.value < 0 && b.value < 0;
  return {
    skill: 'compare',
    prompt: `Use $<$ or $>$ to make a true sentence: $\\;${a.tex} \\;\\square\\; ${b.tex}$`,
    answer: { type: 'choice', options: ['$<$  (less than)', '$>$  (greater than)'], correct: less ? 0 : 1 },
    hints: [
      'On a number line, numbers get **greater** as you move **right**.',
      ...(negPair ? ['Both numbers are negative. The one **closer to zero** is greater — for example, $-2 > -9$.'] : []),
    ],
    solution: [
      less ? `$${a.tex}$ is to the left of $${b.tex}$ on the number line.` : `$${a.tex}$ is to the right of $${b.tex}$ on the number line.`,
      `$${a.tex} ${less ? '<' : '>'} ${b.tex}$`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Skill 4: Fractions to decimals
// ---------------------------------------------------------------------------

function decimalProblem(): Problem {
  if (Math.random() < 0.3) {
    // Will it terminate or repeat?
    const d = pick([3, 6, 7, 9, 11, 12, 15, 4, 8, 16, 20, 25, 40]);
    let n = randInt(1, d - 1);
    const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
    while (g(n, d) !== 1) n = randInt(1, d - 1);
    let r = d;
    while (r % 2 === 0) r /= 2;
    while (r % 5 === 0) r /= 5;
    const terminates = r === 1;
    const factors = (x: number) => {
      const f: number[] = [];
      let k = x;
      for (let p = 2; p <= k; p++) while (k % p === 0) { f.push(p); k /= p; }
      return f.join(' \\cdot ');
    };
    return {
      skill: 'decimal',
      prompt: `Without dividing: does $\\dfrac{${n}}{${d}}$ have a terminating or a repeating decimal?`,
      answer: { type: 'choice', options: ['Terminating', 'Repeating'], correct: terminates ? 0 : 1 },
      hints: ['Factor the denominator (after the fraction is simplified). If its only prime factors are $2$ and $5$, the decimal terminates.'],
      solution: [
        `$${d} = ${factors(d)}$`,
        terminates
          ? 'The only prime factors are $2$ and $5$, so the decimal **terminates**: ' + `$\\dfrac{${n}}{${d}} = ${+(n / d).toFixed(6)}$.`
          : `There is a prime factor other than $2$ or $5$, so the decimal **repeats**: $\\dfrac{${n}}{${d}} = ${(n / d).toFixed(6)}\\dots$`,
      ],
    };
  }

  const d = pick([2, 4, 5, 8, 10, 16, 20, 25, 40]);
  let n = randInt(1, 2 * d);
  while (n % d === 0) n++;
  const neg = Math.random() < 0.3;
  const value = (neg ? -1 : 1) * (n / d);
  const tex = `${neg ? '-' : ''}\\dfrac{${n}}{${d}}`;
  return {
    skill: 'decimal',
    prompt: `Write $${tex}$ as a decimal.`,
    answer: { type: 'number', value, decimal: true },
    hints: [`Divide the numerator by the denominator: $${n} \\div ${d}$.`, ...(neg ? ['Keep the negative sign in your answer.'] : [])],
    solution: [`$${n} \\div ${d} = ${n / d}$`, `So $${tex} = ${value}$.`],
    mistakes: [
      { answer: String(+(d / n).toFixed(6)), feedback: 'You divided the denominator by the numerator. Divide the **top** by the **bottom**.' },
      ...(neg ? [{ answer: String(n / d), feedback: 'Don\'t forget the negative sign.' }] : []),
    ],
    placeholder: 'e.g. 0.75',
  };
}

// ---------------------------------------------------------------------------
// Skill 5: Absolute value
// ---------------------------------------------------------------------------

function absoluteProblem(): Problem {
  const kind = pick(['simple', 'simple', 'decimal', 'fraction', 'sum', 'outside'] as const);
  if (kind === 'simple' || kind === 'decimal') {
    const n = kind === 'simple' ? pick([-1, 1, -1]) * randInt(0, 99) : -randInt(1, 99) / 10;
    return {
      skill: 'absolute',
      prompt: `Find $\\;\\lvert ${n} \\rvert$.`,
      answer: { type: 'number', value: Math.abs(n) },
      hints: ['Absolute value is the **distance** from $0$ on the number line. A distance is never negative.'],
      solution: [`$${n}$ is $${Math.abs(n)}$ units from $0$, so $\\lvert ${n} \\rvert = ${Math.abs(n)}$.`],
      mistakes: n < 0 ? [{ answer: String(n), feedback: 'Absolute value is a distance, so it can\'t be negative.' }] : [],
    };
  }
  if (kind === 'fraction') {
    const d = pick([2, 3, 4, 5, 7]);
    const n = randInt(1, 2 * d);
    return {
      skill: 'absolute',
      prompt: `Find $\\;\\left|-\\dfrac{${n}}{${d}}\\right|$. (A fraction is fine.)`,
      answer: { type: 'number', value: n / d },
      hints: ['Absolute value removes the negative sign — it measures distance from $0$.'],
      solution: [`$\\left|-\\dfrac{${n}}{${d}}\\right| = \\dfrac{${n}}{${d}}$`],
      mistakes: [{ answer: `-${n}/${d}`, feedback: 'Absolute value is never negative.' }],
      placeholder: 'e.g. 3/4',
    };
  }
  if (kind === 'sum') {
    const a = randInt(1, 30);
    const b = randInt(1, 30);
    return {
      skill: 'absolute',
      prompt: `Find $\\;\\lvert -${a} \\rvert + \\lvert ${b} \\rvert$.`,
      answer: { type: 'number', value: a + b },
      hints: ['Find each absolute value first, then add.'],
      solution: [`$\\lvert -${a} \\rvert = ${a}$ and $\\lvert ${b} \\rvert = ${b}$`, `$${a} + ${b} = ${a + b}$`],
      mistakes: [{ answer: String(-a + b), feedback: `$\\lvert -${a} \\rvert$ is $${a}$, not $-${a}$. Find each absolute value before adding.` }],
    };
  }
  const a = randInt(2, 40);
  return {
    skill: 'absolute',
    prompt: `Find $\\;-\\lvert -${a} \\rvert$. (Careful with the sign outside the bars.)`,
    answer: { type: 'number', value: -a },
    hints: [`First find $\\lvert -${a} \\rvert = ${a}$. Then take the opposite, because of the $-$ sign **outside** the bars.`],
    solution: [`$\\lvert -${a} \\rvert = ${a}$`, `$-\\lvert -${a} \\rvert = -${a}$`],
    mistakes: [{ answer: String(a), feedback: 'The absolute value is $' + a + '$, but there is a negative sign **outside** the bars, so the answer is its opposite.' }],
  };
}

export const skills: Skill[] = [
  { id: 'context', label: 'Integers in context', generate: contextProblem },
  { id: 'classify', label: 'Classify numbers', generate: classifyProblem },
  { id: 'compare', label: 'Order & inequalities', generate: compareProblem },
  { id: 'decimal', label: 'Fractions → decimals', generate: decimalProblem },
  { id: 'absolute', label: 'Absolute value', generate: absoluteProblem },
];

export function masterySet(size = 6): Problem[] {
  const base = skills.map((s) => s.generate());
  const extra = Array.from({ length: Math.max(0, size - base.length) }, () => pick(skills).generate());
  return shuffle([...base, ...extra]);
}
