import { useState } from 'react';
import { NumberLineSet, type Part } from './NumberLineSet';
import { Tex } from './MathText';

type Dir = 'lt' | 'le' | 'gt' | 'ge';
const sym: Record<Dir, string> = { lt: '<', le: '\\le', gt: '>', ge: '\\ge' };
const ray = (k: number, d: Dir): Part => (d === 'lt' || d === 'le' ? { lo: -Infinity, hi: k, loClosed: false, hiClosed: d === 'le' } : { lo: k, hi: Infinity, loClosed: d === 'ge', hiClosed: false });

function intersect(a: Part, b: Part): Part[] {
  const lo = Math.max(a.lo, b.lo), hi = Math.min(a.hi, b.hi);
  const lc = (a.lo === lo ? a.loClosed : true) && (b.lo === lo ? b.loClosed : true);
  const hc = (a.hi === hi ? a.hiClosed : true) && (b.hi === hi ? b.hiClosed : true);
  return lo < hi || (lo === hi && lc && hc) ? [{ lo, hi, loClosed: lc, hiClosed: hc }] : [];
}
function union(a: Part, b: Part): Part[] {
  const [p, q] = a.lo <= b.lo ? [a, b] : [b, a];
  if (q.lo < p.hi || (q.lo === p.hi && (q.loClosed || p.hiClosed))) {
    const hi = Math.max(p.hi, q.hi);
    return [{ lo: p.lo, hi, loClosed: p.lo === q.lo ? p.loClosed || q.loClosed : p.loClosed, hiClosed: p.hi === q.hi ? p.hiClosed || q.hiClosed : hi === p.hi ? p.hiClosed : q.hiClosed }];
  }
  return [p, q];
}
const n = (v: number) => (v === Infinity ? '\\infty' : v === -Infinity ? '-\\infty' : String(v));
const ivs = (ps: Part[]) => (ps.length ? ps.map((p) => `${p.loClosed ? '[' : '('}${n(p.lo)}, ${n(p.hi)}${p.hiClosed ? ']' : ')'}`).join(' \\cup ') : '\\varnothing');

/** "And" keeps only the overlap (intersection); "or" keeps everything in either set (union). */
export default function CompoundLine() {
  const [k1, setK1] = useState(-3);
  const [d1, setD1] = useState<Dir>('ge');
  const [k2, setK2] = useState(4);
  const [d2, setD2] = useState<Dir>('lt');
  const [and, setAnd] = useState(true);
  const A = ray(k1, d1), B = ray(k2, d2);
  const R = and ? intersect(A, B) : union(A, B);
  const Sel = ({ d, set }: { d: Dir; set: (x: Dir) => void }) => (
    <div className="ib-toggles">{(['lt', 'le', 'gt', 'ge'] as Dir[]).map((x) => <button key={x} className={`tl-chip ${x === d ? 'on' : ''}`} onClick={() => set(x)}><Tex>{`x ${sym[x]}`}</Tex></button>)}</div>
  );
  return (
    <div className="cl card">
      <div className="pr-tabs">
        <button className={`pr-tab ${and ? 'on' : ''}`} onClick={() => setAnd(true)}>and ( ∩ )</button>
        <button className={`pr-tab ${!and ? 'on' : ''}`} onClick={() => setAnd(false)}>or ( ∪ )</button>
      </div>
      <div className="cl-row"><span className="cl-lab c-var"><Tex>{`x ${sym[d1]} ${k1}`}</Tex></span><NumberLineSet parts={[A]} min={-10} max={10} /></div>
      <div className="cl-row"><span className="cl-lab c-op"><Tex>{`x ${sym[d2]} ${k2}`}</Tex></span><NumberLineSet parts={[B]} min={-10} max={10} cls="b" /></div>
      <div className="cl-row result"><span className="cl-lab"><strong>{and ? 'and' : 'or'}</strong></span><NumberLineSet parts={R} min={-10} max={10} cls="c" /></div>
      <div className="pb-row el-result"><Tex>{`${ivs([A])} ${and ? '\\cap' : '\\cup'} ${ivs([B])} = ${ivs(R)}`}</Tex></div>
      <div className="ib-ends">
        <fieldset><legend>First inequality</legend><Sel d={d1} set={setD1} /><label className="el-slider"><span>boundary</span><input type="range" min={-8} max={8} value={k1} onChange={(e) => setK1(Number(e.target.value))} /><output className="c-var">{k1}</output></label></fieldset>
        <fieldset><legend>Second inequality</legend><Sel d={d2} set={setD2} /><label className="el-slider"><span>boundary</span><input type="range" min={-8} max={8} value={k2} onChange={(e) => setK2(Number(e.target.value))} /><output className="c-op">{k2}</output></label></fieldset>
      </div>
      <p className="lb-note">{and ? 'A number satisfies an "and" compound inequality only if it is in both sets — where the shading overlaps.' : 'A number satisfies an "or" compound inequality if it is in at least one of the sets.'} {R.length === 0 && 'Here there is no overlap: the solution set is empty, ∅.'}</p>
    </div>
  );
}
