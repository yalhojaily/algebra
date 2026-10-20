import { useState } from 'react';
import { Tex } from './MathText';

function primes(n: number) {
  const out: number[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out;
}

/** Factor the radicand into primes, circle groups of 2 (or 3), and bring one of each group outside. */
export default function RadicalSimplifier() {
  const [n, setN] = useState(72);
  const [k, setK] = useState(2);
  const [src, setSrc] = useState('72');
  const ps = n > 1 ? primes(n) : [];
  // group equal primes into bundles of k
  const groups: { p: number; out: boolean }[][] = [];
  const counts = new Map<number, number>();
  ps.forEach((p) => counts.set(p, (counts.get(p) ?? 0) + 1));
  let outside = 1, inside = 1;
  for (const [p, c] of counts) {
    for (let i = 0; i < Math.floor(c / k); i++) { groups.push(Array.from({ length: k }, () => ({ p, out: true }))); outside *= p; }
    for (let i = 0; i < c % k; i++) { groups.push([{ p, out: false }]); inside *= p; }
  }
  const root = (x: string) => (k === 2 ? `\\sqrt{${x}}` : `\\sqrt[3]{${x}}`);
  const result = inside === 1 ? String(outside) : `${outside === 1 ? '' : outside}${root(String(inside))}`;
  return (
    <div className="rs card">
      <div className="pr-tabs">
        <button className={`pr-tab ${k === 2 ? 'on' : ''}`} onClick={() => setK(2)}>Square root</button>
        <button className={`pr-tab ${k === 3 ? 'on' : ''}`} onClick={() => setK(3)}>Cube root</button>
      </div>
      <div className="os-input">
        <label className="mi-label" htmlFor="rs-n">Radicand</label>
        <input id="rs-n" className="mi-input" value={src} inputMode="numeric" onChange={(e) => { setSrc(e.target.value); const v = Number(e.target.value); if (Number.isInteger(v) && v > 0 && v < 1e7) setN(v); }} />
        <div className="os-presets">{[72, 200, 48, 180, 54, 128, 250, 1000].map((v) => <button key={v} className="tl-chip" onClick={() => { setN(v); setSrc(String(v)); }}>{v}</button>)}</div>
      </div>
      <div className="lb-eq"><Tex>{`${root(String(n))} = ${root(ps.join(' \\cdot ') || '1')}`}</Tex></div>
      <div className="rs-groups">
        {groups.map((gr, i) => (
          <span key={i} className={`rs-group ${gr[0].out ? 'out' : ''}`}>{gr.map((x, j) => <span key={j} className="gf-p">{x.p}</span>)}</span>
        ))}
      </div>
      <div className="pb-row el-result"><Tex>{`${root(String(n))} = ${result}`}</Tex></div>
      <p className="lb-note">Each circled group of {k === 2 ? 'two' : 'three'} equal primes is a perfect {k === 2 ? 'square' : 'cube'}: one copy comes out of the radical. The primes left over stay inside.</p>
    </div>
  );
}
