// Practice problem generators for Lesson 6.9 — Variation and Applications.
import { dfrac, fmt, fracIn, fracTex, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function kPair() {
  // k as a fraction p/q with a nice data point
  const q = pick([1, 1, 2, 3, 4]), p = randInt(1, 12);
  return { p, q, k: p / q };
}

function directEquation(): Problem {
  const { p, q, k } = kPair();
  const x = q * randInt(1, 6), y = k * x;
  return {
    skill: 'direct',
    prompt: `$y$ varies directly as $x$, and $y = ${fmt(y)}$ when $x = ${x}$. Find the equation of variation.`,
    answer: { type: 'equation', value: `y = ${fracIn(p, q)}*x`, solveFor: 'y' },
    hints: ['Direct variation means $y = kx$.', `Substitute: $${fmt(y)} = k \\cdot ${x}$, so $k = ${dfrac(fmt(y), String(x))}$.`],
    solution: [`$${fmt(y)} = k \\cdot ${x}$`, `$k = ${fracTex(p, q)}$`, `$y = ${fracTex(p, q)}x$`],
    placeholder: 'y = 3x',
  };
}

function inverseEquation(): Problem {
  const k = randInt(2, 12) * pick([1, 2, 3, 5]);
  const divs = Array.from({ length: k }, (_, i) => i + 1).filter((d) => k % d === 0 && d > 1 && d < k);
  const x = pick(divs.length ? divs : [1]), y = k / x;
  return {
    skill: 'inverse',
    prompt: `$y$ varies inversely as $x$, and $y = ${y}$ when $x = ${x}$. Find the equation of variation.`,
    answer: { type: 'equation', value: `y = ${k}/x`, solveFor: 'y' },
    hints: ['Inverse variation means $y = \\frac{k}{x}$, so $k = xy$.'],
    solution: [`$k = xy = ${x} \\cdot ${y} = ${k}$`, `$y = ${dfrac(String(k), 'x')}$`],
    placeholder: 'y = 12/x',
  };
}

function directApply(): Problem {
  const ctx = pick([
    { y: 'pay', x: 'hours worked', yu: 'dollars', xu: 'hours', k: [12, 15, 18, 20] },
    { y: 'distance', x: 'time', yu: 'km', xu: 'hours', k: [40, 55, 60, 80] },
    { y: 'weight on the moon', x: 'weight on Earth', yu: 'lb', xu: 'lb', k: [1 / 6] },
  ]);
  const k = pick(ctx.k);
  const draw = () => (ctx.k[0] < 1 ? 6 * randInt(10, 40) : randInt(2, 12));
  const x1 = draw();
  let x2 = draw();
  while (x2 === x1) x2 = draw();
  const y1 = k * x1, y2 = k * x2;
  return {
    skill: 'apply',
    prompt: `The ${ctx.y} varies directly as the ${ctx.x}. If the ${ctx.y} is ${fmt(y1)} ${ctx.yu} when the ${ctx.x} is ${x1} ${ctx.xu}, what is the ${ctx.y} when the ${ctx.x} is ${x2} ${ctx.xu}?`,
    answer: { type: 'number', value: y2 },
    hints: [`Find $k$ from $${fmt(y1)} = k \\cdot ${x1}$.`, `Then compute $k \\cdot ${x2}$.`],
    solution: [`$k = ${dfrac(fmt(y1), String(x1))} = ${fracTex(Math.round(y1 * 6), x1 * 6)}$`, `$y = ${fracTex(Math.round(y1 * 6), x1 * 6)} \\cdot ${x2} = ${fmt(y2)}$ ${ctx.yu}`],
  };
}

function inverseApply(): Problem {
  const ctx = pick([
    { y: 'time to finish a job', x: 'number of workers', yu: 'hours', xu: 'workers' },
    { y: 'time for a trip', x: 'speed', yu: 'hours', xu: 'km/h' },
  ]);
  const k = pick([24, 36, 48, 60, 72, 120, 240, 360]);
  const trip = ctx.xu === 'km/h';
  const all = Array.from({ length: k }, (_, i) => i + 1).filter((d) => k % d === 0 && d > 1 && d < k);
  const ds = all.filter((d) => (trip ? d >= 20 : d <= 24)).length >= 2 ? all.filter((d) => (trip ? d >= 20 : d <= 24)) : all;
  const x1 = pick(ds);
  let x2 = pick(ds);
  while (x2 === x1) x2 = pick(ds);
  return {
    skill: 'inverseapply',
    prompt: `The ${ctx.y} varies inversely as the ${ctx.x}. If it takes ${k / x1} ${ctx.yu} with ${x1} ${ctx.xu}, how many ${ctx.yu} does it take with ${x2} ${ctx.xu}?`,
    answer: { type: 'number', value: k / x2 },
    hints: [`Inverse variation: $y = \\frac{k}{x}$, so $k = xy = ${x1} \\cdot ${k / x1}$.`],
    solution: [`$k = ${x1} \\cdot ${k / x1} = ${k}$`, `$y = ${dfrac(String(k), String(x2))} = ${k / x2}$ ${ctx.yu}`],
    mistakes: [{ answer: fmt((k / x1 / x1) * x2), feedback: 'That would be **direct** variation. In inverse variation, when one quantity goes up, the other goes **down**.' }],
  };
}

export const skills: Skill[] = [
  { id: 'direct', label: 'Direct variation', generate: directEquation },
  { id: 'inverse', label: 'Inverse variation', generate: inverseEquation },
  { id: 'apply', label: 'Direct-variation problems', generate: directApply },
  { id: 'inverseapply', label: 'Inverse-variation problems', generate: inverseApply },
];

export const masterySet = makeMasterySet(skills);
