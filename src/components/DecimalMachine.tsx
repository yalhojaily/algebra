import { useState } from 'react';
import { Tex } from './MathText';

/** Long division of n ÷ d, tracking remainders so we can spot where the digits start repeating. */
function longDivide(n: number, d: number, maxDigits = 18) {
  const whole = Math.floor(n / d);
  let r = n % d;
  const digits: number[] = [];
  const steps: { r: number; digit: number }[] = [];
  const seen = new Map<number, number>(); // remainder -> index of digit it produced
  let repeatStart = -1;
  while (r !== 0 && digits.length < maxDigits) {
    if (seen.has(r)) {
      repeatStart = seen.get(r)!;
      break;
    }
    seen.set(r, digits.length);
    const digit = Math.floor((r * 10) / d);
    steps.push({ r, digit });
    digits.push(digit);
    r = (r * 10) % d;
  }
  return { whole, digits, steps, repeatStart, terminates: r === 0 };
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

function primeFactors(x: number) {
  const f: number[] = [];
  for (let p = 2; p * p <= x; p++) while (x % p === 0) { f.push(p); x /= p; }
  if (x > 1) f.push(x);
  return f;
}

export default function DecimalMachine() {
  const [n, setN] = useState(5);
  const [d, setD] = useState(12);
  const { whole, digits, steps, repeatStart, terminates } = longDivide(n, d);
  const g = gcd(n, d);
  const dd = d / g;
  const factors = primeFactors(dd);
  const only25 = factors.every((p) => p === 2 || p === 5);

  const decimalTex =
    digits.length === 0
      ? `${whole}`
      : repeatStart >= 0
        ? `${whole}.${digits.slice(0, repeatStart).join('')}\\overline{\\htmlClass{c-op}{${digits.slice(repeatStart).join('')}}}`
        : `${whole}.${digits.join('')}`;

  const Stepper = ({ label, value, set, min, max }: { label: string; value: number; set: (v: number) => void; min: number; max: number }) => (
    <div className="dm-stepper">
      <span className="dm-slabel">{label}</span>
      <button className="dm-btn" aria-label={`Decrease ${label}`} onClick={() => set(Math.max(min, value - 1))}>−</button>
      <output className="dm-val">{value}</output>
      <button className="dm-btn" aria-label={`Increase ${label}`} onClick={() => set(Math.min(max, value + 1))}>+</button>
    </div>
  );

  return (
    <div className="dm card">
      <div className="dm-top">
        <div className="dm-controls">
          <Stepper label="numerator" value={n} set={setN} min={1} max={99} />
          <Stepper label="denominator" value={d} set={setD} min={2} max={40} />
        </div>
        <div className="dm-result">
          <Tex>{`\\dfrac{${n}}{${d}} = ${decimalTex}`}</Tex>
          <span className={`dm-badge ${terminates ? 'term' : 'rep'}`}>{terminates ? 'Terminating' : 'Repeating'}</span>
        </div>
      </div>

      <div className="dm-grid">
        <div>
          <div className="dm-h">Long division, one digit at a time</div>
          <ol className="dm-steps">
            {steps.slice(0, 10).map((s, i) => (
              <li key={i} className={repeatStart >= 0 && i >= repeatStart ? 'rep' : ''}>
                <span className="dm-rem">remainder {s.r}</span>
                <span className="dm-arrow">→</span>
                <Tex>{`${s.r * 10} \\div ${d} = \\mathbf{${s.digit}}\\text{ r }${(s.r * 10) % d}`}</Tex>
              </li>
            ))}
            {steps.length === 0 && <li>{n} ÷ {d} divides evenly — no decimal digits needed.</li>}
            {steps.length > 10 && <li className="dm-more">…</li>}
          </ol>
          {repeatStart >= 0 && (
            <div className="dm-note">
              Remainder <strong>{steps[repeatStart].r}</strong> came back, so the same digits must come out again — forever. That's why the decimal repeats.
            </div>
          )}
          {terminates && digits.length > 0 && <div className="dm-note">The remainder reached <strong>0</strong>, so the division stops. The decimal terminates.</div>}
        </div>
        <div>
          <div className="dm-h">The shortcut: look at the denominator</div>
          <div className="dm-factor">
            {g > 1 && <div>Simplify first: <Tex>{`\\dfrac{${n}}{${d}} = \\dfrac{${n / g}}{${dd}}`}</Tex></div>}
            <div>
              <Tex>{`${dd} = ${factors.length ? factors.map((p) => (p === 2 || p === 5 ? `\\htmlClass{c-var}{${p}}` : `\\htmlClass{c-op}{${p}}`)).join(' \\cdot ') : '1'}`}</Tex>
            </div>
            <div className={`dm-verdict ${only25 ? 'term' : 'rep'}`}>
              {only25 ? 'Only 2s and 5s → the decimal terminates.' : 'A prime other than 2 or 5 → the decimal repeats.'}
            </div>
          </div>
          <p className="dm-why">
            Why? Our number system is base 10, and <Tex>{'10 = 2 \\cdot 5'}</Tex>. A fraction terminates exactly when its denominator can be
            scaled up to 10, 100, 1000, …
          </p>
        </div>
      </div>
    </div>
  );
}
