import { useState } from 'react';
import { Tex } from './MathText';

function primes(n: number) {
  const out: number[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out;
}

/** Prime factors of two numbers in a Venn diagram: the shared middle multiplies to the GCD; everything together multiplies to the LCM. */
export default function PrimeVenn({ focus = 'gcd' }: { focus?: 'gcd' | 'lcm' }) {
  const [a, setA] = useState(36);
  const [b, setB] = useState(60);
  const pa = primes(a), pb = primes(b);
  const shared: number[] = [];
  const restB = [...pb];
  const onlyA: number[] = [];
  for (const p of pa) {
    const i = restB.indexOf(p);
    if (i >= 0) { shared.push(p); restB.splice(i, 1); } else onlyA.push(p);
  }
  const prod = (xs: number[]) => xs.reduce((s, x) => s * x, 1);
  const G = prod(shared), L = prod([...onlyA, ...shared, ...restB]);
  const chips = (xs: number[]) => xs.map((p, i) => <span key={i} className="gf-p">{p}</span>);
  const presets: [number, number][] = [[36, 60], [12, 18], [48, 180], [14, 25], [24, 90]];
  return (
    <div className="pv card">
      <div className="os-presets">{presets.map(([x, y]) => <button key={`${x}-${y}`} className="tl-chip" onClick={() => { setA(x); setB(y); }}>{x} & {y}</button>)}</div>
      <div className="pv-venn">
        <div className="pv-circle a"><span className="pv-name">{a}</span><div className="pv-only">{chips(onlyA)}</div></div>
        <div className={`pv-mid ${focus === 'gcd' ? 'hl' : ''}`}>{shared.length ? chips(shared) : <span className="gf-none">none</span>}</div>
        <div className="pv-circle b"><span className="pv-name">{b}</span><div className="pv-only">{chips(restB)}</div></div>
      </div>
      <div className={`pb-row ${focus === 'gcd' ? 'el-result' : ''}`}><span className="el-step">GCD</span><Tex>{`\\text{shared primes: } ${shared.length ? shared.join(' \\cdot ') : '1'} = ${G}`}</Tex></div>
      <div className={`pb-row ${focus === 'lcm' ? 'el-result' : ''}`}><span className="el-step">LCM</span><Tex>{`\\text{all primes, shared ones once: } ${[...onlyA, ...shared, ...restB].sort((x, y) => x - y).join(' \\cdot ') || '1'} = ${L}`}</Tex></div>
      <p className="lb-note">The middle holds the primes the two numbers <strong>share</strong>. Multiply just the middle for the GCD; multiply <strong>everything</strong> in the picture for the LCM. Check: <Tex>{`\\text{GCD} \\times \\text{LCM} = ${G} \\times ${L} = ${G * L} = ${a} \\times ${b}`}</Tex>. {G === 1 && 'These numbers share no prime factor: their GCD is 1 (they are relatively prime).'}</p>
      <div className="am-controls">
        <label className="el-slider"><span>first number</span><input type="range" min={2} max={200} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>second number</span><input type="range" min={2} max={200} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
      </div>
    </div>
  );
}
