import { defineConfig } from 'astro/config';
import path from 'path';
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com/',
    build: {
        format: 'file'
    },
    vite: {
        build: {
            assetsInlineLimit: 0,
            rollupOptions: {
                output: {
                    entryFileNames: `assets/scripts/[name].js`,
                    assetFileNames: assetInfo => {
                        let extType = path.extname(assetInfo.name);

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
    integrations: [
        compress({
            css: false,
            html: {
                collapseBooleanAttributes: true,
                collapseWhitespace: false,
                removeComments: false,
                removeEmptyAttributes: false,
                removeRedundantAttributes: false,
                sortAttributes: false,
                sortClassName: false,
            },
            img: false,
            js: false,
            svg: false,
        })
    ]
});