import { useState } from 'react';
import { Tex } from './MathText';

/** With a fixed perimeter, area depends on the width as a downward parabola; its vertex is the best rectangle. */
export default function FenceLab() {
  const P = 40;
  const [w, setW] = useState(4);
  const L = P / 2 - w, A = w * L;
  const W = 520, H = 220;
  // rectangle drawing (left) and A(w) graph (right)
  const s = 8;
  const gx = 270, gw = 230, gh = 170, gy = 20;
  const X = (x: number) => gx + (x / 20) * gw;
  const Y = (a: number) => gy + gh - (a / 110) * gh;
  let d = '';
  for (let i = 0; i <= 100; i++) { const x = (20 * i) / 100; d += `${i ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(x * (20 - x)).toFixed(1)} `; }
  return (
    <div className="fl card">
      <p className="mx-q">You have <strong>{P} m</strong> of fence for a rectangle. What width gives the most area?</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="am-svg" role="img" aria-label="Rectangle and its area function">
        <rect x={20} y={20 + (160 - w * s) / 2} width={L * s} height={w * s} className={`sq-a ${w === 10 ? 'fl-best' : ''}`} />
        <text x={20 + (L * s) / 2} y={20 + (160 - w * s) / 2 - 6} className="sq-lab cut" style={{ fill: 'var(--ink-2)' }}>{L} m</text>
        <text x={20 + L * s + 6} y={100} className="sq-lab cut" style={{ fill: 'var(--ink-2)', textAnchor: 'start' }}>{w} m</text>
        <line x1={gx} x2={gx + gw} y1={Y(0)} y2={Y(0)} className="pl-axis" />
        <line x1={gx} x2={gx} y1={gy} y2={Y(0)} className="pl-axis" />
        <path d={d} className="pl-line" fill="none" />
        <circle cx={X(w)} cy={Y(A)} r={6} className="pl-pt red" />
        <text x={gx + gw} y={Y(0) + 16} className="pl-num" style={{ textAnchor: 'end' }}>width w</text>
        <text x={gx + 4} y={gy + 4} className="pl-num">area</text>
      </svg>
      <div className="pb-row"><span className="el-step">Area</span><Tex>{`A(w) = w(${P / 2} - w) = -w^2 + ${P / 2}w \\qquad A(${w}) = ${A}\\text{ m}^2`}</Tex></div>
      <label className="el-slider"><span>width w (m)</span><input type="range" min={1} max={19} value={w} onChange={(e) => setW(Number(e.target.value))} /><output className="c-var">{w}</output></label>
      <p className={`vlt-count ${w === 10 ? 'ok' : 'bad'}`}>{w === 10 ? 'Maximum! The vertex is at w = −b/(2a) = −20/(−2) = 10: a 10 × 10 square, 100 m².' : 'Not the maximum yet — find the top of the parabola.'}</p>
    </div>
  );
}
