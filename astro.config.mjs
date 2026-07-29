// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
	site: 'https://moonlitegames.github.io',
	base: '/portals-getting-started',
	integrations: [
		starlight({
			title: 'Portals Getting Started',
			description: 'The definitive guide for developers building games with the Portals MCP.',
			social: [
				{ icon: 'npm', label: 'npm', href: 'https://www.npmjs.com/package/portals-mcp' },
			],
			plugins: [
				starlightLinksValidator({
					// This site deploys under an Astro `base` subpath, and Astro does not
					// prepend `base` to hand-authored root-absolute links (only to its own
					// generated navigation) — so every internal content link here is
					// deliberately relative, which is what actually works in production.
					// This plugin can only structurally validate root-absolute links against
					// known page slugs; it cannot verify relative-link targets at all (by
					// design — see its docs), so `errorOnRelativeLinks: false` is required
					// or the build would always fail on our correct links. See STATUS.md's
					// Decisions log ("Code link-fix") for the full tradeoff this leaves.
					errorOnRelativeLinks: false,
				}),
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'What is an MCP?', slug: 'start-here/what-is-an-mcp' },
						{ label: 'Setup', slug: 'start-here/setup' },
						{ label: 'Your First Room', slug: 'start-here/first-room' },
						{ label: 'The Loop', slug: 'start-here/the-loop' },
					],
				},
				{
					label: 'Porting Your Game',
					items: [
						{ label: 'Mental Model', slug: 'porting/mental-model' },
						{ label: 'Capabilities', slug: 'porting/capabilities' },
						{ label: 'Porting Workflow', slug: 'porting/porting-workflow' },
						{ label: 'Debugging', slug: 'porting/debugging' },
						{ label: 'Assets', slug: 'porting/assets' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Gotchas', slug: 'reference/gotchas' },
						{ label: 'Troubleshooting', slug: 'reference/troubleshooting' },
						{ label: 'Versions', slug: 'reference/versions' },
						{ label: 'Glossary', slug: 'reference/glossary' },
					],
				},
			],
		}),
	],
});
