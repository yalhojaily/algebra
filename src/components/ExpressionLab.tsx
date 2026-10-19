import { useState } from 'react';
import { Tex } from './MathText';

// Each model: an expression, its variables with slider ranges, and how to substitute and compute it.
interface VarSpec { name: string; min: number; max: number; start: number; label: string }
interface Model {
  id: string;
  title: string;
  tex: string;
  vars: VarSpec[];
  sub: (v: Record<string, number>) => string;
  value: (v: Record<string, number>) => number;
  unit?: string;
  picture?: 'rectangle' | 'triangle' | 'trip';
}

const V = (s: string) => `\\htmlClass{c-var}{${s}}`;
const N = (n: number) => `\\htmlClass{c-num}{${n}}`;

const models: Model[] = [
  {
    id: 'rect', title: 'Area of a rectangle', tex: `A = ${V('l')}${V('w')}`, picture: 'rectangle', unit: 'square units',
    vars: [{ name: 'l', min: 1, max: 12, start: 6, label: 'length' }, { name: 'w', min: 1, max: 8, start: 4, label: 'width' }],
    sub: (v) => `A = ${N(v.l)} \\cdot ${N(v.w)}`, value: (v) => v.l * v.w,
  },
  {
    id: 'tri', title: 'Area of a triangle', tex: `A = \\tfrac{1}{2}${V('b')}${V('h')}`, picture: 'triangle', unit: 'square units',
    vars: [{ name: 'b', min: 1, max: 12, start: 8, label: 'base' }, { name: 'h', min: 1, max: 8, start: 5, label: 'height' }],
    sub: (v) => `A = \\tfrac{1}{2} \\cdot ${N(v.b)} \\cdot ${N(v.h)}`, value: (v) => (v.b * v.h) / 2,
  },
  {
    id: 'trip', title: 'Distance = rate × time', tex: `d = ${V('r')}${V('t')}`, picture: 'trip', unit: 'km',
    vars: [{ name: 'r', min: 10, max: 120, start: 60, label: 'rate (km/h)' }, { name: 't', min: 1, max: 8, start: 3, label: 'time (hours)' }],
    sub: (v) => `d = ${N(v.r)} \\cdot ${N(v.t)}`, value: (v) => v.r * v.t,
  },
  {
    id: 'lin', title: 'A phone plan', tex: `C = 5${V('g')} + 30`, unit: 'riyals',
    vars: [{ name: 'g', min: 0, max: 20, start: 4, label: 'gigabytes used' }],
    sub: (v) => `C = 5 \\cdot ${N(v.g)} + 30`, value: (v) => 5 * v.g + 30,
  },
  {
    id: 'quo', title: 'Sharing a bill', tex: `\\dfrac{${V('T')}}{${V('p')}}`, unit: 'riyals each',
    vars: [{ name: 'T', min: 20, max: 300, start: 120, label: 'total bill' }, { name: 'p', min: 1, max: 10, start: 4, label: 'people' }],
    sub: (v) => `\\dfrac{${N(v.T)}}{${N(v.p)}}`, value: (v) => v.T / v.p,
  },
];

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, ''));

