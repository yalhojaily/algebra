import { useState } from 'react';
import { MathText, Tex } from './MathText';

// Each step shows the formula after one "undo", with the operation used.
interface Step { tex: string; op?: string }
interface Target { v: string; steps: Step[] }
interface Formula { name: string; tex: string; targets: Target[] }

const formulas: Formula[] = [
  {
    name: 'Distance', tex: 'd = rt',
    targets: [
      { v: 't', steps: [{ tex: 'd = r\\htmlClass{hl}{t}' }, { tex: '\\dfrac{d}{r} = \\dfrac{rt}{r}', op: 'Divide both sides by $r$' }, { tex: 't = \\dfrac{d}{r}', op: 'Simplify and flip sides' }] },
      { v: 'r', steps: [{ tex: 'd = \\htmlClass{hl}{r}t' }, { tex: '\\dfrac{d}{t} = \\dfrac{rt}{t}', op: 'Divide both sides by $t$' }, { tex: 'r = \\dfrac{d}{t}', op: 'Simplify and flip sides' }] },
    ],
  },
  {
    name: 'Triangle area', tex: 'A = \\tfrac{1}{2}bh',
    targets: [
      { v: 'h', steps: [{ tex: 'A = \\tfrac{1}{2}b\\htmlClass{hl}{h}' }, { tex: '2A = bh', op: 'Multiply both sides by $2$' }, { tex: '\\dfrac{2A}{b} = h', op: 'Divide both sides by $b$' }, { tex: 'h = \\dfrac{2A}{b}', op: 'Write it with $h$ on the left' }] },
      { v: 'b', steps: [{ tex: 'A = \\tfrac{1}{2}\\htmlClass{hl}{b}h' }, { tex: '2A = bh', op: 'Multiply both sides by $2$' }, { tex: '\\dfrac{2A}{h} = b', op: 'Divide both sides by $h$' }, { tex: 'b = \\dfrac{2A}{h}', op: 'Write it with $b$ on the left' }] },
    ],
  },
  {
    name: 'Perimeter', tex: 'P = 2l + 2w',
    targets: [
      { v: 'l', steps: [{ tex: 'P = 2\\htmlClass{hl}{l} + 2w' }, { tex: 'P - 2w = 2l', op: 'Subtract $2w$ from both sides' }, { tex: '\\dfrac{P - 2w}{2} = l', op: 'Divide both sides by $2$' }, { tex: 'l = \\dfrac{P - 2w}{2}', op: 'Write it with $l$ on the left' }] },
      { v: 'w', steps: [{ tex: 'P = 2l + 2\\htmlClass{hl}{w}' }, { tex: 'P - 2l = 2w', op: 'Subtract $2l$ from both sides' }, { tex: 'w = \\dfrac{P - 2l}{2}', op: 'Divide both sides by $2$' }] },
    ],
  },
  {
    name: 'Temperature', tex: 'F = \\tfrac{9}{5}C + 32',
    targets: [
      { v: 'C', steps: [{ tex: 'F = \\tfrac{9}{5}\\htmlClass{hl}{C} + 32' }, { tex: 'F - 32 = \\tfrac{9}{5}C', op: 'Subtract $32$ from both sides' }, { tex: '\\tfrac{5}{9}(F - 32) = C', op: 'Multiply both sides by $\\tfrac{5}{9}$, the reciprocal of $\\tfrac{9}{5}$' }, { tex: 'C = \\tfrac{5}{9}(F - 32)', op: 'Write it with $C$ on the left' }] },
    ],
  },
  {
    name: 'Line', tex: 'y = mx + b',
    targets: [
      { v: 'x', steps: [{ tex: 'y = m\\htmlClass{hl}{x} + b' }, { tex: 'y - b = mx', op: 'Subtract $b$ from both sides' }, { tex: 'x = \\dfrac{y - b}{m}', op: 'Divide both sides by $m$' }] },
      { v: 'b', steps: [{ tex: 'y = mx + \\htmlClass{hl}{b}' }, { tex: 'y - mx = b', op: 'Subtract $mx$ from both sides' }, { tex: 'b = y - mx', op: 'Write it with $b$ on the left' }] },
    ],
  },
  {
    name: 'Average', tex: 'A = \\dfrac{a + b + c}{3}',
    targets: [
      { v: 'c', steps: [{ tex: 'A = \\dfrac{a + b + \\htmlClass{hl}{c}}{3}' }, { tex: '3A = a + b + c', op: 'Multiply both sides by $3$' }, { tex: '3A - a - b = c', op: 'Subtract $a$ and $b$ from both sides' }, { tex: 'c = 3A - a - b', op: 'Write it with $c$ on the left' }] },
    ],
  },
];


/** Solve a formula for one of its letters, one "undo" at a time. The target letter is highlighted. */
export default function FormulaSolver() {
  const [fi, setFi] = useState(1);
  const [ti, setTi] = useState(0);
  const [shown, setShown] = useState(1);
  const f = formulas[fi];
  const t = f.targets[Math.min(ti, f.targets.length - 1)];
  const done = shown >= t.steps.length;

  return (
    <div className="fs card">
      <div className="pr-tabs">
        {formulas.map((x, i) => (
          <button key={x.name} className={`pr-tab ${i === fi ? 'on' : ''}`} onClick={() => { setFi(i); setTi(0); setShown(1); }}>{x.name}</button>
        ))}
      </div>
      <div className="fs-target">
        Solve <Tex>{f.tex}</Tex> for
        {f.targets.map((x, i) => (
          <button key={x.v} className={`wb-op ${i === ti ? 'on' : ''}`} onClick={() => { setTi(i); setShown(1); }}><Tex>{x.v}</Tex></button>
        ))}
      </div>
      <ol className="wb-hist">
        {t.steps.slice(0, shown).map((s, i) => (
          <li key={i} className={i === shown - 1 ? 'cur' : ''}>
            {s.op && <div className="wb-note">↓ <MathText>{s.op}</MathText></div>}
            <div className="wb-eq"><Tex>{s.tex}</Tex></div>
          </li>
        ))}
      </ol>
      <div className="wb-actions">
        {!done ? (
          <button className="btn btn-primary" onClick={() => setShown((n) => n + 1)}>Next step →</button>
        ) : (
          <span className="fs-done">Solved for <Tex>{t.v}</Tex>. Each step undid one operation, in the reverse order they were applied to <Tex>{t.v}</Tex>.</span>
        )}
        {shown > 1 && <button className="btn btn-ghost" onClick={() => setShown(1)}>↺ Start over</button>}
      </div>
    </div>
  );
}
