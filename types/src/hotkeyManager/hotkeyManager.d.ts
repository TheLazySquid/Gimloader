import { IHotkey } from "../types";
export default class HotkeyManager {
    hotkeys: Map<Set<string>, IHotkey>;
    pressedKeys: Set<string>;
    constructor();
    checkHotkeys(event: KeyboardEvent): void;
    add(hotkey: Set<string>, callback: (event: KeyboardEvent) => void, preventDefault?: boolean): void;
    remove(hotkey: Set<string>): void;
}
