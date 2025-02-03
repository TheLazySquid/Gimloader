import Server from "$bg/server";
import { saveDebounced } from "$bg/state";
import type { State } from "$types/state";

export default class SettingsHandler {
    static init() {
        Server.on("settingUpdate", this.onSettingUpdate.bind(this));   
    }

    static save() {
        saveDebounced('settings');
    }

    static onSettingUpdate(state: State, message: any) {
        state.settings[message.key] = message.value;
        this.save();
    }
}