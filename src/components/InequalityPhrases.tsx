import { useState } from 'react';
import { PHRASES } from '../generators/2-8-applications-and-problem-solving-with-inequalities';
import { REL_TEX } from '../lib/inequality';
import { MathText, Tex } from './MathText';
import { RayFigure } from './RayFigure';

/** Everyday phrases → inequality symbols, with the graph of each. */
export default function InequalityPhrases() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(5);
  const ph = PHRASES[i];
  const right = ph.op === '>' || ph.op === '>=';
  return (
    <div className="ip card">
      <div className="tl-chips">
        {PHRASES.map((x, k) => (
          <button key={k} className={`tl-chip ${k === i ? 'on' : ''}`} onClick={() => setI(k)}>{x.text('x', 0).replace(' 0', ' □')}</button>
        ))}
      </div>
      <div className="tl-stage ip-stage">
        <div className="tl-phrase">{ph.text('x', n)}</div>
        <div className="tl-arrow" aria-hidden>↓</div>
        <div className="tl-expr"><Tex display>{`x ${REL_TEX[ph.op]} ${n}`}</Tex></div>
        <div className="tl-note"><MathText>{ph.note}</MathText></div>
        <RayFigure boundary={n} closed={ph.op.length === 2} dir={right ? 'right' : 'left'} min={n - 8} max={n + 8} />
        <label className="el-slider tl-n">
          <span>Change the number</span>
          <input type="range" min={-10} max={20} value={n} onChange={(e) => setN(Number(e.target.value))} />
          <output className="c-num">{n}</output>
        </label>
      </div>
    </div>
  );
}
