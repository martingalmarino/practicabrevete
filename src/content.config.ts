import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guias' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    directAnswer: z.string(),
    updatedAt: z.string(),
    sources: z.array(z.object({ label: z.string(), url: z.string().url().optional() })),
    howto: z
      .object({
        name: z.string(),
        steps: z.array(z.object({ name: z.string(), text: z.string() })),
      })
      .optional(),
  }),
});

export const collections = { guias };
