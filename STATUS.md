# STATUS

Tracking doc for the Portals Getting Started site. This file is meant to be
kept up to date across sessions so the next person (human or agent) can pick
up context quickly.

## Implemented

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

## In Progress

- Nothing in progress; this is the end of the initial scaffold session
  (Phase 1).

## Planned

- **Phase 2 — guide content (remaining).** Start Here is done (see
  Implemented above, Cowork 2a). Still stubs:
  - Porting Your Game: `mental-model`, `capabilities`, `porting-workflow`,
    `debugging`, `assets`
  - Reference: `gotchas`, `troubleshooting`, `versions`, `glossary`
- **`reference/versions.md` — 2.0.0 entry.** Now that `portals-mcp@latest` is
  2.0.0, this stub needs a real entry covering: 2.0.0 vs. the 1.3.x line
  (compatibility profile behavior unchanged; the `builder` profile is new and
  opt-in via `PORTALS_MCP_TOOL_PROFILE`, gated behind benchmark promotion),
  and general guidance on reading `dist-tags` before assuming `@latest` means
  "what this guide describes." Start Here (`setup.md`) now covers the
  practical pin/`@latest` tradeoff inline, but the authoritative version
  history/compatibility table belongs here.
- **Track B — 2.0 delta items.** Once 2.0.0's `builder` tool profile clears
  benchmark promotion (or if it becomes the recommended path before then),
  revisit: whether Start Here should mention it at all for beginners (current
  call: no — compatibility is the only profile this guide documents, by
  design), and whether `porting/capabilities.md` needs a 2.0-specific section
  once that content is written.
- **Phase 3 — automation & polish.**
  - Repo is launching at `moonlitegames/portals-getting-started` (personal
    account), transferring to the `busportals` org later — see the
    transfer-time `site` URL update tracked under Known Issues.
  - Enable GitHub Pages (Settings → Pages → Source: GitHub Actions) once the
    repo exists remotely.
  - Consider adding search, versioned docs, or a "last updated" date per page
    once real content lands.
  - Revisit whether `llms.txt`/`llms-full.txt` need per-page ordering (they're
    currently alphabetical within each sidebar group) once real content makes
    the order more visible.

## Decisions & Changes Log

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

## Known Issues

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

Last updated: 2026-07-28 by Code Phase 2a.5 (apply + 2.0 alignment) session —
retargeted setup.md's version framing to portals-mcp 2.0.0, added a
get_server_info first call to first-room.md, and added a tool-profiles
callout
