# Elevate

> Elevate ({{VERSION}}, beta) is a compile-time CSS framework. Classes like `pd:d4`, `row:x-between:y-center` and `@hover:[bg-color:indigo]` compile into one `elevate.css`. Every value must be a design token; anything else stops the build with the file, line and reason.

This is the short version. For every property, every token, the exact error messages and copyable patterns, read the full reference: https://elevate-docs.pages.dev/llms-full.txt

## Syntax in one minute

- A class is `property:value:value`. One property, then values joined by colons: `text:white:center`, `bd:width-px:solid:grey+3:round-d3`. Value order doesn't matter, except for spacing sides.
- Some properties stand alone: `block`, `hidden`, `relative`, `absolute`, `row`, `col`, `grid`, `contain`.
- There are no Tailwind classes. `p-4`, `flex-col`, `text-sm`, `items-center`, `rounded`, `bg-blue-500` all fail.
- Values are tokens, never raw CSS: no `px`, `rem`, hex or bare numbers. Numbers are only for `z:10`, `opacity:0.5`, `line-clamp:3`, `tab-size:4` and `child:order-2`.
- Raw CSS only on pass-through properties, in parentheses with `_` for spaces: `bg-img:(url(/a.jpg))`, `transform:(translateY(-2px))`, `backdrop-filter:(blur(12px))`, `grid-template-areas:('a_b'_'c_d')`.
- Plain, non-Elevate classes must start with `-`: `-js-toggle`.

## Tokens

- Spacing: `px` (1px), `d0`–`d13` (0.125rem, 0.25rem, then 4px steps to 3rem, then 3.5rem), `c1`–`c13` (4rem to 20rem), `s1`–`s13` (24rem to 120rem), plus `0`, `auto`, `full` (100%), `wScreen`, `hScreen`, `min-content`, `max-content`, `fit-content`. `d4` = 1rem.
- Colors: {{FAMILIES}}, each with steps `-4`…`-1` (darker), base, `+1`…`+4` (lighter): `indigo-2`, `indigo`, `indigo+3`. Plus `black`, `white`, `transparent`.
- Font sizes: {{SIZES}}. Weights: {{WEIGHTS}}. Families: {{FAMILIESFONT}}.
- Line height (on `text`): {{LEADING}}. Letter spacing (on `font`): {{TRACKING}}. Line length (on `text`): {{MEASURE}}.
- Shadows: {{SHADOWS}}. Text shadows: {{TEXTSHADOWS}}. Gradients: {{GRADIENTS}}. Transitions: {{TRANSITIONS}}.
- Breakpoints: {{BPS}}.

## The properties you'll use most

| Need | Write |
|---|---|
| Padding / margin | `pd:d4`, `pd:d6:d3` (x, y), `pd-x:d4`, `pd-t:d2`, `mg-x:auto`, `mg-b:d6` |
| Flex | `row:x-between:y-center`, `col:x-center`, `row:wrap`, `gap:d4`, `child:grow`, `child:no-shrink` |
| Grid | `grid:cols-3-fr:gap-d6`, `grid-auto:min-c10:gap-d4`, `col-spans:from-1:to-3` |
| Layout shortcuts | `stack:gap-d4`, `cluster:gap-d2:align-center`, `split:ratio-2-1:gap-d6`, `center:max-s8`, `contain` |
| Size | `w:full`, `max-w:s8`, `h:c4`, `min-h:hScreen`, `aspect:video`, `fit:cover` |
| Font | `font:h3:bold:tight` (size, weight, tracking), `font:sans` |
| Text | `text:grey-3:center:relaxed:blog` (color, align, line height, max line length), `text:underline` |
| Text formatting | `format:uppercase`, `format:no-wrap`, `text-overflow:ellipsis` |
| Background | `bg-color:indigo+4`, `gradient:aurora`, `bg-img:(url(/a.jpg)) bg-attr:cover:center` |
| Border | `bd:width-px:solid:grey+3:round-d3`, `bd-b:width-px:solid:grey+3`, `bd:round-full` |
| Effects | `shadow:lifted`, `opacity:0.6`, `transition:snappy`, `transform:(scale(1.02))` |
| Position | `relative`, `absolute inset:0`, `sticky top:0 z:10` |
| Display | `block`, `hidden`, `inline-flex` |

`font` is size, family, weight and letter spacing. `text` is color, line height, line length, alignment and decoration. `format` is case, white-space and word breaking.

## Responsive, states, scopes

- Breakpoints are markers: `col gap:d4 /md/ row gap:d8`. A marker applies to every class after it, from that width up (mobile first).
- States: `@hover:[bg-color:indigo-1_text:white]`. Classes inside are joined with `_`, never spaces. Chain with `+`: `@hover+focus-visible:[…]`. Pseudo-elements: `@before:[empty_absolute_inset:0]`.
- Scopes: `ctx:card` … `ctx:end:card` raise specificity for the classes between them (in file order). Inside a scope, combinators style relatives: `@child+hover:[…]`, `@children:[…]`, `@siblings:[…]`, `@ancestor:[…]`.
- Envelopes: `env:card` saves a class list under a name. The compiler rewrites source files when it sees one, so don't add envelopes unless asked.

## Example

```html
<body class="font:sans text:grey-4 bg-color:white">
  <article class="col gap:d3 pd:d6 bg-color:white bd:width-px:solid:grey+3:round-d4 shadow:subtle transition:snappy @hover:[shadow:lifted] /md/ row:y-center gap:d6">
    <img class="w:c4 aspect:square bd:round-d3 fit:cover" src="/a.jpg" alt="">
    <div class="col gap:d1">
      <h3 class="font:h5:semibold:tight">Title</h3>
      <p class="text:grey-1:relaxed">One line of supporting copy.</p>
    </div>
  </article>
</body>
```

## Docs

- [Full reference for AI](https://elevate-docs.pages.dev/llms-full.txt): every property, token, error and pattern, generated from the source
- [Getting started](https://elevate-docs.pages.dev/guides/2-getting-started/): install, class anatomy, responsive classes, states
- [Layout](https://elevate-docs.pages.dev/guides/layout/): stack, cluster, split, center, grid-auto, contain
- [States and selectors](https://elevate-docs.pages.dev/reference/supported-selectors/): pseudo-classes, pseudo-elements, combinators
- [Scopes and specificity](https://elevate-docs.pages.dev/guides/3-specificity/)
- [Envelopes](https://elevate-docs.pages.dev/guides/4-env-aliases/)
- [Configuration](https://elevate-docs.pages.dev/guides/3-configuration/): adding tokens, rules and properties
- [Troubleshooting](https://elevate-docs.pages.dev/reference/troubleshooting/): every build error
- [Playground](https://elevate-docs.pages.dev/playground/): try classes in the browser with the real compiler

## Optional

- [Colors](https://elevate-docs.pages.dev/default/colors/), [Spacing](https://elevate-docs.pages.dev/default/spacing/), [Typography](https://elevate-docs.pages.dev/default/text/), [Shadows](https://elevate-docs.pages.dev/default/shadow/), [Breakpoints](https://elevate-docs.pages.dev/default/breakpoints/)
