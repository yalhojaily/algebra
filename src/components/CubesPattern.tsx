import { useState } from 'react';
import { Poly } from '../lib/poly';
import { Tex } from './MathText';

/** A³ ± B³: fill in A and B and watch the pattern — Same sign, Opposite sign, Always Positive. */
export default function CubesPattern() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [plus, setPlus] = useState(false);
  const A = Poly.mono(a, { x: 1 });
  const s = plus ? '+' : '-';
  const o = plus ? '-' : '+';
  const P = A.mul(A).mul(A).add(Poly.const(plus ? b ** 3 : -(b ** 3)));
  const lin = A.add(Poly.const(plus ? b : -b));
  const quad = A.mul(A).add(Poly.mono(plus ? -a * b : a * b, { x: 1 })).add(Poly.const(b * b));
  return (
    <div className="cp card">
      <div className="pr-tabs">
        <button className={`pr-tab ${!plus ? 'on' : ''}`} onClick={() => setPlus(false)}>Difference A³ − B³</button>
        <button className={`pr-tab ${plus ? 'on' : ''}`} onClick={() => setPlus(true)}>Sum A³ + B³</button>
      </div>
      <div className="cp-formula">
        <Tex display>{`A^3 \\htmlClass{c-var}{${s}} B^3 = (A \\htmlClass{c-var}{${s}} B)(A^2 \\htmlClass{c-op}{${o}} AB \\htmlClass{c-num}{+} B^2)`}</Tex>
      </div>
      <div className="cp-soap">
        <span><b className="c-var">S</b>ame sign as the original</span>
        <span><b className="c-op">O</b>pposite sign</span>
        <span><b className="c-num">A</b>lways <b className="c-num">P</b>ositive</span>
      </div>
      <div className="pb-row"><span className="el-step">Here</span><Tex>{`A = ${A.tex()},\\quad B = ${b} \\quad (A^3 = ${A.mul(A).mul(A).tex()},\\; B^3 = ${b ** 3})`}</Tex></div>
      <div className="pb-row el-result"><span className="el-step">Factored</span><Tex>{`${P.tex()} = (${lin.tex()})(${quad.tex()})`}</Tex></div>
      <p className="lb-note">The trinomial factor <Tex>{quad.tex()}</Tex> is prime — don't try to factor it further.</p>
      <div className="am-controls">
        <label className="el-slider"><span>coefficient of x in A</span><input type="range" min={1} max={5} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>B</span><input type="range" min={1} max={6} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
      </div>
    </div>
  );
}
