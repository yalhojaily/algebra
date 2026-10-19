import { useState } from 'react';
import { MathText, Tex } from './MathText';

type Unknown = 'amount' | 'percent' | 'base';
const fmt = (x: number) => String(+x.toFixed(2));

/**
 * A double number line: percents on top, quantities underneath. Every percent problem is
 * "amount = percent × base"; choose which of the three is unknown.
 */
export default function PercentBar() {
  const [pct, setPct] = useState(35);
  const [base, setBase] = useState(240);
  const [unk, setUnk] = useState<Unknown>('amount');
  const amount = (pct / 100) * base;
  const W = 600, L = 20, R = 580;
  const x = (p: number) => L + (p / 150) * (R - L);

  const q = {
    amount: { ask: `What is $${pct}\\%$ of $${base}$?`, eq: `a = ${fmt(pct / 100)} \\times ${base}`, ans: `a = ${fmt(amount)}` },
    percent: { ask: `$${fmt(amount)}$ is what percent of $${base}$?`, eq: `${fmt(amount)} = p \\times ${base}`, ans: `p = \\dfrac{${fmt(amount)}}{${base}} = ${fmt(pct / 100)} = ${pct}\\%` },
    base: { ask: `$${fmt(amount)}$ is $${pct}\\%$ of what number?`, eq: `${fmt(amount)} = ${fmt(pct / 100)} \\times b`, ans: `b = \\dfrac{${fmt(amount)}}{${fmt(pct / 100)}} = ${base}` },
  }[unk];

  return (
    <div className="pb card">
      <div className="pr-tabs" role="tablist">
        {(['amount', 'percent', 'base'] as Unknown[]).map((u) => (
          <button key={u} className={`pr-tab ${u === unk ? 'on' : ''}`} onClick={() => setUnk(u)}>
            Find the {u === 'amount' ? 'amount' : u === 'percent' ? 'percent' : 'base (the whole)'}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} 120`} className="pb-svg" role="img" aria-label={`${pct} percent of ${base} is ${fmt(amount)}`}>
        <rect x={L} y={40} width={x(100) - L} height={34} rx={6} className="pb-whole" />
        <rect x={L} y={40} width={Math.max(0, x(pct) - L)} height={34} rx={6} className="pb-part" />
        <line x1={x(100)} x2={x(100)} y1={30} y2={84} className="pb-hundred" />
        {[0, 25, 50, 75, 100, 125, 150].map((t) => (
          <text key={t} x={x(t)} y={24} className="pb-top">{t}%</text>
        ))}
        <text x={x(pct)} y={100} className={`pb-mark ${unk === 'amount' ? 'unk' : ''}`}>{unk === 'amount' ? '?' : fmt(amount)}</text>
        <text x={x(100)} y={100} className={`pb-mark base ${unk === 'base' ? 'unk' : ''}`}>{unk === 'base' ? '?' : base}</text>
        <line x1={x(pct)} x2={x(pct)} y1={34} y2={80} className="pb-cursor" />
        <text x={x(pct)} y={116} className={`pb-pct ${unk === 'percent' ? 'unk' : ''}`}>{unk === 'percent' ? '?%' : `${pct}%`}</text>
      </svg>
      <div className="pb-flow">
        <div className="pb-row"><span className="el-step">Question</span><MathText>{q.ask}</MathText></div>
        <div className="pb-row"><span className="el-step">Translate</span><Tex>{q.eq}</Tex></div>
        <div className="pb-row el-result"><span className="el-step">Solve</span><Tex>{q.ans}</Tex></div>
      </div>
      <div className="am-controls">
        <label className="el-slider"><span>percent</span><input type="range" min={5} max={150} step={5} value={pct} onChange={(e) => setPct(Number(e.target.value))} /><output className="c-op">{pct}%</output></label>
        <label className="el-slider"><span>base (the whole)</span><input type="range" min={20} max={500} step={20} value={base} onChange={(e) => setBase(Number(e.target.value))} /><output className="c-var">{base}</output></label>
      </div>
      <p className="pb-key">Key words: <strong>“of”</strong> means ×, <strong>“is”</strong> means =, <strong>“what”</strong> is the unknown, and <strong>%</strong> means ÷ 100.</p>
    </div>
  );
}
