// Practice problem generators for Lesson 10.1 — Radical Expressions and Functions.
import { makeMasterySet, nz, pick, randInt, termTex } from './helpers';
import { iv, ivTex, numTex } from './sets';
import type { Problem, Skill } from './types';

function roots(): Problem {
  const kind = pick(['sq', 'negsq', 'cube', 'negcube', 'frac'] as const);
  if (kind === 'cube' || kind === 'negcube') {
    const r = randInt(1, 6) * (kind === 'negcube' ? -1 : 1);
    return {
      skill: 'roots',
      prompt: `Find $\\;\\sqrt[3]{${r ** 3}}$`,
      answer: { type: 'number', value: r },
      hints: ['The cube root of $a$ is the number whose **cube** is $a$. Cube roots of negative numbers are negative.'],
      solution: [`$${r < 0 ? `(${r})` : r}^3 = ${r ** 3}$, so $\\sqrt[3]{${r ** 3}} = ${r}$.`],
    };
  }
  if (kind === 'frac') {
    const a = randInt(1, 9), b = randInt(2, 12);
    return {
      skill: 'roots',
      prompt: `Find $\\;\\sqrt{\\dfrac{${a * a}}{${b * b}}}$`,
      answer: { type: 'number', value: a / b },
      hints: ['Take the square root of the numerator and of the denominator.'],
      solution: [`$\\sqrt{\\frac{${a * a}}{${b * b}}} = \\frac{${a}}{${b}}$`],
      placeholder: '3/4',
    };
  }
  const r = randInt(2, 15);
  return {
    skill: 'roots',
    prompt: `Find $\\;${kind === 'negsq' ? '-' : ''}\\sqrt{${r * r}}$`,
    answer: { type: 'number', value: kind === 'negsq' ? -r : r },
    hints: ['$\\sqrt{a}$ means the **principal** (nonnegative) square root.', kind === 'negsq' ? 'The minus sign is outside the radical: take the root, then make it negative.' : `Which positive number squared is $${r * r}$?`],
    solution: [`$${r}^2 = ${r * r}$, so $${kind === 'negsq' ? '-' : ''}\\sqrt{${r * r}} = ${kind === 'negsq' ? -r : r}$.`],
    mistakes: kind === 'sq' ? [{ answer: String(-r), feedback: 'The radical sign means the **principal** (positive) square root.' }] : [],
  };
}

function evalFn(): Problem {
  for (;;) {
    const a = nz(5), b = randInt(-10, 20), x = randInt(-6, 10);
    const v = a * x + b;
    const r = Math.sqrt(v);
    if (v < 0 || !Number.isInteger(r)) continue;
    const f = pick(['f', 'g']);
    return {
      skill: 'function',
      prompt: `For $${f}(x) = \\sqrt{${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${Math.abs(b)}}$, find $${f}(${x})$.`,
      answer: { type: 'number', value: r },
      hints: [`Substitute $${x}$ for $x$ under the radical first.`],
      solution: [`$${f}(${x}) = \\sqrt{${a}(${x}) ${b < 0 ? '-' : '+'} ${Math.abs(b)}} = \\sqrt{${v}} = ${r}$`],
    };
  }
}

function domain(): Problem {
  const a = nz(4), b = randInt(-12, 12);
  const edge = -b / a;
  const ans = a > 0 ? iv(edge, Infinity, true, false) : iv(-Infinity, edge, false, true);
  return {
    skill: 'domain',
    prompt: `Find the domain of $\\;f(x) = \\sqrt{${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${Math.abs(b)}}$. Use interval notation.`,
    answer: { type: 'interval', ...ans },
    hints: ['The expression under a square root must be **nonnegative**.', `Solve $${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${Math.abs(b)} \\ge 0$${a < 0 ? ' — remember to reverse the sign when dividing by a negative' : ''}.`],
    solution: [`$${termTex(a, 'x')} ${b < 0 ? '-' : '+'} ${Math.abs(b)} \\ge 0 \\;\\Rightarrow\\; x ${a > 0 ? '\\ge' : '\\le'} ${numTex(edge)}$`, `Domain: $${ivTex(ans)}$`],
    placeholder: '[2, inf)',
  };
}

