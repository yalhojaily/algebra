import { useState } from 'react';
import { Tex } from './MathText';

/** Pictures of the special products: (A + B)² and A² − B² = (A + B)(A − B). */
export default function SquareArea() {
  const [tab, setTab] = useState<'square' | 'diff'>('square');
  const [a, setA] = useState(6);
  const [b, setB] = useState(3);
  const s = 26;
  const W = 14 * s + 40;
  return (
    <div className="sq card">
      <div className="pr-tabs">
        <button className={`pr-tab ${tab === 'square' ? 'on' : ''}`} onClick={() => setTab('square')}>(A + B)²</button>
        <button className={`pr-tab ${tab === 'diff' ? 'on' : ''}`} onClick={() => setTab('diff')}>(A + B)(A − B)</button>
      </div>
      <div className="px-body">
        {tab === 'square' ? (
          <svg viewBox={`0 0 ${W} ${W}`} className="am-svg" role="img" aria-label="Square split into four parts">
            <g transform="translate(30 30)">
              <rect x={0} y={0} width={a * s} height={a * s} className="sq-a" />
              <rect x={a * s} y={0} width={b * s} height={a * s} className="sq-ab" />
              <rect x={0} y={a * s} width={a * s} height={b * s} className="sq-ab" />
              <rect x={a * s} y={a * s} width={b * s} height={b * s} className="sq-b" />
              <text x={(a * s) / 2} y={(a * s) / 2 + 6} className="sq-lab">A²</text>
              <text x={a * s + (b * s) / 2} y={(a * s) / 2 + 6} className="sq-lab">AB</text>
              <text x={(a * s) / 2} y={a * s + (b * s) / 2 + 6} className="sq-lab">AB</text>
              <text x={a * s + (b * s) / 2} y={a * s + (b * s) / 2 + 6} className="sq-lab">B²</text>
              <text x={(a * s) / 2} y={-8} className="am-dim">A = {a}</text>
              <text x={a * s + (b * s) / 2} y={-8} className="am-dim">B = {b}</text>
            </g>
          </svg>
        ) : (
          <svg viewBox={`0 0 ${W} ${W}`} className="am-svg" role="img" aria-label="A squared minus B squared">
            <g transform="translate(30 30)">
              <rect x={0} y={0} width={a * s} height={(a - b) * s} className="sq-a" />
              <rect x={0} y={(a - b) * s} width={(a - b) * s} height={b * s} className="sq-ab" />
              <rect x={(a - b) * s} y={(a - b) * s} width={b * s} height={b * s} className="sq-cut" />
              <text x={(a * s) / 2} y={((a - b) * s) / 2 + 6} className="sq-lab">piece 1</text>
              <text x={((a - b) * s) / 2} y={(a - b) * s + (b * s) / 2 + 6} className="sq-lab">piece 2</text>
              <text x={(a - b) * s + (b * s) / 2} y={(a - b) * s + (b * s) / 2 + 6} className="sq-lab cut">B² cut out</text>
              <text x={(a * s) / 2} y={-8} className="am-dim">A = {a}</text>
            </g>
          </svg>
        )}
        <div className="px-side">
          {tab === 'square' ? (
            <>
              <p>A square with side <Tex>A + B</Tex> splits into <strong>four</strong> pieces: one <Tex>A^2</Tex>, one <Tex>B^2</Tex>, and <strong>two</strong> rectangles <Tex>AB</Tex>.</p>
              <div className="pb-row el-result"><Tex>{'(A + B)^2 = A^2 + 2AB + B^2'}</Tex></div>
              <p className="lb-note">Check with numbers: <Tex>{`(${a} + ${b})^2 = ${(a + b) ** 2}`}</Tex> and <Tex>{`${a * a} + ${2 * a * b} + ${b * b} = ${(a + b) ** 2}`}</Tex>. Forgetting the middle term would give only {a * a + b * b}.</p>
            </>
          ) : (
            <>
              <p>Start with an <Tex>A \times A</Tex> square and cut out a <Tex>B \times B</Tex> corner: the area left is <Tex>A^2 - B^2</Tex>.</p>
              <p>Slide piece 2 up beside piece 1 and they form one rectangle, <Tex>A + B</Tex> long and <Tex>A - B</Tex> wide.</p>
              <div className="pb-row el-result"><Tex>{'(A + B)(A - B) = A^2 - B^2'}</Tex></div>
              <p className="lb-note">Numbers: <Tex>{`(${a} + ${b})(${a} - ${b}) = ${(a + b) * (a - b)}`}</Tex> and <Tex>{`${a * a} - ${b * b} = ${a * a - b * b}`}</Tex>.</p>
            </>
          )}
        </div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>A</span><input type="range" min={3} max={9} value={a} onChange={(e) => { const v = Number(e.target.value); setA(v); if (b >= v) setB(v - 1); }} /><output className="c-var">{a}</output></label>
        <label className="el-slider"><span>B</span><input type="range" min={1} max={Math.min(5, a - 1)} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
      </div>
    </div>
  );
}
