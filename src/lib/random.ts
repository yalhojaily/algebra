// Small helpers for generating randomized practice problems.

export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)];

export const shuffle = <T,>(xs: readonly T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** A random integer in [min, max] that is not in `avoid`. */
export const randIntExcept = (min: number, max: number, avoid: number[]) => {
  let n: number;
  do n = randInt(min, max);
  while (avoid.includes(n));
  return n;
};

export const VARS = ['x', 'y', 'n', 'a', 't', 'm', 'p', 'w'] as const;
