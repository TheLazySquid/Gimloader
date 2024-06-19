import typescript from '@rollup/plugin-typescript';
import sass from 'rollup-plugin-sass';
import { string } from 'rollup-plugin-string';
import fs from 'fs';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
    input: "./src/index.ts",
    name: "DLDTAS",
    description: "Allows you to create TASes for Dont Look Down",
    author: "TheLazySquid",
    version: pkg.version,
    reloadRequired: 'ingame',
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/DLDTAS/build/DLDTAS.js",
    libs: ["DLDUtils | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js"],
    plugins: [
        typescript({
            target: "es2022"
        }),
        sass(),
        string({ include: ['**/*.css', '**/*.svg'] }),
    ]
}