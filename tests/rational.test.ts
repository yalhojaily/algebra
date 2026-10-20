import { describe, expect, it } from 'vitest';
import { check } from '../src/lib/check';
import { parse } from '../src/lib/expr';
import { Poly } from '../src/lib/poly';
import { ratFromNode, ratTex, ratText, simplify } from '../src/lib/rational';
import type { Problem } from '../src/generators/types';

const P = (s: string) => Poly.parse(s);
const prob = (value: string): Problem => ({ skill: 's', prompt: '', hints: [], solution: [], answer: { type: 'expression', value, rational: true } });

describe('simplify', () => {
  it('cancels common binomial factors', () => {
    const s = simplify(P('x^2 - 9'), P('x^2 + x - 6'));
    expect(ratText(s)).toBe('(x - 3)/(x - 2)');
    expect(ratTex(s)).toBe('\\frac{x - 3}{x - 2}');
  });
  it('handles opposites and numbers', () => {
    expect(ratText(simplify(P('6 - 2x'), P('x - 3')))).toBe('-2');
    expect(ratText(simplify(P('4x^3'), P('6x^5')))).toBe('2/(3x^2)');
  });
  it('combines sums of fractions', () => {
    const r = ratFromNode(parse('1/(x+1) + 1/(x-1)'));
    expect(ratText(simplify(r.num, r.den))).toBe('2x/(x^2 - 1)');
  });
});

describe('rational answers', () => {
  const p = prob('(x - 3)/(x - 2)');
  it('accepts lowest terms in any equivalent form', () => {
    for (const s of ['(x-3)/(x-2)', '(3-x)/(2-x)', '-(x-3)/(2-x)']) expect(check(p, s).status).toBe('correct');
  });
  it('rejects unsimplified fractions', () => {
    expect(check(p, '(x^2-9)/(x^2+x-6)').status).toBe('invalid');
    expect(check(p, '(2x-6)/(2x-4)').status).toBe('invalid');
    expect(check(p, '1 - 1/(x-2)').status).toBe('invalid');
  });
  it('marks wrong answers wrong', () => {
    expect(check(p, '(x+3)/(x-2)').status).toBe('wrong');
  });
  it('allows polynomials and numeric denominators', () => {
    expect(check(prob('x + 3'), 'x+3').status).toBe('correct');
    expect(check(prob('(2x + 1)/3'), '(2x+1)/3').status).toBe('correct');
    expect(check(prob('-2'), '-2').status).toBe('correct');
  });
});
