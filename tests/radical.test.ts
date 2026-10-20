import { describe, expect, it } from 'vitest';
import { check } from '../src/lib/check';
import type { Answer, Problem } from '../src/generators/types';

const P = (answer: Answer): Problem => ({ skill: 's', prompt: '', hints: [], solution: [], answer });
const rad = (value: string) => P({ type: 'expression', value, radical: true });

describe('simplified radical form', () => {
  it('accepts simplified answers', () => {
    expect(check(rad('6sqrt(2)'), '6sqrt(2)').status).toBe('correct');
    expect(check(rad('6sqrt(2)'), '6√2').status).toBe('correct');
    expect(check(rad('5x*sqrt(2x)'), '5x sqrt(2x)').status).toBe('correct');
    expect(check(rad('3*cbrt(2)'), '3cbrt(2)').status).toBe('correct');
    expect(check(rad('(3sqrt(5))/5'), '3sqrt(5)/5').status).toBe('correct');
  });
  it('rejects unsimplified ones', () => {
    expect(check(rad('6sqrt(2)'), 'sqrt(72)').status).toBe('invalid');
    expect(check(rad('6sqrt(2)'), '3sqrt(8)').status).toBe('invalid');
    expect(check(rad('5x*sqrt(2x)'), 'sqrt(50x^3)').status).toBe('invalid');
    expect(check(rad('(3sqrt(5))/5'), '3/sqrt(5)').status).toBe('invalid');
    expect(check(rad('8sqrt(2)'), '3sqrt(2) + 5sqrt(2)').status).toBe('invalid');
    expect(check(rad('6sqrt(2)'), '5sqrt(2)').status).toBe('wrong');
  });
});

describe('complex numbers', () => {
  const z = P({ type: 'complex', re: 3, im: -2 });
  it('accepts a + bi forms', () => {
    for (const s of ['3 - 2i', '-2i + 3', '3 + (-2)i', '3-2i']) expect(check(z, s).status).toBe('correct');
    expect(check(P({ type: 'complex', re: 0, im: 7 }), '7i').status).toBe('correct');
    expect(check(P({ type: 'complex', re: 0.5, im: 1.5 }), '1/2 + (3/2)i').status).toBe('correct');
  });
  it('gives feedback', () => {
    expect(check(z, '3 + 2i')).toMatchObject({ status: 'wrong', feedback: expect.stringContaining('real part is right') });
    expect(check(z, '3 - 2i^2').status).toBe('invalid');
    expect(check(P({ type: 'complex', re: 0, im: 3 }), 'sqrt(-9)').status).toBe('invalid');
  });
});

describe('combined and noRadicals', () => {
  it('requires a single power', () => {
    const p = P({ type: 'expression', value: 'x^(5/6)', combined: true });
    expect(check(p, 'x^(5/6)').status).toBe('correct');
    expect(check(p, 'x^(1/2)x^(1/3)').status).toBe('invalid');
    const q = P({ type: 'expression', value: 'x^(1/2)', noRadicals: true });
    expect(check(q, 'sqrt(x)').status).toBe('invalid');
    expect(check(q, 'x^(1/2)').status).toBe('correct');
  });
});
