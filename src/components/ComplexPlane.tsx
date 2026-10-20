import { useState } from 'react';
import { Plane } from './Plane';
import { Tex } from './MathText';

const cTex = (a: number, b: number) => {
  if (b === 0) return String(a);
  const bi = Math.abs(b) === 1 ? 'i' : `${Math.abs(b)}i`;
  if (a === 0) return b < 0 ? `-${bi}` : bi;
  return `${a} ${b < 0 ? '-' : '+'} ${bi}`;
};

/** Complex numbers as points: a + bi sits at (a, b). Multiplying by i turns the point a quarter turn — and i, i², i³, i⁴ cycle. */
export default function ComplexPlane() {
  const [z, setZ] = useState<[number, number]>([3, 2]);
  const [trail, setTrail] = useState<[number, number][]>([]);
  const times = () => { setTrail((t) => [...t, z].slice(-3)); setZ(([a, b]) => [-b, a]); };
  const powers = ['1', 'i', '-1', '-i'];
  return (
    <div className="cpx card">
      <div className="px-body">
        <Plane range={6} size={340} onPick={(x, y) => { setZ([x, y]); setTrail([]); }} label="Click to choose a + bi"
          segments={[{ x1: 0, y1: 0, x2: z[0], y2: z[1] }]}
          points={[...trail.map(([a, b]) => ({ x: a, y: b, cls: 'amber' })), { x: z[0], y: z[1], cls: 'red', label: cTex(z[0], z[1]) }]} />
        <div className="px-side">
          <div className="lb-eq"><Tex>{`z = ${cTex(z[0], z[1])}`}</Tex></div>
          <p className="lb-note">The horizontal axis holds the <strong>real part</strong>, the vertical axis the <strong>imaginary part</strong>. Click to pick a number.</p>
          <button className="btn btn-primary" onClick={times}>Multiply by i</button>
          <div className="pb-row"><Tex>{`i(${cTex(z[0], z[1])}) = ${z[0]}i + ${z[1] < 0 ? `(${z[1]})` : z[1]}i^2 = ${cTex(-z[1], z[0])}`}</Tex></div>
          <div className="cpx-cycle">
            {powers.map((v, k) => <div key={k} className="cpx-pow"><Tex>{`i^{${k === 0 ? 4 : k}} = ${v}`}</Tex></div>)}
          </div>
          <p className="lb-note">Each multiplication by <Tex>i</Tex> is a quarter turn counter-clockwise, so four of them bring you back: <Tex>{'i^4 = 1'}</Tex>. That's why powers of <Tex>i</Tex> repeat every four.</p>
        </div>
      </div>
    </div>
  );
}
