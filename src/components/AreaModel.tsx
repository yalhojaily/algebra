import { useState } from 'react';
import { Tex } from './MathText';

/** The distributive law as area: a rectangle a wide and (b + c) long is the same as two rectangles, a·b and a·c. */
export default function AreaModel() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(5);
  const [c, setC] = useState(3);
  const [useX, setUseX] = useState(false);
  const s = 22;
  const W = 14 * s + 60;
  const H = 8 * s + 60;
  const bLabel = useX ? 'x' : String(b);

  return (
    <div className="am card">
      <div className="am-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="am-svg" role="img" aria-label={`A ${a} by ${b} plus ${c} rectangle split into two parts`}>
          <g transform="translate(40 30)">
            <rect x={0} y={0} width={b * s} height={a * s} className="am-left" />
            <rect x={b * s} y={0} width={c * s} height={a * s} className="am-right" />
            {!useX &&
              Array.from({ length: a }).map((_, r) =>
                Array.from({ length: b + c }).map((_, k) => (
                  <rect key={`${r}-${k}`} x={k * s + 2} y={r * s + 2} width={s - 4} height={s - 4} rx={3} className={k < b ? 'am-cell l' : 'am-cell r'} />
                )),
              )}
            <text x={(b * s) / 2} y={(a * s) / 2 + 6} className="am-area l">{useX ? `${a}x` : a * b}</text>
            <text x={b * s + (c * s) / 2} y={(a * s) / 2 + 6} className="am-area r">{a * c}</text>
            <text x={(b * s) / 2} y={-10} className="am-dim l">{bLabel}</text>
            <text x={b * s + (c * s) / 2} y={-10} className="am-dim r">{c}</text>
            <text x={-14} y={(a * s) / 2 + 5} className="am-dim a">{a}</text>
            <line x1={0} x2={(b + c) * s} y1={a * s + 16} y2={a * s + 16} className="am-brace" />
            <text x={((b + c) * s) / 2} y={a * s + 34} className="am-dim">{useX ? `x + ${c}` : `${b} + ${c} = ${b + c}`}</text>
          </g>
        </svg>
        <div className="am-side">
          <div className="am-row">
            <span className="am-k">One big rectangle</span>
            <Tex>{`\\htmlClass{c-var}{${a}}(\\htmlClass{c-num}{${bLabel}} + \\htmlClass{c-op}{${c}})${useX ? '' : ` = ${a} \\cdot ${b + c} = ${a * (b + c)}`}`}</Tex>
          </div>
          <div className="am-eq">=</div>
          <div className="am-row">
            <span className="am-k">Two smaller rectangles</span>
            <Tex>{`\\htmlClass{c-var}{${a}} \\cdot \\htmlClass{c-num}{${bLabel}} + \\htmlClass{c-var}{${a}} \\cdot \\htmlClass{c-op}{${c}}${useX ? ` = ${a}x + ${a * c}` : ` = ${a * b} + ${a * c} = ${a * b + a * c}`}`}</Tex>
          </div>
          <label className="nl-toggle">
            <input type="checkbox" checked={useX} onChange={(e) => setUseX(e.target.checked)} /> Make one length a variable, <Tex>x</Tex>
          </label>
        </div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>width</span><input type="range" min={1} max={8} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        {!useX && <label className="el-slider"><span>first length</span><input type="range" min={1} max={8} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-num">{b}</output></label>}
        <label className="el-slider"><span>second length</span><input type="range" min={1} max={6} value={c} onChange={(e) => setC(Number(e.target.value))} /><output className="c-op">{c}</output></label>
      </div>
    </div>
  );
}
