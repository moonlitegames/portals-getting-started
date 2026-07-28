---
title: Capabilities
description: What the Portals MCP can and cannot do.
---

If you've ported anything to a new engine before, you know the expensive mistake: designing a whole system around a mechanic the target platform can't actually do, and finding out after you've built it. The Portals MCP ships tools specifically to prevent that — use them **before** you write a design doc entry, not after a build fails.

## The planning tools

- **`resolve_gameplay_capability`** — takes a plain-language description of a mechanic and classifies it: `supported`, `workaround`, `unsupported`, or `unknown`. This is your feasibility gate.
- **`plan_gameplay_mechanic`** — for anything supported or workaround-able, returns a compact implementation contract: required capabilities, the objects/variables/triggers it needs, validation steps, known risks, and sources. Ask for this before designing the room around a mechanic, not after.
- **`get_context`** — pulls targeted specs, syntax references, gotchas, recipes, and suggested tools for whatever you're working on. Use it like you'd use an engine's API docs mid-implementation.
- **`lookup`** — fast knowledge search over items, triggers, effects, and systems when you need to know if something specific already exists.
- **`search_recipes`** — queries a built-in recipe manifest (dice, board games, keypads, leaderboards, cutscenes, and more) for existing patterns. If your mechanic resembles something common, there's a decent chance a recipe already covers the wiring — check before designing from scratch.

The practical workflow: for every mechanic in your design doc, ask Claude to call `resolve_gameplay_capability` first. Supported → proceed. Workaround → get the `plan_gameplay_mechanic` contract and expect the implementation to look different from your original engine's approach (see [Mental Model](/porting/mental-model/)). Unsupported or unknown → redesign that piece now, while it's still a paragraph, not a built room.

## What tends to map well

Portals' task/trigger/effect architecture is fundamentally event-driven and state-machine based, with native multiplayer sync. As a rule of thumb, genres and mechanics that decompose into "on event X, do Y" plus a handful of numeric variables tend to port cleanly — treat the following as guidance to sanity-check against the planning tools above, not a guarantee:

- Social and party games, quests and exploration, collectible hunts, racing and time trials, tag/hide-and-seek, trivia and quiz formats, escape-room and inventory puzzles, and simple trading/economy mini-games tend to fit well.
- Anything built around discrete states and transitions rather than continuous simulation tends to translate directly — if your original design already leaned on a finite-state machine or an animator-style graph for its logic, that structure maps closely onto tasks and triggers.
- Multiplayer coordination (team assignment, shared scores, shared world state) leans on a first-class, native feature here, not a bolt-on — this is usually easier than in an engine where you'd hand-roll networking.

## What tends to map poorly

The honest constraint, from [Mental Model](/porting/mental-model/): the closest thing to scripting is an expression language (NCalc via Function Effects/"JS effectors") with conditionals and math, but **no loops, no arrays, and no custom functions**. As guidance, that tends to rule out, or make expensive, anything that leans on:

- Continuous per-frame simulation — custom physics-driven puzzles, projectile trajectories computed frame-by-frame, anything that isn't naturally event-driven.
- Complex AI — pathfinding, behavior trees, or anything stateful across many entities that isn't expressible as a handful of task transitions.
- Procedural generation that leans on loops or arrays at logic-execution time (dynamic dungeon layouts computed on the fly, for example — pre-generating and placing via marketplace/AI-asset tools is a different story, see [Assets](/porting/assets/)).
- Heavy persistent-save systems beyond what room and user inventory already model — cross-room progression that needs its own data schema tends to be a workaround at best, not a built-in.

None of this means "impossible" — `resolve_gameplay_capability` returning `workaround` is common and often fine. Treat this section as a starting intuition, not a substitute for actually checking: don't assume your engine's approach transfers, and get the `plan_gameplay_mechanic` contract before committing design-doc language to a specific implementation.

## Tool profiles

`portals-mcp` exposes three tool profiles via `PORTALS_MCP_TOOL_PROFILE`:

| Profile | Tools | What it's for |
|---|---|---|
| **`compatibility`** (default) | 53 | The full surface: marketplace/inventory, room management, scene design, live game connection, AI-generated assets, and the planning tools above. This guide, and [Setup](/start-here/setup/), assume this profile throughout. |
| **`expert`** | 27 | Low-level debugging and escape-hatch tools, for direct manipulation once you know exactly what you're doing. |
| **`builder`** | 7 | Opt-in, outcome-oriented tools (`manage_project`, `inspect_game`, `start_build`, `apply_build`, `playtest_build`, `finalize_build`, plus `authenticate`) — an MCP 2.0 candidate, not the path this guide documents. |

You don't need to set anything to use `resolve_gameplay_capability`, `plan_gameplay_mechanic`, `get_context`, `lookup`, or `search_recipes` — they're all in the default `compatibility` profile, live from the moment your MCP connection is up. If you want to inspect exactly which tools and capabilities a given profile exposes without cross-referencing this table, the bundled `docs://ai/tool-capability-manifest` resource is the authoritative, queryable source — ask Claude to read it directly.

## Try it

Before you write a single line of your Portals design doc, run every mechanic from your existing game through this check:

```text
Here's a mechanic from my original game: [describe it in one or two
sentences]. Call resolve_gameplay_capability on it, and if it's
supported or a workaround, follow up with plan_gameplay_mechanic and
show me the implementation contract before we design anything further.
```
