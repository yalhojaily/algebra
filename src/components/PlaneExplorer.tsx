import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

const QUAD = (x: number, y: number) =>
  x === 0 && y === 0 ? 'the origin' : x === 0 ? 'on the y-axis' : y === 0 ? 'on the x-axis' : `Quadrant ${x > 0 ? (y > 0 ? 'I' : 'IV') : y > 0 ? 'II' : 'III'}`;

/** Click anywhere to plot a point: see its coordinates, the path from the origin, and its quadrant. Optionally test it against an equation. */
export default function PlaneExplorer() {
  const [pt, setPt] = useState<[number, number]>([4, -3]);
  const [test, setTest] = useState(false);
  const [x, y] = pt;
  const onLine = y === 2 * x - 1;
  return (
    <div className="px card">
      <div className="px-body">
        <Plane
          size={400}
          onPick={(a, b) => setPt([a, b])}
          lines={test ? [{ a: -2, b: 1, c: -1, cls: 'faint' }] : []}
          points={[{ x, y, label: `(${x}, ${y})`, cls: test ? (onLine ? 'answer' : 'red') : '' }]}
        >
          {({ X, Y }) => (
            <g className="px-path">
              <line x1={X(0)} y1={Y(0)} x2={X(x)} y2={Y(0)} className="px-run" />
              <line x1={X(x)} y1={Y(0)} x2={X(x)} y2={Y(y)} className="px-rise" />
            </g>
          )}
        </Plane>
        <div className="px-side">
          <div className="px-big"><Tex>{`(\\htmlClass{c-var}{${x}},\\ \\htmlClass{c-op}{${y}})`}</Tex></div>
          <p>
            Start at the origin. Move <strong className="c-var">{Math.abs(x)} {x >= 0 ? 'right' : 'left'}</strong> (the <em>x</em>-coordinate), then{' '}
            <strong className="c-op">{Math.abs(y)} {y >= 0 ? 'up' : 'down'}</strong> (the <em>y</em>-coordinate).
          </p>
          <p>This point is <strong>{QUAD(x, y)}</strong>.</p>
          <label className="nl-toggle">
            <input type="checkbox" checked={test} onChange={(e) => setTest(e.target.checked)} /> Test it in <Tex>y = 2x - 1</Tex>
          </label>
          {test && (
            <div className={`bc-verdict ${onLine ? 'yes' : 'no'}`}>
              <Tex>{`2(${x}) - 1 = ${2 * x - 1}`}</Tex>{' '}
              {onLine ? <>equals <Tex>{`y = ${y}`}</Tex> — a solution, and it lies <strong>on</strong> the line.</> : <>but <Tex>{`y = ${y}`}</Tex> — not a solution, so it is <strong>off</strong> the line.</>}
            </div>
          )}
          <p className="nl-tip">Click anywhere on the grid.</p>
        </div>
      </div>
    </div>
  );
}
