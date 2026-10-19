import { useMemo, useState } from 'react';
import { monoStr, Poly } from '../lib/poly';
import { Tex } from './MathText';

const presets: [string, string][] = [
  ['3x^3 - 2x + 5', '-x^3 + 4x^2 + 7x - 9'],
  ['5x^2 - 3x + 1', '2x^2 + 6x - 4'],
  ['4x^4 + x^2 - 8', '-3x^3 + 2x^2 + x'],
];

/** Add or subtract polynomials in columns: like terms line up in the same column. */
export default function PolyColumns() {
  const [pi, setPi] = useState(0);
  const [op, setOp] = useState<'+' | '−'>('+');
  const [A, B] = useMemo(() => presets[pi].map((s) => Poly.parse(s)), [pi]);
  const B2 = op === '+' ? B : B.neg();
  const R = A.add(B2);
  const deg = Math.max(A.degree(), B.degree(), 0);
  const cols = Array.from({ length: deg + 1 }, (_, i) => deg - i);
  const cell = (P: Poly, e: number, first: boolean) => {
    const c = P.coef(e ? { x: e } : {});
    if (!c) return <span className="pc-empty">·</span>;
    const s = monoStr(c, e ? { x: e } : {}, true);
    return <Tex>{first ? s : s.startsWith('-') ? `-\\,${s.slice(1)}` : `+\\,${s}`}</Tex>;
  };
  const row = (P: Poly, cls = '') => (
    <tr className={cls}>{cols.map((e, i) => <td key={e}>{cell(P, e, i === 0)}</td>)}</tr>
  );
  return (
    <div className="pcol card">
      <div className="pr-tabs">
        {presets.map((_, i) => <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => setPi(i)}>Example {i + 1}</button>)}
        <span className="pcol-sep" />
        {(['+', '−'] as const).map((o) => <button key={o} className={`wb-op ${o === op ? 'on' : ''}`} onClick={() => setOp(o)}>{o === '+' ? 'Add' : 'Subtract'}</button>)}
      </div>
      <div className="pcol-eq"><Tex>{`(${A.tex()}) ${op === '+' ? '+' : '-'} (${B.tex()})`}</Tex></div>
      <table className="pcol-table">
        <thead><tr>{cols.map((e) => <th key={e}><Tex>{e === 0 ? '\\text{const}' : e === 1 ? 'x' : `x^{${e}}`}</Tex></th>)}</tr></thead>
        <tbody>
          {row(A)}
          {op === '+' ? row(B) : (
            <>
              <tr className="pcol-strike">{cols.map((e, i) => <td key={e}>{cell(B, e, i === 0)}</td>)}</tr>
              {row(B2, 'pcol-opp')}
            </>
          )}
          {row(R, 'pcol-sum')}
        </tbody>
      </table>
      <p className="lb-note">
        {op === '+' ? 'Each column holds like terms. Add down each column.' : <>To subtract, <strong>change the sign of every term</strong> in the second polynomial (crossed-out row → red row), then add down each column.</>}
        {' '}Result: <Tex>{R.tex()}</Tex>
      </p>
    </div>
  );
}
