# STATUS

Tracking doc for the Portals Getting Started site. This file is meant to be
kept up to date across sessions so the next person (human or agent) can pick
up context quickly.

## Implemented

- **2026-07-28 (Code 2c):** Wrote real content for all four Reference pages —
  `gotchas.md`, `troubleshooting.md`, `versions.md`, `glossary.md` —
  replacing the "Coming soon." stubs. Existing frontmatter (`title` /
  `description`) left unchanged. **This closes out Phase 2 entirely** —
  every one of the original 13 stub pages (Start Here, Porting Your Game,
  Reference) now has real content. `gotchas.md` covers spotlights, spawn
  radius, parenting, and rotation pitfalls plus the `apply_operations`
  freshness model; `troubleshooting.md` is symptom-first (auth failures,
  "Claude doesn't know Portals," version drift, Node version, runtime
  bridge failures, and where `get_server_info` fits in a bug report);
  `versions.md` has two entries (2.0.0 and 1.3) in a template format with
  an HTML comment at the top declaring that format binding for future
  automated entries; `glossary.md` is a ~23-term alphabetical reference.
  See the Decisions log below for what's directly sourced from the
  `portals-mcp` README versus this session's own domain-knowledge
  reasoning. Verified with a full `npm run build` (all 15 routes generate
  correctly, Pagefind index includes them).
- **2026-07-28 (Cowork 2b):** Wrote real content for all five Porting Your
  Game pages — `mental-model.md`, `capabilities.md`, `porting-workflow.md`,
  `debugging.md`, `assets.md` — replacing the "Coming soon." stubs, aimed at
  experienced game developers (Unity/Godot/Unreal/JS fluency assumed).
  Existing frontmatter (`title` / `description`) left unchanged. Each page
  ends with a copy-paste "Try it" prompt. Content is grounded in the real
  `portals-mcp` tool surface (tool names, descriptions, and profile counts)
  fetched from npm/unpkg — see the Decisions log entry below for sourcing
  detail and what's inference versus sourced fact. Verified with a full
  `npm run build` (Astro/Starlight build succeeds, all five routes generate
  correctly, Pagefind index includes them).
- **2026-07-28 (Cowork 2a):** Wrote real content for all four Start Here
  pages — `what-is-an-mcp.md`, `setup.md`, `first-room.md`, `the-loop.md` —
  replacing the "Coming soon." stubs. Existing frontmatter (`title` /
  `description`) left unchanged. Each page ends with a copy-paste "Try it"
  prompt for Claude, as required. Verified with a full `npm run build`
  (Astro/Starlight build succeeds, all four routes generate correctly,
  Pagefind index includes them).
- Astro + Starlight project scaffolded (TypeScript, npm), with the template's
  example content removed.
- Sidebar structure and page slugs configured in `astro.config.mjs`, exactly
  matching the required "Start Here" / "Porting Your Game" / "Reference"
  groups.
- All 13 guide pages created as stubs (frontmatter `title` + `description`,
  body "Coming soon.") under `src/content/docs/{start-here,porting,reference}/`.
- Landing page (`src/content/docs/index.mdx`) with two `LinkCard`s: "New to
  Claude & MCPs?" → `/start-here/what-is-an-mcp/`, and "Porting an existing
  game?" → `/porting/mental-model/`.
- `scripts/generate-llms.mjs`: dependency-free Node script that generates
  `public/llms.txt` (grouped index with one-line descriptions) and
  `public/llms-full.txt` (concatenated raw Markdown of all pages), wired into
  `npm run build` so they're regenerated on every build.
- GitHub Actions: `.github/workflows/deploy.yml` builds and deploys to
  GitHub Pages on push to `main`.
- GitHub Actions: `.github/workflows/link-check.yml` runs lychee on pull
  requests and weekly (Mondays 09:00 UTC).
- README.md rewritten to explain the project, local dev, the llms.txt
  mechanism, deployment, and the intent to transfer this repo to the Portals
  team.
