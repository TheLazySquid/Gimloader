import type Lib from "$core/libManager/lib.svelte";
import { parsePluginHeader } from "$shared/parseHeader";
import { confirmLibReload, log } from "$content/utils";
import Net from "$core/net/net";
import LibManager from "$core/libManager/libManager.svelte";
import { uuidRegex } from "$content/scopedApi";
import type { PluginHeaders } from "$types/headers";

export default class Plugin {
    script: string;
    enabled: boolean = $state();
    headers: PluginHeaders = $state();
    return: any = $state();
    blobUuid: string | null = null;
    onStop: (() => void)[] = [];
    openSettingsMenu: (() => void)[] = $state([]);
    enablePromise: Promise<void> | null = null;
    errored = $state(false);

    constructor(script: string, enabled = true) {
        this.script = script;
        this.enabled = enabled;
    
        this.headers = parsePluginHeader(script);
    }

    async launch(initial: boolean = false) {
        if(this.enablePromise) return this.enablePromise;

        this.enablePromise = new Promise<void>(async (res, rej) => {
            let libObjs: Lib[] = [];
            let optionalLibObjs: Lib[] = [];

            // load required libs
            for(let lib of this.headers.needsLib) {
                let libName = lib.split('|')[0].trim();
                let libObj = LibManager.getLib(libName);

                if(!libObj) {
                    this.errored = true;
                    rej(new Error(`Plugin ${this.headers.name} requires library ${libName} which is not installed`));
                    return;
                }

                libObjs.push(libObj);
            }

            // load optional libs
            for(let lib of this.headers.optionalLib) {
                let libName = lib.split('|')[0].trim();
                let libObj = LibManager.getLib(libName);

                if(!libObj) continue;
                optionalLibObjs.push(libObj);
            }

            let [results, optionalResults] = await Promise.all([
                Promise.allSettled(libObjs.map(lib => lib.enable(initial))),
                Promise.allSettled(optionalLibObjs.map(lib => lib.enable(initial)))
            ]);

            let needsReload = libObjs.filter((_, i) => results[i].status == "fulfilled" && results[i].value);
            needsReload = needsReload.concat(optionalLibObjs.filter((_, i) =>
                optionalResults[i].status == "fulfilled" && optionalResults[i].value));

            if(needsReload.length > 0) {
                let reload = confirmLibReload(needsReload);
                if(reload) {
                    location.reload();
                }
            }

            // log errors with optional libs, but don't fail the plugin
            for(let result of optionalResults) {
                if(result.status === 'rejected') {
                    log(`Failed to enable optional library for plugin ${this.headers.name}:`, result.reason);
                }
            }

            let failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
            if(failed.length > 0) {
                let err = new Error(`Failed to enable plugin ${this.headers.name} due to errors while enabling libraries:\n${failed.map(f => f.reason).join('\n')}`);
                this.errored = true;
                rej(err);
                return;
            }
        
            // create a blob from the script and import it
            let blob = new Blob([this.script], { type: 'application/javascript' });
            let url = URL.createObjectURL(blob);
            this.blobUuid = url.match(uuidRegex)?.[0];
            
            import(url)
                .then((returnVal) => {
                    this.return = returnVal;
                    
                    if(returnVal.onStop && typeof returnVal.onStop === "function") {
                        this.onStop.push(returnVal.onStop);
                    }
                    if(returnVal.openSettingsMenu && typeof returnVal.openSettingsMenu === "function") {
                        this.openSettingsMenu.push(returnVal.openSettingsMenu);
                    }
            
                    log(`Loaded plugin: ${this.headers.name}`);
                    
                    if(!initial) {
                        if(
                            this.headers.reloadRequired === 'true' || 
                            this.headers.reloadRequired === '' ||
                            (this.headers.reloadRequired === 'ingame' && Net.type !== "None")
                        ) {
                            let reload = confirm(`${this.headers.name} requires a reload to function properly. Reload now?`);
                            if(reload) {
                                // call the save function directly, rather than the debounced one
                                location.reload();
                            }
                        }
                    }

                    for(let lib of this.headers.needsLib) {
                        let libName = lib.split('|')[0].trim();
                        let libObj = LibManager.getLib(libName);
                        libObj.addUsed(this.headers.name);
                    }

                    res();
                })
                .catch((e: Error) => {
                    console.error(e);
                    this.errored = true;
                    let stack = e.stack.replaceAll(url, `blob:${this.headers.name}.js`);
                    let err = new Error(`Failed to enable plugin ${this.headers.name}:\n${stack}`);
                    rej(err);
                })
                .finally(() => {
                    URL.revokeObjectURL(url);
                });
        });

        return this.enablePromise;
    }

    stop() {
        if(!this.enabled) return;
        this.errored = false;

        try {
            for(let stop of this.onStop) stop?.();
        } catch (e) {
            console.error(`Error stopping plugin ${this.headers.name}:`, e);
        }
        this.onStop = [];
        this.openSettingsMenu = [];
        this.enablePromise = null;

        // remove ourselves from all the libraries we were using
        for(let lib of this.headers.needsLib.concat(this.headers.optionalLib)) {
            let libName = lib.split('|')[0].trim();
            let libObj = LibManager.getLib(libName);
            if(libObj) libObj.removeUsed(this.headers.name);
        }

        this.return = null;
    }
}