import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig, svgoOptimizer } from 'astro/config';

const imageQuality = 70;
const imageExtensionPattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const svgOptimizer = svgoOptimizer({
	multipass: true,
	floatPrecision: 3,
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: {
					convertPathData: { transformPrecision: 3 },
					convertTransform: { transformPrecision: 3 },
				},
			},
		},
	],
});

const assetFileNames = (assetInfo) => {
	const assetName = assetInfo.names?.[0] ?? assetInfo.name ?? '';
	const extension = path.extname(assetName);
	let directory = extension.slice(1);
	let fileName = '[name]';

	if (extension === '.css') {
		directory = 'styles';
		fileName = path.basename(assetName, extension).replace(/@_@astro$/, '');
	}

	if (imageExtensionPattern.test(extension)) {
		const originalFileName = assetInfo.originalFileNames?.[0] ?? assetInfo.originalFileName ?? '';
		const imagePath = originalFileName.replaceAll('\\', '/').match(/(?:^|\/)assets\/images\/(.+)$/)?.[1];
		const imageDirectory = imagePath ? path.posix.dirname(imagePath) : '';

		directory = path.posix.join('images', imageDirectory === '.' ? '' : imageDirectory);
	}

	return `assets/${directory}/${fileName}[extname]`;
};

const optimizeSourceSvgAssets = {
	name: 'optimize-source-svg-assets',
	enforce: 'post',
	async generateBundle(_options, bundle) {
		await Promise.all(
			Object.values(bundle).map(async (output) => {
				if (output.type !== 'asset' || path.extname(output.fileName) !== '.svg') return;

				const isFromSource = output.originalFileNames.some((fileName) => {
					const normalizedFileName = fileName.replaceAll('\\', '/');

					return normalizedFileName.startsWith('src/') || normalizedFileName.includes('/src/');
				});

				if (!isFromSource) return;

				const source = typeof output.source === 'string' ? output.source : new TextDecoder().decode(output.source);

				output.source = await svgOptimizer.optimize(source);
			}),
		);
	},
};

export default defineConfig({
	site: 'https://example.com/',
	compressHTML: false,
	build: {
		format: 'preserve',
		assets: 'assets',
	},
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp',
			config: {
				jpeg: { quality: imageQuality },
				png: { quality: imageQuality },
				webp: { quality: imageQuality },
				avif: { quality: imageQuality },
			},
		},
	},
	experimental: {
		svgOptimizer,
	},
	vite: {
		plugins: [tailwindcss(), optimizeSourceSvgAssets],
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
