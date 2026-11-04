// Practice problem generators for Lesson 10.8 — The Complex Numbers.
import { choice, fracTex, makeMasterySet, nz, pick, randInt } from './helpers';
import type { Problem, Skill } from './types';

/** a + bi as TeX */
export function cTex(a: number, b: number): string {
  if (b === 0) return String(a);
  const bi = Math.abs(b) === 1 ? 'i' : `${Math.abs(b)}i`;
  if (a === 0) return b < 0 ? `-${bi}` : bi;
  return `${a} ${b < 0 ? '-' : '+'} ${bi}`;
}

function imaginary(): Problem {
  const k = randInt(2, 12), sq = Math.random() < 0.7;
  const n = sq ? k * k : pick([2, 3, 5, 6, 7]);
  return {
    skill: 'imaginary',
    prompt: `Write in terms of $i$: $\\;\\sqrt{-${n}}$`,
    answer: sq ? { type: 'complex', re: 0, im: k } : { type: 'expression', value: `sqrt(${n})*i` },
    hints: ['$\\sqrt{-a} = \\sqrt{-1}\\cdot\\sqrt{a} = i\\sqrt{a}$ for $a > 0$.'],
    solution: [`$\\sqrt{-${n}} = \\sqrt{-1}\\cdot\\sqrt{${n}} = ${sq ? `${k}i` : `i\\sqrt{${n}}`}$`],
    placeholder: sq ? '5i' : 'i sqrt(3)',
  };
}

function addSub(): Problem {
  const [a, b, c, d] = [nz(9), nz(9), nz(9), nz(9)];
  const minus = Math.random() < 0.5;
  const re = minus ? a - c : a + c, im = minus ? b - d : b + d;
  return {
    skill: 'addsub',
    prompt: `${minus ? 'Subtract' : 'Add'}: $\\;(${cTex(a, b)}) ${minus ? '-' : '+'} (${cTex(c, d)})$`,
    answer: { type: 'complex', re, im },
    hints: ['Combine the real parts and the imaginary parts separately, like combining like terms.', ...(minus ? ['Subtract **both** parts of the second number.'] : [])],
    solution: [`$= (${a} ${minus ? '-' : '+'} ${c < 0 ? `(${c})` : c}) + (${b} ${minus ? '-' : '+'} ${d < 0 ? `(${d})` : d})i = ${cTex(re, im)}$`],
    placeholder: '3 - 2i',
  };
}

function multiply(): Problem {
  const [a, b, c, d] = [nz(6), nz(6), nz(6), nz(6)];
  const re = a * c - b * d, im = a * d + b * c;
  return {
    skill: 'multiply',
    prompt: `Multiply: $\\;(${cTex(a, b)})(${cTex(c, d)})$`,
    answer: { type: 'complex', re, im },
    hints: ['Use FOIL, then replace $i^2$ with $-1$.'],
    solution: [`$= ${a * c} ${a * d < 0 ? '-' : '+'} ${Math.abs(a * d)}i ${b * c < 0 ? '-' : '+'} ${Math.abs(b * c)}i ${b * d < 0 ? '-' : '+'} ${Math.abs(b * d)}i^2$`, `$= ${a * c} ${a * d + b * c < 0 ? '-' : '+'} ${Math.abs(a * d + b * c)}i ${-b * d < 0 ? '-' : '+'} ${Math.abs(b * d)} = ${cTex(re, im)}$ (since $i^2 = -1$)`],
    mistakes: [{ answer: `${a * c + b * d} + (${im})i`, feedback: '$i^2 = -1$, so the product of the imaginary parts is **subtracted**.' }],
    placeholder: '7 + 4i',
  };
}

function powers(): Problem {
  const n = randInt(5, 60);
  const vals = ['$1$', '$i$', '$-1$', '$-i$'];
  const v = vals[n % 4];
  return {
    skill: 'powers',
    prompt: `Simplify: $\\;i^{${n}}$`,
    answer: choice(v, vals.filter((x) => x !== v)),
    hints: ['The powers of $i$ repeat every four: $i, -1, -i, 1, \\ldots$ Divide the exponent by $4$ and look at the remainder.'],
    solution: [`$${n} = 4 \\cdot ${Math.floor(n / 4)} + ${n % 4}$, so $i^{${n}} = (i^4)^{${Math.floor(n / 4)}} \\cdot i^{${n % 4}} = i^{${n % 4}} = ${v.slice(1, -1)}$`],
  };
}

