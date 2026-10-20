// Shared helpers for Chapter 11 (quadratic equations and functions).
import { fracTex, gcd } from './helpers';
import { rootSplit } from './radicals';

export interface QuadRoots {
  disc: number;
  /** Real roots (numbers), empty when the discriminant is negative. */
  real: number[];
  /** Complex roots when the discriminant is negative. */
  complex: { re: number; im: number }[];
  /** "x = …" TeX in simplest exact form. */
  tex: string;
}

/** Exact solutions of a x² + b x + c = 0 by the quadratic formula, simplified. */
export function quadRoots(a: number, b: number, c: number, v = 'x'): QuadRoots {
  const D = b * b - 4 * a * c;
  const den = 2 * a;
  if (D === 0) return { disc: D, real: [-b / den], complex: [], tex: `${v} = ${fracTex(-b, den)}` };
  const { out: s, inside: r } = rootSplit(Math.abs(D));
  if (D > 0 && r === 1) {
    const r1 = (-b + s) / den, r2 = (-b - s) / den;
    return { disc: D, real: [r1, r2], complex: [], tex: `${v} = ${fracTex(-b + s, den)} \\text{ or } ${v} = ${fracTex(-b - s, den)}` };
  }
  // common factor of −b, s and 2a
  let g = gcd(gcd(Math.abs(b), s), Math.abs(den)) || 1;
  if (den < 0) g = -g;
  const B = -b / g, S = s / g, Dn = den / g;
  const rad = r === 1 ? `${S}` : `${S === 1 ? '' : S}\\sqrt{${r}}`;
  if (D > 0) {
    const numTex = `${B === 0 ? '' : B} \\pm ${rad}`;
    return { disc: D, real: [(-b + Math.sqrt(D)) / den, (-b - Math.sqrt(D)) / den], complex: [], tex: `${v} = ${Dn === 1 ? numTex : `\\dfrac{${numTex}}{${Dn}}`}` };
  }
  const re = -b / den, im = Math.sqrt(-D) / den;
  const gi = gcd(s, Math.abs(den)), Si = s / gi, Di = Math.abs(den) / gi;
  const imTex = r === 1 ? `${fracTex(s, Math.abs(den))}i` : Di === 1 ? `${Si === 1 ? '' : Si}\\sqrt{${r}}\\,i` : `\\dfrac{${Si === 1 ? '' : Si}\\sqrt{${r}}}{${Di}}i`;
  return { disc: D, real: [], complex: [{ re, im }, { re, im: -im }], tex: `${v} = ${re === 0 ? '' : `${fracTex(-b, den)} `}\\pm ${imTex}` };
}

/** a x² + b x + c as TeX */
export function quadTex(a: number, b: number, c: number, v = 'x') {
  const t = (k: number, s: string, first: boolean) => {
    if (k === 0) return '';
    const abs = Math.abs(k);
    const body = s ? `${abs === 1 ? '' : abs}${s}` : String(abs);
    return first ? `${k < 0 ? '-' : ''}${body}` : ` ${k < 0 ? '-' : '+'} ${body}`;
  };
  const parts = [t(a, `${v}^2`, true), t(b, v, a === 0), t(c, '', a === 0 && b === 0)];
  return parts.join('') || '0';
}
