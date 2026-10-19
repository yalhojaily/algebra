// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('katex').KatexOptions} */
const katexOptions = {
  // \htmlClass lets lesson math reuse the site's color classes (c-var, c-num, c-op, c-eq).
  trust: (ctx) => ctx.command === '\\htmlClass',
  strict: false,
};

// Deployed to GitHub Pages at https://yalhojaily.github.io/algebra/
export default defineConfig({
  site: 'https://yalhojaily.github.io',
  base: '/algebra',
  trailingSlash: 'ignore',
  integrations: [react(), mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, katexOptions]],
    }),
  },
});
