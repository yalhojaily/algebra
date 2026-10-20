import { useState } from 'react';
import { Tex } from './MathText';

const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
/** " = 14/9 = 1 5/9": the reduced fraction and mixed number, when they differ from n/d. */
const tail = (n: number, d: number) => {
  const k = g(n, d);
  const N = n / k, M = d / k;
  if (M === 1) return ` = ${N}`;
  let t = k > 1 ? ` = \\dfrac{${N}}{${M}}` : '';
  if (N > M) t += ` = ${Math.floor(N / M)}\\tfrac{${N % M}}{${M}}`;
  return t;
};
const part = (n: number, d: number) => { const k = g(n, d); return `\\tfrac{${n / k}}{${d / k}}`; };

/** "How many c/d fit into a/b?" — scoops of size c/d laid along a number line, then the keep-change-flip rule. */
export default function DivideFractions() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [c, setC] = useState(1);
  const [d, setD] = useState(4);
  const total = a / b, size = c / d;
  const max = Math.max(1, Math.ceil(total + 1e-9));
  const W = 560, X0 = 20, S = (W - 40) / max;
  const full = Math.floor(total / size + 1e-9);
  const rest = total - full * size;
  const scoops = Array.from({ length: full }, (_, i) => i);
  const n = a * d, D = b * c;
  return (
    <div className="df card">
      <div className="lb-eq"><Tex>{`\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}} = \\; ?`}</Tex></div>
      <p className="lb-note">Read it as: <strong>how many</strong> pieces of size <Tex>{`\\tfrac{${c}}{${d}}`}</Tex> fit into <Tex>{`\\tfrac{${a}}{${b}}`}</Tex>?</p>
      <svg viewBox={`0 0 ${W} 120`} className="df-svg" role="img" aria-label="Number line showing how many divisor-sized pieces fit into the dividend">
        <rect x={X0} y={20} width={total * S} height={22} className="df-total" />
        {scoops.map((i) => <rect key={i} x={X0 + i * size * S} y={52} width={size * S} height={22} className={`df-scoop ${i % 2 ? 'alt' : ''}`} />)}
        {scoops.length < 40 && scoops.map((i) => <text key={`t${i}`} x={X0 + (i + 0.5) * size * S} y={67} className="df-num">{i + 1}</text>)}
        {rest > 1e-9 && <rect x={X0 + full * size * S} y={52} width={rest * S} height={22} className="df-scoop part" />}
        <line x1={X0} x2={X0 + max * S} y1={92} y2={92} className="df-axis" />
        {Array.from({ length: max * b + 1 }, (_, i) => <line key={i} x1={X0 + (i / b) * S} x2={X0 + (i / b) * S} y1={88} y2={96} className="df-tick" />)}
        {Array.from({ length: max + 1 }, (_, i) => <text key={i} x={X0 + i * S} y={112} className="df-lab">{i}</text>)}
      </svg>
      <div className="pb-row"><span className="el-step">Count</span><span>{full} whole piece{full === 1 ? '' : 's'}{rest > 1e-9 ? <> and <Tex>{part(n - full * D, D)}</Tex> of another</> : ''}</span></div>
      <div className="pb-row el-result"><span className="el-step">Rule</span><Tex>{`\\dfrac{${a}}{${b}} \\cdot \\dfrac{${d}}{${c}} = \\dfrac{${n}}{${D}}${tail(n, D)}`}</Tex></div>
      <p className="lb-note">Keep the first fraction, change ÷ to ×, flip the second. {size < total ? 'Dividing by a piece smaller than the amount gives more than 1.' : size > total ? 'The piece is bigger than the amount, so less than one piece fits.' : 'Exactly one piece fits.'}</p>
      <div className="am-controls">
        <label className="el-slider"><span>amount numerator</span><input type="range" min={1} max={12} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>amount denominator</span><input type="range" min={1} max={8} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-var">{b}</output></label>
        <label className="el-slider"><span>piece numerator</span><input type="range" min={1} max={6} value={c} onChange={(e) => setC(Number(e.target.value))} /><output className="c-op">{c}</output></label>
        <label className="el-slider"><span>piece denominator</span><input type="range" min={1} max={12} value={d} onChange={(e) => setD(Number(e.target.value))} /><output className="c-op">{d}</output></label>
      </div>
    </div>
  );
}
