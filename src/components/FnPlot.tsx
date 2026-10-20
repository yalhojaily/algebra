/** A simple function plotter with its own x- and y-ranges (unlike Plane, which is square and centered). */
export interface FnPlotProps {
  fns: { f: (x: number) => number; cls?: string; lo?: number; hi?: number }[];
  x: [number, number];
  y: [number, number];
  points?: { x: number; y: number; cls?: string; label?: string }[];
  /** Dashed horizontal / vertical guide lines */
  hlines?: { y: number; cls?: string }[];
  vlines?: { x: number; cls?: string }[];
  width?: number;
  height?: number;
  xStep?: number;
  yStep?: number;
  xLabel?: string;
  yLabel?: string;
}

export function FnPlot({ fns, x: [x0, x1], y: [y0, y1], points = [], hlines = [], vlines = [], width = 420, height = 300, xStep = 1, yStep = 1, xLabel = 'x', yLabel = 'y' }: FnPlotProps) {
  const pl = 34, pr = 12, pt = 12, pb = 26;
  const X = (x: number) => pl + ((x - x0) / (x1 - x0)) * (width - pl - pr);
  const Y = (y: number) => pt + ((y1 - y) / (y1 - y0)) * (height - pt - pb);
  const ticks = (a: number, b: number, s: number) => {
    const out: number[] = [];
    for (let v = Math.ceil(a / s) * s; v <= b + 1e-9; v += s) out.push(+v.toFixed(6));
    return out;
  };
  const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
  const path = (f: (x: number) => number, lo = x0, hi = x1) => {
    let d = '';
    let pen = false;
    for (let i = 0; i <= 400; i++) {
      const x = lo + ((hi - lo) * i) / 400;
      const y = f(x);
      if (!Number.isFinite(y) || y > y1 + (y1 - y0) || y < y0 - (y1 - y0)) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(y).toFixed(1)} `;
      pen = true;
    }
    return d;
  };
  const id = `fp-${x0}-${x1}-${y0}-${y1}-${width}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="plane fnplot" role="img" aria-label="Graph">
      <defs><clipPath id={id}><rect x={pl} y={pt} width={width - pl - pr} height={height - pt - pb} /></clipPath></defs>
      {ticks(x0, x1, xStep).map((v) => <line key={`gx${v}`} x1={X(v)} x2={X(v)} y1={pt} y2={height - pb} className="pl-grid" />)}
      {ticks(y0, y1, yStep).map((v) => <line key={`gy${v}`} x1={pl} x2={width - pr} y1={Y(v)} y2={Y(v)} className="pl-grid" />)}
      <line x1={pl} x2={width - pr} y1={Y(ax)} y2={Y(ax)} className="pl-axis" />
      <line x1={X(ay)} x2={X(ay)} y1={pt} y2={height - pb} className="pl-axis" />
      {ticks(x0, x1, xStep).filter((v) => v !== 0).map((v) => <text key={`lx${v}`} x={X(v)} y={height - 8} className="pl-num" style={{ textAnchor: 'middle' }}>{v}</text>)}
      {ticks(y0, y1, yStep).filter((v) => v !== 0).map((v) => <text key={`ly${v}`} x={pl - 5} y={Y(v) + 4} className="pl-num" style={{ textAnchor: 'end' }}>{v}</text>)}
      <text x={width - pr} y={Y(ax) - 6} className="pl-axlab" style={{ textAnchor: 'end' }}>{xLabel}</text>
      <text x={X(ay) + 6} y={pt + 10} className="pl-axlab">{yLabel}</text>
      <g clipPath={`url(#${id})`}>
        {hlines.map((h, i) => <line key={`h${i}`} x1={pl} x2={width - pr} y1={Y(h.y)} y2={Y(h.y)} className={`pl-line faint ${h.cls ?? ''}`} />)}
        {vlines.map((v, i) => <line key={`v${i}`} x1={X(v.x)} x2={X(v.x)} y1={pt} y2={height - pb} className={`pl-line faint ${v.cls ?? ''}`} />)}
        {fns.map((fn, i) => <path key={i} d={path(fn.f, fn.lo, fn.hi)} className={`pl-line ${fn.cls ?? ''}`} fill="none" />)}
      </g>
      {points.filter((p) => p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1).map((p, i) => (
        <g key={`p${i}`}>
          <circle cx={X(p.x)} cy={Y(p.y)} r={5.5} className={`pl-pt ${p.cls ?? ''}`} />
          {p.label && <text x={X(p.x) + 8} y={Y(p.y) - 7} className="pl-ptlab">{p.label}</text>}
        </g>
      ))}
    </svg>
  );
}
