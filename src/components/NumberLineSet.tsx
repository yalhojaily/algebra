/** A number line with shaded intervals: solid dots for included endpoints, open dots for excluded ones, arrows for ∞. */
export interface Part { lo: number; hi: number; loClosed: boolean; hiClosed: boolean }

export function NumberLineSet({ parts, points = [], min, max, width = 520, cls = '' }: { parts: Part[]; points?: number[]; min?: number; max?: number; width?: number; cls?: string }) {
  const finite = [...parts.flatMap((p) => [p.lo, p.hi]), ...points].filter(Number.isFinite);
  const lo = min ?? Math.min(-5, ...finite.map((v) => Math.floor(v) - 2));
  const hi = max ?? Math.max(5, ...finite.map((v) => Math.ceil(v) + 2));
  const pad = 22, H = 64, y = 30;
  const X = (v: number) => pad + ((Math.max(lo - 0.6, Math.min(hi + 0.6, v)) - lo) / (hi - lo)) * (width - 2 * pad);
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const every = hi - lo > 24 ? 5 : hi - lo > 12 ? 2 : 1;
  return (
    <svg viewBox={`0 0 ${width} ${H}`} className={`nl-set ${cls}`} role="img" aria-label="Number line">
      <line x1={pad - 14} x2={width - pad + 14} y1={y} y2={y} className="nl-axis" />
      <path d={`M ${pad - 14} ${y} l 8 -5 v 10 z M ${width - pad + 14} ${y} l -8 -5 v 10 z`} className="nl-arrowhead" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={X(t)} x2={X(t)} y1={y - 5} y2={y + 5} className="nl-tick" />
          {t % every === 0 && <text x={X(t)} y={y + 22} className="nl-lab">{t}</text>}
        </g>
      ))}
      {parts.map((p, i) => {
        const a = Number.isFinite(p.lo) ? X(p.lo) : pad - 14, b = Number.isFinite(p.hi) ? X(p.hi) : width - pad + 14;
        return (
          <g key={i}>
            <line x1={a} x2={b} y1={y} y2={y} className="nl-shade" />
            {!Number.isFinite(p.lo) && <path d={`M ${a - 4} ${y} l 12 -8 v 16 z`} className="nl-shade-head" />}
            {!Number.isFinite(p.hi) && <path d={`M ${b + 4} ${y} l -12 -8 v 16 z`} className="nl-shade-head" />}
            {Number.isFinite(p.lo) && <circle cx={a} cy={y} r={6.5} className={`nl-dot ${p.loClosed ? 'closed' : 'open'}`} />}
            {Number.isFinite(p.hi) && p.hi !== p.lo && <circle cx={b} cy={y} r={6.5} className={`nl-dot ${p.hiClosed ? 'closed' : 'open'}`} />}
          </g>
        );
      })}
      {points.map((v, i) => <circle key={`p${i}`} cx={X(v)} cy={y} r={6.5} className="nl-dot closed" />)}
    </svg>
  );
}
