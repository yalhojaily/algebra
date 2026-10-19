import { useMemo, useState } from 'react';
import { Poly } from '../lib/poly';
import { Tex } from './MathText';

const presets: [number, number, number][] = [[3, -5, -2], [6, 7, 2], [4, -4, -15], [2, 11, 12]];

/** FOIL in reverse: list the possible factor pairs for the first and last terms, and test each arrangement's middle term. */
export default function TrialFactor() {
  const [pi, setPi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [a, b, c] = presets[pi];
  const cands = useMemo(() => {
    const out: { p: number; q: number; r: number; s: number; mid: number }[] = [];
    for (let p = 1; p <= a; p++) if (a % p === 0) {
      const r = a / p;
      if (p > r) continue;
      for (let q = -Math.abs(c); q <= Math.abs(c); q++) if (q !== 0 && c % q === 0) {
        const s = c / q;
        out.push({ p, q, r, s, mid: p * s + q * r });
      }
    }
    return out;
  }, [a, c]);
  const P = Poly.fromCoefs([a, b, c]);
  const bin = (k: number, m: number) => Poly.fromCoefs([k, m]).tex();
  const sel = picked !== null ? cands[picked] : null;
  return (
    <div className="tf card">
      <div className="pr-tabs">
        {presets.map((x, i) => <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setPicked(null); }}><Tex>{Poly.fromCoefs(x).tex()}</Tex></button>)}
      </div>
      <p className="fp-h">Each candidate's <strong>F</strong>irst terms multiply to <Tex>{`${a}x^2`}</Tex> and <strong>L</strong>ast terms to <Tex>{`${c}`}</Tex>. Click one to check its middle term (Outer + Inner). You want <Tex>{`${b}x`}</Tex>.</p>
      <div className="tf-grid">
        {cands.map((k, i) => (
          <button key={i} className={`tf-cand ${picked === i ? (k.mid === b ? 'right' : 'wrong') : ''}`} onClick={() => setPicked(i)}>
            <Tex>{`(${bin(k.p, k.q)})(${bin(k.r, k.s)})`}</Tex>
          </button>
        ))}
      </div>
      {sel && (
        <div className={`bc-verdict ${sel.mid === b ? 'yes' : 'no'}`}>
          Outer: <Tex>{`${sel.p * sel.s}x`}</Tex>, Inner: <Tex>{`${sel.q * sel.r}x`}</Tex> → middle term <Tex>{`${sel.mid}x`}</Tex>{' '}
          {sel.mid === b ? <strong>✓ That's it: <Tex>{`${P.tex()} = (${bin(sel.p, sel.q)})(${bin(sel.r, sel.s)})`}</Tex></strong> : sel.mid === -b ? '— the right size but the wrong sign. Swap the signs of the last terms.' : '— not the middle term we need. Try another.'}
        </div>
      )}
    </div>
  );
}
