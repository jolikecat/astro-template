import { defineConfig } from 'astro/config';
import path from 'path';

export default defineConfig({
	site: 'https://example.com/',
	compressHTML: false,
	build: {
		format: 'preserve',
		assets: 'assets',
	},
	vite: {
		build: {
			assetsInlineLimit: 0,
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						let extType = path.extname(assetInfo.name);

						if (/css/.test(extType)) {
							extType = 'styles';
						}

						if (/jpg|jpeg|png|webp|svg|gif|avif/.test(extType)) {
							extType = 'images';
						}

						const fileName = assetInfo.name.includes('Head') ? 'main' : '[name]';

						return `assets/${extType}/${fileName}[extname]`;
					},
					entryFileNames: (chunkInfo) => {
						console.log(chunkInfo);
						const pathName =
							chunkInfo.moduleIds.length !== 0 &&
							(chunkInfo.moduleIds[0].includes('hoisted')
								? 'hoisted'
								: path.basename(
										chunkInfo.moduleIds.find((file) => file.endsWith('.js')),
										'.js',
									));

						return `assets/scripts/${pathName ? pathName : 'hoisted'}.js`;
					},
					// manualChunks(id) {
					// 	if (id.includes('node_modules')) {
					// 		return 'vendor';
					// 	}
					// },
				},
			},
		},
	},
	integrations: [
		{
			name: 'chunkFileNames-for-client',
			hooks: {
				'astro:build:setup': ({ vite, target }) => {
					if (target === 'client') {
						vite.build.rollupOptions.output.chunkFileNames = () => {
							return `assets/scripts/[name].js`;
						};
					}
				},
			},
		},
	],
});
