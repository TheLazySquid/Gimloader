import type { StateMessages } from "$types/messages";
import type { State } from "$types/state";
import Server from "$bg/server";
import { saveDebounced } from "$bg/state";
import Updater from "$bg/updater";
import EventEmitter from "eventemitter2";

export default new class SettingsHandler extends EventEmitter {
    init() {
        Server.on("settingUpdate", this.onSettingUpdate.bind(this));   
    }

    save() {
        saveDebounced('settings');
    }

    onSettingUpdate(state: State, message: StateMessages["settingUpdate"]) {
        state.settings[message.key] = message.value;
        this.save();
        this.emit(message.key, message.value);

        if(message.key === "autoUpdate" && message.value === true) {
            // the cooldown is intentionally ignored so you can re-check updates by toggling the setting on and off
            Updater.checkUpdates();
        }
    }
}