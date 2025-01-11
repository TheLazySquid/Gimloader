import type { ConfigurableHotkeyOptions, HotkeyOptions } from "$core/hotkeys.svelte";
import Hotkeys from "$core/hotkeys.svelte";
import { error, validate } from "$src/utils";

interface OldConfigurableOptions {
    category: string;
    title: string;
    preventDefault?: boolean;
    defaultKeys?: Set<string>;
}

type KeyboardCallback = (e: KeyboardEvent) => void;

function validateHotkeyOptions(name: string, path: string, options: HotkeyOptions) {
    if(!options.key && !options.keys) {
        error(name, `requires either ${path}.key or ${path}.keys to be present`);
        return false;
    }

    return true;
}

function keySetToCodes(keys: Set<string>) {
    let newKeys: string[] = [];
    for(let key of keys) {
        if(key === "control") newKeys.push("ControlLeft");
        else if(key === "shift") newKeys.push("ShiftLeft");
        else if(key === "alt") newKeys.push("AltLeft");
        else {
            newKeys.push("Key" + key.charAt(0).toUpperCase() + key.slice(1));
        }
    }
    return newKeys;
}

class BaseHotkeysApi {
    /**
     * Releases all keys, needed if a hotkey opens something that will
     * prevent keyup events from being registered, such as an alert
     */
    releaseAll() {
        Hotkeys.releaseAll();
    }

    /** Which key codes are currently being pressed */
    get pressed() { return Hotkeys.pressed };

    /** @deprecated Use {@link pressed} instead */
    get pressedKeys() { return Hotkeys.pressedKeys };
}

class HotkeysApi extends BaseHotkeysApi {
    /** Adds a hotkey with a given id */
    addHotkey(id: string, options: HotkeyOptions, callback: KeyboardCallback) {
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
    addConfigurableHotkey(id: string, options: ConfigurableHotkeyOptions, callback: KeyboardCallback) {
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

    /** @deprecated Use {@link addHotkey} instead */
    add(keys: Set<string>, callback: KeyboardCallback, preventDefault: boolean = false) {
        Hotkeys.addHotkey(keys, {
            keys: keySetToCodes(keys),
            preventDefault
        }, callback);
    }

    /** @deprecated Use {@link removeHotkeys} instead */
    remove(keys: Set<string>) {
        Hotkeys.removeHotkeys(keys);
    }

    /** @deprecated Use {@link addConfigurableHotkey} instead */
    addConfigurable(pluginName: string, hotkeyId: string, callback: KeyboardCallback, options: OldConfigurableOptions) {
        let opts: ConfigurableHotkeyOptions = {
            title: options.title,
            category: options.category
        }
        if(options.preventDefault) opts.preventDefault = true;
        if(options.defaultKeys) opts.default = { keys: keySetToCodes(options.defaultKeys) };

        Hotkeys.addConfigurableHotkey(`${pluginName}-${hotkeyId}`, opts, callback);
    }

    /** @deprecated Use {@link removeConfigurableHotkeys} instead */
    removeConfigurable(pluginName: string, hotkeyId: string) {
        Hotkeys.removeConfigurableHotkeys(`${pluginName}-${hotkeyId}`);
    }
}

class ScopedHotkeysApi extends BaseHotkeysApi {
    constructor(private readonly id: string) { super() }

    /** Adds a hotkey which will fire when certain keys are pressed */
    addHotkey(options: HotkeyOptions, callback: KeyboardCallback) {
        if(!validate("hotkeys.addHotkey", arguments,
            ['options', 'object'], ['callback', 'function'])) return;

        return Hotkeys.addHotkey(this.id, options, callback);
    }
    
    /** Adds a hotkey which can be changed by the user */
    addConfigurableHotkey(options: ConfigurableHotkeyOptions, callback: KeyboardCallback) {
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