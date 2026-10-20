// Shared helpers for Chapter 9 (inequalities, intervals, absolute value).
import { fracTex } from './helpers';

export interface Iv { lo: number; hi: number; loClosed: boolean; hiClosed: boolean }

export const iv = (lo: number, hi: number, loClosed = false, hiClosed = false): Iv => ({ lo, hi, loClosed: loClosed && Number.isFinite(lo), hiClosed: hiClosed && Number.isFinite(hi) });

/** A number as TeX, fractions in lowest terms. */
export function numTex(v: number) {
  if (v === Infinity) return '\\infty';
  if (v === -Infinity) return '-\\infty';
  if (Number.isInteger(v)) return String(v);
  for (let d = 2; d <= 60; d++) if (Number.isInteger(+(v * d).toFixed(9))) return fracTex(Math.round(v * d), d);
  return String(+v.toFixed(4));
}

export const ivTex = (p: Iv) => `${p.loClosed ? '[' : '('}${numTex(p.lo)}, ${numTex(p.hi)}${p.hiClosed ? ']' : ')'}`;
export const ivsTex = (ps: Iv[]) => (ps.length ? ps.map(ivTex).join(' \\cup ') : '\\varnothing');

/** The inequality form of an interval: "-2 < x \le 5", "x \ge 3". */
export function ineqTex(p: Iv, v = 'x') {
  const lt = (closed: boolean) => (closed ? '\\le' : '<');
  if (p.lo === -Infinity && p.hi === Infinity) return `${v} \\text{ is any real number}`;
  if (p.lo === -Infinity) return `${v} ${lt(p.hiClosed)} ${numTex(p.hi)}`;
  if (p.hi === Infinity) return `${v} ${p.loClosed ? '\\ge' : '>'} ${numTex(p.lo)}`;
  return `${numTex(p.lo)} ${lt(p.loClosed)} ${v} ${lt(p.hiClosed)} ${numTex(p.hi)}`;
}

/** Intersection and union of interval lists (each list is a union). */
export function intersect(A: Iv[], B: Iv[]): Iv[] {
  const out: Iv[] = [];
  for (const a of A)
    for (const b of B) {
      const lo = Math.max(a.lo, b.lo), hi = Math.min(a.hi, b.hi);
      const loClosed = (a.lo === lo ? a.loClosed : true) && (b.lo === lo ? b.loClosed : true);
      const hiClosed = (a.hi === hi ? a.hiClosed : true) && (b.hi === hi ? b.hiClosed : true);
      if (lo < hi || (lo === hi && loClosed && hiClosed)) out.push(iv(lo, hi, loClosed, hiClosed));
    }
  return normalize(out);
}

export function normalize(parts: Iv[]): Iv[] {
  const xs = [...parts].sort((p, q) => p.lo - q.lo || Number(q.loClosed) - Number(p.loClosed));
  const out: Iv[] = [];
  for (const p of xs) {
    const last = out[out.length - 1];
    if (last && (p.lo < last.hi || (p.lo === last.hi && (p.loClosed || last.hiClosed)))) {
      if (p.hi > last.hi) { last.hi = p.hi; last.hiClosed = p.hiClosed; }
      else if (p.hi === last.hi) last.hiClosed = last.hiClosed || p.hiClosed;
      if (p.lo === last.lo) last.loClosed = last.loClosed || p.loClosed;
    } else out.push({ ...p });
  }
  return out;
}

export const union = (A: Iv[], B: Iv[]) => normalize([...A, ...B]);
