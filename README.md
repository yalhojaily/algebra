# Algebra, step by step

An interactive companion website for a high-school / college algebra textbook (12 chapters, 84 lessons). **Chapters 1–11 are complete** (real numbers, equations & inequalities, graphing, polynomials, factoring, rational expressions, functions, systems, more on inequalities, radicals & complex numbers, quadratics).
Every lesson follows the same rhythm:

1. **Why?** — a real situation that needs the idea
2. **See it** — interactive pictures and sliders
3. **Worked examples** — revealed one step at a time
4. **Watch out** — the common mistakes
5. **Practice** — unlimited, randomly generated problems with hints and instant checking
6. **Mastery check** — 6 fresh questions; 5 correct marks the lesson as mastered

Live site: https://yalhojaily.github.io/algebra/

## Stack

- [Astro](https://astro.build) + MDX for content, React (TypeScript) islands for interactivity
- KaTeX for math rendering
- A small built-in algebra engine (`src/lib/expr.ts`) that parses student input (`3x`, `2(x+1)`, `x/4`) and accepts any mathematically equivalent answer
- Progress is stored in `localStorage`

## Project layout

```
src/
  data/curriculum.ts          Course map: every chapter and lesson from the book, with prerequisites
  content/lessons/*.mdx       One file per lesson (frontmatter: id, title, summary, objectives, minutes)
  generators/                 Random practice-problem generators, one file per lesson
    index.ts                  Registry: lesson id → generators
  lib/expr.ts                 Parser, evaluator, equivalence checking, LaTeX printing
  lib/check.ts                Grades an answer against a problem
  lib/progress.ts             Progress storage
  components/                 StepReveal, ExpressionLab, TranslateLab, BalanceCheck, Practice, MasteryCheck, CourseMap…
  pages/                      Home (course map) and the lesson route
tests/                        Vitest tests for the engine and generators
```

## Adding a lesson

1. Write `src/content/lessons/<id>-<slug>.mdx` with the same frontmatter as `1-1-introduction-to-algebra.mdx`.
2. Write `src/generators/<id>-<slug>.ts` exporting `skills` and `masterySet`, and register it in `src/generators/index.ts`.
3. Use `<Practice lesson="<id>" />` and `<MasteryCheck lesson="<id>" />` in the MDX.

The lesson appears on the course map automatically. When every lesson in a chapter exists, a **chapter review & test** page (`/chapters/<n>/`) is generated too: mixed review from all the chapter's lessons plus a 2-questions-per-lesson test.

Helpers for generators live in `src/generators/helpers.ts` (fractions in lowest terms, shuffled multiple choice, step-by-step order-of-operations solutions). Expression answers can require a simplified form (`maxTerms`) or a factored form (`factor`).

## Commands

```bash
npm install
npm run dev       # http://localhost:4321/algebra/
npm test          # engine + generator tests
npm run build     # type-check and build to dist/
```

Pushing to `main` deploys to GitHub Pages (Settings → Pages → Source: **GitHub Actions**).
