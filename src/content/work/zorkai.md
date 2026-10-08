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
  - { label: newzork.ai, url: "https://newzork.ai" }
  - { label: planetfall.ai, url: "https://planetfall.ai" }
  - { label: Source on GitHub, url: "https://github.com/arsindelve/ZorkAI" }
stats:
  - { n: "3,400+", label: "tests pinning down original behavior" }
  - { n: "700+", label: "commits since October 2024" }
  - { n: "300+", label: "merged pull requests" }
  - { n: "2", label: "games live on one engine" }
me: The architecture, the game engine, the decision about when the model is and isn't allowed to speak, and most of the early code.
ai: The narrator, in production. In development, AI agents now write much of the code against the test suite, and I review it.
---

## The idea

Infocom's parser was a marvel in 1980. It still answered most of what people actually typed with some version of *I don't know that word*. I wanted to keep everything that made these games great (the writing, the puzzles, the sense of a world on the other side of the prompt) and replace only the part that broke the spell.

## The key decision: the model speaks last

The obvious design is to put an LLM in front of everything. That would be slow, expensive and, worst of all, unfaithful: a model improvising Zork is not Zork. So every command goes through four layers, and the model is the last resort:

1. **System commands** like save, restore and inventory are handled immediately.
2. **The game's own parser** handles everything it can, deterministically, with the original text.
3. **An AI parser** maps natural language the game can't handle onto real game actions.
4. **An AI narrator** answers in character only when no action applies.

Simple commands never touch an LLM. When a command moves the story, you get the original prose. The AI only speaks when it can add something without breaking the game.

## Engineering it like a product

Each game is its own project on a shared C# engine. More than 3,400 tests pin down how the originals behave, room by room and puzzle by puzzle, which is what makes it safe to change anything at all. Each game runs as its own AWS Lambda behind a React client, with sessions in DynamoDB. The whole stack also runs locally in Docker, against any OpenAI-compatible model server, including Ollama.

None of Infocom's original code is used. Everything is reimplemented from the games' observable behavior.

## One engine, more worlds

Zork I is complete. [Planetfall](/work/planetfall) runs on the same engine and is playable up to its final puzzle, and a Zork II stub exists mostly to show how quickly a new game can be added.
