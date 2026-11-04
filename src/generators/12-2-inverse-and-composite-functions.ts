// Practice problem generators for Lesson 12.2 — Inverse and Composite Functions.
import { choice, makeMasterySet, nz, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const linTex = (a: number, b: number) => `${a === 1 ? '' : a === -1 ? '-' : a}x${b ? ` ${b < 0 ? '-' : '+'} ${Math.abs(b)}` : ''}`;

function composeValue(): Problem {
  const a = nz(4), b = randInt(-6, 6), c = pick([1, 2, -1]), d = randInt(-5, 5);
  const x = randInt(-3, 4);
  const g = c * x * x + d;
  const res = a * g + b;
  return {
    skill: 'value',
    prompt: `Let $f(x) = ${linTex(a, b)}$ and $g(x) = ${c === 1 ? '' : c === -1 ? '-' : c}x^2${d ? ` ${d < 0 ? '-' : '+'} ${Math.abs(d)}` : ''}$. Find $(f \\circ g)(${x})$.`,
    answer: { type: 'number', value: res },
    hints: ['$(f \\circ g)(x) = f(g(x))$: work from the **inside** out.', `First $g(${x}) = ${g}$.`],
    solution: [`$g(${x}) = ${g}$`, `$f(${g}) = ${a}(${g}) ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${res}$`],
    mistakes: [{ answer: String(c * (a * x + b) ** 2 + d), feedback: 'That is $g(f(x))$. For $f \\circ g$, apply $g$ first.' }],
  };
}

function composeExpr(): Problem {
  const a = nz(4), b = randInt(-6, 6), c = nz(3), d = randInt(-5, 5);
  const fog = pick([true, false]);
  // f(x) = a x + b, g(x) = c x + d
  const A = fog ? a * c : c * a, B = fog ? a * d + b : c * b + d;
  const value = B === 0 ? `${A}x` : `${A}x ${B < 0 ? '-' : '+'} ${Math.abs(B)}`;
  return {
    skill: 'expr',
    prompt: `Let $f(x) = ${linTex(a, b)}$ and $g(x) = ${linTex(c, d)}$. Find $(${fog ? 'f \\circ g' : 'g \\circ f'})(x)$ and simplify.`,
    answer: { type: 'expression', value, maxTerms: 2 },
    hints: [fog ? 'Replace the $x$ in $f$ with the whole expression $g(x)$.' : 'Replace the $x$ in $g$ with the whole expression $f(x)$.'],
    solution: [`$= ${fog ? `${a}(${linTex(c, d)}) ${b < 0 ? '-' : '+'} ${Math.abs(b)}` : `${c}(${linTex(a, b)}) ${d < 0 ? '-' : '+'} ${Math.abs(d)}`} = ${linTex(A, B)}$`],
    placeholder: '6x - 1',
  };
}

function oneToOne(): Problem {
  const k = pick([
    { f: 'f(x) = 3x - 2', yes: true, why: 'Every horizontal line meets the graph of a non-horizontal line once.' },
    { f: 'f(x) = x^2', yes: false, why: '$f(2) = f(-2) = 4$: two inputs share an output, so a horizontal line crosses twice.' },
    { f: 'f(x) = x^3', yes: true, why: 'Different inputs always give different cubes.' },
    { f: 'f(x) = |x|', yes: false, why: '$f(3) = f(-3) = 3$.' },
    { f: 'f(x) = 2^x', yes: true, why: 'An exponential function is always increasing, so it never repeats an output.' },
    { f: 'f(x) = x^2 - 4x', yes: false, why: '$f(0) = f(4) = 0$.' },
  ]);
  return {
    skill: 'onetoone',
    prompt: `Is $\\;${k.f}\\;$ one-to-one?`,
    answer: choice(k.yes ? 'Yes — it has an inverse function' : 'No', [k.yes ? 'No' : 'Yes — it has an inverse function']),
    hints: ['A function is one-to-one if different inputs always give different outputs — the **horizontal-line test**.'],
    solution: [k.why],
  };
}

function inverse(): Problem {
  const kind = pick(['lin', 'lin', 'cube', 'frac'] as const);
  if (kind === 'cube') {
    const b = nz(6);
    return {
      skill: 'inverse',
      prompt: `Find $f^{-1}(x)$ for $\\;f(x) = x^3 ${b < 0 ? '-' : '+'} ${Math.abs(b)}$. (Type cbrt( ) for $\\sqrt[3]{\\;}$.)`,
      answer: { type: 'expression', value: `cbrt(x - (${b}))` },
      hints: ['Write $y = x^3 ' + (b < 0 ? '-' : '+') + ' ' + Math.abs(b) + '$, swap $x$ and $y$, then solve for $y$.'],
      solution: [`$x = y^3 ${b < 0 ? '-' : '+'} ${Math.abs(b)}$`, `$y^3 = x ${b < 0 ? '+' : '-'} ${Math.abs(b)}$`, `$f^{-1}(x) = \\sqrt[3]{x ${b < 0 ? '+' : '-'} ${Math.abs(b)}}$`],
      placeholder: 'cbrt(x - 2)',
    };
  }
  const a = pick([2, 3, 4, 5, -2, -3]), b = nz(9);
  return {
    skill: 'inverse',
    prompt: `Find $f^{-1}(x)$ for $\\;f(x) = ${linTex(a, b)}$.`,
    answer: { type: 'expression', value: `(x - (${b}))/(${a})` },
    hints: ['Replace $f(x)$ with $y$, **swap** $x$ and $y$, and solve for $y$.'],
    solution: [`$x = ${linTex(a, b).replace('x', 'y')}$`, `$${linTex(a, 0).replace('x', 'y')} = x ${b < 0 ? '+' : '-'} ${Math.abs(b)}$`, `$f^{-1}(x) = \\dfrac{x ${b < 0 ? '+' : '-'} ${Math.abs(b)}}{${a}}$`],
    mistakes: [{ answer: `1/(${a}x + ${b})`, feedback: '$f^{-1}$ is the inverse **function**, not the reciprocal $\\frac{1}{f(x)}$.' }],
    placeholder: '(x - 3)/2',
  };
}


/** Word problems: discount-then-coupon compositions, and inverse conversions. */
function functionWords(): Problem {
  if (Math.random() < 0.5) {
    const d = pick([10, 15, 20, 25, 30]), c = pick([5, 10, 15]), p = pick([40, 50, 60, 80, 100, 120]);
    const discountFirst = Math.random() < 0.5;
    const val = discountFirst ? (1 - d / 100) * p - c : (1 - d / 100) * (p - c);
    const m = +(1 - d / 100).toFixed(2);
    return {
      skill: 'apply',
      prompt: `A store takes ${d}% off a price, $f(p) = ${m}p$, and a coupon takes ${c} dollars off, $g(p) = p - ${c}$. ${discountFirst ? `The discount is applied **first**, then the coupon: the final price is $g(f(p))$.` : `The coupon is applied **first**, then the discount: the final price is $f(g(p))$.`} What do you pay for an item priced at ${p} dollars?`,
      answer: { type: 'number', value: +val.toFixed(2), tol: 0.001 },
      hints: [`Unknown: the final price. In a composition, the **inside** function acts first: ${discountFirst ? '$f$ (the discount)' : '$g$ (the coupon)'}.`, discountFirst ? `$f(${p}) = ${+(m * p).toFixed(2)}$, then apply $g$.` : `$g(${p}) = ${p - c}$, then apply $f$.`],
      solution: discountFirst
        ? [`$f(${p}) = ${m}(${p}) = ${+(m * p).toFixed(2)}$`, `$g(${+(m * p).toFixed(2)}) = ${+(m * p).toFixed(2)} - ${c} = ${+val.toFixed(2)}$ dollars`]
        : [`$g(${p}) = ${p} - ${c} = ${p - c}$`, `$f(${p - c}) = ${m}(${p - c}) = ${+val.toFixed(2)}$ dollars`],
      mistakes: [{ answer: String(+(discountFirst ? m * (p - c) : m * p - c).toFixed(2)), feedback: 'That applies the two steps in the other order. The inside function acts first.' }],
      placeholder: '30',
    };
  }
  const [what, fx, inv, unitIn, unitOut, a, b] = pick([
    ['A taxi charges', 'C(d) = 3 + 2d', 'd = \\dfrac{C - 3}{2}', 'kilometers', 'dollars', 2, 3],
    ['A plumber charges', 'C(h) = 40 + 60h', 'h = \\dfrac{C - 40}{60}', 'hours', 'dollars', 60, 40],
    ['A phone plan costs', 'C(g) = 15 + 5g', 'g = \\dfrac{C - 15}{5}', 'gigabytes', 'dollars', 5, 15],
  ] as [string, string, string, string, string, number, number][]);
  const x = randInt(2, 12), y = a * x + b;
  return {
    skill: 'apply',
    prompt: `${what} $${fx}$ ${unitOut} for $${fx[2]}$ ${unitIn}. Find the inverse function and use it: how many ${unitIn} cost ${y} ${unitOut}?`,
    answer: { type: 'number', value: x },
    hints: [`Unknown: the number of ${unitIn}. The inverse function goes **backwards**, from cost to ${unitIn}: solve $C = ${b} + ${a}${fx[2]}$ for $${fx[2]}$.`, `$${inv}$. Now put $C = ${y}$.`],
    solution: [`Inverse: $${inv}$`, `$${fx[2]} = \\dfrac{${y} - ${b}}{${a}} = ${x}$ ${unitIn}. Check: $${b} + ${a}(${x}) = ${y}$ ✓`],
    placeholder: '6',
  };
}

export const skills: Skill[] = [
  { id: 'value', label: 'Composition at a number', generate: composeValue },
  { id: 'expr', label: 'Composition formula', generate: composeExpr },
  { id: 'onetoone', label: 'One-to-one?', generate: oneToOne },
  { id: 'inverse', label: 'Find the inverse', generate: inverse },
  { id: 'apply', label: 'Word problems', generate: functionWords },
];

export const masterySet = makeMasterySet(skills);
