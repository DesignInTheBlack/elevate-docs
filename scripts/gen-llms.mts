/*
  Builds public/llms.txt and public/llms-full.txt for AI assistants.

  The reference sections (every property, every token, the error messages and
  the Tailwind table's CSS) are generated from the framework's own source, and
  every class used anywhere in the output is run through the real compiler.
  A wrong example fails this script instead of reaching a reader.

  Run: npm run llms
*/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const fw = (p: string) => path.join(root, 'elevate', p);

// Quiet the compiler's own crash handler: we want to catch its errors here.
const { elevateCompiler } = await import(fw('core/parser.ts'));
process.removeAllListeners('uncaughtException');
const { declarationMap } = await import(fw('core/system/declarationMap.ts'));
const { elevateRules } = await import(fw('core/system/elevateRules.ts'));
const { designSystem } = await import(fw('config/design.ts'));
const { spacing } = await import(fw('core/system/design/spacing.ts'));
const { dimensionUtility } = await import(fw('core/system/etc/dimension.ts'));
const { colors } = await import(fw('core/system/design/colors.ts'));
const { typography } = await import(fw('core/system/design/typography.ts'));
const { breakpoints } = await import(fw('core/system/design/breakpoints.ts'));
const { effects } = await import(fw('core/system/design/effects.ts'));
const { contain } = await import(fw('core/system/etc/contain.ts'));
const { rules: userRules } = await import(fw('config/syntax.ts'));

// The published version the docs depend on
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/elevate-framework/package.json'), 'utf8')).version;

const R: Record<string, any> = { ...elevateRules, ...userRules };
const T: Record<string, any> = designSystem;
const DM: Record<string, Record<string, string>> = declarationMap;

const fail = (msg: string): never => {
	console.error(`\n✗ ${msg}\n`);
	process.exit(1);
};

// ---------------------------------------------------------------- compile helpers
const compile = (cls: string) => elevateCompiler(cls);
const errorOf = (cls: string): string | null => {
	try {
		compile(cls);
		return null;
	} catch (e: any) {
		return String(e.message).trim();
	}
};

const IMPLICIT: Record<string, string[]> = {
	row: ['display: flex', 'flex-direction: row'],
	col: ['display: flex', 'flex-direction: column'],
	'row-r': ['display: flex', 'flex-direction: row-reverse'],
	'col-r': ['display: flex', 'flex-direction: column-reverse'],
	stack: ['display: flex', 'flex-direction: column'],
	cluster: ['display: flex', 'flex-direction: row', 'flex-wrap: wrap'],
	split: ['display: grid', 'grid-template-columns: 1fr 1fr'],
	center: ['margin-left: auto', 'margin-right: auto'],
	'grid-auto': ['display: grid', 'grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr))'],
	grid: ['display: grid'],
};

const isMarker = (t: string) => /^\/[a-zA-Z0-9]{1,3}\/$/.test(t) || t.startsWith('ctx:') || t.startsWith('env:') || t.startsWith('-');

// Declarations for one class, including the ones the compiler adds for layout properties
const declsFor = (cls: string): string[] => {
	const ast = compile(cls);
	const prop = ast.property || '';
	let decls: string[] = ast.modifiers || [];
	const implicit = IMPLICIT[prop] || [];
	// a later declaration of the same property overrides the implicit one (grid-auto:min-… etc.)
	const keys = new Set(decls.map((d) => d.split(':')[0].trim()));
	const out = [...implicit.filter((d) => !keys.has(d.split(':')[0].trim())), ...decls];
	if (ast.state) {
		const st = (Array.isArray(ast.state) ? ast.state : [ast.state]).join('+');
		return [`on ${st}: ${out.join('; ')}`];
	}
	return out;
};

