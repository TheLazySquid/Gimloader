import { splicer } from "$src/utils";
import Storage from "./storage";

/** @inline */
export interface HotkeyTrigger {
    /** Should be a keyboardevent [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) */
    key?: string;
    /** Should be keyboardevent [codes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) */
    keys?: string[];
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
}

/** @inline */
export interface HotkeyOptions extends HotkeyTrigger {
    preventDefault?: boolean;
}

/** @inline */
export interface ConfigurableHotkeyOptions {
    category: string;
    /** There should be no duplicate titles within a category */
    title: string;
    preventDefault?: boolean;
    default?: HotkeyTrigger;
}

type Callback = (e: KeyboardEvent) => void;
type DefaultHotkey = HotkeyOptions & { callback: Callback, id: string };

export class ConfigurableHotkey {
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

        if(hotkeys.savedHotkeys[id] === null) {
            this.trigger = null;
        } else if(hotkeys.savedHotkeys[id]) {
            this.trigger = Object.assign({}, hotkeys.savedHotkeys[id]);
        } else if(this.default) {
            this.trigger = Object.assign({}, this.default);
        }
    }

    reset() {
        if(this.default) this.trigger = Object.assign({}, this.default);
        else this.trigger = null;
    }
}

class Hotkeys {
    hotkeys: DefaultHotkey[] = [];
    configurableHotkeys: ConfigurableHotkey[] = $state([]);
    pressedKeys = new Set<string>();
    pressed = new Set<string>();
    savedHotkeys: Record<string, any> = Storage.getValue('configurableHotkeys', {});

    init() {
        window.addEventListener('keydown', (event) => {
            this.pressed.add(event.code);
            this.pressedKeys.add(event.key.toLowerCase());
            this.checkHotkeys(event);
        });

        window.addEventListener('keyup', (event) => {
            this.pressed.delete(event.code);
            this.pressedKeys.delete(event.key.toLowerCase());
        });

        window.addEventListener('blur', () => {
            this.releaseAll();
        });

        GM_addValueChangeListener('configurableHotkeys', (_, __, saved, remote) => {
            if(!remote) return;

            // check if any were changed
            for(let id in saved) {
                let existing = this.configurableHotkeys.find(h => h.id === id);
                if(existing && existing.trigger != saved[id]) {
                    existing.trigger = saved[id];
                }
            }

            this.savedHotkeys = saved;
        });
    }

    addHotkey(id: any, options: HotkeyOptions, callback: Callback) {
        let obj = { ...options, id, callback };
        this.hotkeys.push(obj);

        return splicer(this.hotkeys, obj);
    }

    removeHotkeys(id: any) {
        for(let i = 0; i < this.hotkeys.length; i++) {
            if(this.hotkeys[i].id === id) {
                this.hotkeys.splice(i, 1);
                i--;
            }
        }
    }
    
    addConfigurableHotkey(id: string, options: ConfigurableHotkeyOptions, callback: Callback, pluginName?: string) {
        let obj = new ConfigurableHotkey(id, callback, options, pluginName);
        this.configurableHotkeys.push(obj);

        return splicer(this.configurableHotkeys, obj);
    }

    removeConfigurableHotkey(id: string) {
        for(let i = 0; i < this.configurableHotkeys.length; i++) {
            if(this.configurableHotkeys[i].id === id) {
                this.configurableHotkeys.splice(i, 1);
                i--;
            }
        }
    }

    removeConfigurableFromPlugin(pluginName: string) {
        for(let i = 0; i < this.configurableHotkeys.length; i++) {
            if(this.configurableHotkeys[i].pluginName === pluginName) {
                this.configurableHotkeys.splice(i, 1);
                i--;
            }
        }
    }

    releaseAll() {
        this.pressed.clear();
        this.pressedKeys.clear();
    }

    checkHotkeys(e: KeyboardEvent) {
        for(let hotkey of this.hotkeys) {
            if(this.checkTrigger(e, hotkey)) {
                if(hotkey.preventDefault || hotkey.preventDefault === undefined) e.preventDefault();
                hotkey.callback(e);
            }
        }

        for(let hotkey of this.configurableHotkeys) {
            if(hotkey.trigger && this.checkTrigger(e, hotkey.trigger)) {
                if(hotkey.preventDefault) e.preventDefault();
                hotkey.callback(e);
            }
        }
    }

    checkTrigger(e: KeyboardEvent, trigger: HotkeyTrigger) {
        if(trigger.key) {
            if(trigger.key != e.code) return false;
        } else {
            if(!trigger.keys.includes(e.code)) return false;

            for(let key of trigger.keys) {
                if(!this.pressed.has(key)) return false;
            }
        }

        return (!(trigger.ctrl && !e.ctrlKey) &&
        !(trigger.alt && !e.altKey) &&
        !(trigger.shift && !e.shiftKey));
    }

    saveConfigurableHotkeys() {
        for(let hotkey of this.configurableHotkeys) {
            this.savedHotkeys[hotkey.id] = hotkey.trigger;
        }

        Storage.setValue('configurableHotkeys', this.savedHotkeys);
    }
}

const hotkeys = new Hotkeys();
export default hotkeys;