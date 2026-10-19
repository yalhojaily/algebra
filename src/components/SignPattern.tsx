import { useState } from 'react';
import { Tex } from './MathText';

const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/**
 * Why is negative × negative positive? Follow the pattern: multiply a fixed number by
 * 3, 2, 1, 0, −1, −2, −3 and watch the products change by the same step each time.
 */
export default function SignPattern() {
  const [a, setA] = useState(-3);
  const [shown, setShown] = useState(4); // rows revealed: 3,2,1,0 are shown first
  const bs = [3, 2, 1, 0, -1, -2, -3];
  const step = -a; // how much the product changes going down a row

  return (
    <div className="sp card">
      <div className="sp-top">
        <div className="sp-pick" role="group" aria-label="First factor">
          <span>First factor:</span>
          {[-4, -3, -2, 2, 3, 4].map((v) => (
            <button key={v} className={`pr-tab ${v === a ? 'on' : ''}`} onClick={() => { setA(v); setShown(4); }}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="sp-body">
        <table className="sp-table">
          <tbody>
            {bs.map((b, i) => {
              const visible = i < shown;
              const prod = a * b;
              return (
                <tr key={b} className={`${visible ? '' : 'hidden'} ${b < 0 ? 'negrow' : ''}`}>
                  <td className="sp-expr"><Tex>{`${a} \\cdot ${p(b)}`}</Tex></td>
                  <td className="sp-eq">=</td>
                  <td className={`sp-prod ${visible ? (prod > 0 ? 'pos' : prod < 0 ? 'neg' : '') : ''}`}>{visible ? prod : '?'}</td>
                  <td className="sp-step">{i > 0 && visible ? <span>{step > 0 ? `+${step}` : step}</span> : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="sp-side">
          <p>
            Each time the second factor goes down by 1, the product changes by <strong className="c-op">{step > 0 ? `+${step}` : step}</strong>. Keep the
            pattern going below zero:
          </p>
          {shown < bs.length ? (
            <button className="btn btn-primary" onClick={() => setShown((s) => s + 1)}>
              Predict the next row →
            </button>
          ) : (
            <div className="sp-conclusion">
              {a < 0 ? (
                <>A negative times a negative is <strong className="pos">positive</strong>.</>
              ) : (
                <>A positive times a negative is <strong className="neg">negative</strong>.</>
              )}
            </div>
          )}
          <table className="sp-grid" aria-label="Sign rules">
            <tbody>
              <tr><th></th><th>+</th><th>−</th></tr>
              <tr><th>+</th><td className="pos">+</td><td className="neg">−</td></tr>
              <tr><th>−</th><td className="neg">−</td><td className="pos">+</td></tr>
            </tbody>
          </table>
          <div className="sp-caption">Same signs → positive. Different signs → negative.</div>
        </div>
      </div>
    </div>
  );
}
