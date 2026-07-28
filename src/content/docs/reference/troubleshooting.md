---
title: Troubleshooting
description: Solutions to common problems encountered while building with Portals.
---

Symptom-first. Find what you're seeing, not the underlying cause — that's what each entry tells you.

## "A browser window won't open" / "sign-in keeps failing"

The first real tool call triggers `authenticate`, which opens a browser for you to sign in or create an account at [theportal.to](https://theportal.to). If no window opens, or sign-in never completes, you're likely in an environment that can't launch a browser at all — a remote server, a CI job, a headless container. Set a `PORTALS_ACCESS_KEY` environment variable to skip the interactive flow entirely; see [Setup](/start-here/setup/) for where that goes. If you *do* have a normal desktop available and it's still failing, check that you're not confusing this with the separate, unrelated live-debugging bridge below — sign-in and the runtime bridge are two different connections that fail for different reasons.

## "Claude doesn't seem to know Portals exists"

Almost always one of two things. First: you edited the MCP config but didn't fully restart the client — editing `claude_desktop_config.json` (or running `claude mcp add`) only takes effect on the next launch, not live. Fully quit and reopen. Second: check what actually got installed — `portals-mcp@latest` resolves to whatever's newest at install time, and if something changed since you last set this up, "latest" may not be what you expect. Ask Claude to call `get_server_info` and confirm a version and tool profile come back at all; if the call fails outright, the MCP isn't connected — go back to [Setup](/start-here/setup/) and re-check the config and restart step, in that order.

## "It was working, now something's different" (version drift)

`portals-mcp@latest` moves forward as new versions ship, including major versions — an upgrade you didn't explicitly ask for can change behavior between one session and the next if your config uses `@latest` rather than a pin. Confirm what you're actually running with `get_server_info`, then compare against [Versions](/reference/versions/) to see whether a version bump explains what changed. If you want to freeze behavior going forward, pin an explicit version in your config instead of `@latest` (see [Setup](/start-here/setup/)) — that trades "always current" for "never surprised."

## "npx errors about an unsupported engine" / Node version

The Portals MCP needs Node.js 18 or later. Run `node -v` and upgrade via [nodejs.org](https://nodejs.org) or a version manager like `nvm` if you're on anything older — this is the most common reason `npx -y portals-mcp@latest` fails outright before Claude even attempts a connection.

## "connect_to_game can't reach my room" (runtime bridge failures)

Live debugging (`connect_to_game`, `get_runtime_data`, and friends — see [Debugging](/porting/debugging/)) depends on a WebSocket bridge listening on `ws://localhost:3099` by default, overridable via `PORTALS_BRIDGE_PORT`. Two distinct failure modes here:

- **Wrong or blocked port.** Something else is using 3099, or a firewall/sandbox is blocking local WebSocket connections. Set `PORTALS_BRIDGE_PORT` to a free port and retry.
- **Embedded or in-app browser.** This is the more common trap: embedded/in-app browsers (a webview inside another app, an in-app browser tab) frequently can't reach localhost websockets at all, no matter how the port is configured. Open the room in a regular desktop Chrome session instead — this alone resolves most "the bridge just won't connect" reports that turn out to have nothing to do with the room itself.

## Filing (or asking for help with) a bug

Before describing a problem to Claude, a teammate, or anyone else, call `get_server_info` and include the version, commit, and active tool profile it reports. Nearly every confusing "it works for me" mismatch traces back to two sessions running different versions or different tool profiles without realizing it — leading with these three values turns a vague report into one that's actually actionable, and costs you one tool call to get.

## Still stuck

Check [Gotchas](/reference/gotchas/) for known platform behaviors that look like bugs but aren't, and [The Loop](/start-here/the-loop/) for the general principle that a stalled iteration is usually a design ambiguity, not a broken tool. If neither explains it, the [official repo](https://github.com/busportals/portals-mcp) is the authoritative source for anything not covered here.

## Try it

Start any troubleshooting conversation with the one call that tells you what you're actually running:

```text
Call get_server_info and tell me the version, commit, and active tool
profile. I'm seeing [describe the symptom] — does that match a known
issue for this version?
```
