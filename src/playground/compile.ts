// Runs the real Elevate compiler (elevate/core) in the browser for one class list,
// and assembles CSS the same way elevate/core/index.ts does for a project.
import './shim';
import { elevateCompiler } from '../../elevate/core/parser';
import { getModifierValue, getBreakpointPriority } from '../../elevate/core/utility';

export type Rule = { token: string; css: string; breakpoint: string };
export type Problem = { token: string; message: string };
export type Result = { css: string; rules: Rule[]; problems: Problem[]; notes: string[] };

const BREAKPOINT = /\/[a-zA-Z0-9]{1,3}\//;
const PSEUDO_ELEMENTS = new Set(['placeholder', 'before', 'after', 'marker', 'selection', 'backdrop', 'file-selector-button']);

const escapeClassName = (c: string) => c.replace(/[@:\[\]()\/.,+#~=%?&!$^*<>{}|]/g, (m) => `\\${m}`);

const stateSuffix = (state: string | string[] | null | undefined) => {
	if (!state) return '';
	const chain = Array.isArray(state) ? state : String(state).split('+');
	const classes = chain.filter((t) => t && !PSEUDO_ELEMENTS.has(t));
	const elems = chain.filter((t) => PSEUDO_ELEMENTS.has(t));
	if (elems.length > 1) throw new Error(`Invalid state chain: multiple pseudo-elements (${elems.join(', ')}). CSS allows only one pseudo-element per selector.`);
	return (classes.length ? `:${classes.join(':')}` : '') + (elems.length ? `::${elems[0]}` : '');
};

let autoGridMin = '10rem';
try {
	autoGridMin = getModifierValue('min-c10', { 'grid-template-columns': 'GridAutoMinRule' });
} catch {}

const LEAD: Record<string, string> = {
	row: 'display:flex;\nflex-direction:row;',
	col: 'display:flex;\nflex-direction:column;',
	'row-r': 'display:flex;\nflex-direction:row-reverse;',
	'col-r': 'display:flex;\nflex-direction:column-reverse;',
	stack: 'display:flex;\nflex-direction:column;',
	cluster: 'display:flex;\nflex-direction:row;\nflex-wrap:wrap;',
	split: 'display:grid;\ngrid-template-columns:1fr 1fr;',
	center: 'margin-left:auto;\nmargin-right:auto;',
	'grid-auto': `display:grid;\ngrid-template-columns:repeat(auto-fit, minmax(${autoGridMin}, 1fr));`,
	grid: 'display:grid;',
};

// Keep the headline of a compiler error; drop the troubleshooting footer.
const headline = (msg: string) =>
	msg.replace(/^\s+/, '').split(/\n\s*\n|💡/)[0].replace(/\s+in elevate playground on line \d+/, '').trim();

export function compile(input: string): Result {
	const tokens = input.match(/(?:@[^\s\[]*\[[^\]]*\]|\S)+/g) || [];
	const problems: Problem[] = [];
	const notes: string[] = [];
	const items: any[] = [];
	let lastBreak = '';

	for (const token of tokens) {
		if (BREAKPOINT.test(token)) {
			try {
				if (!getModifierValue(token.replace(/\//g, ''))) throw new Error();
				lastBreak = token;
			} catch {
				problems.push({ token, message: `Invalid breakpoint value: ${token}` });
			}
			continue;
		}
		if (token.startsWith('-')) continue; // plain CSS classes are skipped by Elevate
		if (token.startsWith('env:') || token.startsWith('ctx:')) {
			notes.push(`${token} works across elements in your project files. The playground compiles one element, so it's skipped here.`);
			continue;
		}
		try {
			const item = elevateCompiler(token, { fileName: 'elevate playground', lineNumber: 1 });
			if (!item) throw new Error('Unable to parse token');
			if (item.selectorMode) {
				notes.push(`${token} needs a ctx scope around it, so the playground can't preview it on one element.`);
				continue;
			}
			item.breakpoint = lastBreak;
			items.push(item);
		} catch (e: any) {
			problems.push({ token, message: headline(String(e?.message || e)) });
		}
	}

	items.sort((a, b) => {
		if (!a.breakpoint) return -1;
		if (!b.breakpoint) return 1;
		return getBreakpointPriority(a.breakpoint) - getBreakpointPriority(b.breakpoint);
	});

	const rules: Rule[] = [];
	const seen = new Set<string>();
	let css = '';
	let open = '';
	for (const item of items) {
		const key = `${item.className}${item.breakpoint}`;
		if (seen.has(key)) continue;
		seen.add(key);
		let suffix = '';
		try {
			suffix = stateSuffix(item.state);
		} catch (e: any) {
			problems.push({ token: item.className, message: e.message });
			continue;
		}
		const lead = LEAD[item.property] ? `\n${LEAD[item.property]}` : '';
		const body = item.modifiers.map((m: string) => `${m};`).join('\n');
		const rule = `.${escapeClassName(item.className)}${suffix} {${lead}\n${body}\n}`;
		if (item.breakpoint !== open) {
			if (open) css += '}\n\n';
			if (item.breakpoint) css += `@media only screen and (min-width:${getModifierValue(item.breakpoint.replace(/\//g, ''))}) {\n`;
			open = item.breakpoint;
		}
		css += rule + '\n\n';
		rules.push({ token: item.className, css: rule, breakpoint: item.breakpoint });
	}
	if (open) css += '}\n';
	return { css: css.trim(), rules, problems, notes };
}

export function breakpointWidth(name: string): string | null {
	try {
		return getModifierValue(name);
	} catch {
		return null;
	}
}
