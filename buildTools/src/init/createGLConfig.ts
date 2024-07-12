export default function createGLConfig(name: string, description: string, author: string, plugins: string[]) {
    let useTs = plugins.includes('typescript');

    let config = "";

    if(plugins.includes('typescript')) {
        config += `import typescript from '@rollup/plugin-typescript';\n`;
    }
    if(plugins.includes('babel')) {
        config += `import babel from '@rollup/plugin-babel';\n`;
    }
    if(plugins.includes('string')) {
        config += `import { string } from 'rollup-plugin-string';\n`;
    }
    if(plugins.includes('sass')) {
        config += `import sass from 'rollup-plugin-sass';\n`;
    }

    config += `
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
    input: 'src/index.${useTs ? 'ts' : 'js'}',
    name: '${name}',
    description: '${description}',
    author: '${author}',
    version: pkg.version,
    plugins: [`;

    let pluginStrs: string[] = [];

    if(plugins.includes('sass')) {
        pluginStrs.push(`        sass()`);
    }
    if(plugins.includes('string')) {
        pluginStrs.push(`        string({ include: ['**/*.css', '**/*.svg'] })`);
    }
    if(plugins.includes('babel')) {
        pluginStrs.push(`        babel({ include: ['src/**/*.jsx', 'src/**/*.tsx'], babelHelpers: 'bundled' })`);
        if(plugins.includes('typescript')) {
            pluginStrs.push(`        typescript({
            jsx: 'react',
            target: 'esnext'
        })`);
        }
    } else if(plugins.includes('typescript')) {
        pluginStrs.push(`        typescript({
            target: 'esnext'
        })`);
    }

    if(pluginStrs.length > 0) {
        config += "\n" + pluginStrs.join(',\n') + "\n   ]\n};";
    } else {
        config += ']\n};';
    }

    return config;
}