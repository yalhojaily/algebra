import type { Problem, Skill } from './types';
import * as l1_1 from './1-1-introduction-to-algebra';

interface LessonGenerators {
  skills: Skill[];
  masterySet: (size?: number) => Problem[];
}

/** Register each lesson's generators here as lessons are added. */
export const registry: Record<string, LessonGenerators> = {
  '1.1': l1_1,
};
