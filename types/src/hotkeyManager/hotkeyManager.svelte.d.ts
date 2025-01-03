import { SvelteMap, SvelteSet } from "svelte/reactivity";
import type { IConfigurableHotkeyOptions, IHotkey } from "../types";
export declare class ConfigurableHotkey {
    id: string;
    category: string;
    title: string;
    preventDefault: boolean;
    callback: (event: KeyboardEvent) => void;
    keys: SvelteSet<string>;
    defaultKeys?: Set<string>;
    constructor(manager: HotkeyManager, id: string, callback: (event: KeyboardEvent) => void, options: IConfigurableHotkeyOptions);
}
export default class HotkeyManager {
    pressedKeys: Set<string>;
    hotkeys: Map<Set<string>, IHotkey>;
    configurableHotkeys: SvelteMap<string, ConfigurableHotkey>;
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
