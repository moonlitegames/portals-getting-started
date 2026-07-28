---
title: Mental Model
description: How to think about your existing game in terms of the Portals platform.
---

You already know how a game engine is put together: a scene graph of entities or prefabs, components or scripts attached to them, and an event/physics loop tying it all together. Portals maps onto that mental model, but it flattens some layers and removes others entirely. This page is the translation table — read it before you try to port anything, so you're not hunting for a scene tree that doesn't exist.

## Translation table

| Your engine (Unity / Godot / Unreal) | Portals | Notes |
|---|---|---|
| Scene / level | **Room** | A persistent, server-backed document addressable by a room ID (`create_room`), not a build-time asset. You read it with `get_room_data` and patch it with `apply_operations` — closer to editing a live database than loading a scene file. |
| Entity / GameObject / prefab | **Item** | A placed instance sourced from the marketplace (`search_marketplace`, `claim_marketplace_item`), generated on demand (`text_to_3d_model`), or uploaded directly (`upload_glb`) if you're bringing your own exports. |
| Component script (MonoBehaviour, Node script, Blueprint graph) | **Trigger + Effect pair** | Event-driven, not imperative: a Trigger fires on a condition (click, collision, zone enter/exit, key press) and wires to one or more Effects (teleport, change a value, show/hide, play a sound). There's no per-frame `Update()` — everything is a reaction to a named event. |
| Arbitrary scripting logic | **JS effectors** (Function Effect) | The closest thing to real code, but it's an expression language (NCalc), not JS or C#: conditionals and math over task states and variables, no loops, no arrays, no custom functions. Live results are inspectable with `get_runtime_data`. |
| Quest/objective plugin or custom state machine | **Task system** | Every task is a three-state tracker — `NotActive` → `Active` → `Completed`. Chain them with dependent tasks for multi-step quests, and flip a visibility flag to surface one in the player-facing quest log. |
| Lighting window, post-processing volume, physics settings, XR rig config | **Room settings** (`set_room_settings`) | Lighting, skybox, fog, movement/physics, avatar behavior, and voice chat are one tool call against the room, not a dozen separate engine subsystems. |
| Canvas / UI Toolkit / Control nodes | **Iframes** | HUDs and menus are HTML/CSS/JS overlays with bidirectional messaging, not a native UI system. Think "WebView layer," not "UI framework." |

## The biggest shift: no general-purpose scripting

Everything above is a re-labeling except one thing, and it's the one that actually changes how you design: there is no loop, and no imperative script that owns a piece of behavior over time. A Unity `MonoBehaviour.Update()` or a Godot `_process()` doesn't have an equivalent. Instead:

- Continuous behavior (a timer, a patrol, a repeating check) is built as a task that re-activates itself with a delay — a self-resetting loop made out of state transitions, not a `while` loop.
- Conditional logic lives in Function Effect expressions (`if($N{coins} >= 10, ..., ...)`), evaluated once per trigger firing, not once per frame.
- Anything that would be a data structure in your engine (an inventory array, a list of active enemies) has to be represented as flat named variables or as items you query for, since there are no arrays in the expression language.

Porting a mechanic, then, is less "translate this script" and more "decompose this script into a graph of triggers and effects." A health-and-damage system that was fifty lines of C# might become three or four small tasks: one that reacts to a `Player Died` trigger, one that resets health on respawn, one Function Effect that clamps the value. That decomposition step is most of what [Porting Workflow](/porting/porting-workflow/) walks through.

## What carries over cleanly

Multiplayer state, room settings, and the quest/task system map closely enough to a state-machine mental model that most designers coming from Unity's Animator or a custom FSM will feel at home immediately. If your original game was already organized as discrete states and transitions rather than one long-running script, porting the logic layer will feel more like a re-skin than a rewrite.

## What to check before you assume something translates

Not every mechanic decomposes cleanly into triggers and effects — some genuinely don't fit the expression-language model. Before you sink time into designing a port for a specific mechanic, check [Capabilities](/porting/capabilities/) for how to verify feasibility with the MCP's own planning tools, rather than discovering the gap mid-build.

## Try it

Paste in a script or behavior description from your existing game and ask Claude to translate it into this vocabulary:

```text
Here's how my [health / inventory / enemy AI / whatever] system works in
[Unity/Godot/Unreal]: [describe it, or paste the script]. Using the
Portals mental model — rooms, items, triggers/effects, tasks, and JS
effectors — tell me how you'd decompose this into Portals concepts
before we build anything.
```
