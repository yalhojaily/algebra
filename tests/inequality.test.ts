import { describe, expect, it } from 'vitest';
import { check } from '../src/lib/check';
import { parseInequality, solvedForm } from '../src/lib/inequality';

const base = { skill: 's', prompt: '', hints: [], solution: [] };
const ineq = (value: string) => ({ ...base, answer: { type: 'inequality' as const, value } });

describe('inequalities', () => {
  it('parses many notations', () => {
    expect(solvedForm(parseInequality('x ≥ -2'))).toEqual({ variable: 'x', op: '>=', bound: -2 });
    expect(solvedForm(parseInequality('5 < x'))).toEqual({ variable: 'x', op: '>', bound: 5 });
    expect(solvedForm(parseInequality('{x | x <= 3/4}'))).toEqual({ variable: 'x', op: '<=', bound: 0.75 });
    expect(solvedForm(parseInequality('x => 1'))).toEqual({ variable: 'x', op: '>=', bound: 1 });
    expect(solvedForm(parseInequality('2x > 6'))).toBeNull();
  });
  it('grades answers with helpful feedback', () => {
    const p = ineq('x > -3');
    expect(check(p, 'x > -3').status).toBe('correct');
    expect(check(p, '-3 < x').status).toBe('correct');
    expect(check(p, 'x >= -3').status).toBe('wrong');
    expect(check(p, 'x < -3').status).toBe('wrong');
    expect(check(p, '-3').status).toBe('invalid');
    expect(check(p, '2x > -6').status).toBe('invalid');
    expect(check(p, 'x = -3').status).toBe('invalid');
  });
});

describe('solve for a variable', () => {
  const p = { ...base, answer: { type: 'equation' as const, value: 'h = 2A/b', solveFor: 'h' } };
  it('accepts solved forms only', () => {
    expect(check(p, 'h = 2A/b').status).toBe('correct');
    expect(check(p, '2A/b = h').status).toBe('correct');
    expect(check(p, 'h = (2/b)A').status).toBe('correct');
    expect(check(p, 'bh = 2A').status).toBe('wrong');
    expect(check(p, 'h = A/b').status).toBe('wrong');
  });
});
