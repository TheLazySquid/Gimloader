import typescript from '@rollup/plugin-typescript'
import { string } from 'rollup-plugin-string';
import babel from '@rollup/plugin-babel';
import sass from 'rollup-plugin-sass';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.ts',
    name: 'DLDTimer',
    description: 'Times DLD runs, and shows you your time for each summit',
    author: 'TheLazySquid',
    version: pkg.version,
    plugins: [
        babel({ include: ['src/**/*.jsx', 'src/**/*.tsx'], babelHelpers: 'bundled' }),
        sass(),
        string({ include: ['**/*.css', '**/*.svg'] }),
        typescript({
            jsx: 'react',
            target: 'esnext'
        })
   ]
};