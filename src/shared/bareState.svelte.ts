import type { PluginInfo, Settings } from '$types/state';
import Port from './port.svelte';

export default new class BareState {
    plugins: PluginInfo[] = $state([]);
    settings: Partial<Settings> = $state({});

    init() {
        Port.init((data) => {
            this.plugins.push(...data.plugins);
            Object.assign(this.settings, data.settings);
        
            // keep the plugins synchronised
            Port.on("pluginEdit", ({ name, script, newName }) => {
                let plugin = this.plugins.find(p => p.name === name);
                if(!plugin) return;
        
                plugin.script = script;
                plugin.name = newName;
            });
        
            Port.on("pluginCreate", ({ name, script }) => {
                this.plugins.push({ name, script, enabled: true });
            });
        
            Port.on("pluginDelete", ({ name }) => {
                for(let i = 0; i < this.plugins.length; i++) {
                    if(this.plugins[i].name === name) {
                        this.plugins.splice(i, 1);
                        return;
                    }
                }
            });
        
            Port.on("pluginsDeleteAll", () => {
                this.plugins.splice(0, this.plugins.length);
            });
        
            Port.on("pluginsArrange", ({ order }) => {
                let newOrder: PluginInfo[] = [];
                for(let name in order) {
                    newOrder.push(this.plugins.find(p => p.name === name));
                }
                this.plugins = newOrder;
            });

            Port.on("settingUpdate", ({ key, value }) => {
                this.settings[key] = value;
            });
        });
    }
}