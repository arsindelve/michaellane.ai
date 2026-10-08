---
title: AdventureBreaker
kind: exhibit
order: 2.5
kicker: An AI whose only job is to break my AI
summary: Agentic QA for an AI-narrated game engine. An autonomous, adversarial playtester drives ZorkAI through its real production backend, walks it into deep game states, and attacks each one to break the engine, the parser and, above all, the narrator. Then it files the bugs.
years: "2026"
role: Designer, architect
stack: [Python 3.11, stdlib only, LLM critic, GitHub Actions]
diagram: breaker
links:
  - { label: Source on GitHub, url: "https://github.com/arsindelve/AdventureBreaker", short: Source }
  - { label: Findings ledger, short: Findings, url: "https://github.com/arsindelve/AdventureBreaker/blob/main/coverage/FINDINGS.md" }
stats:
  - { n: "122", label: "durable findings logged" }
  - { n: "81", label: "filed as issues against ZorkAI" }
  - { n: "86", label: "merged pull requests" }
  - { n: "0", label: "dependencies: pure standard library" }
me: The idea, the architecture (spine, ribs, the oracle stack, the narrator A/B) and the rule that every finding is verified against the engine source before it's logged.
ai: Most of the code. And the critic itself, the reasoning model that judges what the cheap checks can't.
---

## The problem

You can't unit-test a hallucination. Traditional QA asserts on fixed outputs, and that model breaks the moment an LLM is in the loop: an AI narrator's prose is non-deterministic, open-ended and unbounded. ZorkAI has thousands of tests for its engine, and none of them can tell you whether the narrator just invented a sword.

## Spine and ribs

The goal is not to win the game. It's to break it.

- **The spine** replays a known-good walkthrough, extracted from ZorkAI's own test fixtures, to drive the game into deep, varied states. Each step carries the expected output, so the spine doubles as a golden transcript.
- **The ribs** attack each state before moving on: adversarial inputs aimed at the engine, the parser and the narrator.
- **Save and restore** let it probe destructively, then fork back. Attacking never derails progress.
- **Narrator A/B.** Every command can run with the narrator on or off. Wrong with the narrator off is an engine bug. Right with it off but wrong with it on is a narrator bug.

## Cheapest checks first

Four layers of verification. The first three are free and deterministic: contract checks (errors, malformed responses, leaked stack traces), consistency checks (the prose says you took the item, but the inventory didn't change), and anchor checks against known text. Only what passes all three reaches the fourth: an LLM critic that judges hallucinations, character breaks, prompt-injection compliance, spoilers and lore contradictions.

## It has receipts

Every finding gets a stable ID, is deduplicated, and is tracked from open to filed to fixed in a committed ledger that remembers what has been tested across runs and computes what hasn't. The worst one so far: on production, roughly fourteen consecutive `wait` commands silently reset a Planetfall session, which made one of the game's own scripted sequences impossible to finish.

It also caught something I'd noticed myself while building this site. Address Floyd or Blather when they aren't in the room, and the game hands your command to the player instead of saying they aren't here.
