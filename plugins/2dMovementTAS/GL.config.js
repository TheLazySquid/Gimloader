import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.ts',
    name: '2dMovementTAS',
    description: 'Allows for making TASes of CTF and tag',
    author: 'TheLazySquid',
    version: pkg.version,
    reloadRequired: 'ingame',
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/2dMovementTAS/build/2dMovementTAS.js",
    plugins: [
        string({ include: ['**/*.css', '**/*.svg'] }),
        typescript({
            target: 'esnext'
        }),
        svelte({
            emitCss: false,
            compilerOptions: {
                css: 'injected'
            },
            preprocess: vitePreprocess()
        }),
        resolve({
            browser: true,
            exportConditions: ['svelte'],
            extensions: ['.svelte', '.js', '.ts', '.json']
        })
    ]
};