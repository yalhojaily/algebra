import { useState } from 'react';
import { Tex } from './MathText';

const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** Counters model: a + counter and a − counter cancel to make zero. What's left over is the sum. */
export default function ZeroPairs() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(-8);
  const [paired, setPaired] = useState(false);

  const chips = (n: number, from: 'a' | 'b') => Array.from({ length: Math.abs(n) }, (_, i) => ({ sign: n < 0 ? -1 : 1, from, i }));
  const all = [...chips(a, 'a'), ...chips(b, 'b')];
  const pos = all.filter((c) => c.sign > 0);
  const neg = all.filter((c) => c.sign < 0);
  const pairs = Math.min(pos.length, neg.length);
  const sum = a + b;

  return (
    <div className="zp card">
      <div className="zp-eq">
        <Tex>{`${a} + ${p(b)} = ${paired ? `\\htmlClass{c-eq}{${sum}}` : '\\;?'}`}</Tex>
      </div>
      <div className="zp-rows">
        <div className="zp-row">
          <span className="zp-lab">positive</span>
          <div className="zp-chips">
            {pos.map((c, i) => (
              <span key={`p${c.from}${c.i}`} className={`zp-chip pos ${c.from} ${paired && i < pairs ? 'gone' : ''}`}>+</span>
            ))}
          </div>
        </div>
        <div className="zp-row">
          <span className="zp-lab">negative</span>
          <div className="zp-chips">
            {neg.map((c, i) => (
              <span key={`n${c.from}${c.i}`} className={`zp-chip neg ${c.from} ${paired && i < pairs ? 'gone' : ''}`}>−</span>
            ))}
          </div>
        </div>
      </div>
      <div className="zp-msg" aria-live="polite">
        {paired ? (
          <>
            <strong>{pairs}</strong> zero pair{pairs === 1 ? '' : 's'} cancel{pairs === 1 ? 's' : ''} out (each <Tex>{'+1 + (-1) = 0'}</Tex>).{' '}
            {sum === 0 ? 'Nothing is left, so the sum is 0.' : <>What's left: <strong>{Math.abs(sum)} {sum > 0 ? 'positive' : 'negative'}</strong> → the sum is <strong>{sum}</strong>.</>}
          </>
        ) : (
          'Each + and − pair makes zero. Press the button to cancel the pairs.'
        )}
      </div>
      <div className="zp-controls">
        <label className="el-slider">
          <span>first number</span>
          <input type="range" min={-9} max={9} value={a} onChange={(e) => { setA(Number(e.target.value)); setPaired(false); }} />
          <output className="c-var">{a}</output>
        </label>
        <label className="el-slider">
          <span>second number</span>
          <input type="range" min={-9} max={9} value={b} onChange={(e) => { setB(Number(e.target.value)); setPaired(false); }} />
          <output className="c-op">{b}</output>
        </label>
        <div className="zp-btns">
          <button className="btn btn-primary" onClick={() => setPaired((x) => !x)}>{paired ? '↺ Put them back' : 'Cancel the zero pairs'}</button>
        </div>
      </div>
    </div>
  );
}
