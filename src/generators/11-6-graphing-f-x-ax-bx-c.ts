// Practice problem generators for Lesson 11.6 — Graphing f(x) = ax² + bx + c.
import { choice, makeMasterySet, nz, pick, randInt } from './helpers';
import { quadRoots, quadTex } from './quad';
import type { Problem, Skill } from './types';

function rand() {
  const a = pick([1, -1, 2, -2, 3]), h = randInt(-4, 4), k = randInt(-6, 6);
  return { a, h, k, b: -2 * a * h, c: a * h * h + k };
}

function vertex(): Problem {
  const { a, b, c, h, k } = rand();
  return {
    skill: 'vertex',
    prompt: `Find the vertex of $\\;f(x) = ${quadTex(a, b, c)}$.`,
    answer: { type: 'point', x: h, y: k },
    hints: ['The $x$-coordinate of the vertex is $-\\dfrac{b}{2a}$.', 'Substitute it into $f$ to get the $y$-coordinate.'],
    solution: [`$x = -\\dfrac{${b}}{2(${a})} = ${h}$`, `$f(${h}) = ${k}$`, `Vertex: $(${h}, ${k})$`],
    placeholder: '(1, -4)',
  };
}

function vertexForm(): Problem {
  const { a, b, c, h, k } = rand();
  const f = (A: number, H: number, K: number) => `${A === 1 ? '' : A === -1 ? '-' : A}(x ${H < 0 ? '+' : '-'} ${Math.abs(H)})^2 ${K < 0 ? '-' : '+'} ${Math.abs(K)}`.replace('(x - 0)', 'x').replace('(x + 0)', 'x').replace(' + 0', '').replace(' - 0', '');
  const correct = `$f(x) = ${f(a, h, k)}$`;
  const wrong = [`$f(x) = ${f(a, -h, k)}$`, `$f(x) = ${f(a, h, c)}$`, `$f(x) = ${f(1, h, k)}$`].filter((w) => w !== correct);
  return {
    skill: 'form',
    prompt: `Complete the square to write $\\;f(x) = ${quadTex(a, b, c)}\\;$ in the form $a(x - h)^2 + k$.`,
    answer: choice(correct, wrong),
    hints: [a === 1 ? `Add and subtract $\\left(\\frac{${b}}{2}\\right)^2 = ${(b / 2) ** 2}$.` : `First factor $${a}$ out of the $x^2$ and $x$ terms.`, 'Or: find the vertex $(h, k)$ with $h = -\\frac{b}{2a}$, $k = f(h)$; the value of $a$ does not change.'],
    solution: [`Vertex $(${h}, ${k})$, and $a = ${a}$: ${correct}`],
  };
}

function intercepts(): Problem {
  for (;;) {
    const p = nz(6), q = nz(6), a = pick([1, -1, 2]);
    if (p === q) continue;
    const b = -a * (p + q), c = a * p * q;
    const Q = quadRoots(a, b, c);
    const yi = Math.random() < 0.35;
    if (yi)
      return {
        skill: 'intercepts',
        prompt: `Find the $y$-intercept of $\\;f(x) = ${quadTex(a, b, c)}$.`,
        answer: { type: 'point', x: 0, y: c },
        hints: ['The $y$-intercept is $(0, f(0))$.'],
        solution: [`$f(0) = ${c}$, so the $y$-intercept is $(0, ${c})$.`],
        placeholder: '(0, 5)',
      };
    return {
      skill: 'intercepts',
      prompt: `Find the $x$-intercepts of $\\;f(x) = ${quadTex(a, b, c)}$. (Give the $x$-values.)`,
      answer: { type: 'solutions', values: Q.real, variable: 'x' },
      hints: ['Solve $f(x) = 0$ — by factoring or with the quadratic formula.'],
      solution: [`$${quadTex(a, b, c)} = 0$`, `$${Q.tex}$`],
      placeholder: '-2, 3',
    };
  }
}

function plotVertex(): Problem {
  const { a, b, c, h, k } = rand();
  return {
    skill: 'plot',
    prompt: `Click the vertex of $\\;f(x) = ${quadTex(a, b, c)}$.`,
    answer: { type: 'plot', mode: 'point', x: h, y: k },
    hints: ['$x = -\\dfrac{b}{2a}$, then $y = f(x)$.'],
    solution: [`$x = ${h}$, $f(${h}) = ${k}$: vertex $(${h}, ${k})$.`],
  };
}


const money = (n: number) => `${n.toLocaleString('en-US')} dollars`;

