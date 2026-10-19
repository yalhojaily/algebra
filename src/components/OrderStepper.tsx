import { useMemo, useState } from 'react';
import { evaluationSteps, ParseError } from '../lib/expr';
import { Tex } from './MathText';

const presets = ['20 - 3*4 + 2', '(8 - 2)^2 / 4', '-3^2 + (-3)^2', '5 - 2[3 + (4 - 6)^2]', '36 / 4 * 3', '2{6 - [9 - (3 + 1)]}'];

const LADDER = [
  { key: 'group', label: 'Grouping symbols', sub: '( )  [ ]  { }' },
  { key: 'Exponent', label: 'Exponents', sub: 'x²' },
  { key: 'muldiv', label: 'Multiply & divide', sub: 'left to right' },
  { key: 'addsub', label: 'Add & subtract', sub: 'left to right' },
];

/** Type any numeric expression and simplify it one operation at a time, following the order of operations. */
export default function OrderStepper() {
  const [src, setSrc] = useState(presets[0]);
  const [i, setI] = useState(0);

  const run = useMemo(() => {
    try {
      return { ok: true as const, ...evaluationSteps(src) };
    } catch (e) {
      return { ok: false as const, message: e instanceof ParseError ? e.message : 'Something went wrong' };
    }
  }, [src]);

  const steps = run.ok ? run.steps : [];
  const done = i >= steps.length;
  const cur = run.ok ? (done ? (steps.length ? steps[steps.length - 1].after : run.start) : steps[i].before) : '';
  const active = run.ok && !done ? steps[i] : null;
  // Which rung of the ladder is this step on? A step inside grouping symbols counts as "grouping".
  const rung = active
    ? insideGroup(active.before)
      ? 'group'
      : active.action === 'Exponent'
        ? 'Exponent'
        : active.action === 'Multiply' || active.action === 'Divide'
          ? 'muldiv'
          : 'addsub'
    : null;

  return (
    <div className="os card">
      <div className="os-input">
        <label className="mi-label" htmlFor="os-src">Expression</label>
        <input
          id="os-src"
          className="mi-input"
          value={src}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => { setSrc(e.target.value); setI(0); }}
        />
        <div className="os-presets">
          {presets.map((p) => (
            <button key={p} className="tl-chip" onClick={() => { setSrc(p); setI(0); }}>{p}</button>
          ))}
        </div>
      </div>

      {!run.ok ? (
        <div className="pc-msg invalid">{run.message}</div>
      ) : (
        <div className="os-body">
          <ol className="os-ladder" aria-label="Order of operations">
            {LADDER.map((r, k) => (
              <li key={r.key} className={rung === r.key ? 'on' : ''}>
                <span className="os-rn">{k + 1}</span>
                <span><strong>{r.label}</strong><br /><small>{r.sub}</small></span>
              </li>
            ))}
          </ol>
          <div className="os-main">
            <div className="os-cur"><Tex display>{cur}</Tex></div>
            <div className="os-what" aria-live="polite">
              {active ? (
                <><span className="os-act">{active.action}</span> <Tex>{active.calc}</Tex></>
              ) : (
                <span className="os-done">Done! The value is <strong>{String(+run.result.toFixed(6))}</strong>.</span>
              )}
            </div>
            <div className="os-btns">
              <button className="btn" disabled={i === 0} onClick={() => setI((x) => x - 1)}>← Back</button>
              <button className="btn btn-primary" disabled={done} onClick={() => setI((x) => x + 1)}>Do this step →</button>
              <button className="btn btn-ghost" disabled={done} onClick={() => setI(steps.length)}>Show all</button>
            </div>
            {i > 0 && (
              <ol className="os-history">
                {steps.slice(0, i).map((s, k) => (
                  <li key={k}><Tex>{`= ${s.after}`}</Tex><span>{s.action.toLowerCase()}</span></li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Is the highlighted part a grouping, or nested inside one? Count unclosed \left delimiters before it. */
function insideGroup(tex: string): boolean {
  const at = tex.indexOf('\\htmlClass{hl}');
  if (tex.startsWith('\\htmlClass{hl}{\\left', at)) return true;
  const before = tex.slice(0, at);
  const opens = (before.match(/\\left/g) ?? []).length;
  const closes = (before.match(/\\right/g) ?? []).length;
  return opens > closes;
}
