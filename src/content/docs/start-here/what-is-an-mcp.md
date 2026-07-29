---
title: What is an MCP?
description: An introduction to what an MCP is and why Portals uses one.
---

If you've never used Claude or an MCP before, start here. This page is the mental model you need before you install anything.

## The one-sentence version

MCP (Model Context Protocol) is a standard way to give an AI assistant like Claude a set of tools it can actually call, instead of just words it can generate. The Portals MCP is one such set of tools: it gives Claude the ability to read and write your rooms on [Portals](https://theportal.to), the platform where the games you build actually run.

That's the whole idea. You don't need to know how the protocol works under the hood to use it, same as you don't need to know how HTTP works to use a web browser.

## What changes when Claude has tools

Without an MCP, Claude can describe a game to you in words, or write code you'd have to run and wire up yourself. With the Portals MCP connected, Claude can instead:

- Create a room (a Portals space, addressable by a URL)
- Place objects, lights, triggers, and game logic in it
- Generate 3D models, textures, and sound for it
- Take a screenshot of what it just built, to check its own work
- Hand you a link where you and anyone else can play it in a browser, immediately

In other words, Claude stops being a conversation and starts being a collaborator that can actually touch the thing you're building. You talk; it builds; you both look at the result.

## What a "room" is

A room is a Portals space — a persistent, ownable place on theportal.to identified by a room ID. Every game you build with the Portals MCP lives in a room. You'll visit yours at a URL shaped like `https://theportal.to/?room=<your-room-id>` once Claude creates it. Rooms support multiple players at once, so a link you send a friend drops them into the same space you're standing in.

## What this MCP is not

It's not a general game engine you install and learn. You don't write GDScript or C# or wire up a scene graph by hand. The Portals MCP's whole point is that Claude does that layer — you describe outcomes ("a mini golf course with a scoreboard"), Claude turns them into a working room, and you react to what you see. If you do want to get hands-on with the lower-level building blocks later, that's covered in the Porting Your Game section — this Start Here section is about the normal, assistant-driven path.

It's also not magic. Claude is calling real tools against a real API, the same way any program calls a database or a file system. If something looks wrong in the room, it's because a tool call produced that result — which means it's also fixable by asking for a change, the same way you'd ask a person to redo a piece of work.

## Why this matters before you set anything up

Once it's installed (next page), the Portals MCP effectively adds a toolbox to Claude that only shows up when you're talking about Portals. You won't see a list of these tools most of the time — you'll just notice that Claude can now do things like "build that" or "show me a screenshot" instead of only describing them. Knowing that this toolbox exists, and that it's what's actually creating and editing your room, is the one piece of context that makes everything else in this guide make sense.

The four-step rhythm you'll use for every project — design, build, playtest, iterate — is covered in full on [The Loop](../the-loop/). For now, the only thing to remember is: MCP = tools Claude can call. Portals MCP = the specific tools for building and running games on Portals.

## Try it

You don't need anything installed yet for this one — it works in any Claude conversation and is a good way to hear the concept back in Claude's own words before you move on.

```text
In one short paragraph, explain what an MCP server is and how it's different from a plugin or an API wrapper. Then explain, specifically, what having the Portals MCP connected would let you do that you can't do right now.
```
