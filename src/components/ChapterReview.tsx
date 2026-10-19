import { useEffect, useState } from 'react';
import { registry } from '../generators';
import type { Problem } from '../generators/types';
import { recordAttempt } from '../lib/progress';
import { pick } from '../lib/random';
import { ProblemCard } from './ProblemCard';

export interface LessonRef {
  id: string;
  title: string;
  href: string;
}

const ALL = 'all';

/** Mixed review across a chapter: random problems from every lesson, or focus on one lesson. */
export default function ChapterReview({ lessons }: { lessons: LessonRef[] }) {
  const [active, setActive] = useState(ALL);
  const [current, setCurrent] = useState<{ lesson: string; problem: Problem } | null>(null);
  const [session, setSession] = useState({ right: 0, total: 0 });

  const make = (which: string) => {
    const lesson = which === ALL ? pick(lessons).id : which;
    return { lesson, problem: pick(registry[lesson].skills).generate() };
  };
  useEffect(() => setCurrent(make(active)), []);

  const ref = current && lessons.find((l) => l.id === current.lesson);

  return (
    <div className="practice card">
      <div className="pr-tabs" role="tablist" aria-label="Choose lessons">
        {[{ id: ALL, title: 'All lessons' }, ...lessons].map((l) => (
          <button key={l.id} role="tab" aria-selected={active === l.id} className={`pr-tab ${active === l.id ? 'on' : ''}`} onClick={() => { setActive(l.id); setCurrent(make(l.id)); }}>
            {l.id === ALL ? l.title : l.id}
          </button>
        ))}
      </div>
      <div className="pr-meta">
        {ref ? <a className="tag" href={ref.href}>{ref.id} {ref.title}</a> : <span className="tag">…</span>}
        <span className="pr-score">{session.total > 0 && <span>{session.right}/{session.total} this session</span>}</span>
      </div>
      {!current ? (
        <div className="pr-loading" aria-hidden />
      ) : (
        <ProblemCard
          problem={current.problem}
          onResult={(ok) => {
            recordAttempt(current.lesson, current.problem.skill, ok);
            setSession((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
          }}
          onNext={() => setCurrent(make(active))}
          nextLabel="New problem"
        />
      )}
    </div>
  );
}
