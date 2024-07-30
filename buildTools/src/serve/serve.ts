import { watch, type RollupWatcher } from 'rollup';
import getConfig from '../build/getConfig';
import addHeadersPlugin from '../build/addHeadersPlugin';
import chokidar from 'chokidar';
import { join } from 'path';
import fs from 'fs/promises';
import build from '../build/build';
import Poller from './poller';
import waitForEnter from './manual';

export default function serve(args: any) {
    let watcher: RollupWatcher | null = null;

    let poller = new Poller();

    const onCodeUpdate = async (name: string) => {
        let outputPath = join(process.cwd(), 'build', `${name}.js`);

        let newCode = await fs.readFile(outputPath, 'utf-8');
        
        poller.updateCode(newCode);
    }

    const makeWatcher = async () => {
        if(watcher) watcher.close();

        getConfig()
            .then(async (config) => {
                poller.isLibrary = config.isLibrary === true;

                let plugins = config.plugins ?? [];
                plugins.push(addHeadersPlugin(config));
                
                watcher = watch({
                    input: config.input,
                    output: {
                        file: `build/${config.name}.js`,
                        format: 'esm',
                        ...config.outputOptions
                    },
                    plugins,
                    ...config.rollupOptions
                });
                
                watcher.on('event', (event) => {
                    if(event.code === "BUNDLE_START") {
                        process.stdout.write("Building...");
                    } else if(event.code === "BUNDLE_END") {
                        console.log(`\rBuild completed in ${event.duration}ms`);
                        onCodeUpdate(config.name);
                        event.result.close();
                    } else if(event.code === "ERROR") {
                        console.log(`\rBuild failed: ${event.error}`);
                        event.result?.close();
                    }
                })
            })
            .catch((err: string) => {
                console.error(err);
            })
    }

    let isBuilding = false;
    const buildPlugin = () => {
        isBuilding = true;
        process.stdout.write("\rBuilding...            ");

        let start = Date.now();
        build()
            .then((config) => {
                let time = Math.ceil(Date.now() - start);
                console.log(`\rBuild completed in ${time}ms`);
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