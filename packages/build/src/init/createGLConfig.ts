export default function createGLConfig(name: string, description: string, author: string, bundler: string, useTs: boolean, plugins: string[]) {
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
    if(plugins.includes('svelte')) {
        config += `import svelte from 'rollup-plugin-svelte';\n`;
        config += `import resolve from '@rollup/plugin-node-resolve';\n`;
        config += `import { sveltePreprocess } from 'svelte-preprocess';\n`;
    }
    if(plugins.includes('esbuild-svelte')) {
        config += `import sveltePlugin from 'esbuild-svelte';\n`
        config += `import { sveltePreprocess } from 'svelte-preprocess';\n`;
    }

    config += `import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** @type {import('@gimloader/build').Config} */
export default {
    input: 'src/index.${useTs ? 'ts' : 'js'}',
    name: '${name}',
    description: '${description}',
    author: '${author}',
    version: pkg.version,`
    if(bundler === "esbuild") config += `\n    bundler: "esbuild",`

    config += `\n    plugins: [`;

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
    if(plugins.includes('svelte')) {
        pluginStrs.push(`        svelte({
            emitCss: false,
            compilerOptions: {
                css: 'injected'
            },
            preprocess: sveltePreprocess()
        })`);
        pluginStrs.push(`        resolve({
            browser: true,
            exportConditions: ['svelte'],
            extensions: ['.svelte', '.js', '.ts', '.json']
        })`);
    }
    if(plugins.includes("esbuild-svelte")) {
        pluginStrs.push(`        sveltePlugin({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                css: "injected"
            }    
        })`)
    }

    if(pluginStrs.length > 0) {
        config += "\n" + pluginStrs.join(',\n') + "\n    ]\n};";
    } else {
        config += ']\n};';
    }

    return config;
}