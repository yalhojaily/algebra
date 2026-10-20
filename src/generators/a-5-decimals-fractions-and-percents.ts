// Practice problem generators for Appendix A.5 — Decimals, Fractions and Percents.
import { fmt, fracTex, gcd, makeMasterySet, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

/** Fractions whose decimals terminate (denominator has only 2s and 5s). */
function terminating(): [number, number] {
  for (;;) {
    const d = pick([2, 4, 5, 8, 10, 16, 20, 25, 40, 50]);
    const n = randInt(1, d === 2 ? 3 : Math.min(2 * d - 1, 40));
    if (gcd(n, d) === 1) return [n, d];
  }
}

function fracToDec(): Problem {
  if (Math.random() < 0.25) {
    const [n, d] = pick([[1, 3], [2, 3], [1, 6], [5, 6], [1, 7], [2, 9], [4, 9], [5, 12], [7, 12], [1, 11]] as [number, number][]);
    const v = Math.round((n / d) * 100) / 100;
    return {
      skill: 'fracdec',
      prompt: `Write $\\dfrac{${n}}{${d}}$ as a decimal, rounded to the nearest hundredth.`,
      answer: { type: 'number', value: v, decimal: true, tol: 0.0001 },
      hints: [`Divide: $${n} \\div ${d}$. This decimal repeats forever, so round it.`, 'Look at the thousandths digit to decide whether to round up.'],
      solution: [`$${n} \\div ${d} = ${(n / d).toFixed(4)}\\ldots$`, `Rounded to hundredths: $${v.toFixed(2)}$`],
      placeholder: '0.33',
    };
  }
  const [n, d] = terminating();
  const v = n / d;
  const p = 10 ** (String(fmt(v)).split('.')[1]?.length ?? 0);
  const scale = p / d;
  return {
    skill: 'fracdec',
    prompt: `Write $\\dfrac{${n}}{${d}}$ as a decimal.`,
    answer: { type: 'number', value: v, decimal: true },
    hints: [`A fraction bar means divide: $${n} \\div ${d}$.`, Number.isInteger(scale) && scale > 1 ? `Or: multiply top and bottom by $${scale}$ to get a denominator of $${p}$.` : 'Long division works every time.'],
    solution: Number.isInteger(scale) && scale > 1
      ? [`$\\dfrac{${n}}{${d}} = \\dfrac{${n} \\cdot ${scale}}{${d} \\cdot ${scale}} = \\dfrac{${n * scale}}{${p}} = ${fmt(v)}$`]
      : [`$${n} \\div ${d} = ${fmt(v)}$`],
    placeholder: '0.375',
  };
}

function decToFrac(): Problem {
  for (;;) {
    const places = pick([1, 2, 2, 3]);
    const p = 10 ** places;
    const k = randInt(1, places === 3 ? 1999 : 2 * p - 1);
    if (k % 10 === 0) continue;
    const g = gcd(k, p);
    if (g === 1 && Math.random() < 0.6) continue; // prefer ones that reduce
    const v = k / p;
    return {
      skill: 'decfrac',
      prompt: `Write $${fmt(v)}$ as a fraction in lowest terms.`,
      answer: { type: 'number', value: v, lowest: true },
      hints: [`The last digit is in the ${['tenths', 'hundredths', 'thousandths'][places - 1]} place, so write it over $${p}$.`, 'Then reduce by dividing top and bottom by their GCD.'],
      solution: [`$${fmt(v)} = \\dfrac{${k}}{${p}}${g > 1 ? ` = \\dfrac{${k} \\div ${g}}{${p} \\div ${g}} = ${fracTex(k, p)}` : ''}$`],
      mistakes: g > 1 ? [{ answer: `${k}/${p}`, feedback: `Right value, but reduce it: ${k} and ${p} are both divisible by ${g}.` }] : [],
      placeholder: '7/20',
    };
  }
}

function percentDecimal(): Problem {
  const v = pick([randInt(1, 99) / 100, randInt(1, 999) / 1000, randInt(101, 250) / 100, randInt(1, 9) / 1000]);
  const pct = Math.round(v * 100000) / 1000;
  if (Math.random() < 0.5) {
    return {
      skill: 'percent',
      prompt: `Write $${fmt(v)}$ as a percent.`,
      answer: { type: 'number', value: pct, percent: true },
      hints: ['Percent means "per hundred". Multiply by 100: move the decimal point **two places right**.'],
      solution: [`$${fmt(v)} \\times 100 = ${fmt(pct)}$, so $${fmt(v)} = ${fmt(pct)}\\%$`],
      mistakes: [{ answer: `${fmt(v / 100)}%`, feedback: 'You moved the decimal point the wrong way. Decimal → percent: move it two places to the **right**.' }, { answer: `${fmt(v)}%`, feedback: `$${fmt(v)}\\%$ is less than 1 percent. Multiply by 100 first.` }],
      placeholder: '37.5%',
    };
  }
  return {
    skill: 'percent',
    prompt: `Write $${fmt(pct)}\\%$ as a decimal.`,
    answer: { type: 'number', value: v, decimal: true },
    hints: ['Divide by 100: move the decimal point **two places left**.'],
    solution: [`$${fmt(pct)}\\% = \\dfrac{${fmt(pct)}}{100} = ${fmt(v)}$`],
    mistakes: [{ answer: fmt(pct * 100), feedback: 'You moved the decimal point the wrong way. Percent → decimal: move it two places to the **left**.' }, { answer: fmt(pct), feedback: 'Remove the % sign by dividing by 100.' }],
    placeholder: '0.045',
  };
}

function percentFraction(): Problem {
  if (Math.random() < 0.5) {
    for (;;) {
      const pct = pick([randInt(1, 99), randInt(1, 99), randInt(101, 300), pick([12.5, 37.5, 62.5, 87.5, 2.5, 7.5])]);
      const num = pct * 10; // pct/100 = num/1000
      if (Number.isInteger(pct) && gcd(pct, 100) === 1 && Math.random() < 0.6) continue;
      return {
        skill: 'pctfrac',
        prompt: `Write $${pct}\\%$ as a fraction in lowest terms.`,
        answer: { type: 'number', value: pct / 100, lowest: true },
        hints: [`$${pct}\\%$ means $\\dfrac{${pct}}{100}$.`, Number.isInteger(pct) ? 'Reduce using the GCD of the top and bottom.' : `Clear the decimal: multiply top and bottom by 10 to get $\\dfrac{${num}}{1000}$, then reduce.`],
        solution: Number.isInteger(pct)
          ? [`$${pct}\\% = \\dfrac{${pct}}{100}${gcd(pct, 100) > 1 ? ` = ${fracTex(pct, 100)}` : ''}$`]
          : [`$${pct}\\% = \\dfrac{${pct}}{100} = \\dfrac{${pct * 10}}{1000} = ${fracTex(num, 1000)}$`],
        mistakes: Number.isInteger(pct) && gcd(pct, 100) > 1 ? [{ answer: `${pct}/100`, feedback: 'Right value, but reduce it to lowest terms.' }] : [],
        placeholder: '3/20',
      };
    }
  }
  const [n, d] = terminating();
  const pct = Math.round((n / d) * 100000) / 1000;
  const scale = 100 / d;
  return {
    skill: 'pctfrac',
    prompt: `Write $\\dfrac{${n}}{${d}}$ as a percent.`,
    answer: { type: 'number', value: pct, percent: true },
    hints: [Number.isInteger(scale) ? `Make the denominator 100: multiply top and bottom by $${scale}$.` : `Change to a decimal first ($${n} \\div ${d}$), then multiply by 100.`],
    solution: Number.isInteger(scale)
      ? [`$\\dfrac{${n}}{${d}} = \\dfrac{${n * scale}}{100} = ${fmt(pct)}\\%$`]
      : [`$${n} \\div ${d} = ${fmt(n / d)}$`, `$${fmt(n / d)} \\times 100 = ${fmt(pct)}$, so the answer is $${fmt(pct)}\\%$`],
    mistakes: [{ answer: `${fmt(n / d)}%`, feedback: `$${fmt(n / d)}$ is the decimal. Multiply by 100 to get the percent.` }],
    placeholder: '62.5%',
  };
}

export const skills: Skill[] = [
  { id: 'fracdec', label: 'Fraction → decimal', generate: fracToDec },
  { id: 'decfrac', label: 'Decimal → fraction', generate: decToFrac },
  { id: 'percent', label: 'Decimals ↔ percents', generate: percentDecimal },
  { id: 'pctfrac', label: 'Fractions ↔ percents', generate: percentFraction },
];

export const masterySet = makeMasterySet(skills);

