---
title: This Site
kind: exhibit
order: 4.5
kicker: "An exhibit about the site you’re on. Very meta. Lowercase m."
summary: The page you're reading is the exhibit. I gave Claude Code the brief and the taste; it wrote every line. Then I rejected twenty-nine of its mockups until the design was right. Every "no" is below. Yes, this exhibit is inside the thing it’s about. If you click "Case study" from here, you will eventually find this sentence again.
years: "2026"
role: Creative director, product owner, editor
stack: [Astro, Claude Code, Subagents, Playwright, S3, CloudFront]
cover: ../../assets/shots/meta/10-final.png
coverAlt: The finished home page of michaellane.ai.
slides:
  - { src: ../../assets/shots/meta/1-dark.png, path: "/?draft=2", caption: "“Give me something distinct from Unopened Worlds.”", alt: "An early dark design with warm gold accents." }
  - { src: ../../assets/shots/meta/2-palettes.png, path: "/?theme=signal", caption: "“Go with Gallery, but let’s keep playing with fonts.”", alt: "A graphite and lime palette mockup." }
  - { src: ../../assets/shots/meta/3-poster.png, path: "/?style=poster", caption: "“Don’t overdo size on the fonts, and it’s still a bit boring.”", alt: "A poster-style mockup with an enormous headline." }
  - { src: ../../assets/shots/meta/4-poster-shadows.png, path: "/?style=poster", caption: "“I don’t like the hard black shadows. I don’t like that crooked banner.”", alt: "Cards with hard black offset shadows and a tilted blue banner." }
  - { src: ../../assets/shots/meta/5-blocks.png, path: "/?style=blocks", caption: "“Prompt is better, but it’s still boring. It needs flow. Separators. Pizzazz.”", alt: "A color-blocked mockup with black and blue bands." }
  - { src: ../../assets/shots/meta/7-map.png, path: "/?flourish=map", caption: "“Mock up something to fill the boring white background. Some kind of flourish.”", alt: "A Zork map drawn beside the headline." }
  - { src: ../../assets/shots/meta/7b-text.png, path: "/?flourish=text", caption: "“No to all of those.”", alt: "Zork’s opening text set faintly beside the headline." }
  - { src: ../../assets/shots/meta/8-compass.png, path: "/?flourish=compass", caption: "“The compass is close.”", alt: "A large compass rose beside the headline." }
  - { src: ../../assets/shots/meta/9-worlds.png, path: "/?flourish=worlds", caption: "“NO.”", alt: "A grid of 32 small boxes, two of them blue." }
  - { src: ../../assets/shots/meta/9b-prompt.png, path: "/?flourish=prompt", caption: "“This is not what I mean by a flourish. Something soft, subtle in the background that breaks up the white.”", alt: "A working text-adventure prompt beside the headline." }
  - { src: ../../assets/shots/meta/10-final.png, path: "", caption: "“Lock in the waves. Make it permanent.”", alt: "The finished home page, with soft blue waves." }
  - { src: ../../assets/shots/meta/11-code-dark.png, path: "/work/manifest-chronicles", caption: "“MISSION ACCOMPLISHED. Place the white one.”", alt: "The original source code as a tilted, softly focused photograph, in the dark version." }
  - { src: ../../assets/shots/meta/12-code-css.png, path: "/work/unopened-worlds", caption: "“Maybe for Unopened Worlds, grab some CSS.”", alt: "Unopened Worlds’ stylesheet rendered the same way." }
  - { src: ../../assets/shots/meta/13-code-zork.png, path: "/work/zorkai", caption: "“Oh, I can highlight the words.”", alt: "ZorkAI’s GameEngine.cs as a tilted, fading panel of real, selectable text." }
links:
  - { label: You are here, url: "https://michaellane.ai/", short: "You’re here" }
  - { label: Source on GitHub, url: "https://github.com/arsindelve/michaellane.ai", short: Source }
stats:
  - { n: "29", label: "mockups rejected" }
  - { n: "0", label: "lines of code written by me" }
  - { n: "0", label: "design decisions made by the AI" }
  - { n: "2", label: "subagents doing QA in parallel" }
me: The brief, the audience, the taste, every pick and every rejection, the reference images that unstuck it, and the copy.
ai: All of the implementation, the screenshots, the recorded game sessions, and a QA sweep that caught bugs I'd have shipped.
---

## The brief

A portfolio for someone hiring a VP of Engineering. It had to be honest that AI writes most of my code now, and it had to prove I still own the judgment. So the site itself had to be built that way.

## What "directing" actually looked like

The first version was a résumé in disguise, and I said so. The second was dark, gold and literary, a near-twin of Unopened Worlds. Then came palettes, five typefaces, a poster style with hard shadows and a tilted banner, three more styles, three variants of the one that was "better but still boring", and five "flourishes" for the empty white space, including a compass, a Zork map and a live text-adventure prompt.

Most of those were good work. They were also wrong, and saying so quickly was the job.

## What unstuck it

Words weren't enough. Two things were: a link to another company's website, for the soft waves in the background, and three stock photos of code on a screen, which became the source-code panels at the bottom of every case study. When the AI had a picture of what I meant, it nailed it on the first try.

## What I learned

The model is fast and tireless, and it will happily polish the wrong idea for hours. It needs someone who knows what good looks like, says no early, and shows rather than tells. That's not a new skill. It's the same one I use with engineering teams.
