import type { ConfigurableHotkeyOptions, HotkeyTrigger } from "$types/hotkeys";
import Hotkeys from './hotkeys.svelte';

type Callback = (e: KeyboardEvent) => void;

export default class ConfigurableHotkey {
    id: string;
    category: string;
    title: string;
    preventDefault: boolean;
    callback: Callback;
    trigger: HotkeyTrigger | null = $state(null);
    default?: HotkeyTrigger;
    pluginName?: string;

    constructor(id: string, callback: Callback, options: ConfigurableHotkeyOptions, pluginName?: string) {
        this.id = id;
        this.category = options.category;
        this.title = options.title;
        this.preventDefault = options.preventDefault ?? true;
        this.default = options.default;
        this.callback = callback;
        this.pluginName = pluginName;

        this.loadTrigger();
    }

    loadTrigger() {
        if(Hotkeys.savedHotkeys[this.id] === null) {
            this.trigger = null;
        } else if(Hotkeys.savedHotkeys[this.id]) {
            this.trigger = Object.assign({}, Hotkeys.savedHotkeys[this.id]);
        } else if(this.default) {
            this.trigger = Object.assign({}, this.default);
        }
    }

    reset() {
        if(this.default) this.trigger = Object.assign({}, this.default);
        else this.trigger = null;
    }
}