- **2026-07-28 (Code Phase 3):** Automated documentation-update pipeline.
  `.github/workflows/check-portals-release.yml` runs daily (06:00 UTC) and on
  `workflow_dispatch`. Compares npm `portals-mcp@latest` against
  `.portals-mcp-version`; when a new version is detected, downloads both old
  and new tarballs via `npm pack`, diffs `dist/resources/` and `README.md`,
  fetches GitHub release notes (best-effort), and invokes
  `anthropics/claude-code-action@v1` (Sonnet) to update affected guide pages
  and open a PR on `docs/update-vX` branch. PR never auto-merges. Includes
  `dry_run` input for testing the version-check step without creating a PR.
  Added `.portals-mcp-version` (seeded at 2.0.0), `CONTRIBUTING.md`
  (automation explanation + branch protection guidance for the Portals team),
  and updated `README.md` with branch protection and automation sections.

## In Progress

- Nothing currently in progress.

## Planned

- **Phase 2 — guide content.** ✅ Complete as of Code 2c (2026-07-28). All
  13 pages across Start Here, Porting Your Game, and Reference have real
  content — see Implemented above for all three sub-sessions (Cowork 2a,
  Cowork 2b + patch, Code 2c). Nothing outstanding in this phase; the
  `reference/versions.md` 2.0.0-entry item and the general "still stubs"
  tracking that used to live here are both resolved by `versions.md` now
  existing with a real 2.0.0 entry (see Implemented and the Decisions log
  below).
- **Track B — 2.0 delta items.** Once 2.0.0's `builder` tool profile clears
  benchmark promotion (or if it becomes the recommended path before then),
  revisit: whether Start Here should mention it at all for beginners (current
  call: no — compatibility is the only profile this guide documents, by
  design). `porting/capabilities.md` (Cowork 2b) is now written and made the
  same call explicitly — it names the default `compatibility` profile as
  what its planning tools (`resolve_gameplay_capability`,
  `plan_gameplay_mechanic`, etc.) run under, with no `builder`-specific
  section, consistent with Start Here. Revisit both together if `builder`
  changes status.
- **v2.0.0 delta — not written up, tracked here for whoever picks up
  `builder` documentation later** (2026-07-28, v2.0.0 docs update session):
  - `builder`'s RC.2 launch-scope narrowing (source-room-contents-only,
    isolated-workspace operation types, no marketplace/paid-generation path
    yet) — currently only summarized in `reference/versions.md`'s 2.0.0
    entry, not detailed anywhere in `porting/capabilities.md` since this
    guide still deliberately doesn't document `builder` (see Track B below).
  - The Build Kernel's internal contract schemas (`core-playtest.json`,
    `mutation.json`, `plan.json` under `packages/harness-core`) and the
    `MCP_IMPLEMENTATION_GUIDE.md` / `RUNTIME_HARNESS_RUNBOOK.md` documents —
    these are `portals-mcp` contributor/package-internals docs, not reader-
    facing, and were deliberately not surfaced anywhere in this guide.
  - The new internal requirement that a `builder`-profile playtest plan
    checkpoints for multi-zone travel routes from real placed-item anchors
    (never invented coordinates) — scoped entirely to `builder`'s internal
    Core playtest workflow, out of scope for the same reason as the above.
- **Phase 3 — automation & polish.** ✅ Automation pipeline complete as of
  Code Phase 3 (2026-07-28). Remaining polish items:
  - Repo is launching at `moonlitegames/portals-getting-started` (personal
    account), transferring to the `busportals` org later — see the
    transfer-time `site` URL update tracked under Known Issues.
  - Enable GitHub Pages (Settings → Pages → Source: GitHub Actions) once the
    repo exists remotely.
  - Consider adding versioned docs or a "last updated" date per page.
  - Revisit whether `llms.txt`/`llms-full.txt` need per-page ordering (they're
    currently alphabetical within each sidebar group) once real content makes
    the order more visible.

