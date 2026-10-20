// Every practice problem in the site has this shape. Text fields may contain inline math as $...$.

export type Answer =
  | {
      type: 'number';
      value: number;
      /** require a decimal (no fraction bar) */
      decimal?: boolean;
      /** require scientific notation: a × 10^n with 1 ≤ |a| < 10 */
      sci?: boolean;
      /** Accept answers within this distance of the value (for rounded decimals). */
      tol?: number;
    }
  | {
      type: 'expression';
      value: string;
      /** The answer must be fully simplified: at most this many terms, and no parentheses. */
      maxTerms?: number;
      /** The answer must be factored, with this greatest common factor pulled out (e.g. "6"). */
      factor?: string;
      /** The answer must be factored completely, as completely as `value` is. */
      factored?: boolean;
      /** The answer must not use negative exponents. */
      positiveExponents?: boolean;
      /** The answer must be one fraction in lowest terms (numerator and denominator have no common factor). */
      rational?: boolean;
      /** Simplified radical form: no square (cube) factors left under a root, no roots in a denominator, like radicals combined. */
      radical?: boolean;
      /** Each variable may appear only once (e.g. x^(5/6), not x^(1/2)·x^(1/3)). */
      combined?: boolean;
      /** Write it with rational exponents — no √ or ∛. */
      noRadicals?: boolean;
      /** Condensed: a single logarithm. */
      singleLog?: boolean;
      /** Expanded: every logarithm has a single variable or number inside. */
      expandedLogs?: boolean;
    }
  | {
      type: 'equation';
      value: string;
      /** The equation must be solved for this variable: it alone on one side, and nowhere on the other. */
      solveFor?: string;
    }
  /** A solved inequality such as "x > 3" or "x <= -2". */
  | { type: 'inequality'; value: string }
  /** An ordered pair (x, y). */
  | { type: 'point'; x: number; y: number }
  /** All solutions of an equation, which may be complex: 1 ± 2i. */
  | { type: 'csolutions'; values: { re: number; im: number }[]; variable?: string }
  /** A complex number a + bi. */
  | { type: 'complex'; re: number; im: number }
  /** An ordered triple (x, y, z) — or any ordered list in parentheses. */
  | { type: 'tuple'; values: number[] }
  /** All solutions of an equation, e.g. [2, -3]. */
  | { type: 'solutions'; values: number[]; variable?: string }
  /** Click on a coordinate grid: one point, or two points that determine the line ax + by = c. */
  | { type: 'plot'; mode: 'point'; x: number; y: number }
  | { type: 'plot'; mode: 'line'; a: number; b: number; c: number }
  | { type: 'choice'; options: string[]; correct: number }
  /** An interval such as [−3, 5) or (−∞, 2]. Use ±Infinity for unbounded ends. */
  | { type: 'interval'; lo: number; hi: number; loClosed: boolean; hiClosed: boolean }
  /** A union of intervals, e.g. (−∞, −1) ∪ [3, ∞). No parts means the empty set ∅. */
  | { type: 'intervals'; parts: { lo: number; hi: number; loClosed: boolean; hiClosed: boolean }[] };

export interface Mistake {
  /** A specific wrong answer we expect, written in the same form the student would enter it. */
  answer: string;
  feedback: string;
}

export interface Problem {
  skill: string;
  prompt: string;
  answer: Answer;
  /** Progressive hints: each one gives a little more away. */
  hints: string[];
  /** The full worked solution, one step per line. */
  solution: string[];
  /** Targeted feedback for common wrong answers. */
  mistakes?: Mistake[];
  /** Placeholder shown in the answer box. */
  placeholder?: string;
  /** An optional picture shown with the prompt. */
  figure?: Figure;
}

/** A ray on a number line, the graph of a simple inequality. */
export interface RayFig {
  kind: 'ray';
  boundary: number;
  closed: boolean;
  dir: 'left' | 'right';
}

/** A coordinate plane with labeled points and/or lines ax + by = c. */
export interface PlaneFig {
  kind: 'plane';
  /** `open` draws a hollow dot (an endpoint that is not included). */
  points?: { x: number; y: number; label?: string; open?: boolean }[];
  lines?: { a: number; b: number; c: number }[];
  /** Draw y = f(x) for a polynomial given by coefficients, highest degree first. */
  curves?: number[][];
  /** Draw x = g(y) for a polynomial in y (a sideways curve). */
  xcurves?: number[][];
  /** Line segments from (x1, y1) to (x2, y2). */
  segments?: { x1: number; y1: number; x2: number; y2: number }[];
  circles?: { cx: number; cy: number; r: number }[];
  /** Draw y = f(x) only for lo ≤ x ≤ hi. */
  pieces?: { coefs: number[]; lo: number; hi: number }[];
  /** Shade half-planes: the side of a x + b y = c where a x + b y (op) c; dashed when strict. */
  regions?: { a: number; b: number; c: number; op: '<' | '<=' | '>' | '>='; cls?: string }[];
  range?: number;
}

/** A number line with shaded intervals (closed/open endpoints, arrows for infinite ends). */
export interface LineFig {
  kind: 'numberline';
  parts: { lo: number; hi: number; loClosed: boolean; hiClosed: boolean }[];
  /** Also mark single points (e.g. the solutions of an equation). */
  points?: number[];
  min?: number;
  max?: number;
}

export type Figure = RayFig | PlaneFig | LineFig;

export interface Skill {
  id: string;
  label: string;
  generate: () => Problem;
}
