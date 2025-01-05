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
declare class HotkeysApi {
    /** Adds a hotkey with a given id */
    addHotkey(id: string, options: HotkeyOptions, callback: (e: KeyboardEvent) => void): void;
    /** Removes all hotkeys with a given id */
    removeHotkeys(id: string): void;
}
declare class ScopedHotkeysApi {
    /** Adds a hotkey which will fire when certain keys are pressed */
    addHotkey(options: HotkeyOptions, callback: (e: KeyboardEvent) => void): void;
}
export { HotkeysApi, ScopedHotkeysApi };
