import { useMemo, useState } from 'react';
import { parse, topTerms } from '../lib/expr';
import { fracTexOf as toTex, factored, factoredTex, lcdOf, product, ratFromNode, simplify } from '../lib/rational';
import { Tex } from './MathText';

const presets: [string, string][] = [
  ['x^2/(x - 1)', '(7x - 6)/(x - 1)'],
  ['x/4 + x/6', '5'],
  ['1/2 + 1/x', '5/6'],
  ['x + 6/x', '5'],
  ['x/(x - 2)', '2/(x - 2) + 3'],
];

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(4)));

/** Solve a rational equation: list the excluded values, clear fractions with the LCD, solve, and check every candidate. */
export default function RationalEquation() {
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState(0);
  const [ls, rs] = presets[pi];
  const d = useMemo(() => {
    const L = parse(ls), R = parse(rs);
    const terms = [...topTerms(L), ...topTerms(R)];
    const dens = terms.map((t) => factored(ratFromNode(t).den));
    const lcd = lcdOf(...dens);
    const Lp = product(lcd);
    // excluded values: zeros of the linear factors of the LCD (and x itself)
    const bad = [...new Set(lcd.factors.filter((p) => p.degree() === 1).map((p) => { const [a, b] = p.coefs('x'); return -b / a; }))];
    const cleared = (n: ReturnType<typeof ratFromNode>) => { const s = simplify(n.num.mul(Lp), n.den); return product(s.num); };
    const lhs = cleared(ratFromNode(L)), rhs = cleared(ratFromNode(R));
    const P = lhs.sub(rhs);
    const f = factored(P);
    const cands = [...new Set(f.factors.filter((p) => p.degree() === 1).map((p) => { const [a, b] = p.coefs('x'); return -b / a; }))].sort((a, b) => a - b);
    const lt = Lp.size > 1 ? `(${factoredTex(lcd)})` : factoredTex(lcd);
    return {
      eq: `${toTex(L)} = ${toTex(R)}`,
      bad,
      lcd: factoredTex(lcd),
      mult: `\\htmlClass{c-op}{${lt}} \\cdot \\left(${toTex(L)}\\right) = \\htmlClass{c-op}{${lt}} \\cdot \\left(${toTex(R)}\\right)`,
      cleared: `${lhs.tex()} = ${rhs.tex()}`,
      std: P.degree() >= 2 ? `${P.tex()} = 0 \\;\\Rightarrow\\; ${factoredTex(f)} = 0` : `${P.tex()} = 0`,
      cands,
    };
  }, [pi]);
  const steps = [
    { h: 'The equation', body: d.eq },
    { h: 'Which values are not allowed?', body: d.bad.length ? `x \\ne ${d.bad.map(fmt).join(',\\ ')} \\quad \\text{(they make a denominator } 0)` : '\\text{No variable in a denominator — every number is allowed.}' },
    { h: 'Multiply both sides by the LCD', body: `\\text{LCD} = ${d.lcd}: \\quad ${d.mult}` },
    { h: 'The fractions are gone', body: d.cleared },
    { h: 'Solve', body: `${d.std} \\;\\Rightarrow\\; x = ${d.cands.map(fmt).join(' \\text{ or } x = ') || '\\text{(no solution)}'}` },
  ];
  const done = step === steps.length;
  return (
    <div className="ac card">
      <div className="pr-tabs">
        {presets.map((p, i) => (
          <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setStep(0); }}>
            <Tex>{`${toTex(parse(p[0]))} = ${toTex(parse(p[1]))}`}</Tex>
          </button>
        ))}
      </div>
      <ol className="ac-steps">
        {steps.slice(0, step + 1).map((s, i) => (
          <li key={`${pi}-${i}`}><span className="sr-num">{i + 1}</span><div><div className="ac-h">{s.h}</div><Tex>{`\\displaystyle ${s.body}`}</Tex></div></li>
        ))}
        {done && (
          <li key={`${pi}-check`} className="re-check">
            <span className="sr-num">{steps.length + 1}</span>
            <div>
              <div className="ac-h">Check every candidate</div>
              <div className="re-cands">
                {d.cands.map((c) => {
                  const bad = d.bad.some((b) => Math.abs(b - c) < 1e-9);
                  return (
                    <div key={c} className={`re-cand ${bad ? 'wrong' : 'right'}`}>
                      <Tex>{`x = ${fmt(c)}`}</Tex>
                      <span>{bad ? '✗ makes a denominator 0 — not a solution' : '✓ allowed — a solution'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </li>
        )}
      </ol>
      <div className="wb-actions">
        {!done ? <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next step →</button> : <span className="fs-done">Done.</span>}
        {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(0)}>↺ Start over</button>}
      </div>
    </div>
  );
}
