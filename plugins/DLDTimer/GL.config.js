import typescript from '@rollup/plugin-typescript'
import { string } from 'rollup-plugin-string';
import babel from '@rollup/plugin-babel';
import sass from 'rollup-plugin-sass';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.ts',
    name: 'DLDTimer',
    description: 'Times DLD runs, and shows you your time for each summit',
    author: 'TheLazySquid',
    version: pkg.version,
    downloadUrl: 'https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/DLDTimer/build/DLDTimer.js',
    plugins: [
        babel({ include: ['src/**/*.jsx', 'src/**/*.tsx'], babelHelpers: 'bundled' }),
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