import { useState } from 'react';
import { NumberLineSet, type Part } from './NumberLineSet';
import { Tex } from './MathText';

type Rel = 'eq' | 'lt' | 'gt';

/** |x − h| is the distance from x to h. "= d" is two points, "< d" is the stretch between them, "> d" is everything outside. */
export default function AbsDistance() {
  const [h, setH] = useState(2);
  const [d, setD] = useState(3);
  const [rel, setRel] = useState<Rel>('lt');
  const inner = h === 0 ? 'x' : `x ${h < 0 ? '+' : '-'} ${Math.abs(h)}`;
  const parts: Part[] = rel === 'lt' ? [{ lo: h - d, hi: h + d, loClosed: false, hiClosed: false }] : rel === 'gt' ? [{ lo: -Infinity, hi: h - d, loClosed: false, hiClosed: false }, { lo: h + d, hi: Infinity, loClosed: false, hiClosed: false }] : [];
  const pts = rel === 'eq' ? [h - d, h + d] : [];
  const sym = { eq: '=', lt: '<', gt: '>' }[rel];
  const result = rel === 'eq' ? `x = ${h - d} \\text{ or } x = ${h + d}` : rel === 'lt' ? `${h - d} < x < ${h + d}` : `x < ${h - d} \\text{ or } x > ${h + d}`;
  const interval = rel === 'eq' ? '' : rel === 'lt' ? `(${h - d}, ${h + d})` : `(-\\infty, ${h - d}) \\cup (${h + d}, \\infty)`;
  return (
    <div className="ad card">
      <div className="pr-tabs">
        {(['eq', 'lt', 'gt'] as Rel[]).map((r) => <button key={r} className={`pr-tab ${r === rel ? 'on' : ''}`} onClick={() => setRel(r)}><Tex>{`|X| ${{ eq: '=', lt: '<', gt: '>' }[r]} d`}</Tex></button>)}
      </div>
      <div className="lb-eq"><Tex>{`|${inner}| ${sym} ${d}`}</Tex></div>
      <div className="ad-line">
        <NumberLineSet parts={parts} points={pts} min={-12} max={12} />
        <div className="ad-center" style={{ left: `${((22 + ((h + 12) / 24) * 476) / 520) * 100}%` }}>center {h}</div>
      </div>
      <div className="pb-row el-result"><Tex>{result}</Tex></div>
      {interval && <div className="pb-row"><span className="el-step">Interval</span><Tex>{interval}</Tex></div>}
      <p className="lb-note">Read <Tex>{`|${inner}|`}</Tex> as "the distance from <Tex>x</Tex> to <Tex>{String(h)}</Tex>." Equal to {d}: exactly {d} steps away on either side. Less than {d}: closer than that — one interval. Greater than {d}: farther — two separate pieces.</p>
      <div className="am-controls">
        <label className="el-slider"><span>center h</span><input type="range" min={-5} max={5} value={h} onChange={(e) => setH(Number(e.target.value))} /><output className="c-var">{h}</output></label>
        <label className="el-slider"><span>distance d</span><input type="range" min={1} max={6} value={d} onChange={(e) => setD(Number(e.target.value))} /><output className="c-op">{d}</output></label>
      </div>
    </div>
  );
}
