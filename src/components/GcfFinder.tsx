import { useMemo, useState } from 'react';
import { factorPoly, monoStr, Poly } from '../lib/poly';
import { Tex } from './MathText';

const presets = ['12x^3 + 18x^2', '15x^4 - 10x^3 + 25x^2', '8x^2 - 20x + 4', '21x^5 + 14x^2'];

function primes(n: number) {
  const out: number[] = [];
  let m = Math.abs(n);
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out;
}

/** Find the greatest common factor term by term: prime factors of each coefficient and the lowest power of x. */
export default function GcfFinder() {
  const [src, setSrc] = useState(presets[0]);
  const P = useMemo(() => { try { const p = Poly.parse(src); return p.variables().every((v) => v === 'x') ? p : null; } catch { return null; } }, [src]);
  const terms = P ? P.ordered() : [];
  const common = P ? factorPoly(P).common : null;
  const g = common ? Math.abs(common.coefs('x').find((c) => c !== 0) ?? 1) : 1;
  const low = P ? Math.min(...terms.map(([, v]) => v.x ?? 0)) : 0;
  const gPrimes = primes(g);
  const G = Poly.mono(g, low ? { x: low } : {});
  const inner = P && !G.isZero() ? terms.reduce((s, [c, v]) => s.add(Poly.mono(c / g, (v.x ?? 0) - low ? { x: (v.x ?? 0) - low } : {})), new Poly()) : null;

  return (
    <div className="gf card">
      <div className="os-input">
        <label className="mi-label" htmlFor="gf-src">Polynomial in x</label>
        <input id="gf-src" className="mi-input" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} />
        <div className="os-presets">{presets.map((p) => <button key={p} className="tl-chip" onClick={() => setSrc(p)}>{p}</button>)}</div>
      </div>
      {!P ? <div className="pc-msg invalid">Type a polynomial in x.</div> : (
        <>
          <table className="gf-table">
            <thead><tr><th>Term</th><th>Coefficient as primes</th><th>Power of x</th></tr></thead>
            <tbody>
              {terms.map(([c, v], i) => {
                let pool = [...gPrimes];
                return (
                  <tr key={i}>
                    <td><Tex>{monoStr(c, v, true)}</Tex></td>
                    <td className="gf-primes">
                      {c < 0 && <span className="gf-p">−1</span>}
                      {primes(c).map((p, k) => {
                        const j = pool.indexOf(p);
                        const hit = j >= 0;
                        if (hit) pool = [...pool.slice(0, j), ...pool.slice(j + 1)];
                        return <span key={k} className={`gf-p ${hit ? 'hit' : ''}`}>{p}</span>;
                      })}
                      {primes(c).length === 0 && <span className="gf-p">1</span>}
                    </td>
                    <td>
                      {Array.from({ length: v.x ?? 0 }, (_, k) => <span key={k} className={`gf-p x ${k < low ? 'hit' : ''}`}>x</span>)}
                      {(v.x ?? 0) === 0 && <span className="gf-none">none</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="gf-result">
            <div>Highlighted factors appear in <strong>every</strong> term: GCF <Tex>{`= ${G.tex()}`}</Tex></div>
            {inner && <div className="bx-final"><Tex>{`${P.tex()} = ${G.equals(Poly.const(1)) ? '' : G.tex()}(${inner.tex()})`}</Tex></div>}
          </div>
        </>
      )}
    </div>
  );
}
