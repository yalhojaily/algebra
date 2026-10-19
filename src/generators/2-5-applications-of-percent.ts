// Practice problem generators for Lesson 2.5 — Applications of Percent.
import { fmt, makeMasterySet, pick, randInt } from './helpers';
import type { Mistake, Problem, Skill } from './types';

function convert(): Problem {
  const kind = pick(['toDecimal', 'toPercent', 'fraction'] as const);
  if (kind === 'toDecimal') {
    const pct = pick([randInt(1, 99), randInt(100, 250), +(randInt(1, 999) / 10).toFixed(1), 0.5, 4.5, 12.5]);
    return {
      skill: 'convert',
      prompt: `Write $${pct}\\%$ as a decimal.`,
      answer: { type: 'number', value: pct / 100, decimal: true },
      hints: ['Percent means "per hundred": divide by $100$, which moves the decimal point **two places left**.'],
      solution: [`$${pct}\\% = ${pct} \\times 0.01 = ${fmt(pct / 100)}$`],
      mistakes: [{ answer: String(fmt(pct / 10)), feedback: 'Move the decimal point **two** places, not one.' }],
    };
  }
  if (kind === 'toPercent') {
    const d = pick([randInt(1, 99) / 100, randInt(1, 999) / 1000, randInt(101, 300) / 100]);
    return {
      skill: 'convert',
      prompt: `Write $${fmt(d)}$ as a percent. (Enter just the number, without the % sign.)`,
      answer: { type: 'number', value: +(d * 100).toFixed(4) },
      hints: ['Multiply by $100$ — move the decimal point **two places right** — and add a % sign.'],
      solution: [`$${fmt(d)} = ${fmt(d * 100)}\\%$`],
      mistakes: [{ answer: String(fmt(d / 100)), feedback: 'Going from a decimal to a percent, move the decimal point to the **right**.' }],
      placeholder: 'e.g. 37.5',
    };
  }
  const [n, den] = pick([[1, 4], [3, 4], [1, 5], [2, 5], [3, 8], [5, 8], [1, 8], [7, 20], [9, 25], [1, 2], [7, 10], [3, 50]]);
  return {
    skill: 'convert',
    prompt: `Write $\\dfrac{${n}}{${den}}$ as a percent. (Enter just the number.)`,
    answer: { type: 'number', value: (n / den) * 100 },
    hints: ['Divide to get a decimal, then move the decimal point two places right.'],
    solution: [`$\\dfrac{${n}}{${den}} = ${fmt(n / den)} = ${fmt((n / den) * 100)}\\%$`],
    placeholder: 'e.g. 62.5',
  };
}

function basicPercent(): Problem {
  const kind = pick(['amount', 'percent', 'base'] as const);
  const pct = pick([5, 10, 12, 15, 20, 25, 30, 40, 45, 60, 75, 80, 120, 150]);
  const base = pick([20, 40, 50, 60, 80, 120, 150, 200, 240, 300, 400, 640]);
  const amount = (pct / 100) * base;
  if (kind === 'amount')
    return {
      skill: 'basic',
      prompt: `What is $${pct}\\%$ of $${base}$?`,
      answer: { type: 'number', value: amount },
      hints: ['Translate: "what" → $a$, "is" → $=$, "of" → $\\times$. So $a = ' + `${pct / 100} \\times ${base}$.`],
      solution: [`$a = ${pct}\\% \\times ${base} = ${fmt(pct / 100)} \\times ${base} = ${fmt(amount)}$`],
    };
  if (kind === 'percent')
    return {
      skill: 'basic',
      prompt: `$${fmt(amount)}$ is what percent of $${base}$? (Enter just the number.)`,
      answer: { type: 'number', value: pct },
      hints: [`Translate: $${fmt(amount)} = p \\times ${base}$. Solve for $p$, then write it as a percent.`],
      solution: [`$${fmt(amount)} = p \\cdot ${base}$`, `$p = \\dfrac{${fmt(amount)}}{${base}} = ${fmt(pct / 100)} = ${pct}\\%$`],
      mistakes: [{ answer: String(fmt(pct / 100)), feedback: `That's the decimal. As a percent it is $${pct}\\%$, so enter ${pct}.` }],
    };
  return {
    skill: 'basic',
    prompt: `$${fmt(amount)}$ is $${pct}\\%$ of what number?`,
    answer: { type: 'number', value: base },
    hints: [`Translate: $${fmt(amount)} = ${fmt(pct / 100)} \\times b$. Solve for $b$ by dividing.`],
    solution: [`$${fmt(amount)} = ${fmt(pct / 100)}b$`, `$b = \\dfrac{${fmt(amount)}}{${fmt(pct / 100)}} = ${base}$`],
    mistakes: [{ answer: String(fmt(amount * (pct / 100))), feedback: 'You multiplied. Here the whole (the base) is unknown, so **divide** by the percent.' }],
  };
}

