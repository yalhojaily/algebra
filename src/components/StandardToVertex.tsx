import { useState } from 'react';
import { quadRoots, quadTex } from '../generators/quad';
import { Plane } from './Plane';
import { Tex } from './MathText';

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(3)));
const p = (n: number) => (n < 0 ? `(${fmt(n)})` : fmt(n));

/** From f(x) = ax² + bx + c to the graph: vertex from −b/2a, intercepts, and the vertex form. */
export default function StandardToVertex() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-4);
  const [c, setC] = useState(1);
  const A = a || 1;
  const h = -b / (2 * A), k = A * h * h + b * h + c;
  const Q = quadRoots(A, b, c);
  const inner = h === 0 ? 'x' : `(x ${h < 0 ? '+' : '-'} ${fmt(Math.abs(h))})`;
  return (
    <div className="sv card">
      <div className="lb-eq"><Tex>{`f(x) = ${quadTex(A, b, c)}`}</Tex></div>
      <div className="px-body">
        <Plane range={8} size={360} curves={[{ coefs: [A, b, c] }]} lines={[{ a: 1, b: 0, c: h, cls: 'faint' }]}
          points={[{ x: h, y: k, cls: 'red', label: `(${fmt(h)}, ${fmt(k)})` }, { x: 0, y: c, cls: 'amber' }, ...Q.real.map((x) => ({ x, y: 0, cls: 'answer' }))].filter((q) => Math.abs(q.y) <= 8 && Math.abs(q.x) <= 8)} />
        <div className="px-side">
          <ol className="ac-steps">
            <li><span className="sr-num">1</span><div><div className="ac-h">x-coordinate of the vertex</div><Tex>{`h = -\\dfrac{b}{2a} = -\\dfrac{${b}}{2${p(A)}} = ${fmt(h)}`}</Tex></div></li>
            <li><span className="sr-num">2</span><div><div className="ac-h">y-coordinate: evaluate f(h)</div><Tex>{`k = f(${fmt(h)}) = ${fmt(k)}`}</Tex></div></li>
            <li><span className="sr-num">3</span><div><div className="ac-h">Vertex form (a is unchanged)</div><Tex>{`f(x) = ${A === 1 ? '' : A === -1 ? '-' : A}${inner}^2${k ? ` ${k < 0 ? '-' : '+'} ${fmt(Math.abs(k))}` : ''}`}</Tex></div></li>
            <li><span className="sr-num">4</span><div><div className="ac-h">Intercepts</div><Tex>{`y\\text{-int } (0, ${c}); \\quad ${Q.real.length ? `x\\text{-int}: ${Q.tex}` : '\\text{no } x\\text{-intercepts}'}`}</Tex></div></li>
          </ol>
          <div className="am-controls">
            <label className="el-slider"><span>a</span><input type="range" min={-3} max={3} value={a} onChange={(e) => setA(Number(e.target.value) || (a > 0 ? -1 : 1))} /><output className="c-var">{A}</output></label>
            <label className="el-slider"><span>b</span><input type="range" min={-8} max={8} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
            <label className="el-slider"><span>c</span><input type="range" min={-8} max={8} value={c} onChange={(e) => setC(Number(e.target.value))} /><output className="c-num">{c}</output></label>
          </div>
        </div>
      </div>
    </div>
  );
}
