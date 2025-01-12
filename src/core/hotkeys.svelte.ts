import { splicer } from "$src/utils";
import Storage from "./storage";

export interface HotkeyTrigger {
    key?: string;
    keys?: string[];
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
}

export interface HotkeyOptions extends HotkeyTrigger {
    preventDefault?: boolean;
}

export interface ConfigurableHotkeyOptions {
    category: string;
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

    constructor(id: string, callback: Callback, options: ConfigurableHotkeyOptions) {
        this.id = id;
        this.category = options.category;
        this.title = options.title;
        this.preventDefault = options.preventDefault ?? true;
        this.default = options.default;
        this.callback = callback;

        if(hotkeys.savedHotkeys[id]) {
            this.trigger = Object.assign({}, hotkeys.savedHotkeys[id]);
        } else if(this.default) {
            this.trigger = Object.assign({}, this.default);
        }
    }

    reset() {
        this.trigger = Object.assign({}, this.default);
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
    
    addConfigurableHotkey(id: string, options: ConfigurableHotkeyOptions, callback: Callback) {
        let obj = new ConfigurableHotkey(id, callback, options);
        this.configurableHotkeys.push(obj);

        return splicer(this.configurableHotkeys, obj);
    }

    removeConfigurableHotkeys(id: string) {
        for(let i = 0; i < this.configurableHotkeys.length; i++) {
            if(this.configurableHotkeys[i].id === id) {
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
        this.savedHotkeys = {};

        Storage.setValue('configurableHotkeys', this.savedHotkeys);
    }
}

const hotkeys = new Hotkeys();
export default hotkeys;