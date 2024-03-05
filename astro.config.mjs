import compress from 'astro-compress';
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

						return `assets/${extType}/[name][extname]`;
					},
					entryFileNames: `assets/scripts/[name].js`,
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
							return `assets/scripts/chunks/[name].js`;
						};
					}
				},
			},
		},
	],
});
