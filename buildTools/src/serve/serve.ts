import { watch, type RollupWatcher } from 'rollup';
import getConfig from '../build/getConfig';
import addHeadersPlugin from '../build/addHeadersPlugin';
import chokidar from 'chokidar';
import { join } from 'path';
import fs from 'fs/promises';
import express from 'express';
import rl from 'readline';
import build from '../build/build';

const port = 5822; // picked at random

export default function serve(args: any) {
    const app = express();

    let isLibrary = false;
    let watcher: RollupWatcher | null = null;
    let code: string | null = null;
    let longPollRes: express.Response | null = null;
    let codeSent = false;

    const onCodeUpdate = async (name: string) => {
        let outputPath = join(process.cwd(), 'build', `${name}.js`);

        let newCode = await fs.readFile(outputPath, 'utf-8');
        if(newCode === code) return;
        
        code = newCode;

        // send the code if there's a request waiting
        if(longPollRes) {
            longPollRes.setHeader('Is-Library', isLibrary.toString());
            longPollRes.send(code);
            codeSent = true;
            longPollRes = null;
        } else {
            codeSent = false;
        }
    }

    const makeWatcher = async () => {
        if(watcher) watcher.close();

        getConfig()
            .then(async (config) => {
                isLibrary = config.isLibrary === true;

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
        process.stdout.write("\rBuilding...");

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
        rl.emitKeypressEvents(process.stdin);

        if(process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        console.log("Press Enter to rebuild, and press Ctrl+C to exit");
        process.stdout.write("Press enter to build...");

        process.stdin.on('keypress', async (_, key) => {
            if(key.ctrl && key.name === 'c') {
                process.exit(0);
            } else if(key.name === 'return' && !isBuilding) {
                // build the plugin
                buildPlugin();
            }
        })

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

    // serve the file
    app.get('/getCode', (_, res) => {
        if(code) {
            res.setHeader('Is-Library', isLibrary.toString());
            res.type('js');
            res.send(code);
        } else {
            res.status(500).send("No code available");
        }
    });

    let lastUid = '';
    app.get('/getUpdate', (req, res) => {
        let uid = req.headers.uid as string;

        res.type('js');
        if((codeSent && uid === lastUid) || !code) {
            // disregard duplicate requests
            if(longPollRes) {
                longPollRes.status(500).send("Another request is already pending");
            }
            
            longPollRes = res;
        } else {
            res.setHeader('Is-Library', isLibrary.toString());
            res.send(code);
            codeSent = true;
        }

        lastUid = uid;
    })

    app.listen(port);
}