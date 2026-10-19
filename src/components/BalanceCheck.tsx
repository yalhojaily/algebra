import { useState } from 'react';
import { Tex } from './MathText';

interface Eq {
  tex: string;
  left: (x: number) => number;
  leftSub: (x: number) => string;
  right: number;
  min: number;
  max: number;
  start: number;
}

const eqs: Eq[] = [
  { tex: 'x + 5 = 12', left: (x) => x + 5, leftSub: (x) => `${x} + 5`, right: 12, min: 0, max: 15, start: 3 },
  { tex: '3x = 18', left: (x) => 3 * x, leftSub: (x) => `3 \\cdot ${x}`, right: 18, min: 0, max: 12, start: 2 },
  { tex: '20 - x = 13', left: (x) => 20 - x, leftSub: (x) => `20 - ${x}`, right: 13, min: 0, max: 20, start: 10 },
  { tex: '\\dfrac{x}{4} = 3', left: (x) => x / 4, leftSub: (x) => `\\dfrac{${x}}{4}`, right: 3, min: 0, max: 20, start: 8 },
];

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

/** An equation is a balance: a value is a solution exactly when both sides weigh the same. */
export default function BalanceCheck() {
  const [ei, setEi] = useState(0);
  const e = eqs[ei];
  const [x, setX] = useState(e.start);
  const L = e.left(x);
  const R = e.right;
  const diff = L - R;
  const angle = Math.max(-14, Math.min(14, diff * 2.2)); // left heavier → left side goes down
  const balanced = Math.abs(diff) < 1e-9;

  return (
    <div className="bc card">
      <div className="el-tabs" role="tablist">
        {eqs.map((q, i) => (
          <button key={q.tex} role="tab" aria-selected={i === ei} className={`pr-tab ${i === ei ? 'on' : ''}`} onClick={() => { setEi(i); setX(q.start); }}>
            <Tex>{q.tex}</Tex>
          </button>
        ))}
      </div>

      <svg viewBox="0 0 420 210" className="bc-svg" role="img" aria-label={balanced ? 'The scale is balanced' : 'The scale is tipped'}>
        <polygon points="210,120 190,190 230,190" className="bc-stand" />
        <rect x="150" y="188" width="120" height="8" rx="4" className="bc-stand" />
        <g transform={`rotate(${-angle} 210 120)`} style={{ transition: 'transform 0.35s cubic-bezier(.3,1.4,.5,1)' }}>
          <rect x="40" y="114" width="340" height="12" rx="6" className="bc-beam" />
          <g transform={`rotate(${angle} 80 120)`} style={{ transition: 'transform 0.35s' }}>
            <line x1="80" y1="120" x2="80" y2="60" className="bc-string" />
            <rect x="20" y="30" width="120" height="44" rx="12" className="bc-pan left" />
            <text x="80" y="58" className="bc-val">{fmt(L)}</text>
            <text x="80" y="20" className="bc-side">left side</text>
          </g>
          <g transform={`rotate(${angle} 340 120)`} style={{ transition: 'transform 0.35s' }}>
            <line x1="340" y1="120" x2="340" y2="60" className="bc-string" />
            <rect x="280" y="30" width="120" height="44" rx="12" className="bc-pan right" />
            <text x="340" y="58" className="bc-val">{fmt(R)}</text>
            <text x="340" y="20" className="bc-side">right side</text>
          </g>
        </g>
        <circle cx="210" cy="120" r="7" className="bc-pivot" />
      </svg>

      <div className="bc-readout">
        <label className="el-slider">
          <span>Try <Tex>{`x =`}</Tex></span>
          <input type="range" min={e.min} max={e.max} value={x} onChange={(ev) => setX(Number(ev.target.value))} />
          <output className="c-var">{x}</output>
        </label>
        <div className="bc-sub">
          <Tex>{`${e.leftSub(x)} \\;${balanced ? '=' : '\\ne'}\\; ${R}`}</Tex>
        </div>
        <div className={`bc-verdict ${balanced ? 'yes' : 'no'}`} aria-live="polite">
          {balanced ? (
            <>✓ Balanced — <Tex>{`${x}`}</Tex> is a <strong>solution</strong>. The equation is true.</>
          ) : (
            <>✗ Not balanced — <Tex>{`${x}`}</Tex> is not a solution. The {diff > 0 ? 'left' : 'right'} side is heavier.</>
          )}
        </div>
      </div>
    </div>
  );
}
