import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kind: z.enum(['exhibit', 'work']),
      order: z.number(),
      // 'coda' exhibits sit at the bottom of the home page, after the day job.
      placement: z.enum(['main', 'coda']).default('main'),
      kicker: z.string(),
      summary: z.string(),
      years: z.string(),
      role: z.string(),
      stack: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // A live, embeddable version of the thing itself.
      embed: z.object({ url: z.string().url(), label: z.string() }).optional(),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      stats: z.array(z.object({ n: z.string(), label: z.string() })).default([]),
      // Who did what, stated plainly.
      me: z.string().optional(),
      ai: z.string().optional(),
    }),
});

export const collections = { work };
