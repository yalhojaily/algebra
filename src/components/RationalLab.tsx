import { useMemo, useState } from 'react';
import { Poly } from '../lib/poly';
import { factored, factoredTex, simplify, ratTex, type Factored } from '../lib/rational';
import { Tex } from './MathText';

type Mode = 'simplify' | 'multiply' | 'divide';

const presets: Record<Mode, string[][]> = {
  simplify: [['x^2 - 9', 'x^2 + x - 6'], ['2x^2 - 8', 'x^2 + 4x + 4'], ['x^2 - 5x', '25 - x^2'], ['3x + 12', 'x^2 + 4x']],
  multiply: [['x^2 - 4', 'x^2 + 3x', 'x', 'x + 2'], ['x^2 - x - 6', '2x + 4', '6', 'x - 3'], ['x^2 - 1', '3x', 'x^2', '1 - x']],
  divide: [['x^2 - 9', 'x^2 + x', 'x - 3', 'x + 1'], ['x^2 + 5x + 6', '4x', 'x + 2', '8x^2'], ['x^2 - 16', 'x + 1', 'x^2 + 4x', 'x^2 - 1']],
};

/** Roots of the linear factors of a factored polynomial. */
function zeros(f: Factored): number[] {
  return [...new Set(f.factors.filter((p) => p.degree() === 1).map((p) => { const [a, b] = p.coefs('x'); return -b / a; }))].sort((a, b) => a - b);
}

const parse = (s: string) => { try { const p = Poly.parse(s); return p.variables().every((v) => v === 'x') && p.degree() <= 4 && !p.isZero() ? p : null; } catch { return null; } };
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(+n.toFixed(3)));
const parTex = (f: Factored, P: Poly) => { const t = factoredTex(f); return P.size > 1 && !t.includes('(') ? `(${t})` : t; };

