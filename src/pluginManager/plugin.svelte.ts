import type { Gimloader } from "../gimloader.svelte";
import type Lib from "../lib/lib";
import showErrorMessage from "$src/ui/showErrorMessage";
import { confirmLibReload, log, parsePluginHeader } from "../util";

export default class Plugin {    
    gimloader: Gimloader;
    script: string;
    enabled: boolean = $state();
    headers: Record<string, any> = $state();
    return: any = $state();

    constructor(gimloader: Gimloader, script: string, enabled = true) {
        this.gimloader = gimloader;
        this.script = script;
        this.enabled = enabled;
    
        this.headers = parsePluginHeader(script);
    }

    async enable(initial: boolean = false, temp: boolean = false) {
        return new Promise<void>(async (res, rej) => {
            if(!this.gimloader.pluginManager.runPlugins) {
                this.enabled = true;
                res();
                return;
            }

            if(this.gimloader.settings.autoDownloadMissingLibs) {
                let failed = false;
                await this.gimloader.net.downloadLibraries(this.headers.needsLib)
                    .catch((e) => {
                        failed = true;
                        this.enabled = false;
                        rej(new Error(e));
                    })

                if(failed) return;
            }

            // don't touch libraries if we only temporarily disabled the plugin
            if(!temp) {
                let libObjs: Lib[] = [];
                let optionalLibObjs: Lib[] = [];
    
                // load required libs
                for(let lib of this.headers.needsLib) {
                    let libName = lib.split('|')[0].trim();
                    let libObj = this.gimloader.lib.getLib(libName);
    
                    if(!libObj) {
                        this.enabled = false;
                        rej(new Error(`Plugin ${this.headers.name} requires library ${libName} which is not installed`));
                        return;
                    }
    
                    libObjs.push(libObj);
                }
    
                // load optional libs
                for(let lib of this.headers.optionalLib) {
                    let libName = lib.split('|')[0].trim();
                    let libObj = this.gimloader.lib.getLib(libName);
    
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
                        this.enabled = true;
                        this.gimloader.pluginManager.saveFn();
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
                    this.enabled = false;
                    rej(err);
                    return;
                }
            }
        
            // create a blob from the script and import it
            let blob = new Blob([this.script], { type: 'application/javascript' });
            let url = URL.createObjectURL(blob);
            
            import(url)
                .then((returnVal) => {
                    this.return = returnVal;
                    this.enabled = true;
            
                    log(`Loaded plugin: ${this.headers.name}`);
                    
                    if(!initial) {
                        if(
                            this.headers.reloadRequired === 'true' || 
                            this.headers.reloadRequired === '' ||
                            (this.headers.reloadRequired === 'ingame' && this.gimloader.net.type !== "Unknown")
                        ) {
                            let reload = confirm(`${this.headers.name} requires a reload to function properly. Reload now?`);
                            if(reload) {
                                // call the save function directly, rather than the debounced one
                                this.gimloader.pluginManager.saveFn();
                                location.reload();
                            }
                        }
                    }

                    for(let lib of this.headers.needsLib) {
                        let libName = lib.split('|')[0].trim();
                        let libObj = this.gimloader.lib.getLib(libName);
                        libObj.addUsed(this.headers.name);
                    }

                    res();
                })
                .catch((e: Error) => {
                    console.error(e);
                    this.enabled = false;
                    let stack = e.stack.replaceAll(url, `blob:${this.headers.name}.js`);
                    let err = new Error(`Failed to enable plugin ${this.headers.name}:\n${stack}`);
                    rej(err);
                })
                .finally(() => {
                    URL.revokeObjectURL(url);
                })
        })
    }

    disable(temp: boolean = false) {
        this.enabled = false;
        if(!this.gimloader.pluginManager.runPlugins) return;

        if(this.return) {
            try {
                this.return?.onStop?.();
            } catch (e) {
                console.error(`Error stopping plugin ${this.headers.name}:`, e);
            }
        }

        if(!temp) {
            for(let lib of this.headers.needsLib) {
                let libName = lib.split('|')[0].trim();
                let libObj = this.gimloader.lib.getLib(libName);
                if(libObj) libObj.removeUsed(this.headers.name);
            }
        }

        this.return = null;
    }

    edit(script: string, headers: Record<string, string>) {
        let enabled = this.enabled;
        if(enabled) this.disable(true);
        this.script = script;
        this.headers = headers;
        this.gimloader.pluginManager.save();

        if(!enabled) return;
        this.enable(false, true)
            .then(() => this.gimloader.pluginManager.save())
            .catch((e) => {
                showErrorMessage(e.message, `Failed to enable plugin ${this.headers.name}`);
            })
    }
}