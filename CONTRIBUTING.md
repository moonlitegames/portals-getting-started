# Contributing

## Project overview

This is the documentation site for [portals-mcp](https://www.npmjs.com/package/portals-mcp),
built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).
See [STATUS.md](./STATUS.md) for what's implemented, in progress, and planned.

## Making changes

1. All guide pages live under `src/content/docs/` as Markdown/MDX files.
2. Keep pages in the existing sidebar sections and slugs defined in
   `astro.config.mjs` — the landing page and `llms.txt` generation both depend
   on that structure.
3. Run `npm run build` locally before pushing to confirm the site builds
   cleanly and the Pagefind index generates.

## Branch protection (recommended)

Enable these rules on the `main` branch:

- **Require a pull request before merging** (at least 1 approving review).
- **Require status checks to pass** — add the `build` job from `deploy.yml`
  and the `lychee` job from `link-check.yml`.
- **Do not allow bypassing the above settings** for automation accounts.

This ensures all changes — including automated ones — go through review.

## Automated documentation updates

The workflow
[`.github/workflows/check-portals-release.yml`](./.github/workflows/check-portals-release.yml)
runs daily and on manual dispatch. It:

1. Fetches the latest `portals-mcp` version from the npm registry and compares
   it against the version stored in `.portals-mcp-version`.
2. If a new version is detected, it:
   - Downloads both the old and new npm tarballs (`npm pack`) and diffs the
     bundled `dist/resources/` directory and `README.md` between versions.
     These bundled resources are the authoritative reference docs — changes
     there are the primary signal, not just the changelog.
   - Fetches release notes from the GitHub Releases API (best-effort fallback
     if unavailable).
   - Invokes [Claude Code](https://github.com/anthropics/claude-code-action)
     to review guide pages against the diff and update anything affected.
   - Opens a pull request on a `docs/update-vX.Y.Z` branch. **The PR never
     auto-merges** — a human must review and approve it.

### Setup requirements

- A `CLAUDE_CODE_OAUTH_TOKEN` repository secret for the Claude Code action.
- The workflow needs `contents: write` and `pull-requests: write` permissions
  (already configured in the workflow file).

### Manual trigger

You can run the workflow manually from the Actions tab. Use the **dry_run**
option to test the version-check step without creating a PR.

### When a PR arrives

Review the PR like any other — check that the page updates match the resource
diff, that `reference/versions.md` has a new entry, and that `STATUS.md` is
updated. The PR description follows the standard PHASE REPORT format.
