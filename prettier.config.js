'use strict';

/**
 * @type { import('prettier').Config }
 */
const config = {
	printWidth: Number.POSITIVE_INFINITY,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	htmlWhitespaceSensitivity: 'ignore',
	plugins: ['prettier-plugin-astro'],
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
