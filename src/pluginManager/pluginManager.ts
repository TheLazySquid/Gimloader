import type { Gimloader } from "$src/gimloader";
import downloadLibraries from "$src/net/downloadLibraries";
import showErrorMessage from "$src/ui/showErrorMessage";
import debounce from "debounce";
import type { IPluginInfo } from "../types";
import { easyAccessWritable, log, parsePluginHeader } from "../util";
import Plugin from "./plugin";

export default class PluginManager {
    gimloader: Gimloader;
    plugins = easyAccessWritable<Plugin[]>([]);
    runPlugins: boolean;

    constructor(gimloader: Gimloader, runPlugins: boolean = true) {
        this.gimloader = gimloader;
        this.runPlugins = runPlugins;

        // load plugins from storage
        let pluginScripts = JSON.parse(GM_getValue('plugins', '[]')!);
        for(let plugin of pluginScripts) {
            let pluginObj = new Plugin(this.gimloader, plugin.script, plugin.enabled);
            this.plugins.value.push(pluginObj);
        }
    }

    async init() {    
        let results = await Promise.allSettled(this.plugins.value.map(p => p.enabled && p.enable(true)));
        let fails = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];

        if(fails.length > 0) {
            let msg = fails.map(f => f.reason).join('\n');
            showErrorMessage(msg, `Failed to enable ${fails.length} plugins`);

            this.save(this.plugins.value);
        }

        log('All plugins loaded');

        // when a plugin is remotely deleted, installed or enabled/disabled reflect that here
        GM_addValueChangeListener('plugins', (_, __, newVal, remote) => {
            if(!remote) return;
            let newPluginInfos: IPluginInfo[] = JSON.parse(newVal);
            let newPlugins = newPluginInfos.map(p => new Plugin(this.gimloader, p.script, p.enabled));

            // check for scripts that were added
            for(let newPlugin of newPlugins) {
                if(!this.getPlugin(newPlugin.headers.name)) {
                    newPlugin.enable()
                        .then(() => this.save())
                        .catch((e: Error) => {
                            showErrorMessage(e.message, `Failed to enable plugin ${newPlugin.headers.name}`);
                        });

                    this.plugins.value.push(newPlugin);
                }
            }

            // check for plugins that were removed
            for(let plugin of this.plugins.value) {
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
            this.plugins.set(newOrder);
        });
    }

    saveFn() {
        let pluginObjs = this.plugins.value.map(p => ({ script: p.script, enabled: p.enabled }));
    
        GM_setValue('plugins', JSON.stringify(pluginObjs));
    }

    saveDebounced = debounce(this.saveFn, 100);

    save(newPlugins?: Plugin[]) {
        if(newPlugins) this.plugins.set(newPlugins);
        this.saveDebounced();
    }

    getPlugin(name: string) {
        return this.plugins.value.find(p => p.headers.name === name) ?? null;
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

        let plugin = new Plugin(this.gimloader, script, false);
        this.plugins.value.unshift(plugin);

        if(saveFirst) this.save();
        this.plugins.update();

        if(plugin.headers.needsLib.length > 0) {
            let success = await downloadLibraries(plugin.headers.needsLib, plugin.headers.name);
            if(success) await plugin.enable();
        } else {
            await plugin.enable()
                .catch((e: Error) => {
                    showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`);
                });
        }

        this.save();
        this.plugins.update();
    }

    deletePlugin(plugin: Plugin) {
        if(plugin.enabled) plugin.disable();
        let newPlugins = this.plugins.value.filter(p => p !== plugin);
        
        if(window.GL) {
            GL.storage.removeAllValues(plugin.headers.name);
        }
        
        this.save(newPlugins);
        this.plugins.update();

        log(`Deleted plugin: ${plugin.headers.name}`);
    }

    enableAll() {
        Promise.allSettled(this.plugins.value.filter(p => !p.enabled).map(p => p.enable()))
            .then(results => {
                let fails = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
                if(fails.length > 0) {
                    let msg = fails.map(f => f.reason).join('\n');
                    showErrorMessage(msg, `Failed to enable ${results.length} plugins`);
                }
            })

        this.save();
        this.plugins.update();
    }

    disableAll() {
        for(let plugin of this.plugins.value) {
            if(plugin.enabled) plugin.disable();
        }

        this.save();
    }
}