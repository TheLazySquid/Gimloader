import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import { string } from 'rollup-plugin-string';
import sass from 'rollup-plugin-sass';

import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.ts',
    name: 'InfoLines',
    description: 'Displays a configurable list of info on the screen',
    author: 'TheLazySquid',
    version: pkg.version,
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InfoLines/build/InfoLines.js",
    hasSettings: true,
    plugins: [
        sass(),
        string({ include: ['**/*.css', '**/*.svg'] }),
        babel({ include: ['src/**/*.jsx', 'src/**/*.tsx'], babelHelpers: 'bundled' }),
        typescript({
            jsx: 'react',
            target: 'esnext'
        })
   ]
};