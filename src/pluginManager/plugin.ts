import parseHeader from "./parseHeader";
import { log } from "../util";
import type PluginManager from "./pluginManager";

export default class Plugin {
    script: string;
    pluginManager: PluginManager;
    enabled: boolean;
    headers: Record<string, string>;
    return: any;
    runPlugin: boolean;

    constructor(script: string, pluginManager: PluginManager, enabled = true, initial = false, runPlugin = true) {
        this.script = script;
        this.pluginManager = pluginManager;
        this.enabled = enabled;
        this.runPlugin = runPlugin;
    
        this.headers = parseHeader(script);

        // we are going to manually call enable on the first load
        if(enabled && !initial) {
            this.enable(initial);
        }
    }

    async enable(initial: boolean = false) {
        this.enabled = true;
        this.pluginManager.updatePlugins();
        if(!this.runPlugin) return;

        // create a blob from the script and import it
        let blob = new Blob([this.script], { type: 'application/javascript' });
        let url = URL.createObjectURL(blob);
        
        let returnVal = await import(url);
        this.return = returnVal;

        log(`Loaded plugin: ${this.headers.name}`);
        
        if(!initial) {
            if(this.headers.reloadRequired === 'true' || this.headers.reloadRequired === '') {
                let reload = confirm(`${this.headers.name} requires a reload to function properly. Reload now?`);
                if(reload) {
                    location.reload();
                }
            }
        }
    }

    disable() {
        this.enabled = false;
        this.pluginManager.updatePlugins();
        if(!this.runPlugin) return;

        if(this.return) {
            try {
                this.return?.onStop?.();
            } catch (e) {
                log(`Error stopping plugin ${this.headers.name}:`, e);
            }
        }

        this.return = null;
    }

    edit(script: string, headers: Record<string, string>) {
        let enabled = this.enabled;
        this.disable();
        this.script = script;
        this.headers = headers;
        if(enabled) this.enable();

        this.pluginManager.save(this.pluginManager.plugins);
        this.pluginManager.updatePlugins();
    }
}