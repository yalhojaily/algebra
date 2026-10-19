import { describe, expect, it } from 'vitest';
import { Frac } from '../src/lib/frac';

describe('Frac', () => {
  it('reduces and handles decimals exactly', () => {
    expect(new Frac(0.3).text()).toBe('3/10');
    expect(new Frac(6, -8).text()).toBe('-3/4');
    expect(new Frac(0.1).add(0.2).text()).toBe('3/10');
    expect(new Frac(2, 3).div(new Frac(4, 9)).tex()).toBe('\\frac{3}{2}');
  });
});
