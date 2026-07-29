---
title: Your First Room
description: A walkthrough of building your first room in Portals.
---

This is a 15-minute walkthrough of the whole cycle, start to finish: you'll design something small, have Claude build it, play it in your browser, and ask for one change. If you haven't connected the Portals MCP yet, do [Setup](../setup/) first.

Before you ask for anything, it's worth spending ten seconds confirming the connection. Ask Claude to call `get_server_info` — it reports the server version and the active tool profile, so you know exactly what you're running before you build anything on top of it:

```text
Call get_server_info and tell me the version and active tool profile.
```

## 1. Ask for a design, not a build (2 minutes)

Open Claude and describe the game you want — keep it small on purpose. A single mechanic and a clear win condition is plenty for a first room. Say explicitly that you want a design first, not a finished build:

```text
I want to build a simple game in Portals. Something small: one mechanic,
one win condition. Before you build anything, give me a short design doc —
what the space looks like, what the player does, and how they win.
```

Claude will come back with a design doc: the concept, the space, the mechanic, and the win condition, in plain language. This is the design phase — nothing exists in Portals yet.

## 2. Approve it (1 minute)

Read the design doc. If something's off, say so now — it's much cheaper to change a paragraph than a built room. If it looks right, tell Claude to proceed:

```text
That looks good. Build it.
```

## 3. Let it build (5–8 minutes)

This is where Claude actually calls Portals MCP tools: creating the room, placing objects and lighting, wiring up the mechanic you asked for, and generating any 3D models, textures, or sound it needs. You'll typically see it narrate what it's doing, and it will usually show you a screenshot of the room it just built (a `render_scene` call) so you can both look at the same thing before you go play it yourself.

This step can take a few minutes, especially if Claude is generating custom 3D assets rather than reusing simple shapes. That's normal — let it finish rather than interrupting mid-build.

## 4. Get your room link

When the build finishes, Claude will give you a room ID. Your room lives at:

```text
https://theportal.to/?room=<your-room-id>
```

Open that URL in a browser. You should see your space and be able to move around and play it. This link is shareable and multiplayer — anyone you send it to drops into the same room you're standing in, live.

If the link doesn't load or looks wrong, don't debug it yourself yet — go back to Claude and describe what you saw. That's the next step anyway.

## 5. Playtest it, then ask for one change (3–5 minutes)

Actually play it. Try to win, try to break it, notice what feels off. Then pick one thing and ask for it, in plain language — no need to say which tool to call or where in the room something lives:

```text
I played it. [Describe what you saw — e.g. "the platforms are too far
apart to jump between" or "the win screen never showed up."] Fix that.
```

Claude updates the room in place — same room ID, same link. Reload the page and check the change.

That's the whole loop: design, build, playtest, iterate. You'll repeat step 5 as many times as you want; nothing about steps 1–4 needs to happen again for the same room. The rhythm you just went through is the permanent working pattern for building with Portals — see [The Loop](../the-loop/) for how to keep using it well past your first room.

## Try it

If you haven't started yet, this is the literal first prompt to paste into Claude to begin:

```text
I want to build a simple game in Portals. Something small: one mechanic,
one win condition. Before you build anything, give me a short design doc —
what the space looks like, what the player does, and how they win.
```
