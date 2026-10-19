import { useState } from 'react';
import { factorPairs } from '../generators/helpers';
import { Poly } from '../lib/poly';
import { Tex } from './MathText';

const presets: [number, number, number][] = [[6, 11, 3], [8, -2, -15], [3, -10, 8], [10, -9, 2]];
const g = (x: number, y: number): number => (y ? g(y, x % y) : Math.abs(x));

/** The ac-method in four steps: multiply a·c, find the pair, split the middle term, factor by grouping. */
export default function AcMethod() {
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState(0);
  const [a, b, c] = presets[pi];
  const ac = a * c;
  const [m, n] = factorPairs(ac).find(([x, y]) => x + y === b) ?? [0, 0];
  // group 1: a x^2 + m x = g1 x (a/g1 x + m/g1); group 2: n x + c = g2 (n/g2 x + c/g2)
  const g1 = g(a, m) * (a < 0 ? -1 : 1);
  const g2 = g(n, c) * (n < 0 ? -1 : 1);
  const bin = Poly.fromCoefs([a / g1, m / g1]);
  const t = (k: number, s = '') => (k < 0 ? `- ${Math.abs(k) === 1 && s ? '' : Math.abs(k)}${s}` : `+ ${k === 1 && s ? '' : k}${s}`);
  const steps = [
    { h: 'Multiply a · c', body: `a \\cdot c = ${a} \\cdot ${c < 0 ? `(${c})` : c} = ${ac}` },
    { h: `Find two numbers with product ${ac} and sum ${b}`, body: `${m} \\cdot ${n < 0 ? `(${n})` : n} = ${ac}, \\quad ${m} + ${n < 0 ? `(${n})` : n} = ${b}` },
    { h: 'Split the middle term', body: `${a}x^2 ${t(m, 'x')} ${t(n, 'x')} ${t(c)}` },
    { h: 'Factor by grouping', body: `${g1 === 1 ? '' : g1}x(${bin.tex()}) ${g2 < 0 ? '-' : '+'} ${Math.abs(g2) === 1 ? '' : Math.abs(g2)}(${bin.tex()}) = (${bin.tex()})(${Poly.fromCoefs([g1, g2]).tex()})` },
  ];
  return (
    <div className="ac card">
      <div className="pr-tabs">
        {presets.map((x, i) => <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setStep(0); }}><Tex>{Poly.fromCoefs(x).tex()}</Tex></button>)}
      </div>
      <ol className="ac-steps">
        {steps.slice(0, step + 1).map((s, i) => (
          <li key={i}><span className="sr-num">{i + 1}</span><div><div className="ac-h">{s.h}</div><Tex>{s.body}</Tex></div></li>
        ))}
      </ol>
      <div className="wb-actions">
        {step < steps.length - 1 ? <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next step →</button> : <span className="fs-done">Done — check by multiplying back with FOIL.</span>}
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(0)}>↺ Start over</button>}
      </div>
    </div>
  );
}
