import { useState } from 'react';
import { Tex } from './MathText';

interface Preset { num: number[]; den: number[] }
const presets: Preset[] = [
  { num: [-2, 3], den: [] },
  { num: [-4, 0, 2], den: [] },
  { num: [1], den: [-3] },
  { num: [-1, 4], den: [2] },
];
type Op = '<' | '<=' | '>' | '>=';
const opTex: Record<Op, string> = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' };
const fac = (r: number) => (r === 0 ? 'x' : `(x ${r < 0 ? '+' : '-'} ${Math.abs(r)})`);
const n = (v: number) => (v === Infinity ? '\\infty' : v === -Infinity ? '-\\infty' : String(v));

/** A sign chart: the zeros split the line into intervals; test each one; keep the intervals with the sign you want. */
export default function SignChart() {
  const [pi, setPi] = useState(0);
  const [op, setOp] = useState<Op>('<');
  const { num, den } = presets[pi];
  const crit = [...new Set([...num, ...den])].sort((a, b) => a - b);
  const edges = [-Infinity, ...crit, Infinity];
  const ivs = edges.slice(0, -1).map((lo, i) => {
    const hi = edges[i + 1];
    const t = !Number.isFinite(lo) ? hi - 1 : !Number.isFinite(hi) ? lo + 1 : (lo + hi) / 2;
    return { lo, hi, t };
  });
  const sgn = (v: number) => (v > 0 ? '+' : '−');
  const val = (x: number) => num.reduce((s, r) => s * (x - r), 1) / den.reduce((s, r) => s * (x - r), 1);
  const want = (v: number) => (op[0] === '<' ? v < 0 : v > 0);
  const closed = op.length === 2;
  const sol = ivs.filter((iv) => want(val(iv.t))).map((iv) => `${closed && num.includes(iv.lo) ? '[' : '('}${n(iv.lo)}, ${n(iv.hi)}${closed && num.includes(iv.hi) ? ']' : ')'}`);
  const expr = den.length ? `\\dfrac{${num.map(fac).join('')}}{${den.map(fac).join('')}}` : num.map(fac).join('');
  return (
    <div className="sc card">
      <div className="pr-tabs">{presets.map((p, i) => <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => setPi(i)}>{i + 1}</button>)}</div>
      <div className="ib-toggles">{(['<', '<=', '>', '>='] as Op[]).map((o) => <button key={o} className={`tl-chip ${o === op ? 'on' : ''}`} onClick={() => setOp(o)}><Tex>{opTex[o]}</Tex></button>)}</div>
      <div className="lb-eq"><Tex>{`${expr} ${opTex[op]} 0`}</Tex></div>
      <div className="sc-scroll">
        <table className="nice sc-table">
          <thead><tr><th>Interval</th>{ivs.map((iv, i) => <th key={i}><Tex>{`(${n(iv.lo)}, ${n(iv.hi)})`}</Tex></th>)}</tr></thead>
          <tbody>
            <tr><td>Test value</td>{ivs.map((iv, i) => <td key={i}>{iv.t}</td>)}</tr>
            {[...num.map((r) => ({ r, d: false })), ...den.map((r) => ({ r, d: true }))].map(({ r, d }, j) => (
              <tr key={j}><td><Tex>{fac(r)}</Tex>{d && ' (denominator)'}</td>{ivs.map((iv, i) => <td key={i}>{sgn(iv.t - r)}</td>)}</tr>
            ))}
            <tr className="lcd-max"><td>Result</td>{ivs.map((iv, i) => <td key={i} className={want(val(iv.t)) ? 'hit' : ''}>{sgn(val(iv.t))}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <div className="pb-row el-result"><Tex>{`\\text{Solution: } ${sol.length ? sol.join(' \\cup ') : '\\varnothing'}`}</Tex></div>
      <p className="lb-note">Zeros of the numerator are included for ≤ and ≥. Zeros of the denominator ({den.length ? den.join(', ') : 'none here'}) are never included — the expression is undefined there.</p>
    </div>
  );
}
