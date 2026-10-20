import { describe, expect, it } from 'vitest';
import { check } from '../src/lib/check';
import { tryTex } from '../src/lib/expr';
import type { Problem } from '../src/generators/types';

const prob = (lo: number, hi: number, loClosed: boolean, hiClosed: boolean): Problem => ({ skill: 's', prompt: '', hints: [], solution: [], answer: { type: 'interval', lo, hi, loClosed, hiClosed } });

describe('interval answers', () => {
  it('accepts several spellings', () => {
    expect(check(prob(-3, 5, true, false), '[-3, 5)').status).toBe('correct');
    expect(check(prob(-3, 5, true, false), '[−3,5)').status).toBe('correct');
    expect(check(prob(-Infinity, 2, false, true), '(-inf, 2]').status).toBe('correct');
    expect(check(prob(-Infinity, 2, false, true), '(-∞, 2]').status).toBe('correct');
    expect(check(prob(-Infinity, Infinity, false, false), 'all real numbers').status).toBe('correct');
    expect(check(prob(0.5, 4, false, true), '(1/2, 4]').status).toBe('correct');
  });
  it('explains bracket and infinity mistakes', () => {
    expect(check(prob(-3, 5, true, false), '[-3, 5]')).toMatchObject({ status: 'wrong' });
    expect(check(prob(-Infinity, 2, false, true), '[-inf, 2]').status).toBe('invalid');
    expect(check(prob(-3, 5, true, true), '[5, -3]').status).toBe('invalid');
    expect(check(prob(-3, 5, true, true), '-3 to 5').status).toBe('invalid');
  });
  it('previews intervals', () => {
    expect(tryTex('[-3, inf)')).toBe('\\left[-3,\\ \\infty\\right)');
  });
});
