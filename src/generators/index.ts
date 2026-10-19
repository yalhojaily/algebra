import type { Problem, Skill } from './types';
import * as l1_1 from './1-1-introduction-to-algebra';
import * as l1_2 from './1-2-the-real-numbers';
import * as l1_3 from './1-3-addition-of-real-numbers';
import * as l1_4 from './1-4-subtraction-of-real-numbers';
import * as l1_5 from './1-5-multiplication-of-real-numbers';
import * as l1_6 from './1-6-division-of-real-numbers';
import * as l1_7 from './1-7-properties-of-real-numbers';
import * as l1_8 from './1-8-simplifying-expressions-order-of-operations';
import * as l2_1 from './2-1-solving-equations-the-addition-principle';
import * as l2_2 from './2-2-solving-equations-the-multiplication-principle';
import * as l2_3 from './2-3-using-the-principles-together';
import * as l2_4 from './2-4-formulas';
import * as l2_5 from './2-5-applications-of-percent';
import * as l2_6 from './2-6-applications-and-problem-solving';
import * as l2_7 from './2-7-solving-inequalities';
import * as l2_8 from './2-8-applications-and-problem-solving-with-inequalities';

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
  '2.1': l2_1,
  '2.2': l2_2,
  '2.3': l2_3,
  '2.4': l2_4,
  '2.5': l2_5,
  '2.6': l2_6,
  '2.7': l2_7,
  '2.8': l2_8,
};
