import { useState } from 'react';
import { Tex } from './MathText';

const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** Why multiplying both sides by a negative number reverses an inequality: the number line gets reflected. */
export default function FlipDemo() {
  const [a, setA] = useState(-2);
  const [b, setB] = useState(4);
  const [k, setK] = useState(-2);
  const lo = -20, hi = 20, W = 620, PAD = 20;
  const x = (v: number) => PAD + ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (W - 2 * PAD);
  const rel = (u: number, v: number) => (u < v ? '<' : u > v ? '>' : '=');
  const ka = k * a, kb = k * b;

  const line = (y: number, u: number, v: number, labU: string, labV: string) => (
    <g>
      <line x1={6} x2={W - 6} y1={y} y2={y} className="ray-axis" />
      {Array.from({ length: (hi - lo) / 5 + 1 }, (_, i) => lo + i * 5).map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={y - 4} y2={y + 4} className="ray-tick" />
          <text x={x(t)} y={y + 18} className="ray-num">{t}</text>
        </g>
      ))}
      <circle cx={x(u)} cy={y} r={7} className="fd-a" />
      <text x={x(u)} y={y - 12} className="fd-lab a">{labU}</text>
      <circle cx={x(v)} cy={y} r={7} className="fd-b" />
      <text x={x(v)} y={y - 12} className="fd-lab b">{labV}</text>
    </g>
  );

  return (
    <div className="fd card">
      <svg viewBox={`0 0 ${W} 170`} className="ie-svg" role="img" aria-label="Two numbers before and after multiplying">
        {line(40, a, b, `a = ${a}`, `b = ${b}`)}
        {line(130, ka, kb, `${k}a = ${ka}`, `${k}b = ${kb}`)}
      </svg>
      <div className="fd-eqs">
        <div><span className="el-step">Before</span><Tex>{`\\htmlClass{c-var}{${a}} ${rel(a, b)} \\htmlClass{c-eq}{${b}}`}</Tex></div>
        <div><span className="el-step">× {k}</span><Tex>{`\\htmlClass{c-var}{${p(k)} \\cdot ${p(a)}} \\;?\\; \\htmlClass{c-eq}{${p(k)} \\cdot ${p(b)}}`}</Tex></div>
        <div><span className="el-step">After</span><Tex>{`\\htmlClass{c-var}{${ka}} ${rel(ka, kb)} \\htmlClass{c-eq}{${kb}}`}</Tex></div>
      </div>
      <div className={`bc-verdict ${k < 0 && a !== b ? 'no' : 'yes'}`}>
        {k > 0 && 'Multiplying by a positive number stretches the line but keeps the order: the sign stays the same.'}
        {k < 0 && a !== b && <strong>Multiplying by a negative number flips the number line around 0, so the order reverses: the inequality sign must be reversed.</strong>}
        {k === 0 && 'Multiplying by 0 makes both sides 0 — that loses all information, so it is never allowed.'}
        {a === b && k !== 0 && 'The numbers are equal, so they stay equal.'}
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>a</span><input type="range" min={-6} max={6} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>b</span><input type="range" min={-6} max={6} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-eq">{b}</output></label>
        <label className="el-slider"><span>multiply by</span><input type="range" min={-3} max={3} value={k} onChange={(e) => setK(Number(e.target.value))} /><output className="c-op">{k}</output></label>
      </div>
    </div>
  );
}
