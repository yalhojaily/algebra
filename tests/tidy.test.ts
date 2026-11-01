import { describe, expect, it } from 'vitest';
import { tidyAll, tidyShown } from '../src/generators/tidy';
describe('tidy', () => {
  it('cleans templated math', () => {
    expect(tidyAll('1n = 9')).toBe('n = 9');
    expect(tidyAll('y = -1t + 30')).toBe('y = -t + 30');
    expect(tidyAll('16 + -4x = -4')).toBe('16 - 4x = -4');
    expect(tidyAll('x = 1 \\pm 1i')).toBe('x = 1 \\pm i');
    expect(tidyAll('21x + 0.1y + 10^{1}')).toBe('21x + 0.1y + 10^{1}');
    expect(tidyAll('\\tfrac{1}{x} + x_1y')).toBe('\\tfrac{1}{x} + x_1y');
    expect(tidyShown('\;x^2 + 0x = 9')).toBe('\;x^2 = 9');
    expect(tidyShown('z = x + 0 \\end{cases}')).toBe('z = x \\end{cases}');
    expect(tidyShown('-16 < 4x + 0 < -4')).toBe('-16 < 4x < -4');
    expect(tidyShown('x - 0 > 0')).toBe('x > 0');
    expect(tidyShown('\;0x + y = -6')).toBe('\;y = -6');
    expect(tidyShown('2^{3x + 3} = 8^{1}')).toBe('2^{3x + 3} = 8');
    expect(tidyShown('-2 + 0 + 2 = 0')).toBe('-2 + 0 + 2 = 0');
    expect(tidyShown('x + 10 = 20')).toBe('x + 10 = 20');
    expect(tidyShown('y = 0.5x')).toBe('y = 0.5x');
  });
});
describe('tidy solutions', () => {
  it('drops a zero term after a variable only', () => {
    expect(tidyAll('x - 0 > 0')).toBe('x > 0');
    expect(tidyAll('z = x + 0 \\end{cases}')).toBe('z = x \\end{cases}');
    expect(tidyAll('\\{3 + 0\\} - 2')).toBe('\\{3 + 0\\} - 2');
    expect(tidyAll('-8 + 0i - 2')).toBe('-8 + 0i - 2');
    expect(tidyAll('x^3 - x^2 + 0x + 36')).toBe('x^3 - x^2 + 0x + 36');
  });
});
describe('tidy keeps deliberate 1x', () => {
  it('lone 1x', () => { expect(tidyAll('1x')).toBe('1x'); });
});
