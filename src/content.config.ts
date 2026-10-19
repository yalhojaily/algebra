import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    id: z.string(), // e.g. "1.1" — must match an entry in src/data/curriculum.ts
    title: z.string(),
    summary: z.string(),
    objectives: z.array(z.string()),
    minutes: z.number(),
  }),
});

export const collections = { lessons };
