import Server from "$bg/server";
import { saveDebounced } from "$bg/state";
import type { State } from "$types/state";
import EventEmitter from "eventemitter2";

export default new class SettingsHandler extends EventEmitter {
    init() {
        Server.on("settingUpdate", this.onSettingUpdate.bind(this));   
    }

    save() {
        saveDebounced('settings');
    }

    onSettingUpdate(state: State, message: any) {
        state.settings[message.key] = message.value;
        this.save();
        this.emit(message.key, message.value);
    }
}