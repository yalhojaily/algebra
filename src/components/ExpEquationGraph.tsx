import { useState } from 'react';
import { FnPlot } from './FnPlot';
import { Tex } from './MathText';

/** bˣ = c is solved where the curve y = bˣ meets the line y = c. Taking logs finds that x exactly. */
export default function ExpEquationGraph() {
  const [b, setB] = useState(3);
  const [c, setC] = useState(20);
  const x = Math.log(c) / Math.log(b);
  return (
    <div className="xe card">
      <div className="lb-eq"><Tex>{`${b}^x = ${c}`}</Tex></div>
      <div className="px-body">
        <FnPlot fns={[{ f: (t) => b ** t }]} x={[-1, 5]} y={[0, 50]} yStep={10} hlines={[{ y: c, cls: 'alt' }]} vlines={[{ x }]} points={[{ x, y: c, cls: 'red', label: `x ≈ ${x.toFixed(3)}` }]} width={360} height={300} />
        <div className="px-side">
          <ol className="ac-steps">
            <li><span className="sr-num">1</span><div><div className="ac-h">Take ln of both sides</div><Tex>{`\\ln ${b}^x = \\ln ${c}`}</Tex></div></li>
            <li><span className="sr-num">2</span><div><div className="ac-h">Power rule brings x down</div><Tex>{`x \\ln ${b} = \\ln ${c}`}</Tex></div></li>
            <li><span className="sr-num">3</span><div><div className="ac-h">Divide</div><Tex>{`x = \\dfrac{\\ln ${c}}{\\ln ${b}} \\approx ${x.toFixed(4)}`}</Tex></div></li>
          </ol>
          <div className="am-controls">
            <label className="el-slider"><span>base b</span><input type="range" min={2} max={6} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-var">{b}</output></label>
            <label className="el-slider"><span>c</span><input type="range" min={2} max={48} value={c} onChange={(e) => setC(Number(e.target.value))} /><output className="c-op">{c}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
