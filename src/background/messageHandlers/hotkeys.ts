import type { State } from "$types/state";
import type { StateMessages } from "$types/messages";
import { saveDebounced } from "$bg/state";
import Server from "$bg/server";

export default class HotkeysHandler {
    static init() {
        Server.on("hotkeyUpdate", this.onHotkeyUpdate.bind(this));
        Server.on("hotkeysUpdate", this.onHotkeysUpdate.bind(this));
    }

    static save() {
        saveDebounced('hotkeys');
    }

    static onHotkeyUpdate(state: State, message: StateMessages["hotkeyUpdate"]) {
        state.hotkeys[message.id] = message.trigger;
        this.save();
    }

    static onHotkeysUpdate(state: State, message: StateMessages["hotkeysUpdate"]) {
        state.hotkeys = message.hotkeys;
        this.save();
    }
}