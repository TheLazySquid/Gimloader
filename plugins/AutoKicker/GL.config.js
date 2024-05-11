import typescript from "@rollup/plugin-typescript"
import babel from "@rollup/plugin-babel"
import { string } from "rollup-plugin-string"
import sass from "rollup-plugin-sass"
import fs from "fs"

let pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"))

export default {
    input: "src/index.ts",
    name: "AutoKicker",
    description: "Automatically kicks players from your lobby with a customizable set of rules",
    author: "TheLazySquid",
    version: pkg.version,
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/AutoKicker/build/AutoKicker.js",
    plugins: [
        sass(),
        string({ include: ['**/*.css', '**/*.svg'] }),
        babel({ include: 'src/**/*.tsx', babelHelpers: 'bundled' }),
        typescript({
            jsx: "react",
            target: "ES2022"
        })
    ]
}