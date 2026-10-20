import { useState } from 'react';
import { Tex } from './MathText';

const g = (a: number, b: number): number => (b ? g(b, a % b) : a);

/** Two rows of multiples: the first number in both rows is the LCM. */
export default function MultiplesRace() {
  const [a, setA] = useState(6);
  const [b, setB] = useState(8);
  const L = (a * b) / g(a, b);
  const max = Math.max(L * 2, 40);
  const row = (n: number) => Array.from({ length: Math.floor(max / n) }, (_, i) => n * (i + 1));
  const ra = row(a), rb = row(b);
  return (
    <div className="mr card">
      <div className="mr-rows">
        {[{ n: a, r: ra, other: rb, cls: 'a' }, { n: b, r: rb, other: ra, cls: 'b' }].map(({ n, r, other, cls }) => (
          <div key={cls} className="mr-row">
            <span className={`mr-lab ${cls}`}>× {n}</span>
            <div className="mr-cells">
              {r.map((m) => <span key={m} className={`mr-cell ${other.includes(m) ? (m === L ? 'lcm' : 'common') : ''}`}>{m}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="pb-row el-result"><Tex>{`\\text{LCM}(${a}, ${b}) = ${L}`}</Tex></div>
      <p className="lb-note">Green numbers are multiples of <strong>both</strong> — common multiples. The first one is the <strong>least</strong> common multiple. The others ({[2, 3].map((k) => k * L).filter((x) => x <= max).join(', ')}…) are all multiples of it. {L === a * b ? `Here ${a} and ${b} share no factor, so the LCM is just ${a} × ${b}.` : `It is less than ${a} × ${b} = ${a * b} because ${a} and ${b} share a factor of ${g(a, b)}.`}</p>
      <div className="am-controls">
        <label className="el-slider"><span>first number</span><input type="range" min={2} max={15} value={a} onChange={(e) => setA(Number(e.target.value))} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>second number</span><input type="range" min={2} max={15} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
      </div>
    </div>
  );
}
