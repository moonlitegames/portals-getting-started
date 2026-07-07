// Generates public/llms.txt and public/llms-full.txt from src/content/docs
// so they get copied to the site root as part of the normal Astro build.
// Deliberately dependency-free: parses the simple, single-line frontmatter
// (title/description) used by this project's stub pages by hand instead of
// pulling in a YAML parser.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const docsDir = join(rootDir, 'src/content/docs');
const publicDir = join(rootDir, 'public');

const siteTitle = 'Portals Getting Started';
const siteSummary = 'The definitive guide for developers building games with the Portals MCP.';

// Preferred group order; anything else is appended alphabetically.
const groupOrder = ['start-here', 'porting', 'reference'];
const groupLabels = {
	'start-here': 'Start Here',
	porting: 'Porting Your Game',
	reference: 'Reference',
};

function walk(dir) {
	const entries = readdirSync(dir);
	let files = [];
	for (const entry of entries) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			files = files.concat(walk(full));
		} else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
			files.push(full);
		}
	}
	return files;
}

function parseFrontmatter(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) return { data: {}, body: raw };
	const [, frontmatter, body] = match;
	const data = {};
	for (const line of frontmatter.split('\n')) {
		// Only capture top-level (non-indented) "key: value" scalars.
		const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
		if (!kv) continue;
		const [, key, rawValue] = kv;
		data[key] = rawValue.trim().replace(/^["']|["']$/g, '');
	}
	return { data, body };
}

function routeFor(filePath) {
	const rel = relative(docsDir, filePath).split(sep).join('/');
	const noExt = rel.replace(/\.mdx?$/, '');
	if (noExt === 'index') return '/';
	return `/${noExt}/`;
}

function groupFor(filePath) {
	const rel = relative(docsDir, filePath).split(sep).join('/');
	const [first] = rel.split('/');
	return first.includes('.') ? '_root' : first;
}

const files = walk(docsDir).sort();

const pages = files.map((filePath) => {
	const raw = readFileSync(filePath, 'utf-8');
	const { data, body } = parseFrontmatter(raw);
	return {
		route: routeFor(filePath),
		group: groupFor(filePath),
		title: data.title ?? relative(docsDir, filePath),
		description: data.description ?? '',
		body,
	};
});

// --- llms.txt: an index of pages with one-line descriptions ---
const groups = [...new Set(pages.map((p) => p.group))].sort((a, b) => {
	const ai = groupOrder.indexOf(a);
	const bi = groupOrder.indexOf(b);
	if (ai === -1 && bi === -1) return a.localeCompare(b);
	if (ai === -1) return 1;
	if (bi === -1) return -1;
	return ai - bi;
});

let llmsTxt = `# ${siteTitle}\n\n> ${siteSummary}\n\n`;
for (const group of groups) {
	if (group === '_root') continue;
	llmsTxt += `## ${groupLabels[group] ?? group}\n\n`;
	for (const page of pages.filter((p) => p.group === group)) {
		llmsTxt += `- [${page.title}](${page.route}): ${page.description}\n`;
	}
	llmsTxt += '\n';
}

// --- llms-full.txt: concatenated raw markdown of every page ---
let llmsFullTxt = `# ${siteTitle}\n\n> ${siteSummary}\n\n`;
for (const page of pages) {
	llmsFullTxt += `---\n\n# ${page.route}\n\n${page.body.trim()}\n\n`;
}

writeFileSync(join(publicDir, 'llms.txt'), llmsTxt);
writeFileSync(join(publicDir, 'llms-full.txt'), llmsFullTxt);

console.log(`Generated llms.txt and llms-full.txt from ${pages.length} pages.`);
