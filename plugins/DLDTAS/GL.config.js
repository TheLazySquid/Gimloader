import { sassPlugin } from "esbuild-sass-plugin";
import fs from 'fs';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

/** @type { import('@gimloader/build').Config } */
export default {
    input: "./src/index.ts",
    name: "DLDTAS",
    description: "Allows you to create TASes for Dont Look Down",
    author: "TheLazySquid",
    version: pkg.version,
    reloadRequired: 'ingame',
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/DLDTAS/build/DLDTAS.js",
    libs: ["DLDUtils | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js"],
    plugins: [sassPlugin({ type: "css-text" })],
    esbuildOptions: {
        loader: {
            ".svg": "text"
        }
    }
}