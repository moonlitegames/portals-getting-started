---
title: Porting Workflow
description: The step-by-step workflow for porting an existing game to Portals.
---

This assumes you're arriving with an existing design doc — a GDD, a mechanic list, whatever your original engine project already has — and you don't want to redesign from scratch. This is the pipeline for taking that document through to a working room without losing the design work you've already done.

## 1. Decompose

Break the doc into a flat list of individual mechanics and systems: movement modifier, inventory, day/night cycle, boss encounter, dialogue tree, scoring, whatever it contains. Use the same granularity you'd use to split work across an engine's systems — not full implementation detail yet, just a clean list you can check off one at a time.

## 2. Feasibility-check each one

Before any of these mechanics goes into a Portals-specific design doc, run it through `resolve_gameplay_capability` and, for anything supported or workaround-able, `plan_gameplay_mechanic`. Full detail on this step is in [Capabilities](../capabilities/) — the point here is sequencing: do this for every mechanic on your list *before* you commit any of them to a specific implementation. It's much cheaper to discover a mechanic needs redesigning at the list stage than after you've built two other systems on top of an assumption about it.

## 3. Reorder by risk, not by story order

Your original doc probably lists mechanics in the order the player encounters them. Ignore that order for building. Sort by uncertainty instead — build the mechanic you're least sure will work first, as an isolated slice, before touching anything you're confident about. If the boss encounter's targeting logic is the risky part of your game, prove it out before you've spent time on the tutorial area around it. Finding a blocker early costs you one slice; finding it late costs you everything built on top of the wrong assumption.

## 4. Build in slices

One mechanic, or one tightly coupled group of mechanics, at a time. Each slice is an `apply_operations` call against a fresh `get_room_data` snapshot — targeted, atomic changes with baseline verification, not a wholesale `set_room_data` replacement of the whole room. This is the same discipline as small, reviewable commits instead of one giant merge: if a slice breaks something, you know exactly which change did it.

## 5. Playtest each slice before starting the next

This is [The Loop](../../start-here/the-loop/) from Start Here, applied per-mechanic instead of per-whole-game. A slice that looks right in a `render_scene` screenshot still needs an actual playthrough — a screenshot shows you what the room looks like, not what it feels like to trigger that specific mechanic. Play it yourself, or drive it live via `connect_to_game` and `poll_game_events` (see [Debugging](../debugging/)) if you want Claude verifying behavior in the same session.

Don't start the next slice until the current one is confirmed working end to end. Mechanics in Portals frequently share variables and tasks (a score variable read by both a HUD trigger and a win-condition check, say) — compounding an unconfirmed bug under a second unconfirmed mechanic makes the eventual debugging session much worse than two separate, verified slices would have been.

## 6. Integrate, then repeat

Once a slice is confirmed, move to the next item on your risk-ordered list. Repeat decompose → feasibility-check (already done in step 2, but re-check anything that changed) → build → playtest until the list is empty.

## One workflow difference worth calling out

Unlike a local engine build you can preview privately before committing, every slice you apply to a room is live at the same URL immediately — there's no separate "build" artifact sitting unpublished until you're ready. If you need to playtest a slice without exposing it to anyone who might have the room link, gate it behind something only you can reach — a debug-only spawn point, or a trigger zone off the main path — rather than assuming it's hidden by default.

## Try it

Hand Claude your mechanic list and ask it to run the first two steps of this pipeline for you:

```text
Here's the mechanic list from my design doc: [paste it]. For each one,
call resolve_gameplay_capability, and for anything supported or a
workaround, get the plan_gameplay_mechanic contract. Then give me a
build order sorted by risk — riskiest/least-certain mechanics first —
so we can build and playtest them as isolated slices.
```
