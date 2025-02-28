import { splicer } from "$content/utils";
import Port from "$shared/port.svelte";
import type { PluginStorage, Settings } from "$types/state";
import { setShowPluginButtons } from "./ui/addPluginButtons";

export type ValueChangeCallback = (value: any, remote: boolean) => void;

interface ValueChangeListener {
    id: string;
    key: string;
    callback: ValueChangeCallback;
}

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
    updateListeners: ValueChangeListener[] = [];

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

        for(let listener of this.updateListeners) {
            if(listener.id === id && listener.key === key) {
                // if we are emitting it's not remote, and vice versa
                listener.callback(value, !emit);
            }
        }

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

    onPluginValueUpdate(id: string, key: string, callback: ValueChangeCallback) {
        let obj: ValueChangeListener = { id, key, callback };
        this.updateListeners.push(obj);

        return splicer(this.updateListeners, obj);
    }

    offPluginValueUpdate(id: string, key: string, callback: ValueChangeCallback) {
        for(let i = 0; i < this.updateListeners.length; i++) {
            let listener = this.updateListeners[i];
            if(listener.id === id && listener.key === key && listener.callback === callback) {
                this.updateListeners.splice(i, 1);
                return;
            }
        }
    }

    removeUpdateListeners(id: string) {
        for(let i = 0; i < this.updateListeners.length; i++) {
            if(this.updateListeners[i].id === id) {
                this.updateListeners.splice(i, 1);
                i--;
            }
        }
    }
}