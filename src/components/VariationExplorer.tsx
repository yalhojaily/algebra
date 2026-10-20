import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(2)));

/** Direct variation y = kx versus inverse variation y = k/x, with a table that shows what stays constant. */
export default function VariationExplorer() {
  const [inverse, setInverse] = useState(false);
  const [k2, setK2] = useState(4); // k = k2 / 2
  const k = k2 / 2;
  const f = (x: number) => (inverse ? k / x : k * x);
  const xs = [1, 2, 3, 4, 6];
  const path = (X: (x: number) => number, Y: (y: number) => number) => {
    const parts: string[] = [];
    for (const [lo, hi] of inverse ? [[0.05, 10], [-10, -0.05]] : [[-10, 10]]) {
      let d = '';
      for (let i = 0; i <= 300; i++) {
        const x = lo + ((hi - lo) * i) / 300;
        const y = f(x);
        if (Math.abs(y) > 40) continue;
        d += `${d ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(y).toFixed(1)} `;
      }
      parts.push(d);
    }
    return parts;
  };
  return (
    <div className="ve card">
      <div className="pr-tabs">
        <button className={`pr-tab ${!inverse ? 'on' : ''}`} onClick={() => setInverse(false)}>Direct: y = kx</button>
        <button className={`pr-tab ${inverse ? 'on' : ''}`} onClick={() => setInverse(true)}>Inverse: y = k/x</button>
      </div>
      <div className="px-body">
        <Plane range={10} size={360} points={xs.filter((x) => Math.abs(f(x)) <= 10).map((x) => ({ x, y: f(x), cls: 'red' }))}>
          {({ X, Y }) => path(X, Y).map((d, i) => <path key={i} d={d} className="pl-line" fill="none" />)}
        </Plane>
        <div className="px-side">
          <div className="lb-eq"><Tex>{inverse ? `y = \\frac{${fmt(k)}}{x}` : `y = ${fmt(k)}x`}</Tex></div>
          <table className="nice ve-table">
            <thead><tr><th>x</th><th>y</th><th>{inverse ? 'x · y' : 'y ÷ x'}</th></tr></thead>
            <tbody>
              {xs.map((x) => <tr key={x}><td>{x}</td><td>{fmt(f(x))}</td><td className="hit">{fmt(inverse ? x * f(x) : f(x) / x)}</td></tr>)}
            </tbody>
          </table>
          <p className="lb-note">
            {inverse
              ? <>As x doubles, y is cut in <strong>half</strong>. The product <strong>xy = k</strong> never changes.</>
              : <>As x doubles, y <strong>doubles</strong>. The ratio <strong>y/x = k</strong> never changes, and the graph is a line through the origin.</>}
          </p>
        </div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>constant of variation k</span><input type="range" min={1} max={24} value={k2} onChange={(e) => setK2(Number(e.target.value))} /><output className="c-var">{fmt(k)}</output></label>
      </div>
    </div>
  );
}
