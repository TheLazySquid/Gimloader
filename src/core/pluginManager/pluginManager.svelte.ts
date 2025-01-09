import showErrorMessage from "$src/ui/showErrorMessage";
import debounce from "debounce";
import { log } from "$src/utils";
import { parsePluginHeader } from "$src/parseHeader";
import Plugin from "./plugin.svelte";
import Net from "$core/net/net";
import Storage from "$core/storage";

interface PluginInfo {
    script: string;
    enabled: boolean;
}

class PluginManager {
    plugins: Plugin[] = $state([]);
    runPlugins: boolean;

    constructor(runPlugins: boolean = true) {
        this.runPlugins = runPlugins;

        // load plugins from storage
        let pluginScripts = JSON.parse(GM_getValue('plugins', '[]')!);
        for(let plugin of pluginScripts) {
            let pluginObj = new Plugin(plugin.script, plugin.enabled);
            this.plugins.push(pluginObj);
        }
    }

    async init() {    
        let results = await Promise.allSettled(this.plugins.map(p => p.enabled && p.enable(true)));
        let fails = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

        if(fails.length > 0) {
            let msg = fails.map(f => f.reason).join('\n');
            showErrorMessage(msg, `Failed to enable ${fails.length} plugins`);

            this.save(this.plugins);
        }

        log('All plugins loaded');

        // when a plugin is remotely deleted, installed or enabled/disabled reflect that here
        GM_addValueChangeListener('plugins', (_, __, newVal, remote) => {
            if(!remote) return;
            let newPluginInfos: PluginInfo[] = JSON.parse(newVal);
            let newPlugins = newPluginInfos.map(p => new Plugin(p.script, p.enabled));

            // check for scripts that were added
            for(let newPlugin of newPlugins) {
                if(!this.getPlugin(newPlugin.headers.name)) {
                    newPlugin.enable()
                        .then(() => this.save())
                        .catch((e: Error) => {
                            showErrorMessage(e.message, `Failed to enable plugin ${newPlugin.headers.name}`);
                        });

                    this.plugins.push(newPlugin);
                }
            }

            // check for plugins that were removed
            for(let plugin of this.plugins) {
                if(!newPlugins.find(p => p.headers.name === plugin.headers.name)) {
                    this.deletePlugin(plugin);
                }
            }

            // check if any scripts were updated
            for(let plugin of newPlugins) {
                let oldPlugin = this.getPlugin(plugin.headers.name);
                if(!oldPlugin) continue;

                if(oldPlugin.script !== plugin.script) {
                    oldPlugin.edit(plugin.script, plugin.headers);
                    log(`Updated plugin: ${plugin.headers.name}`)
                }
            }

            // check if any plugins were enabled/disabled
            for(let plugin of newPlugins) {
                let oldPlugin = this.getPlugin(plugin.headers.name);
                if(!oldPlugin) continue;

                if(oldPlugin.enabled !== plugin.enabled) {
                    if(plugin.enabled) {
                        oldPlugin.enable()
                            .catch((e: Error) => {
                                showErrorMessage(e.message, `Failed to enable plugin ${oldPlugin.headers.name}`);
                            });
                    }
                    else oldPlugin.disable();
                }
            }

            // move the plugins into the correct order
            let newOrder = [];
            for (let newPlugin of newPlugins) {
                let plugin = this.getPlugin(newPlugin.headers.name);
                if (plugin) newOrder.push(plugin);
            }

            this.plugins = newOrder;
            // this.plugins = [];
        });
    }

    saveFn() {
        if((window as any).destroyed) return;
        
        let pluginObjs = this.plugins.map(p => ({ script: p.script, enabled: p.enabled }));
    
        GM_setValue('plugins', JSON.stringify(pluginObjs));
    }

    saveDebounced = debounce(this.saveFn, 100);

    save(newPlugins?: Plugin[]) {
        if(newPlugins) this.plugins = newPlugins;
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

            this.deletePlugin(existing);
        }

        let plugin = new Plugin(script, false);
        this.plugins.unshift(plugin);

        if(saveFirst) this.save();

        if(plugin.headers.needsLib.length > 0) {
            let failed = false;
            await Net.downloadLibraries(plugin.headers.needsLib, plugin.headers.name)
                .catch((e) => {
                    failed = true;
                    if(!e) return;
                    showErrorMessage(e, `Some libraries were unable to be downloaded`);
                });
            if(failed) return;
            await plugin.enable()
                .catch((e: Error) => {
                    showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`);
                });
        } else {
            await plugin.enable()
                .catch((e: Error) => {
                    showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`);
                });
        }

        this.save();
    }

    deletePlugin(plugin: Plugin) {
        if(plugin.enabled) plugin.disable();
        let newPlugins = this.plugins.filter(p => p !== plugin);
        
        if(window.GL) {
            Storage.removeAllValues(plugin.headers.name);
        }
        
        this.save(newPlugins);

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
}

const pluginManager = new PluginManager();
export default pluginManager;