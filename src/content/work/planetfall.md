---
title: Planetfall AI
kind: exhibit
order: 2
kicker: Floyd is back, and now he listens
summary: Steve Meretzky's 1983 science-fiction classic, rebuilt room by room on the ZorkAI engine. You're still a lowly Ensign Seventh Class scrubbing the deck of the Feinstein. Now you can talk to Floyd and Blather in plain English, and they answer in character.
years: 2024 – now
role: Creator, architect, lead developer
stack: [C#, .NET, AWS Lambda, DynamoDB, React, OpenAI]
cover: ../../assets/shots/planetfall.png
coverAlt: A session of Planetfall AI on Deck Nine of the Feinstein. Asked to sing the Stellar Patrol anthem, the narrator notes the acoustics are surprisingly good for a spaceship.
embed:
  url: https://planetfall.ai
  label: Play Planetfall
links:
  - { label: planetfall.ai, url: "https://planetfall.ai" }
  - { label: Source on GitHub, url: "https://github.com/arsindelve/ZorkAI" }
stats:
  - { n: "1983", label: "the original, by Steve Meretzky" }
  - { n: "1", label: "puzzle left: playable up to the finale" }
  - { n: "1", label: "review from the original author" }
me: Rebuilding the game's world, characters and puzzles on the engine, and deciding how much personality the narrator is allowed to add.
ai: The voices of the narrator, Floyd and Blather. In development, AI agents write much of the code against the test suite while I review.
---

## Why Planetfall

*Planetfall* was the game I couldn't stop thinking about as a kid. I remember sitting at the back of a seventh-grade classroom working out how to get past the mutants. It's also the hardest test for an AI narrator, because the game is built around a character: Floyd, the robot companion, who has made players laugh and, famously, cry for forty years.

## Same engine, harder problem

Planetfall runs on the same engine as [ZorkAI](/work/zorkai): the game's own parser first, the AI only when the game has nothing to say. But Zork is mostly rooms and objects, and Planetfall is people. The narrator has to let you ask Floyd about the control panel, or tell Blather what you think of him, and answer the way those characters would, without inventing plot the game doesn't have.

The rebuild is playable up to the final puzzle.

## The best review I've had

Steve Meretzky, who wrote Planetfall in 1983, played an early build. He liked it. He also found bugs.
