import { splicer } from "$content/utils";
import type { ConfigurableHotkeyOptions, HotkeyOptions, HotkeyTrigger } from "$types/hotkeys";
import type { ConfigurableHotkeysState } from "$types/state";
import Port from "$shared/port";

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
    savedHotkeys: ConfigurableHotkeysState;

    init(saved: ConfigurableHotkeysState) {
        this.savedHotkeys = saved;

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

        Port.on('hotkeyUpdate', ({ id, trigger }) => this.updateConfigurable(id, trigger));
        Port.on('hotkeysUpdate', ({ hotkeys }) => this.updateAllConfigurable(hotkeys));
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

    saveConfigurable(id: string, trigger: HotkeyTrigger | null) {
        this.savedHotkeys[id] = trigger;
        Port.send("hotkeyUpdate", { id, trigger });
    }

    saveAllConfigurable() {
        for(let hotkey of this.configurableHotkeys) {
            this.savedHotkeys[hotkey.id] = hotkey.trigger;
        }

        Port.send("hotkeysUpdate", { hotkeys: this.savedHotkeys });
    }

    updateConfigurable(id: string, trigger: HotkeyTrigger | null) {
        let hotkey = this.configurableHotkeys.find(h => h.id === id);
        if(!hotkey) return;
        
        hotkey.trigger = trigger;
    }

    updateAllConfigurable(hotkeys: ConfigurableHotkeysState) {
        this.savedHotkeys = hotkeys;

        for(let id in hotkeys) {
            let existing = this.configurableHotkeys.find(h => h.id === id);
            if(existing && existing.trigger != hotkeys[id]) {
                existing.trigger = hotkeys[id];
            }
        }
    }
}

const hotkeys = new Hotkeys();
export default hotkeys;