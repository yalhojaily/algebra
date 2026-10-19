import { useMemo, useState } from 'react';
import { factorizationTex, factorPoly, Poly } from '../lib/poly';
import { Tex } from './MathText';

const presets = ['3x^2 - 27', '2x^3 + 12x^2 + 18x', '6x^2 + x - 2', 'x^3 + 2x^2 - 9x - 18', '5x^3 - 40', 'x^2 + 9', '4x^4 - 64'];
const isSq = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n));
const isCube = (n: number) => Math.round(Math.cbrt(n)) ** 3 === n;

/** The general factoring strategy as a decision path, applied to any polynomial in x. */
export default function StrategyFlow() {
  const [src, setSrc] = useState(presets[0]);
  const P = useMemo(() => { try { const p = Poly.parse(src); return p.variables().every((v) => v === 'x') && p.degree() <= 6 ? p : null; } catch { return null; } }, [src]);
  const info = useMemo(() => {
    if (!P) return null;
    const f = factorPoly(P);
    const g = f.common;
    const hasG = !g.equals(Poly.const(1)) && !g.equals(Poly.const(-1));
    // what's left after the common factor
    const rest = f.factors.reduce((a, b) => a.mul(b), Poly.const(1));
    const cs = rest.coefs('x');
    const n = rest.size;
    let method = '';
    if (n === 2) {
      const [lead, last] = [cs[0], cs[cs.length - 1]];
      const d = rest.degreeIn('x');
      if (d % 2 === 0 && isSq(lead) && isSq(-last)) method = 'Two terms → difference of squares';
      else if (d % 3 === 0 && isCube(Math.abs(lead)) && isCube(Math.abs(last))) method = `Two terms → ${last > 0 ? 'sum' : 'difference'} of cubes`;
      else if (last > 0 && d % 2 === 0) method = 'Two terms → a sum of squares is prime';
      else method = 'Two terms → no special pattern';
    } else if (n === 3) {
      const [a, b, c] = [cs[0], cs[1], cs[2]];
      if (cs.length === 3 && isSq(a) && isSq(c) && Math.abs(b) === 2 * Math.sqrt(a) * Math.sqrt(c)) method = 'Three terms → trinomial square';
      else if (a === 1) method = 'Three terms, leading coefficient 1 → find two numbers (product c, sum b)';
      else method = 'Three terms, leading coefficient ≠ 1 → FOIL trial-and-error or the ac-method';
    } else if (n === 4) method = 'Four terms → factor by grouping';
    else method = n <= 1 ? 'Nothing more to factor' : 'Try finding a factor with a root';
    return { hasG, g, rest, n, method, tex: factorizationTex(f) };
  }, [P]);

  return (
    <div className="sf card">
      <div className="os-input">
        <label className="mi-label" htmlFor="sf-src">Polynomial in x</label>
        <input id="sf-src" className="mi-input" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} />
        <div className="os-presets">{presets.map((p) => <button key={p} className="tl-chip" onClick={() => setSrc(p)}>{p}</button>)}</div>
      </div>
      {!info ? <div className="pc-msg invalid">Type a polynomial in x (degree 6 or less).</div> : (
        <ol className="sf-steps">
          <li className={info.hasG ? 'yes' : 'no'}>
            <span className="sr-num">1</span>
            <div><strong>Common factor?</strong> {info.hasG ? <>Yes — take out <Tex>{info.g.tex()}</Tex>, leaving <Tex>{info.rest.tex()}</Tex>.</> : 'None (other than 1).'}</div>
          </li>
          <li className="yes">
            <span className="sr-num">2</span>
            <div><strong>Count the terms:</strong> {info.n}. {info.method}.</div>
          </li>
          <li className="yes">
            <span className="sr-num">3</span>
            <div><strong>Factor completely</strong> — and check whether any factor can be factored again:<div className="bx-final"><Tex>{`${P!.tex()} = ${info.tex}`}</Tex></div></div>
          </li>
          <li className="yes">
            <span className="sr-num">4</span>
            <div><strong>Check</strong> by multiplying the factors back together.</div>
          </li>
        </ol>
      )}
    </div>
  );
}
