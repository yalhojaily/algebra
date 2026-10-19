// Practice problem generators for Lesson 1.3 — Addition of Real Numbers.
import { coprimeTo, fmt, fracTex, makeMasterySet, nz, p, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function ruleExplanation(a: number, b: number): string[] {
  const s = fmt(a + b);
  const A = fmt(Math.abs(a));
  const B = fmt(Math.abs(b));
  if (a === 0 || b === 0) return [`Adding $0$ changes nothing: $${a} + ${p(b)} = ${s}$.`];
  if (Math.sign(a) === Math.sign(b)) {
    const sign = a < 0 ? 'negative' : 'positive';
    return [
      `Same signs: add the absolute values, $${A} + ${B} = ${fmt(Math.abs(a) + Math.abs(b))}$.`,
      `Keep the common sign (${sign}): $${a} + ${p(b)} = ${s}$.`,
    ];
  }
  const big = Math.abs(a) > Math.abs(b) ? a : b;
  if (a + b === 0) return [`$${a}$ and $${b}$ are opposites, so their sum is $0$.`];
  const hi = Math.abs(a) > Math.abs(b) ? A : B;
  const lo = Math.abs(a) > Math.abs(b) ? B : A;
  return [
    `Different signs: subtract the absolute values, $${hi} - ${lo} = ${fmt(Math.abs(Math.abs(a) - Math.abs(b)))}$.`,
    `Use the sign of the number with the larger absolute value ($${big}$, which is ${big < 0 ? 'negative' : 'positive'}): $${a} + ${p(b)} = ${s}$.`,
  ];
}

function addIntegers(): Problem {
  let a = nz(20);
  let b = nz(20);
  if (Math.random() < 0.6 && Math.sign(a) === Math.sign(b)) b = -b; // favor different signs
  if (Math.random() < 0.08) b = -a; // occasionally opposites
  const s = a + b;
  const wrongSign = -s;
  return {
    skill: 'integers',
    prompt: `Add: $\\;${a} + ${p(b)}$`,
    answer: { type: 'number', value: s },
    hints: [
      'Same signs → add the absolute values and keep the sign. Different signs → subtract the absolute values and take the sign of the "bigger" one.',
      `Start at $${a}$ on the number line and move ${Math.abs(b)} units to the ${b < 0 ? 'left' : 'right'}.`,
    ],
    solution: ruleExplanation(a, b),
    mistakes: [
      ...(s !== 0 ? [{ answer: String(wrongSign), feedback: 'The size is right but the **sign** is wrong. Which number has the larger absolute value?' }] : []),
      ...(Math.sign(a) !== Math.sign(b)
        ? [{ answer: String(Math.sign(s || 1) * (Math.abs(a) + Math.abs(b))), feedback: 'The signs are different, so **subtract** the absolute values instead of adding them.' }]
        : []),
    ],
  };
}

function addRational(): Problem {
  if (Math.random() < 0.5) {
    const a = nz(99) / 10;
    let b = nz(99) / 10;
    if (Math.sign(a) === Math.sign(b) && Math.random() < 0.6) b = -b;
    const s = Math.round((a + b) * 10) / 10;
    return {
      skill: 'rational',
      prompt: `Add: $\\;${a} + ${p(b)}$`,
      answer: { type: 'number', value: s },
      hints: ['The same sign rules work for decimals. Line up the decimal points.'],
      solution: ruleExplanation(a, b),
    };
  }
  const d = pick([2, 3, 4, 5, 6, 8]);
  const d2 = pick([d, d, 2 * d].filter((x) => x <= 16));
  const n1 = coprimeTo(d, 2 * d);
  const n2 = coprimeTo(d2, 2 * d2);
  const num = n1 * (d2 / d) + n2;
  const L = d2;
  return {
    skill: 'rational',
    prompt: `Add: $\\;${fracTex(n1, d)} + ${p(fracTex(n2, d2))}$. (A fraction is fine.)`,
    answer: { type: 'number', value: num / L },
    hints: [
      d === d2 ? 'The denominators are the same, so add the numerators (using the sign rules).' : `Write both fractions with denominator $${L}$ first.`,
    ],
    solution: [
      d === d2
        ? `Same denominator: add the numerators, $${n1} + ${p(n2)} = ${n1 + n2}$.`
        : `$${fracTex(n1, d)} = \\frac{${n1 * (L / d)}}{${L}}$, then add numerators: $${n1 * (L / d)} + ${p(n2)} = ${num}$.`,
      `So the sum is $\\frac{${num}}{${L}}${fracTex(num, L) !== `\\frac{${num}}{${L}}` ? ` = ${fracTex(num, L)}` : ''}$.`,
    ],
    placeholder: 'e.g. -3/4',
  };
}

function opposites(): Problem {
  const x = nz(30);
  const kind = pick(['opp', 'oppopp', 'inverse', 'sum'] as const);
  if (kind === 'opp')
    return {
      skill: 'opposites',
      prompt: `Find $-x$ when $x = ${x}$.`,
      answer: { type: 'number', value: -x },
      hints: ['$-x$ means "the opposite of $x$". It is not always negative!'],
      solution: [`$-x = -(${x}) = ${-x}$`],
      mistakes: x < 0 ? [{ answer: String(x), feedback: `When $x$ is negative, its opposite $-x$ is **positive**.` }] : [],
    };
  if (kind === 'oppopp')
    return {
      skill: 'opposites',
      prompt: `Find $-(-x)$ when $x = ${x}$.`,
      answer: { type: 'number', value: x },
      hints: ['The opposite of the opposite of a number is the number itself.'],
      solution: [`$-(-x) = x = ${x}$`],
    };
  if (kind === 'inverse')
    return {
      skill: 'opposites',
      prompt: `What is the additive inverse (opposite) of $${x}$?`,
      answer: { type: 'number', value: -x },
      hints: ['A number and its additive inverse add up to $0$.'],
      solution: [`$${x} + ${p(-x)} = 0$, so the additive inverse is $${-x}$.`],
    };
  return {
    skill: 'opposites',
    prompt: `Add: $\\;${x} + ${p(-x)}$`,
    answer: { type: 'number', value: 0 },
    hints: ['Look closely: these two numbers are opposites.'],
    solution: [`A number plus its opposite is always $0$.`],
  };
}

function addMany(): Problem {
  const n = randInt(4, 5);
  const xs = Array.from({ length: n }, () => nz(25));
  const pos = xs.filter((x) => x > 0);
  const neg = xs.filter((x) => x < 0);
  const s = xs.reduce((a, b) => a + b, 0);
  const sp = pos.reduce((a, b) => a + b, 0);
  const sn = neg.reduce((a, b) => a + b, 0);
  return {
    skill: 'many',
    prompt: `Add: $\\;${xs.map((x, i) => (i === 0 ? String(x) : p(x))).join(' + ')}$`,
    answer: { type: 'number', value: s },
    hints: ['Tip: add all the positive numbers, add all the negative numbers, then combine the two results.'],
    solution: [
      `Positives: ${pos.length ? `$${pos.join(' + ')} = ${sp}$` : 'none'}`,
      `Negatives: ${neg.length ? `$${neg.map((x, i) => (i ? p(x) : x)).join(' + ')} = ${sn}$` : 'none'}`,
      `Combine: $${sp} + ${p(sn)} = ${s}$`,
    ],
  };
}

function applications(): Problem {
  const t = pick([
    () => {
      const start = nz(12);
      const rise = randInt(3, 15);
      const fall = randInt(2, 18);
      const end = start + rise - fall;
      return {
        prompt: `At 6 a.m. the temperature was $${start}^\\circ$C. By noon it had risen $${rise}^\\circ$, and by midnight it had fallen $${fall}^\\circ$ from the noon temperature. What was the temperature at midnight?`,
        value: end,
        sol: [`$${start} + ${rise} + ${p(-fall)} = ${end}$`, `The temperature at midnight was $${end}^\\circ$C.`],
      };
    },
    () => {
      const bal = randInt(50, 400);
      const spend = randInt(100, 600);
      const dep = randInt(20, 300);
      const end = bal - spend + dep;
      return {
        prompt: `Sara had $${bal}$ riyals in her account. She paid a bill of $${spend}$ riyals, then deposited $${dep}$ riyals. What is her balance now? (A negative balance means she owes the bank.)`,
        value: end,
        sol: [`$${bal} + ${p(-spend)} + ${dep} = ${end}$`, `Her balance is $${end}$ riyals.`],
      };
    },
    () => {
      const plays = [nz(12), nz(12), nz(12)];
      const s = plays.reduce((a, b) => a + b, 0);
      return {
        prompt: `A football team's three plays gained or lost these yards: $${plays.join(',\\;')}$. What was the total gain or loss? (Use a negative number for a loss.)`,
        value: s,
        sol: [`$${plays.map((x, i) => (i ? p(x) : x)).join(' + ')} = ${s}$`],
      };
    },
    () => {
      const depth = randInt(20, 90);
      const up = randInt(5, depth + 30);
      const end = -depth + up;
      return {
        prompt: `A submarine is at $${depth}$ m below sea level. It rises $${up}$ m. What is its new elevation? (Below sea level is negative.)`,
        value: end,
        sol: [`$-${depth} + ${up} = ${end}$`, `The new elevation is $${end}$ m.`],
      };
    },
  ])();
  return {
    skill: 'apply',
    prompt: t.prompt,
    answer: { type: 'number', value: t.value },
    hints: ['Write each change as a positive (up, gain, deposit) or negative (down, loss, payment) number, then add.'],
    solution: t.sol,
  };
}

export const skills: Skill[] = [
  { id: 'integers', label: 'Add integers', generate: addIntegers },
  { id: 'rational', label: 'Decimals & fractions', generate: addRational },
  { id: 'opposites', label: 'Opposites', generate: opposites },
  { id: 'many', label: 'Add several numbers', generate: addMany },
  { id: 'apply', label: 'Word problems', generate: applications },
];

export const masterySet = makeMasterySet(skills);
