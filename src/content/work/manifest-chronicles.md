---
title: The Manifest Chronicles
kind: exhibit
order: 9
placement: coda
kicker: A dungeon crawler I wrote in high school, running again
summary: In 1992, in high school, I wrote a first-person dungeon crawler in QuickBASIC. In 2026 I had Claude Code port it to TypeScript, verified it screen by screen against the original, and kept the 1995 bugs on purpose.
years: 1991 – 1999, 2026
role: Original author (1992). Director and verifier of the port (2026).
stack: [QuickBASIC 4.0, MS-DOS, TypeScript, DOSBox, QB64]
cover: ../../assets/shots/manifest.png
coverAlt: The first-person wireframe corridor from The Manifest Chronicles, with stat panels for Michael and his companion Floyd.
embed:
  url: https://arsindelve.github.io/manifest-chronicles/
  label: Play it
links:
  - { label: Play in your browser, url: "https://arsindelve.github.io/manifest-chronicles/" }
  - { label: Source on GitHub, url: "https://github.com/arsindelve/manifest-chronicles" }
stats:
  - { n: "1991", label: "my first game, Catacombs of Despair, compiled" }
  - { n: "48", label: "monster types across four 50×50 levels" }
  - { n: "0", label: "changes to the original data files" }
me: The game, in 1992. In 2026, the decision to port it faithfully rather than remaster it, and the screen-by-screen verification against version 2.01 running in DOSBox.
ai: The TypeScript port. Claude Code read my teenage QuickBASIC and rebuilt it for the browser.
---

## 1991

In December 1991 I compiled my first game, *Catacombs of Despair*, with QuickBASIC 4.0. A few months later came the sequel: you pick a race and a class, name a companion, and descend through four mazes toward a final battle with a wizard named Beldan. Version 1 was finished in April 1992. Version 2.01, with rebalanced weapons and armor, followed in 1994.

By 1995 the source had grown past QuickBASIC's 64 KB module limit, so version 2.01 only ran inside the editor. I kept going anyway, and between 1995 and 1998 I remade it in Visual Basic with graphics and sound. The last file change is dated November 10, 1999.

## How a teenager draws 3D

There's no projection math. The corridor is a set of `LINE` boxes, with a lookup table giving the rectangle for each depth. Maps are grids of numbers in plain text files, and so are the monsters, spells, weapons and armor. The game never calls `RANDOMIZE`, so the only thing that makes each game different is how long you wait on the title screen.

## 2026: a faithful port, not a remaster

The browser version reads the original data files unchanged, so the game's content exists exactly once. It was checked screen by screen against version 2.01 running in an emulator. The bugs are still there: the ending you can't reach because of a `COMMON` variable mismatch, the race stats that are backwards, the armor that only protects the player. Fixing them would have made it a different game.

I didn't write the TypeScript, and I'm not going to pretend I did. What I did was decide what "faithful" meant and then check that it was true. That's most of the job now.
