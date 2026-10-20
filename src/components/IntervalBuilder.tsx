import { useState } from 'react';
import { NumberLineSet } from './NumberLineSet';
import { Tex } from './MathText';

/** Build a set on the number line and see it three ways: inequality, interval notation, set-builder notation. */
export default function IntervalBuilder() {
  const [lo, setLo] = useState(-2);
  const [hi, setHi] = useState(4);
  const [loInf, setLoInf] = useState(false);
  const [hiInf, setHiInf] = useState(false);
  const [loC, setLoC] = useState(true);
  const [hiC, setHiC] = useState(false);
  const a = loInf ? -Infinity : lo, b = hiInf ? Infinity : Math.max(hi, lo);
  const lc = loC && !loInf, hc = hiC && !hiInf;
  const n = (v: number) => (v === Infinity ? '\\infty' : v === -Infinity ? '-\\infty' : String(v));
  const le = (c: boolean) => (c ? '\\le' : '<');
  const ineq = loInf && hiInf ? 'x \\text{ is any real number}' : loInf ? `x ${le(hc)} ${b}` : hiInf ? `x ${lc ? '\\ge' : '>'} ${a}` : `${a} ${le(lc)} x ${le(hc)} ${b}`;
  const interval = `${lc ? '[' : '('}${n(a)}, ${n(b)}${hc ? ']' : ')'}`;
  return (
    <div className="ib card">
      <NumberLineSet parts={[{ lo: a, hi: b, loClosed: lc, hiClosed: hc }]} min={-10} max={10} />
      <div className="ib-forms">
        <div className="pb-row"><span className="el-step">Inequality</span><Tex>{ineq}</Tex></div>
        <div className="pb-row"><span className="el-step">Interval</span><Tex>{interval}</Tex></div>
        <div className="pb-row"><span className="el-step">Set-builder</span><Tex>{`\\{x \\mid ${ineq.includes('text') ? 'x \\in \\mathbb{R}' : ineq}\\}`}</Tex></div>
      </div>
      <div className="ib-ends">
        <fieldset>
          <legend>Left end</legend>
          <label className="el-slider"><span>value</span><input type="range" min={-9} max={9} value={lo} disabled={loInf} onChange={(e) => setLo(Number(e.target.value))} /><output className="c-var">{loInf ? '−∞' : lo}</output></label>
          <div className="ib-toggles">
            <button className={`tl-chip ${!loInf && loC ? 'on' : ''}`} onClick={() => { setLoInf(false); setLoC(true); }}>[ included</button>
            <button className={`tl-chip ${!loInf && !loC ? 'on' : ''}`} onClick={() => { setLoInf(false); setLoC(false); }}>( not included</button>
            <button className={`tl-chip ${loInf ? 'on' : ''}`} onClick={() => setLoInf(true)}>−∞</button>
          </div>
        </fieldset>
        <fieldset>
          <legend>Right end</legend>
          <label className="el-slider"><span>value</span><input type="range" min={-9} max={9} value={hi} disabled={hiInf} onChange={(e) => setHi(Number(e.target.value))} /><output className="c-op">{hiInf ? '∞' : Math.max(hi, lo)}</output></label>
          <div className="ib-toggles">
            <button className={`tl-chip ${!hiInf && hiC ? 'on' : ''}`} onClick={() => { setHiInf(false); setHiC(true); }}>] included</button>
            <button className={`tl-chip ${!hiInf && !hiC ? 'on' : ''}`} onClick={() => { setHiInf(false); setHiC(false); }}>) not included</button>
            <button className={`tl-chip ${hiInf ? 'on' : ''}`} onClick={() => setHiInf(true)}>∞</button>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
