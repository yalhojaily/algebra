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

describe('unions of intervals', () => {
  const P = (parts: { lo: number; hi: number; loClosed: boolean; hiClosed: boolean }[]): Problem => ({ skill: 's', prompt: '', hints: [], solution: [], answer: { type: 'intervals', parts } });
  const two = P([{ lo: -Infinity, hi: -1, loClosed: false, hiClosed: false }, { lo: 3, hi: Infinity, loClosed: true, hiClosed: false }]);
  it('accepts unions in either order', () => {
    expect(check(two, '(-inf, -1) U [3, inf)').status).toBe('correct');
    expect(check(two, '[3, inf) ∪ (-inf, -1)').status).toBe('correct');
    expect(check(two, '(-inf, -1) U [3, inf]').status).toBe('invalid');
    expect(check(two, '(-inf, -1) U (3, inf)')).toMatchObject({ status: 'wrong' });
    expect(check(two, '(-1, 3]')).toMatchObject({ status: 'wrong' });
  });
  it('handles the empty set and all reals', () => {
    expect(check(P([]), '∅').status).toBe('correct');
    expect(check(P([]), 'no solution').status).toBe('correct');
    expect(check(P([{ lo: -Infinity, hi: Infinity, loClosed: false, hiClosed: false }]), '(-inf, 2) U [1, inf)').status).toBe('correct');
  });
  it('previews unions', () => {
    expect(tryTex('(-inf, -1) U [3, inf)')).toContain('\\cup');
  });
});
