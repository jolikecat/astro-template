import { defineConfig } from 'astro/config';
import path from 'path';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com/',
    build: {
        format: 'file',
        assets: 'assets/scripts'
    },
    vite: {
        build: {
            assetsInlineLimit: 0,
            rollupOptions: {
            output: {
                entryFileNames: `assets/scripts/[name].js`,
                // chunkFileNames: `assets/scripts/[name].js`,
                assetFileNames: assetInfo => {
                let extType = path.extname(assetInfo.name);
                console.log(assetInfo);
                if (/css/.test(extType)) {
                    extType = 'styles';
                }
                if (/jpg|jpeg|png|webp|svg|gif|avif/.test(extType)) {
                    extType = 'images';
                }
                return `assets/${extType}/[name][extname]`;
                }
            }
            }
        }
    },
});