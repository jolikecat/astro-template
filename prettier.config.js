'use strict';

/**
 * @type { import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions }
 */
const config = {
	printWidth: Number.POSITIVE_INFINITY,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	tailwindStylesheet: './src/assets/styles/global.css',
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};

export default config;
