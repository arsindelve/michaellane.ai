# michaellane.ai

**Live:** [michaellane.ai](https://michaellane.ai) · **Stack:** Astro 7, TypeScript, CSS, AWS (S3 + CloudFront)

Personal portfolio for **Michael Lane** — engineering leader, AI-first builder, and unabashed enthusiast of 1980s text adventures. Combines executive engineering case studies with interactive AI & retro-computing exhibits.

---

## Highlights

- **Obsidian Theme** (`src/styles/obsidian.css`) — Deep obsidian (`#090a0d`) canvas with cyan/indigo accents, `Plus Jakarta Sans` + `JetBrains Mono` typography, and subtle ambient gradients.
- **Interactive Infocom Prompt** (`src/components/Flourish.astro`) — A working text-adventure prompt (`> look`, `type a command`) alongside the 32 Infocom grey-box worlds (`1980–1988`).
- **Work Carousel ↔ Stepped Career Rail** (`src/pages/index.astro`) — Infinite-looping leadership case-study carousel synced bidirectionally with the Career bar (rendering as a responsive 2-column / 1-column Stepped Career Rail with tenure years on widths `≤ 1280px`).
- **Research & Renaissance Exhibit Hall** — Stacking-deck showcase of independent AI and retro-computing projects (*ZorkAI*, *Planetfall AI*, *AdventureBreaker*, *Unopened Worlds*, *PlayZork*, *The Manifest Chronicles*) with `Me / AI` credit breakdowns.

---

## Project Structure

```text
src/
├── assets/             # Portrait and project screenshots
├── components/         # Exhibit, ExhibitRow, Flourish, diagrams, footers
├── content/
│   ├── excerpts/       # Code excerpts rendered in exhibits
│   └── work/           # Markdown case studies (kind: work | exhibit)
├── data/
│   └── site.ts         # Single source of truth for roles, projects, principles, education
├── layouts/
│   └── Base.astro      # Shared layout, fonts, and style/motion initialization
├── pages/
│   ├── index.astro     # Home page
│   ├── resume.astro    # Full résumé
│   ├── how-this-was-built.astro
│   ├── work/[slug].astro
│   └── mockups/        # Design exploration routes
└── styles/
    ├── global.css      # Base typography and tokens
    ├── obsidian.css    # Default Obsidian dark theme
    ├── mockups.css     # Legacy/alternate style variants
    └── home-load.css   # Word-by-word hero entrance motion
scripts/
├── animate.mjs         # Recorded terminal/session animations
└── capture.mjs         # Screenshot capture via local Chrome
```

---

## Local Development

```bash
npm install
npm run dev
```

Or using Astro’s background dev server:

```bash
npx astro dev --background
npx astro dev status
npx astro dev stop
```

---

## Content & Screenshots

- **Case studies & exhibits:** `src/content/work/*.md` (front matter drives `kind`, `order`, `placement`, `cover`, `slides`, `embed`, `stats`, and `me` / `ai` credits).
- **Résumé & profile data:** `src/data/site.ts`.
- **Screenshots:** Captured with `node scripts/capture.mjs [name ...]` using local Chrome.

---

## Build & Deploy

Static output builds to `dist/` and is served from S3 behind CloudFront:

```bash
npm run build
AWS_PROFILE=delve aws s3 sync dist/ s3://michaellane.ai --delete
AWS_PROFILE=delve aws cloudfront create-invalidation --distribution-id E17EZ16M74J8HA --paths "/*"
```

---

## Credits

Built with [Claude Code](https://claude.com/claude-code), **Gemini**, and [Astro](https://astro.build). Michael drove the architecture, design, copy, and every decision; Claude Code and Gemini wrote the implementation. See [`/how-this-was-built`](https://michaellane.ai/how-this-was-built) on the site.
