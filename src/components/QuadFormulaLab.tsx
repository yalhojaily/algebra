import { useState } from 'react';
import { quadRoots, quadTex } from '../generators/quad';
import { Plane } from './Plane';
import { Tex } from './MathText';

/** Move a, b, c and watch the discriminant decide: two x-intercepts, one, or none (complex solutions). */
export default function QuadFormulaLab() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const A = a || 1;
  const Q = quadRoots(A, b, c);
  const D = Q.disc;
  const kind = D > 0 ? 'two real solutions — the graph crosses the x-axis twice' : D === 0 ? 'one real solution — the vertex touches the x-axis' : 'no real solutions — two complex ones; the graph misses the x-axis';
  const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);
  return (
    <div className="qf card">
      <div className="lb-eq"><Tex>{`${quadTex(A, b, c)} = 0`}</Tex></div>
      <div className="px-body">
        <Plane range={8} size={350} curves={[{ coefs: [A, b, c] }]} points={Q.real.filter((x) => Math.abs(x) <= 8).map((x) => ({ x, y: 0, cls: 'red' }))} />
        <div className="px-side">
          <div className="pb-row"><span className="el-step">Formula</span><Tex>{`x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`}</Tex></div>
          <div className="pb-row"><span className="el-step">Discriminant</span><Tex>{`b^2 - 4ac = ${p(b)}^2 - 4(${A})(${c}) = ${D}`}</Tex></div>
          <div className={`vlt-count ${D >= 0 ? 'ok' : 'bad'}`}>{D > 0 ? 'Positive' : D === 0 ? 'Zero' : 'Negative'}: {kind}.</div>
          <div className="pb-row el-result"><Tex>{Q.tex}</Tex></div>
          <div className="am-controls">
            <label className="el-slider"><span>a</span><input type="range" min={-4} max={4} value={a} onChange={(e) => setA(Number(e.target.value) || (a > 0 ? -1 : 1))} /><output className="c-var">{A}</output></label>
            <label className="el-slider"><span>b</span><input type="range" min={-8} max={8} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
            <label className="el-slider"><span>c</span><input type="range" min={-8} max={8} value={c} onChange={(e) => setC(Number(e.target.value))} /><output className="c-num">{c}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
