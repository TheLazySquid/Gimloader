import { SvelteMap, SvelteSet } from "svelte/reactivity";
import type { HotkeyTrigger, IConfigurableHotkeyOptions, IHotkey, IHotkeyTriggerKey } from "../types";

const shiftKeyHeldKeys = `~!@#$%^&*()_+{}|:"<>?`;
const normalKeys = "`1234567890-=[]\\;',./";

export class ConfigurableHotkey {
    id: string;
    category: string;
    title: string;
    preventDefault: boolean;
    callback: (event: KeyboardEvent) => void;
    trigger: IHotkeyTriggerKey | SvelteSet<string> | null = $state();
    defaultKeys?: Set<string>;
    default?: IHotkeyTriggerKey;

    constructor(manager: HotkeyManager, id: string, callback: (event: KeyboardEvent) => void,
        options: IConfigurableHotkeyOptions) {
        this.id = id;
        this.category = options.category;
        this.title = options.title;
        this.preventDefault = options.preventDefault ?? true;
        this.defaultKeys = options.defaultKeys;
        this.default = options.default;
        this.callback = callback;

        let saved = manager.savedHotkeys[id];
        if(saved !== undefined) {
            if(Array.isArray(saved)) {
                this.trigger = new SvelteSet(saved);
            } else if(saved !== null) {
                this.trigger = Object.assign({}, saved);
            } else {
                this.trigger = null;
            }
        } else this.reset();
    }

    reset() {
        if(this.defaultKeys) {
            this.trigger = new SvelteSet(this.defaultKeys);
        } else if(this.default) {
            this.trigger = Object.assign({}, this.default);
        } else {
            this.trigger = null;
        }
    }
}

export default class HotkeyManager {
    pressedKeys: Set<string> = new Set();
    hotkeys: IHotkey[] = [];
    configurableHotkeys = new SvelteMap<string, ConfigurableHotkey>();
    savedHotkeys: Record<string, any> = GM_getValue('configurableHotkeys', {});

    constructor() {
        window.addEventListener('keydown', (event) => {
            this.pressedKeys.add(event.key.toLowerCase());
            this.checkHotkeys(event);
        });

        window.addEventListener('keyup', (event) => {
            this.pressedKeys.delete(event.key.toLowerCase());

            // keys can sometimes get stuck if the keyup event is not fired
            let index = normalKeys.indexOf(event.key);
            if (index > -1) this.pressedKeys.delete(shiftKeyHeldKeys[index]);
        });

        window.addEventListener('blur', () => {
            this.releaseAll();
        });
    }

    releaseAll() {
        this.pressedKeys.clear();
    }

    setPressed(set: Set<string>) {
        if(set.size === 0) return false;
        if (this.pressedKeys.size < set.size) return false;

        let match = true;
        for (let key of set) {
            if (!this.pressedKeys.has(key)) {
                match = false;
                break;
            }
        }

        return match;
    }

    checkHotkeys(event: KeyboardEvent) {
        for (let hotkey of this.hotkeys.values()) {
            if (this.checkHotkey(event, hotkey)) {
                if(hotkey.preventDefault) event.preventDefault();
                hotkey.callback(event);
            }
        }

        for(let hotkey of this.configurableHotkeys.values()) {
            if (this.checkHotkey(event, hotkey)) {
                if(hotkey.preventDefault) event.preventDefault();
                hotkey.callback(event);
            }
        }
    }

    checkHotkey(e: KeyboardEvent, hotkey: IHotkey | ConfigurableHotkey) {
        if(!hotkey.trigger) return false;
        if(hotkey.trigger instanceof Set || hotkey.trigger instanceof SvelteSet) {
            return this.setPressed(hotkey.trigger);
        }
        return (
            hotkey.trigger.key == e.code &&
            !(hotkey.trigger.ctrl && !e.ctrlKey) &&
            !(hotkey.trigger.alt && !e.altKey) &&
            !(hotkey.trigger.shift && !e.shiftKey)
        )
    }

    add(trigger: HotkeyTrigger, callback: (event: KeyboardEvent) => void, preventDefault: boolean = true) {
        this.hotkeys.push({
            trigger,
            callback,
            preventDefault
        });
    }

    remove(trigger: HotkeyTrigger) {
        for(let i = 0; i < this.hotkeys.length; i++) {
            if(this.hotkeys[i].trigger === trigger) {
                this.hotkeys.splice(i, 1);
                return;
            }
        }
    }

    addConfigurable(pluginName: string, id: string, callback: (event: KeyboardEvent) => void, options: IConfigurableHotkeyOptions) {
        if(!pluginName) throw new Error('Configurable hotkey missing plugin name');
        if(!id) throw new Error('Configurable hotkey missing id');

        let mandatory = ['category', 'title'];
        for (let key of mandatory) {
            if (!options[key]) throw new Error(`Configurable hotkey missing mandatory option ${key}`);
        }

        let hotkeyId = `${pluginName}-${id}`;

        let hotkey = new ConfigurableHotkey(this, hotkeyId, callback, options);

        this.configurableHotkeys.set(hotkeyId, hotkey);
    }

    removeConfigurable(pluginName: string, id: string) {
        this.configurableHotkeys.delete(`${pluginName}-${id}`);
    }

    saveConfigurableHotkeys() {
        this.savedHotkeys = {};
        for(let [id, hotkey] of this.configurableHotkeys.entries()) {
            if(hotkey.trigger instanceof SvelteSet) {
                this.savedHotkeys[id] = Array.from(hotkey.trigger);
            } else if(hotkey.trigger !== null) {
                this.savedHotkeys[id] = Object.assign({}, hotkey.trigger);
            } else {
                this.savedHotkeys[id] = null;
            }
        }

        GM_setValue('configurableHotkeys', this.savedHotkeys);
    }
}