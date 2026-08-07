import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const languageOptions = {
	globals: {
		...globals.browser,
		...globals.node,
	},
};

export default defineConfig([
	{
		ignores: ['.astro/**', 'dist/**'],
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		extends: [js.configs.recommended],
		languageOptions,
	},
	{
		files: ['**/*.{ts,mts,cts}'],
		extends: [js.configs.recommended, tseslint.configs.recommended],
		languageOptions,
	},
	{
		files: ['**/*.astro'],
		extends: [js.configs.recommended, tseslint.configs.recommended, eslintPluginAstro.configs.recommended],
		languageOptions: {
			...languageOptions,
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
]);
