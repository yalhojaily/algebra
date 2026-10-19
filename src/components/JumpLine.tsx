import { useState } from 'react';
import { Tex } from './MathText';

const MIN = -20;
const MAX = 20;
const W = 660;
const PAD = 24;
const Y = 120;
const toX = (v: number) => PAD + ((v - MIN) / (MAX - MIN)) * (W - 2 * PAD);
const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);

interface Props {
  mode?: 'add' | 'subtract';
}

/** Addition as a jump on the number line: start at a, move b units (right if positive, left if negative). */
export default function JumpLine({ mode = 'add' }: Props) {
  const [a, setA] = useState(mode === 'add' ? -4 : 3);
  const [b, setB] = useState(mode === 'add' ? 9 : -5);
  const move = mode === 'add' ? b : -b; // the actual jump
  const end = a + move;
  const x0 = toX(a);
  const x1 = toX(end);
  const lift = Math.min(90, 26 + Math.abs(move) * 3.2);
  const ticks = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);

  const rule = (() => {
    if (move === 0) return 'Adding 0 leaves the number unchanged.';
    if (a === 0) return 'Starting at 0, you land on the second number.';
    if (Math.sign(a) === Math.sign(move))
      return `Same signs: add the absolute values (${Math.abs(a)} + ${Math.abs(move)} = ${Math.abs(end)}) and keep the sign.`;
    if (end === 0) return 'Opposites: they cancel out and the sum is 0.';
    return `Different signs: subtract the absolute values (${Math.max(Math.abs(a), Math.abs(move))} − ${Math.min(Math.abs(a), Math.abs(move))} = ${Math.abs(end)}) and use the sign of the number with the larger absolute value.`;
  })();

  return (
    <div className="jl card">
      <div className="jl-eq">
        {mode === 'subtract' ? (
          <>
            <Tex>{`\\htmlClass{c-var}{${a}} - \\htmlClass{c-op}{${p(b)}}`}</Tex>
            <span className="jl-arrow">→</span>
            <Tex>{`\\htmlClass{c-var}{${a}} + \\htmlClass{c-op}{${p(-b)}}`}</Tex>
            <span className="jl-arrow">=</span>
            <Tex>{`\\htmlClass{c-eq}{${end}}`}</Tex>
          </>
        ) : (
          <Tex>{`\\htmlClass{c-var}{${a}} + \\htmlClass{c-op}{${p(b)}} = \\htmlClass{c-eq}{${end}}`}</Tex>
        )}
      </div>

      <svg viewBox={`0 0 ${W} 170`} className="jl-svg" role="img" aria-label={`Start at ${a}, move ${Math.abs(move)} to the ${move < 0 ? 'left' : 'right'}, land on ${end}`}>
        <defs>
          {(['pos', 'neg'] as const).map((k) => (
            <marker key={k} id={`jl-head-${mode}-${k}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" className={`jl-headfill ${k}`} />
            </marker>
          ))}
        </defs>
        <line x1={PAD - 8} x2={W - PAD + 8} y1={Y} y2={Y} className="nl-axis" />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={toX(t)} x2={toX(t)} y1={Y - (t % 5 === 0 ? 7 : 4)} y2={Y + (t % 5 === 0 ? 7 : 4)} className={t === 0 ? 'nl-zero' : 'nl-tick'} />
            {t % 5 === 0 && <text x={toX(t)} y={Y + 26} className={`nl-num ${t === 0 ? 'z' : ''}`}>{t}</text>}
          </g>
        ))}
        {move !== 0 && (
          <>
            <path d={`M ${x0} ${Y - 8} C ${x0} ${Y - lift}, ${x1} ${Y - lift}, ${x1} ${Y - 10}`} className={`jl-jump ${move < 0 ? 'neg' : 'pos'}`} markerEnd={`url(#jl-head-${mode}-${move < 0 ? 'neg' : 'pos'})`} />
            <text x={(x0 + x1) / 2} y={Y - lift * 0.78 - 6} className={`jl-jumplabel ${move < 0 ? 'neg' : 'pos'}`}>
              {move < 0 ? `${Math.abs(move)} left` : `${move} right`}
            </text>
          </>
        )}
        <circle cx={x0} cy={Y} r={8} className="jl-start" />
        <circle cx={x1} cy={Y} r={8} className="jl-end" />
        <text x={x1} y={Y + 48} className="jl-endlabel">{end}</text>
      </svg>

      <div className="jl-controls">
        <label className="el-slider">
          <span>first number</span>
          <input type="range" min={-10} max={10} value={a} onChange={(e) => setA(Number(e.target.value))} />
          <output className="c-var">{a}</output>
        </label>
        <label className="el-slider">
          <span>{mode === 'add' ? 'number added' : 'number subtracted'}</span>
          <input type="range" min={-10} max={10} value={b} onChange={(e) => setB(Number(e.target.value))} />
          <output className="c-op">{b}</output>
        </label>
      </div>
      <div className="jl-rule">
        {mode === 'subtract' && b !== 0 && (
          <div>
            Subtracting <strong>{b}</strong> is the same as adding its opposite, <strong>{-b}</strong> — so the jump goes{' '}
            <strong>{-b < 0 ? 'left' : 'right'}</strong>.
          </div>
        )}
        <div>{rule}</div>
      </div>
    </div>
  );
}
