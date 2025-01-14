import type { RollupWatcher } from 'rollup';
import esbuild, { BuildContext } from 'esbuild';
import { createEsbuildWatchConfig, getConfig } from '../build/getConfig.js';
import chokidar from 'chokidar';
import { join } from 'path';
import fs from 'fs/promises';
import build from '../build/build.js';
import Poller from './poller.js';
import waitForEnter from './manual.js';

export default function serve(args: any) {
    let watcher: RollupWatcher | null = null;
    let ctx: BuildContext | null = null;

    let poller = new Poller();

    const onCodeUpdate = async (name: string) => {
        let outputPath = join(process.cwd(), 'build', `${name}.js`);

        let newCode = await fs.readFile(outputPath, 'utf-8');
        
        poller.updateCode(newCode);
    }

    const makeWatcher = () => {
        if(watcher) watcher.close();
        if(ctx) ctx.dispose();

        getConfig()
        .then(async (config) => {
            poller.isLibrary = config.isLibrary === true;

            let buildConfig = createEsbuildWatchConfig(config, () => {
                onCodeUpdate(config.name);
            });

            ctx = await esbuild.context(buildConfig);
            await ctx.watch();
        })
        .catch((err: string) => {
            console.error(err);
        })
    }

    let isBuilding = false;
    const buildPlugin = () => {
        isBuilding = true;
        process.stdout.write("\x1b[2K\rBuilding...");

        let start = Date.now();
        build()
            .then((config) => {
                let time = Math.ceil(Date.now() - start);
                console.log(`\rBuild completed in ${time}ms`);
                poller.isLibrary = config.isLibrary === true;
                onCodeUpdate(config.name);
            })
            .catch((err: string) => {
                console.error(`\rBuild failed: ${err}`);
            })
            .finally(() => {
                isBuilding = false
                process.stdout.write("Press enter to build...");
            });
    }

    if(args.manual) {
        waitForEnter(() => {
            if(isBuilding) return;
            buildPlugin();
        }, "Press Enter to rebuild, and press Ctrl+C to exit\nPress enter to build...")

        buildPlugin();
    } else {
        makeWatcher();
    
        // watch for config changes
        chokidar.watch('GL.config.js', {
            ignoreInitial: true
        }).on('change', () => {
            console.log("GL.config.js changed! Rebuilding...")
            makeWatcher();
        });
    }   
}