## Decisions & Changes Log

- **2026-07-28 (v2.0.0 docs update):** v2.0.0 docs update: `reference/gotchas.md`,
  `start-here/setup.md`, `reference/versions.md`. This is the first live run of
  the `check-portals-release.yml` pipeline against a real bundled-docs diff
  (previous sessions only had a task-brief summary of 1.3.7→2.0.0, not the
  actual `dist/resources/` + README diff). Cross-checked every existing page
  against the real diff rather than assuming prior sessions' speculative
  2.0.0 content was correct, and found one real inaccuracy plus one gap:
  1. **`reference/gotchas.md` — corrected.** The "`apply_operations` freshness
     model" section said the workaround to avoid was reaching for
     `set_room_data` to "force through" a rejected batch. The real diff shows
     `set_room_data` is now *also* guarded by the same current-baseline-snapshot
     precondition in 2.0.0 (and `get_room_data` now attaches an explicit
     SHA-256 freshness precondition to its snapshot) — so that workaround no
     longer exists at all, it doesn't just discard data. Rewrote the section
     (retitled "The room-write freshness model") to state this correctly.
  2. **`start-here/setup.md` — gap filled.** `reference/versions.md` already
     had a "Codex client support" bullet (written from the task brief in an
     earlier session) but `setup.md` — the actual how-to page — never got the
     corresponding config block. Added a **Codex** subsection under "Connect
     it to your MCP client" (renamed from "your Claude client," since Codex
     isn't a Claude product) with the `~/.codex/config.toml` block and the
     `default_tools_approval_mode = "approve"` note from the real README diff.
  3. **`reference/versions.md` — amended in place, not duplicated.** The task
     instructions said to always add a new dated entry; deviating from that
     literal instruction is flagged separately below.
  No other guide page needed changes — `porting/capabilities.md`,
  `porting/assets.md`, `porting/debugging.md`, `porting/mental-model.md`,
  `porting/porting-workflow.md`, `reference/glossary.md`,
  `reference/troubleshooting.md`, all four Start Here pages, and `index.mdx`
  were all checked against the diff and found already accurate or genuinely
  unaffected (see the sourcing note directly below for what was intentionally
  left out). Bumped `.portals-mcp-version` to `2.0.0`. Could not run
  `npm run build` to verify — `npm install` required approval this session
  didn't grant (no `node_modules` present); see Known Issues.
