// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeElevateTokens from './src/plugins/rehype-elevate-tokens.mjs';

// https://astro.build/config
export default defineConfig({
	markdown: {
		rehypePlugins: [rehypeElevateTokens],
	},
	integrations: [
		starlight({
			components: {
				ThemeProvider: './src/components/AlwaysLightThemeProvider.astro',
				ThemeSelect: './src/components/NoThemeSelect.astro',
				Hero: './src/components/HomeHero.astro',
				PageTitle: './src/components/PageTitle.astro',
			  },
			title: 'Elevate',
			favicon: '/favicon.svg',
			logo: {
				src: './src/assets/mark.svg',
			},
			customCss: [
				// Relative path to your custom CSS file
				'@fontsource-variable/instrument-sans/standard.css',
				'@fontsource-variable/geist-mono/index.css',
				'./src/styles/elevate.css',
				'./src/styles/theme.css',

			  ],
			expressiveCode: {
				themes: ['github-light'],
				// Shell snippets use the same plain frame as every other block
				defaultProps: { overridesByLang: { 'bash,sh,shell': { frame: 'none' } } },
				styleOverrides: {
					borderRadius: '16px',
					borderColor: 'transparent',
					codeBackground: '#f5f5f7',
					codeFontFamily: "'Geist Mono Variable', ui-monospace, monospace",
					codeFontSize: '0.875rem',
					codeLineHeight: '1.7',
					uiFontFamily: "'Instrument Sans Variable', system-ui, sans-serif",
					frames: {
						frameBoxShadowCssValue: 'none',
						editorTabBarBackground: '#ebebf0',
						editorActiveTabBackground: '#f5f5f7',
						editorActiveTabIndicatorTopColor: 'transparent',
						editorActiveTabIndicatorBottomColor: 'transparent',
						editorTabBarBorderBottomColor: 'transparent',
						terminalTitlebarBackground: '#ebebf0',
						terminalBackground: '#f5f5f7',
					},
				},
			},
			social: {
				github: 'https://github.com/DesignInTheBlack/Elevate',
			},
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Getting started', slug: 'guides/2-getting-started' },
						{ label: 'Playground', slug: 'playground' },
						{ label: 'Why Elevate', slug: 'guides/2-why-elevate' },
						{ label: 'Configuration', slug: 'guides/3-configuration' },
					],
				},
				{
					label: 'Core ideas',
					items: [
						{ label: 'Layout', slug: 'guides/layout' },
						{ label: 'States and selectors', slug: 'reference/supported-selectors' },
						{ label: 'Scopes and specificity', slug: 'guides/3-specificity' },
						{ label: 'Envelopes', slug: 'guides/4-env-aliases' },
					],
				},
				{
					label: 'Design tokens',
					autogenerate: { directory: 'default' },
				},
				{
					label: 'Properties',
					autogenerate: { directory: 'css' },
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Token types', slug: 'reference/system-token-types' },
						{ label: 'Troubleshooting', slug: 'reference/troubleshooting' },
					],
				},
			],
		}),
	],
});