function absValue(): Problem {
  const kind = pick(['mono', 'binom', 'cube'] as const);
  if (kind === 'cube') {
    const k = randInt(2, 5);
    return {
      skill: 'abs',
      prompt: `Simplify: $\\;\\sqrt[3]{${k ** 3}x^3}$ ($x$ can be any real number.)`,
      answer: { type: 'expression', value: `${k}x` },
      hints: ['Odd roots keep the sign: $\\sqrt[3]{a^3} = a$ for every real $a$ — no absolute value needed.'],
      solution: [`$\\sqrt[3]{(${k}x)^3} = ${k}x$`],
    };
  }
  if (kind === 'mono') {
    const k = randInt(2, 9);
    return {
      skill: 'abs',
      prompt: `Simplify: $\\;\\sqrt{${k * k}x^2}$ ($x$ can be any real number. Type |x| for $|x|$.)`,
      answer: { type: 'expression', value: `${k}abs(x)` },
      hints: ['$\\sqrt{a^2} = |a|$: a principal square root is never negative, even when $a$ is.'],
      solution: [`$\\sqrt{(${k}x)^2} = |${k}x| = ${k}|x|$`],
      mistakes: [{ answer: `${k}x`, feedback: `Try $x = -1$: $\\sqrt{${k * k}} = ${k}$, but ${k}x would give $-${k}$. You need an absolute value.` }],
      placeholder: '3|x|',
    };
  }
  const h = nz(6);
  const inner = `x ${h < 0 ? '-' : '+'} ${Math.abs(h)}`;
  return {
    skill: 'abs',
    prompt: `Simplify: $\\;\\sqrt{x^2 ${h < 0 ? '-' : '+'} ${2 * Math.abs(h)}x + ${h * h}}$ ($x$ can be any real number.)`,
    answer: { type: 'expression', value: `abs(${inner})` },
    hints: [`The expression under the radical is a perfect square: $(${inner})^2$.`, '$\\sqrt{a^2} = |a|$.'],
    solution: [`$\\sqrt{(${inner})^2} = |${inner}|$`],
    mistakes: [{ answer: inner, feedback: 'Without absolute value bars this would be negative for some $x$ — but a square root never is.' }],
    placeholder: '|x + 3|',
  };
}


/** Word problems that run squaring backwards. */
function rootWords(): Problem {
  const kind = pick(['skid', 'square', 'fall'] as const);
  if (kind === 'skid') {
    const k = randInt(2, 9), L = 5 * k * k, r = 10 * k;
    return {
      skill: 'apply',
      prompt: `Police estimate a car's speed from its skid marks with $r = 2\\sqrt{5L}$, where $L$ is the length of the skid marks in feet and $r$ is the speed in miles per hour. A car leaves skid marks ${L} ft long. How fast was it going (mph)?`,
      answer: { type: 'number', value: r },
      hints: [`Unknown: the speed $r$. The formula is given — substitute $L = ${L}$.`, `$r = 2\\sqrt{5 \\cdot ${L}} = 2\\sqrt{${5 * L}}$. What number squared is $${5 * L}$?`],
      solution: [`$r = 2\\sqrt{5 \\cdot ${L}} = 2\\sqrt{${5 * L}} = 2 \\cdot ${5 * k} = ${r}$`, `The car was going about ${r} mph.`],
      placeholder: '40',
    };
  }
  if (kind === 'square') {
    const A = randInt(20, 300);
    const s = Math.sqrt(A);
    const exact = Number.isInteger(s);
    return {
      skill: 'apply',
      prompt: `A square garden has an area of ${A} m². How long is each side (m)? ${exact ? '' : 'Round to the nearest tenth.'}`,
      answer: { type: 'number', value: exact ? s : +s.toFixed(1), tol: exact ? undefined : 0.051 },
      hints: ['Unknown: the side $s$. Area of a square: $s^2 = ' + A + '$.', 'The side is the **principal** (positive) square root — a length can\'t be negative.'],
      solution: [`$s = \\sqrt{${A}}${exact ? ` = ${s}` : ` \\approx ${s.toFixed(1)}`}$ m`],
      placeholder: '12.2',
    };
  }
  const h = pick([5, 10, 20, 45, 80, 125]);
  const t = Math.sqrt(h / 5);
  return {
    skill: 'apply',
    prompt: `A stone dropped from a height of $h$ meters takes about $t = \\sqrt{\\dfrac{h}{5}}$ seconds to land. How long does it take to fall ${h} m (seconds)?`,
    answer: { type: 'number', value: t },
    hints: [`Unknown: the time $t$. Substitute $h = ${h}$ into the formula.`, `$\\dfrac{${h}}{5} = ${h / 5}$, so find $\\sqrt{${h / 5}}$.`],
    solution: [`$t = \\sqrt{\\dfrac{${h}}{5}} = \\sqrt{${h / 5}} = ${t}$ s`],
    placeholder: '2',
  };
}

export const skills: Skill[] = [
  { id: 'roots', label: 'Square and cube roots', generate: roots },
  { id: 'function', label: 'Radical functions', generate: evalFn },
  { id: 'domain', label: 'Domain', generate: domain },
  { id: 'abs', label: 'Roots of squares and cubes', generate: absValue },
  { id: 'apply', label: 'Word problems', generate: rootWords },
];

export const masterySet = makeMasterySet(skills);
