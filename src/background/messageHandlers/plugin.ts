import type { State } from "$types/state";
import { saveDebounced } from "$bg/state";

export function pluginOnUpdate(state: State, type: string, message: any) {
    switch(type) {
        case "pluginEdit":
            let edit = state.plugins.find((plugin) => plugin.name === message.name);
            edit.script = message.script;
            edit.name = message.newName;
            return true;
        case "pluginCreate":
            state.plugins.unshift({
                name: message.name,
                script: message.script,
                enabled: true
            });
            saveDebounced('plugins');
            return true;
        case "pluginDelete":
            state.plugins = state.plugins.filter(p => p.name !== message.name);
            saveDebounced('plugins');
            return true;
        case "pluginToggled":
            let toggle = state.plugins.find(p => p.name === message.name);
            toggle.enabled = message.enabled;
            saveDebounced('plugins');
            return true;
        case "pluginsArrange":
            let newPlugins = [];
            for(let name of message.order) {
                let plugin = state.plugins.find((plugin) => plugin.name === name);
                newPlugins.push(plugin);
            }
            state.plugins = newPlugins;
            saveDebounced('plugins')
            return true;
        case "pluginsSetAll":
            for(let plugin of state.plugins) {
                plugin.enabled = message.enabled;
            }
            saveDebounced('plugins');
            return true;
        case "pluginsDeleteAll":
            state.plugins = [];
            saveDebounced('plugins');
            return true;
    }
    
    return false;
}