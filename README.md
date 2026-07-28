# Portals Getting Started

Documentation site for developers building games with the **Portals MCP**
([`portals-mcp`](https://www.npmjs.com/package/portals-mcp) on npm,
[busportals/portals-mcp](https://github.com/busportals/portals-mcp) on GitHub,
published to [theportal.to](https://theportal.to)).

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

> **Note:** This repo is being scaffolded on behalf of the Portals team and is
> intended to be transferred to them once the guide content is filled in. See
> [STATUS.md](./STATUS.md) for what's implemented, in progress, and planned.

## Project structure

```
.
├── src/content/docs/       # All guide pages (Markdown/MDX)
│   ├── start-here/          # Start Here section
│   ├── porting/             # Porting Your Game section
│   └── reference/           # Reference section
├── scripts/
│   └── generate-llms.mjs    # Generates llms.txt / llms-full.txt at build time
├── astro.config.mjs         # Site title, sidebar structure, social links
└── .github/workflows/       # CI: deploy to GitHub Pages, weekly link check
```

Starlight maps each `.md`/`.mdx` file under `src/content/docs/` to a route
based on its path, e.g. `src/content/docs/start-here/setup.md` → `/start-here/setup/`.

## Running locally

Requires Node.js 18+ and npm.

```sh
npm install
npm run dev
```

This starts a local dev server at `http://localhost:4321`.

Other commands:

| Command           | Action                                                          |
| :----------------- | :-------------------------------------------------------------- |
| `npm run build`     | Regenerates `llms.txt`/`llms-full.txt`, then builds to `./dist/` |
| `npm run preview`   | Preview the production build locally                             |
| `npm run generate:llms` | Regenerate `public/llms.txt` and `public/llms-full.txt` only |

## llms.txt

As part of every build, [`scripts/generate-llms.mjs`](./scripts/generate-llms.mjs)
scans all pages under `src/content/docs/` and writes two files into `public/`
(so they land in the site root of the built output):

- **`llms.txt`** — an index of every page grouped by sidebar section, with its
  title and one-line description.
- **`llms-full.txt`** — the concatenated raw Markdown of every page, for
  feeding the whole guide to an LLM at once.

These are generated, not hand-maintained — don't edit them directly, edit the
source pages instead.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml),
which builds the site and deploys it to GitHub Pages.

[`.github/workflows/link-check.yml`](./.github/workflows/link-check.yml) runs
a link check ([lychee](https://github.com/lycheeverse/lychee)) on every pull
request and weekly on a schedule, to catch broken links (internal or
external) before they ship.

## Automated portals-mcp update pipeline

[`.github/workflows/check-portals-release.yml`](./.github/workflows/check-portals-release.yml)
runs daily and checks whether a new version of `portals-mcp` has been published
to npm. When one is found, it diffs the bundled reference docs between
versions and invokes Claude Code to update affected guide pages, opening a
pull request for human review. See [CONTRIBUTING.md](./CONTRIBUTING.md) for
full details and setup requirements.

## Branch protection

Enable these rules on `main` before transferring the repo to the Portals team:

- **Require a pull request before merging** with at least 1 approving review.
- **Require status checks to pass** (`build` from `deploy.yml`, `lychee` from
  `link-check.yml`).

This ensures all changes — including automated doc-update PRs — go through
review and never auto-merge.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on making changes,
the automated update pipeline, and branch protection setup.
