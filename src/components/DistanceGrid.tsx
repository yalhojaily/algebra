import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

function simplify(n: number) {
  let out = 1, inside = n;
  for (let p = 2; p * p <= inside; p++) while (inside % (p * p) === 0) { inside /= p * p; out *= p; }
  return inside === 1 ? String(out) : `${out === 1 ? '' : out}\\sqrt{${inside}}`;
}
const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** The distance formula is the Pythagorean theorem: the horizontal and vertical legs make a right triangle. */
export default function DistanceGrid() {
  const [pts, setPts] = useState<[number, number][]>([[-3, -2], [3, 2]]);
  const pick = (x: number, y: number) => setPts((s) => [...s, [x, y] as [number, number]].slice(-2));
  const [[x1, y1], [x2, y2]] = pts.length === 2 ? pts : [pts[0], pts[0]];
  const dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy;
  return (
    <div className="dg card">
      <div className="px-body">
        <Plane range={8} size={360} onPick={pick} label="Click two points"
          segments={[{ x1, y1, x2, y2 }, { x1, y1, x2, y2: y1, cls: 'faint' }, { x1: x2, y1, x2, y2, cls: 'faint' }]}
          points={[{ x: x1, y: y1, cls: 'amber', label: `(${x1}, ${y1})` }, { x: x2, y: y2, cls: 'red', label: `(${x2}, ${y2})` }]} />
        <div className="px-side">
          <div className="pb-row"><span className="el-step">Horizontal leg</span><Tex>{`|${x2} - ${p(x1)}| = ${Math.abs(dx)}`}</Tex></div>
          <div className="pb-row"><span className="el-step">Vertical leg</span><Tex>{`|${y2} - ${p(y1)}| = ${Math.abs(dy)}`}</Tex></div>
          <div className="pb-row"><span className="el-step">Pythagoras</span><Tex>{`d^2 = ${Math.abs(dx)}^2 + ${Math.abs(dy)}^2 = ${d2}`}</Tex></div>
          <div className="pb-row el-result"><Tex>{`d = \\sqrt{${d2}}${simplify(d2) !== `\\sqrt{${d2}}` ? ` = ${simplify(d2)}` : ''}${Number.isInteger(Math.sqrt(d2)) ? '' : ` \\approx ${Math.sqrt(d2).toFixed(2)}`}`}</Tex></div>
          <p className="lb-note">Click the grid to move the points (the older one is replaced). The formula <Tex>{'d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}'}</Tex> is just <Tex>{'a^2 + b^2 = c^2'}</Tex> on the grid.</p>
        </div>
      </div>
    </div>
  );
}
