import type { ConfigurableHotkeyOptions, HotkeyOptions } from "$core/hotkeys.svelte";
import Hotkeys from "$core/hotkeys.svelte";
import { error, validate } from "$src/utils";

function validateHotkeyOptions(name: string, path: string, options: HotkeyOptions) {
    if(!options.key && !options.keys) {
        error(name, `requires either ${path}.key or ${path}.keys to be present`);
        return false;
    }

    return true;
}

class HotkeysApi {
    /** Adds a hotkey with a given id */
    addHotkey(id: string, options: HotkeyOptions, callback: (e: KeyboardEvent) => void) {
        if(!validate("hotkeys.addHotkey", arguments, ['id', 'string'],
            ['options', 'object'], ['callback', 'function'])) return;
        if(!validateHotkeyOptions("hotkeys.addHotkey", "options", options)) return;

        return Hotkeys.addHotkey(id, options, callback);
    }

    /** Removes all hotkeys with a given id */
    removeHotkeys(id: string) {
        if(!validate("hotkeys.removeHotkeys", arguments, ['id', 'string'])) return;

        Hotkeys.removeHotkeys(id);
    }

    /** Adds a hotkey which can be changed by the user */
    addConfigurableHotkey(id: string, options: ConfigurableHotkeyOptions, callback: (e: KeyboardEvent) => void) {
        if(!validate("hotkeys.addConfigurableHotkey", arguments, ['id', 'string'],
            ['options', { category: 'string', title: 'string' }], ['callback', 'function'])) return;
        if(options.default && !validateHotkeyOptions("hotkeys.addConfigurableHotkey",
            "options.default", options.default)) return;

        return Hotkeys.addConfigurableHotkey(id, options, callback);
    }

    /** Removes a configurable hotkey with a given id */
    removeConfigurableHotkeys(id: string) {
        if(!validate("hotkeys.removeConfigurableHotkeys", arguments, ['id', 'string'])) return;

        Hotkeys.removeConfigurableHotkeys(id);
    }
}

class ScopedHotkeysApi {
    constructor(private readonly id: string) {}

    /** Adds a hotkey which will fire when certain keys are pressed */
    addHotkey(options: HotkeyOptions, callback: (e: KeyboardEvent) => void) {
        if(!validate("hotkeys.addHotkey", arguments,
            ['options', 'object'], ['callback', 'function'])) return;

        return Hotkeys.addHotkey(this.id, options, callback);
    }
    
    /** Adds a hotkey which can be changed by the user */
    addConfigurableHotkey(options: ConfigurableHotkeyOptions, callback: (e: KeyboardEvent) => void) {
        if(!validate("hotkeys.addConfigurableHotkey", arguments,
            ['options', 'object'], ['callback', 'function'])) return;
        if(options.default && !validateHotkeyOptions("hotkeys.addConfigurableHotkey",
            "options.default", options.default)) return;

        return Hotkeys.addConfigurableHotkey(this.id, options, callback);
    }
}

Object.freeze(HotkeysApi);
Object.freeze(HotkeysApi.prototype);
Object.freeze(ScopedHotkeysApi);
Object.freeze(ScopedHotkeysApi.prototype);
export { HotkeysApi, ScopedHotkeysApi };