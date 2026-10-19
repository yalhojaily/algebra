// Every practice problem in the site has this shape. Text fields may contain inline math as $...$.

export type Answer =
  | { type: 'number'; value: number; /** require a decimal (no fraction bar) */ decimal?: boolean }
  | {
      type: 'expression';
      value: string;
      /** The answer must be fully simplified: at most this many terms, and no parentheses. */
      maxTerms?: number;
      /** The answer must be factored, with this greatest common factor pulled out (e.g. "6"). */
      factor?: string;
    }
  | {
      type: 'equation';
      value: string;
      /** The equation must be solved for this variable: it alone on one side, and nowhere on the other. */
      solveFor?: string;
    }
  /** A solved inequality such as "x > 3" or "x <= -2". */
  | { type: 'inequality'; value: string }
  | { type: 'choice'; options: string[]; correct: number };

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
export interface Figure {
  kind: 'ray';
  boundary: number;
  closed: boolean;
  dir: 'left' | 'right';
}

export interface Skill {
  id: string;
  label: string;
  generate: () => Problem;
}
