// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Utility First, Design Driven',
			favicon: './src/assets/dark.svg',
			logo: {
				light: './src/assets/light.svg',
				dark: './src/assets/dark.svg',
				replacesTitle: true,
			  },
			customCss: [
				// Relative path to your custom CSS file
				'./src/styles/custom.css',
				'@fontsource-variable/raleway/index.css',
				'./src/styles/elevate.css',

			  ],
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
						{ label: 'Configuration', slug: 'guides/3-configuration' },
						{ label: 'Specificity', slug: 'guides/3-specificity' },
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
