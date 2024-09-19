import sveltePlugin from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type {import('@gimloader/build').Config} */
export default {
    input: 'src/index.ts',
    name: 'QuickSettings',
    description: 'Easily make simple settings menus',
    author: 'TheLazySquid',
    version: pkg.version,
    isLibrary: true,
    bundler: "esbuild",
    plugins: [
        sveltePlugin({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                css: "injected"
            }    
        })
    ]
};