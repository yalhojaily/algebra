import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

type Op = '<' | '<=' | '>' | '>=';
const opTex: Record<Op, string> = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' };
const holds = (l: number, op: Op, r: number) => (op === '<' ? l < r : op === '<=' ? l <= r : op === '>' ? l > r : l >= r);
const lin = (m: number, b: number) => `${m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`}${b === 0 ? (m === 0 ? '0' : '') : `${m === 0 ? (b < 0 ? '-' : '') : b < 0 ? ' - ' : ' + '}${Math.abs(b)}`}`;

/** Graph y (op) mx + b: draw the boundary (dashed if strict), test a point, shade its side. Add a second inequality for a system. */
export default function HalfPlane() {
  const [m1, setM1] = useState(1);
  const [b1, setB1] = useState(1);
  const [o1, setO1] = useState<Op>('>=');
  const [two, setTwo] = useState(false);
  const [m2, setM2] = useState(-2);
  const [b2, setB2] = useState(4);
  const [o2, setO2] = useState<Op>('<');
  const [pt, setPt] = useState<[number, number]>([0, 0]);
  const ok1 = holds(pt[1], o1, m1 * pt[0] + b1), ok2 = holds(pt[1], o2, m2 * pt[0] + b2);
  const ok = ok1 && (!two || ok2);
  const OpSel = ({ o, set }: { o: Op; set: (x: Op) => void }) => (
    <div className="ib-toggles">{(['<', '<=', '>', '>='] as Op[]).map((x) => <button key={x} className={`tl-chip ${x === o ? 'on' : ''}`} onClick={() => set(x)}><Tex>{`y ${opTex[x]}`}</Tex></button>)}</div>
  );
  return (
    <div className="hp card">
      <div className="px-body">
        <Plane range={8} size={360} onPick={(x, y) => setPt([x, y])} label="Click to test a point"
          regions={[{ a: -m1, b: 1, c: b1, op: o1 }, ...(two ? [{ a: -m2, b: 1, c: b2, op: o2, cls: 'alt' }] : [])]}
          points={[{ x: pt[0], y: pt[1], cls: ok ? 'answer' : 'red', label: `(${pt[0]}, ${pt[1]})` }]} />
        <div className="px-side">
          <div className="lb-eq"><Tex>{two ? `\\begin{cases} y ${opTex[o1]} ${lin(m1, b1)} \\\\ y ${opTex[o2]} ${lin(m2, b2)} \\end{cases}` : `y ${opTex[o1]} ${lin(m1, b1)}`}</Tex></div>
          <div className={`vlt-count ${ok ? 'ok' : 'bad'}`}>
            Test point <Tex>{`(${pt[0]}, ${pt[1]})`}</Tex>: {ok ? 'a solution ✓' : 'not a solution ✗'}
            {two && <span> ({ok1 ? '✓' : '✗'} first, {ok2 ? '✓' : '✗'} second)</span>}
          </div>
          <fieldset><legend>Inequality 1</legend><OpSel o={o1} set={setO1} />
            <label className="el-slider"><span>slope</span><input type="range" min={-3} max={3} value={m1} onChange={(e) => setM1(Number(e.target.value))} /><output className="c-var">{m1}</output></label>
            <label className="el-slider"><span>intercept</span><input type="range" min={-5} max={5} value={b1} onChange={(e) => setB1(Number(e.target.value))} /><output className="c-var">{b1}</output></label>
          </fieldset>
          <button className="btn btn-ghost" onClick={() => setTwo(!two)}>{two ? '− Remove second inequality' : '+ Add a second inequality (system)'}</button>
          {two && (
            <fieldset><legend>Inequality 2</legend><OpSel o={o2} set={setO2} />
              <label className="el-slider"><span>slope</span><input type="range" min={-3} max={3} value={m2} onChange={(e) => setM2(Number(e.target.value))} /><output className="c-op">{m2}</output></label>
              <label className="el-slider"><span>intercept</span><input type="range" min={-5} max={5} value={b2} onChange={(e) => setB2(Number(e.target.value))} /><output className="c-op">{b2}</output></label>
            </fieldset>
          )}
          <p className="lb-note">Click anywhere to test a point. Solid line: included (≤, ≥). Dashed: not included (&lt;, &gt;). {two && 'The solution set of the system is where the two shadings overlap.'}</p>
        </div>
      </div>
    </div>
  );
}
