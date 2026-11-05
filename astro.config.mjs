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
			  },
			title: 'Utility First, Design Driven',
			favicon: './src/assets/dark.svg',
			logo: {
				light: './src/assets/light.svg',
				dark: './src/assets/dark.svg',
				replacesTitle: true,
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
				styleOverrides: {
					borderRadius: '14px',
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
				discord: 'https://discord.gg/T3X2vBYA',
				github: 'https://github.com/DesignInTheBlack/Elevate',
			},
			sidebar: [
				{
					label: 'Learning Elevate',
					items: [
						// Each item here is one entry in the navigation menu.
					{ label: 'Getting Started', slug: 'guides/2-getting-started' },
					{ label: 'Why Elevate?', slug: 'guides/2-why-elevate' },
					{ label: 'Configuration', slug: 'guides/3-configuration' },
					{ label: 'Specificity', slug: 'guides/3-specificity' },
					{ label: 'Layout', slug: 'guides/layout' },
					{ label: 'Envelopes', slug: 'guides/4-env-aliases' },
				],
			},
				{
					label: `Designed Defaults`,
					autogenerate: { directory: 'default' },
				},
				{
					label: 'Writing Elevate',
					autogenerate: { directory: 'css' },
				},
				{
					label: 'Further Reading',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
