import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(3)));

/** √(x + p) = x − q. Squaring both sides also finds where the line meets −√(x + p) — that is the false ("extraneous") solution. */
export default function RadicalEqGraph() {
  const [p, setP] = useState(14);
  const [q, setQ] = useState(-2);
  // x + p = (x − q)²  →  x² − (2q + 1)x + (q² − p) = 0
  const B = -(2 * q + 1), C = q * q - p;
  const disc = B * B - 4 * C;
  const roots = disc < 0 ? [] : [...new Set([(-B + Math.sqrt(disc)) / 2, (-B - Math.sqrt(disc)) / 2])];
  const good = roots.filter((x) => x + p >= 0 && x - q >= -1e-9);
  const bad = roots.filter((x) => !good.includes(x));
  const rhs = q === 0 ? 'x' : `x ${q < 0 ? '+' : '-'} ${Math.abs(q)}`;
  const rad = p === 0 ? 'x' : `x ${p < 0 ? '-' : '+'} ${Math.abs(p)}`;
  return (
    <div className="re2 card">
      <div className="lb-eq"><Tex>{`\\sqrt{${rad}} = ${rhs}`}</Tex></div>
      <div className="px-body">
        <Plane range={16} yRange={10} size={360} every={4}
          lines={[{ a: -1, b: 1, c: -q, cls: 'alt' }]}
          points={[...good.map((x) => ({ x, y: x - q, cls: 'answer', label: `x = ${fmt(x)}` })), ...bad.map((x) => ({ x, y: x - q, cls: 'red', label: `x = ${fmt(x)} ✗` }))]}>
          {({ X, Y }) => {
            const path = (sgn: number) => {
              let d = '';
              for (let i = 0; i <= 300; i++) {
                const x = -p + (32 * i) / 300;
                const y = sgn * Math.sqrt(x + p);
                if (Math.abs(y) > 10.5 || x > 16.5) continue;
                d += `${d ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(y).toFixed(1)} `;
              }
              return d;
            };
            return (
              <g>
                <path d={path(1)} className="pl-line" fill="none" />
                <path d={path(-1)} className="pl-line faint" fill="none" />
              </g>
            );
          }}
        </Plane>
        <div className="px-side">
          <div className="pb-row"><span className="el-step">Square</span><Tex>{`${rad} = (${rhs})^2`}</Tex></div>
          <div className="pb-row"><span className="el-step">Candidates</span><Tex>{roots.length ? roots.map((x) => `x = ${fmt(x)}`).join(',\\quad ') : '\\text{none}'}</Tex></div>
          <div className={`vlt-count ${good.length ? 'ok' : 'bad'}`}>{good.length ? <>Solution: <Tex>{good.map((x) => `x = ${fmt(x)}`).join(',\\ ')}</Tex></> : 'No solution.'} {bad.length > 0 && <> — <Tex>{bad.map((x) => `x = ${fmt(x)}`).join(',\\ ')}</Tex> is extraneous.</>}</div>
          <p className="lb-note">The blue curve is <Tex>{`y = \\sqrt{${rad}}`}</Tex> and the red line is <Tex>{`y = ${rhs}`}</Tex>. Squaring can't tell <Tex>{'\\sqrt{\\;}'}</Tex> from <Tex>{'-\\sqrt{\\;}'}</Tex> (the dashed curve), so it also finds where the line meets the dashed curve. Those points are not solutions — always check.</p>
          <div className="am-controls">
            <label className="el-slider"><span>p</span><input type="range" min={-6} max={20} value={p} onChange={(e) => setP(Number(e.target.value))} /><output className="c-var">{p}</output></label>
            <label className="el-slider"><span>q</span><input type="range" min={-6} max={6} value={q} onChange={(e) => setQ(Number(e.target.value))} /><output className="c-op">{q}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
