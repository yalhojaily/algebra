import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Plane } from './Plane';
import { Tex } from './MathText';

const SLOPES: [number, number][] = [[0, 1], [1, 3], [1, 2], [2, 3], [1, 1], [3, 2], [2, 1], [3, 1], [-3, 1], [-2, 1], [-1, 1], [-1, 2]];

/** A line, a parallel line and a perpendicular line through a point you click. Parallel: same slope. Perpendicular: slopes multiply to −1. */
export default function ParallelPerp() {
  const [si, setSi] = useState(5);
  const [P, setP] = useState<[number, number]>([2, -3]);
  const m = new Frac(SLOPES[si][0], SLOPES[si][1]);
  const horizontal = m.isZero();
  const perp = horizontal ? null : new Frac(-m.d, m.n);
  // y = m x  →  −n x + d y = 0 ; through P: −n x + d y = −n Px + d Py
  const base = { a: -m.n, b: m.d, c: 0 };
  const par = { a: -m.n, b: m.d, c: -m.n * P[0] + m.d * P[1], cls: 'alt' };
  const per = horizontal ? { a: 1, b: 0, c: P[0], cls: 'answer' } : { a: -perp!.n, b: perp!.d, c: -perp!.n * P[0] + perp!.d * P[1], cls: 'answer' };
  const t = (f: Frac) => f.tex();
  return (
    <div className="pp card">
      <div className="px-body">
        <Plane range={8} size={360} lines={[base, par, per]} points={[{ x: P[0], y: P[1], cls: 'red', label: `(${P[0]}, ${P[1]})` }]} onPick={(x, y) => setP([x, y])} label="Click to move the point" />
        <div className="px-side">
          <div className="pb-row"><span className="el-step pp-blue">Given</span><Tex>{`y = ${horizontal ? '0' : `${m.eq(1) ? '' : m.eq(-1) ? '-' : t(m)}x`}`}</Tex><span className="pp-slope">slope <Tex>{t(m)}</Tex></span></div>
          <div className="pb-row"><span className="el-step pp-red">Parallel</span><span>same slope <Tex>{t(m)}</Tex></span></div>
          <div className="pb-row"><span className="el-step pp-green">Perp.</span>{horizontal ? <span>a <strong>vertical</strong> line — its slope is undefined</span> : <span>slope <Tex>{t(perp!)}</Tex></span>}</div>
          {!horizontal && <div className="pb-row el-result"><Tex>{`${t(m)} \\cdot ${perp!.valueOf() < 0 ? `\\left(${t(perp!)}\\right)` : t(perp!)} = -1`}</Tex></div>}
          <p className="lb-note">Perpendicular slopes are <strong>opposite reciprocals</strong>: flip the fraction and change the sign. Click the grid to move the point — both new lines pass through it.</p>
          <label className="el-slider"><span>slope of the given line</span><input type="range" min={0} max={SLOPES.length - 1} value={si} onChange={(e) => setSi(Number(e.target.value))} /><output className="c-var"><Tex>{t(m)}</Tex></output></label>
        </div>
      </div>
    </div>
  );
}
