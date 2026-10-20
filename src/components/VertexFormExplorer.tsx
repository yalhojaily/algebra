import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

/** f(x) = a(x − h)² + k compared with y = x²: a stretches and flips, h moves right, k moves up. */
export default function VertexFormExplorer() {
  const [a, setA] = useState(2);
  const [h, setH] = useState(2);
  const [k, setK] = useState(-3);
  const A = a / 2;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(n));
  const inner = h === 0 ? 'x' : `(x ${h < 0 ? '+' : '-'} ${Math.abs(h)})`;
  const eq = `f(x) = ${A === 1 ? '' : A === -1 ? '-' : fmt(A)}${inner}^2${k ? ` ${k < 0 ? '-' : '+'} ${Math.abs(k)}` : ''}`;
  return (
    <div className="vf card">
      <div className="lb-eq"><Tex>{eq}</Tex></div>
      <div className="px-body">
        <Plane range={8} size={360}
          curves={[{ coefs: [1, 0, 0], cls: 'faint' }, { coefs: [A, -2 * A * h, A * h * h + k] }]}
          lines={[{ a: 1, b: 0, c: h, cls: 'faint' }]}
          points={[{ x: h, y: k, cls: 'red', label: `(${h}, ${k})` }]} />
        <div className="px-side">
          <div className="pb-row"><span className="el-step">Vertex</span><Tex>{`(h, k) = (${h}, ${k})`}</Tex></div>
          <div className="pb-row"><span className="el-step">Axis</span><Tex>{`x = ${h}`}</Tex></div>
          <div className="pb-row"><span className="el-step">{A > 0 ? 'Minimum' : 'Maximum'}</span><Tex>{`${k}`}</Tex></div>
          <p className="lb-note">The dashed curve is <Tex>{'y = x^2'}</Tex>. {Math.abs(A) > 1 ? 'With |a| > 1 the graph is narrower.' : Math.abs(A) < 1 ? 'With |a| < 1 the graph is wider.' : ''} {A < 0 && 'A negative a flips it upside down.'} <Tex>{`(x - h)`}</Tex> moves it <strong>{h >= 0 ? 'right' : 'left'} {Math.abs(h)}</strong> — note the minus sign.</p>
          <div className="am-controls">
            <label className="el-slider"><span>a</span><input type="range" min={-6} max={6} value={a} onChange={(e) => setA(Number(e.target.value) || (a > 0 ? -1 : 1))} /><output className="c-var">{fmt(A)}</output></label>
            <label className="el-slider"><span>h</span><input type="range" min={-5} max={5} value={h} onChange={(e) => setH(Number(e.target.value))} /><output className="c-op">{h}</output></label>
            <label className="el-slider"><span>k</span><input type="range" min={-6} max={6} value={k} onChange={(e) => setK(Number(e.target.value))} /><output className="c-num">{k}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
