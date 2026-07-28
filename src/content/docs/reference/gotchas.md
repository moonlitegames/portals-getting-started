---
title: Gotchas
description: Common pitfalls and surprising behaviors to watch out for.
---

Five things that trip people up often enough to write down. None of these are bugs — they're places where the platform's actual behavior doesn't match the assumption a new builder (or an assistant guessing on your behalf) is likely to bring in from a traditional game engine. The bundled `docs://reference/gotchas` resource inside the `portals-mcp` package has the exhaustive list (200+ entries covering field naming, JS sandbox limits, quest schema, multiplayer sync, and more) — what follows is a curated summary of the ones most likely to bite you first.

## Spotlights that face the wrong way

A spotlight placed with identity rotation `(0,0,0,1)` fires its cone **horizontally along world +Z** — it does *not* point down. This is the single most common cause of "my spotlight isn't lighting anything," because the mental model from real-world stage rigs assumes a light you put above something will illuminate what's below it. In Portals, the `SpotLight` cone follows the item's local +Z axis, so identity rotation means "straight ahead," not "straight down."

**Why it bites:** you place a spotlight at `y: 3`, leave `rot` at default, and the beam shoots sideways instead of at the floor. The room still builds with no errors.

**The fix:** to aim a spotlight straight down, set `rot` to `(-0.7071068, 0, 0, 0.7071068)` — that's -90 degrees around X. The bundled `docs://ref/items/spotlight` resource includes a full aim-direction cheatsheet (down, up, left, right, forward, back) with the exact quaternion for each. The `ang` field (default 80 degrees) controls cone spread, `r` controls range in meters, and `b` controls brightness — adjust all three after placing, not just one, since they interact with room scale.

## Spawn radius and multiplayer stacking

A single spawn point with `r: 0.0` (the default) will look completely fine every time you test alone. It breaks the moment two or more real players join at once: everyone lands at the identical `absPos` coordinates, and you get stacked or clipped-together players until they move apart. The spawn's `r` field is a **scatter radius in meters** — it's *not* a rotation — that spreads arrivals randomly across a `±r` square on X/Z around the spawn point. Use `r: 2.0` for a small huddle or `r: 5.0` for a wider scatter whenever more than one player can arrive at the same time.

**Why it bites:** the bug only exists under concurrency. Solo playtesting never reveals it.

**Two more spawn-point details worth knowing:**

- `absPos` and `absRot` are **required** in the spawn's `extraData`, and `absPos` must be the world-space position even when the spawn has a parent (where `pos` is local to the parent). The engine reads `absPos`/`absRot` directly to place players — if they're missing or stale, players land at world origin.
- `absRot` orients the **avatar only**, not the initial camera yaw. On login, the third-person camera keeps its pre-spawn yaw; teleport effects *do* reset the camera behind the player. Don't assume the player sees what the spawn faces — verify the opening view with `render_scene` after setting spawn rotation.

## Parent-child local space

When an item has a `parentItemID` other than `0`, its `pos` and `rot` are in the **parent's local space**, not world space. A child at `pos: (0, 0, 0)` sits at the parent's center. A child at `pos: (1, 0, 0)` is one unit right of the parent's center. Rotation is also relative — a child with identity rotation inherits the parent's world rotation.

**Why it bites:** an item that merely sits on top of a moving platform without being parented to it will appear to "fall through" or get left behind the moment the platform moves. Visual proximity isn't a parent-child relationship. And if you *do* parent items correctly but set their `pos` in world coordinates instead of local coordinates, they'll jump to unexpected positions relative to the parent.

**One detail that surprises people from Unity/Unreal:** child scale is **independent** — it is *not* multiplied by parent scale. Parent scale does not cascade to child positions either. The bundled `docs://reference/parent-child` resource has the full specification, including Python generation examples.

## Rotation format differences by field

Different parts of the Portals data model use different rotation formats, and mixing them up produces items that face the wrong way with no error message. Here's the mapping from the bundled `docs://reference/gotchas`:

| Field | Format |
|---|---|
| Item `rot` (room data) | Quaternion `[qx, qy, qz, qw]`. The MCP `add_item`/`modify_item` tools also accept Euler degrees `[x, y, z]` and auto-convert. |
| SpawnPoint `absRot` | Quaternion. Orients the avatar only (see Spawn section above). |
| CameraObject `rot` | Quaternion — but the default forward is **-Y (straight down)**, not horizontal. Apply a -90 degree X base rotation for a horizontal view. |
| Room camera mode 2 `rot` | **Euler degrees** — `x` = pitch down, `y` = yaw, `z` = roll. |
| `PortalsAnimation` `_transformStates[].rotation` | Quaternion; for cameras, negate Y and Z vs. the item `rot`. |
| `PortalsAnimation` `states` | **Euler angles**, not quaternions. |
| `MoveToSpot` `_transformState.rotation` | Quaternion array. |

**Why it bites:** a model that looked correctly oriented in your original engine can come in rotated — lying on its side, facing backward — once placed in Portals. If you're porting from Unity, Blender, or Unreal, the axis convention baked into your GLB export may not match Portals' Y-up coordinate system. And a camera set with identity rotation `(0,0,0,1)` will be looking at the ground, not forward — this is easy to misdiagnose as broken trigger wiring when the camera is actually just pointing the wrong way.

## The room-write freshness model

Every room-write tool is guarded against stale data, not just `apply_operations`. `get_room_data` attaches a SHA-256 freshness precondition to the snapshot it downloads, and both `apply_operations` (atomic targeted ops) and `set_room_data` (full-snapshot replacement) reject a write outright if the room changed since that snapshot was taken — neither one uploads a partial batch or silently overwrites concurrent changes.

This is a gotcha-*preventer*, not a gotcha: it's exactly the mechanism that stops the classic "two edits clobber each other" failure mode common with plain scene files. The one thing worth knowing so it doesn't look like a bug: `set_room_data` is **not** an escape hatch around a rejected `apply_operations` batch — as of `portals-mcp` 2.0.0 it enforces the same current-baseline-snapshot requirement, so reaching for it to "force through" a stale write fails the same way. Re-download a fresh `get_room_data` snapshot and retry instead, especially if you're applying several slices back-to-back in the same session (see [Porting Workflow](/porting/porting-workflow/)).

## Try it

Ask Claude to check a room you're actively working on for the two easiest ones to silently get wrong:

```text
Check my current room for spawn points with no configured spread and any
spotlights with identity rotation — use inspect_room_data or query_room
to confirm the real hierarchy, spawn absPos/absRot fields, and spotlight
rot values rather than guessing from how it looks.
```
