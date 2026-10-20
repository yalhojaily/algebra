import { useState } from 'react';
import { Tex } from './MathText';

const ns = [1, 2, 4, 12, 52, 365, 8760, 525600, 1e8];
const names = ['once a year', 'twice a year', 'quarterly', 'monthly', 'weekly', 'daily', 'hourly', 'every minute', 'continuously (almost)'];

/** Compound 100% interest more and more often: (1 + 1/n)ⁿ creeps up to e ≈ 2.71828 but never past it. */
export default function EApproach() {
  const [i, setI] = useState(3);
  const n = ns[i];
  const v = (1 + 1 / n) ** n;
  return (
    <div className="ea card">
      <p className="mx-q">Invest 1 dollar at 100% interest for a year, compounded <strong>{names[i]}</strong> (n = {n.toLocaleString('en-US')}).</p>
      <div className="lb-eq"><Tex>{`\\left(1 + \\frac{1}{${n >= 1e6 ? '10^{8}' : n.toLocaleString('en-US').replace(/,/g, '{,}')}}\\right)^{${n >= 1e6 ? '10^{8}' : n.toLocaleString('en-US').replace(/,/g, '{,}')}} \\approx ${v.toFixed(6)}`}</Tex></div>
      <div className="ea-bar"><div className="ea-fill" style={{ width: `${((v - 2) / (Math.E - 2)) * 100}%` }} /><span className="ea-e">e ≈ 2.718282</span></div>
      <label className="el-slider"><span>how often</span><input type="range" min={0} max={ns.length - 1} value={i} onChange={(e) => setI(Number(e.target.value))} /><output className="c-var">{names[i]}</output></label>
      <table className="nice ve-table">
        <thead><tr><th>n</th>{ns.slice(0, 6).map((k) => <th key={k}>{k}</th>)}</tr></thead>
        <tbody><tr><td>value</td>{ns.slice(0, 6).map((k) => <td key={k}>{((1 + 1 / k) ** k).toFixed(4)}</td>)}</tr></tbody>
      </table>
      <p className="lb-note">The more often interest is compounded, the more you earn — but the gains shrink and the value levels off at a special number, <Tex>{'e \\approx 2.718281828'}</Tex>. Logarithms with base <Tex>e</Tex> are called <strong>natural logarithms</strong>: <Tex>{'\\ln x = \\log_e x'}</Tex>.</p>
    </div>
  );
}
