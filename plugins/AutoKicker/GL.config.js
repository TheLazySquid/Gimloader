import { sassPlugin } from "esbuild-sass-plugin";
import fs from "fs"

let pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"))

/** @type {import('@gimloader/build').Config} */
export default {
    input: "src/index.ts",
    name: "AutoKicker",
    description: "Automatically kicks players from your lobby with a customizable set of rules",
    author: "TheLazySquid",
    version: pkg.version,
    downloadUrl: "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/AutoKicker/build/AutoKicker.js",
    plugins: [sassPlugin({ type: "css-text" })]
}