// Practice problem generators for Lesson 12.7 — Mathematical Modeling with Exponential and Logarithmic Functions.
import { makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

function growth(): Problem {
  const P0 = pick([1000, 5000, 20000, 250, 1200]), k = pick([0.02, 0.03, 0.05, 0.08, 0.12]), t = randInt(2, 20);
  const P = P0 * Math.exp(k * t);
  return {
    skill: 'growth',
    prompt: `A population is modeled by $P(t) = ${P0}e^{${k}t}$, with $t$ in years. Find $P(${t})$ to the nearest whole number.`,
    answer: { type: 'number', value: Math.round(P), tol: 1.01 },
    hints: [`$P(${t}) = ${P0}e^{${k} \\cdot ${t}} = ${P0}e^{${+(k * t).toFixed(4)}}$`],
    solution: [`$P(${t}) \\approx ${Math.round(P)}$`],
  };
}

function doubling(): Problem {
  const k = pick([0.02, 0.035, 0.05, 0.07, 0.1]);
  const T = Math.log(2) / k;
  return {
    skill: 'doubling',
    prompt: `An investment grows by $P(t) = P_0 e^{${k}t}$. How many years until it doubles? (Round to two decimal places.)`,
    answer: { type: 'number', value: +T.toFixed(2), tol: 0.011 },
    hints: ['Set $P(t) = 2P_0$: $2 = e^{' + k + 't}$.', 'Take $\\ln$: $\\ln 2 = ' + k + 't$.'],
    solution: [`$t = \\dfrac{\\ln 2}{${k}} \\approx ${T.toFixed(2)}$ years`],
  };
}

function findK(): Problem {
  const T = pick([5, 8, 10, 12, 20, 25]);
  const k = Math.log(2) / T;
  return {
    skill: 'rate',
    prompt: `A quantity grows exponentially, $P(t) = P_0 e^{kt}$, and doubles every ${T} years. Find $k$ to four decimal places.`,
    answer: { type: 'number', value: +k.toFixed(4), tol: 0.00011 },
    hints: [`$2P_0 = P_0 e^{${T}k}$, so $\\ln 2 = ${T}k$.`],
    solution: [`$k = \\dfrac{\\ln 2}{${T}} \\approx ${k.toFixed(4)}$`],
  };
}

function halfLife(): Problem {
  const H = pick([5730, 28, 8, 1600, 30]), A0 = pick([100, 50, 200, 10]), t = pick([1, 2, 3]) * H * pick([0.5, 1, 1.5]);
  const A = A0 * 0.5 ** (t / H);
  return {
    skill: 'halflife',
    prompt: `A radioactive substance has a half-life of ${H} years. Starting with ${A0} g, how much remains after ${t} years? (Round to two decimal places.)`,
    answer: { type: 'number', value: +A.toFixed(2), tol: 0.011 },
    hints: [`After each half-life the amount halves: $A = ${A0}\\left(\\tfrac{1}{2}\\right)^{t/${H}}$.`],
    solution: [`$A = ${A0}\\left(\\tfrac{1}{2}\\right)^{${t}/${H}} \\approx ${A.toFixed(2)}$ g`],
  };
}

export const skills: Skill[] = [
  { id: 'growth', label: 'Exponential growth', generate: growth },
  { id: 'doubling', label: 'Doubling time', generate: doubling },
  { id: 'rate', label: 'Find the growth rate', generate: findK },
  { id: 'halflife', label: 'Half-life', generate: halfLife },
];

export const masterySet = makeMasterySet(skills);
