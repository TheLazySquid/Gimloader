import typescript from "@rollup/plugin-typescript"
import babel from "@rollup/plugin-babel"
import { string } from "rollup-plugin-string"
import sass from "rollup-plugin-sass"

export default {
    input: "src/index.ts",
    name: "AutoKicker",
    description: "Automatically kicks players from your lobby with a customizable set of rules",
    author: "TheLazySquid",
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