import compress from 'astro-compress';
import { defineConfig } from 'astro/config';
import path from 'path';

import HtmlCssFormatter from './integrations/html-css-formatter'

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
        HtmlCssFormatter(),
        compress({
            css: true,
            html: {
                collapseBooleanAttributes: true,
                removeAttributeQuotes: false,
                removeComments: false,
                sortAttributes: false,
                sortClassName: false,
            },
            img: false,
            js: false,
            svg: false,
        })
    ]
});