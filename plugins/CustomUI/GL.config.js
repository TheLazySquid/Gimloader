import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import { string } from 'rollup-plugin-string';
import sass from 'rollup-plugin-sass';
import json from '@rollup/plugin-json';

import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.ts',
    name: 'CustomUI',
    description: 'Allows you to customize various things about the Gimkit UI',
    author: 'TheLazySquid',
    version: pkg.version,
    hasSettings: true,
    plugins: [
        json(),
        sass(),
        string({ include: ['**/*.css', '**/*.svg'] }),
        babel({ include: ['src/**/*.jsx', 'src/**/*.tsx'], babelHelpers: 'bundled' }),
        typescript({
            jsx: 'react',
            target: 'esnext',
            compilerOptions: {
                resolveJsonModule: true,
                allowSyntheticDefaultImports: true
            }
        }),
    ]
}