import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

/** A linear function as a model: a starting amount plus a constant rate. Slope = rate of change, y-intercept = starting value. */
export default function LinearModel() {
  const [rate, setRate] = useState(2);
  const [base, setBase] = useState(3);
  const [t, setT] = useState(4);
  const C = (x: number) => rate * x + base;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(2)));
  return (
    <div className="lm card">
      <div className="lb-eq"><Tex>{`C(t) = \\htmlClass{c-op}{${fmt(rate)}}\\,t ${base < 0 ? '-' : '+'} \\htmlClass{c-var}{${Math.abs(base)}}`}</Tex></div>
      <div className="px-body">
        <Plane range={10} size={360} lines={[{ a: -rate, b: 1, c: base }]} points={[{ x: 0, y: base, cls: 'amber', label: `(0, ${base})` }, ...(Math.abs(C(t)) <= 10 ? [{ x: t, y: C(t), cls: 'red', label: `(${t}, ${fmt(C(t))})` }] : [])]}>
          {({ X, Y }) => (Math.abs(C(t + 1)) <= 10 ? (
            <g className="lm-tri">
              <line x1={X(t)} y1={Y(C(t))} x2={X(t + 1)} y2={Y(C(t))} />
              <line x1={X(t + 1)} y1={Y(C(t))} x2={X(t + 1)} y2={Y(C(t + 1))} />
              <text x={(X(t) + X(t + 1)) / 2} y={Y(C(t)) + (rate >= 0 ? 16 : -8)} className="pl-ptlab" style={{ textAnchor: 'middle' }}>1</text>
              <text x={X(t + 1) + 6} y={(Y(C(t)) + Y(C(t + 1))) / 2 + 4} className="pl-ptlab">{fmt(rate)}</text>
            </g>
          ) : null)}
        </Plane>
        <div className="px-side">
          <div className="pb-row"><span className="el-step">Rate</span><span>Every 1 more unit of <Tex>t</Tex> changes <Tex>C</Tex> by <strong className="c-op">{fmt(rate)}</strong> — that is the <strong>slope</strong>.</span></div>
          <div className="pb-row"><span className="el-step">Start</span><span>At <Tex>t = 0</Tex>, <Tex>{`C(0) = ${base}`}</Tex> — that is the <strong>y-intercept</strong>.</span></div>
          <div className="pb-row el-result"><Tex>{`C(${t}) = ${fmt(rate)} \\cdot ${t} ${base < 0 ? '-' : '+'} ${Math.abs(base)} = ${fmt(C(t))}`}</Tex></div>
          <div className="am-controls">
            <label className="el-slider"><span>rate (slope)</span><input type="range" min={-3} max={3} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} /><output className="c-op">{fmt(rate)}</output></label>
            <label className="el-slider"><span>start (intercept)</span><input type="range" min={-6} max={6} value={base} onChange={(e) => setBase(Number(e.target.value))} /><output className="c-var">{base}</output></label>
            <label className="el-slider"><span>t</span><input type="range" min={0} max={8} value={t} onChange={(e) => setT(Number(e.target.value))} /><output className="c-num">{t}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
