import { useState } from 'react';
import { Plane } from './Plane';

type Shape = { name: string; fn: boolean; draw: Parameters<typeof Plane>[0]; hits: (x: number) => number[] };

const shapes: Shape[] = [
  { name: 'Parabola  y = x² − 4', fn: true, draw: { curves: [{ coefs: [1, 0, -4] }] }, hits: (x) => [x * x - 4] },
  { name: 'Line  y = −x + 2', fn: true, draw: { lines: [{ a: 1, b: 1, c: 2 }] }, hits: (x) => [-x + 2] },
  { name: 'Sideways parabola  x = y² − 3', fn: false, draw: { xcurves: [{ coefs: [1, 0, -3] }] }, hits: (x) => (x + 3 < 0 ? [] : x + 3 === 0 ? [0] : [Math.sqrt(x + 3), -Math.sqrt(x + 3)]) },
  { name: 'Circle  x² + y² = 25', fn: false, draw: { circles: [{ cx: 0, cy: 0, r: 5 }] }, hits: (x) => (Math.abs(x) > 5 ? [] : Math.abs(x) === 5 ? [0] : [Math.sqrt(25 - x * x), -Math.sqrt(25 - x * x)]) },
  { name: 'Cubic  y = 0.2x³ − 2x', fn: true, draw: { curves: [{ coefs: [0.2, 0, -2, 0] }] }, hits: (x) => [0.2 * x ** 3 - 2 * x] },
];

/** Slide a vertical line across a graph. If it ever hits the graph twice, the graph is not a function. */
export default function VerticalLineTest() {
  const [si, setSi] = useState(2);
  const [x, setX] = useState(1);
  const s = shapes[si];
  const ys = s.hits(x).filter((y) => Math.abs(y) <= 8);
  return (
    <div className="vlt card">
      <div className="pr-tabs">{shapes.map((sh, i) => <button key={sh.name} className={`pr-tab ${i === si ? 'on' : ''}`} onClick={() => setSi(i)}>{sh.name.split('  ')[0]}</button>)}</div>
      <div className="px-body">
        <Plane range={8} size={360} {...s.draw} lines={[...(s.draw.lines ?? []), { a: 1, b: 0, c: x, cls: 'alt' }]} points={ys.map((y) => ({ x, y, cls: 'red' }))} />
        <div className="px-side">
          <div className="lb-eq">{s.name.split('  ')[1]}</div>
          <label className="el-slider"><span>vertical line x =</span><input type="range" min={-7} max={7} step={0.5} value={x} onChange={(e) => setX(Number(e.target.value))} /><output className="c-op">{x}</output></label>
          <div className={`vlt-count ${ys.length > 1 ? 'bad' : 'ok'}`}>This vertical line crosses the graph <strong>{ys.length}</strong> time{ys.length === 1 ? '' : 's'}.</div>
          <p className="lb-note">
            {ys.length > 1
              ? <>The input <strong>x = {x}</strong> has two outputs, so this graph is <strong>not</strong> a function.</>
              : s.fn
                ? <>Slide the line all the way across: it never crosses more than once. This graph <strong>is</strong> a function.</>
                : <>Keep sliding — somewhere this line crosses the graph twice.</>}
          </p>
        </div>
      </div>
    </div>
  );
}
