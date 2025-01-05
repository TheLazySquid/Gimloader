interface HotkeyTrigger {
    key?: string;
    keys?: string[];
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
}

interface DefaultHotkeyOptions extends HotkeyTrigger {
    configurable?: false;
    preventDefault?: boolean;
}

interface ConfigurableHotkeyOptions {
    configurable: true;
    category: string;
    title: string;
    preventDefault?: boolean;
    default?: HotkeyTrigger;
}

type HotkeyOptions = DefaultHotkeyOptions | ConfigurableHotkeyOptions;

class HotkeysApi {
    /** Adds a hotkey with a given id */
    addHotkey(id: string, options: HotkeyOptions, callback: (e: KeyboardEvent) => void) {

    }

    /** Removes all hotkeys with a given id */
    removeHotkeys(id: string) {

    }
}

class ScopedHotkeysApi {
    /** Adds a hotkey which will fire when certain keys are pressed */
    addHotkey(options: HotkeyOptions, callback: (e: KeyboardEvent) => void) {

    }
}

Object.freeze(HotkeysApi);
Object.freeze(HotkeysApi.prototype);
Object.freeze(ScopedHotkeysApi);
Object.freeze(ScopedHotkeysApi.prototype);
export { HotkeysApi, ScopedHotkeysApi };