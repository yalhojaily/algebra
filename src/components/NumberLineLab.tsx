import { useRef, useState } from 'react';
import { Tex } from './MathText';

const MIN = -10;
const MAX = 10;
const W = 640;
const PAD = 30;
const Y = 90;
const toX = (v: number) => PAD + ((v - MIN) / (MAX - MIN)) * (W - 2 * PAD);
const toV = (x: number) => Math.round((MIN + ((x - PAD) / (W - 2 * PAD)) * (MAX - MIN)) * 2) / 2; // snap to 0.5
const clamp = (v: number) => Math.max(MIN, Math.min(MAX, v));
const fmt = (v: number) => (v < 0 ? `-${Math.abs(v)}` : `${v}`);

type Key = 'a' | 'b';

/** Drag two points on a number line: see which is greater, and their distances from 0 (absolute value). */
export default function NumberLineLab() {
  const [v, setV] = useState<Record<Key, number>>({ a: -6, b: -2 });
  const [showAbs, setShowAbs] = useState(true);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<Key | null>(null);

  const move = (clientX: number) => {
    if (!drag.current || !svg.current) return;
    const r = svg.current.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * W;
    const key = drag.current;
    setV((s) => ({ ...s, [key]: clamp(toV(x)) }));
  };

  const nudge = (k: Key, d: number) => setV((s) => ({ ...s, [k]: clamp(s[k] + d) }));

  const rel = v.a < v.b ? '<' : v.a > v.b ? '>' : '=';
  const ticks = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);

  // Plain render functions (not components) so dragging doesn't remount the point.
  const point = (k: Key, cls: string, label: string) => (
    <g
      key={k}
      className={`nl-pt ${cls}`}
      role="slider"
      tabIndex={0}
      aria-label={`Point ${label}`}
      aria-valuemin={MIN}
      aria-valuemax={MAX}
      aria-valuenow={v[k]}
      onPointerDown={(e) => {
        drag.current = k;
        svg.current?.setPointerCapture?.(e.pointerId);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); nudge(k, -0.5); }
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); nudge(k, 0.5); }
      }}
      style={{ transform: `translateX(${toX(v[k])}px)` }}
    >
      <circle cy={Y} r={11} />
      <text y={Y - 22} className="nl-plabel">{label} = {fmt(v[k])}</text>
    </g>
  );

  const absArc = (k: Key, cls: string, lift: number) => {
    const x0 = toX(0), x1 = toX(v[k]);
    if (v[k] === 0) return null;
    const mid = (x0 + x1) / 2;
    return (
      <g key={`abs-${k}`} className={`nl-abs ${cls}`}>
        <path d={`M ${x0} ${Y + 40} Q ${mid} ${Y + 40 + lift} ${x1} ${Y + 40}`} fill="none" />
        <line x1={x0} x2={x0} y1={Y + 12} y2={Y + 40} className="nl-drop" />
        <line x1={x1} x2={x1} y1={Y + 12} y2={Y + 40} className="nl-drop" />
        <text x={mid} y={Y + 40 + lift / 2 + 14} className="nl-abslabel">|{k}| = {Math.abs(v[k])}</text>
      </g>
    );
  };

  return (
    <div className="nl card">
      <svg
        ref={svg}
        viewBox={`0 0 ${W} 250`}
        className="nl-svg"
        onPointerMove={(e) => move(e.clientX)}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <rect x={toX(Math.min(v.a, v.b))} y={Y - 4} width={Math.abs(toX(v.a) - toX(v.b))} height={8} className="nl-gap" />
        <line x1={PAD - 14} x2={W - PAD + 14} y1={Y} y2={Y} className="nl-axis" markerEnd="url(#nl-arrow)" markerStart="url(#nl-arrow-l)" />
        <defs>
          <marker id="nl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" className="nl-head" /></marker>
          <marker id="nl-arrow-l" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 z" className="nl-head" /></marker>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={toX(t)} x2={toX(t)} y1={Y - (t === 0 ? 9 : 5)} y2={Y + (t === 0 ? 9 : 5)} className={t === 0 ? 'nl-zero' : 'nl-tick'} />
            {t % 2 === 0 && <text x={toX(t)} y={Y + 30} className={`nl-num ${t === 0 ? 'z' : ''}`}>{t}</text>}
          </g>
        ))}
        <text x={PAD} y={Y + 125} className="nl-dir" style={{ textAnchor: 'start' }}>← smaller</text>
        <text x={W - PAD} y={Y + 125} className="nl-dir" style={{ textAnchor: 'end' }}>greater →</text>
        {showAbs && absArc('a', 'a', 36)}
        {showAbs && absArc('b', 'b', 52)}
        {point('a', 'a', 'a')}
        {point('b', 'b', 'b')}
      </svg>

      <div className="nl-readout">
        <div className="nl-rel">
          <Tex>{`\\htmlClass{c-var}{${fmt(v.a)}} \\;${rel === '=' ? '=' : rel}\\; \\htmlClass{c-eq}{${fmt(v.b)}}`}</Tex>
          {rel !== '=' && (
            <span className="nl-also">
              also written <Tex>{`${fmt(v.b)} ${rel === '<' ? '>' : '<'} ${fmt(v.a)}`}</Tex>
            </span>
          )}
        </div>
        <div className="nl-why">
          {rel === '=' ? 'The points are at the same place.' : `${rel === '<' ? 'a' : 'b'} is farther left, so it is the smaller number.`}
          {v.a < 0 && v.b < 0 && rel !== '=' && ' Both are negative: the one closer to 0 is greater, even though its absolute value is smaller.'}
        </div>
        <label className="nl-toggle">
          <input type="checkbox" checked={showAbs} onChange={(e) => setShowAbs(e.target.checked)} /> Show distance from 0 (absolute value)
        </label>
        <div className="nl-tip">Drag the points, or click one and use the arrow keys.</div>
      </div>
    </div>
  );
}
