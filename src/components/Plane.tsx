import type { ReactNode } from 'react';

export interface PlaneProps {
  /** Show x and y from −range to range. */
  range?: number;
  /** Optional separate y range. */
  yRange?: number;
  points?: { x: number; y: number; label?: string; cls?: string }[];
  lines?: { a: number; b: number; c: number; cls?: string }[];
  /** y = polynomial (coefficients highest first) */
  curves?: { coefs: number[]; cls?: string }[];
  /** Pixel size of the square drawing (viewBox units). */
  size?: number;
  onPick?: (x: number, y: number) => void;
  children?: (map: PlaneMap) => ReactNode;
  label?: string;
  /** Label every `every` grid lines. */
  every?: number;
}

export interface PlaneMap {
  X: (x: number) => number;
  Y: (y: number) => number;
  size: number;
  r: number;
  ry: number;
}

/** A coordinate plane with grid, axes, points, lines and curves. Click handling snaps to integer points. */
export function Plane({ range = 10, yRange, points = [], lines = [], curves = [], size = 420, onPick, children, label, every }: PlaneProps) {
  const r = range;
  const ry = yRange ?? range;
  const pad = 24;
  const inner = size - 2 * pad;
  const X = (x: number) => pad + ((x + r) / (2 * r)) * inner;
  const Y = (y: number) => pad + ((ry - y) / (2 * ry)) * inner;
  const step = every ?? (r > 12 ? 5 : r > 6 ? 2 : 1);
  const xs = Array.from({ length: 2 * r + 1 }, (_, i) => i - r);
  const ys = Array.from({ length: 2 * ry + 1 }, (_, i) => i - ry);

  const segment = (a: number, b: number, c: number) => {
    // a x + b y = c, clipped to the window
    const big = Math.max(r, ry) * 3;
    if (Math.abs(b) < 1e-12) {
      const x = c / a;
      return [x, -big, x, big];
    }
    const y = (x: number) => (c - a * x) / b;
    return [-big, y(-big), big, y(big)];
  };

  const curvePath = (coefs: number[]) => {
    const f = (x: number) => coefs.reduce((s, c) => s * x + c, 0);
    const pts: string[] = [];
    for (let i = 0; i <= 240; i++) {
      const x = -r + (2 * r * i) / 240;
      const y = f(x);
      if (Math.abs(y) > ry * 4) continue;
      pts.push(`${pts.length ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(y).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const click = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const x = Math.round(((loc.x - pad) / inner) * 2 * r - r);
    const y = Math.round(ry - ((loc.y - pad) / inner) * 2 * ry);
    if (Math.abs(x) <= r && Math.abs(y) <= ry) onPick(x, y);
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={`plane ${onPick ? 'pickable' : ''}`} onClick={click} role="img" aria-label={label ?? 'Coordinate plane'}>
      <defs>
        <clipPath id={`plane-clip-${size}-${r}-${ry}`}>
          <rect x={pad} y={pad} width={inner} height={inner} />
        </clipPath>
      </defs>
      {xs.map((x) => <line key={`gx${x}`} x1={X(x)} x2={X(x)} y1={pad} y2={size - pad} className="pl-grid" />)}
      {ys.map((y) => <line key={`gy${y}`} x1={pad} x2={size - pad} y1={Y(y)} y2={Y(y)} className="pl-grid" />)}
      <line x1={pad - 6} x2={size - pad + 6} y1={Y(0)} y2={Y(0)} className="pl-axis" />
      <line x1={X(0)} x2={X(0)} y1={pad - 6} y2={size - pad + 6} className="pl-axis" />
      <text x={size - pad + 2} y={Y(0) - 8} className="pl-axlab">x</text>
      <text x={X(0) + 8} y={pad - 4} className="pl-axlab">y</text>
      {xs.filter((x) => x !== 0 && x % step === 0).map((x) => <text key={`lx${x}`} x={X(x)} y={Y(0) + 15} className="pl-num">{x}</text>)}
      {ys.filter((y) => y !== 0 && y % step === 0).map((y) => <text key={`ly${y}`} x={X(0) - 6} y={Y(y) + 4} className="pl-num" style={{ textAnchor: 'end' }}>{y}</text>)}
      <g clipPath={`url(#plane-clip-${size}-${r}-${ry})`}>
        {lines.map((l, i) => {
          const [x1, y1, x2, y2] = segment(l.a, l.b, l.c);
          return <line key={`l${i}`} x1={X(x1)} y1={Y(y1)} x2={X(x2)} y2={Y(y2)} className={`pl-line ${l.cls ?? ''}`} />;
        })}
        {curves.map((c, i) => <path key={`c${i}`} d={curvePath(c.coefs)} className={`pl-line ${c.cls ?? ''}`} fill="none" />)}
        {children?.({ X, Y, size, r, ry })}
      </g>
      {points.map((p, i) => (
        <g key={`p${i}`}>
          <circle cx={X(p.x)} cy={Y(p.y)} r={6} className={`pl-pt ${p.cls ?? ''}`} />
          {p.label && <text x={X(p.x) + 9} y={Y(p.y) - 8} className="pl-ptlab">{p.label}</text>}
        </g>
      ))}
    </svg>
  );
}
