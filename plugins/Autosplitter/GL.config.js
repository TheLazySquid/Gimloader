import typescript from '@rollup/plugin-typescript'
import { string } from 'rollup-plugin-string';
import sass from 'rollup-plugin-sass';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.ts',
    name: 'Autosplitter',
    description: 'Automatically times speedruns for various gamemodes',
    author: 'TheLazySquid',
    version: pkg.version,
    downloadUrl: 'https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/Autosplitter/build/Autosplitter.js',
    libs: ["GamemodeDetector | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/GamemodeDetector.js"],
    hasSettings: true,
    plugins: [
        sass(),
        string({ include: ['**/*.css', '**/*.svg'] }),
        typescript({
            jsx: 'react',
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