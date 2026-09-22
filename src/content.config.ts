import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(70).max(160),
    date: z.coerce.date(),
    category: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    tags: z.array(z.string()).optional(),
    keyword: z.string().optional(),
  }),
});

export const collections = { posts };
