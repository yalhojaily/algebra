import { useState } from 'react';
import { Tex } from './MathText';

/** An improper fraction n/d drawn as bars of d pieces: the full bars are the whole part, the last bar is the fraction part. */
export default function MixedNumbers() {
  const [n, setN] = useState(11);
  const [d, setD] = useState(4);
  const w = Math.floor(n / d), r = n % d;
  const bars = Math.max(1, Math.ceil(n / d));
  return (
    <div className="mn card">
      <div className="mn-bars">
        {Array.from({ length: bars }, (_, b) => (
          <div key={b} className={`fb-bar ${b < w ? 'mn-full' : ''}`}>
            {Array.from({ length: d }, (_, i) => <span key={i} className={`fb-cell ${b * d + i < n ? (b < w ? 'a' : 'b') : ''}`} />)}
          </div>
        ))}
      </div>
      <div className="lx-pair">
        <div className="lx-box"><div className="el-step">Improper fraction</div><Tex>{`\\dfrac{${n}}{${d}}`}</Tex></div>
        <div className="lx-arrow">=</div>
        <div className="lx-box"><div className="el-step">Mixed number</div><Tex>{r === 0 ? String(w) : w ? `${w}\\tfrac{${r}}{${d}}` : `\\tfrac{${r}}{${d}}`}</Tex></div>
      </div>
      <div className="pb-row"><span className="el-step">Divide</span><Tex>{`${n} \\div ${d} = \\htmlClass{c-var}{${w}} \\text{ remainder } \\htmlClass{c-op}{${r}}`}</Tex></div>
      <div className="pb-row"><span className="el-step">Back</span><Tex>{`\\htmlClass{c-var}{${w}} \\cdot ${d} + \\htmlClass{c-op}{${r}} = ${n}`}</Tex></div>
      <p className="lb-note"><span className="pp-blue">Blue</span> bars are full wholes ({w}); the <span className="pp-red">red</span> pieces are what's left over ({r} of {d}). {r === 0 && 'No leftover: the fraction is a whole number.'}</p>
      <div className="am-controls">
        <label className="el-slider"><span>numerator</span><input type="range" min={1} max={30} value={n} onChange={(e) => setN(Number(e.target.value))} /><output className="c-var">{n}</output></label>
        <label className="el-slider"><span>denominator</span><input type="range" min={2} max={10} value={d} onChange={(e) => setD(Number(e.target.value))} /><output className="c-op">{d}</output></label>
      </div>
    </div>
  );
}
