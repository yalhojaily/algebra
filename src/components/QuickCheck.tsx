import { useState } from 'react';
import { MathText } from './MathText';

interface Props {
  /** The question. May contain $...$. */
  question: string;
  /** Answer choices. May contain $...$. */
  options: string[];
  /** Index of the correct choice. */
  answer: number;
  /** Why the correct choice is right, shown once it is picked. */
  explain: string;
  /** Optional feedback for specific wrong choices, by index. */
  wrong?: Record<number, string>;
}

/** "Stop and check": a one-click question between sections, with instant feedback and an explanation. */
export default function QuickCheck({ question, options, answer, explain, wrong = {} }: Props) {
  const [tried, setTried] = useState<number[]>([]);
  const last = tried[tried.length - 1];
  const solved = tried.includes(answer);
  const pick = (i: number) => { if (!solved && !tried.includes(i)) setTried([...tried, i]); };
  return (
    <div className="qc card" role="group" aria-label="Stop and check">
      <div className="qc-head">
        <span className="qc-icon" aria-hidden="true">✋</span>
        <span className="qc-kicker">Stop and check</span>
        <span className="qc-tip">{solved ? '' : 'Pick an answer'}</span>
      </div>
      <MathText as="div" className="qc-q">{question}</MathText>
      <div className="qc-options">
        {options.map((o, i) => {
          const state = tried.includes(i) ? (i === answer ? 'ok' : 'bad') : solved ? 'dim' : '';
          return (
            <button key={i} className={`qc-opt ${state}`} onClick={() => pick(i)} disabled={solved || tried.includes(i)} aria-pressed={tried.includes(i)}>
              <span className="qc-letter">{String.fromCharCode(65 + i)}</span>
              <MathText>{o}</MathText>
            </button>
          );
        })}
      </div>
      {solved ? (
        <>
          <div className="qc-feedback ok" aria-live="polite"><span className="qc-mark">✓</span><div><strong>{tried.length === 1 ? 'Right!' : 'Yes — got it.'}</strong> <MathText>{explain}</MathText></div></div>
          <button className="btn btn-ghost qc-reset" onClick={() => setTried([])}>↺ Try again</button>
        </>
      ) : last !== undefined ? (
        <div className="qc-feedback bad" aria-live="polite"><span className="qc-mark">✗</span><div><strong>Not quite.</strong> <MathText>{wrong[last] ?? 'Think again and try another choice.'}</MathText></div></div>
      ) : null}
    </div>
  );
}