function change(): Problem {
  const kind = pick(['increase', 'decrease', 'percentChange'] as const);
  const base = pick([40, 50, 80, 120, 150, 200, 250, 400, 600, 1200]);
  const pct = pick([5, 10, 15, 20, 25, 30, 40]);
  if (kind === 'increase')
    return {
      skill: 'change',
      prompt: `A rent of $${base}$ riyals per week goes up by $${pct}\\%$. What is the new rent?`,
      answer: { type: 'number', value: base * (1 + pct / 100) },
      hints: [`Find the increase ($${pct}\\%$ of $${base}$) and add it. Or multiply by $1 + ${pct / 100} = ${fmt(1 + pct / 100)}$ in one step.`],
      solution: [`Increase: $${fmt(pct / 100)} \\times ${base} = ${fmt((pct / 100) * base)}$`, `New rent: $${base} + ${fmt((pct / 100) * base)} = ${fmt(base * (1 + pct / 100))}$ riyals`],
      mistakes: [{ answer: String(fmt((pct / 100) * base)), feedback: 'That is the **increase**. Add it to the original amount.' }],
    };
  if (kind === 'decrease')
    return {
      skill: 'change',
      prompt: `A jacket priced at $${base}$ riyals is on sale for $${pct}\\%$ off. What is the sale price?`,
      answer: { type: 'number', value: base * (1 - pct / 100) },
      hints: [`Find the discount ($${pct}\\%$ of $${base}$) and subtract it. Or multiply by $1 - ${pct / 100} = ${fmt(1 - pct / 100)}$.`],
      solution: [`Discount: $${fmt(pct / 100)} \\times ${base} = ${fmt((pct / 100) * base)}$`, `Sale price: $${base} - ${fmt((pct / 100) * base)} = ${fmt(base * (1 - pct / 100))}$ riyals`],
      mistakes: [{ answer: String(fmt((pct / 100) * base)), feedback: 'That is the **discount**. Subtract it from the original price.' }],
    };
  const up = Math.random() < 0.5;
  const nw = up ? base * (1 + pct / 100) : base * (1 - pct / 100);
  return {
    skill: 'change',
    prompt: `The number of students in a club changed from $${base}$ to $${fmt(nw)}$. What was the percent ${up ? 'increase' : 'decrease'}? (Enter just the number.)`,
    answer: { type: 'number', value: pct },
    hints: ['Percent change = (amount of change) ÷ (**original** amount).'],
    solution: [`Change: $${fmt(Math.abs(nw - base))}$`, `$\\dfrac{${fmt(Math.abs(nw - base))}}{${base}} = ${fmt(pct / 100)} = ${pct}\\%$ ${up ? 'increase' : 'decrease'}`],
    mistakes: [{ answer: String(fmt((Math.abs(nw - base) / nw) * 100)), feedback: 'Divide by the **original** amount, not the new one.' }],
  };
}

function applications(): Problem {
  const t: { prompt: string; value: number; sol: string[]; mistake?: Mistake } = pick([
    () => {
      const price = pick([80, 120, 200, 350, 460, 1200]);
      return { prompt: `A sales tax of $15\\%$ is added to a purchase of $${price}$ riyals. What is the total cost?`, value: price * 1.15, sol: [`Tax: $0.15 \\times ${price} = ${fmt(price * 0.15)}$`, `Total: $${price} + ${fmt(price * 0.15)} = ${fmt(price * 1.15)}$ riyals`] };
    },
    () => {
      const sales = pick([4000, 6500, 12000, 20000, 9000]);
      const rate = pick([3, 4, 5, 6, 8]);
      return { prompt: `A salesperson earns a $${rate}\\%$ commission on sales. How much commission is earned on sales of $${sales}$ riyals?`, value: (sales * rate) / 100, sol: [`$${rate / 100} \\times ${sales} = ${fmt((sales * rate) / 100)}$ riyals`] };
    },
    () => {
      const total = pick([115, 230, 345, 460, 575, 920]);
      return { prompt: `The total price of an item, **including** $15\\%$ tax, is $${total}$ riyals. What was the price before tax?`, value: +(total / 1.15).toFixed(2), sol: [`Price + tax: $p + 0.15p = 1.15p = ${total}$`, `$p = \\dfrac{${total}}{1.15} = ${fmt(total / 1.15)}$ riyals`], mistake: { answer: String(fmt(total * 0.85)), feedback: 'Subtracting 15% of the total doesn\'t work: the tax was 15% of the **original** price. Write $p + 0.15p = ' + total + '$.' } };
    },
    () => {
      const correct = randInt(30, 48);
      const total = pick([40, 50]);
      return { prompt: `A student answered $${correct}$ out of $${total}$ questions correctly. What percent is that? (Enter just the number.)`, value: (correct / total) * 100, sol: [`$\\dfrac{${correct}}{${total}} = ${fmt(correct / total)} = ${fmt((correct / total) * 100)}\\%$`] };
    },
  ])();
  return {
    skill: 'apply',
    prompt: t.prompt,
    answer: { type: 'number', value: t.value },
    hints: ['Write a percent equation: (percent) × (base) = (amount). Decide which part is unknown.'],
    solution: t.sol,
    mistakes: t.mistake ? [t.mistake] : [],
  };
}

export const skills: Skill[] = [
  { id: 'convert', label: 'Convert percents', generate: convert },
  { id: 'basic', label: 'Percent equations', generate: basicPercent },
  { id: 'change', label: 'Increase & decrease', generate: change },
  { id: 'apply', label: 'Tax, commission & more', generate: applications },
];

export const masterySet = makeMasterySet(skills);
