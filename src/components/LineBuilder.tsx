import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Plane } from './Plane';
import { Tex } from './MathText';

const SLOPES = [[-3, 1], [-2, 1], [-3, 2], [-1, 1], [-2, 3], [-1, 2], [0, 1], [1, 3], [1, 2], [2, 3], [1, 1], [3, 2], [2, 1], [3, 1]];

/** y = mx + b: build a table, plot the points, and see the line — and what m and b do to it. */
export default function LineBuilder() {
  const [si, setSi] = useState(10);
  const [b, setB] = useState(-2);
  const m = new Frac(SLOPES[si][0], SLOPES[si][1]);
  const step = m.d;
  const xs = [-2, -1, 0, 1, 2].map((k) => k * step);
  const rows = xs.map((x) => [x, m.mul(x).add(b)] as const);
  const eq = `y = ${m.isZero() ? '' : m.eq(1) ? 'x' : m.eq(-1) ? '-x' : `${m.tex()}x`}${m.isZero() ? b : b === 0 ? '' : b < 0 ? ` - ${-b}` : ` + ${b}`}`;
  return (
    <div className="lb card">
      <div className="lb-eq"><Tex>{eq}</Tex></div>
      <div className="px-body">
        <Plane
          size={400}
          lines={[{ a: -m.n, b: m.d, c: b * m.d }]}
          points={rows.filter(([x, y]) => Math.abs(y.valueOf()) <= 10 && Math.abs(x) <= 10).map(([x, y]) => ({ x, y: y.valueOf(), cls: x === 0 ? 'amber' : '' }))}
        >
          {({ X, Y }) =>
            m.isZero() ? null : (
              <g>
                <line x1={X(0)} y1={Y(b)} x2={X(m.d)} y2={Y(b)} className="px-run" />
                <line x1={X(m.d)} y1={Y(b)} x2={X(m.d)} y2={Y(b + m.n)} className="px-rise" />
              </g>
            )
          }
        </Plane>
        <div className="px-side">
          <table className="nice lb-table">
            <thead><tr><th className="lb-th">x</th><th className="lb-th">y</th></tr></thead>
            <tbody>
              {rows.map(([x, y]) => (
                <tr key={x} className={x === 0 ? 'yi' : ''}><td>{x}</td><td><Tex>{y.tex()}</Tex></td></tr>
              ))}
            </tbody>
          </table>
          <p className="lb-note">
            The <strong className="c-num">orange point</strong> is the <em>y</em>-intercept <Tex>{`(0, ${b})`}</Tex>. From there, every{' '}
            <span className="c-var">{m.d} step{m.d > 1 ? 's' : ''} right</span> the line goes{' '}
            <span className="c-op">{Math.abs(m.n)} {m.n >= 0 ? 'up' : 'down'}</span>.
          </p>
        </div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>slope m</span><input type="range" min={0} max={SLOPES.length - 1} value={si} onChange={(e) => setSi(Number(e.target.value))} /><output className="c-op"><Tex>{m.tex()}</Tex></output></label>
        <label className="el-slider"><span>y-intercept b</span><input type="range" min={-6} max={6} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-num">{b}</output></label>
      </div>
    </div>
  );
}
