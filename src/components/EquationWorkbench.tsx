import { useState } from 'react';
import { Frac } from '../lib/frac';
import { MathText, Tex } from './MathText';

/** A linear equation ax + b = cx + d, kept with exact fractions. */
interface Eq { a: Frac; b: Frac; c: Frac; d: Frac }
type Op = '+' | '−' | '×' | '÷';
interface Amount { coef: Frac; isVar: boolean } // e.g. 5, -2/3, 3x

interface Preset { label: string; a: number; b: number; c: number; d: number }

const F = (x: number) => Frac.of(x);

function sideTex(a: Frac, b: Frac, v: string) {
  const term = a.isZero() ? '' : a.eq(1) ? v : a.eq(-1) ? `-${v}` : `${a.tex()}${v}`;
  if (!term) return b.tex();
  if (b.isZero()) return term;
  return b.valueOf() < 0 ? `${term} - ${b.neg().tex()}` : `${term} + ${b.tex()}`;
}
const eqTex = (e: Eq, v: string) => `${sideTex(e.a, e.b, v)} = ${sideTex(e.c, e.d, v)}`;
const amountTex = (m: Amount, v: string) => (m.isVar ? (m.coef.eq(1) ? v : m.coef.eq(-1) ? `-${v}` : `${m.coef.tex()}${v}`) : m.coef.tex());

/** Parse "5", "-2/3", "0.5", "x", "-3x", "(2/3)x". */
function parseAmount(s: string, v: string): Amount | null {
  const t = s.replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/[()]/g, '');
  const m = t.match(new RegExp(`^([+-]?)(\\d*\\.?\\d*)(?:/(\\d+))?(${v})?$`));
  if (!m || (!m[2] && !m[4])) return null;
  const sign = m[1] === '-' ? -1 : 1;
  const num = m[2] ? Number(m[2]) : 1;
  if (!Number.isFinite(num)) return null;
  const den = m[3] ? Number(m[3]) : 1;
  if (den === 0) return null;
  return { coef: new Frac(sign * num, den), isVar: !!m[4] };
}

function apply(e: Eq, op: Op, m: Amount): Eq | string {
  const k = m.coef;
  if (op === '+' || op === '−') {
    const s = op === '+' ? k : k.neg();
    return m.isVar ? { ...e, a: e.a.add(s), c: e.c.add(s) } : { ...e, b: e.b.add(s), d: e.d.add(s) };
  }
  if (m.isVar) return 'Multiplying or dividing by a variable term isn’t allowed here — it could be zero.';
  if (k.isZero()) return op === '÷' ? 'You can’t divide by zero.' : 'Multiplying by 0 makes both sides 0 and loses the equation — not allowed!';
  const f = op === '×' ? k : new Frac(k.d, k.n);
  return { a: e.a.mul(f), b: e.b.mul(f), c: e.c.mul(f), d: e.d.mul(f) };
}

function status(e: Eq, v: string): { done: boolean; msg: string } {
  const varLeft = !e.a.isZero(), varRight = !e.c.isZero();
  if (e.a.eq(1) && e.b.isZero() && !varRight) return { done: true, msg: `Solved! $${v} = ${e.d.tex()}$` };
  if (e.c.eq(1) && e.d.isZero() && !varLeft) return { done: true, msg: `Solved! $${v} = ${e.b.tex()}$` };
  if (!varLeft && !varRight) return e.b.eq(e.d)
    ? { done: true, msg: `The variable is gone and $${e.b.tex()} = ${e.d.tex()}$ is always **true**: every real number is a solution.` }
    : { done: true, msg: `The variable is gone and $${e.b.tex()} = ${e.d.tex()}$ is **false**: there is no solution.` };
  if (varLeft && varRight) return { done: false, msg: `There are $${v}$-terms on both sides. Add or subtract a $${v}$-term to collect them on one side.` };
  const coef = varLeft ? e.a : e.c, cons = varLeft ? e.b : e.d;
  if (!cons.isZero()) return { done: false, msg: `Get the $${v}$-term alone: ${cons.valueOf() < 0 ? `add $${cons.neg().tex()}$` : `subtract $${cons.tex()}$`} on both sides.` };
  return { done: false, msg: `Now ${coef.d === 1 ? `divide both sides by $${coef.tex()}$` : `multiply both sides by the reciprocal, $${new Frac(coef.d, coef.n).tex()}$`}.` };
}

