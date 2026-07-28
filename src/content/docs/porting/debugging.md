---
title: Debugging
description: How to debug issues while porting your game.
---

There's no attached debugger or breakpoints here — no equivalent of your engine's editor pausing mid-frame with a variable inspector open. Debugging in Portals happens through a live WebSocket bridge from Claude into your actual running room, inspecting real runtime state while you or Claude reproduce the problem.

## The tools

- **`connect_to_game`** — opens the WebSocket bridge to your live client (default `ws://localhost:3099`, configurable via `PORTALS_BRIDGE_PORT` if that port's taken). This is the prerequisite for everything else below. **It needs a regular desktop browser session** — embedded or in-app browsers (a webview inside another app, an in-app browser tab) frequently can't reach localhost websockets at all. If `connect_to_game` can't reach your client, check you're playtesting in an actual Chrome/desktop browser tab before assuming the room itself is broken.
- **`poll_game_events`** — retrieves in-room debug events: Ctrl+Click on an item, Shift+Click on a location. Useful for reproducing an interaction without needing full keyboard/movement control from Claude's side.
- **`get_runtime_data`** — fetches live runtime variables and JS effector (Function Effect) results. This is your variable inspector: the actual current value of every task and variable, and what your expressions evaluated to on their last run.
- **`change_task_state`** — forces a task directly to `Active`, `Completed`, or `NotActive`, bypassing whatever trigger would normally fire it. Useful for testing an effect in isolation before trusting the trigger that's supposed to reach it.
- **`simulate_key_input`** / **`simulate_trigger_zone_input`** — audit key and trigger-zone wiring statically, without a live player connected at all. Good first check before you even open a live session.

## A worked debugging session

Say a coin pickup isn't updating the on-screen scoreboard. Here's the trace, tool by tool:

**1. Connect.** Ask Claude to `connect_to_game` against your room.

**2. Reproduce.** Walk over and pick up a coin (or ask Claude to simulate the interaction) while it's polling `poll_game_events`, so you both see the event fire.

**3. Check the source of truth.** Ask for `get_runtime_data` and look at the `Coins` variable. Two branches from here:

- **It didn't increment.** The break is upstream — the `Item Collected` trigger isn't reaching an `Update Value` effect. Confirm with `inspect_room_data` or `query_room` on that specific collectible item: does its trigger list actually include the effect you expect?
- **It did increment, but the HUD still shows the old number.** The break is downstream, between the variable and the display. Check whether a `Value Updated` trigger on `Coins` is wired to a `Send Message To Iframes` effect targeting your scoreboard iframe. `get_runtime_data`'s effector-result reporting tells you whether that effect actually ran and what string it sent — if it ran and sent the right value but the iframe still shows stale data, the bug has moved into the iframe's own JavaScript message handling, not the room logic.

**4. Fix and re-verify live, not just visually.** Patch the wiring with `apply_operations`, then repeat steps 2–3 on the same slice. A `render_scene` screenshot showing an updated number isn't proof — confirm via `get_runtime_data` or another live pickup that the chain actually fired end to end, the same discipline as [The Loop](/start-here/the-loop/) and per-slice playtesting in [Porting Workflow](/porting/porting-workflow/).

## Using `change_task_state` as an isolation tool

If you're not sure whether the problem is the trigger or the effect, skip the trigger entirely: call `change_task_state` to force the task straight to `Active` and check `get_runtime_data` afterward. If the effect fires correctly this way, the effect wiring is fine and the bug is specifically in the trigger — wrong zone size, wrong key binding, wrong click target. If it still doesn't fire, the problem is in the effect chain itself, and the trigger was never the issue.

## No special setup required

Live debugging tools are available in the same default **compatibility** tool profile that [Setup](/start-here/setup/) has you install — no config changes needed to use `connect_to_game`, `get_runtime_data`, or any of the tools above.

## Try it

Describe the specific broken mechanic and let Claude drive the trace:

```text
[Describe what's broken — e.g. "picking up coins doesn't update the
scoreboard" or "the door won't open even though I have the key"].
Connect to the live game, reproduce it, and use get_runtime_data to
find exactly where the chain breaks before changing anything.
```
