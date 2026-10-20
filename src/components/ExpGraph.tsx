import { useState } from 'react';
import { FnPlot } from './FnPlot';
import { Tex } from './MathText';

const bases = [0.25, 0.5, 0.8, 1.5, 2, 3];
const bTex = (b: number) => (b === 0.25 ? '\\left(\\tfrac14\\right)' : b === 0.5 ? '\\left(\\tfrac12\\right)' : b < 1 ? `(${b})` : String(b));
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(3)));

/** f(x) = a·bˣ: growth when b > 1, decay when 0 < b < 1. Each step right multiplies by b. */
export default function ExpGraph() {
  const [bi, setBi] = useState(4);
  const [a, setA] = useState(1);
  const b = bases[bi];
  const f = (x: number) => a * b ** x;
  const xs = [-2, -1, 0, 1, 2, 3];
  return (
    <div className="eg card">
      <div className="lb-eq"><Tex>{`f(x) = ${a === 1 ? '' : `${a} \\cdot `}${bTex(b)}^x`}</Tex></div>
      <div className="px-body">
        <FnPlot fns={[{ f }]} x={[-4, 4]} y={[-1, 12]} yStep={2} hlines={[{ y: 0, cls: 'alt' }]} points={xs.map((x) => ({ x, y: f(x), cls: x === 0 ? 'red' : '' }))} width={380} height={300} />
        <div className="px-side">
          <div className={`vlt-count ${b > 1 ? 'ok' : 'bad'}`}>{b > 1 ? 'b > 1: exponential growth' : '0 < b < 1: exponential decay'}</div>
          <table className="nice ve-table">
            <thead><tr><th>x</th>{xs.map((x) => <th key={x}>{x}</th>)}</tr></thead>
            <tbody><tr><td>f(x)</td>{xs.map((x) => <td key={x}>{fmt(f(x))}</td>)}</tr></tbody>
          </table>
          <p className="lb-note">Each step to the right <strong>multiplies</strong> by <Tex>{String(b)}</Tex>. The graph passes through <Tex>{`(0, ${a})`}</Tex> and approaches the <strong>asymptote</strong> <Tex>{'y = 0'}</Tex> but never touches it — <Tex>{'b^x'}</Tex> is always positive.</p>
          <div className="am-controls">
            <label className="el-slider"><span>base b</span><input type="range" min={0} max={bases.length - 1} value={bi} onChange={(e) => setBi(Number(e.target.value))} /><output className="c-var">{b}</output></label>
            <label className="el-slider"><span>a</span><input type="range" min={1} max={4} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-op">{a}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
