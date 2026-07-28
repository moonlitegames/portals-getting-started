---
title: Versions
description: Version compatibility notes for the Portals MCP.
---

<!--
  ENTRY FORMAT TEMPLATE — this comment defines the shape every future
  version entry on this page MUST follow, including entries appended by
  an automated release-watcher. Do not remove this comment.

  ## <version> — <YYYY-MM-DD> (or a range, e.g. "2026-05-29, through 1.3.7")

  **Highlights:** a short bulleted list of what's new or changed.

  **Migration notes:** what a reader following this guide needs to do (or
  confirm they don't need to do) to move onto this version from the
  previous entry. If nothing is required, say so explicitly rather than
  omitting the heading — "no action required" is a valid, useful answer.

  Newest entry goes directly below this comment; older entries follow in
  descending order. Do not rewrite or delete prior entries when adding a
  new one — append above them.
-->

This page is the authoritative version/compatibility history for `portals-mcp`. If you only need "what should I install right now," see [Setup](/start-here/setup/) — this page exists for confirming exactly what changed between versions and whether anything here affects a guide you're already following.

Always confirm what you're actually running with `get_server_info` (reports version, commit, and active tool profile) rather than assuming your config's `@latest` or a pin matches what's described below — see [Troubleshooting](/reference/troubleshooting/) if those don't line up.

## 2.0.0 — 2026-07-22

**Highlights:**

- **Three tool profiles**, selected via `PORTALS_MCP_TOOL_PROFILE`: `compatibility` (default, 53 tools — the full surface this guide documents), `expert` (27 low-level debugging/escape-hatch tools), and `builder` (opt-in, 7 outcome-oriented tools — an MCP 2.0 candidate, requires `portals-mcp@next`, not covered by this guide). See [Capabilities](/porting/capabilities/) for the full breakdown.
- **`get_server_info`** — a new diagnostic tool reporting server version, commit, and active tool profile in one call. Recommended as the first call in any new session and as the first thing to include in a bug report (see [Troubleshooting](/reference/troubleshooting/)).
- **Freshness guarantees on room writes** — `apply_operations` now formally enforces atomic targeted operations against a mandatory fresh `get_room_data` download, rejecting stale or partial writes rather than silently overwriting concurrent changes. See [Gotchas](/reference/gotchas/) for the practical implication.
- **Documented runtime bridge** — the live-game WebSocket connection (`connect_to_game`, `poll_game_events`, `get_runtime_data`, `change_task_state`) is formally documented, including its default `ws://localhost:3099` port (configurable via `PORTALS_BRIDGE_PORT`) and the caveat that embedded/in-app browsers often can't reach localhost websockets at all. See [Debugging](/porting/debugging/).
- **160 bundled `docs://` resources** — reference specs, extended API docs, recipes, workflow guides, and harness-grounding data, addressable directly by an assistant via `get_context` and `lookup` without leaving the session.
- **Codex client support** — `portals-mcp` can now be configured as an MCP server for Codex, alongside the existing Claude Code, Claude Desktop, and Cursor support.

**Migration notes:** No action required for anyone following this guide. The default `compatibility` profile's behavior is unchanged from the 1.3.x line — everything documented in Start Here and Porting Your Game holds whether you're actually running 2.0.0 or a 1.3.x patch. The only genuinely new surface is the opt-in `builder` profile, which this guide deliberately does not document (see the Track B note in this project's own status log if you're contributing to this guide rather than reading it). If your config pins an explicit 1.3.x version rather than `@latest`, nothing here obligates you to move — see [Setup](/start-here/setup/) for the pin-vs-`@latest` tradeoff.

## 1.3 — 2026-05-29 (through patch 1.3.7, 2026-07-10)

**Highlights:**

- **Smarter `get_context`** — improved targeting of specs, syntax references, gotchas, and recipes for whatever the assistant is currently working on, rather than returning broad, undifferentiated results.
- **Gameplay planning tools** — `resolve_gameplay_capability` and `plan_gameplay_mechanic` introduced, letting an assistant classify a mechanic's feasibility and get a compact implementation contract before building anything. See [Capabilities](/porting/capabilities/).
- **Marketplace support** — search, pack browsing, claiming, and placement tools (`search_marketplace`, `get_pack_items`, `list_marketplace_facets`, `claim_marketplace_item`, `place_marketplace_items`, and related inventory tools). See [Assets](/porting/assets/).
- **AI asset generation** — text/image-to-3D-model, AI image and texture generation, text-to-speech, sound effect, and music generation tools, each with an async task/polling pattern. See [Assets](/porting/assets/).
- **Runtime debugging** — the live game connection and runtime-variable/effector-result inspection tools that [Debugging](/porting/debugging/) is built around were introduced in this line.
- **Safer `apply_operations`** — hardened against partial or stale writes (formalized further in 2.0.0's freshness guarantees, above).
- **Expanded recipes** — a larger built-in recipe manifest (`search_recipes`) covering common patterns like dice, board games, keypads, leaderboards, and cutscenes, so common mechanics don't need to be wired from scratch.

**Migration notes:** This is the oldest version this guide documents; there's no earlier entry to migrate from here. If you're on an older pre-1.3 release, treat this guide as describing your target state rather than an incremental change, and confirm your actual version with `get_server_info` before assuming any of the above is present.

## Try it

Confirm what you're actually running before assuming anything on this page applies to your session:

```text
Call get_server_info and tell me the version, commit, and tool profile.
Then tell me which entry on the Versions reference page that corresponds
to, and whether anything changed between that version and the current
one that I should know about.
```
