---
title: Assets
description: How to bring your existing game assets into Portals.
---

Two asset pipelines run side by side in Portals: claim something that already exists in the marketplace, or generate something new with AI. You don't need to hand-roll an import pipeline for either — and if you're arriving with existing exports from your original engine project, there's a direct path for those too.

## Marketplace: search, browse, claim, place

- **`search_marketplace`** — find 3D models, sounds, and packs by keyword.
- **`list_marketplace_facets`** — browse by category, theme, style, or biome instead of guessing search terms — useful when you know the vibe you want ("cyberpunk," "low-poly forest") but not a specific asset name.
- **`get_pack_items`** — see everything inside a themed pack before claiming it wholesale, so you're not pulling in fifty assets to get the one prop you need.
- **`claim_marketplace_item`** — add a free item to your inventory.
- **`get_user_inventory`** — see what you've already claimed, across rooms.
- **`place_marketplace_items`** — claims a batch and composes the placement operations in one step, the actual placement helper you'll use most.
- **`get_room_build_items`** / **`add_to_room_inventory`** — list and extend a specific room's in-game build palette, so collaborators using the wrench-icon build mode directly in-browser can grab the same items you've added, not just what you place programmatically.

## AI generation: models, speech, SFX, music, images, textures

- **`text_to_3d_model`** / **`image_to_3d_model`** — generate a model from a text description or a reference image. Generation is async: poll **`check_3d_model_task`** rather than assuming it completes instantly, and check **`list_generated_3d_models`** for your history.
- **`generate_ai_image`** (+ `list_generated_images`) and **`generate_ai_texture`** (+ `list_generated_textures`) — images for signage/UI/reference, and seamless PBR textures for retexturing marketplace or uploaded models to match your game's art direction.
- **`text_to_speech`** + **`list_voices`** — NPC dialogue and narration, with voice selection.
- **`generate_sound_effect`** and **`generate_music`** (+ `list_generated_sounds`) — one-off SFX or a full instrumental/vocal track for your score.

## When to claim vs. when to generate

Default to the marketplace for anything generic: trees, crates, common furniture, stock SFX. It's instant, free, and `list_marketplace_facets` makes browsing by theme fast enough that "search first" costs you almost nothing. Reach for generation when:

- The asset is specific to your game's identity — a named character, a signature weapon, a boss with a design nobody else has.
- The marketplace doesn't have a matching style or theme, and a mismatched asset would stick out.
- You need a variant no pack contains — a specific recolor, a custom voice line, a texture that has to match an exact palette.

Generation costs you two things a marketplace claim doesn't: time (it's async — build in the polling step, don't assume it's ready the moment you ask) and review — a claimed asset has presumably been used before, but a generated one hasn't been seen by anyone, including you, until it renders. Do a quick `render_scene` check (or a full playtest if it's gameplay-relevant, not just decorative) after placing anything generated, before treating it as final.

## Profile note

Every tool on this page — marketplace search/claim/placement and all of the paid AI generation tools — lives in the default **`compatibility`** profile only (see [Capabilities](../capabilities/) for the full profile breakdown). The opt-in `builder` profile deliberately excludes marketplace and asset-generation tools entirely, in favor of its own smaller, outcome-oriented tool set. If you're on `builder` for any reason, switch back to `compatibility` before following this page.

## Bringing your own exports

If you're arriving with a folder of FBX/GLB exports from your original engine project, you don't need to regenerate assets you already own — `upload_glb` and `upload_image` take them directly, singly or in batch. Reserve generation and marketplace search for genuinely new assets your original game didn't have, not as a substitute for content you're already bringing with you.

## Try it

Start with a marketplace pass, then fill the gap it doesn't cover:

```text
Search the marketplace for a [theme, e.g. "medieval village"] pack and
show me what's in it using list_marketplace_facets and get_pack_items.
Then generate one specific custom prop from my game that you'd expect
that search not to find: [describe the prop].
```
