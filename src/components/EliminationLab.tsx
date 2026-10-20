import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Tex } from './MathText';

const presets: number[][] = [
  [2, 3, 7, 5, -3, 7], // 2x + 3y = 7, 5x − 3y = 7
  [3, 2, 4, 1, -4, 6],
  [4, 3, 5, 3, 5, 12],
  [2, -5, 1, 3, 2, -8],
];

const term = (c: number, v: string, first: boolean) => {
  if (c === 0) return '';
  const a = Math.abs(c);
  const body = `${a === 1 ? '' : a}${v}`;
  if (first) return c < 0 ? `-${body}` : body;
  return c < 0 ? ` - ${body}` : ` + ${body}`;
};
const eqTex = (a: number, b: number, c: number) => {
  const left = `${term(a, 'x', true)}${term(b, 'y', a === 0)}` || '0';
  return `${left} = ${c}`;
};

/** Choose what to multiply each equation by; when a variable's coefficients become opposites, adding eliminates it. */
export default function EliminationLab() {
  const [pi, setPi] = useState(0);
  const [k1, setK1] = useState(1);
  const [k2, setK2] = useState(1);
  const [a, b, c, d, e, f] = presets[pi];
  const A = k1 * a + k2 * d, B = k1 * b + k2 * e, C = k1 * c + k2 * f;
  const gone = A === 0 ? 'x' : B === 0 ? 'y' : null;
  // full solution by Cramer's rule, shown once a variable is eliminated
  const det = a * e - b * d;
  const X = new Frac(c * e - b * f, det), Y = new Frac(a * f - c * d, det);
  return (
    <div className="el card">
      <div className="pr-tabs">{presets.map((p, i) => <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setK1(1); setK2(1); }}>System {i + 1}</button>)}</div>
      <div className="elim-grid">
        <div className="elim-k"><Tex>{`\\times ${k1 < 0 ? `(${k1})` : k1}`}</Tex></div>
        <div className="elim-eq"><Tex>{eqTex(a, b, c)}</Tex></div>
        <div className="elim-arrow">→</div>
        <div className="elim-eq"><Tex>{eqTex(k1 * a, k1 * b, k1 * c)}</Tex></div>
        <div className="elim-k"><Tex>{`\\times ${k2 < 0 ? `(${k2})` : k2}`}</Tex></div>
        <div className="elim-eq"><Tex>{eqTex(d, e, f)}</Tex></div>
        <div className="elim-arrow">→</div>
        <div className="elim-eq"><Tex>{eqTex(k2 * d, k2 * e, k2 * f)}</Tex></div>
        <div /><div /><div className="elim-arrow">add</div>
        <div className={`elim-eq elim-sum ${gone ? 'hit' : ''}`}><Tex>{eqTex(A, B, C)}</Tex></div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>multiply equation 1 by</span><input type="range" min={-5} max={5} value={k1} onChange={(ev) => setK1(Number(ev.target.value) || (k1 > 0 ? -1 : 1))} /><output className="c-var">{k1}</output></label>
        <label className="el-slider"><span>multiply equation 2 by</span><input type="range" min={-5} max={5} value={k2} onChange={(ev) => setK2(Number(ev.target.value) || (k2 > 0 ? -1 : 1))} /><output className="c-op">{k2}</output></label>
      </div>
      <p className={`vlt-count ${gone ? 'ok' : 'bad'}`}>
        {gone
          ? <>The <strong>{gone}</strong>-terms cancelled! Solve the sum, then substitute back: <Tex>{`x = ${X.tex()},\\ y = ${Y.tex()}`}</Tex></>
          : <>Neither variable cancels yet. Choose multipliers that make the x-coefficients (or the y-coefficients) <strong>opposites</strong>.</>}
      </p>
    </div>
  );
}
