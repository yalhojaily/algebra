import { useState } from 'react';
import { Tex } from './MathText';

/** A stepper over hand-written worked examples (TeX), used for combining radicals and rationalizing denominators. */
interface Example { title: string; steps: { h: string; body: string }[] }

const sets: Record<string, Example[]> = {
  combine: [
    { title: '√8 + 3√2 − √18', steps: [
      { h: 'Simplify each radical', body: '\\sqrt{8} = 2\\sqrt{2},\\quad \\sqrt{18} = 3\\sqrt{2}' },
      { h: 'Rewrite', body: '2\\sqrt{2} + 3\\sqrt{2} - 3\\sqrt{2}' },
      { h: 'Combine like radicals (same radicand)', body: '(2 + 3 - 3)\\sqrt{2} = 2\\sqrt{2}' },
    ] },
    { title: '√12 + √27 + √5', steps: [
      { h: 'Simplify each radical', body: '\\sqrt{12} = 2\\sqrt{3},\\quad \\sqrt{27} = 3\\sqrt{3},\\quad \\sqrt{5}\\text{ is already simplified}' },
      { h: 'Combine the like radicals only', body: '2\\sqrt{3} + 3\\sqrt{3} + \\sqrt{5} = 5\\sqrt{3} + \\sqrt{5}' },
      { h: 'Unlike radicals stay separate', body: '5\\sqrt{3} + \\sqrt{5} \\ne 6\\sqrt{8}' },
    ] },
    { title: '(√3 + 2)(√3 − 5)', steps: [
      { h: 'FOIL', body: '\\sqrt{3}\\cdot\\sqrt{3} - 5\\sqrt{3} + 2\\sqrt{3} - 10' },
      { h: '√3 · √3 = 3', body: '3 - 5\\sqrt{3} + 2\\sqrt{3} - 10' },
      { h: 'Combine', body: '-7 - 3\\sqrt{3}' },
    ] },
  ],
  rationalize: [
    { title: '3/√5', steps: [
      { h: 'Multiply by √5/√5 (that is 1)', body: '\\dfrac{3}{\\sqrt{5}}\\cdot\\dfrac{\\sqrt{5}}{\\sqrt{5}}' },
      { h: '√5 · √5 = 5', body: '= \\dfrac{3\\sqrt{5}}{5}' },
    ] },
    { title: '√(2/3)', steps: [
      { h: 'Split the root', body: '\\sqrt{\\dfrac{2}{3}} = \\dfrac{\\sqrt{2}}{\\sqrt{3}}' },
      { h: 'Multiply by √3/√3', body: '= \\dfrac{\\sqrt{2}\\cdot\\sqrt{3}}{3} = \\dfrac{\\sqrt{6}}{3}' },
    ] },
    { title: '4/(√3 + 1)', steps: [
      { h: 'Multiply by the conjugate √3 − 1', body: '\\dfrac{4}{\\sqrt{3} + 1}\\cdot\\dfrac{\\sqrt{3} - 1}{\\sqrt{3} - 1}' },
      { h: 'The denominator is a difference of squares', body: '(\\sqrt{3} + 1)(\\sqrt{3} - 1) = 3 - 1 = 2' },
      { h: 'Simplify', body: '= \\dfrac{4(\\sqrt{3} - 1)}{2} = 2\\sqrt{3} - 2' },
    ] },
  ],
};

export default function RadicalSteps({ set = 'combine' }: { set?: 'combine' | 'rationalize' }) {
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState(0);
  const ex = sets[set][pi];
  return (
    <div className="ac card">
      <div className="pr-tabs">{sets[set].map((e, i) => <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setStep(0); }}>{e.title}</button>)}</div>
      <ol className="ac-steps">
        {ex.steps.slice(0, step + 1).map((s, i) => (
          <li key={`${pi}-${i}`}><span className="sr-num">{i + 1}</span><div><div className="ac-h">{s.h}</div><Tex>{`\\displaystyle ${s.body}`}</Tex></div></li>
        ))}
      </ol>
      <div className="wb-actions">
        {step < ex.steps.length - 1 ? <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next step →</button> : <span className="fs-done">Done.</span>}
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(0)}>↺ Start over</button>}
      </div>
    </div>
  );
}
