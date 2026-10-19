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
          const input = a.type === 'choice' ? a.correct : a.type === 'number' ? String(a.value) : a.value;
          expect(check(p, input), p.prompt).toEqual({ status: 'correct' });
          if (a.type === 'number') expect(Number.isFinite(a.value), p.prompt).toBe(true);
          // Every piece of text must typeset without KaTeX errors.
          for (const t of [p.prompt, ...p.hints, ...p.solution, ...(p.mistakes ?? []).map((m) => m.feedback), ...(a.type === 'choice' ? a.options : [])]) {
            expect(renderMathText(t), t).not.toContain('katex-error');
            expect(t, 'no NaN/undefined in text').not.toMatch(/NaN|undefined/);
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
