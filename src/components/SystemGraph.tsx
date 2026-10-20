import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Plane } from './Plane';
import { Tex } from './MathText';

const SLOPES: [number, number][] = [[-3, 1], [-2, 1], [-1, 1], [-1, 2], [0, 1], [1, 2], [1, 1], [2, 1], [3, 1]];

const lineTex = (m: Frac, b: number) => {
  const mt = m.isZero() ? '' : m.eq(1) ? 'x' : m.eq(-1) ? '-x' : `${m.tex()}x`;
  if (!mt) return `y = ${b}`;
  return `y = ${mt}${b ? ` ${b < 0 ? '-' : '+'} ${Math.abs(b)}` : ''}`;
};

/** Two lines, one system: one crossing point, parallel lines, or the same line. */
export default function SystemGraph() {
  const [s1, setS1] = useState(6);
  const [b1, setB1] = useState(1);
  const [s2, setS2] = useState(2);
  const [b2, setB2] = useState(4);
  const m1 = new Frac(...SLOPES[s1]), m2 = new Frac(...SLOPES[s2]);
  const same = m1.eq(m2);
  const kind = same ? (b1 === b2 ? 'many' : 'none') : 'one';
  // intersection: m1 x + b1 = m2 x + b2  →  x = (b2 − b1)/(m1 − m2)
  const X = same ? null : new Frac(b2 - b1).div(m1.sub(m2));
  const Y = X ? m1.mul(X).add(b1) : null;
  const L = (m: Frac, b: number, cls: string) => ({ a: -m.n, b: m.d, c: b * m.d, cls });
  const preset = (a: number, bb: number, c: number, d: number) => { setS1(a); setB1(bb); setS2(c); setB2(d); };
  return (
    <div className="sg card">
      <div className="os-presets">
        <button className="tl-chip" onClick={() => preset(6, 1, 2, 4)}>Lines cross</button>
        <button className="tl-chip" onClick={() => preset(7, -2, 7, 3)}>Parallel</button>
        <button className="tl-chip" onClick={() => preset(5, 2, 5, 2)}>Same line</button>
      </div>
      <div className="px-body">
        <Plane range={8} size={360} lines={[L(m1, b1, ''), L(m2, b2, kind === 'many' ? 'mine' : 'alt')]}
          points={X && Y && Math.abs(X.valueOf()) <= 8 && Math.abs(Y.valueOf()) <= 8 ? [{ x: X.valueOf(), y: Y.valueOf(), cls: 'red', label: `(${X.text()}, ${Y.text()})` }] : []} />
        <div className="px-side">
          <div className="lb-eq"><Tex>{`\\begin{cases} \\htmlClass{c-var}{${lineTex(m1, b1)}} \\\\ \\htmlClass{c-op}{${lineTex(m2, b2)}} \\end{cases}`}</Tex></div>
          <div className={`vlt-count ${kind === 'one' ? 'ok' : kind === 'none' ? 'bad' : 'ok'}`}>
            {kind === 'one' && <>One solution: <Tex>{`(${X!.tex()},\\ ${Y!.tex()})`}</Tex> — consistent, independent</>}
            {kind === 'none' && <>No solution — same slope, different intercepts: parallel lines. Inconsistent.</>}
            {kind === 'many' && <>Infinitely many solutions — both equations describe the same line. Consistent, dependent.</>}
          </div>
          <div className="am-controls">
            <label className="el-slider"><span>slope 1</span><input type="range" min={0} max={SLOPES.length - 1} value={s1} onChange={(e) => setS1(Number(e.target.value))} /><output className="c-var"><Tex>{m1.tex()}</Tex></output></label>
            <label className="el-slider"><span>intercept 1</span><input type="range" min={-6} max={6} value={b1} onChange={(e) => setB1(Number(e.target.value))} /><output className="c-var">{b1}</output></label>
            <label className="el-slider"><span>slope 2</span><input type="range" min={0} max={SLOPES.length - 1} value={s2} onChange={(e) => setS2(Number(e.target.value))} /><output className="c-op"><Tex>{m2.tex()}</Tex></output></label>
            <label className="el-slider"><span>intercept 2</span><input type="range" min={-6} max={6} value={b2} onChange={(e) => setB2(Number(e.target.value))} /><output className="c-op">{b2}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
