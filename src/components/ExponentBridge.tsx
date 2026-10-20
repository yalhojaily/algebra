import { useState } from 'react';
import { Tex } from './MathText';

const bases: [number, number][] = [[4, 2], [9, 2], [16, 2], [25, 2], [8, 3], [27, 3], [64, 3], [16, 4], [81, 4], [32, 5]];
const g = (a: number, b: number): number => (b ? g(b, a % b) : a);
const rootTex = (n: number, x: string) => (n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`);

/** a^(m/n): the denominator is a root, the numerator is a power, and a minus sign means a reciprocal. */
export default function ExponentBridge() {
  const [bi, setBi] = useState(4);
  const [m, setM] = useState(2);
  const [neg, setNeg] = useState(false);
  const [base, n] = bases[bi];
  const r = Math.round(base ** (1 / n));
  const val = r ** m;
  const exp = `${neg ? '-' : ''}${m}/${n}`;
  const reduced = g(m, n) !== 1;
  return (
    <div className="eb card">
      <div className="os-presets">
        {bases.map(([b, k], i) => <button key={i} className={`tl-chip ${i === bi ? 'on' : ''}`} onClick={() => setBi(i)}>{b} (n = {k})</button>)}
      </div>
      <div className="lb-eq"><Tex>{`${base}^{${exp}}`}</Tex></div>
      <ol className="ac-steps">
        <li><span className="sr-num">1</span><div><div className="ac-h">The denominator {n} is a root</div><Tex>{`${rootTex(n, String(base))} = ${r} \\quad\\text{because } ${r}^{${n}} = ${base}`}</Tex></div></li>
        <li><span className="sr-num">2</span><div><div className="ac-h">The numerator {m} is a power</div><Tex>{`\\left(${rootTex(n, String(base))}\\right)^{${m}} = ${r}^{${m}} = ${val}`}</Tex></div></li>
        {neg && <li><span className="sr-num">3</span><div><div className="ac-h">The minus sign means "take the reciprocal"</div><Tex>{`${base}^{-${m}/${n}} = \\dfrac{1}{${base}^{${m}/${n}}} = \\dfrac{1}{${val}}`}</Tex></div></li>}
        <li className="rl-result"><span className="sr-num">✓</span><div><Tex>{`${base}^{${exp}} = ${neg ? `\\dfrac{1}{${val}}` : val}`}</Tex>
          <div className="rl-bad">The same as <Tex>{`${rootTex(n, `${base}^{${m}}`)} = ${rootTex(n, String(base ** m))}`}</Tex> — but taking the root first keeps the numbers small.</div></div></li>
      </ol>
      {reduced && <p className="lb-note">Note: <Tex>{`\\tfrac{${m}}{${n}}`}</Tex> can be reduced — the answer is the same either way.</p>}
      <div className="am-controls">
        <label className="el-slider"><span>numerator m</span><input type="range" min={1} max={4} value={m} onChange={(e) => setM(Number(e.target.value))} /><output className="c-var">{m}</output></label>
        <label className="el-slider"><span>negative exponent</span><input type="checkbox" checked={neg} onChange={(e) => setNeg(e.target.checked)} /><output className="c-op">{neg ? 'yes' : 'no'}</output></label>
      </div>
    </div>
  );
}
