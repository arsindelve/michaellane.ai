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
      // Name of a recorded session in public/anim/ (see scripts/animate.mjs); shown instead of the cover.
      animation: z.string().optional(),
      // A short slideshow of screenshots, shown instead of the cover. `path` updates the frame's address bar.
      slides: z.array(z.object({ src: image(), alt: z.string(), path: z.string().default('') })).optional(),
      // A drawn diagram, for exhibits with nothing to screenshot.
      diagram: z.enum(['agents', 'breaker']).optional(),
      // A live, embeddable version of the thing itself.
      embed: z.object({ url: z.string().url(), label: z.string() }).optional(),
      links: z.array(z.object({ label: z.string(), url: z.string().url(), short: z.string().optional() })).default([]),
      stats: z.array(z.object({ n: z.string(), label: z.string() })).default([]),
      quote: z.object({ text: z.string(), by: z.string() }).optional(),
      // Who did what, stated plainly.
      me: z.string().optional(),
      ai: z.string().optional(),
    }),
});

export const collections = { work };
