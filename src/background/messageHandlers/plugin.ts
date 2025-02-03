import type { State } from "$types/state";
import { saveDebounced } from "$bg/state";
import Server from "$bg/server";

export default class PluginsHandler {
    static init() {
        Server.on("pluginEdit", this.onPluginEdit.bind(this));
        Server.on("pluginCreate", this.onPluginCreate.bind(this));
        Server.on("pluginDelete", this.onPluginDelete.bind(this));
        Server.on("pluginToggled", this.onPluginToggled.bind(this));
        Server.on("pluginsArrange", this.onPluginsArrange.bind(this));
        Server.on("pluginsSetAll", this.onPluginsSetAll.bind(this));
        Server.on("pluginsDeleteAll", this.onPluginsDeleteAll.bind(this));
    }

    static save() {
        saveDebounced('plugins');
    }

    static onPluginEdit(state: State, message: any) {
        let edit = state.plugins.find((plugin) => plugin.name === message.name);
        edit.script = message.script;
        edit.name = message.newName;
        this.save();
    }
    
    static onPluginCreate(state: State, message: any) {
        state.plugins.unshift({
            name: message.name,
            script: message.script,
            enabled: true
        });
        this.save();
    }
    
    static onPluginDelete(state: State, message: any) {
        state.plugins = state.plugins.filter(p => p.name !== message.name);
        this.save();
    }
    
    static onPluginToggled(state: State, message: any) {
        let toggle = state.plugins.find(p => p.name === message.name);
        toggle.enabled = message.enabled;
        this.save();
    }
    
    static onPluginsArrange(state: State, message: any) {
        let newPlugins = [];
        for(let name of message.order) {
            let plugin = state.plugins.find((plugin) => plugin.name === name);
            newPlugins.push(plugin);
        }
        state.plugins = newPlugins;
        this.save();
    }
    
    static onPluginsSetAll(state: State, message: any) {
        for(let plugin of state.plugins) {
            plugin.enabled = message.enabled;
        }
        this.save();
    }
    
    static onPluginsDeleteAll(state: State) {
        state.plugins = [];
        this.save();
    }
}