import { useEffect, useState } from 'react';
import { registry } from '../generators';
import type { Problem } from '../generators/types';
import { getLesson, onProgress, recordMastery } from '../lib/progress';
import { pick, shuffle } from '../lib/random';
import { ProblemCard } from './ProblemCard';
import type { LessonRef } from './ChapterReview';

interface Props {
  id: string; // progress key, e.g. "ch1-test"
  lessons: LessonRef[];
  perLesson?: number;
  passPercent?: number;
}

/** A chapter test: a few fresh questions from every lesson, with a per-lesson breakdown at the end. */
export default function ChapterTest({ id, lessons, perLesson = 2, passPercent = 80 }: Props) {
  const [items, setItems] = useState<{ lesson: string; problem: Problem }[] | null>(null);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [best, setBest] = useState<{ passed: boolean; score?: number }>({ passed: false });

  useEffect(() => {
    const sync = () => {
      const p = getLesson(id);
      setBest({ passed: p.mastered, score: p.bestScore });
    };
    sync();
    return onProgress(sync);
  }, [id]);

  const start = () => {
    const list = lessons.flatMap((l) => {
      const skills = shuffle(registry[l.id].skills);
      return Array.from({ length: perLesson }, (_, k) => ({ lesson: l.id, problem: (skills[k] ?? pick(skills)).generate() }));
    });
    setItems(list); // keep lesson order: the test builds up like the chapter does
    setIndex(0);
    setResults([]);
  };

  const total = items?.length ?? lessons.length * perLesson;
  const need = Math.ceil((total * passPercent) / 100);
  const finished = items && results.length === items.length && index >= items.length;
  const score = results.filter(Boolean).length;

  return (
    <div className="mastery card">
      <div className="ms-head">
        <div>
          <div className="ms-kicker">Chapter test</div>
          <div className="ms-title">{total} questions · {need} correct to pass</div>
        </div>
        {best.passed && <span className="ms-badge">★ Passed{best.score !== undefined ? ` · best ${Math.round(best.score * 100)}%` : ''}</span>}
      </div>

      {items && (
        <div className="ms-dots" aria-label={`Question ${Math.min(index + 1, total)} of ${total}`}>
          {items.map((_, i) => (
            <span key={i} className={`ms-dot ${results[i] === true ? 'ok' : results[i] === false ? 'bad' : i === index ? 'cur' : ''}`} />
          ))}
        </div>
      )}

      {!items && (
        <div className="ms-intro">
          <p>Questions come from every lesson in the chapter, in order, with no hints. Use it as a practice exam: when you finish, you'll see which lessons to review.</p>
          <button className="btn btn-primary" onClick={start}>{best.passed ? 'Take a new test' : 'Start the chapter test'}</button>
        </div>
      )}

      {items && !finished && (
        <>
          <div className="pr-meta">
            <span className="tag">From {items[index].lesson} {lessons.find((l) => l.id === items[index].lesson)?.title}</span>
            <span className="pr-score">Question {index + 1} of {total}</span>
          </div>
          <ProblemCard
            exam
            problem={items[index].problem}
            onResult={(ok) => {
              const next = [...results, ok];
              setResults(next);
              if (next.length === items.length) {
                const s = next.filter(Boolean).length;
                recordMastery(id, s / items.length, s >= need);
              }
            }}
            onNext={() => setIndex((i) => i + 1)}
            nextLabel={index === items.length - 1 ? 'See result' : 'Next question'}
          />
        </>
      )}

      {finished && (
        <div className={`ms-result ${score >= need ? 'pass' : 'fail'}`}>
          <div className="ms-score">{score} / {items!.length}</div>
          <p>{score >= need ? <><strong>Chapter passed.</strong> Great work.</> : <>Not yet — you need {need}. Review the lessons marked below, then take a new test.</>}</p>
          <table className="nice ct-table">
            <thead><tr><th>Lesson</th><th>Score</th><th></th></tr></thead>
            <tbody>
              {lessons.map((l) => {
                const idx = items!.map((it, i) => (it.lesson === l.id ? i : -1)).filter((i) => i >= 0);
                const got = idx.filter((i) => results[i]).length;
                const weak = got < idx.length;
                return (
                  <tr key={l.id} className={weak ? 'weak' : ''}>
                    <td><a href={l.href}>{l.id} {l.title}</a></td>
                    <td>{got} / {idx.length}</td>
                    <td>{weak ? <a href={l.href}>Review →</a> : '✓'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="ms-actions"><button className="btn btn-primary" onClick={start}>Take a new test</button></div>
        </div>
      )}
    </div>
  );
}
