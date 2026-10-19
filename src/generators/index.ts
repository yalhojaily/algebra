import type { Problem, Skill } from './types';
import * as l1_1 from './1-1-introduction-to-algebra';
import * as l1_2 from './1-2-the-real-numbers';
import * as l1_3 from './1-3-addition-of-real-numbers';
import * as l1_4 from './1-4-subtraction-of-real-numbers';
import * as l1_5 from './1-5-multiplication-of-real-numbers';
import * as l1_6 from './1-6-division-of-real-numbers';
import * as l1_7 from './1-7-properties-of-real-numbers';
import * as l1_8 from './1-8-simplifying-expressions-order-of-operations';

interface LessonGenerators {
  skills: Skill[];
  masterySet: (size?: number) => Problem[];
}

/** Register each lesson's generators here as lessons are added. */
export const registry: Record<string, LessonGenerators> = {
  '1.1': l1_1,
  '1.2': l1_2,
  '1.3': l1_3,
  '1.4': l1_4,
  '1.5': l1_5,
  '1.6': l1_6,
  '1.7': l1_7,
  '1.8': l1_8,
};
