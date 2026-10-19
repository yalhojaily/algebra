import { describe, expect, it } from 'vitest';
import { factorizationTex, factorPoly, Poly } from '../src/lib/poly';

const f = (s: string) => factorizationTex(factorPoly(Poly.parse(s)));
describe('factorPoly', () => {
  it('factors common cases', () => {
    expect(f('x^2 - 5x + 6')).toBe('(x - 2)(x - 3)');
    expect(f('6x^2 - x - 2')).toBe('(2x + 1)(3x - 2)');
    expect(f('2x^3 - 8x')).toBe('2x(x - 2)(x + 2)');
    expect(f('x^2 + 6x + 9')).toBe('(x + 3)^{2}');
    expect(f('x^3 - 8')).toBe('(x - 2)(x^{2} + 2x + 4)');
    expect(f('x^2 + 4')).toBe('x^{2} + 4');
    expect(f('-x^2 + 9')).toBe('-(x - 3)(x + 3)');
  });
});
