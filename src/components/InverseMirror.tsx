import { useState } from 'react';
import { FnPlot } from './FnPlot';
import { Tex } from './MathText';

const fns = [
  { name: '2x + 1', tex: 'f(x) = 2x + 1', inv: 'f^{-1}(x) = \\dfrac{x - 1}{2}', f: (x: number) => 2 * x + 1, lo: -6, hi: 6 },
  { name: 'x³', tex: 'f(x) = x^3', inv: 'f^{-1}(x) = \\sqrt[3]{x}', f: (x: number) => x ** 3, lo: -2.2, hi: 2.2 },
  { name: '2ˣ', tex: 'f(x) = 2^x', inv: 'f^{-1}(x) = \\log_2 x', f: (x: number) => 2 ** x, lo: -6, hi: 3 },
  { name: 'x² (x ≥ 0)', tex: 'f(x) = x^2,\\ x \\ge 0', inv: 'f^{-1}(x) = \\sqrt{x}', f: (x: number) => x * x, lo: 0, hi: 2.8 },
];

/** An inverse undoes a function: every point (a, b) on f becomes (b, a) on f⁻¹ — a reflection across y = x. */
export default function InverseMirror() {
  const [fi, setFi] = useState(0);
  const [t, setT] = useState(1);
  const F = fns[fi];
  const ft = F.f(t);
  // the inverse, drawn parametrically as points (f(s), s)
  const inv = (x: number) => {
    let lo = F.lo, hi = F.hi;
    const inc = F.f(hi) > F.f(lo);
    if (x < Math.min(F.f(lo), F.f(hi)) || x > Math.max(F.f(lo), F.f(hi))) return NaN;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if ((F.f(m) < x) === inc) lo = m; else hi = m; }
    return (lo + hi) / 2;
  };
  const tt = Math.max(F.lo, Math.min(F.hi, t));
  const fmt = (n: number) => String(+n.toFixed(2));
  return (
    <div className="im card">
      <div className="pr-tabs">{fns.map((g, i) => <button key={i} className={`pr-tab ${i === fi ? 'on' : ''}`} onClick={() => { setFi(i); setT(1); }}>{g.name}</button>)}</div>
      <div className="px-body">
        <FnPlot fns={[{ f: (x) => x, cls: 'faint' }, { f: F.f, lo: F.lo, hi: F.hi }, { f: inv, cls: 'alt' }]} x={[-6, 6]} y={[-6, 6]} width={340} height={340}
          points={[{ x: tt, y: F.f(tt), cls: '', label: `(${fmt(tt)}, ${fmt(F.f(tt))})` }, { x: F.f(tt), y: tt, cls: 'red', label: `(${fmt(F.f(tt))}, ${fmt(tt)})` }]} />
        <div className="px-side">
          <div className="pb-row"><span className="el-step pp-blue">f</span><Tex>{F.tex}</Tex></div>
          <div className="pb-row"><span className="el-step pp-red">Inverse</span><Tex>{F.inv}</Tex></div>
          <div className="pb-row el-result"><Tex>{`f(${fmt(tt)}) = ${fmt(ft)} \\quad\\Longleftrightarrow\\quad f^{-1}(${fmt(ft)}) = ${fmt(tt)}`}</Tex></div>
          <p className="lb-note">Inputs and outputs trade places, so the graph of <Tex>{'f^{-1}'}</Tex> is the mirror image of <Tex>f</Tex> in the dashed line <Tex>{'y = x'}</Tex>. Composing them gives back the input: <Tex>{'(f^{-1} \\circ f)(x) = x'}</Tex>.</p>
          <label className="el-slider"><span>input a</span><input type="range" min={F.lo} max={F.hi} step={0.1} value={tt} onChange={(e) => setT(Number(e.target.value))} /><output className="c-var">{fmt(tt)}</output></label>
        </div>
      </div>
    </div>
  );
}
