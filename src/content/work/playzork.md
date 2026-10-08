---
title: PlayZork
kind: exhibit
order: 4
kicker: Teaching an LLM to play Zork
summary: Research on LLM agents in long-horizon problems. A single model with memory loops and thrashes, so I built a multi-agent design in which narrow agents argue for competing goals and a separate arbiter decides.
years: 2025 – now
role: Researcher
stack: [Python, LangChain, LangGraph, Ollama, Qwen 2.5 14B, SQLite]
diagram: agents
links:
  - { label: Source on GitHub, url: "https://github.com/arsindelve/PlayZork", short: Source }
  - { label: "Zenodo · DOI 10.5281/zenodo.18224702", short: Paper, url: "https://doi.org/10.5281/zenodo.18224702" }
stats:
  - { n: "½", label: "turn time after cutting calls from 10 + 2N to 5 + N" }
  - { n: "45s", label: "for bare Claude Opus 4.7 to clear my escape room" }
  - { n: "MSc", label: "in progress at East Texas A&M, where this research continues" }
me: The research question, the architecture, the experiments, and the uncomfortable conclusions.
ai: The subject. And, eventually, the benchmark that humbled the scaffolding.
---

## The question

Zork is a hard environment for an LLM. You have to track several unsolved puzzles, a map, partial progress and competing priorities, over hundreds of turns. A single model call, even with persistent memory, loops, thrashes and loses track of what it already learned.

So the question was: **does explicit arbitration improve long-horizon decisions compared with a single model call?**

## The architecture

The design separates proposing from deciding. No single agent carries the whole decision.

- **Issue agents**, one for each unresolved problem, are deliberately narrow, stubborn and single-minded. Each one proposes one action and argues for it.
- **An explorer agent** proposes information-gathering moves and competes with them. Exploration is a first-class agent, not a fallback.
- **An arbiter** sees every proposal and a summary of the current state, and picks exactly one action.

Around them sit an observer that finds new issues, a map graph with pathfinding, death analysis that persists lessons learned, and a per-turn report of every proposal and decision. A single-call control condition gets the same information and the same model.

## What I found

The honest version: it doesn't solve Zork. What it did produce was useful:

- Restructuring cut model calls per turn from **10 + 2N to 5 + N** and halved turn time. Running the agents concurrently didn't help: local inference throughput stayed flat at about 0.26 requests per second.
- An audit of the scaffolding found the real bugs: a mis-named tool that hid the inventory, successful moves recorded as walls, rooms with the same name merged into one. **A weak model cannot compensate for corrupted scaffolding.**
- Then I gave my escape-room benchmark to Claude Opus 4.7 with none of my scaffolding. It escaped in 45 seconds. My enhanced setup escaped about half the time, after 30 to 60 minutes.

That last result is the one I think about most, as a researcher and as an engineering leader. The ground moves fast. Build for the models that are coming, not just the one you have.
