import typescript from "@rollup/plugin-typescript";
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import { string } from "rollup-plugin-string";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import commonjs from "@rollup/plugin-commonjs";
import fs from "fs";

let pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"))

export default {
    input: "src/index.ts",
    name: "CharacterCustomization",
    description: "Allows you to use any gim or a custom gim client-side",
    author: "TheLazySquid",
    version: pkg.version,
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CharacterCustomization/build/CharacterCustomization.js",
    reloadRequired: 'ingame',
    hasSettings: true,
    plugins: [
        commonjs(),
        string({ include: ['**/*.css', '**/*.svg', './assets/*'] }),
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
}