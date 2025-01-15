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
                label: 'How to Install',
                slug: 'setup'
            }
        ],
        favicon: '/icon.ico',
        components: {
            ThemeProvider: './src/components/ThemeProvider.astro',
            ThemeSelect: './src/components/ThemeSelect.astro'
        },
        customCss: ['./src/lib/starlight.css']
    }), svelte(), tailwind()]
});