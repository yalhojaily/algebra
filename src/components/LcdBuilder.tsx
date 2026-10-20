import { useMemo, useState } from 'react';
import { Poly } from '../lib/poly';
import { factored } from '../lib/rational';
import { Tex } from './MathText';

const presets: string[][] = [
  ['x^2 - 4', 'x^2 + 4x + 4'],
  ['6x^2', '4x^3 + 8x^2'],
  ['x^2 - x - 6', 'x^2 - 9', 'x + 2'],
  ['12', '18'],
];

function primes(n: number) {
  const out: number[] = [];
  let m = Math.abs(n);
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; }
  if (m > 1) out.push(m);
  return out;
}

interface Piece { key: string; tex: string; poly: Poly }

/** Break each denominator into prime factors; the LCD takes every factor the most times it appears in any one denominator. */
function pieces(P: Poly): Piece[] {
  const f = factored(P);
  const nums = primes(f.c).map((p) => ({ key: `n${p}`, tex: String(p), poly: Poly.const(p) }));
  const polys = f.factors.map((q) => ({ key: q.text(), tex: q.size > 1 ? `(${q.tex()})` : q.tex(), poly: q }));
  return [...nums, ...polys];
}

export default function LcdBuilder() {
  const [src, setSrc] = useState(presets[0]);
  const parsed = useMemo(() => src.map((s) => { try { const p = Poly.parse(s); return p.variables().every((v) => v === 'x') && !p.isZero() && p.degree() <= 4 ? p : null; } catch { return null; } }), [src]);
  const ok = parsed.every(Boolean);
  const table = useMemo(() => {
    if (!ok) return null;
    const lists = (parsed as Poly[]).map(pieces);
    const keys: Piece[] = [];
    for (const l of lists) for (const p of l) if (!keys.some((k) => k.key === p.key)) keys.push(p);
    keys.sort((a, b) => (a.key.startsWith('n') === b.key.startsWith('n') ? 0 : a.key.startsWith('n') ? -1 : 1));
    const counts = lists.map((l) => keys.map((k) => l.filter((p) => p.key === k.key).length));
    const max = keys.map((_, j) => Math.max(...counts.map((c) => c[j])));
    let lcd = Poly.const(1);
    keys.forEach((k, j) => { lcd = lcd.mul(k.poly.pow(max[j])); });
    const num = keys.filter((k) => k.key.startsWith('n')).reduce((a, k) => a * Number(k.tex) ** max[keys.indexOf(k)], 1);
    const lcdTex = `${num > 1 ? num : ''}${keys.filter((k) => !k.key.startsWith('n')).map((k) => (max[keys.indexOf(k)] > 1 ? `${k.tex}^{${max[keys.indexOf(k)]}}` : k.tex)).join('')}` || '1';
    // what each denominator is missing
    const missing = counts.map((c) => keys.map((k, j) => (max[j] - c[j] > 0 ? (max[j] - c[j] > 1 ? `${k.tex}^{${max[j] - c[j]}}` : k.tex) : '')).filter(Boolean).join(' \\cdot ') || '1');
    return { keys, counts, max, lcd, lcdTex, missing };
  }, [src]);

  return (
    <div className="lcd card">
      <div className="os-presets">
        {presets.map((p) => <button key={p.join()} className="tl-chip" onClick={() => setSrc(p)}>{p.join('  ,  ')}</button>)}
      </div>
      <div className="lcd-inputs">
        {src.map((s, i) => (
          <label key={i} className="mi-label">Denominator {i + 1}
            <input className="mi-input" value={s} onChange={(e) => setSrc(src.map((t, j) => (j === i ? e.target.value : t)))} spellCheck={false} />
          </label>
        ))}
        <div className="lcd-btns">
          {src.length < 3 && <button className="btn btn-ghost" onClick={() => setSrc([...src, 'x'])}>+ Add</button>}
          {src.length > 2 && <button className="btn btn-ghost" onClick={() => setSrc(src.slice(0, -1))}>− Remove</button>}
        </div>
      </div>
      {!table ? <div className="pc-msg invalid">Type polynomials in x.</div> : (
        <>
          <div className="lcd-scroll">
            <table className="nice lcd-table">
              <thead><tr><th>Denominator</th>{table.keys.map((k) => <th key={k.key}><Tex>{k.tex}</Tex></th>)}<th>Needs</th></tr></thead>
              <tbody>
                {(parsed as Poly[]).map((P, i) => (
                  <tr key={i}>
                    <td><Tex>{P.tex()}</Tex></td>
                    {table.counts[i].map((c, j) => <td key={j} className={c === table.max[j] && c > 0 ? 'hit' : c ? '' : 'zero'}>{c || '·'}</td>)}
                    <td><Tex>{table.missing[i]}</Tex></td>
                  </tr>
                ))}
                <tr className="lcd-max"><td>LCD uses</td>{table.max.map((m, j) => <td key={j}>{m}</td>)}<td /></tr>
              </tbody>
            </table>
          </div>
          <div className="bx-final"><Tex>{`\\text{LCD} = ${table.lcdTex}${table.lcd.size > 1 ? ` = ${table.lcd.tex()}` : ''}`}</Tex></div>
          <p className="lb-note">Each column counts how many times a factor appears. The LCD takes the <strong>largest</strong> count in each column. The last column shows what each denominator must be multiplied by to become the LCD.</p>
        </>
      )}
    </div>
  );
}
