import { describe, expect, it } from 'vitest';
import { registry } from '../src/generators';
import { check } from '../src/lib/check';
import { renderMathText } from '../src/components/MathText';

for (const [lesson, gens] of Object.entries(registry)) {
  describe(`lesson ${lesson} generators`, () => {
    for (const skill of gens.skills) {
      it(`${skill.id}: problems are well-formed and accept their own answer`, () => {
        for (let i = 0; i < 400; i++) {
          const p = skill.generate();
          const a = p.answer;
          const input = answerInput(a);
          expect(check(p, input), p.prompt).toEqual({ status: 'correct' });
          if (a.type === 'number') expect(Number.isFinite(a.value), p.prompt).toBe(true);
          // Every piece of text must typeset without KaTeX errors.
          for (const t of [p.prompt, ...p.hints, ...p.solution, ...(p.mistakes ?? []).map((m) => m.feedback), ...(a.type === 'choice' ? a.options : [])]) {
            expect(typeof t, `text in ${p.prompt}`).toBe('string');
            expect(renderMathText(t), t).not.toContain('katex-error');
            expect(t, 'no NaN/undefined in text').not.toMatch(/NaN|Infinity|[$\d{}(]undefined|undefined[$\d}]|\[object/);
          }
        }
      });
    }
    it('mastery set covers every skill', () => {
      const set = gens.masterySet(6);
      expect(new Set(set.map((p) => p.skill)).size).toBe(gens.skills.length);
    });
  });
}

describe('checker details', () => {
  it('accepts a different variable letter and reordered equations', () => {
    const p = { skill: 'equation', prompt: '', hints: [], solution: [], answer: { type: 'equation' as const, value: 'x + 5 = 12' } };
    expect(check(p, '12 = 5 + n').status).toBe('correct');
    expect(check(p, 'x - 5 = 12').status).toBe('wrong');
    expect(check(p, 'x + 5').status).toBe('invalid');
  });
  it('enforces decimal form when asked', () => {
    const p = { skill: 'decimal', prompt: '', hints: [], solution: [], answer: { type: 'number' as const, value: 0.625, decimal: true } };
    expect(check(p, '0.625').status).toBe('correct');
    expect(check(p, '5/8').status).toBe('invalid');
    expect(check(p, '−0.625').status).toBe('wrong');
  });
});

describe('simplified and factored answers', () => {
  const base = { skill: 's', prompt: '', hints: [], solution: [] };
  it('requires like terms combined', () => {
    const p = { ...base, answer: { type: 'expression' as const, value: '5x + 3', maxTerms: 2 } };
    expect(check(p, '3 + 5x').status).toBe('correct');
    expect(check(p, '2x + 3x + 3').status).toBe('invalid');
    expect(check(p, '5(x) + 3').status).toBe('invalid');
    expect(check(p, '5x + 4').status).toBe('wrong');
  });
  it('requires the greatest common factor', () => {
    const p = { ...base, answer: { type: 'expression' as const, value: '6(2x + 3)', factor: '6' } };
    expect(check(p, '6(2x+3)').status).toBe('correct');
    expect(check(p, '(3 + 2x)6').status).toBe('correct');
    expect(check(p, '12x + 18').status).toBe('invalid');
    expect(check(p, '2(6x + 9)').status).toBe('invalid');
    expect(check(p, '6(2x + 4)').status).toBe('wrong');
  });
});

/** The input a student would type (or click) for the correct answer. */
function answerInput(a: import('../src/generators/types').Answer): string | number {
  switch (a.type) {
    case 'choice':
      return a.correct;
    case 'number':
      if (a.sci) {
        const e = Math.floor(Math.log10(Math.abs(a.value)));
        return `${+(a.value / 10 ** e).toPrecision(12)}*10^${e}`;
      }
      return String(a.value);
    case 'point':
      return `(${a.x}, ${a.y})`;
    case 'solutions':
      return a.values.join(', ');
    case 'plot': {
      if (a.mode === 'point') return `${a.x},${a.y}`;
      const pts: string[] = [];
      for (let x = -10; x <= 10 && pts.length < 2; x++) {
        if (a.b === 0) { if (a.a * x === a.c) { pts.push(`${x},0`, `${x},1`); } continue; }
        const y = (a.c - a.a * x) / a.b;
        if (Number.isInteger(y) && Math.abs(y) <= 10) pts.push(`${x},${y}`);
      }
      return pts.slice(0, 2).join(';');
    }
    default:
      return a.value;
  }
}
