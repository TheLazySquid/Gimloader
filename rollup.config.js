import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import { string } from 'rollup-plugin-string';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import metablock from 'rollup-plugin-userscript-metablock';
import fs from 'fs';
import typescriptPaths from 'rollup-plugin-tsconfig-paths';
import { sveltePreprocess } from 'svelte-preprocess';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';
import tailwindConfig from './tailwind.config.js';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

function onwarn(warning) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    console.warn(warning);
}

export default {
    input: 'src/index.ts',
    onwarn,
    output: {
        file: 'build/bundle.user.js',
        format: 'iife',
        name: 'gimloader'
    },
    plugins: [
        json(),
        babel({ include: 'src/**/*.tsx', babelHelpers: 'bundled' }),
        svelte({
            emitCss: false,
            compilerOptions: {
                css: 'injected'
            },
            preprocess: sveltePreprocess({ postcss: true })
        }),
        resolve({
            browser: true,
            exportConditions: ['svelte'],
            extensions: ['.svelte', '.js', '.ts', '.json']
        }),
        string({
            include: ['src/css/*.css', '**/*.svg'],
        }),
        typescriptPaths(),
        typescript(),
        postcss({
            inject: false,
            minimize: true,
            plugins: [
                new tailwindcss(tailwindConfig)
            ]
        }),
        commonjs(),
        // terser(),
        metablock({
            file: './meta.json',
            override: {
                version: pkg.version
            }
        })
    ]
}