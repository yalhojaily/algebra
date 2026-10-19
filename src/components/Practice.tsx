import { useEffect, useMemo, useState } from 'react';
import { registry } from '../generators';
import { pick } from '../lib/random';
import { getLesson, onProgress, recordAttempt, type SkillStats } from '../lib/progress';
import { ProblemCard } from './ProblemCard';
import type { Problem } from '../generators/types';

interface Props {
  lesson: string;
  /** Limit to one skill (used for in-lesson "try it" boxes). Omit for the full practice set. */
  skill?: string;
  compact?: boolean;
}

const MIXED = 'mixed';

export default function Practice({ lesson, skill, compact }: Props) {
  const gens = registry[lesson];
  const [active, setActive] = useState(skill ?? MIXED);
  const make = (id: string) => (id === MIXED ? pick(gens.skills) : gens.skills.find((s) => s.id === id)!).generate();
  // Problems are random, so create the first one only in the browser (avoids a server/client mismatch).
  const [problem, setProblem] = useState<Problem | null>(null);
  const [stats, setStats] = useState<Record<string, SkillStats>>({});
  const [session, setSession] = useState({ right: 0, total: 0 });

  useEffect(() => setProblem(make(active)), []);
  useEffect(() => {
    const sync = () => setStats(getLesson(lesson).skills);
    sync();
    return onProgress(sync);
  }, [lesson]);

  const choose = (id: string) => {
    setActive(id);
    setProblem(make(id));
  };

  const streak = useMemo(() => (problem ? stats[problem.skill]?.streak ?? 0 : 0), [stats, problem]);

  return (
    <div className={`practice card ${compact ? 'compact' : ''}`}>
      {!skill && (
        <div className="pr-tabs" role="tablist" aria-label="Choose a skill">
          {[{ id: MIXED, label: 'Mixed' }, ...gens.skills].map((s) => {
            const st = stats[s.id];
            return (
              <button key={s.id} role="tab" aria-selected={active === s.id} className={`pr-tab ${active === s.id ? 'on' : ''}`} onClick={() => choose(s.id)}>
                {s.label}
                {st && st.correct > 0 && <span className="pr-count">{st.correct}✓</span>}
              </button>
            );
          })}
        </div>
      )}
      <div className="pr-meta">
        <span className="tag">{problem ? gens.skills.find((s) => s.id === problem.skill)?.label : '…'}</span>
        <span className="pr-score">
          {streak >= 3 && <span className="pr-streak">🔥 {streak} in a row</span>}
          {session.total > 0 && <span>{session.right}/{session.total} this session</span>}
        </span>
      </div>
      {!problem ? <div className="pr-loading" aria-hidden /> : <ProblemCard
        problem={problem}
        onResult={(ok) => {
          recordAttempt(lesson, problem.skill, ok);
          setSession((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
        }}
        onNext={() => setProblem(make(active))}
        nextLabel="New problem"
      />}
    </div>
  );
}
