---
title: Glossary
description: Definitions of terms used throughout the Portals documentation.
---

Terms used across this guide, in one line each where possible. For full detail on any tool named here, ask Claude to call `get_context` or `get_help`, or check the [official package](https://www.npmjs.com/package/portals-mcp).

- **`apply_operations`** — MCP tool that applies a batch of targeted, atomic changes to a room, always against a freshly downloaded snapshot; rejects stale or partial writes. See [Gotchas](../gotchas/).
- **`builder` (tool profile)** — Opt-in, 7-tool profile (MCP 2.0 candidate) built around outcome-oriented tools like `start_build`/`apply_build`/`playtest_build`. Excludes marketplace and asset-generation tools. Requires `portals-mcp@next`; not documented by this guide.
- **`compatibility` (tool profile)** — The default tool profile (53 tools) and the only one this guide documents. See [Capabilities](../../porting/capabilities/).
- **`docs://` resource** — A bundled, addressable documentation resource (reference spec, recipe, workflow guide) an assistant can read directly via `get_context` or `lookup` without leaving the session.
- **Effect** — The "do this" half of Portals' event logic: an action (teleport, change a value, show/hide, play a sound) that runs when a trigger fires or a task changes state.
- **Effector / JS effector** — Colloquial name for a Function Effect: an NCalc expression (conditionals and math over tasks and variables) attached as one of a task's effects. Not general-purpose JavaScript — no loops, arrays, or custom functions. See [Mental Model](../../porting/mental-model/).
- **`expert` (tool profile)** — 27-tool profile of low-level debugging and escape-hatch tools, for direct manipulation once you know exactly what you're doing.
- **`get_context`** — MCP tool that returns targeted specs, syntax references, gotchas, recipes, and suggested tools for whatever you're currently working on.
- **`get_runtime_data`** — MCP tool that fetches live runtime variables and JS effector results from a connected room, via the runtime bridge. See [Debugging](../../porting/debugging/).
- **`get_server_info`** — MCP tool reporting the server's version, commit, and active tool profile. The recommended first call of any session, and the first thing to include in a bug report.
- **Item** — A placed instance in a room — the closest analog to an entity, GameObject, or prefab instance in a traditional engine.
- **Marketplace pack** — A themed bundle of marketplace items (assets sharing a style, theme, or biome) that can be browsed with `get_pack_items` before claiming it as a whole. See [Assets](../../porting/assets/).
- **MCP (Model Context Protocol)** — A standard way to give an AI assistant a set of tools it can actually call, instead of just words it can generate. See [What is an MCP?](../../start-here/what-is-an-mcp/).
- **MCP client** — The application actually running Claude and connecting to MCP servers — Claude Code, Claude Desktop, Cursor, or Codex, in Portals' case.
- **`PORTALS_ACCESS_KEY`** — Environment variable that lets you skip the interactive browser sign-in flow, for headless or remote environments. See [Setup](../../start-here/setup/).
- **`PORTALS_BRIDGE_PORT`** — Environment variable that overrides the runtime bridge's default port (`3099`) if it's already in use. See [Troubleshooting](../troubleshooting/).
- **Quest / task** — Portals' state-tracking primitive: a three-state tracker (`NotActive` → `Active` → `Completed`) that becomes a player-visible quest when its visibility flag is toggled on.
- **Room** — A persistent, ownable Portals space, addressable by a room ID and created/edited via MCP tools like `create_room` and `apply_operations` — the closest analog to a scene or level. See [Mental Model](../../porting/mental-model/).
- **Room ID** — The unique identifier for a room, used in its shareable URL (`theportal.to/?room=<room-id>`).
- **Room snapshot** — The JSON room data returned by `get_room_data` — a point-in-time download of everything in a room, required fresh before every `apply_operations` batch.
- **Runtime bridge** — The WebSocket connection (`connect_to_game`, default `ws://localhost:3099`) that lets an assistant observe and interact with a live, running room session. See [Debugging](../../porting/debugging/).
- **Tool profile** — The set of MCP tools currently exposed, selected via the `PORTALS_MCP_TOOL_PROFILE` environment variable: `compatibility`, `expert`, or `builder`.
- **Trigger** — The "when this happens" half of Portals' event logic: a named condition (click, collision, zone enter/exit, key press, and others) that fires one or more effects.
