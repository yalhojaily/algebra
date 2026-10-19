// Practice problem generators for Lesson 2.8 — Applications and Problem Solving with Inequalities.
import { REL_TEX, type Rel } from '../lib/inequality';
import { fmt, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

interface Phrase { text: (v: string, n: number) => string; op: Rel; note: string }

export const PHRASES: Phrase[] = [
  { text: (v, n) => `${v} is at least ${n}`, op: '>=', note: '"at least" means that number **or more**: $\\ge$' },
  { text: (v, n) => `${v} is at most ${n}`, op: '<=', note: '"at most" means that number **or less**: $\\le$' },
  { text: (v, n) => `${v} is no more than ${n}`, op: '<=', note: '"no more than" means it can equal $n$ but not go above: $\\le$' },
  { text: (v, n) => `${v} is no less than ${n}`, op: '>=', note: '"no less than" means it can equal $n$ but not go below: $\\ge$' },
  { text: (v, n) => `${v} exceeds ${n}`, op: '>', note: '"exceeds" means is **more than**: $>$' },
  { text: (v, n) => `${v} does not exceed ${n}`, op: '<=', note: '"does not exceed" means is **at most**: $\\le$' },
  { text: (v, n) => `${v} is more than ${n}`, op: '>', note: '"more than" is strictly greater: $>$' },
  { text: (v, n) => `${v} is less than ${n}`, op: '<', note: '"less than" is strictly smaller: $<$' },
  { text: (v, n) => `${v} is greater than or equal to ${n}`, op: '>=', note: '$\\ge$' },
];

function translate(): Problem {
  const v = pick(['x', 'n', 't', 'w']);
  const n = randInt(-20, 120);
  const ph = pick(PHRASES);
  const wrongOp: Rel = ph.op === '>=' ? '>' : ph.op === '<=' ? '<' : ph.op === '>' ? '>=' : '<=';
  return {
    skill: 'translate',
    prompt: `Translate to an inequality: **${ph.text(v, n)}**`,
    answer: { type: 'inequality', value: `${v} ${ph.op} ${n}` },
    hints: [ph.note],
    solution: [`$${v} ${REL_TEX[ph.op]} ${n}$ — ${ph.note}`],
    mistakes: [{ answer: `${v} ${wrongOp} ${n}`, feedback: `Close! Check whether $${n}$ itself is allowed. ${ph.note}.` }],
    placeholder: `e.g. ${v} >= 10`,
  };
}

function sentence(): Problem {
  const a = randInt(2, 6);
  const b = randInt(1, 20);
  const x = randInt(-5, 15);
  const ph = pick(PHRASES.slice(0, 6));
  const c = a * x + b;
  const mult = a === 2 ? 'Twice' : a === 3 ? 'Three times' : `${a} times`;
  return {
    skill: 'sentence',
    prompt: `${mult} a number, plus $${b}$, ${ph.text('', c).trim()}. Find the possible numbers. (Use $x$ for the number.)`,
    answer: { type: 'inequality', value: `x ${ph.op} ${x}` },
    hints: [`Translate: $${a}x + ${b} ${REL_TEX[ph.op]} ${c}$. ${ph.note}.`, 'Then solve the inequality.'],
    solution: [`$${a}x + ${b} ${REL_TEX[ph.op]} ${c}$`, `$${a}x ${REL_TEX[ph.op]} ${c - b}$`, `$x ${REL_TEX[ph.op]} ${x}$`],
    placeholder: 'e.g. x <= 4',
  };
}

function apply(): Problem {
  const t = pick([
    () => {
      let scores: number[];
      let target: number;
      let need: number;
      do {
        scores = [randInt(70, 98), randInt(65, 98), randInt(70, 98)];
        target = pick([80, 85, 90]);
        need = target * 4 - scores.reduce((s, x) => s + x, 0);
      } while (need < 50 || need > 100);
      return {
        prompt: `Your first three test scores are $${scores.join(',\\;')}$. What scores $s$ on the fourth test will give you an average of **at least** $${target}$?`,
        value: `s >= ${need}`,
        sol: [`$\\dfrac{${scores.join(' + ')} + s}{4} \\ge ${target}$`, `$${scores.reduce((a, b) => a + b, 0)} + s \\ge ${target * 4}$ — multiply by $4$`, `$s \\ge ${need}$`],
        hint: 'Average = (sum of scores) ÷ 4. "At least" means $\\ge$.',
        ph: 's >= 80',
      };
    },
    () => {
      const day = pick([60, 80, 100, 120]);
      const perKm = pick([0.5, 1, 1.5, 2]);
      const budget = day + perKm * randInt(20, 200);
      const km = (budget - day) / perKm;
      return {
        prompt: `A car rental costs $${day}$ riyals per day plus $${perKm}$ riyals per kilometer. Your budget for one day is **no more than** $${budget}$ riyals. How many kilometers $k$ can you drive?`,
        value: `k <= ${km}`,
        sol: [`$${day} + ${perKm}k \\le ${budget}$`, `$${perKm}k \\le ${budget - day}$`, `$k \\le ${fmt(km)}$`],
        hint: '"No more than" means $\\le$. Cost = daily fee + (rate × kilometers).',
        ph: 'k <= 100',
      };
    },
    () => {
      const max = pick([600, 800, 1000, 1200]);
      const box = pick([20, 25, 40]);
      const n = randInt(12, Math.floor((max - 60) / box));
      const person = max - box * n; // chosen so the boundary is a whole number
      const bound = n;
      return {
        prompt: `An elevator can carry **at most** $${max}$ kg. A loading cart weighing $${person}$ kg is filled with boxes that weigh $${box}$ kg each. For how many boxes $b$ is the load safe?`,
        value: `b <= ${fmt(bound)}`,
        sol: [`$${person} + ${box}b \\le ${max}$`, `$${box}b \\le ${max - person}$`, `$b \\le ${fmt(bound)}$ — at most $${n}$ boxes`],
        hint: '"At most" means $\\le$. Total weight = worker + (weight per box × boxes).',
        ph: 'b <= 20',
      };
    },
    () => {
      const price = pick([25, 40, 50]);
      const cost = pick([10, 15, 20]);
      const fixed = (price - cost) * randInt(40, 200);
      const bound = fixed / (price - cost);
      return {
        prompt: `A small business sells notebooks for $${price}$ riyals each. Each costs $${cost}$ riyals to make, plus $${fixed}$ riyals of fixed costs. Profit happens when revenue **exceeds** cost. For how many notebooks $n$ is there a profit?`,
        value: `n > ${fmt(bound)}`,
        sol: [`$${price}n > ${cost}n + ${fixed}$`, `$${price - cost}n > ${fixed}$`, `$n > ${fmt(bound)}$`],
        hint: 'Revenue $= ' + price + 'n$, cost $= ' + cost + 'n + ' + fixed + '$. "Exceeds" means $>$.',
        ph: 'n > 100',
      };
    },
  ])();
  return {
    skill: 'apply',
    prompt: t.prompt,
    answer: { type: 'inequality', value: t.value },
    hints: [t.hint],
    solution: t.sol,
    placeholder: `e.g. ${t.ph}`,
  };
}

export const skills: Skill[] = [
  { id: 'translate', label: 'Translate phrases', generate: translate },
  { id: 'sentence', label: 'Translate & solve', generate: sentence },
  { id: 'apply', label: 'Word problems', generate: apply },
];

export const masterySet = makeMasterySet(skills);