function divide(): Problem {
  for (;;) {
    const [a, b] = [nz(8), nz(8)];
    const [c, d] = [nz(4), nz(4)];
    const den = c * c + d * d;
    // (a + bi)/(c + di) = (a + bi)(c − di)/(c² + d²)
    const reN = a * c + b * d, imN = b * c - a * d;
    const nice = Math.random() < 0.6;
    if (nice && (reN % den !== 0 || imN % den !== 0)) continue;
    const re = reN / den, im = imN / den;
    return {
      skill: 'divide',
      prompt: `Divide: $\\;\\dfrac{${cTex(a, b)}}{${cTex(c, d)}}$ (Write the answer as $a + bi$.)`,
      answer: { type: 'complex', re, im },
      hints: [`Multiply the top and bottom by the **conjugate** of the denominator, $${cTex(c, -d)}$.`, `The denominator becomes $${c < 0 ? `(${c})` : c}^2 + ${d < 0 ? `(${d})` : d}^2 = ${den}$.`],
      solution: [`$= \\dfrac{(${cTex(a, b)})(${cTex(c, -d)})}{${den}} = \\dfrac{${cTex(reN, imN)}}{${den}}$`, Number.isInteger(re) && Number.isInteger(im) ? `$= ${cTex(re, im)}$` : `$= ${fracTex(reN, den)} ${imN < 0 ? '-' : '+'} ${fracTex(Math.abs(imN), den)}i$`],
      placeholder: '1/2 - (3/2)i',
    };
  }
}


/** Electrical engineering: impedances in series add, and Ohm's law V = IZ multiplies. */
function circuits(): Problem {
  const a = randInt(1, 6), b = nz(5), c = randInt(1, 6), d = nz(5);
  if (Math.random() < 0.5) {
    return {
      skill: 'apply',
      prompt: `In AC circuits, resistance is described by a complex number called **impedance** (in ohms). Two parts with impedances $Z_1 = ${cTex(a, b)}$ and $Z_2 = ${cTex(c, d)}$ are connected in series, so the total impedance is $Z = Z_1 + Z_2$. Find $Z$.`,
      answer: { type: 'complex', re: a + c, im: b + d },
      hints: ['Unknown: the total impedance $Z$. "In series" means **add**.', 'Add the real parts, then add the imaginary parts.'],
      solution: [`$Z = (${cTex(a, b)}) + (${cTex(c, d)}) = ${cTex(a + c, b + d)}$ ohms`],
      placeholder: '5 + 3i',
    };
  }
  const re = a * c - b * d, im = a * d + b * c;
  return {
    skill: 'apply',
    prompt: `Ohm's law for AC circuits is $V = IZ$: voltage = current × impedance, all complex numbers. The current is $I = ${cTex(a, b)}$ amps and the impedance is $Z = ${cTex(c, d)}$ ohms. Find the voltage $V$ (volts).`,
    answer: { type: 'complex', re, im },
    hints: ['Unknown: the voltage $V$. Multiply $I \\cdot Z$ with FOIL.', 'Replace $i^2$ with $-1$, then combine the real parts and the imaginary parts.'],
    solution: [`$V = (${cTex(a, b)})(${cTex(c, d)}) = ${a * c} ${a * d < 0 ? '-' : '+'} ${Math.abs(a * d)}i ${b * c < 0 ? '-' : '+'} ${Math.abs(b * c)}i ${b * d < 0 ? '-' : '+'} ${Math.abs(b * d)}i^2$`, `$= ${cTex(re, im)}$ volts (since $i^2 = -1$)`],
    mistakes: [{ answer: `${a * c + b * d} + (${im})i`, feedback: 'Remember $i^2 = -1$: the product of the imaginary parts becomes **negative** and joins the real part.' }],
    placeholder: '8 + i',
  };
}

export const skills: Skill[] = [
  { id: 'imaginary', label: 'Imaginary numbers', generate: imaginary },
  { id: 'addsub', label: 'Add and subtract', generate: addSub },
  { id: 'multiply', label: 'Multiply', generate: multiply },
  { id: 'powers', label: 'Powers of i', generate: powers },
  { id: 'divide', label: 'Divide', generate: divide },
  { id: 'apply', label: 'Circuits (applications)', generate: circuits },
];

export const masterySet = makeMasterySet(skills);
