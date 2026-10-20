import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

/** y = a·√(x − h) + k (or a cube root): see how the domain starts where the radicand is 0, and how cube roots have no restriction. */
export default function RootGraph() {
  const [cube, setCube] = useState(false);
  const [a, setA] = useState(1);
  const [h, setH] = useState(-2);
  const [k, setK] = useState(1);
  const f = (x: number) => a * (cube ? Math.cbrt(x - h) : Math.sqrt(x - h)) + k;
  const inner = h === 0 ? 'x' : `x ${h < 0 ? '+' : '-'} ${Math.abs(h)}`;
  const coef = a === 1 ? '' : a === -1 ? '-' : String(a);
  const eq = `y = ${coef}${cube ? `\\sqrt[3]{${inner}}` : `\\sqrt{${inner}}`}${k ? ` ${k < 0 ? '-' : '+'} ${Math.abs(k)}` : ''}`;
  const domain = cube ? '(-\\infty, \\infty)' : `[${h}, \\infty)`;
  const range = cube ? '(-\\infty, \\infty)' : a > 0 ? `[${k}, \\infty)` : `(-\\infty, ${k}]`;
  return (
    <div className="rg card">
      <div className="pr-tabs">
        <button className={`pr-tab ${!cube ? 'on' : ''}`} onClick={() => setCube(false)}>Square root</button>
        <button className={`pr-tab ${cube ? 'on' : ''}`} onClick={() => setCube(true)}>Cube root</button>
      </div>
      <div className="px-body">
        <Plane range={8} size={360} points={cube ? [] : [{ x: h, y: k, cls: 'red', label: `(${h}, ${k})` }]}>
          {({ X, Y }) => {
            let d = '';
            const lo = cube ? -8 : h;
            for (let i = 0; i <= 400; i++) {
              const x = lo + ((8 - lo) * i) / 400;
              const y = f(x);
              if (!Number.isFinite(y) || Math.abs(y) > 9) continue;
              d += `${d ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(y).toFixed(1)} `;
            }
            return <path d={d} className="pl-line" fill="none" />;
          }}
        </Plane>
        <div className="px-side">
          <div className="lb-eq"><Tex>{eq}</Tex></div>
          <div className="pb-row"><span className="el-step">Domain</span><Tex>{domain}</Tex></div>
          <div className="pb-row"><span className="el-step">Range</span><Tex>{range}</Tex></div>
          <p className="lb-note">{cube ? 'A cube root accepts any real number — negative numbers have real cube roots — so the domain is all real numbers.' : <>A square root needs a radicand that is not negative: <Tex>{`${inner} \\ge 0`}</Tex>, so <Tex>{`x \\ge ${h}`}</Tex>. The graph starts at the red point.</>}</p>
          <div className="am-controls">
            <label className="el-slider"><span>stretch a</span><input type="range" min={-3} max={3} value={a} onChange={(e) => setA(Number(e.target.value) || 1)} /><output className="c-var">{a}</output></label>
            <label className="el-slider"><span>shift right h</span><input type="range" min={-6} max={6} value={h} onChange={(e) => setH(Number(e.target.value))} /><output className="c-op">{h}</output></label>
            <label className="el-slider"><span>shift up k</span><input type="range" min={-5} max={5} value={k} onChange={(e) => setK(Number(e.target.value))} /><output className="c-num">{k}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
