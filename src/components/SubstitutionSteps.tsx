import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Tex } from './MathText';

// [a, b, c, d, e, f]: a x + b y = c, d x + e y = f — each has a coefficient of ±1 somewhere.
const presets: number[][] = [
  [1, 2, 8, 3, -1, 3],
  [2, 1, 1, 3, 4, 14],
  [4, -3, 5, -1, 2, 0],
  [1, -1, 3, 2, 3, 1],
];

const t = (c: number | Frac, v: string, first = false) => {
  const f = c instanceof Frac ? c : new Frac(c);
  if (f.isZero()) return '';
  const abs = f.valueOf() < 0 ? f.neg() : f;
  const body = v ? `${abs.eq(1) ? '' : abs.tex()}${v}` : abs.tex();
  if (first) return f.valueOf() < 0 ? `-${body}` : body;
  return f.valueOf() < 0 ? ` - ${body}` : ` + ${body}`;
};
const side = (cs: (number | Frac)[], vs: string[]) => {
  let out = '';
  cs.forEach((c, i) => { const piece = t(c, vs[i], !out); out += piece; });
  return out || '0';
};

/** Substitution step by step: isolate a variable, substitute, solve, substitute back, check. */
export default function SubstitutionSteps() {
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState(0);
  const [a, b, c, d, e, f] = presets[pi];
  // find an equation and variable with coefficient ±1
  const opts = [
    { row: 0, v: 'x', k: a }, { row: 0, v: 'y', k: b }, { row: 1, v: 'x', k: d }, { row: 1, v: 'y', k: e },
  ];
  const iso = opts.find((o) => Math.abs(o.k) === 1)!;
  const [p, q, r] = iso.row === 0 ? [a, b, c] : [d, e, f]; // p x + q y = r
  const [P, Q, R] = iso.row === 0 ? [d, e, f] : [a, b, c];
  const other = iso.v === 'x' ? 'y' : 'x';
  // isolate: x = (r − q y)/p  or  y = (r − p x)/q
  const [kv, ko] = iso.v === 'x' ? [p, q] : [q, p];
  const cst = new Frac(r, kv), slope = new Frac(-ko, kv); // iso.v = cst + slope·other
  const isoTex = `${iso.v} = ${side([slope, cst], [other, ''])}`;
  // substitute into P x + Q y = R
  const [cv, co] = iso.v === 'x' ? [P, Q] : [Q, P]; // coefficient of the isolated var, of the other
  const subTex = `${cv === 1 ? '' : cv === -1 ? '-' : cv}(${side([slope, cst], [other, ''])})${t(co, other)} = ${R}`;
  const lin = slope.mul(cv).add(co), rhs = new Frac(R).sub(cst.mul(cv));
  const otherVal = rhs.div(lin);
  const isoVal = cst.add(slope.mul(otherVal));
  const [X, Y] = iso.v === 'x' ? [isoVal, otherVal] : [otherVal, isoVal];
  const steps = [
    { h: 'The system', body: `\\begin{cases} ${side([a, b], ['x', 'y'])} = ${c} \\\\ ${side([d, e], ['x', 'y'])} = ${f} \\end{cases}` },
    { h: `Solve equation ${iso.row + 1} for ${iso.v} (its coefficient is ${kv})`, body: isoTex },
    { h: `Substitute into equation ${2 - iso.row}`, body: subTex },
    { h: `Solve for ${other}`, body: `${side([lin], [other])} = ${rhs.tex()} \\;\\Rightarrow\\; ${other} = ${otherVal.tex()}` },
    { h: `Substitute back to find ${iso.v}`, body: `${iso.v} = ${side([slope], [`(${otherVal.tex()})`])}${t(cst, '')} = ${isoVal.tex()}` },
    { h: 'Check in both equations', body: `\\begin{aligned} & ${a}(${X.tex()}) + ${b < 0 ? `(${b})` : b}(${Y.tex()}) = ${c} \\checkmark \\\\ & ${d}(${X.tex()}) + ${e < 0 ? `(${e})` : e}(${Y.tex()}) = ${f} \\checkmark \\\\ & \\text{Solution: } (${X.tex()}, ${Y.tex()}) \\end{aligned}` },
  ];
  return (
    <div className="ac card">
      <div className="pr-tabs">{presets.map((_, i) => <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setStep(0); }}>System {i + 1}</button>)}</div>
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
