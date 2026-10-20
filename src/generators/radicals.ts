// Shared helpers for the Chapter 10 (radicals and complex numbers) generators.

/** n = out^k · inside with inside free of k-th powers: √72 → { out: 6, inside: 2 }. */
export function rootSplit(n: number, k = 2) {
  let out = 1, inside = Math.abs(n);
  for (let p = 2; p ** k <= inside; p++) while (inside % p ** k === 0) { inside /= p ** k; out *= p; }
  return { out: k === 3 && n < 0 ? -out : out, inside };
}

/** TeX for c·ᵏ√r, e.g. 6\sqrt{2}, -\sqrt[3]{5}, 7 (when r = 1). */
export function radTex(c: number, r: number, k = 2) {
  if (r === 1 || c === 0) return String(c);
  const root = k === 2 ? `\\sqrt{${r}}` : `\\sqrt[3]{${r}}`;
  return `${c === 1 ? '' : c === -1 ? '-' : c}${root}`;
}

/** Typed form of c·ᵏ√r for the checker: 6*sqrt(2), -cbrt(5). */
export function radText(c: number, r: number, k = 2) {
  if (r === 1 || c === 0) return String(c);
  return `${c === 1 ? '' : c === -1 ? '-' : `${c}*`}${k === 2 ? 'sqrt' : 'cbrt'}(${r})`;
}

/** Square-free numbers that make good radicands. */
export const radicands = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
