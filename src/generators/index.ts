import type { Problem, Skill } from './types';
import * as l1_1 from './1-1-introduction-to-algebra';
import * as l1_2 from './1-2-the-real-numbers';

interface LessonGenerators {
  skills: Skill[];
  masterySet: (size?: number) => Problem[];
}

/** Register each lesson's generators here as lessons are added. */
export const registry: Record<string, LessonGenerators> = {
  '1.1': l1_1,
  '1.2': l1_2,
};
