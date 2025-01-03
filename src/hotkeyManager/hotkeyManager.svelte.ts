import { SvelteMap, SvelteSet } from "svelte/reactivity";
import type { IConfigurableHotkeyOptions, IHotkey } from "../types";

const shiftKeyHeldKeys = `~!@#$%^&*()_+{}|:"<>?`;
const normalKeys = "`1234567890-=[]\\;',./";

export class ConfigurableHotkey {
    id: string;
    category: string;
    title: string;
    preventDefault: boolean;
    callback: (event: KeyboardEvent) => void;
    keys: SvelteSet<string>;
    defaultKeys?: Set<string>;

    constructor(manager: HotkeyManager, id: string, callback: (event: KeyboardEvent) => void,
        options: IConfigurableHotkeyOptions) {
        this.id = id;
        this.category = options.category;
        this.title = options.title;
        this.preventDefault = options.preventDefault ?? true;
        this.defaultKeys = options.defaultKeys;
        this.callback = callback;

        if(manager.savedHotkeys[id]) {
            this.keys = new SvelteSet(manager.savedHotkeys[id]);
        } else if(options.defaultKeys) {
            this.keys = new SvelteSet(options.defaultKeys);
        }
    }
}

export default class HotkeyManager {
    pressedKeys: Set<string> = new Set();
    hotkeys: Map<Set<string>, IHotkey> = new Map();
    configurableHotkeys = new SvelteMap<string, ConfigurableHotkey>();
    savedHotkeys: Record<string, string[]> = GM_getValue('configurableHotkeys', {});

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
        for (let [hotkey, run] of this.hotkeys.entries()) {
            if (this.setPressed(hotkey)) {
                if(run.preventDefault) event.preventDefault();
                run.callback(event);
            }
        }

        for(let hotkey of this.configurableHotkeys.values()) {
            if (this.setPressed(hotkey.keys)) {
                if(hotkey.preventDefault) event.preventDefault();
                hotkey.callback(event);
            }
        }
    }

    add(hotkey: Set<string>, callback: (event: KeyboardEvent) => void, preventDefault: boolean = true) {
        this.hotkeys.set(hotkey, { callback, preventDefault });
    }

    remove(hotkey: Set<string>) {
        this.hotkeys.delete(hotkey);
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
            this.savedHotkeys[id] = Array.from(hotkey.keys);
        }

        GM_setValue('configurableHotkeys', this.savedHotkeys);
    }
}