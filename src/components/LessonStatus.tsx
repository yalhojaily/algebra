import { useEffect, useState } from 'react';
import { getLesson, markVisited, onProgress, resetLesson, type LessonProgress } from '../lib/progress';

/** Small status pill in the lesson header; also marks the lesson as visited. */
export default function LessonStatus({ lesson }: { lesson: string }) {
  const [p, setP] = useState<LessonProgress | null>(null);
  useEffect(() => {
    markVisited(lesson);
    const sync = () => setP(getLesson(lesson));
    sync();
    return onProgress(sync);
  }, [lesson]);
  if (!p) return <span className="ls ls-loading" />;
  const solved = Object.values(p.skills).reduce((a, s) => a + s.correct, 0);
  return (
    <span className={`ls ${p.mastered ? 'mastered' : ''}`}>
      {p.mastered ? '★ Mastered' : solved > 0 ? `${solved} solved · not yet mastered` : 'Not started'}
      {(p.mastered || solved > 0) && (
        <button className="ls-reset" title="Reset progress for this lesson" onClick={() => { if (confirm('Reset your progress for this lesson?')) resetLesson(lesson); }}>
          reset
        </button>
      )}
    </span>
  );
}
