# Nocturne

A demo page for a fictional night train from Lisbon to Paris. An AI built it using only [llms-full.txt](https://elevate-docs.pages.dev/llms-full.txt), and every class on it went through the Elevate compiler.

**See it live:** [elevate-docs.pages.dev/showcase/nocturne/](https://elevate-docs.pages.dev/showcase/nocturne/)

## Files

- [`index.html`](../../public/showcase/nocturne/index.html) is the page. Every class is Elevate.
- [`design/nocturne.ts`](design/nocturne.ts) adds the fonts, sizes, colors and gradients.
- [`rules/nocturne-rules.ts`](rules/nocturne-rules.ts) adds two properties, `numerals` and `text-wrap`.
- [`config/`](config/) shows how those are wired into the design system and syntax.
- [`extend/motion.css`](extend/motion.css) holds the keyframes and the reduced-motion rule, the only hand-written CSS.

To rebuild it, start a project with `npx elevate-framework prepare`, copy these files into its `elevate/` folder, put `index.html` in `elevate/templates/`, and run `npm run elevate`.