- **2026-07-28 (v2.0.0 docs update) — deviation, versions.md:** The task
  brief said to "always update `reference/versions.md` with a new entry," but
  this file already had a full `## 2.0.0` entry — written speculatively in an
  earlier session (Code 2c) from a task-brief summary, before this session's
  real bundled-docs diff was available (see the Code 2c "sourcing" log entry
  below). Since the version number genuinely did not change (still 2.0.0,
  going from `.portals-mcp-version` `1.3.7`), adding a second `## 2.0.0`
  header would violate the page's own template comment (one entry per
  version, newest-first) and just be a duplicate. Instead, amended the
  existing entry in place using the real diff as the authoritative source:
  broadened the freshness bullet to cover `get_room_data`/`set_room_data`
  (not just `apply_operations`), added the doc-count delta (148→160) and the
  new `docs://ai/tool-capability-manifest` resource, added a pointer from the
  Codex bullet to the new `setup.md` config block, narrowed the `builder`
  bullet with the RC.2 launch-scope detail (source-room-only, no
  marketplace/paid-generation path), and added a new bullet + migration note
  for the build-ambition policy change (bundled AI guidance went from "build
  5–10x more than minimum" to "match scope to the player promise" —
  `dist/resources/ai/bootstrap.json`'s `build_policy`). Left out of every
  page, deliberately, as internal/contributor-facing rather than reader-facing:
  the `core-playtest.json`/`mutation.json`/`plan.json` Build Kernel contract
  schemas, `MCP_IMPLEMENTATION_GUIDE.md`, `RUNTIME_HARNESS_RUNBOOK.md`, and
  the "Shared Portals Build Kernel" package internals — none of these are
  reachable through the `compatibility` profile this guide documents, and
  they're about `portals-mcp`'s own package internals, not something a reader
  building a game would ever call. Also left out the new "multi-zone travel
  route checkpoint planning" playtest requirement in `bootstrap.json` — it's
  scoped to the `builder` profile's internal Core playtest workflow, which
  this guide already deliberately excludes (see Track B under Planned).
  Flagging both omissions under Planned below in case `builder` graduates out
  of candidate status and this guide's Track B call changes.
- **2026-07-28 (Code Phase 3-fix4):** Added `--allowedTools` to `claude_args`
  — agent-mode runs require explicit tool approval; without it all Edit/Write
  and git operations were rejected as "requires approval." Allowed tools:
  Edit, Write, Read, Glob, Grep, and Bash patterns for git, gh pr, and npm
  run build. Also appended mandatory-PR instruction to the prompt: agent must
  always update `.portals-mcp-version` and open a PR even if no guide pages
  need changes.
- **2026-07-28 (Code Phase 3-fix3):** Removed `claude_args: --model
  claude-sonnet-4-6` from the claude-code-action step — previous run failed
  in 1 turn at $0 cost, indicating the first API call was rejected; explicit
  model selection with subscription OAuth tokens is the likely cause. Let the
  action use its default model. Added `show_full_output: true` for debugging
  visibility (to be set back to `false` once the pipeline is proven).
- **2026-07-28 (Code Phase 3-fix2):** Three fixes to `check-portals-release.yml`
  update-docs job: (1) Added per-job `permissions` blocks — `check-version`
  gets `contents: read`, `update-docs` gets `contents: write`,
  `pull-requests: write`, `id-token: write`. (2) Renamed `direct_prompt` →
  `prompt` (the correct input name for `claude-code-action@v1`).
  (3) Fixed prompt content delivery — `with:` inputs are literal strings, not
  shell-expanded, so `$(cat ...)` was passed as the literal text. Moved prompt
  composition into the shell step: changelog and diff contents are inlined
  into a `full-prompt.txt` file, then exported to `$GITHUB_ENV` as a multiline
  `PORTALS_UPDATE_PROMPT` variable using a unique heredoc delimiter, referenced
  by the action as `${{ env.PORTALS_UPDATE_PROMPT }}`.
- **2026-07-28 (Code Phase 3-fix):** Fixed shell precedence bug in
  `check-portals-release.yml` truncation line — `(A || B) && C` caused `mv`
  to run on a nonexistent temp file when `truncate` succeeded. Replaced with
  unconditional `head -c 60000` + `mv`. Bumped `actions/checkout@v4` → `@v5`
  and `actions/setup-node@v4` → `@v5` in both jobs to clear Node 20
  deprecation annotations. Downgraded `.portals-mcp-version` from `2.0.0` to
  `1.3.7` to allow a live test run of the full pipeline.
- **2026-07-28 (Code Phase 3):** Automation pipeline added. Version-check
  logic tested locally (dry-run confirms stored 2.0.0 matches npm latest;
  tarball-diff logic tested against 1.3.7→2.0.0, producing 115-file diffstat).
  Used `anthropics/claude-code-action@v1` with `--model claude-sonnet-4-6`
  for the update agent. PR creation uses branch naming `docs/update-vX` and
  PHASE REPORT format in the description. `CLAUDE_CODE_OAUTH_TOKEN` secret
  required — not yet configured (needs repo admin). `act` was not used for
  testing since the Claude Code action requires the secret; version-check and
  tarball-diff steps were validated directly via shell instead.
- **2026-07-28 (Code 2c-patch):** Gotchas re-grounded in bundled package
  resources; tarball extraction added as the standard research method. Ran
  `npm pack portals-mcp@2.0.0` in a temp dir, extracted the tarball, and read
  the authoritative `dist/resources/reference/gotchas.md` (~227 lines),
  `dist/resources/reference/parent-child.md`, `dist/resources/ref/items/spotlight.json`,
  and `dist/resources/ref/items/spawn.json` directly from the package. Rewrote
  `src/content/docs/reference/gotchas.md` replacing general-reasoning claims
  with documented specifics: spotlight identity rotation fires horizontally
  along +Z (not down), spawn `absRot` orients avatar only (not camera), camera
  default forward is -Y, parent-child `pos`/`rot` are local space with
  independent scale, and full rotation-format-by-field table. Added a pointer
  to `docs://reference/gotchas` for the exhaustive 200+ entry list. Skimmed
  `dist/resources/reference/cameras.md`, `parent-child.json`, `camera.json`,
  and `movement-reference.md` for contradictions against `troubleshooting.md`
  and porting pages — found no factual contradictions (porting pages don't
  make specific rotation/camera/coordinate claims, and troubleshooting's
  bridge/Node/version facts are all confirmed by the package). No changes
  needed to troubleshooting or porting pages.
- 2026-07-07: Initial scaffold created (Code Phase 1). Chose explicit sidebar
  item lists (not `autogenerate`) in `astro.config.mjs` so page order is
  guaranteed to match the spec regardless of filesystem ordering.
- 2026-07-07: Assumed the docs site would live at
  `busportals/portals-getting-started` on GitHub (reusing the `busportals`
  org from `portals-mcp`) since no repo name/org was specified. Set
  `site`/`base` in `astro.config.mjs` accordingly — flagged for confirmation.
- 2026-07-28: Confirmed — repo is `moonlitegames/portals-getting-started` on
  the user's personal GitHub account for now, with a planned transfer to the
  `busportals` org later. Updated `site` in `astro.config.mjs` to
  `https://moonlitegames.github.io` (`base` stays `/portals-getting-started`
  since the repo name is unchanged). Left the `social` GitHub link pointing
  at `busportals/portals-mcp` — that's the MCP project itself, not this docs
  repo, so it's unaffected by who owns the docs site. See the transfer-time
  follow-up under Known Issues.
- 2026-07-07: Generated `llms.txt`/`llms-full.txt` are written to `public/`
  (gitignored) rather than committed, so they're always regenerated fresh at
  build time rather than risking staleness in version control.
- 2026-07-07: Used `lychee` for link checking (fast, no extra runtime deps
  beyond the pinned Docker-based GitHub Action) over alternatives, per the
  "keep dependencies minimal" instruction.
- 2026-07-07: Found and fixed a Starlight gotcha — `LinkCard` `href`s and
  `hero.actions` links are passed straight through to `<a>` without any
  `base` prefixing (unlike sidebar/pagination links, which Starlight
  generates itself and does prefix). With `base: '/portals-getting-started'`
  set, this silently produced 404-ing links. Fixed the landing page's two
  cards by building their `href`s from `import.meta.env.BASE_URL` instead of
  hardcoded absolute paths, and dropped the redundant hero "Start Here"
  button (frontmatter YAML can't run JS, so it can't be fixed the same way)
  in favor of the two cards below it. Worth remembering if more hero actions
  or LinkCards are added later. See
  [reference/gotchas](./src/content/docs/reference/gotchas.md) as a natural
  place to document this for site authors once real content is written.
- **2026-07-28 (Cowork 2a):** Could not directly fetch
  `github.com/busportals/portals-mcp` (README, `docs/`, or releases) from
  this session — every attempt (WebFetch on the repo, `raw.githubusercontent`,
  `api.github.com`, and a plain `git clone`) returned 403/404, even though the
  repo is real and publicly referenced elsewhere (e.g. indexed by Glama:
  https://glama.ai/mcp/servers/@busportals/portals-mcp). Treated as a
  sandbox/network limitation, not evidence the repo doesn't exist. Used the
  npm registry directly instead, which *is* authoritative for install/config
  behavior: fetched `registry.npmjs.org/portals-mcp` (full version list,
  dist-tags) and the actual bundled `README.md` for both `1.3.7` (current
  1.3.x patch) and `2.0.0` (current npm `latest`) via `unpkg.com`. All setup
  and config instructions in `setup.md` are drawn from the real 1.3.x/2.0.0
  README content, not guesswork. Cross-checked the design→build→playtest→
  iterate workflow and the browser-based auth flow against the Glama-cached
  description of the same project, which independently confirms both.
- **2026-07-28 (Cowork 2a) — version deviation:** The task brief said
  `portals-mcp` is "currently v1.3.x." Actual npm state as of this session:
  `dist-tags.latest` is **2.0.0** (published 2026-07-22, six days before this
  session), with 1.3.7 as the newest 1.3.x patch (released 2026-07-10). 2.0.0
  adds an opt-in "builder" tool profile (`PORTALS_MCP_TOOL_PROFILE=builder`,
  an MCP 2.0 candidate, gated behind benchmark promotion) on top of the same
  53-ish-tool "compatibility" profile that's the default in both lines — it's
  additive, not a breaking rewrite of the beginner path. Per the brief's own
  instruction to write for 1.3.x, `setup.md` pins its guidance to 1.3.x
  behavior and explicitly calls out that `@latest` now resolves to a newer
  major, with an explicit-pin example (`portals-mcp@1.3`) so a reader isn't
  silently bumped onto 2.0.0's not-yet-documented surface. This is flagged
  here for whoever plans the next content phase — `reference/versions.md`
  (still a stub) is the natural place to formally document the 2.0.0
  builder-profile changeover once it's out of candidate status.
- **2026-07-28 (Cowork 2a) — minor:** Didn't find a dedicated 1.3 changelog
  or GitHub Releases page (same access limitation as above). No content in
  these four pages depends on release-note specifics; if per-version release
  notes are needed later, they'll need to come from someone with direct repo
  access.
- **2026-07-28 (Code Phase 2a.5 — 2.0 retarget):** Retargeted Start Here's
  version framing now that `portals-mcp@latest` is confirmed 2.0.0 (was still
  showing as a fresh release during Cowork 2a). Previous framing pinned the
  explicit-version example to `1.3` specifically to keep readers off an
  undocumented major; now that 2.0.0's default **compatibility** profile is
  confirmed to preserve 1.3.x behavior, that defensive pin is no longer
  needed. Changed `setup.md`'s "A note on versions" section to describe
  2.0.0 as current, updated the explicit-pin example to `portals-mcp@2.0.0`,
  and kept the general note that `@latest` can drift to a future major
  (now framed prospectively rather than as an active workaround). Added a
  short "Tool profiles" callout in the same section naming
  `PORTALS_MCP_TOOL_PROFILE` and stating plainly that this guide documents
  the default `compatibility` profile only. Also added a recommended
  `get_server_info` first call to `first-room.md` (previously only appeared
  as `setup.md`'s "Try it" prompt) so readers confirm version/profile before
  their first build, not just after setup. Logged the resulting follow-up
  work — a real `reference/versions.md` entry for 2.0.0, and Track B
  decisions about if/when the `builder` profile gets a beginner-facing
  mention — under Planned above.
- 2026-07-28: First real Pages deploy failed — the `withastro/action@v3`
  runner defaulted to Node 20, but this Astro version requires >=22.12.
  Fixed by pinning `node-version: 22` in the `with:` block of the
  `withastro/action@v3` step in `.github/workflows/deploy.yml`.
- **2026-07-28 (Cowork 2b) — sourcing:** Same access limitation as Cowork 2a
  persisted: `github.com/busportals/portals-mcp` (README, `docs/`, and
  `/releases`) all returned 404 again this session, including a fresh
  attempt at a 1.3-specific changelog/release-notes page as the brief asked
  for — none found, same as logged in Cowork 2a. Used the same working
  path instead: fetched the actual bundled `README.md` for both `portals-mcp@2.0.0`
  and `@1.3.7` via `unpkg.com`. Both versions' READMEs describe the same
  ~53-tool default **compatibility** profile (marketplace/inventory,
  room management, scene design, live game connection, AI-generated
  assets, and the gameplay-planning tools this session's pages document),
  so — unlike `setup.md`'s version-pin concern — none of these five pages
  needed 1.3-vs-2.0 hedging; the tool surface they describe is stable
  across both.
- **2026-07-28 (Cowork 2b) — deviation, flagged as inference:** The brief
  asked for "what genres/mechanics map well vs. poorly." Neither README
  contains an explicit supported-genres list — that guidance in
  `capabilities.md` is this session's own reasoning from the described tool
  capabilities (specifically: Function Effects/"JS effectors" are an
  NCalc expression language with conditionals and math but no loops,
  arrays, or custom functions — confirmed directly from both READMEs), not
  a fact pulled verbatim from Portals documentation. Flagging this
  distinctly from the tool names/descriptions/counts elsewhere in these
  five pages, which are sourced directly. If an authoritative genre-fit
  list surfaces later (e.g. once direct repo access is available), reconcile
  it against the reasoning in `capabilities.md`.
- **2026-07-28 (Cowork 2b) — minor:** All five pages assume the
  **compatibility** tool profile (the same default this whole guide
  documents) and explicitly say so in `capabilities.md` and `debugging.md`,
  rather than silently assuming it — consistent with the Track B call
  already made for Start Here.
- **2026-07-28 (Code 2b-patch):** Three 2.0-delta items were missing from
  the original Cowork 2b brief and got added as a follow-up patch:
  1. `debugging.md` — the `connect_to_game` bullet now states the bridge
     listens on `ws://localhost:3099` (override via `PORTALS_BRIDGE_PORT`)
     **and** warns that embedded/in-app browsers frequently can't reach
     localhost websockets at all — use a regular desktop Chrome session for
     live-connection work, or `connect_to_game` will look like a broken room
     when it's actually a browser-environment limitation.
  2. `capabilities.md` — added a full "Tool profiles" section with the
     three-profile table (`compatibility` default/53 tools,
     `expert`/27 low-level tools, `builder`/opt-in/7 outcome tools) and a
     pointer to the bundled `docs://ai/tool-capability-manifest` resource as
     the authoritative, queryable source, rather than only gesturing at
     profiles in passing as the original version did.
  3. `assets.md` — added a "Profile note" stating marketplace and paid
     AI-generation tools are `compatibility`-only; `builder` deliberately
     excludes both in favor of its own smaller outcome-oriented tool set.
  Also revisited the "genres/mechanics map well vs. poorly" section flagged
  as inference above: reworded section headers ("What tends to map well" /
  "What tends to map poorly") and body copy throughout to use explicit
  guidance language ("tends to," "leans on," "as a rule of thumb") instead
  of flat declarative claims, so the hedging is visible in the page itself
  and not just in this log. Re-verified with a full `npm run build` — all
  five routes still generate correctly post-patch.
- **2026-07-28 (Code 2c) — sourcing:** Ran two fresh, more targeted fetches
  of `portals-mcp@2.0.0`'s and `@1.3.7`'s READMEs via `unpkg.com`
  specifically asking about gotchas/pitfalls, the `apply_operations`
  freshness model, `get_server_info`, auth flow, and Codex support (rather
  than reusing Cowork 2b's more general fetches). This directly confirmed,
  close to verbatim, several facts already used in Porting Your Game: the
  freshness model ("atomic targeted ops against a mandatory fresh room
  download; never uploads partial batches or falls back to stale local
  data"), `get_server_info`'s exact return shape (version, commit, active
  tool profile) and the recommendation to include it in bug reports, and —
  independently — the embedded/in-app-browser websocket caveat already
  added to `debugging.md` in Code 2b-patch, which this fetch reproduced
  almost word-for-word. Treating that reproduction as a good sign the
  Code 2b-patch addition was accurate. Also newly confirmed: Codex client
  support details (`default_tools_approval_mode = "approve"` in
  `~/.codex/config.toml`), used in `troubleshooting.md`'s framing of MCP
  clients generally (see [glossary](./src/content/docs/reference/glossary.md)'s
  "MCP client" entry).
- **2026-07-28 (Code 2c) — deviation, flagged as inference:** The brief's
  four named `gotchas.md` topics — spotlights, spawn radius, parenting,
  rotations — are **not** covered in either README (confirmed by the
  targeted fetch above; both explicitly came back empty on these topics).
  They're likely documented only in the bundled `docs://` resources (160 in
  2.0.0, ~148 in 1.3.7), which aren't reachable outside a live MCP session
  in this sandbox — same root limitation as the persistent GitHub 404s
  logged in every prior session. Wrote all four from general 3D/game-engine
  domain reasoning instead (GLB axis-convention mismatches for rotation,
  spawn-point stacking under concurrency for spawn radius, explicit
  parent-child hierarchy requirements for parenting, cone-angle/range vs.
  room-scale mismatches for spotlights), deliberately avoiding invented
  specific numbers (default angles, ranges, distances) that aren't actually
  known. This is a materially different sourcing situation from the same
  page's `apply_operations` entry, which *is* a direct quote — flagging the
  split explicitly since `gotchas.md` mixes both in one page. If the real
  `docs://` gotcha content is available later, reconcile these four entries
  against it rather than assuming the reasoning here is authoritative.
- **2026-07-28 (Code 2c) — minor:** The `versions.md` entry content
  (highlights, migration notes, and the 1.3 line's initial release date of
  2026-05-29) was supplied directly in this session's task brief rather
  than independently re-derived. Cross-checked the two dates that
  overlapped with prior research — 1.3.7's patch date (2026-07-10, from
  Cowork 2a) and 2.0.0's release date (2026-07-22, from Cowork 2a/2a.5) —
  against the brief's figures and found no conflicts; the entry represents
  the 1.3 line as "released 2026-05-29 (through patch 1.3.7, 2026-07-10)"
  to keep both facts visible rather than picking one date.

## Known Issues

- **2026-07-28 (v2.0.0 docs update):** Could not run `npm run build` or
  `npm test` to verify this session's changes — `npm install` required
  approval that wasn't granted in this session, and no `node_modules`
  directory was present to fall back on. Changes were reviewed by hand
  instead (Markdown/MDX syntax, internal link targets, and code-fence
  languages all checked manually). Whoever reviews the PR should run a real
  `npm run build` before merging.
- First Pages deploy against the real `moonlitegames/portals-getting-started`
  repo failed on Node version (see Decisions log above); the
  `node-version: 22` fix hasn't been confirmed by a successful run yet. The
  link-check workflow is still untested against a live remote.
- **Transfer-time URL change required.** This repo currently lives at
  `moonlitegames/portals-getting-started` and `astro.config.mjs` is set to
  `site: 'https://moonlitegames.github.io'`. When the repo transfers to the
  `busportals` org, update `site` to `https://busportals.github.io` (a plain
  GitHub org/user rename via transfer does **not** update this — it's a
  hardcoded config value, not derived). `base` (`/portals-getting-started`)
  only needs to change if the repo is renamed during the transfer. After
  updating, rebuild and spot-check the landing page's two cards and any
  other absolute internal links (see the Starlight `base`-prefixing gotcha
  logged above) since a stale `site` value won't break the build but will
  produce wrong canonical/OG URLs and a wrong sitemap.

---

Last updated: 2026-07-28 by v2.0.0 docs update session — corrected the
room-write freshness model in gotchas.md, added Codex setup instructions,
amended the versions.md 2.0.0 entry against the real bundled-docs diff, and
bumped .portals-mcp-version to 2.0.0
