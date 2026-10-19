import { useState } from 'react';
import { Frac } from '../lib/frac';
import { Plane } from './Plane';
import { Tex } from './MathText';

const fmt = (f: Frac) => f.tex();

/** Ax + By = C: find the intercepts by "covering up" one term, and see horizontal and vertical lines when A or B is 0. */
export default function InterceptsExplorer() {
  const [A, setA] = useState(2);
  const [B, setB] = useState(3);
  const [C, setC] = useState(6);
  const term = (k: number, v: string, first: boolean) => {
    if (k === 0) return '';
    const s = Math.abs(k) === 1 ? v : `${Math.abs(k)}${v}`;
    return first ? `${k < 0 ? '-' : ''}${s}` : ` ${k < 0 ? '-' : '+'} ${s}`;
  };
  const lhs = `${term(A, 'x', true)}${term(B, 'y', A === 0)}` || '0';
  const xi = A !== 0 ? new Frac(C, A) : null;
  const yi = B !== 0 ? new Frac(C, B) : null;
  const degenerate = A === 0 && B === 0;

  return (
    <div className="ix card">
      <div className="lb-eq"><Tex>{`${lhs} = ${C}`}</Tex></div>
      <div className="px-body">
        <Plane
          size={400}
          lines={degenerate ? [] : [{ a: A, b: B, c: C }]}
          points={[
            ...(xi && Math.abs(xi.valueOf()) <= 10 ? [{ x: xi.valueOf(), y: 0, cls: 'red', label: `(${+xi.valueOf().toFixed(2)}, 0)` }] : []),
            ...(yi && Math.abs(yi.valueOf()) <= 10 ? [{ x: 0, y: yi.valueOf(), cls: 'amber', label: `(0, ${+yi.valueOf().toFixed(2)})` }] : []),
          ]}
        />
        <div className="px-side">
          {degenerate ? (
            <p>With both coefficients 0 this isn't a line at all. Make <Tex>A</Tex> or <Tex>B</Tex> non-zero.</p>
          ) : (
            <>
              <div className="ix-card red">
                <div className="ix-h">x-intercept · cover up the y-term (y = 0)</div>
                {xi ? <Tex>{`${A}x = ${C} \\;\\Rightarrow\\; x = ${fmt(xi)}`}</Tex> : <span>None — the line is horizontal and never meets the x-axis{C === 0 ? ' (it is the x-axis itself!)' : ''}.</span>}
              </div>
              <div className="ix-card amber">
                <div className="ix-h">y-intercept · cover up the x-term (x = 0)</div>
                {yi ? <Tex>{`${B}y = ${C} \\;\\Rightarrow\\; y = ${fmt(yi)}`}</Tex> : <span>None — the line is vertical and never meets the y-axis{C === 0 ? ' (it is the y-axis itself!)' : ''}.</span>}
              </div>
              {A === 0 && <p className="ix-note">With no x-term, <Tex>{`y = ${fmt(new Frac(C, B))}`}</Tex> for every x: a <strong>horizontal</strong> line.</p>}
              {B === 0 && <p className="ix-note">With no y-term, <Tex>{`x = ${fmt(new Frac(C, A))}`}</Tex> for every y: a <strong>vertical</strong> line.</p>}
              {A !== 0 && B !== 0 && C === 0 && <p className="ix-note">Both intercepts are the origin. You need one more point to draw the line.</p>}
            </>
          )}
        </div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>A (x-coefficient)</span><input type="range" min={-5} max={5} value={A} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{A}</output></label>
        <label className="el-slider"><span>B (y-coefficient)</span><input type="range" min={-5} max={5} value={B} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{B}</output></label>
        <label className="el-slider"><span>C</span><input type="range" min={-12} max={12} value={C} onChange={(e) => setC(Number(e.target.value))} /><output className="c-num">{C}</output></label>
      </div>
    </div>
  );
}
