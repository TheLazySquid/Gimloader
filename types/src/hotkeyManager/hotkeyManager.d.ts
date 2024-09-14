import type { IConfigurableHotkey, IConfigurableHotkeyOptions, IHotkey } from "../types";
export default class HotkeyManager {
    pressedKeys: Set<string>;
    hotkeys: Map<Set<string>, IHotkey>;
    configurableHotkeys: import("../types").EasyAccessWritable<Map<string, IConfigurableHotkey>>;
    savedHotkeys: Record<string, string[]>;
    constructor();
    releaseAll(): void;
    setPressed(set: Set<string>): boolean;
    checkHotkeys(event: KeyboardEvent): void;
    add(hotkey: Set<string>, callback: (event: KeyboardEvent) => void, preventDefault?: boolean): void;
    remove(hotkey: Set<string>): void;
    addConfigurable(pluginName: string, id: string, callback: (event: KeyboardEvent) => void, options: IConfigurableHotkeyOptions): void;
    removeConfigurable(pluginName: string, id: string): void;
    saveConfigurableHotkeys(): void;
}
