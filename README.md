# michaellane.ai

Michael Lane's portfolio: engineering leadership, plus the things he builds on his own time, three of which you can play in the page.

Built with [Claude Code](https://claude.com/claude-code) and [Astro](https://astro.build). Michael drove the architecture, design, copy and every decision; Claude wrote the implementation. See `/how-this-was-built` on the site.

## Develop

```bash
npm install
npm run dev
```

## Content

- Case studies (exhibits and day-job work) live in `src/content/work/*.md`. Front matter drives the home page: `kind`, `order`, `placement`, `cover`, `embed`, `stats`, and the `me` / `ai` credit lines.
- Résumé data (roles, education) lives in `src/data/site.ts`.
- Screenshots of the live projects are captured with `node scripts/capture.mjs [name ...]`, which drives the locally installed Chrome.

## Build

```bash
npm run build
```

Output goes to `dist/`, served from S3 behind CloudFront.
