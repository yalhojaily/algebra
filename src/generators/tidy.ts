// A last cleanup pass over every generated problem, so templated math reads the way a person would write it.
import type { Problem } from './types';

/** Apply `fn` to each $...$ math segment of a text, leaving \text{...} untouched. */
function inMath(t: string, fn: (m: string) => string): string {
  return t.replace(/\$([^$]+)\$/g, (_, m: string) => {
    const texts: string[] = [];
    const masked = m.replace(/\\text\{[^}]*\}/g, (x) => `\u0000${texts.push(x) - 1}\u0000`);
    return '$' + fn(masked).replace(/\u0000(\d+)\u0000/g, (_x, i) => texts[Number(i)]) + '$';
  });
}

/** Safe everywhere: a coefficient of 1 (1x → x, -1y → -y, 1i → i) and "+ -3" → "- 3". */
export function tidyAll(m: string): string {
  // A lone "1x" is deliberate ("$x$ means $1x$"), so leave it.
  if (/^\s*-?1[a-z]\s*$/.test(m)) return m;
  return m
    .replace(/(^|[^\d.}\\a-zA-Z_^{\]])1([a-z])(?![a-zA-Z{])/g, '$1$2')
    .replace(/\+\s*-\s*(?=[\d(a-z\\])/g, '- ')
    // "x - 0 > 0" → "x > 0" (only after a variable, so worked arithmetic like {3 + 0} stays)
    .replace(/([a-z])\s*[+-]\s*0(?![.\da-z])(?=\s*(?:$|[=<>)]|\\le|\\ge|\\lt|\\gt|\\\\|\\end|\\;|,))/g, '$1');
}

/** For what the student first sees (prompts, answer choices): drop "+ 0" terms and exponents of 1. */
export function tidyShown(m: string): string {
  return tidyAll(m)
    .replace(/\s*[+-]\s*0(?:[a-z](?![a-z]))?(?=\s*(?:$|[=<>)]|\\le|\\ge|\\lt|\\gt|\\\\|\\end|\;|,))/g, '')
    .replace(/(^|[=(;]\s*|\;\s*)0[a-z]\s*\+\s*/g, '$1')
    .replace(/\^\{1\}(?![\d.])/g, '');
}

export function tidyProblem(p: Problem): Problem {
  const a: any = p.answer;
  return {
    ...p,
    prompt: inMath(p.prompt, tidyShown),
    hints: p.hints.map((h) => inMath(h, tidyAll)),
    solution: p.solution.map((s) => inMath(s, tidyAll)),
    mistakes: p.mistakes?.map((x) => ({ ...x, feedback: inMath(x.feedback, tidyAll) })),
    answer: a.type === 'choice' ? { ...a, options: a.options.map((o: string) => inMath(o, tidyShown)) } : p.answer,
  };
}
