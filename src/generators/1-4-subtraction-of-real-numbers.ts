// Practice problem generators for Lesson 1.4 — Subtraction of Real Numbers.
import { choice, coprimeTo, fmt, fracTex, makeMasterySet, nz, p, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

/** a − b explained as a + (−b). */
function subExplain(a: number, b: number, at = (x: number) => fmt(x), bt = (x: number) => fmt(x)): string[] {
  return [
    `Subtracting is adding the opposite: $${at(a)} - ${p(bt(b))} = ${at(a)} + ${p(bt(-b))}$.`,
    `Now add: $${at(a)} + ${p(bt(-b))} = ${fmt(a - b)}$.`,
  ];
}

function subIntegers(): Problem {
  const a = nz(20);
  const b = Math.random() < 0.15 ? 0 : nz(20);
  const d = a - b;
  return {
    skill: 'integers',
    prompt: `Subtract: $\\;${a} - ${p(b)}$`,
    answer: { type: 'number', value: d },
    hints: [`Change subtraction to adding the opposite: $${a} - ${p(b)} = ${a} + ${p(-b)}$.`, 'Then use the addition rules.'],
    solution: subExplain(a, b),
    mistakes: [
      ...(b !== 0 ? [{ answer: String(a + b), feedback: `You added $${b}$. Subtracting $${p(b)}$ means adding its **opposite**, $${-b}$.` }] : []),
      ...(d !== 0 ? [{ answer: String(-d), feedback: 'The size is right, but check the sign.' }] : []),
    ],
  };
}

function rewrite(): Problem {
  const a = nz(15);
  const b = nz(15);

  return {
    skill: 'rewrite',
    prompt: `Which addition means the same as $\\;${a} - ${p(b)}$?`,
    answer: choice(`$${a} + ${p(-b)}$`, [`$${a} + ${p(b)}$`, `$${-a} + ${p(-b)}$`, `$${-a} + ${p(b)}$`]),
    hints: ['Keep the first number. Change "minus" to "plus". Change the second number to its opposite.'],
    solution: [`$${a} - ${p(b)} = ${a} + ${p(-b)}$ — keep, change, change.`],
  };
}

function subRational(): Problem {
  if (Math.random() < 0.5) {
    const a = nz(99) / 10;
    const b = nz(99) / 10;
    return {
      skill: 'rational',
      prompt: `Subtract: $\\;${a} - ${p(b)}$`,
      answer: { type: 'number', value: Math.round((a - b) * 10) / 10 },
      hints: [`Rewrite as addition: $${a} + ${p(fmt(-b))}$.`],
      solution: subExplain(a, b),
    };
  }
  const d = pick([2, 3, 4, 5, 6, 8, 10]);
  const n1 = coprimeTo(d, 2 * d);
  const n2 = coprimeTo(d, 2 * d);
  const t = (x: number) => fracTex(x, d);
  const num = n1 - n2;
  return {
    skill: 'rational',
    prompt: `Subtract: $\\;${t(n1)} - ${p(t(n2))}$. (A fraction is fine.)`,
    answer: { type: 'number', value: num / d },
    hints: [`Add the opposite: $${t(n1)} + ${p(t(-n2))}$. The denominators are already the same.`],
    solution: [
      `$${t(n1)} - ${p(t(n2))} = ${t(n1)} + ${p(t(-n2))}$`,
      `$= \\frac{${n1} + ${p(-n2)}}{${d}} = ${fracTex(num, d)}$`,
    ],
    placeholder: 'e.g. -1/2',
  };
}

function chain(): Problem {
  const xs = [nz(20), nz(20), nz(20), nz(20)];
  const ops = ['-', pick(['+', '-']), pick(['+', '-'])];
  let txt = String(xs[0]);
  let addForm = String(xs[0]);
  let v = xs[0];
  ops.forEach((o, i) => {
    const x = xs[i + 1];
    txt += ` ${o} ${p(x)}`;
    const add = o === '-' ? -x : x;
    addForm += ` + ${p(add)}`;
    v += add;
  });
  return {
    skill: 'chain',
    prompt: `Simplify: $\\;${txt}$`,
    answer: { type: 'number', value: v },
    hints: ['Rewrite every subtraction as adding the opposite. Then add all the numbers.'],
    solution: [`$${txt}$`, `$= ${addForm}$`, `$= ${v}$`],
  };
}

function applications(): Problem {
  const t = pick([
    () => {
      const hi = randInt(5, 45);
      const lo = -randInt(1, 30);
      return {
        prompt: `In one day the highest temperature was $${hi}^\\circ$C and the lowest was $${lo}^\\circ$C. How many degrees did the temperature range?`,
        value: hi - lo,
        sol: [`Range = highest − lowest = $${hi} - ${p(lo)} = ${hi} + ${-lo} = ${hi - lo}$ degrees.`],
      };
    },
    () => {
      const peak = randInt(1000, 5000);
      const trench = -randInt(100, 900);
      return {
        prompt: `A mountain peak is $${peak}$ m above sea level. A nearby valley floor is at $${trench}$ m. What is the difference in elevation?`,
        value: peak - trench,
        sol: [`$${peak} - ${p(trench)} = ${peak} + ${-trench} = ${peak - trench}$ m`],
      };
    },
    () => {
      const owe = randInt(20, 300);
      const pay = randInt(10, 400);
      return {
        prompt: `Omar's account balance is $-${owe}$ riyals. He is charged a fee of $${pay}$ riyals. What is his balance now?`,
        value: -owe - pay,
        sol: [`$-${owe} - ${pay} = -${owe} + ${p(-pay)} = ${-owe - pay}$ riyals`],
      };
    },
    () => {
      const now = -randInt(2, 15);
      const before = randInt(-20, 25);
      return {
        prompt: `The temperature changed from $${before}^\\circ$C to $${now}^\\circ$C. What was the change? (Change = new − old. A drop is negative.)`,
        value: now - before,
        sol: [`$${now} - ${p(before)} = ${now - before}$ degrees`],
      };
    },
  ])();
  return {
    skill: 'apply',
    prompt: t.prompt,
    answer: { type: 'number', value: t.value },
    hints: ['The difference between two values is "larger minus smaller", or "new minus old" for a change.'],
    solution: t.sol,
  };
}

export const skills: Skill[] = [
  { id: 'integers', label: 'Subtract integers', generate: subIntegers },
  { id: 'rewrite', label: 'Add the opposite', generate: rewrite },
  { id: 'rational', label: 'Decimals & fractions', generate: subRational },
  { id: 'chain', label: 'Add & subtract', generate: chain },
  { id: 'apply', label: 'Word problems', generate: applications },
];

export const masterySet = makeMasterySet(skills);
