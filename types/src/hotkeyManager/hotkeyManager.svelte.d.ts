import { SvelteMap, SvelteSet } from "svelte/reactivity";
import type { HotkeyTrigger, IConfigurableHotkeyOptions, IHotkey, IHotkeyTriggerKey } from "../types";
export declare class ConfigurableHotkey {
    id: string;
    category: string;
    title: string;
    preventDefault: boolean;
    callback: (event: KeyboardEvent) => void;
    trigger: IHotkeyTriggerKey | SvelteSet<string> | null;
    defaultKeys?: Set<string>;
    default?: IHotkeyTriggerKey;
    constructor(manager: HotkeyManager, id: string, callback: (event: KeyboardEvent) => void, options: IConfigurableHotkeyOptions);
    reset(): void;
}
export default class HotkeyManager {
    pressedKeys: Set<string>;
    hotkeys: IHotkey[];
    configurableHotkeys: SvelteMap<string, ConfigurableHotkey>;
    savedHotkeys: Record<string, any>;
    constructor();
    releaseAll(): void;
    setPressed(set: Set<string>): boolean;
    checkHotkeys(event: KeyboardEvent): void;
    checkHotkey(e: KeyboardEvent, hotkey: IHotkey | ConfigurableHotkey): boolean;
    add(trigger: HotkeyTrigger, callback: (event: KeyboardEvent) => void, preventDefault?: boolean): void;
    remove(trigger: HotkeyTrigger): void;
    addConfigurable(pluginName: string, id: string, callback: (event: KeyboardEvent) => void, options: IConfigurableHotkeyOptions): void;
    removeConfigurable(pluginName: string, id: string): void;
    saveConfigurableHotkeys(): void;
}
