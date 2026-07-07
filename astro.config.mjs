// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://busportals.github.io',
	base: '/portals-getting-started',
	integrations: [
		starlight({
			title: 'Portals Getting Started',
			description: 'The definitive guide for developers building games with the Portals MCP.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/busportals/portals-mcp' },
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
