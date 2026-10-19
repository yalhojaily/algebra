import { useMemo, useState } from 'react';
import { keyOf, monoStr, Poly } from '../lib/poly';
import { Tex } from './MathText';

const PALETTE = ['k1', 'k2', 'k3', 'k0', 'k4', 'k5'];

/** Multiply any two polynomials with a table: every term times every term, then like terms (same color) combine. */
export default function BoxMethod({ presets = [['2x + 3', 'x - 4'], ['x - 2', 'x^2 + 3x - 5'], ['3x + 1', '3x - 1']] }: { presets?: [string, string][] }) {
  const [a, setA] = useState(presets[0][0]);
  const [b, setB] = useState(presets[0][1]);
  const [combined, setCombined] = useState(false);
  const parsed = useMemo(() => {
    try { return [Poly.parse(a), Poly.parse(b)] as const; } catch { return null; }
  }, [a, b]);

  const body = (() => {
    if (!parsed) return <div className="pc-msg invalid">Type two polynomials, like 2x + 3 and x^2 - 5.</div>;
    const [A, B] = parsed;
    const at = A.ordered(), bt = B.ordered();
    if (at.length > 5 || bt.length > 5) return <div className="pc-msg invalid">Keep each polynomial to 5 terms or fewer.</div>;
    const prods = bt.map(([c2, v2]) => at.map(([c1, v1]) => Poly.mono(c1, v1).mul(Poly.mono(c2, v2))));
    const keys = [...new Set(prods.flat().map((p) => keyOf(p.ordered()[0]?.[1] ?? {})))];
    const color = (p: Poly) => PALETTE[keys.indexOf(keyOf(p.ordered()[0]?.[1] ?? {})) % PALETTE.length];
    const R = A.mul(B);
    return (
      <>
        <table className="bx-table">
          <thead>
            <tr><th className="bx-corner"><Tex>\times</Tex></th>{at.map(([c, v], i) => <th key={i}><Tex>{monoStr(c, v, true)}</Tex></th>)}</tr>
          </thead>
          <tbody>
            {bt.map(([c, v], r) => (
              <tr key={r}>
                <th><Tex>{monoStr(c, v, true)}</Tex></th>
                {prods[r].map((p, k) => <td key={k} className={`bx-cell ${color(p)}`}><Tex>{p.tex()}</Tex></td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bx-result">
          {!combined ? (
            <>
              <div className="bx-all"><Tex>{prods.flat().map((p, i) => (i === 0 ? p.tex() : p.tex().startsWith('-') ? `- ${p.tex().slice(1)}` : `+ ${p.tex()}`)).join(' ')}</Tex></div>
              <button className="btn btn-primary" onClick={() => setCombined(true)}>Combine like terms (same color)</button>
            </>
          ) : (
            <div className="bx-final"><Tex>{`(${A.tex()})(${B.tex()}) = ${R.tex()}`}</Tex></div>
          )}
        </div>
      </>
    );
  })();

  return (
    <div className="bx card">
      <div className="bx-inputs">
        <input className="mi-input" value={a} onChange={(e) => { setA(e.target.value); setCombined(false); }} aria-label="First polynomial" />
        <span className="bx-times">×</span>
        <input className="mi-input" value={b} onChange={(e) => { setB(e.target.value); setCombined(false); }} aria-label="Second polynomial" />
      </div>
      <div className="os-presets">
        {presets.map(([x, y]) => <button key={x + y} className="tl-chip" onClick={() => { setA(x); setB(y); setCombined(false); }}>({x})({y})</button>)}
      </div>
      {body}
    </div>
  );
}
