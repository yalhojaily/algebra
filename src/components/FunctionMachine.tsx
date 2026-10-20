import { useMemo, useState } from 'react';
import { Poly } from '../lib/poly';
import { Plane } from './Plane';
import { Tex } from './MathText';

const presets = ['2x + 1', 'x^2 - 3', '-x + 4', '0.5x^2 - 2x'];

/** A function as a machine: each input goes in, exactly one output comes out, and every (input, output) pair is a point on the graph. */
export default function FunctionMachine() {
  const [src, setSrc] = useState(presets[0]);
  const [x, setX] = useState(1);
  const [seen, setSeen] = useState<number[]>([1]);
  const P = useMemo(() => { try { const q = Poly.parse(src); return q.variables().every((v) => v === 'x') && q.degree() <= 3 ? q : null; } catch { return null; } }, [src]);
  const f = (v: number) => (P ? P.evaluate({ x: v }) : NaN);
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(2)));
  const move = (v: number) => { setX(v); setSeen((s) => (s.includes(v) ? s : [...s, v])); };
  const pick = (s: string) => { setSrc(s); setSeen([x]); };
  const sub = P ? P.tex().replace(/x/g, `(${x})`) : '';
  return (
    <div className="fm card">
      <div className="os-presets">{presets.map((p) => <button key={p} className={`tl-chip ${p === src ? 'on' : ''}`} onClick={() => pick(p)}>f(x) = {p}</button>)}</div>
      {!P ? <div className="pc-msg invalid">Choose a function above.</div> : (
        <div className="px-body">
          <div className="fm-left">
            <div className="fm-machine" aria-live="polite">
              <div className="fm-in"><span className="el-step">Input</span><strong className="c-var">{x}</strong></div>
              <div className="fm-box"><Tex>{`f(x) = ${P.tex()}`}</Tex></div>
              <div className="fm-out"><span className="el-step">Output</span><strong className="c-op">{fmt(f(x))}</strong></div>
            </div>
            <div className="pb-row"><Tex>{`f(${x}) = ${sub} = ${fmt(f(x))}`}</Tex></div>
            <label className="el-slider"><span>input x</span><input type="range" min={-4} max={4} value={x} onChange={(e) => move(Number(e.target.value))} /><output className="c-var">{x}</output></label>
            <p className="lb-note">Each input gives <strong>exactly one</strong> output. Move the slider: every pair <Tex>{'(x, f(x))'}</Tex> you try becomes a point on the graph.</p>
          </div>
          <Plane range={8} size={340}
            curves={seen.length >= 5 ? [{ coefs: P.coefs('x'), cls: 'faint' }] : []}
            points={seen.filter((v) => Math.abs(f(v)) <= 8).map((v) => ({ x: v, y: f(v), cls: v === x ? 'red' : '', label: v === x ? `(${v}, ${fmt(f(v))})` : undefined }))} />
        </div>
      )}
    </div>
  );
}
