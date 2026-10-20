import { useState } from 'react';
import { Tex } from './MathText';

/** h(t) = −16t² + v t + h₀: the vertex gives the highest point; the positive zero gives the landing time. */
export default function ProjectileLab() {
  const [v, setV] = useState(64);
  const [h0, setH0] = useState(0);
  const tTop = v / 32, hTop = -16 * tTop * tTop + v * tTop + h0;
  const land = (v + Math.sqrt(v * v + 64 * h0)) / 32;
  const W = 520, H = 300, pl = 44, pb = 30, pt = 14, pr = 14;
  const tMax = Math.max(9, Math.ceil(land)), hMax = Math.max(100, Math.ceil(hTop / 50) * 50 + 20);
  const X = (t: number) => pl + (t / tMax) * (W - pl - pr);
  const Y = (h: number) => H - pb - (h / hMax) * (H - pb - pt);
  let d = '';
  for (let i = 0; i <= 200; i++) {
    const t = (land * i) / 200;
    d += `${i ? 'L' : 'M'} ${X(t).toFixed(1)} ${Y(-16 * t * t + v * t + h0).toFixed(1)} `;
  }
  const fmt = (n: number) => String(+n.toFixed(2));
  return (
    <div className="pj card">
      <div className="lb-eq"><Tex>{`h(t) = -16t^2 + ${v}t${h0 ? ` + ${h0}` : ''}`}</Tex></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="am-svg" role="img" aria-label="Height of a ball over time">
        <line x1={pl} x2={W - pr} y1={Y(0)} y2={Y(0)} className="pl-axis" />
        <line x1={pl} x2={pl} y1={pt} y2={Y(0)} className="pl-axis" />
        {Array.from({ length: tMax + 1 }, (_, t) => <text key={t} x={X(t)} y={H - 10} className="pl-num" style={{ textAnchor: 'middle' }}>{t}</text>)}
        {Array.from({ length: hMax / 50 + 1 }, (_, k) => <text key={k} x={pl - 6} y={Y(k * 50) + 4} className="pl-num" style={{ textAnchor: 'end' }}>{k * 50}</text>)}
        <path d={d} className="pl-line" fill="none" />
        <line x1={X(tTop)} x2={X(tTop)} y1={Y(0)} y2={Y(hTop)} className="pl-line faint" />
        <circle cx={X(tTop)} cy={Y(hTop)} r={6} className="pl-pt red" />
        <text x={X(tTop) + 8} y={Y(hTop) - 8} className="pl-ptlab">max {fmt(hTop)} ft at t = {fmt(tTop)}</text>
        <circle cx={X(land)} cy={Y(0)} r={6} className="pl-pt amber" />
        <text x={X(land) - 6} y={Y(0) - 10} className="pl-ptlab" style={{ textAnchor: 'end' }}>lands at t ≈ {fmt(land)}</text>
        <text x={W - pr} y={H - 10} className="pl-axlab" style={{ textAnchor: 'end' }}>t (s)</text>
      </svg>
      <div className="pb-row"><span className="el-step">Highest point</span><Tex>{`t = -\\dfrac{b}{2a} = -\\dfrac{${v}}{2(-16)} = ${fmt(tTop)},\\quad h(${fmt(tTop)}) = ${fmt(hTop)}`}</Tex></div>
      <div className="pb-row"><span className="el-step">Lands</span><Tex>{`h(t) = 0 \\Rightarrow t = \\dfrac{-${v} - \\sqrt{${v}^2 - 4(-16)(${h0})}}{2(-16)} \\approx ${fmt(land)}`}</Tex></div>
      <div className="am-controls">
        <label className="el-slider"><span>initial speed v (ft/s)</span><input type="range" min={16} max={128} step={8} value={v} onChange={(e) => setV(Number(e.target.value))} /><output className="c-var">{v}</output></label>
        <label className="el-slider"><span>starting height h₀ (ft)</span><input type="range" min={0} max={100} step={4} value={h0} onChange={(e) => setH0(Number(e.target.value))} /><output className="c-op">{h0}</output></label>
      </div>
    </div>
  );
}
