import type { State } from "$types/state";
import { saveDebounced } from "../state";

export function storageOnUpdate(state: State, type: string, message: any) {
    switch(type) {
        // update plugin storage
        case "pluginValueUpdate":
            if(!state.pluginStorage[message.id]) state.pluginStorage[message.id] = {};
            state.pluginStorage[message.id][message.key] = message.value;
            saveDebounced('pluginStorage');
            return true;

        case "pluginValueDelete":
            delete state.pluginStorage[message.id]?.[message.key];
            saveDebounced('pluginStorage');
            return true;

        case "pluginValuesDelete":
            delete state.pluginStorage[message.id];
            saveDebounced('pluginStorage');
            return true;

        // update settings
        case "settingUpdate":
            state.settings[message.key] = message.value;
            saveDebounced('settings');
            return true;
    }

    return false;
}