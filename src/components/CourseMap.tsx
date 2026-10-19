import { useEffect, useState } from 'react';
import type { Chapter } from '../data/curriculum';
import { getAll, onProgress, type LessonProgress } from '../lib/progress';

interface Props {
  chapters: Chapter[];
  /** Lesson ids that have content, mapped to their URL. */
  available: Record<string, string>;
}

type Status = 'mastered' | 'started' | 'ready' | 'soon';

/** The course as a map: every lesson, colored by your progress, with prerequisites shown on hover/focus. */
export default function CourseMap({ chapters, available }: Props) {
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [focus, setFocus] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setProgress(getAll());
    sync();
    return onProgress(sync);
  }, []);

  const all = chapters.flatMap((c) => c.lessons);
  const focused = all.find((l) => l.id === focus);
  const prereqSet = new Set(focused?.prereqs ?? []);
  const unlocks = new Set(all.filter((l) => focus && l.prereqs.includes(focus)).map((l) => l.id));

  const status = (id: string): Status => {
    if (!available[id]) return 'soon';
    const p = progress[id];
    if (p?.mastered) return 'mastered';
    if (p && (p.visited || Object.keys(p.skills).length)) return 'started';
    return 'ready';
  };

  const masteredCount = all.filter((l) => progress[l.id]?.mastered).length;

  return (
    <div className="cm">
      <div className="cm-bar">
        <div className="cm-progress" aria-label={`${masteredCount} of ${all.length} lessons mastered`}>
          <div className="cm-progress-fill" style={{ width: `${(masteredCount / all.length) * 100}%` }} />
        </div>
        <span className="cm-count">{masteredCount} / {all.length} lessons mastered</span>
        <span className="cm-legend">
          <i className="lg mastered" /> Mastered <i className="lg started" /> In progress <i className="lg ready" /> Ready <i className="lg soon" /> Coming soon
        </span>
      </div>
      <div className="cm-hint">{focused ? (
        <>
          <strong>{focused.id} {focused.title}</strong>
          {focused.prereqs.length ? <> builds on <span className="cm-pre-chip">{focused.prereqs.join(', ')}</span></> : <> is a starting point</>}
          {unlocks.size > 0 && <> · leads to <span className="cm-next-chip">{[...unlocks].join(', ')}</span></>}
        </>
      ) : 'Hover or focus a lesson to see what it builds on and what it leads to.'}</div>

      <div className="cm-chapters">
        {chapters.map((c) => (
          <section key={c.number} className="cm-ch">
            <header className="cm-ch-head">
              <span className="cm-ch-num">{c.number}</span>
              <span className="cm-ch-title">{c.title}</span>
            </header>
            <ol className="cm-lessons">
              {c.lessons.map((l) => {
                const st = status(l.id);
                const rel = l.id === focus ? 'self' : prereqSet.has(l.id) ? 'pre' : unlocks.has(l.id) ? 'next' : '';
                const inner = (
                  <>
                    <span className="cm-id">{l.id}</span>
                    <span className="cm-name">{l.title}</span>
                    {st === 'mastered' && <span className="cm-star" aria-label="mastered">★</span>}
                  </>
                );
                const common = {
                  className: `cm-lesson ${st} ${rel}`,
                  onMouseEnter: () => setFocus(l.id),
                  onMouseLeave: () => setFocus(null),
                  onFocus: () => setFocus(l.id),
                  onBlur: () => setFocus(null),
                };
                return (
                  <li key={l.id}>
                    {available[l.id] ? <a href={available[l.id]} {...common}>{inner}</a> : <span tabIndex={0} {...common}>{inner}</span>}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
