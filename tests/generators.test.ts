import { describe, expect, it } from 'vitest';
import { skills } from '../src/generators/1-1-introduction-to-algebra';
import { check } from '../src/lib/check';

describe('lesson 1.1 generators', () => {
  for (const skill of skills) {
    it(`${skill.id}: every generated problem accepts its own answer`, () => {
      for (let i = 0; i < 300; i++) {
        const p = skill.generate();
        const a = p.answer;
        const input = a.type === 'choice' ? a.correct : a.type === 'number' ? String(a.value) : a.value;
        expect(check(p, input), p.prompt).toEqual({ status: 'correct' });
        for (const m of p.mistakes ?? []) {
          // A "mistake" can coincide with the right answer (e.g. 2+2 = 2·2); check() handles that by grading first.
          if (m.answer && check(p, m.answer).status !== 'correct') expect(check(p, m.answer).status, `${p.prompt} / ${m.answer}`).toBe('wrong');
        }
      }
    });
  }

  it('accepts a different variable letter and reordered equations', () => {
    const p = { skill: 'equation', prompt: '', hints: [], solution: [], answer: { type: 'equation' as const, value: 'x + 5 = 12' } };
    expect(check(p, '12 = 5 + n').status).toBe('correct');
    expect(check(p, 'x - 5 = 12').status).toBe('wrong');
    expect(check(p, 'x + 5').status).toBe('invalid');
  });
});
