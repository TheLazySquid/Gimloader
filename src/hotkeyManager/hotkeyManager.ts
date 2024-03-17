import { IHotkey } from "../types";

export default class HotkeyManager {
    hotkeys: Map<Set<string>, IHotkey> = new Map();
    pressedKeys: Set<string> = new Set();

    constructor() {
        window.addEventListener('keydown', (event) => {
            this.pressedKeys.add(event.key.toLowerCase());
            this.checkHotkeys(event);
        });

        window.addEventListener('keyup', (event) => {
            this.pressedKeys.delete(event.key.toLowerCase());
        });
    }

    checkHotkeys(event: KeyboardEvent) {
        for (let [hotkey, run] of this.hotkeys.entries()) {
            if (this.pressedKeys.size < hotkey.size) continue;
            
            let match = true;
            for (let key of hotkey) {
                if (!this.pressedKeys.has(key)) {
                    match = false;
                    break;
                }
            }

            if (match) {
                if(run.preventDefault) event.preventDefault();
                run.callback(event);
            }
        }
    }

    add(hotkey: Set<string>, callback: (event: KeyboardEvent) => void, preventDefault: boolean = true) {
        this.hotkeys.set(hotkey, { callback, preventDefault });
    }

    remove(hotkey: Set<string>) {
        this.hotkeys.delete(hotkey);
    }
}