function Picture({ m, v }: { m: Model; v: Record<string, number> }) {
  if (m.picture === 'rectangle') {
    const s = 18;
    return (
      <svg viewBox={`0 0 ${12 * s + 40} ${8 * s + 40}`} className="el-pic" role="img" aria-label={`A ${v.l} by ${v.w} rectangle made of ${v.l * v.w} unit squares`}>
        {Array.from({ length: v.w }).map((_, r) =>
          Array.from({ length: v.l }).map((_, c) => (
            <rect key={`${r}-${c}`} x={20 + c * s} y={10 + r * s} width={s - 2} height={s - 2} rx={3} className="el-cell" />
          )),
        )}
        <text x={20 + (v.l * s) / 2} y={10 + v.w * s + 18} className="el-dim">l = {v.l}</text>
        <text x={8} y={10 + (v.w * s) / 2} className="el-dim" transform={`rotate(-90 8 ${10 + (v.w * s) / 2})`}>w = {v.w}</text>
      </svg>
    );
  }
  if (m.picture === 'triangle') {
    const s = 18;
    const x0 = 20, y0 = 10 + 8 * s;
    const pts = `${x0},${y0} ${x0 + v.b * s},${y0} ${x0 + (v.b * s) / 2},${y0 - v.h * s}`;
    return (
      <svg viewBox={`0 0 ${12 * s + 40} ${8 * s + 40}`} className="el-pic" role="img" aria-label={`Triangle with base ${v.b} and height ${v.h}`}>
        <rect x={x0} y={y0 - v.h * s} width={v.b * s} height={v.h * s} className="el-ghost" />
        <polygon points={pts} className="el-tri" />
        <line x1={x0 + (v.b * s) / 2} y1={y0} x2={x0 + (v.b * s) / 2} y2={y0 - v.h * s} className="el-height" />
        <text x={x0 + (v.b * s) / 2} y={y0 + 18} className="el-dim">b = {v.b}</text>
        <text x={x0 + (v.b * s) / 2 + 8} y={y0 - (v.h * s) / 2} className="el-dim" style={{ textAnchor: 'start' }}>h = {v.h}</text>
      </svg>
    );
  }
  if (m.picture === 'trip') {
    const w = 260;
    return (
      <svg viewBox={`0 0 ${w + 40} 90`} className="el-pic" role="img" aria-label={`${v.t} hours at ${v.r} km per hour`}>
        {Array.from({ length: v.t }).map((_, i) => {
          const seg = (w * v.r) / 120 / 8;
          return (
            <g key={i}>
              <rect x={20 + i * seg} y={35} width={seg - 3} height={16} rx={4} className="el-cell" />
              <text x={20 + i * seg + seg / 2} y={28} className="el-small">{v.r}</text>
            </g>
          );
        })}
        <text x={20} y={75} className="el-dim" style={{ textAnchor: 'start' }}>{v.t} blocks of {v.r} km</text>
      </svg>
    );
  }
  return null;
}

export default function ExpressionLab() {
  const [mi, setMi] = useState(0);
  const m = models[mi];
  const [vals, setVals] = useState<Record<string, Record<string, number>>>(() =>
    Object.fromEntries(models.map((mm) => [mm.id, Object.fromEntries(mm.vars.map((x) => [x.name, x.start]))])),
  );
  const v = vals[m.id];
  const set = (name: string, n: number) => setVals((all) => ({ ...all, [m.id]: { ...all[m.id], [name]: n } }));

  return (
    <div className="el card">
      <div className="el-tabs" role="tablist">
        {models.map((mm, i) => (
          <button key={mm.id} role="tab" aria-selected={i === mi} className={`pr-tab ${i === mi ? 'on' : ''}`} onClick={() => setMi(i)}>{mm.title}</button>
        ))}
      </div>
      <div className="el-body">
        <div className="el-controls">
          {m.vars.map((x) => (
            <label key={x.name} className="el-slider">
              <span><Tex>{V(x.name)}</Tex> <span className="el-slabel">{x.label}</span></span>
              <input type="range" min={x.min} max={x.max} value={v[x.name]} onChange={(e) => set(x.name, Number(e.target.value))} />
              <output className="c-num">{v[x.name]}</output>
            </label>
          ))}
          <Picture m={m} v={v} />
        </div>
        <div className="el-flow">
          <div className="el-row"><span className="el-step">Expression</span><Tex>{m.tex}</Tex></div>
          <div className="el-arrow">↓ <span>replace each letter with its value</span></div>
          <div className="el-row"><span className="el-step">Substitute</span><Tex>{m.sub(v)}</Tex></div>
          <div className="el-arrow">↓ <span>calculate</span></div>
          <div className="el-row el-result"><span className="el-step">Value</span><Tex>{`${fmt(m.value(v))}`}</Tex>{m.unit && <span className="el-unit">{m.unit}</span>}</div>
        </div>
      </div>
    </div>
  );
}
