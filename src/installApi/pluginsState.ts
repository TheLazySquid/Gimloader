import type { PluginInfo } from "$types/state";
import Port from "$shared/port.svelte";

export let plugins: PluginInfo[] = [];
Port.init((data) => {
    plugins.push(...data.plugins);

    // keep the plugins synchronised
    Port.on("pluginEdit", ({ name, script, newName }) => {
        let plugin = plugins.find(p => p.name === name);
        if(!plugin) return;

        plugin.script = script;
        plugin.name = newName;
    });

    Port.on("pluginCreate", ({ name, script }) => {
        plugins.push({ name, script, enabled: true });
    });

    Port.on("pluginDelete", ({ name }) => {
        for(let i = 0; i < plugins.length; i++) {
            if(plugins[i].name === name) {
                plugins.splice(i, 1);
                return;
            }
        }
    });

    Port.on("pluginsDeleteAll", () => {
        plugins.splice(0, plugins.length);
    });
});