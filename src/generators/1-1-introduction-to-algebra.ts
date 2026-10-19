// Practice problem generators for Lesson 1.1 — Introduction to Algebra.
import { pick, randInt, randIntExcept, shuffle } from '../lib/random';
import type { Problem, Skill } from './types';

const LESSON = '1.1';

// ---------------------------------------------------------------------------
// Skill 1: Evaluate an algebraic expression
// ---------------------------------------------------------------------------

function evaluateProblem(): Problem {
  const kind = pick(['linear', 'product', 'quotient', 'two-var-sum', 'rectangle', 'triangle', 'distance'] as const);

  switch (kind) {
    case 'linear': {
      const a = randInt(2, 9);
      const b = randInt(1, 20);
      const x = randInt(2, 12);
      const v = pick(['x', 'n', 't']);
      const ans = a * x + b;
      return {
        skill: 'evaluate',
        prompt: `Evaluate $${a}${v} + ${b}$ when $${v} = ${x}$.`,
        answer: { type: 'number', value: ans },
        hints: [
          `$${a}${v}$ means $${a}$ **times** $${v}$.`,
          `Replace $${v}$ with $${x}$: $${a} \\cdot ${x} + ${b}$. Multiply first, then add.`,
        ],
        solution: [`$${a}${v} + ${b} = ${a} \\cdot ${x} + ${b}$`, `$= ${a * x} + ${b}$`, `$= ${ans}$`],
        mistakes: [
          { answer: String(Number(`${a}${x}`) + b), feedback: `It looks like you wrote $${a}$ and $${x}$ side by side to make $${a}${x}$. In algebra, $${a}${v}$ means $${a} \\cdot ${v}$, so multiply.` },
          { answer: String(a * (x + b)), feedback: 'You added before multiplying. Multiplication comes first, then addition.' },
        ],
      };
    }
    case 'product': {
      const x = randInt(2, 15);
      const y = randInt(2, 12);
      const [p, q] = pick([['x', 'y'], ['a', 'b'], ['m', 'n']] as const);
      return {
        skill: 'evaluate',
        prompt: `Evaluate $${p}${q}$ when $${p} = ${x}$ and $${q} = ${y}$.`,
        answer: { type: 'number', value: x * y },
        hints: [`Two letters written next to each other are multiplied: $${p}${q} = ${p} \\cdot ${q}$.`],
        solution: [`$${p}${q} = ${x} \\cdot ${y}$`, `$= ${x * y}$`],
        mistakes: [
          { answer: String(x + y), feedback: `You added. $${p}${q}$ means $${p}$ **times** $${q}$.` },
          { answer: `${x}${y}`, feedback: `$${p}${q}$ is not the digits side by side — it means $${x} \\cdot ${y}$.` },
        ],
      };
    }
    case 'quotient': {
      const y = randInt(2, 12);
      const q = randInt(2, 12);
      const x = y * q;
      return {
        skill: 'evaluate',
        prompt: `Evaluate $\\dfrac{a}{b}$ when $a = ${x}$ and $b = ${y}$.`,
        answer: { type: 'number', value: q },
        hints: ['The fraction bar means division: $\\frac{a}{b} = a \\div b$.'],
        solution: [`$\\dfrac{a}{b} = \\dfrac{${x}}{${y}}$`, `$= ${x} \\div ${y} = ${q}$`],
        mistakes: [{ answer: String(Math.round((y / x) * 1000) / 1000), feedback: 'You divided the bottom by the top. The top number is divided by the bottom one.' }],
      };
    }
    case 'two-var-sum': {
      const a = randInt(2, 6);
      const x = randInt(2, 10);
      const y = randInt(2, 10);
      const ans = a * x - y;
      return {
        skill: 'evaluate',
        prompt: `Evaluate $${a}x - y$ when $x = ${x}$ and $y = ${y}$.`,
        answer: { type: 'number', value: ans },
        hints: [`Substitute both values: $${a} \\cdot ${x} - ${y}$.`, 'Multiply first, then subtract.'],
        solution: [`$${a}x - y = ${a} \\cdot ${x} - ${y}$`, `$= ${a * x} - ${y}$`, `$= ${ans}$`],
        mistakes: [{ answer: String(a * (x - y)), feedback: 'You subtracted before multiplying. Do the multiplication $' + `${a} \\cdot ${x}` + '$ first.' }],
      };
    }
    case 'rectangle': {
      const l = randInt(4, 20);
      const w = randInt(2, 12);
      return {
        skill: 'evaluate',
        prompt: `The area of a rectangle is $A = lw$. Find the area when the length is $${l}$ cm and the width is $${w}$ cm. (Enter just the number.)`,
        answer: { type: 'number', value: l * w },
        hints: ['$lw$ means $l \\cdot w$.', `Substitute: $A = ${l} \\cdot ${w}$.`],
        solution: [`$A = lw = ${l} \\cdot ${w}$`, `$= ${l * w}$, so the area is $${l * w}\\text{ cm}^2$`],
        mistakes: [{ answer: String(2 * l + 2 * w), feedback: 'That is the perimeter (the distance around). Area uses $lw$.' }],
      };
    }
    case 'triangle': {
      const b = 2 * randInt(2, 10);
      const h = randInt(3, 15);
      const ans = (b * h) / 2;
      return {
        skill: 'evaluate',
        prompt: `The area of a triangle is $A = \\tfrac{1}{2}bh$. Find the area when the base is $${b}$ m and the height is $${h}$ m. (Enter just the number.)`,
        answer: { type: 'number', value: ans },
        hints: [`Substitute: $A = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h}$.`, `Half of $${b}$ is $${b / 2}$.`],
        solution: [`$A = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h}$`, `$= ${b / 2} \\cdot ${h}$`, `$= ${ans}$, so the area is $${ans}\\text{ m}^2$`],
        mistakes: [{ answer: String(b * h), feedback: 'Don\'t forget the $\\tfrac{1}{2}$ — a triangle is half of a rectangle.' }],
      };
    }
    case 'distance': {
      const r = pick([40, 45, 50, 55, 60, 65, 70, 80, 90, 100]);
      const t = randInt(2, 6);
      return {
        skill: 'evaluate',
        prompt: `Distance traveled is $d = rt$ (rate × time). A car drives at $${r}$ km/h for $${t}$ hours. How many kilometers does it travel?`,
        answer: { type: 'number', value: r * t },
        hints: ['$rt$ means $r \\cdot t$.'],
        solution: [`$d = rt = ${r} \\cdot ${t}$`, `$= ${r * t}$ km`],
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Skill 2: Translate a phrase into an algebraic expression
// ---------------------------------------------------------------------------

interface Phrase {
  text: (n: number, v: string) => string;
  expr: (n: number, v: string) => string;
  tex: (n: number, v: string) => string;
  keyword: string;
  wrong?: (n: number, v: string) => { answer: string; feedback: string };
}

const phrases: Phrase[] = [
  { text: (n, v) => `${n} more than ${v}`, expr: (n, v) => `${v} + ${n}`, tex: (n, v) => `${v} + ${n}`, keyword: '"more than" means add' },
  { text: (n, v) => `${v} increased by ${n}`, expr: (n, v) => `${v} + ${n}`, tex: (n, v) => `${v} + ${n}`, keyword: '"increased by" means add' },
  { text: (n, v) => `the sum of ${v} and ${n}`, expr: (n, v) => `${v} + ${n}`, tex: (n, v) => `${v} + ${n}`, keyword: '"sum" means add' },
  {
    text: (n, v) => `${n} less than ${v}`,
    expr: (n, v) => `${v} - ${n}`,
    tex: (n, v) => `${v} - ${n}`,
    keyword: '"less than" means subtract — and it flips the order',
    wrong: (n, v) => ({ answer: `${n} - ${v}`, feedback: `Careful: "${n} less than ${v}" means start with $${v}$ and take $${n}$ away, so it's $${v} - ${n}$, not $${n} - ${v}$.` }),
  },
  { text: (n, v) => `${v} decreased by ${n}`, expr: (n, v) => `${v} - ${n}`, tex: (n, v) => `${v} - ${n}`, keyword: '"decreased by" means subtract' },
  {
    text: (n, v) => `${v} subtracted from ${n}`,
    expr: (n, v) => `${n} - ${v}`,
    tex: (n, v) => `${n} - ${v}`,
    keyword: '"subtracted from" means subtract — and it flips the order',
    wrong: (n, v) => ({ answer: `${v} - ${n}`, feedback: `"${v} subtracted from ${n}" means start with $${n}$ and take $${v}$ away: $${n} - ${v}$.` }),
  },
  { text: (n, v) => `the difference of ${v} and ${n}`, expr: (n, v) => `${v} - ${n}`, tex: (n, v) => `${v} - ${n}`, keyword: '"difference" means subtract, in the order given' },
  { text: (n, v) => `${n} times ${v}`, expr: (n, v) => `${n}${v}`, tex: (n, v) => `${n}${v}`, keyword: '"times" means multiply' },
  { text: (n, v) => `the product of ${n} and ${v}`, expr: (n, v) => `${n}${v}`, tex: (n, v) => `${n}${v}`, keyword: '"product" means multiply' },
  { text: (_n, v) => `twice ${v}`, expr: (_n, v) => `2${v}`, tex: (_n, v) => `2${v}`, keyword: '"twice" means multiply by 2' },
  {
    text: (n, v) => `${v} divided by ${n}`,
    expr: (n, v) => `${v}/${n}`,
    tex: (n, v) => `\\frac{${v}}{${n}}`,
    keyword: '"divided by" means divide',
    wrong: (n, v) => ({ answer: `${n}/${v}`, feedback: `The number being divided comes first: $${v} \\div ${n} = \\frac{${v}}{${n}}$.` }),
  },
  {
    text: (n, v) => `the quotient of ${n} and ${v}`,
    expr: (n, v) => `${n}/${v}`,
    tex: (n, v) => `\\frac{${n}}{${v}}`,
    keyword: '"quotient" means divide, in the order given',
    wrong: (n, v) => ({ answer: `${v}/${n}`, feedback: `"The quotient of ${n} and ${v}" keeps the order: $\\frac{${n}}{${v}}$.` }),
  },
  {
    text: (n, v) => `the sum of twice ${v} and ${n}`,
    expr: (n, v) => `2${v} + ${n}`,
    tex: (n, v) => `2${v} + ${n}`,
    keyword: 'first double the number, then add',
    wrong: (n, v) => ({ answer: `2(${v} + ${n})`, feedback: `That would be "twice the sum". Here you double $${v}$ first, then add: $2${v} + ${n}$.` }),
  },
  {
    text: (n, v) => `twice the sum of ${v} and ${n}`,
    expr: (n, v) => `2(${v} + ${n})`,
    tex: (n, v) => `2(${v} + ${n})`,
    keyword: 'find the sum first, then double it — you need parentheses',
    wrong: (n, v) => ({ answer: `2${v} + ${n}`, feedback: `This doubles only $${v}$. "Twice the sum" doubles the whole sum, so you need parentheses: $2(${v} + ${n})$.` }),
  },
  {
    text: (n, v) => `${n}% of ${v}`,
    expr: (n, v) => `${n / 100}${v}`,
    tex: (n, v) => `${n / 100}${v}`,
    keyword: '"% of" means multiply by the percent written as a decimal',
  },
];

function translateProblem(): Problem {
  const p = pick(phrases);
  const v = pick(['x', 'y', 'n', 't', 'm']);
  const n = p.text(1, v).includes('%') ? pick([10, 20, 25, 40, 75]) : randInt(3, 15);
  const wrong = p.wrong?.(n, v);
  return {
    skill: 'translate',
    prompt: `Translate to an algebraic expression: **${p.text(n, v)}**`,
    answer: { type: 'expression', value: p.expr(n, v) },
    hints: [`Key words: ${p.keyword}.`],
    solution: [`"${p.text(n, v)}" $\\;\\rightarrow\\; ${p.tex(n, v)}$`],
    mistakes: wrong ? [wrong] : [],
    placeholder: `e.g. 3${v} + 1`,
  };
}

// ---------------------------------------------------------------------------
// Skill 3: Decide whether a number is a solution of an equation
// ---------------------------------------------------------------------------

function solutionProblem(): Problem {
  const kind = pick(['add', 'mul', 'div', 'sub'] as const);
  const x = randInt(2, 15);
  let tex: string;
  let check: (c: number) => string;
  let ok: (c: number) => boolean;

  if (kind === 'add') {
    const a = randInt(2, 30);
    tex = `x + ${a} = ${x + a}`;
    check = (c) => `${c} + ${a} = ${c + a}`;
    ok = (c) => c + a === x + a;
  } else if (kind === 'mul') {
    const a = randInt(2, 9);
    tex = `${a}x = ${a * x}`;
    check = (c) => `${a} \\cdot ${c} = ${a * c}`;
    ok = (c) => a * c === a * x;
  } else if (kind === 'div') {
    const a = randInt(2, 6);
    const big = x * a;
    tex = `\\frac{x}{${a}} = ${x}`;
    check = (c) => `\\frac{${c}}{${a}} = ${Number.isInteger(c / a) ? c / a : (c / a).toFixed(2)}`;
    ok = (c) => c === big;
    const candidate = pick([big, x, big + a]);
    return finishSolution(tex, candidate, ok, check, big);
  } else {
    const a = x + randInt(3, 20);
    tex = `${a} - x = ${a - x}`;
    check = (c) => `${a} - ${c} = ${a - c}`;
    ok = (c) => a - c === a - x;
  }
  const candidate = Math.random() < 0.5 ? x : randIntExcept(Math.max(1, x - 4), x + 4, [x]);
  return finishSolution(tex, candidate, ok, check, x);
}

function finishSolution(tex: string, c: number, ok: (c: number) => boolean, check: (c: number) => string, truth: number): Problem {
  const yes = ok(c);
  const rhs = tex.split('=')[1].trim();
  return {
    skill: 'solution',
    prompt: `Is $${c}$ a solution of $${tex}$?`,
    answer: { type: 'choice', options: ['Yes, it is a solution', 'No, it is not a solution'], correct: yes ? 0 : 1 },
    hints: [`Substitute $${c}$ for $x$ on the left side and see whether you get $${rhs}$.`],
    solution: [
      `Substitute $x = ${c}$: $\\;${check(c)}$`,
      yes
        ? `That matches the right side, $${rhs}$, so the equation is **true**. $${c}$ **is** a solution.`
        : `That does not equal $${rhs}$, so the equation is **false**. $${c}$ is **not** a solution. (The solution is $${truth}$.)`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Skill 4: Translate a sentence into an equation
// ---------------------------------------------------------------------------

function equationProblem(): Problem {
  const a = randInt(4, 60);
  const b = randInt(2, 12);
  const x = randInt(3, 25);
  const templates = [
    { text: `What number plus ${a} is ${a + x}?`, eq: `x + ${a} = ${a + x}`, tex: `x + ${a} = ${a + x}`, hint: '"plus" means $+$ and "is" means $=$.' },
    { text: `${b} times what number is ${b * x}?`, eq: `${b}x = ${b * x}`, tex: `${b}x = ${b * x}`, hint: '"times" means multiply and "is" means $=$.' },
    { text: `${a} more than a number is ${a + x}. (Use $x$ for the number.)`, eq: `x + ${a} = ${a + x}`, tex: `x + ${a} = ${a + x}`, hint: '"more than" means add.' },
    { text: `A number minus ${b} equals ${x}. (Use $x$ for the number.)`, eq: `x - ${b} = ${x}`, tex: `x - ${b} = ${x}`, hint: '"minus" means subtract and "equals" means $=$.' },
    { text: `A number divided by ${b} is ${x}. (Use $x$ for the number.)`, eq: `x/${b} = ${x}`, tex: `\\frac{x}{${b}} = ${x}`, hint: '"divided by" means divide.' },
    {
      text: `Hana saved some money. After she earned ${a} more riyals, she had ${a + x * 5} riyals. Write an equation for the amount she started with. (Use $x$.)`,
      eq: `x + ${a} = ${a + x * 5}`,
      tex: `x + ${a} = ${a + x * 5}`,
      hint: 'Start amount + money earned = final amount.',
    },
  ];
  const t = pick(templates);
  return {
    skill: 'equation',
    prompt: `Translate to an equation: **${t.text}**`,
    answer: { type: 'equation', value: t.eq },
    hints: [t.hint, 'Replace "what number" (or "a number") with $x$.'],
    solution: [`$${t.tex}$`],
    placeholder: 'e.g. x + 3 = 10',
  };
}

export const skills: Skill[] = [
  { id: 'evaluate', label: 'Evaluate expressions', generate: evaluateProblem },
  { id: 'translate', label: 'Translate phrases', generate: translateProblem },
  { id: 'solution', label: 'Check solutions', generate: solutionProblem },
  { id: 'equation', label: 'Write equations', generate: equationProblem },
];

export const lessonId = LESSON;

/** A fresh mixed set for the mastery check: covers every skill at least once. */
export function masterySet(size = 6): ReturnType<Skill['generate']>[] {
  const base = skills.map((s) => s.generate());
  const extra = Array.from({ length: Math.max(0, size - base.length) }, () => pick(skills).generate());
  return shuffle([...base, ...extra]);
}
