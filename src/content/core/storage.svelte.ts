import Port from "$shared/port.svelte";
import type { PluginStorage, Settings } from "$types/state";
import { setShowPluginButtons } from "./ui/addPluginButtons";

const defaultSettings: Settings = {
    pollerEnabled: false,
    autoUpdate: true,
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

        if(this.settings.showPluginButtons) {
            document.documentElement.classList.remove("noPluginButtons");
        }

        Port.on("settingUpdate", ({ key, value }) => this.updateSetting(key, value, false));
        Port.on("pluginValueUpdate", ({ id, key, value }) => this.setPluginValue(id, key, value, false));
        Port.on("pluginValueDelete", ({ id, key }) => this.deletePluginValue(id, key, false));
        Port.on("pluginValuesDelete", ({ id }) => this.deletePluginValues(id, false));
    }

    updateState(values: PluginStorage, settings: Settings) {
        this.values = values;
        this.settings = settings;

        if(this.settings.showPluginButtons) {
            document.documentElement.classList.remove("noPluginButtons");
        } else {
            document.documentElement.classList.add("noPluginButtons");
        }
    }

    updateSetting(key: string, value: any, emit = true) {        
        this.settings[key] = value;
        if(emit) Port.send("settingUpdate", { key, value });

        switch(key) {
            case "showPluginButtons":
                setShowPluginButtons(value);
                break;
        }
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