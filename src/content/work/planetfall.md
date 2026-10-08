---
title: Planetfall AI
kind: exhibit
order: 2
kicker: Floyd is back, and now he listens
summary: Steve Meretzky's 1983 science-fiction classic, rebuilt room by room on the ZorkAI engine. You're still a lowly Ensign Seventh Class scrubbing the deck of the Feinstein. Now you can talk to Floyd, Blather and the Ambassador in plain English, and they answer in character.
years: 2024 – now
role: Creator, architect, lead developer
stack: [C#, .NET, AWS Lambda, DynamoDB, React, OpenAI]
cover: ../../assets/shots/planetfall.png
coverAlt: A recorded Planetfall AI session on Deck Nine. The player sings the Stellar Patrol anthem, asks a scrub brush for career advice and questions a slime-trailing alien ambassador about his celery.
animation: planetfall
embed:
  url: https://planetfall.ai
  label: Play Planetfall
links:
  - { label: planetfall.ai, url: "https://planetfall.ai", short: Play }
  - { label: Source on GitHub, url: "https://github.com/arsindelve/ZorkAI", short: Source }
stats:
  - { n: "1983", label: "the original, by Steve Meretzky" }
  - { n: "128", label: "rooms rebuilt from scratch" }
  - { n: "1", label: "review from the original author" }
quote:
  text: "It's quite wonderful; all the new text feels quite at home in the spirit of the game."
  by: Steve Meretzky, creator of Planetfall, after playing an early build
me: Rebuilding the game's world, characters and puzzles on the engine, and deciding how much personality the narrator is allowed to add.
ai: The voices of the narrator, Floyd, Blather and the Ambassador. In development, AI agents write much of the code against the test suite while I review.
---

## Why Planetfall

Between the ages of about eight and twelve, an Apple IIc was my portal to Infocom. I thought about the puzzles even away from the computer. I remember sitting at the back of a seventh-grade classroom trying to work out how to get past the mutants in *Planetfall*, and when I finally did, it gave me a sense of accomplishment and wonder I'll never forget.

Planetfall and *A Mind Forever Voyaging*, both by Steve Meretzky, were my two favourites. I started [ZorkAI](/work/zorkai) with Zork because it was simpler. Planetfall was always the point.

## Bringing Floyd to life

Floyd is the heart and soul of the game: a small, childlike multipurpose robot who follows you around, wants to play Hider-and-Seeker, and in 1983 made people cry. When I started, I wrote that the challenge I was most looking forward to was seeing how far I could go in letting you have real conversations with him, while keeping all the childlike charm that made him the star.

In the original, Floyd was wonderful but scripted. Now he understands everything you type. Talk to him. Ask him to dance. Ask him about the control panel. He reacts to the world around him, and his idle chatter is generated fresh, on purpose, instead of repeating one canned line. Under the hood, Floyd has his own conversational service, separate from the narrator.

The same goes for the rest of the cast. Ensign First Class Blather still hands out demerits and still sneers at your polishing. The Ambassador from Blow'k-bibben-Gordo still leaves a trail of slime and still has opinions about his celery.

## Protecting the story

The more the characters can say, the more ways they can say the wrong thing. Before you'd met Floyd, the narrator kept improvising jokes about him, and later it kept making them in exactly the wrong tone. So now, mention Floyd before he exists and the game answers: *Floyd? There's nobody here by that name. Someone's played Planetfall before, haven't they?* Afterwards, it simply says *Floyd is gone.*

The hardest bug was the quietest. Floyd's big moment, the scene everyone remembers, could not happen in production. One piece of his state was never saved between turns, and because every turn runs on a fresh server, the game was unwinnable online while every test on my machine passed. Tests that replay the whole game against the real, stateless setup came out of that one.

## Faithful first

Every room, object, puzzle, score and saved game has been rebuilt from scratch in the new engine: the Feinstein, the escape pod, the Kalamontee and Lawanda complexes, the shuttles, the mutants. The rebuild is playable from start to finish and still being polished. AI hints, grounded in the game's own walkthrough tests instead of guesses, are next.

## The best review I've had

Steve Meretzky, who wrote Planetfall in 1983, played an early build. His verdict: "It's quite wonderful; all the new text feels quite at home in the spirit of the game." He also found a lot of bugs. We're working on it.