/** Word problems: the vertex answers "how high", "when", "what price", "how many". */
function applied(): Problem {
  const kind = pick(['ball', 'ballm', 'revenue', 'profit'] as const);
  if (kind === 'ball' || kind === 'ballm') {
    const metric = kind === 'ballm';
    const g = metric ? 5 : 16;
    const t = pick([1, 1.5, 2, 2.5, 3, 3.5, 4]);
    const v = 2 * g * t, h0 = metric ? randInt(1, 3) * 1 : pick([0, 4, 5, 6]);
    const H = h0 + g * t * t;
    const u = metric ? 'm' : 'ft';
    const who = h0 === 0 ? pick(['A ball is kicked straight up from the ground', 'A model rocket is launched from the ground']) : pick(['A ball is thrown straight up', 'A stone is tossed upward from the edge of a roof', 'A model rocket is launched from a platform']);
    const askTime = Math.random() < 0.4;
    const hTex = `h(t) = -${g}t^2 + ${v}t${h0 ? ` + ${h0}` : ''}`;
    return {
      skill: 'apply',
      prompt: `${who}. Its height after $t$ seconds is $${hTex}$ (${u}). ${askTime ? 'After how many seconds does it reach its **highest point**?' : 'What is the **maximum height** it reaches (in ' + u + ')?'}`,
      answer: { type: 'number', value: askTime ? t : H },
      hints: [
        `The unknown: ${askTime ? 'the **time** $t$ of the highest point' : 'the **height** at the highest point'}. Key words: "highest" / "maximum" mean the **vertex** (here $a = -${g} < 0$, so the parabola opens down).`,
        `Time of the vertex: $t = -\\dfrac{b}{2a} = -\\dfrac{${v}}{2(-${g})}$.${askTime ? '' : ' Then substitute that $t$ into $h(t)$.'}`,
      ],
      solution: [
        `$t = -\\dfrac{${v}}{2(-${g})} = ${t}$ s`,
        `$h(${t}) = -${g}(${t})^2 + ${v}(${t})${h0 ? ` + ${h0}` : ''} = ${H}$ ${u}`,
        askTime ? `It reaches its highest point after $${t}$ seconds.` : `The maximum height is $${H}$ ${u} (after $${t}$ s).`,
      ],
      mistakes: askTime ? [{ answer: String(H), feedback: 'That is the maximum **height**. The question asks **when** — the $t$-coordinate of the vertex.' }] : [{ answer: String(t), feedback: `That is the **time** of the highest point. The question asks for the height: substitute $t = ${t}$ into $h(t)$.` }],
      placeholder: askTime ? '2' : '69',
    };
  }
  if (kind === 'revenue') {
    const k = pick([2, 4, 5, 10]), p = randInt(4, 30), N = 2 * k * p;
    const R = p * (N - k * p);
    const item = pick(['concert tickets', 'T-shirts', 'phone cases', 'pizzas']);
    const askPrice = Math.random() < 0.5;
    return {
      skill: 'apply',
      prompt: `A shop sells ${item}. At a price of $p$ dollars it sells $${N} - ${k}p$ of them, so its revenue is $R(p) = p(${N} - ${k}p) = -${k}p^2 + ${N}p$. ${askPrice ? 'What price gives the **greatest revenue** (in dollars)?' : 'What is the **greatest revenue** possible (in dollars)?'}`,
      answer: { type: 'number', value: askPrice ? p : R },
      hints: [
        `The unknown: ${askPrice ? 'the **price** $p$' : 'the **revenue** $R$'} at the top of the graph. "Greatest" means the **vertex** ($a = -${k} < 0$, so it opens down).`,
        `$p = -\\dfrac{b}{2a} = -\\dfrac{${N}}{2(-${k})}$.${askPrice ? '' : ' Then find $R$ at that price.'}`,
      ],
      solution: [`$p = -\\dfrac{${N}}{2(-${k})} = ${p}$`, `$R(${p}) = ${p}(${N} - ${k * p}) = ${p} \\cdot ${N - k * p} = ${R}$`, askPrice ? `A price of ${money(p)} gives the greatest revenue.` : `The greatest revenue is ${money(R)} (at a price of ${money(p)}).`],
      mistakes: askPrice ? [{ answer: String(R), feedback: 'That is the revenue. The question asks for the **price** — the $p$-coordinate of the vertex.' }] : [{ answer: String(p), feedback: 'That is the best **price**. Substitute it into $R(p)$ to get the revenue.' }],
      placeholder: askPrice ? '15' : '900',
    };
  }
  // Profit is negative with no cakes (fixed costs), so c < 0.
  let k = 1, h = 10, M = 500;
  do { k = pick([1, 2, 3, 5]); h = randInt(15, 60); M = randInt(5, 40) * 100; } while (M >= k * h * h);
  const b = 2 * k * h, c = M - k * h * h;
  const askX = Math.random() < 0.5;
  return {
    skill: 'apply',
    prompt: `A bakery's weekly profit from making $x$ cakes is $P(x) = ${quadTex(-k, b, c)}$ dollars. ${askX ? 'How many cakes give the **maximum profit**?' : 'What is the **maximum weekly profit** (in dollars)?'}`,
    answer: { type: 'number', value: askX ? h : M },
    hints: [
      `The unknown: ${askX ? 'the **number of cakes** $x$' : 'the **profit** $P$'} at the top of the graph. "Maximum" means the **vertex** ($a = -${k}$).`,
      `$x = -\\dfrac{b}{2a} = -\\dfrac{${b}}{2(-${k})}$.${askX ? '' : ' Then evaluate $P$ there.'}`,
    ],
    solution: [`$x = -\\dfrac{${b}}{2(-${k})} = ${h}$`, `$P(${h}) = -${k === 1 ? '' : k}(${h})^2 + ${b}(${h}) ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${M}$`, askX ? `Making $${h}$ cakes gives the maximum profit.` : `The maximum weekly profit is ${money(M)} (with $${h}$ cakes).`],
    mistakes: askX ? [{ answer: String(M), feedback: 'That is the profit. The question asks **how many cakes** — the $x$-coordinate of the vertex.' }] : [{ answer: String(h), feedback: 'That is the number of cakes. Substitute it into $P(x)$ for the profit.' }],
    placeholder: askX ? '40' : '2000',
  };
}

export const skills: Skill[] = [
  { id: 'vertex', label: 'Vertex with −b/2a', generate: vertex },
  { id: 'form', label: 'Vertex form', generate: vertexForm },
  { id: 'intercepts', label: 'Intercepts', generate: intercepts },
  { id: 'plot', label: 'Plot the vertex', generate: plotVertex },
  { id: 'apply', label: 'Word problems', generate: applied },
];

export const masterySet = makeMasterySet(skills);
