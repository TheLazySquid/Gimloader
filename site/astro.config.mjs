// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import svelte from '@astrojs/svelte';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    site: 'https://thelazysquid.github.io',
    base: 'Gimloader',
    integrations: [starlight({
        title: 'Gimloader',
        social: {
            github: 'https://github.com/TheLazySquid/Gimloader',
        },
        sidebar: [
            {
                label: 'Usage',
                items: [
                    { slug: 'usage/installation' },
                    { slug: 'usage/updating' },
                    { slug: 'usage/plugins' }
                ]
            },
            {
                label: 'Development',
                items: [
                    { slug: 'development/overview' },
                    { slug: 'development/internals' },
                    { slug: 'development/structure' },
                    { slug: 'development/api' },
                    { slug: 'development/bundling' },
                    { slug: 'development/nextsteps' }
                ]
            },
            {
                label: "Docs",
                items: [
                    {
                        label: 'Scoped Api',
                        items: [
                            { slug: 'api/scopedapi' },
                            { slug: 'api/scopedparcel' },
                            { slug: 'api/scopedhotkeys' },
                            { slug: 'api/scopednet' },
                            { slug: 'api/scopedui' },
                            { slug: 'api/scopedstorage' },
                            { slug: 'api/scopedpatcher' },
                            { slug: 'api/libs' },
                            { slug: 'api/plugins' },
                        ]
                    },
                    {
                        label: 'Unscoped Api',
                        items: [
                            { slug: 'api/api' },
                            { slug: 'api/parcel' },
                            { slug: 'api/hotkeys' },
                            { slug: 'api/net' },
                            { slug: 'api/ui' },
                            { slug: 'api/storage' },
                            { slug: 'api/patcher' },
                            { slug: 'api/libs' },
                            { slug: 'api/plugins' },
                        ]
                    }
                ]
            }
        ],
        favicon: '/icon.svg',
        logo: {
            src: './public/icon.svg'
        },
        components: {
            ThemeProvider: './src/components/ThemeProvider.astro',
            ThemeSelect: './src/components/ThemeSelect.astro'
        },
        customCss: ['./src/lib/starlight.css']
    }), svelte(), tailwind()]
});