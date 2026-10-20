import { useState } from 'react';
import { Tex } from './MathText';

const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
const presets: [string, number][] = [['1/2', 50], ['1/4', 25], ['3/4', 75], ['1/5', 20], ['3/8', 37.5], ['7/20', 35], ['1/10', 10]];

/** A 10 × 10 grid: shaded squares out of 100 read as a fraction, a decimal and a percent at once. */
export default function HundredGrid() {
  const [v, setV] = useState(35); // hundredths, in steps of 0.5
  const num = Math.round(v * 10), den = 1000; // v/100 = num/1000
  const k = g(num, den) || 1;
  const N = num / k, D = den / k;
  const dec = String(+(v / 100).toFixed(4));
  return (
    <div className="hg card">
      <div className="os-presets">{presets.map(([l, x]) => <button key={l} className={`tl-chip ${x === v ? 'on' : ''}`} onClick={() => setV(x)}>{l}</button>)}</div>
      <div className="px-body">
        <svg viewBox="0 0 222 222" className="hg-svg" role="img" aria-label={`${v} of 100 squares shaded`}>
          {Array.from({ length: 100 }, (_, i) => {
            const col = Math.floor(i / 10), row = i % 10; // fill column by column, like reading tenths
            const fill = Math.max(0, Math.min(1, v - i));
            return (
              <g key={i}>
                <rect x={1 + col * 22} y={1 + row * 22} width={20} height={20} className="hg-cell" />
                {fill > 0 && <rect x={1 + col * 22} y={1 + row * 22 + 20 * (1 - fill)} width={20} height={20 * fill} className="hg-on" />}
              </g>
            );
          })}
        </svg>
        <div className="px-side">
          <div className="hg-forms">
            <div className="lx-box"><div className="el-step">Fraction</div><Tex>{v === 0 ? '0' : D === 1 ? String(N) : `\\dfrac{${N}}{${D}}`}</Tex></div>
            <div className="lx-box"><div className="el-step">Decimal</div><Tex>{dec}</Tex></div>
            <div className="lx-box"><div className="el-step">Percent</div><Tex>{`${v}\\%`}</Tex></div>
          </div>
          <p className="lb-note"><strong>{v}</strong> of the 100 squares are shaded. Each column is one tenth (<Tex>{'0.1'}</Tex>), each square one hundredth (<Tex>{'0.01'}</Tex>). "Percent" just means "out of 100", so <Tex>{`${v}\\% = \\tfrac{${v}}{100} = ${dec}`}</Tex>.</p>
          <label className="el-slider"><span>shaded</span><input type="range" min={0} max={100} step={0.5} value={v} onChange={(e) => setV(Number(e.target.value))} /><output className="c-var">{v}</output></label>
        </div>
      </div>
    </div>
  );
}
