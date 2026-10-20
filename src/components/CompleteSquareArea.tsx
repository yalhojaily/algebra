import { useState } from 'react';
import { Tex } from './MathText';

/** x² + bx as an area: a square plus two thin rectangles of width b/2. The missing corner, (b/2)², completes the square. */
export default function CompleteSquareArea() {
  const [b, setB] = useState(6);
  const [filled, setFilled] = useState(false);
  const h = b / 2;
  const X = 150, unit = 18; // x drawn as 150px, 1 unit = 18px
  const H = h * unit, S = X + H;
  const pad = 30;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(n));
  return (
    <div className="csa card">
      <div className="px-body">
        <svg viewBox={`0 0 ${S + pad * 2} ${S + pad * 2}`} className="am-svg csa-svg" role="img" aria-label="Completing the square with areas">
          <g transform={`translate(${pad},${pad})`}>
            <rect x={0} y={0} width={X} height={X} className="sq-a" />
            <rect x={X} y={0} width={H} height={X} className="sq-b" />
            <rect x={0} y={X} width={X} height={H} className="sq-b" />
            <rect x={X} y={X} width={H} height={H} className={filled ? 'sq-ab csa-corner on' : 'csa-corner'} />
            <text x={X / 2} y={X / 2 + 6} className="sq-lab">x²</text>
            <text x={X + H / 2} y={X / 2 + 6} className="sq-lab">{fmt(h)}x</text>
            <text x={X / 2} y={X + H / 2 + 6} className="sq-lab">{fmt(h)}x</text>
            {filled && <text x={X + H / 2} y={X + H / 2 + 6} className="sq-lab">{fmt(h * h)}</text>}
            <text x={X / 2} y={-8} className="sq-lab cut">x</text>
            <text x={X + H / 2} y={-8} className="sq-lab cut">{fmt(h)}</text>
          </g>
        </svg>
        <div className="px-side">
          <div className="pb-row"><Tex>{`x^2 + ${b}x = x^2 + ${fmt(h)}x + ${fmt(h)}x`}</Tex></div>
          <p className="lb-note">Split the <Tex>{`${b}x`}</Tex> into two strips of <Tex>{`${fmt(h)}x`}</Tex> and put them on two sides of the <Tex>{'x^2'}</Tex> square. One corner is missing: a little square of side <Tex>{String(fmt(h))}</Tex>.</p>
          <button className="btn btn-primary" onClick={() => setFilled(!filled)}>{filled ? 'Remove the corner' : `Add the corner: (${fmt(h)})² = ${fmt(h * h)}`}</button>
          {filled && <div className="pb-row el-result"><Tex>{`x^2 + ${b}x + ${fmt(h * h)} = (x + ${fmt(h)})^2`}</Tex></div>}
          <label className="el-slider"><span>b</span><input type="range" min={2} max={12} step={2} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-var">{b}</output></label>
          <p className="lb-note">The number that completes the square is always <Tex>{'\\left(\\tfrac{b}{2}\\right)^2'}</Tex>.</p>
        </div>
      </div>
    </div>
  );
}
