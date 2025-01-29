import type { State } from "$types/state";
import { saveDebounced } from "$bg/state";

export function hotkeysOnUpdate(state: State, type: string, message: any) {
    switch(type) {
        case "hotkeyUpdate":
            state.hotkeys[message.id] = message.trigger;
            saveDebounced('hotkeys');
            return true
        case "hotkeysUpdate":
            state.hotkeys = message.hotkeys;
            saveDebounced('hotkeys');
            return true;
    }

    return false;
}