import svelte from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type {import('@gimloader/build').Config} */
export default {
    input: 'src/index.ts',
    name: '2dMovementTAS',
    description: 'Allows for making TASes of CTF and tag',
    author: 'TheLazySquid',
    version: pkg.version,
    reloadRequired: 'ingame',
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/2dMovementTAS/build/2dMovementTAS.js",
    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                css: "injected"
            }
        })
    ]
};