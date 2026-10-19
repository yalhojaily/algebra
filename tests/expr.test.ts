import { describe, expect, it } from 'vitest';
import { equivalent, equivalentEquations, evaluate, parse, parseEquation, toTex } from '../src/lib/expr';

const eq = (a: string, b: string) => equivalent(parse(a), parse(b));

describe('parse + evaluate', () => {
  it('handles implicit multiplication', () => {
    expect(evaluate(parse('3x'), { x: 4 })).toBe(12);
    expect(evaluate(parse('2(x+1)'), { x: 4 })).toBe(10);
    expect(evaluate(parse('xy'), { x: 3, y: 5 })).toBe(15);
    expect(evaluate(parse('(a)(b)'), { a: 3, b: 5 })).toBe(15);
  });
  it('handles unicode operators and precedence', () => {
    expect(evaluate(parse('12 ÷ 3 × 2'), {})).toBe(8);
    expect(evaluate(parse('−x^2'), { x: 3 })).toBe(-9);
    expect(evaluate(parse('2·3^2'), {})).toBe(18);
  });
  it('rejects junk', () => {
    expect(() => parse('3 +')).toThrow();
    expect(() => parse('(x')).toThrow();
    expect(() => parse('x)')).toThrow();
    expect(() => parse('')).toThrow();
  });
});

describe('equivalence', () => {
  it('accepts equal forms', () => {
    expect(eq('2x+2', '2(x+1)')).toBe(true);
    expect(eq('x - 3', '-3 + x')).toBe(true);
    expect(eq('x/4', '(1/4)x')).toBe(true);
    expect(eq('ab', 'ba')).toBe(true);
  });
  it('rejects the classic mistakes', () => {
    expect(eq('x - 3', '3 - x')).toBe(false);
    expect(eq('2(x+5)', '2x+5')).toBe(false);
    expect(eq('x/y', 'y/x')).toBe(false);
  });
  it('compares equations', () => {
    const e = (a: string, b: string) => equivalentEquations(parseEquation(a), parseEquation(b));
    expect(e('x + 5 = 12', '12 = 5 + x')).toBe(true);
    expect(e('x + 5 = 12', 'x = 7')).toBe(true);
    expect(e('2x = 10', 'x = 5')).toBe(true);
    expect(e('x + 5 = 12', 'x - 5 = 12')).toBe(false);
  });
});

describe('toTex', () => {
  it('prints readable LaTeX', () => {
    expect(toTex(parse('3x'))).toBe('3x');
    expect(toTex(parse('3*4'))).toBe('3 \\cdot 4');
    expect(toTex(parse('x/4'))).toBe('\\frac{x}{4}');
    expect(toTex(parse('2(x+1)'))).toBe('2\\left(x + 1\\right)');
    expect(toTex(parse('x-(y-z)'))).toBe('x - \\left(y - z\\right)');
  });
});
