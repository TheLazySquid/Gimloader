import typescript from "@rollup/plugin-typescript"
import babel from "@rollup/plugin-babel"
import { string } from "rollup-plugin-string"
import sass from "rollup-plugin-sass"
import fs from "fs"

let pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"))

export default {
    input: "src/index.ts",
    name: "CharacterCustomization",
    description: "Allows you to use any gim or a custom gim client-side",
    author: "TheLazySquid",
    version: pkg.version,
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CharacterCustomization/build/CharacterCustomization.js",
    plugins: [
        sass(),
        string({ include: ['**/*.css', '**/*.svg', './assets/*'] }),
        babel({ include: 'src/**/*.tsx', babelHelpers: 'bundled' }),
        typescript({
            jsx: "react",
            target: "ES2022"
        })
    ]
}