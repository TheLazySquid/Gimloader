import type { PluginInfo, Settings } from "$types/state";
import Port from "$shared/port.svelte";

export let plugins: PluginInfo[] = [];
export let settings: Partial<Settings> = {};

Port.init((data) => {
    plugins.push(...data.plugins);
    Object.assign(settings, data.settings);

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

    Port.on("settingUpdate", ({ key, value }) => {
        settings[key] = value;
    });
});