interface Props {
  presets: Preset[];
  /** Which operations to offer. The addition-principle lesson offers only + and −. */
  ops?: Op[];
  v?: string;
}

/** Solve an equation yourself: choose what to do to both sides, and the workbench does the arithmetic. */
export default function EquationWorkbench({ presets, ops = ['+', '−', '×', '÷'], v = 'x' }: Props) {
  const start = (i: number): Eq => ({ a: F(presets[i].a), b: F(presets[i].b), c: F(presets[i].c), d: F(presets[i].d) });
  const [pi, setPi] = useState(0);
  const [hist, setHist] = useState<{ eq: Eq; note?: string }[]>([{ eq: start(0) }]);
  const [op, setOp] = useState<Op>(ops[0]);
  const [amt, setAmt] = useState('');
  const [err, setErr] = useState('');
  const cur = hist[hist.length - 1].eq;
  const st = status(cur, v);

  const choose = (i: number) => { setPi(i); setHist([{ eq: start(i) }]); setErr(''); setAmt(''); };
  const go = () => {
    const m = parseAmount(amt, v);
    if (!m) { setErr(`Type a number like 5, -3, 2/3 or a term like 4${v}.`); return; }
    const r = apply(cur, op, m);
    if (typeof r === 'string') { setErr(r); return; }
    const verb = { '+': 'Add', '−': 'Subtract', '×': 'Multiply by', '÷': 'Divide by' }[op];
    setHist([...hist, { eq: r, note: `${verb} $${amountTex(m, v)}$ ${op === '+' ? 'to' : op === '−' ? 'from' : 'on'} both sides` }]);
    setErr('');
    setAmt('');
  };

  return (
    <div className="wb card">
      <div className="pr-tabs">
        {presets.map((p, i) => (
          <button key={p.label} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => choose(i)}>
            <Tex>{eqTex({ a: F(p.a), b: F(p.b), c: F(p.c), d: F(p.d) }, v)}</Tex>
          </button>
        ))}
      </div>

      <ol className="wb-hist">
        {hist.map((h, i) => (
          <li key={i} className={i === hist.length - 1 ? 'cur' : ''}>
            {h.note && <div className="wb-note">↓ <MathText>{h.note}</MathText></div>}
            <div className="wb-eq"><Tex>{eqTex(h.eq, v)}</Tex></div>
          </li>
        ))}
      </ol>

      <div className={`wb-status ${st.done ? 'done' : ''}`} aria-live="polite"><MathText>{st.msg}</MathText></div>

      {!st.done && (
        <div className="wb-controls">
          <span className="wb-lab">Do to both sides:</span>
          <div className="wb-ops" role="group" aria-label="Operation">
            {ops.map((o) => (
              <button key={o} className={`wb-op ${o === op ? 'on' : ''}`} onClick={() => setOp(o)} aria-pressed={o === op}>{o}</button>
            ))}
          </div>
          <input
            className="mi-input wb-amt"
            value={amt}
            placeholder={`e.g. 5 or 2${v}`}
            onChange={(e) => setAmt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') go(); }}
            aria-label="Amount"
          />
          <button className="btn btn-primary" onClick={go}>Apply</button>
        </div>
      )}
      {err && <div className="pc-msg invalid">{err}</div>}
      <div className="wb-actions">
        {hist.length > 1 && <button className="btn btn-ghost" onClick={() => setHist(hist.slice(0, -1))}>↶ Undo</button>}
        {hist.length > 1 && <button className="btn btn-ghost" onClick={() => choose(pi)}>↺ Start over</button>}
      </div>
    </div>
  );
}
