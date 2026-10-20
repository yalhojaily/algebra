import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Plane } from './Plane';
import { Tex } from './MathText';

const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** Click two points; build the equation of the line through them — slope, point–slope form, slope–intercept form. */
export default function TwoPointLine() {
  const [pts, setPts] = useState<[number, number][]>([[-2, -1], [4, 3]]);
  const pick = (x: number, y: number) => setPts((s) => [...s, [x, y] as [number, number]].slice(-2));
  const [[x1, y1], [x2, y2]] = pts.length === 2 ? pts : [pts[0], pts[0]];
  const same = x1 === x2 && y1 === y2;
  const vertical = x1 === x2 && !same;
  const m = !vertical && !same ? new Frac(y2 - y1, x2 - x1) : null;
  const b = m ? m.mul(-x1).add(y1) : null;
  const lin = (mm: Frac, bb: Frac) => {
    const mt = mm.isZero() ? '' : mm.eq(1) ? 'x' : mm.eq(-1) ? '-x' : `${mm.tex()}x`;
    if (bb.isZero()) return mt || '0';
    if (!mt) return bb.tex();
    return `${mt} ${bb.valueOf() < 0 ? '-' : '+'} ${bb.valueOf() < 0 ? bb.neg().tex() : bb.tex()}`;
  };
  return (
    <div className="tp card">
      <div className="px-body">
        <Plane range={8} size={360} onPick={pick} label="Click two points"
          lines={m ? [{ a: -m.n, b: m.d, c: -m.n * x1 + m.d * y1 }] : vertical ? [{ a: 1, b: 0, c: x1 }] : []}
          points={pts.map(([x, y], i) => ({ x, y, cls: i ? 'red' : 'amber', label: `(${x}, ${y})` }))} />
        <ol className="ac-steps tp-steps">
          {same ? <li><span className="sr-num">1</span><div>Click two <strong>different</strong> points on the grid.</div></li> : vertical ? (
            <li><span className="sr-num">1</span><div><div className="ac-h">Vertical line</div><Tex>{`x = ${x1}`}</Tex> — the run is 0, so the slope is undefined.</div></li>
          ) : (
            <>
              <li><span className="sr-num">1</span><div><div className="ac-h">Slope</div><Tex>{`m = \\dfrac{${y2} - ${p(y1)}}{${x2} - ${p(x1)}} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${m!.tex()}`}</Tex></div></li>
              <li><span className="sr-num">2</span><div><div className="ac-h">Point–slope form (using the first point)</div><Tex>{`y - ${p(y1)} = ${m!.tex()}(x - ${p(x1)})`}</Tex></div></li>
              <li><span className="sr-num">3</span><div><div className="ac-h">Solve for y: slope–intercept form</div><Tex>{`y = ${lin(m!, b!)}`}</Tex></div></li>
            </>
          )}
        </ol>
      </div>
      <p className="lb-note">Click the grid to place new points (the oldest one is replaced). Using the other point in step 2 gives the same final equation.</p>
    </div>
  );
}
