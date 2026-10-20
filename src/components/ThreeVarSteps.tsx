import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Tex } from './MathText';

interface Preset { M: number[][]; rhs: number[]; vars?: string[]; title?: string }

const defaults: Preset[] = [
  { M: [[1, 1, 1], [2, -1, 1], [1, 2, -1]], rhs: [6, 3, 2] },
  { M: [[2, 1, -1], [1, -1, 2], [3, 2, 1]], rhs: [1, 4, 7] },
  { M: [[1, -2, 3], [2, 1, -1], [-1, 3, 2]], rhs: [9, -1, 0] },
];

const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
const comb = (cs: number[], vs: string[], r: number | string) => {
  let out = '';
  cs.forEach((c, i) => {
    if (!c) return;
    const a = Math.abs(c);
    const body = `${a === 1 ? '' : a}${vs[i]}`;
    out += out ? (c < 0 ? ` - ${body}` : ` + ${body}`) : c < 0 ? `-${body}` : body;
  });
  return `${out || '0'} = ${r}`;
};

/** Eliminate one variable twice to get a 2 × 2 system, solve it, then back-substitute. */
export default function ThreeVarSteps({ presets = defaults }: { presets?: Preset[] }) {
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState(0);
  const { M, rhs, vars = ['x', 'y', 'z'] } = presets[pi];
  const [u, v, w] = vars;
  // pivot row: smallest nonzero |z-coefficient|
  const order = [0, 1, 2].filter((i) => M[i][2] !== 0).sort((i, j) => Math.abs(M[i][2]) - Math.abs(M[j][2]));
  const p = order[0];
  const others = [0, 1, 2].filter((i) => i !== p);
  const elim = others.map((r) => {
    if (M[r][2] === 0) return { r, kp: 0, kr: 1, row: [M[r][0], M[r][1]], rhs: rhs[r] };
    const L = Math.abs(M[p][2] * M[r][2]) / g(M[p][2], M[r][2]);
    const kp = L / M[p][2], kr = -L / M[r][2];
    return { r, kp, kr, row: [kp * M[p][0] + kr * M[r][0], kp * M[p][1] + kr * M[r][1]], rhs: kp * rhs[p] + kr * rhs[r] };
  });
  const [E1, E2] = elim;
  const det = E1.row[0] * E2.row[1] - E1.row[1] * E2.row[0];
  const X = new Frac(E1.rhs * E2.row[1] - E1.row[1] * E2.rhs, det);
  const Y = new Frac(E1.row[0] * E2.rhs - E1.rhs * E2.row[0], det);
  const Z = new Frac(rhs[p]).sub(X.mul(M[p][0])).sub(Y.mul(M[p][1])).div(M[p][2]);
  const k = (n: number) => (n < 0 ? `(${n})` : `${n}`);
  /** coefficient times something, with its sign: "+ 3(2)", "- z" */
  const cf = (n: number, what: string, first = false) => {
    if (n === 0) return '';
    const a = Math.abs(n);
    const body = `${a === 1 ? '' : a}${what}`;
    return first ? (n < 0 ? `-${body}` : body) : n < 0 ? ` - ${body}` : ` + ${body}`;
  };
  const steps = [
    { h: 'Number the equations', body: `\\begin{aligned} ${M.map((row, i) => `(${i + 1})\\quad & ${comb(row, vars, rhs[i])}`).join(' \\\\ ')} \\end{aligned}` },
    ...elim.map((e2, i) => ({
      h: e2.kp === 0 ? `Equation (${e2.r + 1}) already has no ${w}` : `Eliminate ${w} using (${p + 1}) and (${e2.r + 1})`,
      body: e2.kp === 0 ? `(${e2.r + 1}) \\text{ has no } ${w}: \\quad ${comb(e2.row, [u, v], e2.rhs)} \\quad (${4 + i})` : `${k(e2.kp)} \\times (${p + 1}) + ${k(e2.kr)} \\times (${e2.r + 1}): \\quad ${comb(e2.row, [u, v], e2.rhs)} \\quad (${4 + i})`,
    })),
    { h: `Solve the 2 × 2 system (4), (5)`, body: `\\begin{cases} ${comb(E1.row, [u, v], E1.rhs)} \\\\ ${comb(E2.row, [u, v], E2.rhs)} \\end{cases} \\;\\Rightarrow\\; ${u} = ${X.tex()},\\ ${v} = ${Y.tex()}` },
    { h: `Back-substitute into (${p + 1}) to find ${w}`, body: `${cf(M[p][0], `(${X.tex()})`, true)}${cf(M[p][1], `(${Y.tex()})`)}${cf(M[p][2], w)} = ${rhs[p]} \\;\\Rightarrow\\; ${w} = ${Z.tex()}` },
    { h: 'Solution', body: `(${u}, ${v}, ${w}) = (${X.tex()},\\ ${Y.tex()},\\ ${Z.tex()})` },
  ];
  return (
    <div className="ac card">
      <div className="pr-tabs">{presets.map((pr, i) => <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setStep(0); }}>{pr.title ?? `System ${i + 1}`}</button>)}</div>
      <ol className="ac-steps">
        {steps.slice(0, step + 1).map((s, i) => (
          <li key={`${pi}-${i}`}><span className="sr-num">{i + 1}</span><div><div className="ac-h">{s.h}</div><Tex>{`\\displaystyle ${s.body}`}</Tex></div></li>
        ))}
      </ol>
      <div className="wb-actions">
        {step < steps.length - 1 ? <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next step →</button> : <span className="fs-done">Done — check it in all three equations.</span>}
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(0)}>↺ Start over</button>}
      </div>
    </div>
  );
}
