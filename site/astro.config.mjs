// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    site: 'https://thelazysquid.github.io',
    base: 'Gimloader',
    integrations: [starlight({
        plugins: [starlightSidebarTopics([
            {
                label: 'Usage',
                link: '/usage/installation',
                id: 'usage',
                items: [
                    {
                        label: "Using Gimloader",
                        items: [
                            'usage/installation',
                            'usage/plugins'
                        ]
                    },
                    {
                        label: "Official Plugins",
                        items: [
                            'plugins/cameracontrol',
                            'plugins/charactercustomization',
                            'plugins/savestates',
                            'plugins/physicssettings',
                            'plugins/performantgims',
                            'plugins/idleforxp',
                            'plugins/infolines',
                            'plugins/autokicker',
                            'plugins/quickreset',
                            'plugins/instantuse',
                            'plugins/crazyflag',
                            'plugins/toggleterraintype',
                            'plugins/uncappedsettings',
                            'plugins/autosplitter',
                            'plugins/bringbackboosts',
                            'plugins/dldtas',
                            'plugins/showhitboxes',
                            'plugins/inputrecorder',
                            'plugins/customui',
                            'plugins/movementtas',
                        ]
                    }
                ]
            },
            {
                label: 'Development',
                link: '/development/overview',
                id: 'development',
                items: [
                    {
                        label: 'Development',
                        items: [
                            'development/overview',
                            'development/internals',
                            'development/structure',
                            'development/api',
                            'development/bundling',
                            'development/nextsteps'
                        ]
                    },
                    {
                        label: "Docs",
                        items: [
                            {
                                label: 'Scoped Api',
                                items: [
                                    'api/scopedapi',
                                    'api/scopedparcel',
                                    'api/scopedhotkeys',
                                    'api/scopednet',
                                    'api/scopedui',
                                    'api/scopedstorage',
                                    'api/scopedpatcher',
                                    'api/libs',
                                    'api/plugins',
                                ]
                            },
                            {
                                label: 'Unscoped Api',
                                items: [
                                    'api/api',
                                    'api/parcel',
                                    'api/hotkeys',
                                    'api/net',
                                    'api/ui',
                                    'api/storage',
                                    'api/patcher',
                                    'api/libs',
                                    'api/plugins',
                                ]
                            }
                        ]
                    }
                ]
            }
        ])],
        title: 'Gimloader',
        social: {
            github: 'https://github.com/TheLazySquid/Gimloader',
        },
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