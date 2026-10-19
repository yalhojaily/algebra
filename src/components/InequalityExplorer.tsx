import { useState } from 'react';
import { holds, REL_TEX, type Rel } from '../lib/inequality';
import { Tex } from './MathText';

const RELS: Rel[] = ['<', '<=', '>', '>='];
const WORDS: Record<Rel, string> = { '<': 'less than', '<=': 'less than or equal to', '>': 'greater than', '>=': 'greater than or equal to' };

/** Build an inequality, see its graph and set-builder notation, and test values against it. */
export default function InequalityExplorer() {
  const [op, setOp] = useState<Rel>('>=');
  const [b, setB] = useState(-2);
  const [t, setT] = useState(1);
  const lo = -10, hi = 10, W = 620, PAD = 24, Y = 50;
  const x = (v: number) => PAD + ((v - lo) / (hi - lo)) * (W - 2 * PAD);
  const right = op === '>' || op === '>=';
  const closed = op.length === 2;
  const ok = holds(op, t, b);

  return (
    <div className="ie card">
      <div className="ie-build">
        <Tex>x</Tex>
        <div className="wb-ops" role="group" aria-label="Inequality sign">
          {RELS.map((r) => (
            <button key={r} className={`wb-op ${r === op ? 'on' : ''}`} onClick={() => setOp(r)} aria-pressed={r === op}><Tex>{REL_TEX[r]}</Tex></button>
          ))}
        </div>
        <output className="ie-b">{b}</output>
        <input type="range" min={-8} max={8} value={b} onChange={(e) => setB(Number(e.target.value))} aria-label="Boundary" />
      </div>

      <svg viewBox={`0 0 ${W} 100`} className="ie-svg" role="img" aria-label={`Graph of x ${op} ${b}`}>
        <line x1={6} x2={W - 6} y1={Y} y2={Y} className="ray-axis" />
        {Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={Y - 5} y2={Y + 5} className="ray-tick" />
            <text x={x(v)} y={Y + 22} className="ray-num">{v}</text>
          </g>
        ))}
        <line x1={x(b)} x2={right ? W - 8 : 8} y1={Y} y2={Y} className="ray-shade" />
        <circle cx={x(b)} cy={Y} r={8} className={`ray-dot ${closed ? 'closed' : 'open'}`} />
        <g style={{ transform: `translateX(${x(t)}px)`, transition: 'transform .2s' }}>
          <path d={`M 0 ${Y - 12} l -7 -12 h 14 z`} className={ok ? 'ie-pin ok' : 'ie-pin no'} />
        </g>
      </svg>

      <div className="ie-read">
        <div><span className="el-step">Inequality</span><Tex>{`x ${REL_TEX[op]} ${b}`}</Tex></div>
        <div><span className="el-step">In words</span>all numbers {WORDS[op]} {b}</div>
        <div><span className="el-step">Set-builder</span><Tex>{`\\{x \\mid x ${REL_TEX[op]} ${b}\\}`}</Tex></div>
        <div><span className="el-step">Graph</span>{closed ? 'closed dot' : 'open dot'} at {b} — {closed ? `${b} is included` : `${b} is not included`}; shaded to the {right ? 'right' : 'left'}</div>
      </div>

      <label className="el-slider ie-test">
        <span>test a value ▼</span>
        <input type="range" min={-10} max={10} value={t} onChange={(e) => setT(Number(e.target.value))} />
        <output className={ok ? 'ie-ok' : 'ie-no'}>{t}</output>
      </label>
      <div className={`bc-verdict ${ok ? 'yes' : 'no'}`} aria-live="polite">
        <Tex>{`${t} ${REL_TEX[op]} ${b}`}</Tex> is {ok ? <strong>true — {t} is a solution.</strong> : <strong>false — {t} is not a solution.</strong>}
      </div>
    </div>
  );
}
