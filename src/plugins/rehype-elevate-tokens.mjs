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

// In table cells, long code may wrap, but only after `:`, `_` or `,` — never at a
// hyphen, so `border-width` or `x-center` always stays whole. Each segment is a
// no-wrap span with a <wbr> between segments; the copied text is unchanged.
const BREAK_AFTER = /([:_,])/;
const wbr = () => ({ type: 'element', tagName: 'wbr', properties: {}, children: [] });
const seg = (value) => ({ type: 'element', tagName: 'span', properties: { className: ['nb'] }, children: [{ type: 'text', value }] });

function breakable(children, at = BREAK_AFTER) {
	const out = [];
	for (const child of children) {
		if (child.type === 'text') {
			const pieces = child.value.split(at).reduce((acc, p, i) => {
				if (i % 2 === 1) acc[acc.length - 1] += p; else acc.push(p);
				return acc;
			}, []).filter(Boolean);
			pieces.forEach((p, i) => { if (i) out.push(wbr()); out.push(seg(p)); });
		} else {
			if (out.length && child.properties?.className?.includes('el-sep') === false) {
				// keep property/modifier spans whole; breaks happen after separators
			}
			out.push(child);
			if (child.properties?.className?.includes('el-sep')) out.push(wbr());
		}
	}
	return out;
}

const textOf = (n) => (n.type === 'text' ? n.value : (n.children || []).map(textOf).join(''));

// Tables with three or more columns get `stack` and a data-label on every cell,
// so on phones each row can become a small card: the first cell as its title,
// the rest as label and value pairs.
function labelTable(table) {
	const find = (n, tag, out = []) => {
		if (n.type === 'element' && n.tagName === tag) out.push(n);
		(n.children || []).forEach((c) => find(c, tag, out));
		return out;
	};
	const head = find(table, 'thead')[0];
	if (!head) return;
	const labels = find(head, 'th').map((th) => textOf(th).trim());
	if (labels.length < 3) return;
	table.properties = { ...table.properties, className: [...(table.properties?.className || []), 'stack'] };
	for (const body of find(table, 'tbody')) {
		for (const tr of find(body, 'tr')) {
			find(tr, 'td').forEach((td, i) => {
				td.properties = { ...td.properties, dataLabel: labels[i] || '' };
				// one wrapper, so the value stays a single run of text beside its label
				if (td.children?.length) td.children = [{ type: 'element', tagName: 'span', properties: { className: ['cell-v'] }, children: td.children }];
			});
		}
	}
}

export default function rehypeElevateTokens() {
	return (tree) => {
		const walk = (node, parent, inCell) => {
			if (node.type === 'element' && node.tagName === 'code' && parent?.tagName !== 'pre') {
				const only = node.children?.length === 1 && node.children[0].type === 'text' ? node.children[0].value : null;
				const parts = only && tokenize(only.trim());
				if (parts) {
					node.children = parts;
					node.properties = { ...node.properties, className: [...(node.properties?.className || []), 'el-token'] };
				}
				if (inCell) {
					node.children = breakable(node.children);
					node.properties = { ...node.properties, className: [...(node.properties?.className || []), 'cell-code'] };
				} else if (!parts && only && only.includes('/') && only.length > 16) {
					// long file paths in prose break after a slash, never mid-name
					node.children = breakable(node.children, /(\/)/);
					node.properties = { ...node.properties, className: [...(node.properties?.className || []), 'cell-code'] };
				}
				return;
			}
			if (node.type === 'element' && node.tagName === 'table') labelTable(node);
			const cell = inCell || (node.type === 'element' && (node.tagName === 'td' || node.tagName === 'th'));
			node.children?.forEach((c) => walk(c, node, cell));
		};
		walk(tree, null, false);
	};
}
