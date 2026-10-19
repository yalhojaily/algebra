import type { Figure } from '../generators/types';

interface Props extends Omit<Figure, 'kind'> {
  /** Override the visible range. */
  min?: number;
  max?: number;
  label?: string;
}

const fmt = (x: number) => String(+x.toFixed(4));

/** The graph of a simple inequality: a dot (open or closed) at the boundary and a shaded ray. */
export function RayFigure({ boundary, closed, dir, min, max, label }: Props) {
  const lo = min ?? Math.floor(boundary) - 6;
  const hi = max ?? Math.ceil(boundary) + 6;
  const W = 520;
  const PAD = 26;
  const Y = 40;
  const x = (v: number) => PAD + ((v - lo) / (hi - lo)) * (W - 2 * PAD);
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const bx = x(boundary);
  const end = dir === 'right' ? W - 6 : 6;
  const every = hi - lo > 14 ? 2 : 1;
  return (
    <svg viewBox={`0 0 ${W} 72`} className="ray" role="img" aria-label={label ?? `Graph: ${closed ? 'closed' : 'open'} circle at ${fmt(boundary)}, shaded to the ${dir}`}>
      <defs>
        <marker id={`ray-h-${dir}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" className="ray-headfill" />
        </marker>
      </defs>
      <line x1={6} x2={W - 6} y1={Y} y2={Y} className="ray-axis" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={Y - 5} y2={Y + 5} className="ray-tick" />
          {(t - lo) % every === 0 && <text x={x(t)} y={Y + 22} className="ray-num">{t}</text>}
        </g>
      ))}
      <line x1={bx} x2={end} y1={Y} y2={Y} className="ray-shade" markerEnd={`url(#ray-h-${dir})`} />
      <circle cx={bx} cy={Y} r={7} className={closed ? 'ray-dot closed' : 'ray-dot open'} />
      {!Number.isInteger(boundary) && <text x={bx} y={Y - 14} className="ray-num b">{fmt(boundary)}</text>}
    </svg>
  );
}
