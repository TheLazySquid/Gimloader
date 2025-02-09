import Port from "$shared/port.svelte";
import type { PluginStorage, Settings } from "$types/state";

const defaultSettings: Settings = {
    pollerEnabled: false,
    autoUpdate: false,
    autoDownloadMissingLibs: true,
    menuView: 'grid',
    showPluginButtons: true
}

export default new class Storage {
    settings: Settings = $state(defaultSettings);
    values: PluginStorage;

    init(values: PluginStorage, settings: Settings) {
        this.values = values;
        this.settings = settings;

        Port.on("settingUpdate", ({ key, value }) => this.updateSetting(key, value, false));
        Port.on("pluginValueUpdate", ({ id, key, value }) => this.setPluginValue(id, key, value, false));
        Port.on("pluginValueDelete", ({ id, key }) => this.deletePluginValue(id, key, false));
        Port.on("pluginValuesDelete", ({ id }) => this.deletePluginValues(id, false));
    }

    updateSetting(key: string, value: any, emit = true) {
        this.settings[key] = value;
        if(emit) Port.send("settingUpdate", { key, value });
    }

    getPluginValue(id: string, key: string, defaultVal?: any) {
        let val = this.values[id]?.[key];
        if(val !== undefined) return val;
        return defaultVal ?? null;
    }
    
    setPluginValue(id: string, key: string, value: any, emit = true) {
        if(!this.values[id]) this.values[id] = {};
        this.values[id][key] = value;
        if(emit) Port.send("pluginValueUpdate", { id, key, value });
    }

    deletePluginValue(id: string, key: string, emit = true) {
        let plugin = this.values[id];
        if(!plugin) return;
        delete plugin[key];
        if(emit) Port.send("pluginValueDelete", { id, key });
    }
    
    deletePluginValues(id: string, emit = true) {
        delete this.values[id];
        if(emit) Port.send("pluginValuesDelete", { id });
    }
}