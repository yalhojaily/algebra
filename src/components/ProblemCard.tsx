import { useEffect, useRef, useState } from 'react';
import type { Problem } from '../generators/types';
import { check, type Verdict } from '../lib/check';
import { MathInput } from './MathInput';
import { MathText } from './MathText';

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
      ) : (
        <MathInput
          value={input}
          onChange={(v) => {
            setInput(v);
            if (verdict?.status === 'invalid' || (!exam && verdict?.status === 'wrong')) setVerdict(null);
          }}
          onSubmit={() => submit(input)}
          disabled={done}
          allowEquation={a.type === 'equation'}
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
