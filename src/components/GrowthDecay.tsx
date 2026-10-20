import { useState } from 'react';
import { FnPlot } from './FnPlot';
import { Tex } from './MathText';

/** P(t) = P₀e^{kt}: k > 0 grows with a fixed doubling time ln2 / k; k < 0 decays with a fixed half-life ln2 / |k|. */
export default function GrowthDecay() {
  const [k100, setK] = useState(7);
  const [P0, setP0] = useState(100);
  const k = k100 / 100;
  const P = (t: number) => P0 * Math.exp(k * t);
  const T = Math.log(2) / Math.abs(k);
  const grow = k > 0;
  const marks = [1, 2, 3].map((n) => n * T).filter((t) => t <= 60);
  return (
    <div className="gd card">
      <div className="lb-eq"><Tex>{`P(t) = ${P0}e^{${k}t}`}</Tex></div>
      <div className="px-body">
        <FnPlot fns={[{ f: P, lo: 0, hi: 60 }]} x={[0, 60]} y={[0, 1000]} xStep={10} yStep={200} xLabel="t" yLabel="P"
          points={marks.map((t, i) => ({ x: t, y: P(t), cls: 'red', label: `${grow ? '×' : '÷'}${2 ** (i + 1)}` }))} vlines={marks.map((t) => ({ x: t }))} width={380} height={300} />
        <div className="px-side">
          <div className="pb-row"><span className="el-step">{grow ? 'Doubling time' : 'Half-life'}</span><Tex>{`T = \\dfrac{\\ln 2}{${Math.abs(k)}} \\approx ${T.toFixed(2)}`}</Tex></div>
          <p className="lb-note">{grow ? 'Every' : 'Every'} {T.toFixed(1)} time units the amount {grow ? 'doubles' : 'is cut in half'} — no matter where you start. That constant doubling (or halving) time is the signature of exponential change.</p>
          <div className="am-controls">
            <label className="el-slider"><span>rate k</span><input type="range" min={-15} max={15} value={k100} onChange={(e) => setK(Number(e.target.value) || 1)} /><output className="c-var">{k}</output></label>
            <label className="el-slider"><span>P₀</span><input type="range" min={50} max={600} step={50} value={P0} onChange={(e) => setP0(Number(e.target.value))} /><output className="c-op">{P0}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
