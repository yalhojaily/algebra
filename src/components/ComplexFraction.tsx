import { useMemo, useState } from 'react';
import { parse, topTerms } from '../lib/expr';
import { fracTexOf as toTex, factored, factoredTex, lcdOf, product, ratFromNode, ratTex, simplify } from '../lib/rational';
import { Tex } from './MathText';

const presets: [string, string][] = [
  ['1 + 1/x', '1 - 1/x^2'],
  ['3/x + 2', '4 - 1/x'],
  ['1 - 9/x^2', '1 + 3/x'],
  ['1/2 + 1/3', '5/6 - 1/4'],
];

/** A fraction with fractions inside it, simplified by multiplying the top and bottom by the LCD of all the little denominators. */
export default function ComplexFraction() {
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState(0);
  const [top, bot] = presets[pi];
  const d = useMemo(() => {
    const T = parse(top), B = parse(bot);
    const dens = [...topTerms(T), ...topTerms(B)].map((t) => factored(ratFromNode(t).den));
    const L = lcdOf(...dens);
    const Lp = product(L);
    const rt = ratFromNode(T), rb = ratFromNode(B);
    const tc = simplify(rt.num.mul(Lp), rt.den);
    const bc = simplify(rb.num.mul(Lp), rb.den);
    const TP = product(tc.num), BP = product(bc.num);
    const s = simplify(TP, BP);
    const lcdTex = factoredTex(L);
    const lt = Lp.size > 1 ? `(${lcdTex})` : lcdTex;
    return {
      start: `\\frac{${toTex(T)}}{${toTex(B)}}`,
      lcd: lcdTex,
      mult: `\\frac{\\left(${toTex(T)}\\right) \\cdot \\htmlClass{c-op}{${lt}}}{\\left(${toTex(B)}\\right) \\cdot \\htmlClass{c-op}{${lt}}}`,
      cleared: `\\frac{${TP.tex()}}{${BP.tex()}}`,
      cancel: `\\frac{${factoredTex(factored(TP), { highlight: s.common, strike: true })}}{${factoredTex(factored(BP), { highlight: s.common, strike: true })}}`,
      result: ratTex(s),
      numeric: Lp.variables().length === 0 && TP.variables().length === 0 && BP.variables().length === 0,
    };
  }, [pi]);
  const steps = [
    { h: 'A fraction with fractions inside', body: d.start },
    { h: 'Find the LCD of all the little denominators', body: `\\text{LCD} = ${d.lcd}` },
    { h: 'Multiply the top and the bottom by the LCD', body: d.mult },
    { h: 'Distribute — every little fraction clears', body: `= ${d.cleared}` },
    { h: 'Factor and simplify', body: d.numeric ? `= ${d.result}` : `= ${d.cancel} = ${d.result}` },
  ];
  return (
    <div className="ac card">
      <div className="pr-tabs">
        {presets.map((p, i) => (
          <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setStep(0); }}>
            <Tex>{`\\frac{${toTex(parse(p[0]))}}{${toTex(parse(p[1]))}}`}</Tex>
          </button>
        ))}
      </div>
      <ol className="ac-steps">
        {steps.slice(0, step + 1).map((s, i) => (
          <li key={`${pi}-${i}`}><span className="sr-num">{i + 1}</span><div><div className="ac-h">{s.h}</div><Tex>{`\\displaystyle ${s.body}`}</Tex></div></li>
        ))}
      </ol>
      <div className="wb-actions">
        {step < steps.length - 1 ? <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next step →</button> : <span className="fs-done">Done.</span>}
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(0)}>↺ Start over</button>}
      </div>
    </div>
  );
}
