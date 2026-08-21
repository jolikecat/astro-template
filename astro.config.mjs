import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const assetFileNames = (assetInfo) => {
	const assetName = assetInfo.names?.[0] ?? assetInfo.name ?? '';
	const extension = path.extname(assetName);
	let directory = extension.slice(1);
	let fileName = '[name]';

	if (extension === '.css') {
		directory = 'styles';
		fileName = path.basename(assetName, extension).replace(/@_@astro$/, '');
	}

	return `assets/${directory}/${fileName}[extname]`;
};
export default defineConfig({
	site: 'https://example.com/',
	compressHTML: false,
	session: false,
	build: {
		format: 'preserve',
		assets: 'assets',
	},
	experimental: {
		incrementalBuild: true,
	},
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve('./src'),
			},
		},
		build: {
			assetsInlineLimit: 0,
			rolldownOptions: {
				output: {
					assetFileNames,
				},
			},
		},
		environments: {
			client: {
				build: {
					rolldownOptions: {
						output: {
							assetFileNames,
							entryFileNames: (chunkInfo) => {
								const jsModuleId = chunkInfo.moduleIds.find((file) => file.endsWith('.js'));

								const pathName = chunkInfo.moduleIds[0]?.includes('hoisted') ? 'hoisted' : jsModuleId ? path.basename(jsModuleId, '.js') : chunkInfo.name;

								return `assets/scripts/${pathName || 'hoisted'}.js`;
							},
						},
					},
				},
			},
		},
	},
});
