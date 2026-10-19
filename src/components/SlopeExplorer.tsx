import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Plane } from './Plane';
import { Tex } from './MathText';

/** Click to move two points; see rise, run, and slope — including zero and undefined slopes. */
export default function SlopeExplorer() {
  const [p1, setP1] = useState<[number, number]>([-3, -2]);
  const [p2, setP2] = useState<[number, number]>([3, 2]);
  const [turn, setTurn] = useState(0);
  const rise = p2[1] - p1[1];
  const run = p2[0] - p1[0];
  const same = rise === 0 && run === 0;
  const kind = same ? 'same' : run === 0 ? 'undef' : rise === 0 ? 'zero' : rise / run > 0 ? 'pos' : 'neg';
  const m = run !== 0 ? new Frac(rise, run) : null;
  return (
    <div className="sx card">
      <div className="px-body">
        <Plane
          size={400}
          onPick={(x, y) => {
            if (turn === 0) setP1([x, y]);
            else setP2([x, y]);
            setTurn(1 - turn);
          }}
          lines={same ? [] : [{ a: rise, b: -run, c: rise * p1[0] - run * p1[1] }]}
          points={[{ x: p1[0], y: p1[1], label: `P₁(${p1[0]}, ${p1[1]})` }, { x: p2[0], y: p2[1], label: `P₂(${p2[0]}, ${p2[1]})`, cls: 'mine' }]}
        >
          {({ X, Y }) => (
            <g>
              <line x1={X(p1[0])} y1={Y(p1[1])} x2={X(p2[0])} y2={Y(p1[1])} className="px-run" />
              <line x1={X(p2[0])} y1={Y(p1[1])} x2={X(p2[0])} y2={Y(p2[1])} className="px-rise" />
              {run !== 0 && <text x={(X(p1[0]) + X(p2[0])) / 2} y={Y(p1[1]) + (rise > 0 ? 16 : -8)} className="px-lab run">run {run}</text>}
              {rise !== 0 && <text x={X(p2[0]) + 6} y={(Y(p1[1]) + Y(p2[1])) / 2} className="px-lab rise">rise {rise}</text>}
            </g>
          )}
        </Plane>
        <div className="px-side">
          <div className="px-big">
            {m ? <Tex>{`m = \\dfrac{\\text{rise}}{\\text{run}} = \\dfrac{\\htmlClass{c-op}{${rise}}}{\\htmlClass{c-var}{${run}}} = ${m.tex()}`}</Tex> : <Tex>{`m = \\dfrac{${rise}}{0}`}</Tex>}
          </div>
          <div className={`sx-kind ${kind}`}>
            {{ pos: 'Positive slope — the line rises from left to right.', neg: 'Negative slope — the line falls from left to right.', zero: 'Zero slope — a horizontal line. No rise at all.', undef: 'Undefined slope — a vertical line. The run is 0, and division by 0 is undefined.', same: 'The two points are the same — pick a different second point.' }[kind]}
          </div>
          {m && Math.abs(m.valueOf()) > 0 && <p>Steepness: <Tex>{`|m| = ${new Frac(Math.abs(m.n), m.d).tex()}`}</Tex>. The bigger <Tex>|m|</Tex>, the steeper the line.</p>}
          <p className="nl-tip">Click the grid to move <strong>{turn === 0 ? 'P₁' : 'P₂'}</strong> next.</p>
        </div>
      </div>
    </div>
  );
}
