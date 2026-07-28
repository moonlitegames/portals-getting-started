# STATUS

Tracking doc for the Portals Getting Started site. This file is meant to be
kept up to date across sessions so the next person (human or agent) can pick
up context quickly.

## Implemented

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

- **Phase 2 — guide content.** Write real content for all 13 stub pages:
  - Start Here: `what-is-an-mcp`, `setup`, `first-room`, `the-loop`
  - Porting Your Game: `mental-model`, `capabilities`, `porting-workflow`,
    `debugging`, `assets`
  - Reference: `gotchas`, `troubleshooting`, `versions`, `glossary`
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

Last updated: 2026-07-28 by Code Phase 1 (scaffold) session — deploy Node version fix