/** Factor, cancel and test with numbers: simplifying, multiplying and dividing rational expressions. */
export default function RationalLab({ mode = 'simplify' }: { mode?: Mode }) {
  const [pi, setPi] = useState(0);
  const [src, setSrc] = useState(presets[mode][0]);
  const [x, setX] = useState(2);
  const polys = src.map(parse);
  const ok = polys.every(Boolean);

  const info = useMemo(() => {
    if (!ok) return null;
    const ps = polys as Poly[];
    let N: Poly, D: Poly, excludedFrom: Poly[];
    let first = '', flip = '';
    const fr = (n: Poly, d: Poly) => `\\frac{${n.tex()}}{${d.tex()}}`;
    if (mode === 'simplify') {
      [N, D] = ps;
      excludedFrom = [D];
      first = fr(N, D);
    } else if (mode === 'multiply') {
      N = ps[0].mul(ps[2]);
      D = ps[1].mul(ps[3]);
      excludedFrom = [ps[1], ps[3]];
      first = `${fr(ps[0], ps[1])} \\cdot ${fr(ps[2], ps[3])}`;
    } else {
      N = ps[0].mul(ps[3]);
      D = ps[1].mul(ps[2]);
      excludedFrom = [ps[1], ps[3], ps[2]];
      first = `${fr(ps[0], ps[1])} \\div ${fr(ps[2], ps[3])}`;
      flip = `${fr(ps[0], ps[1])} \\cdot \\htmlClass{c-op}{${fr(ps[3], ps[2])}}`;
    }
    const s = simplify(N, D);
    const pieces = (list: Poly[]) => list.map((p) => parTex(factored(p), p)).join(' \\cdot ');
    const numList = mode === 'simplify' ? [ps[0]] : mode === 'multiply' ? [ps[0], ps[2]] : [ps[0], ps[3]];
    const denList = mode === 'simplify' ? [ps[1]] : mode === 'multiply' ? [ps[1], ps[3]] : [ps[1], ps[2]];
    const factoredStep = `\\frac{${pieces(numList)}}{${pieces(denList)}}`;
    const fn = factored(N), fd = factored(D);
    const cancelStep = `\\frac{${factoredTex(fn, { highlight: s.common, strike: true })}}{${factoredTex(fd, { highlight: s.common, strike: true })}}`;
    const bad = [...new Set(excludedFrom.flatMap((p) => zeros(factored(p))))].sort((a, b) => a - b);
    return { N, D, s, first, flip, factoredStep, cancelStep, bad, result: ratTex(s) };
  }, [src, mode]);

  const evalAt = (P: Poly, v: number) => P.evaluate({ x: v });
  let orig: string = '', simp: string = '';
  if (info) {
    const undefinedHere = info.bad.some((b) => Math.abs(b - x) < 1e-9);
    const sn = info.s.num.factors.reduce((a, b) => a.mul(b), Poly.const(info.s.num.c));
    const sd = info.s.den.factors.reduce((a, b) => a.mul(b), Poly.const(info.s.den.c));
    orig = undefinedHere ? 'undefined' : fmt(evalAt(info.N, x) / evalAt(info.D, x));
    const sv = evalAt(sd, x);
    simp = Math.abs(sv) < 1e-12 ? 'undefined' : fmt(evalAt(sn, x) / sv);
  }

  return (
    <div className="rl card">
      <div className="pr-tabs">
        {presets[mode].map((p, i) => (
          <button key={i} className={`pr-tab ${i === pi ? 'on' : ''}`} onClick={() => { setPi(i); setSrc(p); }}>
            {i + 1}
          </button>
        ))}
      </div>
      {mode === 'simplify' && (
        <div className="rl-inputs">
          <label className="mi-label">Numerator<input className="mi-input" value={src[0]} onChange={(e) => setSrc([e.target.value, src[1]])} spellCheck={false} /></label>
          <label className="mi-label">Denominator<input className="mi-input" value={src[1]} onChange={(e) => setSrc([src[0], e.target.value])} spellCheck={false} /></label>
        </div>
      )}
      {!info ? (
        <div className="pc-msg invalid">Type polynomials in x (degree 4 or less).</div>
      ) : (
        <>
          <ol className="ac-steps rl-steps">
            <li><span className="sr-num">1</span><div><div className="ac-h">Start</div><Tex>{`\\displaystyle ${info.first}`}</Tex></div></li>
            {mode === 'divide' && <li><span className="sr-num">2</span><div><div className="ac-h">Multiply by the reciprocal</div><Tex>{`\\displaystyle ${info.flip}`}</Tex></div></li>}
            <li><span className="sr-num">{mode === 'divide' ? 3 : 2}</span><div><div className="ac-h">Factor everything</div><Tex>{`\\displaystyle = ${info.factoredStep}`}</Tex></div></li>
            <li><span className="sr-num">{mode === 'divide' ? 4 : 3}</span><div><div className="ac-h">Cancel common factors</div><Tex>{`\\displaystyle = ${info.cancelStep}`}</Tex></div></li>
            <li className="rl-result"><span className="sr-num">{mode === 'divide' ? 5 : 4}</span><div><div className="ac-h">Simplified</div><Tex>{`\\displaystyle = ${info.result}`}</Tex>
              {info.bad.length > 0 && <div className="rl-bad">for <Tex>{`x \\ne ${info.bad.map(fmt).join(',\\ ')}`}</Tex></div>}</div></li>
          </ol>
          <div className="rl-test">
            <label className="el-slider"><span>Test with x =</span><input type="range" min={-6} max={6} value={x} onChange={(e) => setX(Number(e.target.value))} /><output className="c-var">{x}</output></label>
            <div className="rl-vals">
              <div><span className="el-step">Original</span> <strong className={orig === 'undefined' ? 'rl-undef' : ''}>{orig}</strong></div>
              <div><span className="el-step">Simplified</span> <strong className={simp === 'undefined' ? 'rl-undef' : ''}>{simp}</strong></div>
            </div>
            <p className="lb-note">
              {orig === 'undefined'
                ? `x = ${x} makes an original denominator 0, so the expression is undefined there${simp !== 'undefined' ? ' — even though the simplified form gives a number. That is why we list the excluded values.' : '.'}`
                : 'Same value — cancelling common factors does not change the expression (except where it was undefined).'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
