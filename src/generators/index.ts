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
import * as l3_1 from './3-1-introduction-to-graphing';
import * as l3_2 from './3-2-graphing-linear-equations';
import * as l3_3 from './3-3-more-with-graphing-and-intercepts';
import * as l4_1 from './4-1-integers-as-exponents';
import * as l4_2 from './4-2-exponents-and-scientific-notation';
import * as l4_3 from './4-3-introduction-to-polynomials';
import * as l4_4 from './4-4-addition-and-subtraction-of-polynomials';
import * as l4_5 from './4-5-multiplication-of-polynomials';
import * as l4_6 from './4-6-special-products';
import * as l4_7 from './4-7-operations-with-polynomials-in-several-variables';
import * as l5_1 from './5-1-introduction-to-factoring';
import * as l5_2 from './5-2-factoring-trinomials-of-the-type-x-bx-c';
import * as l5_3 from './5-3-factoring-ax-bx-c-a-1-the-foil-method';
import * as l5_4 from './5-4-factoring-ax-bx-c-a-1-the-ac-method';
import * as l5_5 from './5-5-factoring-trinomial-squares-and-differences-of-squares';
import * as l5_6 from './5-6-factoring-sums-or-differences-of-cubes';
import * as l5_7 from './5-7-factoring-a-general-strategy';
import * as l5_8 from './5-8-solving-quadratic-equations-by-factoring';
import * as l5_9 from './5-9-applications-of-quadratic-equations';
import * as l6_1 from './6-1-multiplying-and-simplifying-rational-expressions';
import * as l6_2 from './6-2-division-and-reciprocals';
import * as l6_3 from './6-3-least-common-multiples-and-denominators';
import * as l6_4 from './6-4-adding-rational-expressions';
import * as l6_5 from './6-5-subtracting-rational-expressions';
import * as l6_6 from './6-6-complex-rational-expressions';
import * as l6_7 from './6-7-solving-rational-equations';
import * as l6_8 from './6-8-applications-using-rational-equations-and-proportions';
import * as l6_9 from './6-9-variation-and-applications';
import * as l7_1 from './7-1-functions-and-graphs';
import * as l7_2 from './7-2-finding-domain-and-range';
import * as l7_3 from './7-3-linear-functions-graphs-and-slope';
import * as l7_4 from './7-4-more-on-graphing-linear-equations';
import * as l7_5 from './7-5-finding-equations-of-lines-applications';
import * as l4_8 from './4-8-division-of-polynomials';
import * as l3_4 from './3-4-slope-and-applications';
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
  '3.1': l3_1,
  '3.2': l3_2,
  '3.3': l3_3,
  '3.4': l3_4,
  '4.1': l4_1,
  '4.2': l4_2,
  '4.3': l4_3,
  '4.4': l4_4,
  '4.5': l4_5,
  '4.6': l4_6,
  '4.7': l4_7,
  '4.8': l4_8,
  '5.1': l5_1,
  '5.2': l5_2,
  '5.3': l5_3,
  '5.4': l5_4,
  '5.5': l5_5,
  '5.6': l5_6,
  '5.7': l5_7,
  '5.8': l5_8,
  '5.9': l5_9,
  '6.1': l6_1,
  '6.2': l6_2,
  '6.3': l6_3,
  '6.4': l6_4,
  '6.5': l6_5,
  '6.6': l6_6,
  '6.7': l6_7,
  '6.8': l6_8,
  '6.9': l6_9,
  '7.1': l7_1,
  '7.2': l7_2,
  '7.3': l7_3,
  '7.4': l7_4,
  '7.5': l7_5,
};
