'use strict';

/**
 * @type { import('prettier').Config }
 */
module.exports = {
	printWidth: Number.POSITIVE_INFINITY,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	plugins: [require.resolve('prettier-plugin-astro')],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};
