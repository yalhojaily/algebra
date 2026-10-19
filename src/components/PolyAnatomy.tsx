import { useMemo, useState } from 'react';
import { monoStr, Poly } from '../lib/poly';
import { Plane } from './Plane';
import { Tex } from './MathText';

const presets = ['-x^2 + 4x + 1', '0.5x^3 - 2x', '3 - 2x', 'x^4 - 5x^2 + 4', '2x^2 - 3x - 2'];
const NAMES = ['monomial', 'binomial', 'trinomial'];

/** Take a polynomial apart: terms, coefficients, degrees, leading term — and evaluate it by sliding x. */
export default function PolyAnatomy() {
  const [src, setSrc] = useState(presets[0]);
  const [x, setX] = useState(1);
  const P = useMemo(() => {
    try { return Poly.parse(src); } catch { return null; }
  }, [src]);
  const ok = P && P.variables().every((v) => v === 'x');
  const terms = ok ? P!.ordered() : [];
  const val = ok ? P!.evaluate({ x }) : 0;

  return (
    <div className="pa card">
      <div className="os-input">
        <label className="mi-label" htmlFor="pa-src">Polynomial in x</label>
        <input id="pa-src" className="mi-input" value={src} spellCheck={false} onChange={(e) => setSrc(e.target.value)} />
        <div className="os-presets">{presets.map((p) => <button key={p} className="tl-chip" onClick={() => setSrc(p)}>{p}</button>)}</div>
      </div>
      {!ok ? (
        <div className="pc-msg invalid">Type a polynomial in x, like 3x^2 - 5x + 2.</div>
      ) : (
        <>
          <div className="pa-terms">
            {terms.map(([c, v], i) => {
              const d = v.x ?? 0;
              return (
                <div key={i} className={`pa-term ${i === 0 ? 'lead' : ''}`}>
                  <div className="pa-tex"><Tex>{monoStr(c, v, true)}</Tex></div>
                  <div className="pa-lab">coefficient <strong>{+c.toFixed(3)}</strong></div>
                  <div className="pa-lab">degree <strong>{d}</strong></div>
                  {i === 0 && <div className="pa-tag">leading term</div>}
                </div>
              );
            })}
          </div>
          <p className="pa-sum">
            {P!.size <= 3 ? <>A <strong>{NAMES[P!.size - 1]}</strong></> : <>A polynomial with <strong>{P!.size}</strong> terms</>} of <strong>degree {P!.degree()}</strong>, written in descending order: <Tex>{P!.tex()}</Tex>
          </p>
          <div className="px-body">
            <Plane size={360} range={6} yRange={10} curves={[{ coefs: P!.coefs('x') }]} points={Math.abs(val) <= 10 ? [{ x, y: val, cls: 'red', label: `(${x}, ${+val.toFixed(2)})` }] : []} />
            <div className="px-side">
              <div className="pb-row"><span className="el-step">Evaluate</span><Tex>{`x = ${x}`}</Tex></div>
              <div className="pb-row el-result"><span className="el-step">Value</span><Tex>{`${+val.toFixed(3)}`}</Tex></div>
              <label className="el-slider"><span>x</span><input type="range" min={-5} max={5} value={x} onChange={(e) => setX(Number(e.target.value))} /><output className="c-var">{x}</output></label>
              <p className="lb-note">Each value of x gives one output. Plotting all of them draws the graph of the polynomial.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
