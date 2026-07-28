---
title: Setup
description: How to install and configure everything you need to build with Portals.
---

This gets you from a clean machine to a working Claude + Portals MCP connection. It takes about five minutes.

## 1. Install Node.js

The Portals MCP runs on Node.js 18 or later. Check what you have:

```sh
node -v
```

If that fails, or shows something older than v18, install a current Node.js from [nodejs.org](https://nodejs.org) or via a version manager like `nvm`. You don't need to install the Portals MCP itself — the next step handles that automatically, every time, via `npx`.

## 2. Connect it to your Claude client

Pick whichever client you use.

**Claude Code**, from a terminal:

```sh
claude mcp add portals -- npx -y portals-mcp@latest
```

**Claude Desktop**: open Settings → Developer → Edit Config, which opens `claude_desktop_config.json` in your editor. Add a `portals` entry under `mcpServers`:

```json
{
  "mcpServers": {
    "portals": {
      "command": "npx",
      "args": ["-y", "portals-mcp@latest"]
    }
  }
}
```

If you already have other MCP servers configured, add `"portals"` alongside them — don't replace the whole file.

## 3. Restart your client

This step trips people up more than any other: editing the config isn't enough. Fully quit Claude Desktop (not just close the window) and reopen it, or start a fresh Claude Code session. The client only reads `claude_desktop_config.json` — or re-resolves its configured MCP servers — on startup.

## 4. Authenticate

The first time Claude actually calls a Portals tool — for example, if you ask it to build something — it opens a browser window and asks you to log in or create a free account at [theportal.to](https://theportal.to). Approve it there, and control returns to your terminal or Desktop client automatically. You won't be asked again on that machine; the credential is cached for future sessions.

If you're running in an environment with no browser available (a remote server, a CI job), you can skip the interactive login by setting a `PORTALS_ACCESS_KEY` environment variable instead — most people building locally will never need this. See the [official repo](https://github.com/busportals/portals-mcp) for how to generate one.

## A note on versions

`portals-mcp@latest` currently resolves to **2.0.0** (released 2026-07-22), and that's what the config above installs. The good news: the default tool profile — **compatibility** — behaves the same way it did through the whole 1.3.x line, so everything in this guide holds whether you're actually running 2.0.0 or an older 1.3.x patch. 2.0.0's changes are additive (an opt-in experimental profile, covered below), not a rewrite of the path this guide documents.

`@latest` will keep moving as new versions ship, and npm's `latest` tag can jump to a major version ahead of what this guide has been updated to match. If you want to freeze your setup against that, pin the version explicitly instead of using `@latest`:

```json
"args": ["-y", "portals-mcp@2.0.0"]
```

Check [Versions](/reference/versions/) if you want to confirm what's current before deciding whether to stay pinned or move to `@latest`. Either way, know which one your config says, since "it updated itself and now something's different" is almost always this.

## Tool profiles (optional)

`portals-mcp` can expose different sets of tools depending on the `PORTALS_MCP_TOOL_PROFILE` environment variable. You don't need to set this — **compatibility** is the default, it's what every example in this guide assumes, and it's the right choice unless you specifically know you want something else. Other profiles (an `expert` set of low-level escape hatches, and an opt-in `builder` candidate introduced in 2.0.0) exist for advanced or experimental use; see the [official repo](https://github.com/busportals/portals-mcp) if you want to go looking for them.

## Common setup failures

- **`npx` errors about an unsupported engine.** Your Node.js is too old. Re-check `node -v` and upgrade.
- **Claude doesn't seem to have any new tools after editing the config.** You edited the file but didn't fully restart the client. Quit it completely and relaunch.
- **The whole MCP config seems to silently stop working.** A trailing comma or missing brace in `claude_desktop_config.json` will break every server in the file, not just the one you were editing — validate the JSON if things go quiet.
- **No browser window opens when you expect authentication.** Some remote/headless setups can't launch a browser. Use `PORTALS_ACCESS_KEY` instead (see above).
- **Everything looks connected, but tool calls fail immediately.** Check [Troubleshooting](/reference/troubleshooting/) for error-specific fixes before assuming setup is broken.

## Try it

Once your client has restarted and you're ready to confirm the connection is live, ask Claude this directly — it calls a real Portals tool and reports back, so if it answers, setup worked:

```text
Call get_server_info from the Portals MCP and tell me the version, commit, and active tool profile you're running.
```
