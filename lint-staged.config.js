export default {
	'*.{js,ts,astro}': ['eslint --fix --max-warnings 0', 'prettier --write'],
	'*.vue': 'prettier --write',
	'*.css': 'prettier --write',
	'*.{json,md,yml,yaml}': 'prettier --write',
};