// CSS summary for a whole class list, marking breakpoints
const cssForList = (list: string): string => {
	let bp = '';
	const parts: string[] = [];
	for (const t of list.split(/\s+/).filter(Boolean)) {
		if (/^\/[a-zA-Z0-9]{1,3}\/$/.test(t)) {
			bp = t.replace(/\//g, '');
			continue;
		}
		const d = declsFor(t).join('; ');
		parts.push(bp ? `from ${bp}: ${d}` : d);
	}
	return parts.join('; ');
};

// ---------------------------------------------------------------- verification log
const verified = new Set<string>();
const expectedFailures = new Set<string>();
const verifyClass = (cls: string, where: string) => {
	if (isMarker(cls)) return;
	const err = errorOf(cls);
	if (err) fail(`"${cls}" (${where}) does not compile:\n${err.split('\n').slice(0, 3).join('\n')}`);
	verified.add(cls);
};
const DISPLAY_SETTERS = new Set(['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'inline-grid', 'flow-root', 'contents', 'hidden', 'row', 'col', 'row-r', 'col-r', 'stack', 'cluster', 'split', 'grid', 'grid-auto']);
const verifyList = (list: string, where: string) => {
	// two display-setting classes before the same breakpoint fight each other
	let seen: string[] = [];
	for (const c of list.split(/\s+/).filter(Boolean)) {
		if (/^\/[a-zA-Z0-9]{1,3}\/$/.test(c)) { seen = []; continue; }
		const prop = c.startsWith('@') ? '' : c.split(':')[0];
		if (DISPLAY_SETTERS.has(prop)) {
			if (seen.length) fail(`${where}: "${seen[0]}" and "${c}" both set display in "${list}"`);
			seen.push(c);
		}
		verifyClass(c, where);
	}
};

// ---------------------------------------------------------------- token sections
const pxOf = (v: string) => (v.endsWith('rem') ? `${parseFloat(v) * 16}px` : v);
const code = (s: string) => '`' + s + '`';

function spacingSection() {
	const scales: Record<string, string[]> = { px: [], d: [], c: [], s: [] };
	for (const k of Object.keys(spacing)) (k === 'px' ? scales.px : scales[k[0]]).push(k);
	const row = (k: string) => `${code(k)} ${spacing[k]} (${pxOf(spacing[k])})`;
	// sanity checks for the short file's summary
	if (spacing.d0 !== '0.125rem' || spacing.d1 !== '0.25rem' || spacing.d4 !== '1rem' || spacing.d12 !== '3rem' || spacing.d13 !== '3.5rem')
		fail('spacing d-scale changed: update the summary in scripts/llms/short.md');
	if (spacing.c1 !== '4rem' || spacing.c13 !== '20rem' || spacing.s1 !== '24rem' || spacing.s13 !== '120rem')
		fail('spacing c/s range changed: update scripts/llms/short.md');
	return [
		'| Scale | Tokens |',
		'|---|---|',
		`| hairline | ${scales.px.map(row).join(', ')} |`,
		`| \`d\` detail | ${scales.d.map(row).join(', ')} |`,
		`| \`c\` content | ${scales.c.map(row).join(', ')} |`,
		`| \`s\` space | ${scales.s.map(row).join(', ')} |`,
		`| keywords | ${Object.entries(dimensionUtility).map(([k, v]) => `${code(k)} ${v}`).join(', ')} |`,
	].join('\n');
}

const STEPS = ['-4', '-3', '-2', '-1', '', '+1', '+2', '+3', '+4'];
const FAMILY_ORDER = ['indigo', 'blue', 'teal', 'green', 'yellow', 'orange', 'red', 'pink', 'purple', 'grey'];
function colorSection() {
	const C = colors as Record<string, string>;
	const fams = Object.keys(C).filter((k) => !/[+-]\d$/.test(k) && !['black', 'white', 'transparent'].includes(k));
	for (const f of fams) if (!FAMILY_ORDER.includes(f)) fail(`new color family "${f}": add it to FAMILY_ORDER`);
	for (const f of FAMILY_ORDER) for (const st of STEPS) if (!C[`${f}${st}`]) fail(`missing color ${f}${st}`);
	// contrast claim in the text: every base except yellow clears 4.5:1 on white
	const lum = (h: string) => {
		const [r, g, b] = [1, 3, 5].map((i) => {
			const c = parseInt(h.slice(i, i + 2), 16) / 255;
			return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const ratio = (a: string, b: string) => {
		const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
		return (x + 0.05) / (y + 0.05);
	};
	for (const f of FAMILY_ORDER) if (f !== 'yellow' && ratio(C[f], C.white) < 4.5) fail(`${f} base no longer clears 4.5:1 on white: fix the claim in full.md`);
	const head = '| Family | ' + STEPS.map((s) => (s ? code(s) : 'base')).join(' | ') + ' |';
	const sep = '|---|' + STEPS.map(() => '---').join('|') + '|';
	const rows = FAMILY_ORDER.map((f) => `| ${code(f)} | ` + STEPS.map((s) => C[`${f}${s}`]).join(' | ') + ' |');
	return [
		head,
		sep,
		...rows,
		'',
		`Neutrals: ${code('black')} ${C.black}, ${code('white')} ${C.white}, ${code('transparent')}.`,
		'',
		`Examples: ${code('text:indigo')} (base), ${code('bg-color:indigo+4')} (lightest tint), ${code('text:grey-4')} (near black), ${code('bd:grey+3')}.`,
	].join('\n');
}

const kv = (o: Record<string, string>) => Object.entries(o).map(([k, v]) => `${code(k)} ${v}`).join(', ');
function typeSection() {
	return [
		'| Kind | On | Tokens |',
		'|---|---|---|',
		`| Size | \`font\` | ${kv(typography.size)} |`,
		`| Weight | \`font\` | ${kv(typography.weight)} |`,
		`| Letter spacing | \`font\` | ${kv(typography.tracking)} |`,
		`| Family | \`font\` | ${Object.keys(typography.family).map(code).join(', ')} (system font stacks; add your own in typography.ts) |`,
		`| Line height | \`text\` | ${kv(typography.leading)} |`,
		`| Line length (max-width) | \`text\` | ${kv(typography.measure)} |`,
		`| Alignment | \`text\` | \`left\`, \`center\`, \`right\`, \`justify\` |`,
		`| Decoration | \`text\` | \`underline\`, \`overline\`, \`line-through\`, \`no-decoration\` (none), and combinations like \`underline-overline\` |`,
		`| Case, wrapping | \`format\` | \`uppercase\`, \`lowercase\`, \`capitalize\`; \`no-wrap\`, \`pre\`, \`pre-line\`, \`pre-wrap\`, \`break-spaces\`; \`all\` (break-all), \`keep\` (keep-all), \`word\`, \`break-word\`, \`anywhere\`; hyphens \`manual\`, \`auto\` |`,
	].join('\n');
}

function breakpointSection() {
	const rows = Object.entries(breakpoints as Record<string, string>).map(([k, v]) => `| \`/${k}/\` | ${v} (${pxOf(v)}) |`);
	return ['| Marker | Applies from |', '|---|---|', ...rows].join('\n');
}

function effectsSection() {
	const block = (title: string, prop: string, o: Record<string, string>, full = true) =>
		`**${title}** (${prop}):\n\n` + Object.entries(o).map(([k, v]) => `- ${code(k)}${full ? `: ${v}` : ''}`).join('\n');
	const aspect = R.AspectRule as Record<string, string>;
	const cursor = R.CursorRule as Record<string, string>;
	return [
		block('Box shadows', '`shadow:…`', effects.shadows),
		block('Text shadows', '`shadow:…` picks text-shadow for these', effects.textShadows),
		block('Gradients', '`gradient:…` sets `background`', effects.gradients),
		block('Transitions', '`transition:…`', effects.transitions),
		`**Background patterns** (\`pattern:name:bg-<color>:fg-<color>\`, drawn in the foreground color over the background color): ${Object.keys(effects.backgrounds).map(code).join(', ')}.`,
		`**Aspect ratios** (\`aspect:…\`): ${Object.entries(aspect).map(([k, v]) => `${code(k)} ${v}`).join(', ')}.`,
		`**Cursors** (\`cursor:…\`): ${Object.keys(cursor).map(code).join(', ')}.`,
		`**Contain** (\`contain\`): centered with side padding of ${Object.entries(contain as Record<string, string>).map(([bp, t]) => `${spacing[t]} from ${bp}`).join(', ')}.`,
	].join('\n\n');
}

// ---------------------------------------------------------------- properties
const KIND: Record<string, string> = {
	SpacingToken: '<spacing>',
	ColorToken: '<color>',
	FontSizeToken: '<font-size>',
	FontFamilyToken: '<font-family>',
	FontWeightToken: '<font-weight>',
	LetterSpacingToken: '<letter-spacing>',
	LineHeightToken: '<line-height>',
	MeasureToken: '<line-length>',
	ShadowToken: '<shadow>',
	TextShadowToken: '<text-shadow>',
	GradientToken: '<gradient>',
	TransitionToken: '<transition>',
	PatternToken: '<pattern>',
	NumericToken: '<number>',
	PassThroughToken: '(raw)',
	BreakPointToken: '<breakpoint>',
};
const printedRules = new Map<string, string>();
const describeSlot = (slot: string, prop: string): string => {
	if (['x', 'y'].includes(slot)) return Object.keys(R[slot === 'x' ? 'xAxis' : 'yAxis']).map(code).join(', ');
	if (['top', 'left', 'right', 'bottom'].includes(slot)) return `<spacing>, 1, 2 or 4 values (see sides)`;
	if (slot in KIND) return KIND[slot];
	if (slot in R) {
		const r = R[slot] as Record<string, string>;
		const keys = Object.keys(r);
		const pre = keys.filter((k) => k.endsWith('-'));
		if (pre.length) return pre.map((k) => `${code(k)}${KIND[r[k]] || r[k]}`).join(', ');
		// numbered track lists: say it as a range
		const track = keys[0]?.match(/^(cols|rows)-1$/);
		if (track) {
			const n = keys.filter((k) => /^(cols|rows)-\d+$/.test(k)).length;
			const t = track[1];
			return `${code(`${t}-1`)} … ${code(`${t}-${n}`)} (repeat(n, auto)), ${code(`${t}-1-fr`)} … ${code(`${t}-${n}-fr`)} (repeat(n, 1fr))`;
		}
		// long value lists are printed once; later properties point back to them
		if (keys.length > 12 && printedRules.has(slot)) return `same values as ${code(printedRules.get(slot)!)}`;
		if (keys.length > 12) printedRules.set(slot, prop);
		return keys.map((k) => (r[k] === k ? code(k) : `${code(k)} (${r[k]})`)).join(', ');
	}
	if (slot in T) return KIND[slot] || `<${slot}>`;
	return `always \`${slot}\``;
};

const CATEGORIES: [string, string[]][] = [
	['Layout and flex', ['row', 'col', 'row-r', 'col-r', 'child', 'stack', 'cluster', 'split', 'center', 'grid-auto', 'contain']],
	['Grid', ['grid', 'grid-template-areas', 'grid-area', 'col-spans', 'row-spans', 'col-spans-all', 'row-spans-all', 'auto-col', 'auto-row', 'auto-flow', 'items', 'content', 'align-self', 'justify-self', 'place-self', 'place', 'place-content']],
	['Display', ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'inline-grid', 'flow-root', 'contents', 'list-item', 'hidden', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'visible', 'invisible', 'collapse', 'content-visibility']],
	['Position', ['relative', 'absolute', 'fixed', 'sticky', 'static', 'initial', 'inherit', 'inset', 'top', 'right', 'bottom', 'left', 'z', 'float', 'clear', 'isolation']],
	['Spacing', ['pd', 'pd-x', 'pd-y', 'pd-t', 'pd-r', 'pd-b', 'pd-l', 'mg', 'mg-x', 'mg-y', 'mg-t', 'mg-r', 'mg-b', 'mg-l', 'gap', 'padding-inline', 'padding-inline-start', 'padding-inline-end', 'padding-block', 'padding-block-start', 'padding-block-end', 'margin-inline', 'margin-inline-start', 'margin-inline-end', 'margin-block', 'margin-block-start', 'margin-block-end', 'inset-inline', 'inset-inline-start', 'inset-inline-end', 'inset-block', 'inset-block-start', 'inset-block-end']],
	['Size', ['w', 'h', 'min-w', 'max-w', 'min-h', 'max-h', 'aspect', 'content-box', 'border-box', 'box-decoration-break']],
	['Typography', ['font', 'text', 'format', 'font-style', 'font-variant', 'font-stretch', 'text-indent', 'text-overflow', 'text-rendering', 'word-spacing', 'tab-size', 'writing-mode', 'direction', 'unicode-bidi', 'line-clamp', 'text-decoration-color', 'text-decoration-style', 'text-decoration-thickness', 'list-style-type', 'list-style-position', 'list-style-image', 'vertical']],
	['Borders and outline', ['bd', 'bd-t', 'bd-r', 'bd-b', 'bd-l', 'border-x', 'border-y', 'border-collapse', 'border-spacing', 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset', 'border-image-repeat', 'outline']],
	['Backgrounds and color', ['bg-color', 'bg-img', 'bg-attr', 'bg-exact', 'gradient', 'pattern', 'opacity', 'mix-blend-mode', 'background-blend-mode']],
	['Effects and motion', ['shadow', 'transition', 'transform', 'translate', 'scale', 'rotate', 'skew', 'origin', 'filter', 'backdrop-filter', 'animation', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode', 'animation-play-state']],
	['Overflow and scrolling', ['overflow', 'overflow-x', 'overflow-y', 'overscroll', 'overscroll-x', 'overscroll-y', 'scroll-behavior', 'scroll-snap-type', 'scroll-snap-align', 'scroll-margin', 'scroll-padding', 'scrollbar-width', 'scrollbar-color', 'scrollbar-gutter']],
	['Interaction and forms', ['cursor', 'events', 'select', 'resize', 'appearance', 'accent', 'caret']],
	['Media and SVG', ['fit', 'object-position', 'fill', 'stroke', 'stroke-width', 'table-layout', 'caption-side']],
	['Pseudo-element content', ['empty']],
	['Example custom property (from the starter config; remove or replace it in your project)', ['brand']],
];

function propertiesSection() {
	const listed = CATEGORIES.flatMap(([, p]) => p);
	const missing = Object.keys(DM).filter((p) => !listed.includes(p));
	if (missing.length) fail(`properties missing from CATEGORIES: ${missing.join(', ')}`);
	const extra = listed.filter((p) => !(p in DM));
	if (extra.length) fail(`CATEGORIES lists unknown properties: ${extra.join(', ')}`);

	const special: Record<string, string> = {
		stack: 'standalone, or with values',
		cluster: 'standalone, or with values',
		split: 'standalone, or with values',
		center: 'standalone, or with values',
		'grid-auto': 'standalone, or with `min-<spacing>`, `gap-<spacing>`, `fit`, `fill`',
		contain: 'standalone; generated globally',
		row: 'standalone, or with values',
		col: 'standalone, or with values',
		'row-r': 'standalone, or with values',
		'col-r': 'standalone, or with values',
		grid: 'standalone, or with values',
	};
	const out: string[] = [];
	for (const [title, props] of CATEGORIES) {
		out.push(`#### ${title}`, '', '| Property | Writes | Accepts |', '|---|---|---|');
		for (const p of props) {
			const decl = DM[p];
			const entries = Object.entries(decl);
			const implicit = IMPLICIT[p];
			if (p === 'contain') {
				out.push(`| \`contain\` | margin auto, responsive padding-left/right | ${special.contain} |`);
				continue;
			}
			if (p === 'grid-auto') {
				out.push(`| \`grid-auto\` | ${IMPLICIT['grid-auto'].join('; ')} | ${special['grid-auto']} |`);
				continue;
			}
			const isLiteral = (v: string) => !['x', 'y', 'top', 'left', 'right', 'bottom'].includes(v) && !(v in KIND) && !(v in R) && !(v in T);
			const literal = entries.filter(([, v]) => isLiteral(v));
			const slots = entries.filter(([, v]) => !isLiteral(v));
			if (implicit) out.push(`| \`${p}\` | ${implicit.join('; ')} | ${special[p] || 'standalone'} |`);
			if (!slots.length && !implicit) {
				out.push(`| \`${p}\` | ${literal.map(([c, v]) => `${c}: ${v}`).join('; ')} | standalone |`);
				continue;
			}
			slots.forEach(([cssProp, slot], i) => {
				const name = i === 0 && !implicit ? `\`${p}\`` : '';
				out.push(`| ${name} | ${cssProp} | ${describeSlot(slot, p)} |`);
			});
		}
		out.push('');
	}
	return out.join('\n');
}

function passthroughList() {
	return Object.entries(DM)
		.filter(([, d]) => Object.values(d).includes('PassThroughToken'))
		.map(([p]) => code(p))
		.join(', ');
}

function axesSection() {
	const x = R.xAxis as Record<string, string>;
	const y = R.yAxis as Record<string, string>;
	return [
		'| Value | Horizontal (`x-…`) | Vertical (`y-…`) |',
		'|---|---|---|',
		...Object.keys(x).map((k) => {
			const s = k.slice(2);
			return `| ${s} | ${code(k)} (${x[k]}) | ${code('y-' + s)} (${y['y-' + s]}) |`;
		}),
	].join('\n');
}

// ---------------------------------------------------------------- Tailwind table
const TAILWIND: [string, string][] = [
	['p-4', 'pd:d4'],
	['px-6 py-3', 'pd:d6:d3'],
	['pt-2', 'pd-t:d2'],
	['mx-auto', 'mg-x:auto'],
	['mt-8', 'mg-t:d8'],
	['space-y-4 (on a flex column)', 'col gap:d4'],
	['flex items-center justify-between', 'row:x-between:y-center'],
	['flex flex-col items-center', 'col:x-center'],
	['inline-flex items-center gap-2', 'inline-flex items:align-center gap:d2'],
	['flex-wrap', 'row:wrap'],
	['flex-1', 'child:grow'],
	['shrink-0', 'child:no-shrink'],
	['grid grid-cols-3 gap-6', 'grid:cols-3-fr:gap-d6'],
	['col-span-2', 'col-spans:from-1:to-3'],
	['w-full', 'w:full'],
	['max-w-prose', 'text:blog'],
	['max-w-3xl', 'max-w:s6'],
	['h-screen', 'h:hScreen'],
	['size-12', 'w:d12 h:d12'],
	['text-sm', 'font:small'],
	['text-xl font-bold', 'font:h5:bold'],
	['text-4xl font-semibold tracking-tight', 'font:h2:semibold:tight'],
	['font-mono', 'font:mono'],
	['text-gray-500', 'text:grey'],
	['text-white text-center', 'text:white:center'],
	['leading-relaxed', 'text:relaxed'],
	['uppercase tracking-wide', 'format:uppercase font:wide'],
	['truncate', 'overflow:hidden format:no-wrap text-overflow:ellipsis'],
	['underline', 'text:underline'],
	['bg-white', 'bg-color:white'],
	['bg-indigo-500', 'bg-color:indigo'],
	['bg-indigo-50', 'bg-color:indigo+4'],
	['bg-gradient-to-br from-indigo-500 to-pink-500', 'gradient:aurora'],
	['rounded-lg', 'bd:round-d3'],
	['rounded-full (on a square)', 'bd:round-full'],
	['border border-gray-200', 'bd:width-px:solid:grey+3'],
	['border-b', 'bd-b:width-px:solid:grey+3'],
	['shadow-md', 'shadow:lifted'],
	['ring-2 ring-indigo-500', 'outline:d0:solid:indigo'],
	['opacity-50', 'opacity:0.5'],
	['transition', 'transition:medium'],
	['hover:bg-indigo-600', '@hover:[bg-color:indigo-1]'],
	['focus-visible:ring-2', '@focus-visible:[outline:d0:solid:indigo:off-d1]'],
	['disabled:opacity-50', '@disabled:[opacity:0.5]'],
	['md:flex-row', '/md/ row'],
	['hidden md:block', 'hidden /md/ block'],
	['absolute inset-0', 'absolute inset:0'],
	['sticky top-0 z-10', 'sticky top:0 z:10'],
	['overflow-hidden', 'overflow:hidden'],
	['aspect-video object-cover', 'aspect:video fit:cover'],
	['cursor-pointer select-none', 'cursor:pointer select:none'],
	['pointer-events-none', 'events:none'],
	['backdrop-blur', 'backdrop-filter:(blur(8px))'],
	['-translate-y-1', 'translate:(0_-0.25rem)'],
	['bg-[url(/hero.jpg)] bg-cover bg-center', 'bg-img:(url(/hero.jpg)) bg-attr:cover:center'],
];
function tailwindSection() {
	const rows = TAILWIND.map(([tw, el]) => {
		verifyList(el, `Tailwind row ${tw}`);
		return `| \`${tw}\` | \`${el}\` | ${cssForList(el)} |`;
	});
	return ['| Tailwind | Elevate | CSS |', '|---|---|---|', ...rows].join('\n');
}

// ---------------------------------------------------------------- errors
const ERRORS: [string, string][] = [
	['gap:d99', 'Not a token. Use one from the spacing table (d0 to d13, c1 to c13, s1 to s13).'],
	['text:indgo', 'A typo, or a token that doesn’t exist. Check the color table.'],
	['pd:4', 'Sides take spacing tokens, never numbers. Write pd:d4.'],
	['p-4', 'Not an Elevate property: this is Tailwind. Write pd:d4.'],
	['pading:d4', 'A misspelled property.'],
	['text:h4', 'The value exists but belongs to another property. Font size is on font: font:h4.'],
	['w:(300px)', 'Only pass-through properties take raw values. Use a spacing token: w:s1 is 24rem.'],
	['bg-color:(#fff)', 'Colors are tokens only. Use bg-color:white, or add the color to the design system.'],
	['bd:width-d99', 'The prefix is right but the token after it isn’t.'],
	['bd', 'A compound property on its own. Give it values: bd:width-px:solid:grey+3.'],
	['@child+desc:[text:white]', 'Two combinators in one chain. Use one.'],
	['row;', 'A character the grammar doesn’t allow, usually pasted from CSS.'],
];
function errorsSection() {
	return ERRORS.map(([bad, fix]) => {
		const err = errorOf(bad);
		if (!err) fail(`expected "${bad}" to fail, but it compiled`);
		expectedFailures.add(bad);
		const first = err!.split('\n').map((l) => l.trim()).find(Boolean)!;
		return `- \`${bad}\`\n  \`${first}\`\n  ${fix}`;
	}).join('\n') + '\n\nOther messages: "Invalid State Chain" (two pseudo-elements in one chain), "Combinator directive requires an active ctx scope" (a combinator outside a scope or envelope), "Env Conflict" (one envelope name defined twice with different classes), and "Invalid state block with spaces" (a space inside `@…:[…]`; use `_`).';
}

// ---------------------------------------------------------------- recipes
const RECIPES: { title: string; note?: string; html: string }[] = [
	{
		title: 'Page shell',
		html: `<body class="font:sans text:grey-4 bg-color:white">
  <header class="sticky top:0 z:10 bg-color:white bd-b:width-px:solid:grey+3">
    <div class="contain row:x-between:y-center pd-y:d4">
      <a class="font:h6:bold:tight text:grey-4" href="/">Brand</a>
      <nav class="hidden /md/ row:y-center gap:d6">
        <a class="font:small:medium text:grey-1 transition:fast @hover:[text:grey-4]" href="/docs">Docs</a>
        <a class="font:small:medium text:grey-1 transition:fast @hover:[text:grey-4]" href="/blog">Blog</a>
      </nav>
    </div>
  </header>
  <main class="contain pd-y:c2">…</main>
</body>`,
	},
	{
		title: 'Buttons',
		note: 'Browsers give buttons a border and background; `bd:none` and a `bg-color` replace them.',
		html: `<button class="inline-flex items:align-center gap:d2 pd:d5:d3 bd:none:round-d3 bg-color:indigo text:white font:small:semibold cursor:pointer transition:snappy @hover:[bg-color:indigo-1] @focus-visible:[outline:d0:solid:indigo:off-d1] @disabled:[opacity:0.5_cursor:not-allowed]">Save changes</button>

<button class="pd:d5:d3 bd:width-px:solid:grey+3:round-d3 bg-color:white text:grey-4 font:small:semibold cursor:pointer transition:snappy @hover:[bg-color:grey+4]">Cancel</button>

<button class="pd:d4:d2 bd:none bg-color:transparent text:indigo font:small:semibold cursor:pointer @hover:[text:indigo-2:underline]">Learn more</button>`,
	},
	{
		title: 'Card that lifts on hover',
		html: `<article class="col gap:d3 pd:d6 bg-color:white bd:width-px:solid:grey+3:round-d4 shadow:subtle transition:snappy @hover:[shadow:lifted]">
  <img class="w:full aspect:video fit:cover bd:round-d3" src="/cover.jpg" alt="">
  <p class="font:eyebrow:semibold:wider format:uppercase text:indigo">Guide</p>
  <h3 class="font:h5:semibold:tight text:grey-4">Build a design system</h3>
  <p class="text:grey-1:relaxed">Tokens, rules and a compiler that checks every class.</p>
</article>`,
	},
	{
		title: 'Responsive hero',
		html: `<section class="col gap:d8 pd-y:c2 /md/ row:y-center gap:c1 /lg/ pd-y:c5">
  <div class="col gap:d5 /md/ child:grow">
    <h1 class="font:h1:bold:extra-tight text:grey-4:hug">Ship the system, not the guesswork.</h1>
    <p class="font:h6 text:grey-1:relaxed:brief">Every class is checked against your tokens before it ships.</p>
    <div class="cluster:gap-d3">
      <a class="pd:d6:d3 bd:round-c1 bg-color:grey-4 text:white font:small:semibold" href="/start">Get started</a>
      <a class="pd:d6:d3 bd:width-px:solid:grey+3:round-c1 text:grey-4 font:small:semibold" href="/docs">Read the docs</a>
    </div>
  </div>
  <img class="w:full aspect:square fit:cover bd:round-d6 /md/ w:s1" src="/hero.jpg" alt="">
</section>`,
	},
	{
		title: 'Card grid',
		note: 'Two ways: columns that add themselves as the screen grows, or explicit columns per breakpoint.',
		html: `<div class="grid-auto:min-c12:gap-d6">…cards…</div>

<div class="grid:cols-1-fr:gap-d4 /md/ grid:cols-2-fr /lg/ grid:cols-3-fr:gap-d6">…cards…</div>`,
	},
	{
		title: 'Form field',
		html: `<label class="col gap:d2">
  <span class="font:small:medium text:grey-3">Email</span>
  <input class="w:full pd:d4:d3 bd:width-px:solid:grey+2:round-d3 bg-color:white text:grey-4 font:base transition:fast @placeholder:[text:grey+1] @focus:[bd:indigo_outline:d0:solid:indigo+3]" type="email" placeholder="you@example.com">
  <span class="font:tiny text:grey">We'll never share it.</span>
</label>`,
	},
	{
		title: 'Avatar, badge and media row',
		note: '`min-w:0` lets the middle column shrink so its text can truncate; without it, a flex child is never narrower than its content.',
		html: `<div class="row:y-center gap:d4">
  <img class="w:d12 h:d12 bd:round-full fit:cover child:no-shrink" src="/me.jpg" alt="">
  <div class="col gap:d1 child:grow min-w:0">
    <p class="font:base:semibold text:grey-4">Ada Lovelace</p>
    <p class="font:small text:grey overflow:hidden format:no-wrap text-overflow:ellipsis">Wrote the first program, and a long bio that truncates.</p>
  </div>
  <span class="pd:d3:d1 bd:round-c1 bg-color:green+4 text:green-2 font:tiny:semibold">Active</span>
</div>`,
	},
	{
		title: 'Image with a readable caption',
		html: `<figure class="relative overflow:hidden bd:round-d4">
  <img class="w:full aspect:video fit:cover" src="/city.jpg" alt="">
  <figcaption class="absolute inset:0 col:y-end pd:d6 gradient:fadetoblack text:white shadow:soft-text font:h5:semibold">Lisbon at dusk</figcaption>
</figure>`,
	},
	{
		title: 'Modal backdrop',
		html: `<div class="fixed inset:0 z:50 col:x-center:y-center pd:d4 backdrop-filter:(blur(6px))">
  <div class="absolute inset:0 bg-color:grey-4 opacity:0.5"></div>
  <div class="relative w:full max-w:s1 pd:d8 bg-color:white bd:round-d6 shadow:floating">…</div>
</div>`,
	},
	{
		title: 'Scoped component with relational styles',
		note: 'The scope starts at `ctx:menu` and ends at `ctx:end:menu`, in file order. `@children` styles every direct child; `@child+hover` styles a matching child on hover.',
		html: `<ul class="ctx:menu col list-style-type:none bd:width-px:solid:grey+3:round-d3 @children:[pd:d4:d3_bd-b:width-px:solid:grey+4]">
  <li class="@child+hover:[bg-color:grey+4]">Profile</li>
  <li class="@child+hover:[bg-color:grey+4]">Settings</li>
  <li class="@child+hover:[bg-color:grey+4] ctx:end:menu">Sign out</li>
</ul>`,
	},
	{
		title: 'Decorative pseudo-element',
		html: `<h2 class="relative font:h3:bold @after:[empty_absolute_left:0_bottom:0_w:c1_h:d1_bg-color:indigo_bd:round-d1]">Section title</h2>`,
	},
	{
		title: 'Keeping a non-Elevate class',
		html: `<div class="-swiper-wrapper row gap:d4">…</div>`,
	},
];
function recipesSection() {
	return RECIPES.map((r) => {
		for (const m of r.html.matchAll(/class="([^"]*)"/g)) verifyList(m[1], `recipe "${r.title}"`);
		return `### ${r.title}\n\n${r.note ? r.note + '\n\n' : ''}\`\`\`html\n${r.html}\n\`\`\``;
	}).join('\n\n');
}

// ---------------------------------------------------------------- inline examples in the hand-written text
// Inline code that looks like an Elevate class must compile, unless it's listed
// here as a deliberate counterexample (and then it must fail).
const COUNTEREXAMPLES = new Set([
	'pd:4', 'text:h4', 'font:grey-3', 'mg:-d2', 'w:(300px)', 'bg-color:(#fff)', 'md:row', 'pd:d99', 'gap:d99', 'text:indgo',
	'@child:[@hover:[…]]', 'bd:width-d99', 'text:indgo)',
]);
// Classes that only exist after the reader extends the system (section 14)
const HYPOTHETICAL = new Set(['bg-color:popgreen']);
const PLACEHOLDERS = new Set(['property:value:value', 'property:value…', '@state:[class_class_class]', 'pattern:name:bg-<color>:fg-<color>', 'grid-auto:min-…']);
function checkInline(text: string, where: string) {
	for (const m of text.matchAll(/`([^`\n]+)`/g)) {
		const span = m[1];
		if (PLACEHOLDERS.has(span) || HYPOTHETICAL.has(span) || /: |;|[<>{}$|=]|https?:|\.ts$|\.css$|\.json$|^npm |^npx |^\.|^:|\\/.test(span)) continue;
		const tokens = span.split(/\s+/);
		// bare directive names like `@child` or `@hover+focus` are prose, not classes
		if (tokens.length === 1 && span.startsWith('@') && !span.includes(':[')) continue;
		// only class lists: every token has a colon, or is a known standalone/marker, or starts with @ or -
		const looksLikeClasses = tokens.every((t) => t.includes(':') || t.startsWith('@') || /^\/[a-z0-9]{1,3}\/$/.test(t) || (t in DM && !/^(x|y)-/.test(t)));
		if (!looksLikeClasses || !tokens.some((t) => t.includes(':') || t.startsWith('@'))) continue;
		if (span.includes('…')) {
			// elided examples: check only the complete tokens
			tokens.filter((t) => !t.includes('…')).forEach((t) => (COUNTEREXAMPLES.has(t) ? null : verifyClass(t, where)));
			continue;
		}
		for (const t of tokens) {
			if (COUNTEREXAMPLES.has(t)) {
				if (!errorOf(t)) fail(`counterexample "${t}" compiles now: update the text in ${where}`);
				expectedFailures.add(t);
				continue;
			}
			verifyClass(t, where);
		}
	}
	// class attributes inside html blocks
	for (const m of text.matchAll(/class="([^"]*)"/g)) {
		const list = m[1].split(/\s+/).filter((t) => t && !t.includes('…'));
		list.forEach((t) => verifyClass(t, `${where} (html)`));
	}
}

// ---------------------------------------------------------------- assemble
const listOf = (o: Record<string, unknown>) => Object.keys(o).map(code).join(', ');
const fill = (tpl: string, map: Record<string, string>) =>
	tpl.replace(/\{\{([A-Z]+)\}\}/g, (_, k) => {
		if (!(k in map)) fail(`unknown placeholder {{${k}}}`);
		return map[k];
	});

const fullTpl = fs.readFileSync(path.join(here, 'llms/full.md'), 'utf8');
const shortTpl = fs.readFileSync(path.join(here, 'llms/short.md'), 'utf8');
checkInline(fullTpl, 'full.md');
checkInline(shortTpl, 'short.md');

const full = fill(fullTpl, {
	VERSION: `v${VERSION}`,
	SPACING: spacingSection(),
	COLORS: colorSection(),
	TYPE: typeSection(),
	PASSTHROUGH: passthroughList(),
	AXES: axesSection(),
	BREAKPOINTS: breakpointSection(),
	PROPERTIES: propertiesSection(),
	EFFECTS: effectsSection(),
	ERRORS: errorsSection(),
	TAILWIND: tailwindSection(),
	RECIPES: recipesSection(),
});
const short = fill(shortTpl, {
	VERSION: `v${VERSION}`,
	FAMILIES: FAMILY_ORDER.map(code).join(', '),
	SIZES: listOf(typography.size),
	WEIGHTS: listOf(typography.weight),
	FAMILIESFONT: listOf(typography.family),
	LEADING: listOf(typography.leading),
	TRACKING: listOf(typography.tracking),
	MEASURE: listOf(typography.measure),
	SHADOWS: listOf(effects.shadows),
	TEXTSHADOWS: listOf(effects.textShadows),
	GRADIENTS: listOf(effects.gradients),
	TRANSITIONS: listOf(effects.transitions),
	BPS: Object.entries(breakpoints as Record<string, string>).map(([k, v]) => `\`/${k}/\` ${pxOf(v)}`).join(', '),
});

fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/llms-full.txt'), full);
fs.writeFileSync(path.join(root, 'public/llms.txt'), short);
console.log(`✓ llms.txt ${short.length.toLocaleString()} chars, llms-full.txt ${full.length.toLocaleString()} chars`);
console.log(`✓ ${verified.size} distinct classes compiled, ${expectedFailures.size} counterexamples fail as they should`);
