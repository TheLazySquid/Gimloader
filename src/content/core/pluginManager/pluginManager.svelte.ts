import showErrorMessage from "$content/ui/showErrorMessage";
import debounce from "debounce";
import { log } from "$content/utils";
import { parsePluginHeader } from "$shared/parseHeader";
import Plugin from "./plugin.svelte";
import Storage from "$content/core/storage.svelte";
import type { PluginInfo } from "$types/state";
import Port from "$shared/port.svelte";

class PluginManager {
    plugins: Plugin[] = $state([]);
    destroyed = false;
    
    async init(pluginInfo: PluginInfo[]) {    
        // load plugins from storage
        for(let info of pluginInfo) {
            let pluginObj = new Plugin(info.script, info.enabled);
            this.plugins.push(pluginObj);
        }

        Port.on("pluginEdit", ({ name, script }) => this.editPlugin(name, script, false));
        Port.on("pluginCreate", ({ script }) => this.createPlugin(script, false));
        Port.on("pluginDelete", ({ name }) => this.deletePlugin(name, false));
        Port.on("pluginToggled", ({ name, enabled }) => this.setEnabled(name, enabled, false));
        Port.on("pluginsArrange", ({ order }) => this.arrangePlugins(order, false));
        Port.on("pluginsSetAll", ({ enabled }) => this.setAll(enabled, false));
        Port.on("pluginsDeleteAll", () => this.deleteAll(false));

        let results = await Promise.allSettled(this.plugins.filter(p => p.enabled).map(p => p.launch(true)));
        let fails = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

        if(fails.length > 0) {
            let msg = fails.map(f => f.reason).join('\n');
            showErrorMessage(msg, `Failed to enable ${fails.length} plugins`);
        }

        log('All plugins loaded');
    }

    getPlugin(name: string) {
        return this.plugins.find(p => p.headers.name === name) ?? null;
    }

    isEnabled(name: string) {
        let plugin = this.getPlugin(name);
        return (plugin?.enabled ?? false) && !plugin?.errored;
    }

    async createPlugin(script: string, emit = true) {
        let headers = parsePluginHeader(script);
        let existing = this.getPlugin(headers.name);
        if(existing) {
            let conf = confirm(`A plugin named ${headers.name} already exists! Do you want to overwrite it?`);
            if(!conf) return;

            existing.stop();
        }

        let plugin = new Plugin(script, true);
        this.plugins.unshift(plugin);

        if(emit) Port.send("pluginCreate", { name: headers.name, script });

        plugin.launch()
            .catch((e: Error) => {
                showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`);
            });
    }

    deletePlugin(name: Plugin | string, emit = true) {
        let plugin = typeof name === "string" ? this.getPlugin(name) : name;
        if(!plugin) return;

        plugin.stop();
        this.plugins = this.plugins.filter(p => p !== plugin);

        if(emit) Port.send("pluginDelete", { name: plugin.headers.name });
        
        Storage.deletePluginValues(plugin.headers.name);
        
        log(`Deleted plugin: ${plugin.headers.name}`);
    }

    deleteAll(emit = true) {
        for(let plugin of this.plugins) this.deletePlugin(plugin, false);
        this.plugins = [];

        if(emit) Port.send("pluginsDeleteAll");
    }

    setAll(enabled: boolean, emit = true) {
        if(emit) Port.send("pluginsSetAll", { enabled });
        for(let plugin of this.plugins) plugin.enabled = enabled;

        if(enabled) {
            Promise.allSettled(this.plugins.filter(p => !p.enabled).map(p => p.launch()))
                .then(results => {
                    let fails = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
                    if(fails.length > 0) {
                        let msg = fails.map(f => f.reason).join('\n');
                        showErrorMessage(msg, `Failed to enable ${results.length} plugins`);
                    }
                })
        } else {
            for(let plugin of this.plugins) {
                if(plugin.enabled) plugin.stop();
            }
        }
    }

    getExports(pluginName: string) {
        let plugin = this.plugins.find(lib => lib.headers.name === pluginName);
        return plugin?.return ?? null;
    }

    getHeaders(pluginName: string) {
        let plugin = this.plugins.find(lib => lib.headers.name === pluginName);
        if(!plugin.headers) return null;
        return $state.snapshot(plugin.headers);
    }

    getPluginNames(): string[] {
        return this.plugins.map(p => p.headers.name);
    }

    editPlugin(name: Plugin | string, script: string, emit = true) {
        let plugin = typeof name === "string" ? this.getPlugin(name) : name;
        if(!plugin) return;

        let headers = parsePluginHeader(script);

        // message other windows
        if(emit) Port.send("pluginEdit", { name: plugin.headers.name, script, newName: headers.name });

        if(plugin.enabled) plugin.stop(true);
        plugin.script = script;
        plugin.headers = headers;

        if(plugin.enabled) {
            plugin.launch(false, true)
                .catch((e) => {
                    showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`);
                });
        }
    }

    arrangePlugins(order: string[], emit = true) {
        let newOrder = [];

        for (let name of order) {
            let plugin = this.getPlugin(name);
            if (plugin) newOrder.push(plugin);
        }
        this.plugins = newOrder;

        if(emit) Port.send("pluginsArrange", { order });
    }

    async setEnabled(name: Plugin | string, enabled: boolean, emit = true) {
        let plugin = typeof name === "string" ? this.getPlugin(name) : name;
        if(!plugin) return;
        
        if(enabled) {
            plugin.enabled = true;
            if(emit) Port.send("pluginToggled", { name: plugin.headers.name, enabled: true });
            await plugin.launch()
                .catch((e) => {
                    if(!e?.message) return;
                    showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`);
                });
        } else {
            plugin.stop();
            plugin.enabled = false;
            if(emit) Port.send("pluginToggled", { name: plugin.headers.name, enabled: false });
        }
    }
}

const pluginManager = new PluginManager();
export default pluginManager;