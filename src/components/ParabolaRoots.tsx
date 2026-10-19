import { useState } from 'react';
import { Poly } from '../lib/poly';
import { Plane } from './Plane';
import { Tex } from './MathText';

/** y = (x − r)(x − s): the solutions of (x − r)(x − s) = 0 are exactly where the graph crosses the x-axis. */
export default function ParabolaRoots() {
  const [r, setR] = useState(-2);
  const [s, setS] = useState(3);
  const P = Poly.fromCoefs([1, -r]).mul(Poly.fromCoefs([1, -s]));
  const f = (k: number) => Poly.fromCoefs([1, -k]).tex();
  const roots = [...new Set([r, s])];
  return (
    <div className="pr2 card">
      <div className="px-body">
        <Plane range={8} yRange={12} size={380} curves={[{ coefs: P.coefs('x') }]} points={roots.map((x) => ({ x, y: 0, cls: 'red', label: `(${x}, 0)` }))} />
        <div className="px-side">
          <div className="pb-row"><span className="el-step">Equation</span><Tex>{`${P.tex()} = 0`}</Tex></div>
          <div className="pb-row"><span className="el-step">Factored</span><Tex>{`(${f(r)})(${f(s)}) = 0`}</Tex></div>
          <div className="pb-row el-result"><span className="el-step">Solutions</span><Tex>{roots.map((x) => `x = ${x}`).join(',\\quad ')}</Tex></div>
          <p className="lb-note">
            A product is 0 only when a factor is 0 — so <Tex>{`x - ${r < 0 ? `(${r})` : r} = 0`}</Tex> or <Tex>{`x - ${s < 0 ? `(${s})` : s} = 0`}</Tex>.
            Those are exactly the <strong>x-intercepts</strong> (red points) of <Tex>{`y = ${P.tex()}`}</Tex>.
            {r === s && ' Here both factors are the same, so the graph just touches the x-axis at one point.'}
          </p>
        </div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>first root r</span><input type="range" min={-6} max={6} value={r} onChange={(e) => setR(Number(e.target.value))} /><output className="c-op">{r}</output></label>
        <label className="el-slider"><span>second root s</span><input type="range" min={-6} max={6} value={s} onChange={(e) => setS(Number(e.target.value))} /><output className="c-var">{s}</output></label>
      </div>
    </div>
  );
}
