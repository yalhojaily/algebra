// The full course map, taken from the textbook's table of contents.
// A lesson is "available" once an MDX file with the same `id` exists in src/content/lessons.

export interface Lesson {
  id: string; // "1.1"
  title: string;
  page: number; // page in the printed book
  slug: string; // URL segment
  prereqs: string[]; // lesson ids that should be mastered first
}

export interface Chapter {
  number: number;
  title: string;
  page: number;
  lessons: Lesson[];
}

const slugify = (id: string, title: string) =>
  `${id.replace('.', '-')}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;

type Raw = [id: string, title: string, page: number, prereqs?: string[]];

function chapter(number: number, title: string, page: number, raw: Raw[]): Chapter {
  return {
    number,
    title,
    page,
    lessons: raw.map(([id, t, p, prereqs], i) => ({
      id,
      title: t,
      page: p,
      slug: slugify(id, t),
      // Default prerequisite: the previous lesson in the same chapter.
      prereqs: prereqs ?? (i > 0 ? [raw[i - 1][0]] : []),
    })),
  };
}

export const curriculum: Chapter[] = [
  chapter(1, 'Introduction to Real Numbers and Algebraic Expressions', 1, [
    ['1.1', 'Introduction to Algebra', 2, []],
    ['1.2', 'The Real Numbers', 9],
    ['1.3', 'Addition of Real Numbers', 21],
    ['1.4', 'Subtraction of Real Numbers', 29],
    ['1.5', 'Multiplication of Real Numbers', 38],
    ['1.6', 'Division of Real Numbers', 45],
    ['1.7', 'Properties of Real Numbers', 54],
    ['1.8', 'Simplifying Expressions; Order of Operations', 67],
  ]),
  chapter(2, 'Solving Equations and Inequalities', 85, [
    ['2.1', 'Solving Equations: The Addition Principle', 86, ['1.1', '1.4']],
    ['2.2', 'Solving Equations: The Multiplication Principle', 92],
    ['2.3', 'Using the Principles Together', 98, ['2.2', '1.8']],
    ['2.4', 'Formulas', 109],
    ['2.5', 'Applications of Percent', 119],
    ['2.6', 'Applications and Problem Solving', 127],
    ['2.7', 'Solving Inequalities', 144, ['2.3']],
    ['2.8', 'Applications and Problem Solving with Inequalities', 156],
  ]),
  chapter(3, 'Graphs of Linear Equations', 173, [
    ['3.1', 'Introduction to Graphing', 174, ['1.2']],
    ['3.2', 'Graphing Linear Equations', 181, ['3.1', '2.3']],
    ['3.3', 'More with Graphing and Intercepts', 192],
    ['3.4', 'Slope and Applications', 205],
  ]),
  chapter(4, 'Polynomials: Operations', 227, [
    ['4.1', 'Integers as Exponents', 228, ['1.8']],
    ['4.2', 'Exponents and Scientific Notation', 238],
    ['4.3', 'Introduction to Polynomials', 250, ['4.1']],
    ['4.4', 'Addition and Subtraction of Polynomials', 263],
    ['4.5', 'Multiplication of Polynomials', 273],
    ['4.6', 'Special Products', 280],
    ['4.7', 'Operations with Polynomials in Several Variables', 291],
    ['4.8', 'Division of Polynomials', 300],
  ]),
  chapter(5, 'Polynomials: Factoring', 317, [
    ['5.1', 'Introduction to Factoring', 318, ['4.5']],
    ['5.2', 'Factoring Trinomials of the Type x² + bx + c', 327, ['5.1', '4.6']],
    ['5.3', 'Factoring ax² + bx + c, a ≠ 1: The FOIL Method', 337],
    ['5.4', 'Factoring ax² + bx + c, a ≠ 1: The ac-Method', 345, ['5.2']],
    ['5.5', 'Factoring Trinomial Squares and Differences of Squares', 353, ['5.2', '4.6']],
    ['5.6', 'Factoring Sums or Differences of Cubes', 363],
    ['5.7', 'Factoring: A General Strategy', 368],
    ['5.8', 'Solving Quadratic Equations by Factoring', 377],
    ['5.9', 'Applications of Quadratic Equations', 386],
  ]),
  chapter(6, 'Rational Expressions and Equations', 409, [
    ['6.1', 'Multiplying and Simplifying Rational Expressions', 410, ['5.7']],
    ['6.2', 'Division and Reciprocals', 420],
    ['6.3', 'Least Common Multiples and Denominators', 425],
    ['6.4', 'Adding Rational Expressions', 429],
    ['6.5', 'Subtracting Rational Expressions', 437],
    ['6.6', 'Complex Rational Expressions', 447],
    ['6.7', 'Solving Rational Equations', 453, ['6.5', '5.8']],
    ['6.8', 'Applications Using Rational Equations and Proportions', 462],
    ['6.9', 'Variation and Applications', 478],
  ]),
  chapter(7, 'Graphs, Functions, and Applications', 499, [
    ['7.1', 'Functions and Graphs', 500, ['3.2']],
    ['7.2', 'Finding Domain and Range', 514],
    ['7.3', 'Linear Functions: Graphs and Slope', 521, ['7.2', '3.4']],
    ['7.4', 'More on Graphing Linear Equations', 532],
    ['7.5', 'Finding Equations of Lines; Applications', 544],
  ]),
  chapter(8, 'Systems of Equations', 569, [
    ['8.1', 'Systems of Equations in Two Variables', 570, ['7.4']],
    ['8.2', 'Solving by Substitution', 579],
    ['8.3', 'Solving by Elimination', 585],
    ['8.4', 'Solving Applied Problems: Two Equations', 594],
    ['8.5', 'Systems of Equations in Three Variables', 610, ['8.3']],
    ['8.6', 'Solving Applied Problems: Three Equations', 617],
  ]),
  chapter(9, 'More on Inequalities', 635, [
    ['9.1', 'Sets, Inequalities, and Interval Notation', 636, ['2.7']],
    ['9.2', 'Intersections, Unions, and Compound Inequalities', 652],
    ['9.3', 'Absolute-Value Equations and Inequalities', 666],
    ['9.4', 'Systems of Inequalities in Two Variables', 677, ['9.2', '8.1']],
  ]),
  chapter(10, 'Radical Expressions, Equations, and Functions', 701, [
    ['10.1', 'Radical Expressions and Functions', 702, ['7.2']],
    ['10.2', 'Rational Numbers as Exponents', 713, ['10.1', '4.1']],
    ['10.3', 'Simplifying Radical Expressions', 720],
    ['10.4', 'Addition, Subtraction, and More Multiplication', 729],
    ['10.5', 'More on Division of Radical Expressions', 737],
    ['10.6', 'Solving Radical Equations', 742],
    ['10.7', 'Applications Involving Powers and Roots', 753],
    ['10.8', 'The Complex Numbers', 760],
  ]),
  chapter(11, 'Quadratic Equations and Functions', 781, [
    ['11.1', 'The Basics of Solving Quadratic Equations', 782, ['5.8', '10.3']],
    ['11.2', 'The Quadratic Formula', 796, ['11.1', '10.8']],
    ['11.3', 'Applications Involving Quadratic Equations', 803],
    ['11.4', 'More on Quadratic Equations', 815],
    ['11.5', 'Graphing f(x) = a(x − h)² + k', 826, ['11.1', '7.1']],
    ['11.6', 'Graphing f(x) = ax² + bx + c', 835],
    ['11.7', 'Mathematical Modeling with Quadratic Functions', 844],
    ['11.8', 'Polynomial Inequalities and Rational Inequalities', 855, ['11.2', '9.1']],
  ]),
  chapter(12, 'Exponential and Logarithmic Functions', 873, [
    ['12.1', 'Exponential Functions', 874, ['7.1', '10.2']],
    ['12.2', 'Inverse and Composite Functions', 888],
    ['12.3', 'Logarithmic Functions', 905],
    ['12.4', 'Properties of Logarithmic Functions', 916],
    ['12.5', 'Natural Logarithmic Functions', 924],
    ['12.6', 'Solving Exponential and Logarithmic Equations', 933],
    ['12.7', 'Mathematical Modeling with Exponential and Logarithmic Functions', 940],
  ]),
];

export const allLessons: Lesson[] = curriculum.flatMap((c) => c.lessons);

export const lessonById = (id: string) => allLessons.find((l) => l.id === id);

export const chapterOf = (id: string) => curriculum.find((c) => c.lessons.some((l) => l.id === id))!;

export function neighbors(id: string) {
  const i = allLessons.findIndex((l) => l.id === id);
  return { prev: allLessons[i - 1], next: allLessons[i + 1] };
}

export const lessonHref = (base: string, l: Lesson) => `${base.replace(/\/$/, '')}/lessons/${l.slug}/`;

export const chapterHref = (base: string, n: number) => `${base.replace(/\/$/, '')}/chapters/${n}/`;
