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

import { evaluationSteps, topTerms } from '../src/lib/expr';

describe('grouping symbols', () => {
  it('parses and keeps brackets and braces', () => {
    expect(evaluate(parse('2[3 + {4 - 1}]'), {})).toBe(12);
    expect(toTex(parse('[x + 1]'))).toBe('\\left[x + 1\\right]');
    expect(() => parse('(x + 1]')).toThrow();
  });
  it('writes negative numbers on the right in parentheses', () => {
    expect(toTex(parse('3 + (-2)'))).toBe('3 + \\left(-2\\right)');
  });
});

describe('evaluationSteps', () => {
  const run = (s: string) => evaluationSteps(s);
  it('follows the order of operations', () => {
    const r = run('2 + 3*4');
    expect(r.result).toBe(14);
    expect(r.steps.map((s) => s.action)).toEqual(['Multiply', 'Add']);
  });
  it('does grouping first, then exponents, then left to right', () => {
    expect(run('2^3 + (1+1)').steps[0].action).toBe('Add');
    expect(run('20 / 5 * 2').steps.map((s) => s.calc)).toEqual(['\\frac{20}{5} = 4', '4 \\cdot 2 = 8']);
    expect(run('10 - 4 + 1').result).toBe(7);
    expect(run('[3 - (4 + 2)]^2').result).toBe(9);
  });
  it('handles negatives and exponents correctly', () => {
    expect(run('-3^2').result).toBe(-9);
    expect(run('(-3)^2').result).toBe(9);
    expect(run('5 - 2(3 - 7)').result).toBe(13);
  });
  it('rejects division by zero', () => {
    expect(() => run('4 / (2 - 2)')).toThrow();
  });
});

describe('topTerms', () => {
  it('splits a sum into terms', () => {
    expect(topTerms(parse('3x - 2y + 5')).length).toBe(3);
    expect(topTerms(parse('-(x + 2)')).length).toBe(1);
  });
});
