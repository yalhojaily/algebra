import { useState } from 'react';
import { Tex } from './MathText';

/** Mix two solutions: one equation counts the liquid, the other counts the acid. */
export default function MixtureLab() {
  const p1 = 10, p2 = 40, T = 60, target = 20;
  const [x, setX] = useState(30);
  const y = T - x;
  const acid = (p1 * x + p2 * y) / 100;
  const conc = (acid / T) * 100;
  const xs = (T * (p2 - target)) / (p2 - p1);
  const hit = Math.abs(conc - target) < 1e-9;
  return (
    <div className="mx card">
      <p className="mx-q">How many liters of a <strong className="c-var">{p1}%</strong> acid solution and a <strong className="c-op">{p2}%</strong> acid solution make <strong>{T} L</strong> of a <strong>{target}%</strong> solution?</p>
      <div className="mx-tanks">
        <div className="mx-tank"><div className="mx-fill a" style={{ height: `${(x / T) * 100}%` }} /><span>{x} L at {p1}%</span></div>
        <div className="mx-plus">+</div>
        <div className="mx-tank"><div className="mx-fill b" style={{ height: `${(y / T) * 100}%` }} /><span>{y} L at {p2}%</span></div>
        <div className="mx-plus">=</div>
        <div className={`mx-tank big ${hit ? 'hit' : ''}`}><div className="mx-fill mix" style={{ height: '100%', opacity: 0.25 + conc / 80 }} /><span>{T} L at {+conc.toFixed(2)}%</span></div>
      </div>
      <label className="el-slider"><span>liters of the {p1}% solution (x)</span><input type="range" min={0} max={T} step={5} value={x} onChange={(e) => setX(Number(e.target.value))} /><output className="c-var">{x}</output></label>
      <table className="nice mx-table">
        <thead><tr><th /><th>Liters</th><th>Percent acid</th><th>Liters of acid</th></tr></thead>
        <tbody>
          <tr><td>{p1}% solution</td><td><Tex>x</Tex> = {x}</td><td>{p1}%</td><td><Tex>{`${p1 / 100}x`}</Tex> = {+(p1 * x / 100).toFixed(2)}</td></tr>
          <tr><td>{p2}% solution</td><td><Tex>y</Tex> = {y}</td><td>{p2}%</td><td><Tex>{`${p2 / 100}y`}</Tex> = {+(p2 * y / 100).toFixed(2)}</td></tr>
          <tr className="lcd-max"><td>Mixture</td><td>{T}</td><td>{target}% wanted</td><td>{+(target * T / 100).toFixed(2)} needed (have {+acid.toFixed(2)})</td></tr>
        </tbody>
      </table>
      <div className="pb-row"><span className="el-step">System</span><Tex>{`\\begin{cases} x + y = ${T} & \\text{(liquid)} \\\\ ${p1 / 100}x + ${p2 / 100}y = ${target * T / 100} & \\text{(acid)} \\end{cases}`}</Tex></div>
      <p className={`vlt-count ${hit ? 'ok' : 'bad'}`}>{hit ? <>That's it: <Tex>{`x = ${xs},\\ y = ${T - xs}`}</Tex> makes exactly {target}%.</> : <>The mix is {+conc.toFixed(2)}% — {conc > target ? 'too strong: use more of the weak solution.' : 'too weak: use more of the strong solution.'}</>}</p>
    </div>
  );
}
