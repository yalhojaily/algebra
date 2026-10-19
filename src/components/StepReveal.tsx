import { useState } from 'react';
import { MathText } from './MathText';

interface Step {
  /** The math or text of the step. May contain $...$. */
  show: string;
  /** Why this step is allowed. */
  why?: string;
}

interface Props {
  title: string;
  problem: string;
  steps: Step[];
  answer?: string;
}

/** A worked example that reveals one step at a time, so you can try predicting the next one. */
export default function StepReveal({ title, problem, steps, answer }: Props) {
  const [shown, setShown] = useState(0);
  const all = shown >= steps.length;
  return (
    <div className="sr card">
      <div className="sr-head">
        <span className="sr-kicker">Worked example</span>
        <span className="sr-title">{title}</span>
      </div>
      <MathText as="div" className="sr-problem">{problem}</MathText>
      <ol className="sr-steps">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className="sr-step">
            <span className="sr-num">{i + 1}</span>
            <div>
              <MathText as="div" className="sr-show">{s.show}</MathText>
              {s.why && <MathText as="div" className="sr-why">{s.why}</MathText>}
            </div>
          </li>
        ))}
      </ol>
      {all && answer && <MathText as="div" className="sr-answer">{answer}</MathText>}
      <div className="sr-actions">
        {!all ? (
          <>
            <button className="btn btn-primary" onClick={() => setShown((n) => n + 1)}>
              {shown === 0 ? 'Show first step' : 'Next step'}
            </button>
            <span className="sr-prompt">{shown === 0 ? 'Try it yourself first.' : 'Can you guess the next step?'}</span>
            {shown > 0 && <button className="btn btn-ghost" onClick={() => setShown(steps.length)}>Show all</button>}
          </>
        ) : (
          <button className="btn btn-ghost" onClick={() => setShown(0)}>↺ Hide steps</button>
        )}
      </div>
    </div>
  );
}
