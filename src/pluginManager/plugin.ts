import type { Gimloader } from "$src/gimloader";
import showErrorMessage from "$src/ui/showErrorMessage";
import { log, parsePluginHeader } from "../util";

export default class Plugin {
    gimloader: Gimloader;
    script: string;
    enabled: boolean;
    headers: Record<string, any>;
    return: any;
    runPlugin: boolean;

    constructor(gimloader: Gimloader, script: string, enabled = true, initial = false, runPlugin = true) {
        this.gimloader = gimloader;
        this.script = script;
        this.enabled = enabled;
        this.runPlugin = runPlugin;
    
        this.headers = parsePluginHeader(script);

        // we are going to manually call enable on the first load
        if(enabled && !initial) {
            this.enable(initial)
                .catch((e: Error) => {
                    showErrorMessage(e.message, `Failed to enable plugin ${this.headers.name}`);
                })
        }
    }

    async enable(initial: boolean = false) {
        return new Promise<void>(async (res, rej) => {
            let libObjs = [];
            let optionalLibObjs = [];

            // load required libs
            for(let lib of this.headers.needsLib) {
                let libName = lib.split('|')[0].trim();
                let libObj = this.gimloader.lib.getLib(libName);

                if(!libObj) {
                    this.enabled = false;
                    this.gimloader.pluginManager.updatePlugins();
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
                Promise.allSettled(libObjs.map(lib => lib.enable())),
                Promise.allSettled(optionalLibObjs.map(lib => lib.enable()))
            ])

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
                this.gimloader.pluginManager.updatePlugins();
                return;
            }
    
            if(!this.runPlugin) return;
    
            // create a blob from the script and import it
            let blob = new Blob([this.script], { type: 'application/javascript' });
            let url = URL.createObjectURL(blob);
            
            import(url)
                .then((returnVal) => {
                    this.return = returnVal;
                    this.enabled = true;
                    this.gimloader.pluginManager.updatePlugins();
            
                    log(`Loaded plugin: ${this.headers.name}`);
                    
                    if(!initial) {
                        if(
                            this.headers.reloadRequired === 'true' || 
                            this.headers.reloadRequired === '' ||
                            (this.headers.reloadRequired === 'ingame' && this.gimloader.net.type !== "Unknown")
                        ) {
                            let reload = confirm(`${this.headers.name} requires a reload to function properly. Reload now?`);
                            if(reload) {
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
                .catch((e) => {
                    this.enabled = false;
                    this.gimloader.pluginManager.updatePlugins();
                    let err = new Error(`Failed to enable plugin ${this.headers.name}:\n${e}`);
                    rej(err);
                })
                .finally(() => {
                    URL.revokeObjectURL(url);
                })
        })
    }

    disable() {
        this.enabled = false;
        this.gimloader.pluginManager.updatePlugins();
        if(!this.runPlugin) return;

        if(this.return) {
            try {
                this.return?.onStop?.();
            } catch (e) {
                log(`Error stopping plugin ${this.headers.name}:`, e);
            }
        }

        for(let lib of this.headers.needsLib) {
            let libName = lib.split('|')[0].trim();
            let libObj = this.gimloader.lib.getLib(libName);
            if(libObj) libObj.removeUsed(this.headers.name);
        }

        this.return = null;
    }

    edit(script: string, headers: Record<string, string>) {
        let enabled = this.enabled;
        this.disable();
        this.script = script;
        this.headers = headers;
        if(enabled) {
            this.enable()
                .then(() => this.gimloader.pluginManager.save())
                .catch((e) => {
                    showErrorMessage(e.message, `Failed to enable plugin ${this.headers.name}`);
                })
        } else {
            this.gimloader.pluginManager.save();
        }
    }
}