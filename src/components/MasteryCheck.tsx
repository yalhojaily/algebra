import { useEffect, useState } from 'react';
import { registry } from '../generators';
import type { Problem } from '../generators/types';
import { getLesson, onProgress, recordMastery } from '../lib/progress';
import { ProblemCard } from './ProblemCard';

interface Props {
  lesson: string;
  size?: number;
  passMark?: number;
  nextHref?: string;
  nextTitle?: string;
}

export default function MasteryCheck({ lesson, size = 6, passMark = 5, nextHref, nextTitle }: Props) {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [mastered, setMastered] = useState(false);

  useEffect(() => {
    const sync = () => setMastered(getLesson(lesson).mastered);
    sync();
    return onProgress(sync);
  }, [lesson]);

  const start = () => {
    setProblems(registry[lesson].masterySet(size));
    setIndex(0);
    setResults([]);
  };

  const finished = problems && results.length === problems.length && index >= problems.length;
  const score = results.filter(Boolean).length;
  const passed = score >= passMark;

  return (
    <div className="mastery card">
      <div className="ms-head">
        <div>
          <div className="ms-kicker">Mastery check</div>
          <div className="ms-title">{size} questions · get {passMark} right to master this lesson</div>
        </div>
        {mastered && <span className="ms-badge">★ Mastered</span>}
      </div>

      {problems && (
        <div className="ms-dots" aria-label={`Question ${Math.min(index + 1, size)} of ${size}`}>
          {problems.map((_, i) => (
            <span key={i} className={`ms-dot ${results[i] === true ? 'ok' : results[i] === false ? 'bad' : i === index ? 'cur' : ''}`} />
          ))}
        </div>
      )}

      {!problems && (
        <div className="ms-intro">
          <p>No hints here — this is how you prove to yourself that the ideas stuck. You'll get fresh questions every time you try.</p>
          <button className="btn btn-primary" onClick={start}>{mastered ? 'Practice the check again' : 'Start the mastery check'}</button>
        </div>
      )}

      {problems && !finished && (
        <ProblemCard
          exam
          problem={problems[index]}
          onResult={(ok) => {
            const next = [...results, ok];
            setResults(next);
            if (next.length === problems.length) {
              const s = next.filter(Boolean).length;
              recordMastery(lesson, s / problems.length, s >= passMark);
            }
          }}
          onNext={() => setIndex((i) => i + 1)}
          nextLabel={index === problems.length - 1 ? 'See result' : 'Next question'}
        />
      )}

      {finished && (
        <div className={`ms-result ${passed ? 'pass' : 'fail'}`}>
          <div className="ms-score">{score} / {problems!.length}</div>
          {passed ? (
            <>
              <p><strong>Lesson mastered.</strong> {nextHref ? "You're ready for the next lesson." : 'The next lesson is on its way.'}</p>
              <div className="ms-actions">
                {nextHref && <a className="btn btn-primary" href={nextHref}>Continue: {nextTitle} →</a>}
                <button className="btn" onClick={start}>Try a new set</button>
              </div>
            </>
          ) : (
            <>
              <p>Almost there. Practice the skills you missed a few more times, then try a new set — you'll get different questions.</p>
              <div className="ms-actions">
                <button className="btn btn-primary" onClick={start}>Try a new set</button>
                <a className="btn" href="#practice">Back to practice</a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
