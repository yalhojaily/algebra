import { useState } from 'react';
import { Tex } from './MathText';

// Phrases are split into parts so each word can be colored the same as its symbol.
type Part = { t: string; k?: 'var' | 'num' | 'op' };
interface Row {
  op: '+' | '−' | '×' | '÷';
  parts: (n: number) => Part[];
  tex: (n: number) => string;
  flips?: boolean;
  note?: string;
}

const v = '\\htmlClass{c-var}{x}';
const num = (n: number) => `\\htmlClass{c-num}{${n}}`;
const op = (s: string) => `\\htmlClass{c-op}{${s}}`;

const rows: Row[] = [
  { op: '+', parts: (n) => [{ t: String(n), k: 'num' }, { t: ' more than ', k: 'op' }, { t: 'x', k: 'var' }], tex: (n) => `${v} ${op('+')} ${num(n)}` },
  { op: '+', parts: (n) => [{ t: 'x', k: 'var' }, { t: ' increased by ', k: 'op' }, { t: String(n), k: 'num' }], tex: (n) => `${v} ${op('+')} ${num(n)}` },
  { op: '+', parts: (n) => [{ t: 'the ' }, { t: 'sum', k: 'op' }, { t: ' of ' }, { t: 'x', k: 'var' }, { t: ' and ' }, { t: String(n), k: 'num' }], tex: (n) => `${v} ${op('+')} ${num(n)}` },
  { op: '−', parts: (n) => [{ t: String(n), k: 'num' }, { t: ' less than ', k: 'op' }, { t: 'x', k: 'var' }], tex: (n) => `${v} ${op('-')} ${num(n)}`, flips: true, note: 'Start with x, then take the number away.' },
  { op: '−', parts: (n) => [{ t: 'x', k: 'var' }, { t: ' decreased by ', k: 'op' }, { t: String(n), k: 'num' }], tex: (n) => `${v} ${op('-')} ${num(n)}` },
  { op: '−', parts: (n) => [{ t: 'x', k: 'var' }, { t: ' subtracted from ', k: 'op' }, { t: String(n), k: 'num' }], tex: (n) => `${num(n)} ${op('-')} ${v}`, flips: true, note: 'Start with the number, then take x away.' },
  { op: '×', parts: (n) => [{ t: String(n), k: 'num' }, { t: ' times ', k: 'op' }, { t: 'x', k: 'var' }], tex: (n) => `${num(n)}${v}` },
  { op: '×', parts: () => [{ t: 'twice', k: 'op' }, { t: ' ' }, { t: 'x', k: 'var' }], tex: () => `${num(2)}${v}`, note: '"Twice" hides the number 2.' },
  { op: '×', parts: (n) => [{ t: String(n), k: 'num' }, { t: '% of', k: 'op' }, { t: ' ' }, { t: 'x', k: 'var' }], tex: (n) => `${num(n / 100)}${v}`, note: 'Write the percent as a decimal; "of" means multiply.' },
  { op: '÷', parts: (n) => [{ t: 'x', k: 'var' }, { t: ' divided by ', k: 'op' }, { t: String(n), k: 'num' }], tex: (n) => `\\dfrac{${v}}{${num(n)}}` },
  { op: '÷', parts: (n) => [{ t: 'the ' }, { t: 'quotient', k: 'op' }, { t: ' of ' }, { t: String(n), k: 'num' }, { t: ' and ' }, { t: 'x', k: 'var' }], tex: (n) => `\\dfrac{${num(n)}}{${v}}` },
];

const groups: { op: Row['op']; name: string }[] = [
  { op: '+', name: 'Addition' },
  { op: '−', name: 'Subtraction' },
  { op: '×', name: 'Multiplication' },
  { op: '÷', name: 'Division' },
];

export default function TranslateLab() {
  const [ri, setRi] = useState(3);
  const [n, setN] = useState(5);
  const r = rows[ri];
  const shown = r.parts(n).some((p) => p.t.includes('%')) ? n * 5 : n;

  return (
    <div className="tl card">
      <div className="tl-grid">
        <div className="tl-list">
          {groups.map((g) => (
            <div key={g.op} className="tl-group">
              <div className="tl-gname"><span className="tl-op">{g.op}</span>{g.name}</div>
              <div className="tl-chips">
                {rows.map((row, i) =>
                  row.op === g.op ? (
                    <button key={i} className={`tl-chip ${i === ri ? 'on' : ''}`} onClick={() => setRi(i)}>
                      {row.parts(n).map((p) => (p.k === 'num' ? '□' : p.t)).join('')}
                      {row.flips && <span className="tl-flip" title="Order flips">⇄</span>}
                    </button>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="tl-stage">
          <div className="tl-phrase">
            {r.parts(shown).map((p, i) => (
              <span key={i} className={p.k ? `c-${p.k}` : ''}>{p.t}</span>
            ))}
          </div>
          <div className="tl-arrow" aria-hidden>↓</div>
          <div className="tl-expr"><Tex display>{r.tex(shown)}</Tex></div>
          {r.flips && <div className="tl-warn">⇄ Order flips! {r.note}</div>}
          {!r.flips && r.note && <div className="tl-note">{r.note}</div>}
          <label className="el-slider tl-n">
            <span>Change the number</span>
            <input type="range" min={1} max={20} value={n} onChange={(e) => setN(Number(e.target.value))} />
            <output className="c-num">{shown}</output>
          </label>
        </div>
      </div>
    </div>
  );
}
