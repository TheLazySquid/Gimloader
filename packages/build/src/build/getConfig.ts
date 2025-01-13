import type { BuildOptions, Plugin } from 'esbuild';
import type { GLConfig, Config, EsbuildConfig } from '../types';
import { existsSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { createHeader } from './addHeaders';

let startTime = 0;

function logRebuildPlugin(onBuild: () => void): Plugin {
    return {
        name: "log-rebuild",
        setup(build) {
            build.onStart(() => {
                process.stdout.write("Building...");
                startTime = Date.now();
            });
            build.onEnd((result) => {
                let time = Math.ceil(Date.now() - startTime);
                console.log(`\rBuild completed in ${time}ms`);

                if(result.warnings.length > 0) {
                    console.warn(`\rBuild completed in ${time}ms with warnings: ${result.errors.map(e => e.text).join("\n")}`)
                }

                if(result.errors.length > 0) {
                    console.error(`\rBuild failed: ${result.errors.map(e => e.text).join("\n")}`)
                }

                onBuild();
            });
        }
    }
}

export function createEsbuildConfig(config: EsbuildConfig): BuildOptions {
    let plugins = config.plugins ?? [];

    return {
        entryPoints: [config.input],
        mainFields: ["svelte", "browser", "module", "main"],
        conditions: ["svelte", "browser"],
        bundle: true,
        outfile: `build/${config.name}.js`,
        format: "esm",
        plugins,
        banner: {
            "js": createHeader(config)
        },
        ...config.esbuildOptions
    }
}

export function createEsbuildWatchConfig(config: EsbuildConfig, onBuild: () => void) {
    let buildConfig = createEsbuildConfig(config);

    buildConfig.plugins!.push(logRebuildPlugin(onBuild))

    return buildConfig;
}

export function getConfig() {
    return new Promise<Config>(async (res, rej) => {
        const configPath = join(process.cwd(), 'GL.config.js');

        if(!existsSync(configPath)) {
            rej('GL.config.js not found! Run gl init to create one.');
            return;
        }

        const config: GLConfig = await import(`${pathToFileURL(configPath).href}?t=${Date.now()}`);

        // do some checks
        if(!config.default) {
            rej("GL.config.js doesn't export a default value!");
            return;
        }
    
        let mandatoryStrings = ['input', 'name', 'description', 'author'];
        for(let str of mandatoryStrings) {
            let type = typeof config.default[str];
            if(type === 'undefined') {
                rej(`GL.config.js is missing the ${str} field!`);
                return;
            }
    
            if(type !== 'string') {
                rej(`GL.config.js ${str} field is not a string!`);
                return;
            }
        }
    
        let optionalArrays = ['libs', 'optionalLibs', 'plugins'];
    
        for(let arr of optionalArrays) {
            if(config.default[arr]) {
                if(!Array.isArray(config.default[arr])) {
                    rej(`GL.config.js ${arr} field is not an array!`);
                    return;
                }
            }
        }
    
        res(config.default);
    })
}