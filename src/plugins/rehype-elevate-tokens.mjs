// Colors inline Elevate tokens by grammar role, so readers learn the syntax by sight:
//   property  →  .el-prop     modifier  →  .el-mod
//   @state    →  .el-state    /bp/      →  .el-bp      separators → .el-sep
// Only inline `code` is touched; fenced code blocks are left to Expressive Code.

import { readFileSync } from 'node:fs';

// Real Elevate property names (generated from elevate/core/system/declarationMap.ts),
// so plain CSS like `display:flex` in prose isn't dressed up as an Elevate token.
const PROPERTIES = new Set(JSON.parse(readFileSync(new URL('./elevate-properties.json', import.meta.url), 'utf8')));

const BREAKPOINT = /^\/[a-z0-9]{1,5}\/$/i;
const UTILITY = /^-?[a-z][a-z0-9-]*(?::[^\s:]+)+$/i;
const STATE = /^@([a-z0-9+_-]+):\[(.*)\]$/i;

const span = (cls, value) => ({
	type: 'element',
	tagName: 'span',
	properties: { className: [cls] },
	children: [{ type: 'text', value }],
});
const sep = (value) => span('el-sep', value);

function utility(token) {
	const [prop, ...mods] = token.split(':');
	const out = [span('el-prop', prop)];
	for (const m of mods) out.push(sep(':'), span('el-mod', m));
	return out;
}

function tokenize(text) {
	if (BREAKPOINT.test(text)) return [span('el-bp', text)];
	const state = text.match(STATE);
	if (state) {
		const inner = state[2].split(/_+/).filter(Boolean);
		const out = [span('el-state', `@${state[1]}`), sep(':[')];
		inner.forEach((t, i) => {
			if (i) out.push(sep('_'));
			out.push(...(UTILITY.test(t) && PROPERTIES.has(t.split(':')[0]) ? utility(t) : [{ type: 'text', value: t }]));
		});
		out.push(sep(']'));
		return out;
	}
	if (UTILITY.test(text) && !text.includes('{') && PROPERTIES.has(text.split(':')[0])) return utility(text);
	return null;
}

export default function rehypeElevateTokens() {
	return (tree) => {
		const walk = (node, parent) => {
			if (node.type === 'element' && node.tagName === 'code' && parent?.tagName !== 'pre') {
				const only = node.children?.length === 1 && node.children[0].type === 'text' ? node.children[0].value : null;
				const parts = only && tokenize(only.trim());
				if (parts) {
					node.children = parts;
					node.properties = { ...node.properties, className: [...(node.properties?.className || []), 'el-token'] };
				}
				return;
			}
			node.children?.forEach((c) => walk(c, node));
		};
		walk(tree, null);
	};
}
