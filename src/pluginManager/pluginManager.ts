import { IPluginInfo } from "../types";
import { log } from "../util";
import Plugin from "./plugin";

export default class PluginManager {
    plugins: Plugin[] = [];
    runPlugins: boolean;
    reactSetPlugins?: (plugins: Plugin[]) => void;
    updatePluginTimeout: any;

    constructor(runPlugins: boolean = true) {
        this.runPlugins = runPlugins;
    }

    updatePlugins() {
        if(this.updatePluginTimeout) clearTimeout(this.updatePluginTimeout);

        // update next tick
        this.updatePluginTimeout = setTimeout(() => {
            this.reactSetPlugins?.([...this.plugins]);
        });
    }

    async init() {
        let pluginScripts = JSON.parse(GM_getValue('plugins', '[]')!);

        for(let plugin of pluginScripts) {
            let pluginObj = new Plugin(plugin.script, this, plugin.enabled, true, this.runPlugins);
            this.plugins.push(pluginObj);
        }
    
        await Promise.all(this.plugins.map(p => p.enabled && p.enable(true)));
    
        log('Plugins loaded');

        // when a plugin is remotely deleted, installed or enabled/disabled reflect that here
        GM_addValueChangeListener('plugins', (_, __, newVal, remote) => {
            if(!remote) return;
            let newPluginInfos: IPluginInfo[] = JSON.parse(newVal);
            let newPlugins = newPluginInfos.map(p => new Plugin(p.script, this, p.enabled, true, this.runPlugins));

            // check for scripts that were added
            for(let newPlugin of newPlugins) {
                if(!this.getPlugin(newPlugin.headers.name)) {
                    newPlugin.enable();
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
                    if(plugin.enabled) oldPlugin.enable();
                    else oldPlugin.disable();
                }
            }

            this.updatePlugins();
        })
    }

    save(newPlugins: Plugin[]) {
        this.plugins = newPlugins;
        let pluginObjs = this.plugins.map(p => ({ script: p.script, enabled: p.enabled }));
    
        GM_setValue('plugins', JSON.stringify(pluginObjs));
    }

    getPlugin(name: string) {
        return this.plugins.find(p => p.headers.name === name) ?? null;
    }

    isEnabled(name: string) {
        let plugin = this.getPlugin(name);
        return plugin?.enabled ?? false;
    }

    createPlugin(script: string) {
        let plugin = new Plugin(script, this, true, false, this.runPlugins);
        this.plugins.push(plugin);
        this.save(this.plugins);
        this.updatePlugins();
    }

    deletePlugin(plugin: Plugin) {
        let newPlugins = this.plugins.filter(p => p !== plugin);
        
        if(window.GL) {
            GL.storage.removeAllValues(plugin.headers.name);
        }
        
        this.save(newPlugins);
        this.updatePlugins();

        log(`Deleted plugin: ${plugin.headers.name}`);
    }

    setAll(enabled: boolean) {
        let newPlugins = this.plugins.map(p => {
            if(enabled) p.enable();
            else p.disable();
            return p;
        });

        this.save(newPlugins);
        this.updatePlugins();
    }
}