import { useState } from 'react';
import { factorPairs } from '../generators/helpers';
import { Tex } from './MathText';

const term = (k: number) => (k === 0 ? '' : k < 0 ? ` - ${-k}` : ` + ${k}`);
const xterm = (k: number) => (k === 0 ? '' : k === 1 ? ' + x' : k === -1 ? ' - x' : k < 0 ? ` - ${-k}x` : ` + ${k}x`);

/** x² + bx + c: list every factor pair of c and find the one that adds to b. */
export default function FactorPairs() {
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-15);
  const pairs = c === 0 ? [] : factorPairs(c);
  const hit = pairs.find(([p, q]) => p + q === b);
  return (
    <div className="fp card">
      <div className="lb-eq"><Tex>{`x^2${xterm(b)}${term(c)}`}</Tex></div>
      <div className="px-body">
        <div>
          <div className="fp-h">Pairs with product <strong>{c}</strong> — which adds to <strong>{b}</strong>?</div>
          <table className="nice fp-table">
            <thead><tr><th>Pair</th><th>Product</th><th>Sum</th></tr></thead>
            <tbody>
              {pairs.map(([p, q]) => (
                <tr key={`${p},${q}`} className={p + q === b ? 'hit' : ''}>
                  <td>{p}, {q}</td><td>{p * q}</td><td>{p + q}{p + q === b ? ' ✓' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-side">
          {c === 0 ? (
            <p>With c = 0, factor out x: <Tex>{`x(x${term(b)})`}</Tex></p>
          ) : hit ? (
            <>
              <div className="pb-row el-result"><Tex>{`x^2${xterm(b)}${term(c)} = (x${term(hit[0])})(x${term(hit[1])})`}</Tex></div>
              <p className="lb-note">Check with FOIL: <Tex>{`x^2 ${hit[1] < 0 ? '-' : '+'} ${Math.abs(hit[1])}x ${hit[0] < 0 ? '-' : '+'} ${Math.abs(hit[0])}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}`}</Tex> — the middle terms add to <Tex>{`${b}x`}</Tex> ✓</p>
            </>
          ) : (
            <div className="wb-status">No pair adds to {b}, so this trinomial is <strong>prime</strong> — it can't be factored using integers.</div>
          )}
          <p className="lb-note">
            Sign shortcuts: if <em>c</em> is <strong>positive</strong>, both numbers have the sign of <em>b</em>. If <em>c</em> is <strong>negative</strong>, the signs are different and the larger number has the sign of <em>b</em>.
          </p>
        </div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>b</span><input type="range" min={-15} max={15} value={b} onChange={(e) => setB(Number(e.target.value))} /><output className="c-op">{b}</output></label>
        <label className="el-slider"><span>c</span><input type="range" min={-40} max={40} value={c} onChange={(e) => setC(Number(e.target.value))} /><output className="c-num">{c}</output></label>
      </div>
    </div>
  );
}
