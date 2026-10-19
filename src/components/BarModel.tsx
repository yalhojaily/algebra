import { useState } from 'react';
import { Tex } from './MathText';

/**
 * A bar model for "cut into two pieces, one is k longer" problems — the picture behind
 * x + (x + k) = L: take away the extra k, and what's left splits into two equal pieces.
 */
export default function BarModel() {
  const [L, setL] = useState(30);
  const [k, setK] = useState(6);
  const [stage, setStage] = useState(0);
  const valid = k < L && (L - k) % 2 === 0;
  const x = (L - k) / 2;
  const W = 600, PAD = 20, H = 44;
  const s = (W - 2 * PAD) / L;

  return (
    <div className="bm card">
      <p className="bm-q">
        A <strong>{L} m</strong> rope is cut into two pieces. One piece is <strong>{k} m longer</strong> than the other. How long is each piece?
      </p>
      <svg viewBox={`0 0 ${W} 160`} className="bm-svg" role="img" aria-label="Bar model of the rope">
        <rect x={PAD} y={10} width={L * s} height={H} rx={6} className="bm-whole" />
        <text x={PAD + (L * s) / 2} y={10 + H / 2 + 5} className="bm-lab">{L} m</text>
        {valid && (
          <g transform={`translate(0 ${H + 30})`}>
            <rect x={PAD} y={0} width={x * s} height={H} rx={6} className="bm-x" />
            <text x={PAD + (x * s) / 2} y={H / 2 + 5} className="bm-lab">{stage >= 2 ? `x = ${x}` : 'x'}</text>
            <rect x={PAD + x * s + 4} y={0} width={x * s - 4} height={H} rx={6} className="bm-x" />
            <text x={PAD + x * s + (x * s) / 2} y={H / 2 + 5} className="bm-lab">{stage >= 2 ? x : 'x'}</text>
            <rect x={PAD + 2 * x * s + 2} y={0} width={k * s - 2} height={H} rx={6} className={`bm-k ${stage >= 1 ? 'gone' : ''}`} />
            <text x={PAD + 2 * x * s + (k * s) / 2} y={H / 2 + 5} className="bm-lab">{k}</text>
            <path d={`M ${PAD + x * s + 2} ${H + 8} v 10 h ${x * s + k * s} v -10`} className="bm-brace" />
            <text x={PAD + x * s + (x * s + k * s) / 2} y={H + 34} className="bm-small">longer piece: x + {k}</text>
          </g>
        )}
      </svg>
      {valid ? (
        <div className="bm-steps">
          <div className={stage >= 0 ? 'on' : ''}><Tex>{`x + (x + ${k}) = ${L}`}</Tex> <span>Two short lengths plus the extra {k} make {L}.</span></div>
          {stage >= 1 && <div className="on"><Tex>{`2x = ${L - k}`}</Tex> <span>Take away the extra {k} m from the whole rope.</span></div>}
          {stage >= 2 && <div className="on"><Tex>{`x = ${x}`}</Tex> <span>Split what's left into two equal parts. The pieces are {x} m and {x + k} m.</span></div>}
        </div>
      ) : (
        <div className="pc-msg invalid">Pick numbers where the pieces come out whole: the length minus the extra should be even.</div>
      )}
      <div className="wb-actions">
        {valid && stage < 2 && <button className="btn btn-primary" onClick={() => setStage((n) => n + 1)}>{stage === 0 ? 'Remove the extra' : 'Split in two'}</button>}
        {stage > 0 && <button className="btn btn-ghost" onClick={() => setStage(0)}>↺ Again</button>}
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>rope length</span><input type="range" min={10} max={60} step={2} value={L} onChange={(e) => { setL(Number(e.target.value)); setStage(0); }} /><output className="c-var">{L}</output></label>
        <label className="el-slider"><span>extra length</span><input type="range" min={2} max={20} step={2} value={k} onChange={(e) => { setK(Number(e.target.value)); setStage(0); }} /><output className="c-op">{k}</output></label>
      </div>
    </div>
  );
}
