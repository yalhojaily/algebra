import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

interface Graph {
  name: string;
  f: (x: number) => number;
  lo: number;
  hi: number;
  loC: boolean;
  hiC: boolean;
  /** Ends that run off forever (arrows), rather than stopping at a dot. */
  inf?: boolean;
}

const graphs: Graph[] = [
  { name: 'Segment', f: (x) => 0.5 * x + 1, lo: -4, hi: 6, loC: true, hiC: false },
  { name: 'Curve with endpoints', f: (x) => -0.25 * (x - 1) ** 2 + 5, lo: -5, hi: 4, loC: false, hiC: true },
  { name: 'Parabola', f: (x) => 0.5 * (x - 1) ** 2 - 3, lo: -Infinity, hi: Infinity, loC: false, hiC: false, inf: true },
  { name: 'Square root', f: (x) => 2 * Math.sqrt(x + 3) - 2, lo: -3, hi: Infinity, loC: true, hiC: false, inf: true },
];

const fmt = (n: number) => (n === Infinity ? '\\infty' : n === -Infinity ? '-\\infty' : Number.isInteger(n) ? String(n) : String(+n.toFixed(2)));
const iv = (lo: number, hi: number, lc: boolean, hc: boolean) => `${lc && Number.isFinite(lo) ? '[' : '('}${fmt(lo)}, ${fmt(hi)}${hc && Number.isFinite(hi) ? ']' : ')'}`;

/** The domain is the shadow of the graph on the x-axis; the range is its shadow on the y-axis. */
export default function DomainRange() {
  const [gi, setGi] = useState(0);
  const [show, setShow] = useState<'domain' | 'range' | 'both'>('both');
  const g = graphs[gi];
  const W = 9;
  const lo = Math.max(g.lo, -W), hi = Math.min(g.hi, W);
  // sample to find the range (and which ends of it are included)
  const xs = Array.from({ length: 401 }, (_, i) => lo + ((hi - lo) * i) / 400);
  const ys = xs.map(g.f);
  let ymin = Math.min(...ys), ymax = Math.max(...ys);
  const at = (x: number) => +g.f(x).toFixed(6);
  // A y-value is included if it is attained at an interior point or at a closed endpoint.
  const incl = (y: number) => {
    const interior = xs.slice(1, -1).some((x) => Math.abs(g.f(x) - y) < 1e-3);
    return interior || (g.loC && Number.isFinite(g.lo) && Math.abs(at(g.lo) - y) < 1e-6) || (g.hiC && Number.isFinite(g.hi) && Math.abs(at(g.hi) - y) < 1e-6);
  };
  let yminC = incl(ymin), ymaxC = incl(ymax);
  if (g.inf) {
    // unbounded directions
    if (g.name === 'Parabola') { ymax = Infinity; ymaxC = false; }
    if (g.name === 'Square root') { ymax = Infinity; ymaxC = false; }
  }
  ymin = +ymin.toFixed(4); ymax = ymax === Infinity ? Infinity : +ymax.toFixed(4);
  const domain = iv(g.lo, g.hi, g.loC, g.hiC);
  const range = iv(ymin, ymax, yminC, ymaxC);
  const dots = [
    ...(Number.isFinite(g.lo) ? [{ x: g.lo, y: at(g.lo), cls: g.loC ? '' : 'open' }] : []),
    ...(Number.isFinite(g.hi) ? [{ x: g.hi, y: at(g.hi), cls: g.hiC ? '' : 'open' }] : []),
  ];
  return (
    <div className="dr card">
      <div className="pr-tabs">{graphs.map((gr, i) => <button key={gr.name} className={`pr-tab ${i === gi ? 'on' : ''}`} onClick={() => setGi(i)}>{gr.name}</button>)}</div>
      <div className="px-body">
        <Plane range={W} size={370} points={dots}>
          {({ X, Y }) => {
            let d = '';
            xs.forEach((x, i) => { const y = ys[i]; if (Math.abs(y) <= W + 1) d += `${d ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(y).toFixed(1)} `; });
            const yTop = Math.min(ymax, W), yBot = Math.max(ymin, -W);
            return (
              <g>
                {show !== 'range' && <line x1={X(lo)} x2={X(hi)} y1={Y(0)} y2={Y(0)} className="dr-band dom" />}
                {show !== 'domain' && <line x1={X(0)} x2={X(0)} y1={Y(yBot)} y2={Y(yTop)} className="dr-band ran" />}
                <path d={d} className="pl-line" fill="none" />
              </g>
            );
          }}
        </Plane>
        <div className="px-side">
          <div className="pr-tabs">
            {(['domain', 'range', 'both'] as const).map((k) => <button key={k} className={`pr-tab ${show === k ? 'on' : ''}`} onClick={() => setShow(k)}>{k === 'both' ? 'Both' : k[0].toUpperCase() + k.slice(1)}</button>)}
          </div>
          <div className="pb-row"><span className="el-step dr-dom">Domain</span><Tex>{domain}</Tex></div>
          <div className="pb-row"><span className="el-step dr-ran">Range</span><Tex>{range}</Tex></div>
          <p className="lb-note">
            Squash the graph straight down onto the x-axis: the shadow (blue) is the <strong>domain</strong>. Squash it sideways onto the y-axis: that shadow (red) is the <strong>range</strong>.
            A solid dot is included — use a bracket. An open dot is not — use a parenthesis. {g.inf && 'An arrow means the graph keeps going, so that end is ∞ or −∞.'}
          </p>
        </div>
      </div>
    </div>
  );
}
