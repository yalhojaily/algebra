// Practice problem generators for Lesson 2.6 — Applications and Problem Solving.
import { makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

const fiveSteps = (translate: string, solve: string[], check: string, state: string) => [
  `**Translate:** ${translate}`,
  ...solve.map((s, i) => (i === 0 ? `**Solve:** ${s}` : s)),
  `**Check:** ${check}`,
  `**State:** ${state}`,
];

function consecutive(): Problem {
  const kind = pick(['int', 'even', 'odd'] as const);
  const count = pick([2, 3]);
  const step = kind === 'int' ? 1 : 2;
  let x = randInt(-20, 60);
  if (kind === 'even' && x % 2) x++;
  if (kind === 'odd' && x % 2 === 0) x++;
  const xs = Array.from({ length: count }, (_, i) => x + i * step);
  const S = xs.reduce((a, b) => a + b, 0);
  const word = kind === 'int' ? 'consecutive integers' : `consecutive ${kind} integers`;
  const terms = xs.map((_, i) => (i === 0 ? 'x' : `x + ${i * step}`));
  const k = (count * (count - 1) * step) / 2;
  return {
    skill: 'consecutive',
    prompt: `The sum of ${count} ${word} is $${S}$. What is the **smallest** of them?`,
    answer: { type: 'number', value: x },
    hints: [`Let the smallest be $x$. The others are ${terms.slice(1).map((t) => `$${t}$`).join(' and ')}.`, `Write their sum: $${terms.join(' + ')} = ${S}$.`],
    solution: fiveSteps(
      `$${terms.map((t) => (t === 'x' ? t : `(${t})`)).join(' + ')} = ${S}$`,
      [`$${count}x + ${k} = ${S}$`, `$${count}x = ${S - k}$`, `$x = ${x}$`],
      `$${xs.join(' + ').replace(/\+ -/g, '- ')} = ${S}$ ✓`,
      `The integers are ${xs.map((n) => `$${n}$`).join(', ')}; the smallest is $${x}$.`,
    ),
  };
}

function perimeter(): Problem {
  const w = randInt(3, 30);
  const k = randInt(2, 15);
  const twice = Math.random() < 0.4;
  const l = twice ? 2 * w + k : w + k;
  const P = 2 * l + 2 * w;
  const ask = pick(['width', 'length'] as const);
  return {
    skill: 'perimeter',
    prompt: `The length of a rectangular field is ${twice ? `$${k}$ m more than twice` : `$${k}$ m more than`} the width. The perimeter is $${P}$ m. Find the **${ask}**.`,
    answer: { type: 'number', value: ask === 'width' ? w : l },
    hints: [`Let $w$ = the width. Then the length is $${twice ? `2w + ${k}` : `w + ${k}`}$.`, `Use $P = 2l + 2w$.`],
    solution: fiveSteps(
      `$2(${twice ? `2w + ${k}` : `w + ${k}`}) + 2w = ${P}$`,
      [`$${twice ? `4w + ${2 * k}` : `2w + ${2 * k}`} + 2w = ${P}$`, `$${twice ? 6 : 4}w = ${P - 2 * k}$`, `$w = ${w}$, so the length is $${l}$`],
      `$2 \\cdot ${l} + 2 \\cdot ${w} = ${P}$ ✓`,
      `The width is $${w}$ m and the length is $${l}$ m.`,
    ),
    mistakes: [{ answer: String(ask === 'width' ? l : w), feedback: `That's the ${ask === 'width' ? 'length' : 'width'}. Read the question again.` }],
  };
}

function angles(): Problem {
  for (;;) {
    const m = randInt(2, 4);
    const k = randInt(-20, 30);
    // The angles x, mx and x + k must add to 180, so x = (180 − k) / (m + 2).
    const xx = (180 - k) / (m + 2);
    if (!Number.isInteger(xx) || xx <= 0 || xx + k <= 0) continue;
    {
      const a2 = m * xx, a3 = xx + k;
      return {
        skill: 'angles',
        prompt: `In a triangle, the second angle is ${m === 2 ? 'twice' : m === 3 ? 'three times' : 'four times'} the first. The third angle is ${k >= 0 ? `$${k}^\\circ$ more` : `$${-k}^\\circ$ less`} than the first. Find the measure of the **first** angle (in degrees).`,
        answer: { type: 'number', value: xx },
        hints: ['The angles of any triangle add up to $180^\\circ$.', `Let the first angle be $x$. The others are $${m}x$ and $x ${k >= 0 ? '+' : '-'} ${Math.abs(k)}$.`],
        solution: fiveSteps(
          `$x + ${m}x + (x ${k >= 0 ? '+' : '-'} ${Math.abs(k)}) = 180$`,
          [`$${m + 2}x ${k >= 0 ? '+' : '-'} ${Math.abs(k)} = 180$`, `$${m + 2}x = ${180 - k}$`, `$x = ${xx}$`],
          `$${xx} + ${a2} + ${a3} = 180$ ✓`,
          `The angles are $${xx}^\\circ$, $${a2}^\\circ$, and $${a3}^\\circ$.`,
        ),
      };
    }
  }
}

function pieces(): Problem {
  const short = randInt(5, 60);
  const kind = pick(['more', 'times'] as const);
  const k = kind === 'more' ? randInt(3, 30) : randInt(2, 4);
  const long = kind === 'more' ? short + k : short * k;
  const L = short + long;
  return {
    skill: 'pieces',
    prompt: `A $${L}$-cm ribbon is cut into two pieces. One piece is ${kind === 'more' ? `$${k}$ cm longer than` : `${k === 2 ? 'twice' : k === 3 ? 'three times' : 'four times'} as long as`} the other. How long is the **shorter** piece?`,
    answer: { type: 'number', value: short },
    hints: [`Let $x$ = the shorter piece. The longer piece is $${kind === 'more' ? `x + ${k}` : `${k}x`}$.`, `The two pieces add up to $${L}$.`],
    solution: fiveSteps(
      `$x + ${kind === 'more' ? `(x + ${k})` : `${k}x`} = ${L}$`,
      kind === 'more' ? [`$2x + ${k} = ${L}$`, `$2x = ${L - k}$`, `$x = ${short}$`] : [`$${k + 1}x = ${L}$`, `$x = ${short}$`],
      `$${short} + ${long} = ${L}$ ✓`,
      `The pieces are $${short}$ cm and $${long}$ cm.`,
    ),
    mistakes: [{ answer: String(long), feedback: 'That is the **longer** piece.' }],
  };
}

function rates(): Problem {
  const base = pick([10, 15, 20, 25, 40]);
  const rate = pick([0.5, 1.5, 2, 2.5, 3]);
  const n = randInt(4, 60);
  const total = base + rate * n;
  return {
    skill: 'rates',
    prompt: `A taxi charges $${base}$ riyals plus $${rate}$ riyals per kilometer. A ride cost $${total}$ riyals. How many kilometers was the ride?`,
    answer: { type: 'number', value: n },
    hints: [`Let $k$ = the number of kilometers. Cost $= ${base} + ${rate}k$.`],
    solution: fiveSteps(`$${base} + ${rate}k = ${total}$`, [`$${rate}k = ${total - base}$`, `$k = ${n}$`], `$${base} + ${rate} \\cdot ${n} = ${total}$ ✓`, `The ride was $${n}$ km.`),
    mistakes: [{ answer: String(+(total / rate).toFixed(4)), feedback: `Don't forget the starting fee of $${base}$ riyals: subtract it first.` }],
  };
}

export const skills: Skill[] = [
  { id: 'consecutive', label: 'Consecutive integers', generate: consecutive },
  { id: 'perimeter', label: 'Perimeter', generate: perimeter },
  { id: 'angles', label: 'Triangle angles', generate: angles },
  { id: 'pieces', label: 'Cutting into pieces', generate: pieces },
  { id: 'rates', label: 'Fees & rates', generate: rates },
];

export const masterySet = makeMasterySet(skills);
