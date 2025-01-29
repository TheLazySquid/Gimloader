import showErrorMessage from "$src/ui/showErrorMessage";
import debounce from "debounce";
import { log } from "$src/utils";
import { parsePluginHeader } from "$src/parseHeader";
import Plugin from "./plugin.svelte";
import Storage from "$core/storage";

export interface PluginInfo {
    script: string;
    name: string;
    enabled: boolean;
}

class PluginManager {
    plugins: Plugin[] = $state([]);
    destroyed = false;

    getPluginInfo(): PluginInfo[] {
        // load plugins from storage
        let pluginInfo = Storage.getValue('plugins', []);
        if(typeof pluginInfo === 'string') pluginInfo = JSON.parse(pluginInfo);

        // port from old version
        for(let plugin of pluginInfo) {
            if(!plugin.name) {
                let headers = parsePluginHeader(plugin.script);
                plugin.name = headers.name;
            }
        }
    
        return pluginInfo;
    }
    
    async init() {    
        let pluginInfo = this.getPluginInfo();

        // load plugins from storage
        for(let info of pluginInfo) {
            let pluginObj = new Plugin(info.script, info.enabled);
            this.plugins.push(pluginObj);
        }

        let results = await Promise.allSettled(this.plugins.map(p => p.enabled && p.enable(true)));
        let fails = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

        if(fails.length > 0) {
            let msg = fails.map(f => f.reason).join('\n');
            showErrorMessage(msg, `Failed to enable ${fails.length} plugins`);

            this.save();
        }

        log('All plugins loaded');

        // when a plugin is remotely deleted, installed or enabled/disabled reflect that here
        GM_addValueChangeListener('plugins', (_, __, newInfos: PluginInfo[], remote) => {
            if(!remote) return;

            // check for plugins that were added
            for(let info of newInfos) {
                if(!this.getPlugin(info.name)) {
                    this.createPlugin(info.script, false);
                }
            }

            // check for plugins that were removed
            for(let plugin of this.plugins) {
                if(!newInfos.find(i => i.name === plugin.headers.name)) {
                    this.deletePlugin(plugin);
                }
            }

            // check if any scripts were updated
            for(let info of newInfos) {
                let oldPlugin = this.getPlugin(info.name);
                if(!oldPlugin) continue;

                if(oldPlugin.script !== info.script) {
                    oldPlugin.edit(info.script);
                    log(`Updated plugin: ${info.name}`)
                }
            }

            // check if any plugins were enabled/disabled
            for(let info of newInfos) {
                let plugin = this.getPlugin(info.name);
                if(!plugin) continue;

                if((plugin.enabled || plugin.enabling) !== info.enabled) {
                    if(info.enabled) {
                        plugin.enable()
                            .catch((e: Error) => {
                                showErrorMessage(e.message, `Failed to enable plugin ${info.name}`);
                            });
                    }
                    else plugin.disable();
                }
            }

            // move the plugins into the correct order
            let newOrder = [];
            for (let info of newInfos) {
                let plugin = this.getPlugin(info.name);
                if (plugin) newOrder.push(plugin);
            }

            this.plugins = newOrder;
        });
    }

    saveFn() {
        if(this.destroyed) return;

        let pluginObjs: PluginInfo[] = this.plugins.map(p => ({
            script: p.script,
            name: p.headers.name,
            enabled: p.enabled
        }));
    
        Storage.setValue('plugins', pluginObjs);
    }

    saveDebounced = debounce(this.saveFn, 100);

    save() {
        this.saveDebounced();
    }

    getPlugin(name: string) {
        return this.plugins.find(p => p.headers.name === name) ?? null;
    }

    isEnabled(name: string) {
        let plugin = this.getPlugin(name);
        return plugin?.enabled ?? false;
    }

    async createPlugin(script: string, saveFirst = true) {
        let headers = parsePluginHeader(script);
        let existing = this.getPlugin(headers.name);
        if(existing) {
            let conf = confirm(`A plugin named ${headers.name} already exists! Do you want to overwrite it?`);
            if(!conf) return;

            existing.disable();
        }

        let plugin = new Plugin(script, false);
        this.plugins.unshift(plugin);

        if(saveFirst) this.save();

        await plugin.enable()
            .catch((e: Error) => {
                showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`);
            });

        this.save();
    }

    deletePlugin(plugin: Plugin) {
        plugin.disable();
        this.plugins = this.plugins.filter(p => p !== plugin);
        
        Storage.removeAllValues(plugin.headers.name);
        
        this.save();

        log(`Deleted plugin: ${plugin.headers.name}`);
    }

    enableAll() {
        Promise.allSettled(this.plugins.filter(p => !p.enabled).map(p => p.enable()))
            .then(results => {
                let fails = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
                if(fails.length > 0) {
                    let msg = fails.map(f => f.reason).join('\n');
                    showErrorMessage(msg, `Failed to enable ${results.length} plugins`);
                }
            })

        this.save();
    }

    disableAll() {
        for(let plugin of this.plugins) {
            if(plugin.enabled) plugin.disable();
        }

        this.save();
    }

    wipe() {
        for(let plugin of this.plugins) {
            plugin.disable();
        }

        this.plugins = [];
        this.saveFn();
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
}

const pluginManager = new PluginManager();
export default pluginManager;