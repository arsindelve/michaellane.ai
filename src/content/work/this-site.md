---
title: This Site
kind: exhibit
order: 4.5
kicker: "An exhibit about the site you’re on. Very meta."
summary: The page you’re reading is the exhibit. I set the creative direction and iterated through twenty-nine mockups with Claude Code until the first design clicked, then evolved the visual system into the Obsidian dark theme with Gemini. Yes, this exhibit is inside the thing it’s about. If you click “Case study” from here, you will eventually find this sentence again.
years: "2026"
role: Creative director, product owner, editor
stack: [Astro, Claude Code, Gemini, Subagents, Playwright, S3, CloudFront]
cover: ../../assets/shots/meta/14-obsidian.png
coverAlt: The Obsidian home page of michaellane.ai.
slides:
  - { src: ../../assets/shots/meta/14-obsidian.png, path: "", caption: "Obsidian edition: dark canvas, Stepped Career Rail, and visual case-study cards.", alt: "The Obsidian home page of michaellane.ai." }
  - { src: ../../assets/shots/meta/1-dark.png, path: "/?draft=2", caption: "Early dark draft—too close to Unopened Worlds, so we pushed for a distinct identity.", alt: "An early dark design with warm gold accents." }
  - { src: ../../assets/shots/meta/2-palettes.png, path: "/?theme=signal", caption: "Exploring the Gallery layout with a graphite-and-lime palette and font pairings.", alt: "A graphite and lime palette mockup." }
  - { src: ../../assets/shots/meta/3-poster.png, path: "/?style=poster", caption: "Poster scale test—trimmed back the oversized type to keep the hierarchy balanced.", alt: "A poster-style mockup with an enormous headline." }
  - { src: ../../assets/shots/meta/4-poster-shadows.png, path: "/?style=poster", caption: "Testing offset shadows and a tilted banner before moving toward cleaner geometry.", alt: "Cards with hard black offset shadows and a tilted blue banner." }
  - { src: ../../assets/shots/meta/5-blocks.png, path: "/?style=blocks", caption: "Color-blocked bands exploring stronger flow and section separators.", alt: "A color-blocked mockup with black and blue bands." }
  - { src: ../../assets/shots/meta/7-map.png, path: "/?flourish=map", caption: "Testing a drawn Zork map as a subtle background flourish.", alt: "A Zork map drawn beside the headline." }
  - { src: ../../assets/shots/meta/7b-text.png, path: "/?flourish=text", caption: "Experimenting with faint opening text from Zork beside the headline.", alt: "Zork’s opening text set faintly beside the headline." }
  - { src: ../../assets/shots/meta/8-compass.png, path: "/?flourish=compass", caption: "A compass rose beside the headline—getting closer to the right visual anchor.", alt: "A large compass rose beside the headline." }
  - { src: ../../assets/shots/meta/9-worlds.png, path: "/?flourish=worlds", caption: "A grid of 32 small worlds—a bit too busy next to the typography.", alt: "A grid of 32 small boxes, two of them blue." }
  - { src: ../../assets/shots/meta/9b-prompt.png, path: "/?flourish=prompt", caption: "A live text-adventure prompt beside the headline before shifting to softer background waves.", alt: "A working text-adventure prompt beside the headline." }
  - { src: ../../assets/shots/meta/10-final.png, path: "", caption: "First release: soft blue waves breaking up the light canvas.", alt: "The finished home page, with soft blue waves." }
  - { src: ../../assets/shots/meta/11-code-dark.png, path: "/work/manifest-chronicles", caption: "Original source code as a tilted, softly focused background panel.", alt: "The original source code as a tilted, softly focused photograph, in the dark version." }
  - { src: ../../assets/shots/meta/12-code-css.png, path: "/work/unopened-worlds", caption: "Unopened Worlds’ stylesheet rendered as an editorial code backdrop.", alt: "Unopened Worlds’ stylesheet rendered the same way." }
  - { src: ../../assets/shots/meta/13-code-zork.png, path: "/work/zorkai", caption: "ZorkAI’s GameEngine.cs as a selectable, fading code panel at the bottom of the case study.", alt: "ZorkAI’s GameEngine.cs as a tilted, fading panel of real, selectable text." }
links:
  - { label: You are here, url: "https://michaellane.ai/", short: "You’re here" }
  - { label: Source on GitHub, url: "https://github.com/arsindelve/michaellane.ai", short: Source }
stats:
  - { n: "29", label: "iterations to land the design" }
  - { n: "0", label: "lines of code written by me" }
  - { n: "2", label: "AI partners (Claude Code & Gemini)" }
  - { n: "2", label: "subagents doing QA in parallel" }
me: The brief, the audience, the taste, every pick and every rejection, the reference images that unstuck it, and the copy.
ai: All of the implementation, the screenshots, the recorded game sessions, and a QA sweep that caught bugs I’d have shipped.
---

## The brief

A portfolio for someone hiring an engineering leader. It had to be honest that AI writes most of my code now, and it had to prove I still own the judgment. So the site itself had to be built that way.

## What "directing" actually looked like

The first version was a résumé in disguise. The second was dark, gold and literary, a near-twin of Unopened Worlds. From there we explored palettes, five typefaces, a poster style with hard shadows, three more styles, three variants of the one that was close, and five background "flourishes", including a compass, a Zork map and a live text-adventure prompt.

Most of those were solid work—they just weren't the right fit for this site. Narrowing the field quickly was the job.

## What unstuck it

Words weren't enough. Two things were: a link to another company's website, for the soft waves in the background, and three stock photos of code on a screen, which became the source-code panels at the bottom of every case study. Once we had a visual reference for what I meant, it came together on the first try.

## What I learned

The model is fast and tireless, and it will happily polish any direction you give it. The leverage is having a clear sense of what fits, giving concrete feedback early, and showing rather than telling. That's not a new skill—it's the same one I use with engineering teams.

## The Obsidian evolution

The first release proved the concept on a bright editorial canvas. Later, working with Gemini, I evolved the site into the **Obsidian** dark system you're looking at now—replacing the light theme with a `#090a0d` canvas, adding the Stepped Career Rail tied to visual case-study cards, building an Architectural Timeline résumé, and expanding the portfolio so every role from Logitech to Second Nature has its own case study and verified screenshot.
