---
title: Unopened Worlds
kind: exhibit
order: 3
kicker: Thirty-two Infocom games, still sealed
summary: A tribute to the 32 Infocom "grey-box" games of 1980 to 1988, photographed from my own collection of sealed boxes, with the two AI rebuilds as the epilogue.
years: "2026"
role: Collector, photographer, editor, product owner
stack: [TypeScript, Next.js, S3, CloudFront]
cover: ../../assets/shots/unopened.png
coverAlt: The collector's wall on unopenedworlds.com, with framed, sealed Infocom boxes from Enchanter and Wishbringer to Zork I, II and III.
links:
  - { label: unopenedworlds.com, url: "https://unopenedworlds.com" }
  - { label: Source on GitHub, url: "https://github.com/arsindelve/UnopenedWorlds" }
stats:
  - { n: "32", label: "sealed grey-box games" }
  - { n: "1980–88", label: "before Infocom pivoted to graphics" }
  - { n: "2", label: "worlds unsealed, rebuilt with AI" }
me: The collection, years in the making. The photography, the writing, and every decision about what belongs and what doesn't.
ai: The site's code, written by Claude Code under my direction.
---

## Why

Between the ages of about eight and twelve I had an Apple IIc, and these games were where I went on it. Decades later I started collecting the boxes, and then I started rebuilding two of the games.

## What it is

The site is a wall: every grey-box game Infocom released between 1980 and 1988, before the company moved to graphics, each one photographed sealed and framed. Two worlds are "online", Zork I and Planetfall, and they link to the AI rebuilds you can play.

## How it was built

I directed the project, and Claude Code wrote it: a statically generated Next.js site served from S3 behind CloudFront, with a small CloudFront function handling clean URLs. My part was the part a model can't do. I chose what to include and what to exclude, decided how a collection like this should feel, and wrote the words.
