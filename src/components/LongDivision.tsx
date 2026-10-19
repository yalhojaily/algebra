import { useMemo, useState } from 'react';
import { longDivide, Poly } from '../lib/poly';
import { Tex } from './MathText';

const presets: [string, string][] = [['x^2 + 7x + 10', 'x + 2'], ['2x^3 - 3x^2 + 4x - 5', 'x - 2'], ['x^3 - 8', 'x - 2'], ['6x^2 - x - 12', '2x - 3']];

/** Polynomial long division, one cycle (divide → multiply → subtract) at a time. */
export default function LongDivision() {
  const [pi, setPi] = useState(0);
  const [shown, setShown] = useState(0);
  const [D, d] = useMemo(() => presets[pi].map((s) => Poly.parse(s)), [pi]);
  const { quotient, remainder, steps } = useMemo(() => longDivide(D, d), [D, d]);
  const done = shown >= steps.length;
  const lead = d.ordered()[0];
  return (
    <div className="ld card">
      <div className="pr-tabs">
        {presets.map(([a, b], i) => (
          <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setShown(0); }}><Tex>{`(${Poly.parse(a).tex()}) \\div (${Poly.parse(b).tex()})`}</Tex></button>
        ))}
      </div>
      <div className="ld-board">
        <div className="ld-q"><Tex>{steps.slice(0, shown).reduce((q, s) => q.add(s.term), new Poly()).tex() || '\\phantom{0}'}</Tex></div>
        <div className="ld-main">
          <span className="ld-div"><Tex>{d.tex()}</Tex></span>
          <span className="ld-bracket"><Tex>{D.tex()}</Tex></span>
        </div>
        <ol className="ld-steps">
          {steps.slice(0, shown).map((s, i) => (
            <li key={i}>
              <div className="ld-op"><span className="el-step">divide</span><Tex>{`\\dfrac{${(i === 0 ? D : steps[i - 1].remainder).ordered()[0] ? Poly.mono(...(i === 0 ? D : steps[i - 1].remainder).ordered()[0]).tex() : '0'}}{${Poly.mono(lead[0], lead[1]).tex()}} = \\htmlClass{c-op}{${s.term.tex()}}`}</Tex></div>
              <div className="ld-op"><span className="el-step">multiply</span><Tex>{`${s.term.tex()}(${d.tex()}) = ${s.product.tex()}`}</Tex></div>
              <div className="ld-op"><span className="el-step">subtract</span><Tex>{`(${(i === 0 ? D : steps[i - 1].remainder).tex()}) - (${s.product.tex()}) = \\htmlClass{c-var}{${s.remainder.tex()}}`}</Tex></div>
            </li>
          ))}
        </ol>
      </div>
      <div className="wb-actions">
        {!done ? (
          <button className="btn btn-primary" onClick={() => setShown((n) => n + 1)}>{shown === 0 ? 'Start' : 'Next cycle'} →</button>
        ) : (
          <div className="wb-status done">
            Quotient <Tex>{quotient.tex()}</Tex>, remainder <Tex>{remainder.tex()}</Tex>
            {remainder.isZero() ? '' : <> — so the answer is <Tex>{`${quotient.tex()} + \\dfrac{${remainder.tex()}}{${d.tex()}}`}</Tex></>}.
            {' '}Check: <Tex>{`(${d.tex()})(${quotient.tex()})${remainder.isZero() ? '' : ` + ${remainder.tex()}`} = ${D.tex()}`}</Tex> ✓
          </div>
        )}
        {shown > 0 && <button className="btn btn-ghost" onClick={() => setShown(0)}>↺ Start over</button>}
      </div>
    </div>
  );
}
