import { useMemo, useState } from 'react';
import { parse } from '../lib/expr';
import { Poly } from '../lib/poly';
import { fracTexOf, factored, factoredTex, lcdOf, missingFactors as missing, product, ratTex, simplify, type Factored } from '../lib/rational';
import { Tex } from './MathText';

type Op = '+' | '-';
const presets: Record<Op, [string, string, string, string][]> = {
  '+': [['3', 'x + 2', '5', 'x - 1'], ['x', 'x^2 - 9', '2', 'x + 3'], ['4', 'x^2 + 2x', '1', 'x^2 - 4'], ['x + 1', 'x - 3', '2', '3 - x']],
  '-': [['5', 'x - 2', '3', 'x + 4'], ['x + 4', 'x^2 - 1', '1', 'x - 1'], ['2x', 'x^2 - 4x', '8', 'x^2 - 16'], ['x', 'x - 5', '5', '5 - x']],
};

const wrap = (t: string, P: Poly) => (P.size > 1 ? `(${t})` : t);

/** Adding or subtracting rational expressions, one step at a time: factor, find the LCD, rewrite, combine, simplify. */
export default function AddRational({ op = '+' }: { op?: Op }) {
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState(0);
  const [n1s, d1s, n2s, d2s] = presets[op][pi];
  const data = useMemo(() => {
    const [n1raw, d1, n2, d2] = [n1s, d1s, n2s, d2s].map((s) => Poly.parse(s));
    let n1 = n1raw;
    let f1 = factored(d1), f2 = factored(d2);
    const N2 = n2;
    let opEff: Op = op;
    // Opposite denominators: rewrite b/(a − x) as −b/(x − a), flipping the operation.
    if (f2.c < 0) {
      f2 = { c: -f2.c, factors: f2.factors };
      opEff = op === '+' ? '-' : '+';
    }
    if (f1.c < 0) {
      f1 = { c: -f1.c, factors: f1.factors };
      n1 = n1.neg();
    }
    const L = lcdOf(f1, f2);
    const m1 = missing(f1, L), m2 = missing(f2, L);
    const M1 = product(m1), M2 = product(m2);
    const top1 = n1.mul(M1), top2 = N2.mul(M2);
    const N = opEff === '+' ? top1.add(top2) : top1.sub(top2);
    const D = product(L);
    const s = simplify(N, D);
    const ft = (f: Factored) => factoredTex(f);
    const mulTex = (n: Poly, m: Factored, M: Poly) => (M.equals(Poly.const(1)) ? n.tex() : `${wrap(n.tex(), n)} \\cdot ${wrap(ft(m), M)}`);
    return {
      start: fracTexOf(parse(`(${n1s})/(${d1s}) ${op} (${n2s})/(${d2s})`)),
      opEff,
      factorStep: `\\frac{${n1.tex()}}{${ft(f1)}} ${opEff} \\frac{${N2.tex()}}{${ft(f2)}}`,
      flipped: opEff !== op,
      lcd: ft(L),
      m1: M1.equals(Poly.const(1)) ? '1' : ft(m1),
      m2: M2.equals(Poly.const(1)) ? '1' : ft(m2),
      rewrite: `\\frac{${mulTex(n1, m1, M1)}}{${ft(L)}} ${opEff} \\frac{${mulTex(N2, m2, M2)}}{${ft(L)}}`,
      combine: `\\frac{${top1.tex()} ${opEff} ${opEff === '-' ? `\\htmlClass{c-op}{(${top2.tex()})}` : wrap(top2.tex(), top2)}}{${ft(L)}} = \\frac{${N.tex()}}{${ft(L)}}`,
      result: ratTex(s),
      cancelled: s.common.length > 0 || s.g > 1,
      numFactored: factoredTex(factored(N)),
    };
  }, [pi, op]);

  const steps = [
    { h: 'Start', body: data.start },
    { h: data.flipped ? 'Factor the denominators (the opposite denominator flips the sign)' : 'Factor the denominators', body: data.factorStep },
    { h: 'Find the LCD', body: `\\text{LCD} = ${data.lcd}` },
    { h: 'Rewrite each fraction with the LCD (multiply top and bottom by the missing factors)', body: data.rewrite },
    { h: data.opEff === '-' ? 'Combine the numerators — subtract the whole second numerator' : 'Combine the numerators', body: data.combine },
    { h: data.cancelled ? 'Factor the numerator and cancel' : 'Check: does anything cancel? No', body: `= ${data.cancelled ? `\\frac{${data.numFactored}}{${data.lcd}} = ` : ''}${data.result}` },
  ];

  return (
    <div className="ac card">
      <div className="pr-tabs">
        {presets[op].map((p, i) => (
          <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setStep(0); }}>
            <Tex>{fracTexOf(parse(`(${p[0]})/(${p[1]}) ${op} (${p[2]})/(${p[3]})`))}</Tex>
          </button>
        ))}
      </div>
      <ol className="ac-steps">
        {steps.slice(0, step + 1).map((s, i) => (
          <li key={`${pi}-${i}`}>
            <span className="sr-num">{i + 1}</span>
            <div><div className="ac-h">{s.h}</div><Tex>{`\\displaystyle ${s.body}`}</Tex></div>
          </li>
        ))}
      </ol>
      <div className="wb-actions">
        {step < steps.length - 1 ? <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next step →</button> : <span className="fs-done">Done.</span>}
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(0)}>↺ Start over</button>}
      </div>
    </div>
  );
}
