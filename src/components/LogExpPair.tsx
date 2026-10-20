import { useState } from 'react';
import { FnPlot } from './FnPlot';
import { Tex } from './MathText';

const bases = [2, 3, 10];

/** A logarithm is an exponent: log_b a = c means bᶜ = a. The graphs of bˣ and log_b x mirror each other. */
export default function LogExpPair() {
  const [b, setB] = useState(2);
  const [c, setC] = useState(3);
  const a = b ** c;
  const aTex = c < 0 ? `\\tfrac{1}{${b ** -c}}` : String(a);
  const log = (x: number) => (x > 0 ? Math.log(x) / Math.log(b) : NaN);
  return (
    <div className="lx card">
      <div className="pr-tabs">{bases.map((x) => <button key={x} className={`pr-tab ${x === b ? 'on' : ''}`} onClick={() => setB(x)}>base {x}</button>)}</div>
      <div className="lx-pair">
        <div className="lx-box"><div className="el-step">Exponential form</div><Tex>{`\\htmlClass{c-var}{${b}}^{\\htmlClass{c-op}{${c}}} = \\htmlClass{c-num}{${aTex}}`}</Tex></div>
        <div className="lx-arrow">⇔</div>
        <div className="lx-box"><div className="el-step">Logarithmic form</div><Tex>{`\\log_{\\htmlClass{c-var}{${b}}} \\htmlClass{c-num}{${aTex}} = \\htmlClass{c-op}{${c}}`}</Tex></div>
      </div>
      <p className="lb-note">Same base, same exponent, same result — just written two ways. <strong>The logarithm is the exponent.</strong></p>
      <div className="px-body">
        <FnPlot fns={[{ f: (x) => b ** x }, { f: log, cls: 'alt' }, { f: (x) => x, cls: 'faint' }]} x={[-4, 10]} y={[-4, 10]} width={340} height={340}
          points={[{ x: c, y: a, label: `(${c}, ${aTex.replace('\\tfrac{1}{', '1/').replace('}', '')})` }, { x: a, y: c, cls: 'red', label: `(${aTex.replace('\\tfrac{1}{', '1/').replace('}', '')}, ${c})` }]} />
        <div className="px-side">
          <p className="lb-note"><span className="pp-blue">Blue</span>: <Tex>{`y = ${b}^x`}</Tex>. <span className="pp-red">Red</span>: <Tex>{`y = \\log_{${b}} x`}</Tex> — the same points with coordinates swapped. The log graph has domain <Tex>{'(0, \\infty)'}</Tex> and a vertical asymptote at <Tex>{'x = 0'}</Tex>.</p>
          <label className="el-slider"><span>exponent c</span><input type="range" min={-2} max={3} value={c} onChange={(e) => setC(Number(e.target.value))} /><output className="c-op">{c}</output></label>
        </div>
      </div>
    </div>
  );
}
