---
title: The Loop
description: The core build-test-iterate loop for developing with Portals.
---

If you've done [Your First Room](/start-here/first-room/), you already ran this once. This page is about treating it as the permanent rhythm, not a one-time onboarding exercise — every room you build, and every change to a room you already have, goes through the same four steps.

## Design → Build → Playtest → Iterate

**Design.** You and Claude talk through what you want before anything gets built. This can be a whole new room ("a mini golf course with a scoreboard") or a change to an existing one ("the enemy spawns way too fast"). Either way, nothing gets touched yet — you're agreeing on what "done" looks like.

**Build.** Claude calls the Portals MCP tools that actually create or edit the room: placing objects, wiring up logic, generating assets, and usually showing you a screenshot before handing it back to you.

**Playtest.** You — a human, in a browser, at `https://theportal.to/?room=<room-id>` — actually play it. Not Claude. This is the step that's easy to skip and shouldn't be: a screenshot tells you what the room looks like, not what it feels like to play. Jump the jumps. Read the score. Try to lose on purpose.

**Iterate.** You describe, in plain language, what needs to change based on what you actually experienced. Claude updates the same room. Repeat.

The loop doesn't end. A "finished" game is really just one where you've stopped finding things worth iterating on — for now.

## Why playtest is its own step

It's tempting to treat build and playtest as the same thing, especially once Claude starts sending you screenshots as part of building. Don't skip the part where you actually play it. Screenshots catch visual problems; they don't catch a jump that's a pixel too far, a sound effect that's obnoxious after the tenth time, or a scoreboard that silently stops updating after round two. Those only show up when you're the one holding the controls.

## Writing good iteration prompts

The loop works best when your iteration requests describe what you experienced, not how to fix it. You don't need to know which tool handles lighting or which file has the jump logic — that's Claude's job to figure out. Your job is to be a good source of ground truth about how the room actually plays.

Compare a vague note ("it feels off") with something concrete Claude can act on directly. Three real examples:

```text
The jumps are too hard — the gap between the second and third platform
needs to be noticeably shorter, or add a small platform in between.
```

```text
The coin pickup sound is way too loud compared to everything else. Turn
it down, or replace it with something softer.
```

```text
There's no way to restart after losing except reloading the whole page.
Add a restart option that respawns the player back at the start without
a full reload.
```

None of these mention a tool, a file, or an API. They describe the room from the player's side and let Claude figure out the mechanism — that division of labor is the whole point of the loop.

## When the loop stalls

If an iteration request doesn't produce the change you expected, don't rephrase the same ask over and over. Be more specific about the observed behavior versus the expected one ("the scoreboard shows 0 after the second round instead of carrying over the score"), or check [Troubleshooting](/reference/troubleshooting/) and [Gotchas](/reference/gotchas/) for known issues with the mechanic you're working on. Most stalls are a design ambiguity Claude guessed wrong on, not a broken tool — going back to the design step for one sentence of clarification is often faster than several iteration attempts.

## Try it

Take the room you built in [Your First Room](/start-here/first-room/) — or any room you're currently working on — and run one more iteration using the pattern above:

```text
Here's what I noticed when I played it just now: [describe one specific
thing you saw or felt]. Update the room to fix that, then let me know
what changed.
```
