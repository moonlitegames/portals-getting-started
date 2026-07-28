---
title: Gotchas
description: Common pitfalls and surprising behaviors to watch out for.
---

Five things that trip people up often enough to write down. None of these are bugs — they're places where the platform's actual behavior doesn't match the assumption a new builder (or an assistant guessing on your behalf) is likely to bring in from a traditional game engine.

## Spotlights that look wrong once placed

A spotlight added in a build session can look fine in the position you placed it and then look wrong — too dim, too tight a cone, barely visible — once you're actually standing in the room as a player. This happens because a light's cone angle and range interact with your room's actual scale, and a value that looked reasonable from a build-mode vantage point doesn't automatically translate to how it reads from player eye height and player-scale distances. Don't judge a spotlight from the angle you placed it at — after any lighting change, do a `render_scene` check from roughly where a player would actually stand, and adjust range/angle from that view, not the build view. See `get_context` for the current spotlight parameter reference rather than guessing at values.

## Spawn radius and multiplayer stacking

A single spawn point with no radius will look completely fine every time you test alone — you're the only one spawning there, so there's nothing to collide with. It breaks the moment two or more real players join at once: everyone lands at the identical point, and you get stacked or clipped-together players until they move apart. This is the same class of mistake as testing a networked feature solo and assuming it works — the bug only exists under concurrency. If your room supports multiple simultaneous players, verify actual spread with two or more real sessions connected together, not just a solo playtest, and use multiple named spawn points (or a configured spread radius) rather than one shared point whenever more than one player can arrive at the same trigger.

## Parenting and moving platforms

If you move or rotate an object that other items are supposed to travel with — a moving platform, a vehicle, a rotating base — those items only follow if they're actually parented to it in the room's item hierarchy. Visual proximity in the scene isn't the same as a parent-child relationship, and an item that merely sits on top of a platform without being parented to it will appear to "fall through" or get left behind the moment the platform moves. Before wiring movement logic to a compound object, confirm the parent-child relationships explicitly — `inspect_room_data` or `query_room` will show you the actual hierarchy, which is more reliable than trusting what looks connected in a screenshot.

## Rotation and orientation mismatches on imported models

A model that looked correctly oriented in your original engine can come in rotated — lying on its side, facing backward — once placed in Portals. The usual cause is an axis-convention mismatch baked into the export: Unity, Blender, and Unreal don't all agree on which axis is "up" or "forward," and a GLB carries whatever convention it was exported with. This is an import-time correction, not a logic bug, and it's easy to misdiagnose as broken trigger wiring when the object is actually just facing the wrong way. After uploading or placing any imported model, `render_scene` it before wiring any logic to it, and correct orientation with a small, verified rotation adjustment rather than guessing a large compound rotation in one shot — compounding several unverified rotation changes is how you end up chasing a gimbal-lock-shaped problem that was really just one wrong axis at the start.

## The `apply_operations` freshness model

`apply_operations` enforces a strict rule worth knowing before it surprises you: it runs "atomic targeted ops against a mandatory fresh room download" and never uploads a partial batch or falls back to stale local data. In practice, that means every batch of operations needs its own fresh `get_room_data` snapshot taken immediately beforehand — if the room changed since you last downloaded it (another slice was applied, a collaborator built something, an earlier step in the same session already patched it), the operation is rejected rather than silently overwriting or half-applying on top of data that's already moved on.

This is a gotcha-*preventer*, not a gotcha: it's exactly the mechanism that stops the classic "two edits clobber each other" failure mode common with plain scene files. The mistake to avoid is working around a rejected batch by reaching for `set_room_data` (a full replacement) just to force it through — that discards anything that changed since your stale snapshot instead of surfacing the conflict. Re-download and retry the targeted operation instead, especially if you're applying several slices back-to-back in the same session (see [Porting Workflow](/porting/porting-workflow/)).

## Try it

Ask Claude to check a room you're actively working on for the two easiest ones to silently get wrong:

```text
Check my current room for spawn points with no configured spread and any
items that look parented to a moving object but might not actually be —
use inspect_room_data or query_room to confirm the real hierarchy rather
than guessing from how it looks.
```
