import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import { string } from 'rollup-plugin-string';
import resolve from '@rollup/plugin-node-resolve';
import sass from 'rollup-plugin-sass';
import metablock from 'rollup-plugin-userscript-metablock';
import fs from 'fs';
import typescriptPaths from 'rollup-plugin-tsconfig-paths';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.ts',
    output: {
        file: 'build/bundle.user.js',
        format: 'iife',
        name: 'gimloader'
    },
    plugins: [
        json(),
        babel({ include: 'src/**/*.tsx', babelHelpers: 'bundled' }),
        sass(),
        resolve(),
        string({ include: ['**/*.css', '**/*.svg'] }),
        typescriptPaths(),
        typescript(),
        metablock({
            file: './meta.json',
            override: {
                version: pkg.version
            }
        })
    ]
}