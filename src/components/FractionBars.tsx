import { useState } from 'react';
import { Tex } from './MathText';

type Op = '+' | '−' | '×';
const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
const l = (a: number, b: number) => (a * b) / g(a, b);
const frac = (n: number, d: number) => {
  const k = g(n, d) || 1;
  const N = n / k, D = d / k;
  return D === 1 ? String(N) : `${N < 0 ? '-' : ''}\\tfrac{${Math.abs(N)}}{${D}}`;
};

/** A fraction bar split into `d` pieces with `n` shaded (n may exceed d: extra bars are drawn). */
function Bar({ n, d, cls, label }: { n: number; d: number; cls: string; label: string }) {
  const bars = Math.max(1, Math.ceil(Math.abs(n) / d));
  return (
    <div className="fb-row">
      <span className="fb-lab"><Tex>{label}</Tex></span>
      <div className="fb-bars">
        {Array.from({ length: bars }, (_, b) => (
          <div key={b} className="fb-bar">
            {Array.from({ length: d }, (_, i) => <span key={i} className={`fb-cell ${b * d + i < Math.abs(n) ? cls : ''}`} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Add, subtract or multiply two fractions with bars (and an area model for ×). Different denominators are cut into LCD pieces. */
export default function FractionBars() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [c, setC] = useState(1);
  const [d, setD] = useState(4);
  const [op, setOp] = useState<Op>('+');
  const L = l(b, d);
  const A = a * (L / b), C = c * (L / d);
  const sumN = op === '+' ? A + C : A - C;
  const prodN = a * c, prodD = b * d;
  return (
    <div className="fb card">
      <div className="pr-tabs">
        {(['+', '−', '×'] as Op[]).map((o) => <button key={o} className={`pr-tab ${o === op ? 'on' : ''}`} onClick={() => setOp(o)}>{o === '+' ? 'Add' : o === '−' ? 'Subtract' : 'Multiply'}</button>)}
      </div>
      <div className="lb-eq"><Tex>{`\\dfrac{${a}}{${b}} ${op === '−' ? '-' : op === '×' ? '\\times' : '+'} \\dfrac{${c}}{${d}} = ${op === '×' ? frac(prodN, prodD) : frac(sumN, L)}`}</Tex></div>
      {op !== '×' ? (
        <>
          <Bar n={a} d={b} cls="a" label={`\\tfrac{${a}}{${b}}`} />
          <Bar n={c} d={d} cls="b" label={`\\tfrac{${c}}{${d}}`} />
          <p className="lb-note">{b === d ? 'Same-size pieces: just count them.' : <>The pieces are different sizes, so cut both into <strong>{L}ths</strong> (the LCD of {b} and {d}):</>}</p>
          {b !== d && <>
            <Bar n={A} d={L} cls="a" label={`\\tfrac{${A}}{${L}}`} />
            <Bar n={C} d={L} cls="b" label={`\\tfrac{${C}}{${L}}`} />
          </>}
          <Bar n={Math.max(0, sumN)} d={L} cls="c" label={`\\tfrac{${sumN}}{${L}}`} />
          <div className="pb-row el-result"><Tex>{`\\dfrac{${A}}{${L}} ${op === '+' ? '+' : '-'} \\dfrac{${C}}{${L}} = \\dfrac{${sumN}}{${L}}${g(sumN, L) > 1 ? ` = ${frac(sumN, L)}` : ''}`}</Tex></div>
          {sumN < 0 && <p className="lb-note">The result is negative: there is more taken away than there was.</p>}
        </>
      ) : (
        <div className="px-body">
          <svg viewBox="0 0 260 260" className="am-svg fb-area" role="img" aria-label="Area model for multiplying fractions">
            {Array.from({ length: b }, (_, i) => Array.from({ length: d }, (_, j) => {
              const inA = i < a, inC = j < c;
              return <rect key={`${i}-${j}`} x={10 + (j * 240) / d} y={10 + (i * 240) / b} width={240 / d} height={240 / b} className={`fb-cellr ${inA && inC ? 'both' : inA ? 'a' : inC ? 'b' : ''}`} />;
            }))}
          </svg>
          <div className="px-side">
            <p className="lb-note">The square is 1 whole. Rows show <Tex>{`\\tfrac{${a}}{${b}}`}</Tex> (blue), columns show <Tex>{`\\tfrac{${c}}{${d}}`}</Tex> (red). The overlap is <Tex>{`\\tfrac{${a}}{${b}}`}</Tex> <em>of</em> <Tex>{`\\tfrac{${c}}{${d}}`}</Tex>: <strong>{prodN}</strong> of the <strong>{prodD}</strong> small boxes.</p>
            <div className="pb-row el-result"><Tex>{`\\dfrac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = \\dfrac{${prodN}}{${prodD}}${g(prodN, prodD) > 1 ? ` = ${frac(prodN, prodD)}` : ''}`}</Tex></div>
            <p className="lb-note">Multiplying needs <strong>no</strong> common denominator: top × top, bottom × bottom.</p>
          </div>
        </div>
      )}
      <div className="am-controls">
        <label className="el-slider"><span>first numerator</span><input type="range" min={1} max={op === '×' ? b : 2 * b} value={Math.min(a, op === '×' ? b : 2 * b)} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>first denominator</span><input type="range" min={2} max={10} value={b} onChange={(e) => { const v = Number(e.target.value); setB(v); setA((x) => Math.min(x, op === '×' ? v : 2 * v)); }} /><output className="c-var">{b}</output></label>
        <label className="el-slider"><span>second numerator</span><input type="range" min={1} max={op === '×' ? d : 2 * d} value={Math.min(c, op === '×' ? d : 2 * d)} onChange={(e) => setC(Number(e.target.value))} /><output className="c-op">{c}</output></label>
        <label className="el-slider"><span>second denominator</span><input type="range" min={2} max={10} value={d} onChange={(e) => { const v = Number(e.target.value); setD(v); setC((x) => Math.min(x, op === '×' ? v : 2 * v)); }} /><output className="c-op">{d}</output></label>
      </div>
    </div>
  );
}
