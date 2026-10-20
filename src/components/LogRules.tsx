import { useState } from 'react';
import { Tex } from './MathText';

const f4 = (n: number) => n.toFixed(4);

/** Test the properties of logarithms with numbers — and see the most common "rule" fail. */
export default function LogRules() {
  const [M, setM] = useState(8);
  const [N, setN] = useState(4);
  const [p, setP] = useState(3);
  const L = (x: number) => Math.log10(x);
  const rows = [
    { name: 'Product rule', l: '\\log(MN)', lv: L(M * N), r: '\\log M + \\log N', rv: L(M) + L(N), ok: true },
    { name: 'Quotient rule', l: `\\log\\dfrac{M}{N}`, lv: L(M / N), r: '\\log M - \\log N', rv: L(M) - L(N), ok: true },
    { name: 'Power rule', l: `\\log M^{${p}}`, lv: L(M ** p), r: `${p}\\log M`, rv: p * L(M), ok: true },
    { name: 'NOT a rule', l: '\\log(M + N)', lv: L(M + N), r: '\\log M + \\log N', rv: L(M) + L(N), ok: false },
  ];
  return (
    <div className="lr card">
      <div className="am-controls">
        <label className="el-slider"><span>M</span><input type="range" min={1} max={20} value={M} onChange={(e) => setM(Number(e.target.value))} /><output className="c-var">{M}</output></label>
        <label className="el-slider"><span>N</span><input type="range" min={1} max={20} value={N} onChange={(e) => setN(Number(e.target.value))} /><output className="c-op">{N}</output></label>
        <label className="el-slider"><span>p</span><input type="range" min={2} max={5} value={p} onChange={(e) => setP(Number(e.target.value))} /><output className="c-num">{p}</output></label>
      </div>
      <div className="lcd-scroll">
        <table className="nice lr-table">
          <thead><tr><th /><th>Left side</th><th>Value</th><th>Right side</th><th>Value</th><th /></tr></thead>
          <tbody>
            {rows.map((r) => {
              const eq = Math.abs(r.lv - r.rv) < 1e-9;
              return (
                <tr key={r.name} className={r.ok ? '' : 'lr-bad'}>
                  <td>{r.name}</td><td><Tex>{r.l}</Tex></td><td>{f4(r.lv)}</td><td><Tex>{r.r}</Tex></td><td>{f4(r.rv)}</td>
                  <td className={eq ? 'hit' : 'miss'}>{eq ? '=' : '≠'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="lb-note">Logarithms turn multiplication into addition, division into subtraction, and powers into multiplication — because they <em>are</em> exponents. But there is no rule for the log of a <strong>sum</strong>.</p>
    </div>
  );
}
