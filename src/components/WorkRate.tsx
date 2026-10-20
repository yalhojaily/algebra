import { useState } from 'react';
import { Tex } from './MathText';

const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
const frac = (n: number, d: number) => { const k = g(n, d); return d / k === 1 ? `${n / k}` : `\\frac{${n / k}}{${d / k}}`; };

/** Two workers, two rates: watch the job fill up hour by hour and see why the times are not added. */
export default function WorkRate() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(6);
  const [t, setT] = useState(1);
  const T = (a * b) / (a + b);
  const doneA = Math.min(t / a, 1), doneB = Math.min(t / b, 1 - doneA);
  const total = t / a + t / b;
  const pct = (x: number) => `${Math.max(0, Math.min(1, x)) * 100}%`;
  const max = Math.max(1, Math.ceil(T * 2) / 2 + 1);
  return (
    <div className="wr card">
      <div className="wr-bars">
        <div className="wr-row"><span className="wr-lab">A alone</span><div className="wr-bar"><div className="wr-fill a" style={{ width: pct(t / a) }} /></div><span className="wr-num">{Math.min(100, Math.round((t / a) * 100))}%</span></div>
        <div className="wr-row"><span className="wr-lab">B alone</span><div className="wr-bar"><div className="wr-fill b" style={{ width: pct(t / b) }} /></div><span className="wr-num">{Math.min(100, Math.round((t / b) * 100))}%</span></div>
        <div className="wr-row"><span className="wr-lab">Together</span><div className="wr-bar big"><div className="wr-fill a" style={{ width: pct(doneA) }} /><div className="wr-fill b" style={{ width: pct(doneB), left: pct(doneA) }} /></div><span className={`wr-num ${total >= 1 - 1e-9 ? 'full' : ''}`}>{total >= 1 - 1e-9 ? 'done ✓' : `${Math.round(total * 100)}%`}</span></div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>A alone (hours)</span><input type="range" min={1} max={12} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>B alone (hours)</span><input type="range" min={1} max={12} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
        <label className="el-slider"><span>time worked t</span><input type="range" min={0} max={max * 4} value={Math.min(t * 4, max * 4)} onChange={(e) => setT(Number(e.target.value) / 4)} /><output className="c-num">{t} h</output></label>
      </div>
      <div className="pb-row"><span className="el-step">Rates</span><Tex>{`\\text{A does } \\tfrac{1}{${a}} \\text{ of the job per hour, B does } \\tfrac{1}{${b}}`}</Tex></div>
      <div className="pb-row"><span className="el-step">Equation</span><Tex>{`\\frac{t}{${a}} + \\frac{t}{${b}} = 1`}</Tex></div>
      <div className="pb-row el-result"><span className="el-step">Together</span><Tex>{`t = \\frac{${a} \\cdot ${b}}{${a} + ${b}} = ${frac(a * b, a + b)}${Number.isInteger(T) ? '' : ` \\approx ${T.toFixed(2)}`} \\text{ hours}`}</Tex></div>
      <p className="lb-note">Working together is faster than either worker alone — so the answer is always <strong>less</strong> than both {a} and {b}. Adding the times ({a + b} hours) can't be right.</p>
    </div>
  );
}
