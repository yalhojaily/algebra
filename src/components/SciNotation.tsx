import { useState } from 'react';
import { Tex } from './MathText';

const examples = [
  { name: 'Distance from Earth to the Sun (km)', a: 1.496, n: 8 },
  { name: 'Population of the world (people)', a: 8.1, n: 9 },
  { name: 'Speed of light (m/s)', a: 3, n: 8 },
  { name: 'Width of a human hair (m)', a: 7.5, n: -5 },
  { name: 'Size of a typical virus (m)', a: 1, n: -7 },
  { name: 'Mass of a grain of sand (kg)', a: 6.7, n: -8 },
];

/** Standard notation ↔ scientific notation: watch the decimal point hop as the exponent changes. */
export default function SciNotation() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(examples[0].n);
  const a = examples[i].a;
  const digits = String(a).replace('.', '');
  // Build the standard-form digit string with the decimal point after (1 + n) digits.
  const point = 1 + n;
  // Each character remembers whether it is one of the original significant digits.
  const sig = digits.split('').map((ch) => ({ ch, main: true }));
  const z = (k: number) => Array.from({ length: k }, () => ({ ch: '0', main: false }));
  const dot = { ch: '.', main: false };
  let body: { ch: string; main: boolean }[];
  if (point <= 0) body = [{ ch: '0', main: false }, dot, ...z(-point), ...sig];
  else if (point >= digits.length) body = [...sig, ...z(point - digits.length)];
  else body = [...sig.slice(0, point), dot, ...sig.slice(point)];

  return (
    <div className="sn card">
      <div className="pr-tabs">
        {examples.map((e, k) => (
          <button key={e.name} className={`pr-tab ${k === i ? 'on' : ''}`} onClick={() => { setI(k); setN(e.n); }}>{e.name.split(' (')[0]}</button>
        ))}
      </div>
      <div className="sn-sci"><Tex>{`${a} \\times 10^{\\htmlClass{c-op}{${n}}}`}</Tex></div>
      <div className="sn-arrow">{n > 0 ? `move the decimal point ${n} place${n > 1 ? 's' : ''} right →` : n < 0 ? `← move the decimal point ${-n} place${n < -1 ? 's' : ''} left` : 'no move'}</div>
      <div className="sn-std" aria-label="Standard notation">
        {body.map((d, k) => (
          <span key={k} className={d.ch === '.' ? 'sn-pt' : d.main ? 'sn-d main' : 'sn-d'}>{d.ch}</span>
        ))}
      </div>
      <p className="sn-note">
        {examples[i].n === n ? <>Real value: <strong>{examples[i].name}</strong>.</> : 'Slide the exponent: each step multiplies or divides by 10.'}
        {' '}A positive exponent means a large number; a negative exponent means a small number (between 0 and 1).
      </p>
      <div className="am-controls">
        <label className="el-slider"><span>exponent</span><input type="range" min={-9} max={12} value={n} onChange={(e) => setN(Number(e.target.value))} /><output className="c-op">{n}</output></label>
      </div>
    </div>
  );
}
