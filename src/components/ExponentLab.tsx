import { useState } from 'react';
import { Tex } from './MathText';

type Rule = 'product' | 'quotient' | 'power' | 'negative';

/** See exponent rules by writing out every factor: chips that combine, cancel, or repeat. */
export default function ExponentLab() {
  const [rule, setRule] = useState<Rule>('product');
  const [m, setM] = useState(3);
  const [n, setN] = useState(2);

  const chips = (k: number, cls = '', cancelled = 0) =>
    Array.from({ length: k }, (_, i) => (
      <span key={i} className={`xl-chip ${cls} ${i < cancelled ? 'gone' : ''}`}>x</span>
    ));

  return (
    <div className="xl card">
      <div className="pr-tabs">
        {([['product', 'Product rule'], ['quotient', 'Quotient rule'], ['power', 'Power rule'], ['negative', 'Negative exponents']] as [Rule, string][]).map(([r, l]) => (
          <button key={r} className={`pr-tab ${r === rule ? 'on' : ''}`} onClick={() => setRule(r)}>{l}</button>
        ))}
      </div>

      {rule === 'product' && (
        <div className="xl-body">
          <div className="xl-eq"><Tex>{`x^{${m}} \\cdot x^{${n}}`}</Tex></div>
          <div className="xl-row"><span className="xl-group a">{chips(m, 'a')}</span><span className="xl-dot">·</span><span className="xl-group b">{chips(n, 'b')}</span></div>
          <div className="xl-result">That's <strong>{m + n}</strong> factors of x in all: <Tex>{`x^{${m}} \\cdot x^{${n}} = x^{${m} + ${n}} = x^{${m + n}}`}</Tex></div>
        </div>
      )}
      {rule === 'quotient' && (
        <div className="xl-body">
          <div className="xl-eq"><Tex>{`\\dfrac{x^{${m}}}{x^{${n}}}`}</Tex></div>
          <div className="xl-frac">
            <div className="xl-row">{chips(m, 'a', Math.min(m, n))}</div>
            <div className="xl-bar" />
            <div className="xl-row">{chips(n, 'b', Math.min(m, n))}</div>
          </div>
          <div className="xl-result">
            {Math.min(m, n)} pair{Math.min(m, n) === 1 ? '' : 's'} cancel (each <Tex>{'\\tfrac{x}{x} = 1'}</Tex>).{' '}
            {m > n && <>Left on top: <Tex>{`x^{${m - n}}`}</Tex>. So <Tex>{`\\dfrac{x^{${m}}}{x^{${n}}} = x^{${m} - ${n}} = x^{${m - n}}`}</Tex></>}
            {m === n && <>Nothing is left but 1. So <Tex>{`x^{${m} - ${n}} = x^{0} = 1`}</Tex> — that's why any non-zero number to the 0 power is 1.</>}
            {m < n && <>Left on the bottom: <Tex>{`\\dfrac{1}{x^{${n - m}}}`}</Tex>. The rule gives <Tex>{`x^{${m - n}}`}</Tex>, so <Tex>{`x^{${m - n}} = \\dfrac{1}{x^{${n - m}}}`}</Tex> — that's what a negative exponent means.</>}
          </div>
        </div>
      )}
      {rule === 'power' && (
        <div className="xl-body">
          <div className="xl-eq"><Tex>{`(x^{${m}})^{${n}}`}</Tex></div>
          <div className="xl-row wrap">
            {Array.from({ length: n }, (_, i) => (
              <span key={i} className={`xl-group ${i % 2 ? 'b' : 'a'}`}>({chips(m, i % 2 ? 'b' : 'a')})</span>
            ))}
          </div>
          <div className="xl-result"><strong>{n}</strong> groups of <strong>{m}</strong> factors: <Tex>{`(x^{${m}})^{${n}} = x^{${m} \\cdot ${n}} = x^{${m * n}}`}</Tex></div>
        </div>
      )}
      {rule === 'negative' && (
        <div className="xl-body">
          <table className="sp-table xl-table">
            <tbody>
              {[3, 2, 1, 0, -1, -2, -3].map((k) => (
                <tr key={k} className={k < 0 ? 'negrow' : ''}>
                  <td><Tex>{`2^{${k}}`}</Tex></td><td className="sp-eq">=</td>
                  <td className="xl-val"><Tex>{k >= 0 ? String(2 ** k) : `\\dfrac{1}{${2 ** -k}}`}</Tex></td>
                  <td className="sp-step"><span>{k < 3 ? '÷ 2' : ''}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="xl-result">Each step down divides by 2. Keep the pattern going and you get <Tex>{'2^0 = 1'}</Tex> and <Tex>{'2^{-n} = \\dfrac{1}{2^n}'}</Tex>.</div>
        </div>
      )}

      {rule !== 'negative' && (
        <div className="am-controls">
          <label className="el-slider"><span>{rule === 'power' ? 'inner exponent' : 'first exponent'}</span><input type="range" min={1} max={7} value={m} onChange={(e) => setM(Number(e.target.value))} /><output className="c-var">{m}</output></label>
          <label className="el-slider"><span>{rule === 'power' ? 'outer exponent' : 'second exponent'}</span><input type="range" min={1} max={rule === 'power' ? 4 : 7} value={Math.min(n, rule === 'power' ? 4 : 7)} onChange={(e) => setN(Number(e.target.value))} /><output className="c-op">{n}</output></label>
        </div>
      )}
    </div>
  );
}
