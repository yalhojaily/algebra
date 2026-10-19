// Learner progress, stored in the browser (localStorage). Later this can sync to a backend.

export interface SkillStats {
  attempts: number;
  correct: number;
  streak: number;
}

export interface LessonProgress {
  mastered: boolean;
  masteredAt?: string;
  bestScore?: number;
  skills: Record<string, SkillStats>;
  visited?: boolean;
}

type Store = Record<string, LessonProgress>;

const KEY = 'algebra:progress:v1';
const EVENT = 'algebra:progress';

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Store;
  } catch {
    return {};
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable (private mode) — progress just won't persist */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

const blank = (): LessonProgress => ({ mastered: false, skills: {} });

export function getLesson(id: string): LessonProgress {
  return read()[id] ?? blank();
}

export function getAll(): Store {
  return read();
}

export function markVisited(id: string) {
  const s = read();
  s[id] = { ...(s[id] ?? blank()), visited: true };
  write(s);
}

export function recordAttempt(lessonId: string, skill: string, correct: boolean) {
  const s = read();
  const l = s[lessonId] ?? blank();
  const st = l.skills[skill] ?? { attempts: 0, correct: 0, streak: 0 };
  st.attempts++;
  if (correct) {
    st.correct++;
    st.streak++;
  } else st.streak = 0;
  l.skills[skill] = st;
  s[lessonId] = l;
  write(s);
}

export function recordMastery(lessonId: string, score: number, passed: boolean) {
  const s = read();
  const l = s[lessonId] ?? blank();
  l.bestScore = Math.max(l.bestScore ?? 0, score);
  if (passed && !l.mastered) {
    l.mastered = true;
    l.masteredAt = new Date().toISOString();
  }
  s[lessonId] = l;
  write(s);
}

export function resetLesson(lessonId: string) {
  const s = read();
  delete s[lessonId];
  write(s);
}

export function onProgress(cb: () => void) {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
