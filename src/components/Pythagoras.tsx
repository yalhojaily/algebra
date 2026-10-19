import { useState } from 'react';
import { Tex } from './MathText';

/** The Pythagorean theorem with squares built on each side of a right triangle. */
export default function Pythagoras() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = Math.hypot(a, b);
  const s = 22;
  const ox = 0, oy = 0; // right-angle corner
  const A = [ox, oy], B = [ox + b * s, oy], C = [ox, oy - a * s];
  const pts = (p: number[][]) => p.map((q) => q.join(',')).join(' ');
  // Square on the hypotenuse: push the side B→C outward (away from the right angle).
  const dx = C[0] - B[0], dy = C[1] - B[1];
  let nx = -dy, ny = dx; // a perpendicular of the same length
  // point it away from the right angle A
  const mx = (B[0] + C[0]) / 2, my = (B[1] + C[1]) / 2;
  if ((mx + nx - A[0]) ** 2 + (my + ny - A[1]) ** 2 < (mx - nx - A[0]) ** 2 + (my - ny - A[1]) ** 2) { nx = -nx; ny = -ny; }
  const sqC = [B, C, [C[0] + nx, C[1] + ny], [B[0] + nx, B[1] + ny]];
  const all = [A, B, C, ...sqC, [A[0] - a * s, A[1]], [A[0], A[1] + b * s]];
  const pad = 14;
  const x0 = Math.min(...all.map((q) => q[0])) - pad, x1 = Math.max(...all.map((q) => q[0])) + pad;
  const fs = Math.max(8, Math.min(15, (x1 - x0) / 22));
  const y0 = Math.min(...all.map((q) => q[1])) - pad, y1 = Math.max(...all.map((q) => q[1])) + pad;
  return (
    <div className="py card">
      <div className="px-body">
        <svg viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} style={{ maxHeight: 380 }} className="am-svg" role="img" aria-label="Right triangle with squares on each side">
          <polygon points={pts([A, B, [B[0], B[1] + b * s], [A[0], A[1] + b * s]])} className="sq-ab" />
          <polygon points={pts([A, C, [C[0] - a * s, C[1]], [A[0] - a * s, A[1]]])} className="sq-a" />
          <polygon points={pts(sqC)} className="sq-b" />
          <polygon points={pts([A, B, C])} className="py-tri" />
          <rect x={A[0]} y={A[1] - 12} width={12} height={12} className="py-right" />
          <text x={A[0] - (a * s) / 2} y={A[1] - (a * s) / 2 + 5} className="sq-lab" style={{ fontSize: fs }}>a² = {a * a}</text>
          <text x={A[0] + (b * s) / 2} y={A[1] + (b * s) / 2 + 5} className="sq-lab" style={{ fontSize: fs }}>b² = {b * b}</text>
          <text x={(B[0] + C[0]) / 2 + nx / 2} y={(B[1] + C[1]) / 2 + ny / 2 + 5} className="sq-lab" style={{ fontSize: fs }}>c² = {+(c * c).toFixed(2)}</text>
        </svg>
        <div className="px-side">
          <div className="pb-row el-result"><Tex>{'a^2 + b^2 = c^2'}</Tex></div>
          <div className="pb-row"><Tex>{`${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}`}</Tex></div>
          <div className="pb-row"><Tex>{`c = \\sqrt{${a * a + b * b}} ${Number.isInteger(c) ? `= ${c}` : `\\approx ${c.toFixed(2)}`}`}</Tex></div>
          <p className="lb-note">The two smaller squares together have exactly the same area as the square on the hypotenuse. {Number.isInteger(c) ? <>({a}, {b}, {c}) is a <strong>Pythagorean triple</strong> — all whole numbers.</> : 'Try 3–4, 5–12 or 6–8 for whole-number answers.'}</p>
        </div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>leg a</span><input type="range" min={1} max={8} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>leg b</span><input type="range" min={1} max={12} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
      </div>
    </div>
  );
}
