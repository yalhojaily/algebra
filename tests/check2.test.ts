import { describe, expect, it } from 'vitest';
import { check } from '../src/lib/check';
import { Poly, longDivide } from '../src/lib/poly';

const base = { skill: 's', prompt: '', hints: [], solution: [] };

describe('poly', () => {
  it('expands and prints', () => {
    expect(Poly.parse('(x+2)(x-3)').text()).toBe('x^2 - x - 6');
    expect(Poly.parse('(2a - b)^2').tex()).toBe('4a^{2} - 4ab + b^{2}');
    expect(Poly.parse('3x^2y - 2xy + 5').degree()).toBe(3);
  });
  it('long division', () => {
    const r = longDivide(Poly.parse('x^2 + 5x + 8'), Poly.parse('x + 3'));
    expect(r.quotient.text()).toBe('x + 2');
    expect(r.remainder.text()).toBe('2');
  });
});

describe('new answer types', () => {
  it('points', () => {
    const p = { ...base, answer: { type: 'point' as const, x: 3, y: -2 } };
    expect(check(p, '(3, -2)').status).toBe('correct');
    expect(check(p, '(-2, 3)').status).toBe('wrong');
    expect(check(p, '3, -2').status).toBe('invalid');
  });
  it('solution sets', () => {
    const p = { ...base, answer: { type: 'solutions' as const, values: [2, -3] } };
    expect(check(p, '-3, 2').status).toBe('correct');
    expect(check(p, 'x = 2 or x = -3').status).toBe('correct');
    expect(check(p, '2').status).toBe('wrong');
  });
  it('plotting a line', () => {
    const p = { ...base, answer: { type: 'plot' as const, mode: 'line' as const, a: -2, b: 1, c: 1 } }; // y = 2x + 1
    expect(check(p, '0,1;1,3').status).toBe('correct');
    expect(check(p, '0,1;1,4').status).toBe('wrong');
    expect(check(p, '0,1').status).toBe('invalid');
  });
  it('scientific notation', () => {
    const p = { ...base, answer: { type: 'number' as const, value: 320000, sci: true } };
    expect(check(p, '3.2*10^5').status).toBe('correct');
    expect(check(p, '3.2 x 10^5').status).toBe('correct');
    expect(check(p, '32*10^4').status).toBe('invalid');
    expect(check(p, '320000').status).toBe('invalid');
  });
  it('factored completely', () => {
    const p = { ...base, answer: { type: 'expression' as const, value: '2(x+1)(x-1)', factored: true } };
    expect(check(p, '2(x-1)(x+1)').status).toBe('correct');
    expect(check(p, '-2(1-x)(x+1)').status).toBe('correct');
    expect(check(p, '2(x^2-1)').status).toBe('invalid');
    expect(check(p, '(2x+2)(x-1)').status).toBe('invalid');
    expect(check(p, '2x^2 - 2').status).toBe('invalid');
    expect(check(p, '2(x+1)(x+1)').status).toBe('wrong');
    const q = { ...base, answer: { type: 'expression' as const, value: '(x+3)^2', factored: true } };
    expect(check(q, '(x+3)(x+3)').status).toBe('correct');
    expect(check(q, '(x+3)^2').status).toBe('correct');
  });
  it('positive exponents', () => {
    const p = { ...base, answer: { type: 'expression' as const, value: '1/x^3', positiveExponents: true } };
    expect(check(p, '1/x^3').status).toBe('correct');
    expect(check(p, 'x^-3').status).toBe('invalid');
  });
});
