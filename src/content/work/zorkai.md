---
title: ZorkAI
kind: exhibit
order: 1
kicker: Zork I, rebuilt with an AI narrator
summary: The game that started Infocom, reimplemented from scratch with every room, object and puzzle intact, and a parser that finally understands what you meant. When you try something the 1980 game never anticipated, an AI narrator answers in character.
years: 2024 – now
role: Creator, architect, lead developer
stack: [C#, .NET, AWS Lambda, DynamoDB, React, OpenAI, Ollama, Docker]
cover: ../../assets/shots/newzork.png
coverAlt: A recorded Zork AI session. The player tries to eat the mailbox, take the house, hear a joke and kick the house, and the AI narrator answers each in character.
animation: zork
embed:
  url: https://newzork.ai
  label: Play Zork
links:
  - { label: newzork.ai, url: "https://newzork.ai", short: NewZork }
  - { label: planetfall.ai, url: "https://planetfall.ai", short: Planetfall }
  - { label: Source on GitHub, url: "https://github.com/arsindelve/ZorkAI" }
stats:
  - { n: "3,400+", label: "tests pinning down original behavior" }
  - { n: "700+", label: "commits since March 2024" }
  - { n: "300+", label: "merged pull requests" }
  - { n: "2", label: "games live on one engine" }
me: The architecture, the game engine, the decision about when the model is and isn't allowed to speak, and, in 2024, every line of code.
ai: The narrator, in production. Since 2025, AI agents write much of the new code against the test suite, and I review it.
---

## Why I built it

> I LOVE Infocom games. In my youth, they gave me hours of entertainment, and began my love of personal computing.

I still collect and play them. But for anyone who didn't grow up with text adventures, they can feel like relics: you type something perfectly reasonable and the game answers *That sentence isn't one I recognize.* I wanted to make them feel richer, deeper and more alive for a new generation, without changing what made them great.

There are plenty of fully AI-generated dungeons out there. That wasn't what I wanted. I didn't want *new* games. I wanted every setting, location, story beat, joke and puzzle of the originals preserved, and an AI that made the interactivity deeper: a parser that understands what you type, and a narrator who answers anything, in character, without breaking the spell.

I started with Zork because it's the best known and one of the simplest. What I really wanted was [Planetfall](/work/planetfall).

## The rule: the model speaks last

The obvious design is to put an LLM in front of everything. That would be slow, expensive and, worst of all, unfaithful: a model improvising Zork is not Zork. So every command goes through four layers, and the model is the last resort:

1. **System commands** like save, restore and inventory are handled immediately.
2. **The game's own parser** handles everything it can, deterministically, with the original text.
3. **An AI parser** maps natural language the game can't handle onto real game actions.
4. **An AI narrator** answers in character only when no action applies.

When a command advances the story or changes the game, you get the original response, exactly as written. The AI only steps in when it can add something without breaking the game. AI enhancement, not AI replacement.

One of my earliest notes on the project put the whole philosophy in a sentence: the kitchen description mentions a table, so you should be able to interact with it, *but it must produce no state change*.

## What that feels like

Try to pull the mailbox out of the ground.

- **Zork, 1980:** *That sentence isn't one I recognize.*
- **ZorkAI:** *It seems the postal service invested in anti-theft roots.*

Kick the mailbox. Tell the game you're bored. Try to fly away to Canada. The narrator is an exasperated, sarcastic guide who knows exactly where you are and what you're carrying, and it won't let you take the house.

## Getting the voice right

The code to call a model is simple. The hard part, and the reason it works, is the prompts. In the first months I spent hours tuning them, and the parser went through generations: AWS Lex, which was barely better than Infocom's original, then Claude for understanding input, with a separate model writing the narration.

The hardest problem turned out not to be wit. It's restraint. A narrator that doesn't know an object hasn't been built yet doesn't go quiet; it invents something confident and plausible, and an unfinished room starts to feel like a different game. So the engine now counts every time a command falls through to the narrator, and tests drive that number to zero.

## Engineering it like a product

Each game is its own project on a shared C# engine. Thousands of deterministic tests pin down how the originals behave, room by room and puzzle by puzzle, including full walkthroughs that double as proof the game can still be won. That's what makes it safe to change anything at all. None of Infocom's original code is used; everything is rebuilt from the games' observable behavior.

In production, each game runs as its own AWS Lambda behind a React client, with the entire game state carried in the session, so every turn is stateless. When a player asked to play offline, the whole stack learned to run locally in Docker against any OpenAI-compatible model server, including Ollama. No cloud account required.

## How it's built now

In 2024 I wrote every line. Today most new code comes from AI agents working against that test suite. I write the issue, sometimes a single line ("implement this, follow all existing patterns, add tests"), and review what comes back. There's even an AI playtester, [AdventureBreaker](/work/adventurebreaker), whose only job is to break the narrator in production.

## One engine, more worlds

Zork I is complete. [Planetfall](/work/planetfall) runs on the same engine. A Zork II stub exists mostly to prove how quickly a new game can be added, and a Stationfall port is underway, which I'm building partly so I can finally play it fresh. The agents working on it follow one rule I'm especially fond of: no spoilers for the owner.

Someday, *A Mind Forever Voyaging*.
