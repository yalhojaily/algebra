import { useState } from 'react';
import { Tex } from './MathText';

interface Term { c: number; v: string } // v = variable part in TeX ('' for a constant)

const presets: Term[][] = [
  [{ c: 3, v: 'x' }, { c: 5, v: '' }, { c: -2, v: 'x' }, { c: 4, v: 'y' }, { c: -7, v: '' }, { c: 1, v: 'x' }],
  [{ c: 6, v: 'a' }, { c: -4, v: 'b' }, { c: -1, v: 'a' }, { c: 9, v: '' }, { c: 2, v: 'b' }],
  [{ c: 2, v: 'x^2' }, { c: 5, v: 'x' }, { c: -3, v: 'x^2' }, { c: 1, v: 'x' }, { c: 8, v: '' }],
  [{ c: 4, v: 'y' }, { c: -4, v: 'y' }, { c: 3, v: '' }, { c: 7, v: 'z' }],
];

const COLORS: Record<string, string> = { '': 'k0', x: 'k1', y: 'k2', a: 'k1', b: 'k2', z: 'k3', 'x^2': 'k3' };

const termTex = (t: Term, first: boolean) => {
  const coef = t.v ? (t.c === 1 ? '' : t.c === -1 ? '-' : String(t.c)) : String(t.c);
  const body = `${coef}${t.v}`;
  if (first) return body;
  return body.startsWith('-') ? `- ${body.slice(1)}` : `+ ${body}`;
};

/** Sort an expression's terms into groups of like terms, then combine each group. */
export default function LikeTerms() {
  const [pi, setPi] = useState(0);
  const [stage, setStage] = useState(0); // 0 = as written, 1 = grouped, 2 = combined
  const terms = presets[pi];
  const groupOrder = [...new Set(terms.map((t) => t.v))].sort((a, b) => (a === '' ? 1 : b === '' ? -1 : 0));
  const grouped = groupOrder.map((v) => ({ v, items: terms.filter((t) => t.v === v), total: terms.filter((t) => t.v === v).reduce((s, t) => s + t.c, 0) }));
  const combined = grouped.filter((g) => g.total !== 0).map((g, i) => termTex({ c: g.total, v: g.v }, i === 0)).join(' ') || '0';

  return (
    <div className="lt card">
      <div className="pr-tabs">
        {presets.map((_, i) => (
          <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setStage(0); }}>Example {i + 1}</button>
        ))}
      </div>

      <div className="lt-stage">
        <div className="lt-label">{['As written', 'Like terms grouped together', 'Each group combined'][stage]}</div>
        {stage === 0 && (
          <div className="lt-tiles">
            {terms.map((t, i) => (
              <span key={i} className={`lt-tile ${COLORS[t.v] ?? 'k3'}`}><Tex>{termTex(t, i === 0)}</Tex></span>
            ))}
          </div>
        )}
        {stage >= 1 && (
          <div className="lt-groups">
            {grouped.map((g, gi) => (
              <div key={g.v} className={`lt-group ${COLORS[g.v] ?? 'k3'}`}>
                <div className="lt-gname">{g.v ? <Tex>{`${g.v}\\text{-terms}`}</Tex> : 'constants'}</div>
                <div className="lt-tiles">
                  {g.items.map((t, i) => (
                    <span key={i} className={`lt-tile ${COLORS[t.v] ?? 'k3'}`}><Tex>{termTex(t, gi === 0 && i === 0)}</Tex></span>
                  ))}
                </div>
                {stage === 2 && (
                  <div className="lt-total">
                    → <Tex>{g.total === 0 ? '0' : termTex({ c: g.total, v: g.v }, true)}</Tex>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {stage === 2 && (
          <div className="lt-result">
            <Tex>{`= ${combined}`}</Tex>
          </div>
        )}
      </div>

      <div className="lt-actions">
        {stage < 2 ? (
          <button className="btn btn-primary" onClick={() => setStage((s) => s + 1)}>{stage === 0 ? 'Group like terms' : 'Combine each group'}</button>
        ) : (
          <button className="btn" onClick={() => setStage(0)}>↺ Start over</button>
        )}
        {pi === 2 && <span className="lt-note">Note: <Tex>x^2</Tex> and <Tex>x</Tex> are <strong>not</strong> like terms — the variable parts must match exactly, exponents included.</span>}
      </div>
    </div>
  );
}
