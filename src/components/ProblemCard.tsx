import { useEffect, useRef, useState } from 'react';
import type { Problem } from '../generators/types';
import { check, type Verdict } from '../lib/check';
import { MathInput } from './MathInput';
import { MathText } from './MathText';
import { RayFigure } from './RayFigure';
import { Plane } from './Plane';
import type { Figure } from '../generators/types';

interface Props {
  problem: Problem;
  /** Called once per problem with whether the first submitted answer was right. */
  onResult?: (correct: boolean) => void;
  /** Mastery mode: no hints, no retries, no solution until answered. */
  exam?: boolean;
  onNext?: () => void;
  nextLabel?: string;
}

export function ProblemCard({ problem, onResult, exam = false, onNext, nextLabel = 'Next problem' }: Props) {
  const [input, setInput] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [reported, setReported] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setInput('');
    setVerdict(null);
    setHints(0);
    setShowSolution(false);
    setReported(false);
  }, [problem]);

  const done = verdict?.status === 'correct' || (exam && verdict?.status === 'wrong') || showSolution;

  useEffect(() => {
    if (done) nextRef.current?.focus();
  }, [done]);

  const submit = (value: string | number) => {
    if (done) return;
    const v = check(problem, value);
    setVerdict(v);
    if (v.status !== 'invalid' && !reported) {
      setReported(true);
      onResult?.(v.status === 'correct');
    }
  };

  const a = problem.answer;

  return (
    <div className={`pc ${verdict?.status === 'correct' ? 'is-correct' : ''} ${verdict?.status === 'wrong' ? 'is-wrong' : ''}`}>
      <MathText as="div" className="pc-prompt">{problem.prompt}</MathText>
      {problem.figure && <FigureView fig={problem.figure} />}

      {a.type === 'choice' ? (
        <div className="pc-choices" role="group" aria-label="Choices">
          {a.options.map((opt, i) => (
            <button
              key={opt}
              className={`pc-choice ${done && i === a.correct ? 'right' : ''} ${verdict && input === String(i) && i !== a.correct ? 'wrong' : ''}`}
              disabled={done}
              onClick={() => {
                setInput(String(i));
                submit(i);
              }}
            >
              <MathText>{opt}</MathText>
            </button>
          ))}
        </div>
      ) : a.type === 'plot' ? (
        <GridAnswer
          mode={a.mode}
          value={input}
          disabled={done}
          answer={done ? a : undefined}
          onChange={(v) => {
            setInput(v);
            if (verdict?.status === 'invalid' || (!exam && verdict?.status === 'wrong')) setVerdict(null);
          }}
        />
      ) : (
        <MathInput
          value={input}
          onChange={(v) => {
            setInput(v);
            if (verdict?.status === 'invalid' || (!exam && verdict?.status === 'wrong')) setVerdict(null);
          }}
          onSubmit={() => submit(input)}
          disabled={done}
          allowEquation={a.type === 'equation' || a.type === 'inequality'}
          placeholder={problem.placeholder}
        />
      )}

      <div className="pc-actions">
        {!done && a.type !== 'choice' && (
          <button className="btn btn-primary" onClick={() => submit(input)}>Check</button>
        )}
        {!exam && !done && hints < problem.hints.length && (
          <button className="btn btn-ghost" onClick={() => setHints((h) => h + 1)}>
            💡 {hints === 0 ? 'Hint' : 'Another hint'}
          </button>
        )}
        {!exam && !done && (verdict?.status === 'wrong' || hints > 0) && (
          <button className="btn btn-ghost" onClick={() => { setShowSolution(true); if (!reported) { setReported(true); onResult?.(false); } }}>
            Show solution
          </button>
        )}
        {done && onNext && (
          <button ref={nextRef} className="btn btn-primary" onClick={onNext}>{nextLabel} →</button>
        )}
      </div>

      <div aria-live="polite">
        {verdict?.status === 'invalid' && <div className="pc-msg invalid">{verdict.message}</div>}
        {verdict?.status === 'correct' && <div className="pc-msg correct">✓ Correct!</div>}
        {verdict?.status === 'wrong' && !showSolution && (
          <div className="pc-msg wrong">
            ✗ Not quite.{' '}
            {verdict.feedback ? <MathText>{verdict.feedback}</MathText> : exam ? null : <span>Try again, or take a hint.</span>}
          </div>
        )}
      </div>

      {!exam && hints > 0 && !done && (
        <ol className="pc-hints">
          {problem.hints.slice(0, hints).map((h) => (
            <li key={h}><MathText>{h}</MathText></li>
          ))}
        </ol>
      )}

      {(showSolution || verdict?.status === 'correct' || (exam && verdict?.status === 'wrong')) && (
        <div className="pc-solution">
          <div className="pc-solution-title">Solution</div>
          {problem.solution.map((s) => (
            <MathText as="div" key={s}>{s}</MathText>
          ))}
        </div>
      )}
    </div>
  );
}

function FigureView({ fig }: { fig: Figure }) {
  if (fig.kind === 'ray') return <RayFigure {...fig} />;
  return (
    <div className="pc-plane">
      <Plane
        range={fig.range ?? 10}
        size={360}
        points={fig.points?.map((p) => ({ ...p, cls: p.open ? 'open' : undefined }))}
        lines={fig.lines}
        curves={[...(fig.curves ?? []).map((coefs) => ({ coefs })), ...(fig.pieces ?? [])]}
        xcurves={fig.xcurves?.map((coefs) => ({ coefs }))}
        segments={fig.segments}
        circles={fig.circles}
      />
    </div>
  );
}

/** Answer by clicking on a grid. The value is stored as "x,y;x,y". */
function GridAnswer({
  mode,
  value,
  onChange,
  disabled,
  answer,
}: {
  mode: 'point' | 'line';
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  answer?: Extract<Problem['answer'], { type: 'plot' }>;
}) {
  const pts = value.split(';').filter(Boolean).map((s) => s.split(',').map(Number) as [number, number])
    .filter((p) => p.length === 2 && p.every(Number.isFinite));
  const need = mode === 'point' ? 1 : 2;
  const pick = (x: number, y: number) => {
    if (disabled) return;
    const next = [...pts, [x, y] as [number, number]].slice(-need);
    onChange(next.map((p) => p.join(',')).join(';'));
  };
  const line = pts.length === 2 && !(pts[0][0] === pts[1][0] && pts[0][1] === pts[1][1])
    ? { a: pts[1][1] - pts[0][1], b: pts[0][0] - pts[1][0], c: (pts[1][1] - pts[0][1]) * pts[0][0] + (pts[0][0] - pts[1][0]) * pts[0][1], cls: 'mine' }
    : null;
  const correct = answer ? (answer.mode === 'line' ? [{ a: answer.a, b: answer.b, c: answer.c, cls: 'answer' }] : []) : [];
  return (
    <div className="pc-grid">
      <Plane
        size={360}
        onPick={pick}
        lines={[...correct, ...(line ? [line] : [])]}
        points={[
          ...(answer?.mode === 'point' ? [{ x: answer.x, y: answer.y, cls: 'answer' }] : []),
          ...pts.map(([x, y]) => ({ x, y, cls: 'mine', label: `(${x}, ${y})` })),
        ]}
        label="Click to place points"
      />
      <div className="pc-grid-help">
        {mode === 'point' ? 'Click the grid to place your point.' : `Click two points on the line (${pts.length}/2 placed). Clicking again replaces the oldest point.`}
        {pts.length > 0 && !disabled && <button className="btn btn-ghost" onClick={() => onChange('')}>Clear</button>}
      </div>
    </div>
  );
}
