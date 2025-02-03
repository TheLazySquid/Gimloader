import Server from "$bg/server";
import type { State } from "$types/state";
import { saveDebounced } from "../state";

export default class StorageHandler {
    static init() {
        Server.on("pluginValueUpdate", this.onPluginValueUpdate.bind(this));
        Server.on("pluginValueDelete", this.onPluginValueDelete.bind(this));
        Server.on("pluginValuesDelete", this.onPluginValuesDelete.bind(this));
    }
    
    static save() {
        saveDebounced('pluginStorage');
    }

    static onPluginValueUpdate(state: State, message: any) {
        if(!state.pluginStorage[message.id]) state.pluginStorage[message.id] = {};
        state.pluginStorage[message.id][message.key] = message.value;
        this.save();
    }

    static onPluginValueDelete(state: State, message: any) {
        delete state.pluginStorage[message.id]?.[message.key];
        this.save();
    }

    static onPluginValuesDelete(state: State, message: any) {
        delete state.pluginStorage[message.id];
        this.save();
    }
}