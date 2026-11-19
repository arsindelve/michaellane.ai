---
title: Software Factory at Second Nature
kind: work
order: 4.8
kicker: Moving software engineering from AI-assisted to AI-first
summary: As Director of Software Development, I made the case and architected the rollout of a verification-heavy software factory across engineering, shifting the bottleneck from code generation to front-loaded architecture, deterministic gates, and earned autonomy.
years: 2026 – Present
role: Director of Software Development
stack: [Claude Code, ast-grep, Modal sandboxes, SOC 2 Type 2, Node.js, AWS]
cover: ../../assets/shots/second-nature/home-hero.png
coverAlt: Second Nature’s Resident Experience Platform home page, “The only platform that personalizes renting for every resident,” highlighting Resident Onboarding and the Resident Benefits Package.
frameUrl: https://www.secondnature.com/
links:
  - { label: secondnature.com, url: "https://www.secondnature.com" }
stats:
  - { n: "2x", label: "points per engineer vs. teams using Claude Code only for implementation" }
  - { n: "~50%", label: "projected reduction in all-in cost per point" }
  - { n: "2 days", label: "to ship production tool vs 6-week estimate" }
  - { n: "22", label: "engineers and QA across three resident-facing teams" }
---

## The bottleneck moved

Writing code is no longer the constraint. When engineers adopted AI coding tools, PR volume rose 58–83%, but review and verification fell behind: PRs sat open waiting for human diff-reading, while delivery instability climbed. Adding more agents to a traditional Scrum process only grew the review backlog.

At Second Nature, I made the case to leadership—backed by the VP and CTPO—to build a tightly constrained, verification-heavy software factory rather than running old ceremonies faster.

## The software factory

Instead of asking humans to inspect every line of generated diffs, the factory moves safety upfront and into automated systems:

- **Front-loaded design and RFCs:** All architecture and contract debate happens before code is written. Small teams plan directly with Claude as a design and planning partner, eliminating traditional refinement and estimation overhead.
- **Deterministic gates:** Rules live in code, not prose. We enforce structural rules in CI using `ast-grep`, protected rule paths, and test-independence checks where every repeated mistake turns into a lint rule or type constraint.
- **Evidence-carrying PRs:** Pull requests attach test receipts, browser screenshots, and risk scores. Reviewers check evidence rather than diffs.
- **Earned autonomy:** Human review comes off in tiers as measured quality earns it. Low-risk changes auto-merge under SOC 2 Type 2 compliance with a weekly human audit sample, while high-risk changes (auth, payments, data models) always retain human review.
- **The outer loop:** Automated background systems continuously monitor production alerts, triage error spikes, detect codebase rot, and generate fixes before customers notice.

## The proof

We proved the model first with a two-engineer pilot. Other teams were already using Claude Code for implementation; the experiment was to integrate AI across the full lifecycle—planning, scoping, refinement, and testing—instead of stopping at code generation. That pilot pod delivered 2x the velocity per engineer of median teams using Claude Code just for implementation, with engineer engagement scores reaching 92–94% against an org baseline of 84–87%.

In my own work, I shipped a production internal tool with every line written by orchestrated agents under my direction in two days and a night against a six-week estimate for a full team—in active daily use across the company since.
