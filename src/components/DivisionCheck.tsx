import { useState } from 'react';
import { Tex } from './MathText';
import { fracTex } from '../generators/helpers';

const p = (n: number | string) => (String(n).startsWith('-') ? `(${n})` : `${n}`);

/** Division is checked by multiplication: a ÷ b = c exactly when c · b = a. That also explains why ÷ 0 is undefined. */
export default function DivisionCheck() {
  const [a, setA] = useState(-24);
  const [b, setB] = useState(6);

  const byZero = b === 0;
  const q = byZero ? NaN : a / b;
  // Show an exact fraction when the quotient isn't an integer, so the check is exact too.
  const fmt = () => (Number.isInteger(q) ? String(q) : fracTex(a, b));
  const sameSign = Math.sign(a) === Math.sign(b);

  return (
    <div className="dc card">
      <div className="dc-controls">
        <label className="el-slider">
          <span>dividend</span>
          <input type="range" min={-24} max={24} value={a} onChange={(e) => setA(Number(e.target.value))} />
          <output className="c-var">{a}</output>
        </label>
        <label className="el-slider">
          <span>divisor</span>
          <input type="range" min={-6} max={6} value={b} onChange={(e) => setB(Number(e.target.value))} />
          <output className="c-op">{b}</output>
        </label>
      </div>

      <div className="dc-panels">
        <div className="dc-panel">
          <div className="dc-h">Division</div>
          <div className="dc-big">
            <Tex>{`\\dfrac{\\htmlClass{c-var}{${a}}}{\\htmlClass{c-op}{${b}}} = ${byZero ? '\\;?' : `\\htmlClass{c-eq}{${fmt()}}`}`}</Tex>
          </div>
        </div>
        <div className="dc-link" aria-hidden>⇔</div>
        <div className="dc-panel">
          <div className="dc-h">Check with multiplication</div>
          <div className="dc-big">
            {byZero ? <Tex>{`\\;?\\; \\cdot 0 = ${a}`}</Tex> : <Tex>{`\\htmlClass{c-eq}{${fmt()}} \\cdot ${p(b)} = ${a}`}</Tex>}
          </div>
        </div>
      </div>

      <div className={`dc-verdict ${byZero ? 'bad' : 'ok'}`} aria-live="polite">
        {byZero ? (
          a === 0 ? (
            <>
              <strong>Undefined.</strong> <em>Every</em> number times 0 is 0, so the check can't pick out one answer. We don't allow <Tex>{'0 \\div 0'}</Tex>.
            </>
          ) : (
            <>
              <strong>Undefined.</strong> Any number times 0 is 0 — never {a}. No number passes the check, so you can't divide by zero.
            </>
          )
        ) : a === 0 ? (
          <>Zero divided by a non-zero number is <strong>0</strong>, because <Tex>{`0 \\cdot ${p(b)} = 0`}</Tex>.</>
        ) : (
          <>
            {sameSign ? 'Same signs → positive quotient.' : 'Different signs → negative quotient.'} Dividing by <Tex>{`${b}`}</Tex> is the same as multiplying by
            its reciprocal: <Tex>{`${a} \\cdot ${p(b === 1 ? '1' : b === -1 ? '-1' : `${b < 0 ? '-' : ''}\\frac{1}{${Math.abs(b)}}`)} = ${fmt()}`}</Tex>
          </>
        )}
      </div>
    </div>
  );
}
