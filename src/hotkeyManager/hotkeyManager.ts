import { easyAccessWritable } from "$src/util";
import type { IConfigurableHotkey, IConfigurableHotkeyOptions, IHotkey } from "../types";

const shiftKeyHeldKeys = `~!@#$%^&*()_+{}|:"<>?`;
const normalKeys = "`1234567890-=[]\\;',./";

export default class HotkeyManager {
    pressedKeys: Set<string> = new Set();
    hotkeys: Map<Set<string>, IHotkey> = new Map();
    configurableHotkeys = easyAccessWritable(new Map<string, IConfigurableHotkey>());
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

        for(let hotkey of this.configurableHotkeys.value.values()) {
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

        let set: Set<string> = new Set();
        if(this.savedHotkeys[hotkeyId]) {
            set = new Set(this.savedHotkeys[hotkeyId]);
        } else if(options.defaultKeys) {
            set = options.defaultKeys;
        }

        let hotkey: IConfigurableHotkey = {
            id: hotkeyId,
            category: options.category,
            title: options.title,
            preventDefault: options.preventDefault ?? true,
            callback,
            keys: set,
            defaultKeys: options.defaultKeys
        };

        this.configurableHotkeys.value.set(hotkeyId, hotkey);
        this.configurableHotkeys.update();
    }

    removeConfigurable(pluginName: string, id: string) {
        this.configurableHotkeys.value.delete(`${pluginName}-${id}`);
    }

    saveConfigurableHotkeys() {
        this.savedHotkeys = {};
        for(let [id, hotkey] of this.configurableHotkeys.value.entries()) {
            this.savedHotkeys[id] = Array.from(hotkey.keys);
        }

        GM_setValue('configurableHotkeys', this.savedHotkeys);
    }
}