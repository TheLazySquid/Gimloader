import { build, context } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import postcss from 'postcss';
import postcssLoadConfig from 'postcss-load-config';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync("package.json"));
const version = pkg.version;

import { compileAsync } from "sass";
import path from "path";

console.time("Built");
let timerRunning = true;

// unholy amalgamation of esbuild-postcss-inline-styles and esbuild-style-plugin
function importStyles() {
    return {
        name: "import-styles",
        setup(build) {
            build.onResolve({ filter: /.\.scss$/ }, (args) => {
                return {
                    path: path.join(args.resolveDir, args.path),
                    namespace: "import-styles"
                }
            });
            build.onLoad({ filter: /.*/, namespace: "import-styles" }, async (args) => {
                const sassed = (await compileAsync(args.path)).css;
                const config = await postcssLoadConfig();
                const postcssed = await postcss(config.plugins).process(sassed, {
                    from: args.path
                });

                const contents = `const styles = ${JSON.stringify(postcssed.css)};\nexport default styles;`;

                return {
                    contents,
                    loader: "js"
                }
            })
        }
    }
}

const meta = `// ==UserScript==
// @name        Gimloader
// @description A plugin loader for Gimkit
// @namespace   https://github.com/TheLazySquid/Gimloader
// @match       https://www.gimkit.com/*
// @match       https://thelazysquid.github.io/gimloader*
// @run-at      document-start
// @iconURL     https://www.gimkit.com/favicon.png
// @author      TheLazySquid
// @updateURL   https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/build/bundle.user.js
// @downloadURL https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/build/bundle.user.js
// @version     ${version}
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM.registerMenuCommand
// @grant       GM.xmlHttpRequest
// @grant       GM_addValueChangeListener
// ==/UserScript==`

let config = {
    entryPoints: ["src/index.ts"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    bundle: true,
    outfile: "build/bundle.user.js",
    plugins: [
        sveltePlugin({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                css: "injected"
            }
        }),
        importStyles()
    ],
    loader: {
        ".svg": "text",
        ".css": "empty"
    },
    banner: {
        "js": meta
    },
    minify: true
}


if(process.argv.includes("-w") || process.argv.includes("--watch")) {
    config.plugins.push({
        name: "rebuild-notify",
        setup(build) {
            build.onStart(() => {
                process.stdout.write("Building...")
                if(timerRunning) {
                    timerRunning = false;
                } else {
                    console.time("Built");
                }
            })
            build.onEnd(result => {
                process.stdout.write("\r")
                console.timeEnd("Built");
                if(result.errors.length > 0) {
                    console.log("Build finished with", result.errors, "errors");
                }
            })
        }
    })

    const ctx = await context(config)
    await ctx.watch()
} else {
    await build(config);
    console.timeEnd("Built")
}